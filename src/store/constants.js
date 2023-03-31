export const STATE_WAITING_CHALLENGE = 1
export const STATE_WAITING_RESPONSE = 2
export const STATE_AUTHENTICATED = 3

export const EVENT_INITIALIZATION = Symbol('initialization')
export const EVENT_WELCOME = Symbol('welcome')

export const REQUEST_UNDEFINED = (2 ** 32) - 1
export const REQUEST_LIST_FEEDS = 0x0010
export const REQUEST_ADD_FEED = 0x0011
export const REQUEST_EDIT_FEED = 0x0012
export const REQUEST_REMOVE_FEED = 0x0013
export const REQUEST_DELETE_FEED = 0x0014
export const REQUEST_EMAIL_VERIFICATION = 0x0020
export const REQUEST_EMAIL_AGAIN = 0x0021

export const SORT_FEED_NEWEST = 0x0
export const SORT_FEED_OLDEST = 0x1
export const SORT_FEED_NEWEST_FETCH = 0x2
export const SORT_FEED_OLDEST_FETCH = 0x3
