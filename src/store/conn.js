import { encode as msgpack, decode as msgunpack } from 'msgpackr'
import { randomBytes } from 'crypto'

import { providers as EthersProviders, utils as EthersUtils } from 'ethers'
import { Mutex } from 'async-mutex'
import EventEmitter from 'eventemitter3'

import * as CONSTANTS from '@/store/constants'

export class WebSocketConn {
  async initialize (provider) {
    this.state = CONSTANTS.STATE_WAITING_CHALLENGE
    this.emitter = new EventEmitter()

    this.provider = new EthersProviders.Web3Provider(provider)
    this.lock = new Mutex()
    this.writeLock = new Mutex()
    this.writeLockRelease = await this.writeLock.acquire()

    await this.provider.send('eth_requestAccounts', [])
    this.signer = this.provider.getSigner()
    this.address = await this.signer.getAddress()
    this.addressBytes = EthersUtils.arrayify(this.address)
    this.initializeSocket()

    this.resolverMap = new Map()

    return this
  }

  initializeSocket () {
    this.ws = new WebSocket(process.env.VUE_APP_WEBSOCKET_URL ?? 'ws://localhost:8000')
    this.ws.binaryType = 'arraybuffer'
    this.ws.addEventListener('open', this.onOpen)
    this.ws.addEventListener('error', this.onClosedOrError)
    this.ws.addEventListener('close', this.onClosedOrError)
    this.ws.addEventListener('message', this.onMessage)
  }

  // returns the ID
  sendMessage (typ, data) {
    const typeBuf = Buffer.alloc(4)
    typeBuf.writeUInt32LE(typ)

    this.ws.send(Buffer.concat([randomBytes(4), typeBuf, msgpack(data)]))
  }

  requestAndWait (typ, data) {
    const rand32bit = randomBytes(4)
    const randUint32 = rand32bit.readUInt32LE()

    const p = new Promise((resolve, reject) => {
      this.resolverMap.set(randUint32, [resolve, reject])
    })

    const typeBuf = Buffer.alloc(4)
    typeBuf.writeUInt32LE(typ)

    this.ws.send(Buffer.concat([rand32bit, typeBuf, msgpack(data)]))
    return p
  }

  onOpen = () => {
    this.sendMessage(CONSTANTS.REQUEST_UNDEFINED, {
      address: this.addressBytes,
      locale: 'en'
    })
  }

  onMessage = async (__data) => {
    const _data = Buffer.from(__data.data)
    const id = _data.readUint32LE(0)
    const data = msgunpack(_data.subarray(5))

    console.log('Received message for', id, ':', data)

    switch (this.state) {
      case CONSTANTS.STATE_WAITING_CHALLENGE: {
        this.challenge = data.challenge
        this.emitter.emit(CONSTANTS.EVENT_INITIALIZATION, data)
        if (data.user_found) {
          await this.signChallenge({})
        }
        break
      }
      case CONSTANTS.STATE_WAITING_RESPONSE: {
        if (!data.logged_in) {
          return
        }
        this.emitter.emit(CONSTANTS.EVENT_WELCOME, data)
        this.state = CONSTANTS.STATE_AUTHENTICATED
        break
      }
      case CONSTANTS.STATE_AUTHENTICATED: {
        const resolverSet = this.resolverMap.get(id)
        if (resolverSet == null) {
          return
        }
        const [resolve, reject] = resolverSet

        if (_data[4] === 0x00) {
          const err = new Error(data[1])
          err.code = data[0]
          reject(err)
        } else if (_data[4] === 0xFF) {
          resolve(data)
        } else {
          console.log('Unrecognized 4th byte, ID:', id, '4th byte:', _data[4], 'Data:', data)
        }
        break
      }
    }
  }

  onClosedOrError = () => {

  }

  async signChallenge (addl) {
    const sig = EthersUtils.arrayify(await this.signer.signMessage(this.challenge))

    this.sendMessage(CONSTANTS.REQUEST_UNDEFINED, {
      signature: sig,
      ...addl
    })
    this.state = CONSTANTS.STATE_WAITING_RESPONSE
  }

  createFeed (feedInfo) {
    return this.requestAndWait(CONSTANTS.REQUEST_ADD_FEED, feedInfo)
  }

  getFeeds (sort) {
    return this.requestAndWait(CONSTANTS.REQUEST_LIST_FEEDS, {
      sort
    })
  }

  editFeed (feedInfo) {
    return this.requestAndWait(CONSTANTS.REQUEST_EDIT_FEED, feedInfo)
  }

  deleteFeed (feed) {
    return this.requestAndWait(CONSTANTS.REQUEST_DELETE_FEED, {
      id: feed.id
    })
  }

  requestEmailVerification (token) {
    return this.requestAndWait(CONSTANTS.REQUEST_EMAIL_VERIFICATION, {
      token: Buffer.from(token, 'hex')
    })
  }

  requestEmailAgain () {
    return this.requestAndWait(CONSTANTS.REQUEST_EMAIL_AGAIN, false)
  }
}
