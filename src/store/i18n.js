import TimeAgo from 'javascript-time-ago'
import DurationUnitFormat from 'intl-unofficial-duration-unit-format'

import TimeAgoEN from 'javascript-time-ago/locale/en-GB.json'
import TimeAgoBN from 'javascript-time-ago/locale/bn.json'

TimeAgo.addLocale(TimeAgoEN)
TimeAgo.addLocale(TimeAgoBN)
TimeAgo.setDefaultLocale('en-GB')

export const i18nStore = {
  namespaced: true,
  state: () => ({
    fullDateFormatter: null,
    dateFormatter: null,
    fullNumberFormatter: null,
    abbreviatedNumFormatter: null,
    timeAgo: null,
    languageFormatter: null,
    collator: null,
    durationFormatter: null
  }),

  mutations: {
    updateState (state, intlLocale) {
      const DTFLocale = window.localStorage.getItem('DTF_OVERRIDE') ?? intlLocale
      const NFLocale = window.localStorage.getItem('NF_OVERRIDE') ?? intlLocale

      state.fullDateFormatter = new Intl.DateTimeFormat(DTFLocale, {
        dateStyle: 'full',
        timeStyle: 'full'
      })
      state.dateFormatter = new Intl.DateTimeFormat(DTFLocale, {
        dateStyle: 'long'
      })
      state.fullNumberFormatter = new Intl.NumberFormat(NFLocale, {
        notation: 'standard'
      })
      state.abbreviatedNumFormatter = new Intl.NumberFormat(NFLocale, {
        notation: 'compact',
        compactDisplay: 'long'
      })
      state.languageFormatter = new Intl.DisplayNames([intlLocale, 'en-US'], {
        type: 'language'
      })
      state.durationFormatter = new DurationUnitFormat(intlLocale, {
        style: DurationUnitFormat.styles.CUSTOM,
        format: '{hour} {minutes} {seconds}'
      })
      state.collator = new Intl.Collator(intlLocale)
      state.timeAgo = new TimeAgo(intlLocale)
    }
  },

  getters: {
    fmtRelative: state => time => {
      return state.timeAgo.format(time)
    },

    fmtDuration: state => dur => {
      return state.durationFormatter.format(dur)
    },

    fmtFullNumber: state => num => {
      return state.fullNumberFormatter.format(num)
    },
    fmtAbbreviatedNum: state => num => {
      return state.abbreviatedNumFormatter.format(num)
    },

    fmtDate: state => dt => {
      return state.dateFormatter.format(dt)
    },

    fmtDateTime: state => dt => {
      return state.fullDateFormatter.format(dt)
    },

    fmtLanguage: state => code => {
      return state.languageFormatter.of(code)
    },

    compare: state => {
      return state.collator.compare
    }
  }
}
