import { $themeBreakpoints } from '@themeConfig'

export default {
  namespaced: true,
  state: {
    windowWidth: 0,
    shallShowOverlay: false,
    selectedBank: null,
    fechaCorte:  null,
    atomo_tipo_corrida: { title: "Tipo de Corrida", value: null },
  },
  getters: {
    getSelectedBank: state => {
      return state.selectedBank
    },
    currentBreakPoint: state => {
      const { windowWidth } = state
      if (windowWidth >= $themeBreakpoints.xl) return 'xl'
      if (windowWidth >= $themeBreakpoints.lg) return 'lg'
      if (windowWidth >= $themeBreakpoints.md) return 'md'
      if (windowWidth >= $themeBreakpoints.sm) return 'sm'
      return 'xs'
    },
    getFechaCorte: state => {
      return state.fechaCorte;
    },
    getBankData: state => {
      return state.bankData;
    },
    getPageTitle: state => {
      return state.pageTitle;
    },
    getAtomoTipoCorrida: state => {
      return state.atomo_tipo_corrida;
    }
  },
  mutations: {
    UPDATE_BANK(state, val) {
      state.selectedBank = val
    },
    UPDATE_BANKDATA(state, val) {
      state.bankData = val
    },
    UPDATE_FRECUENCY(state, val) {
      state.frecuency = val
    },
    UPDATE_PAGETITLE(state, val) {
      state.pageTitle = val
    },
    UPDATE_WINDOW_WIDTH(state, val) {
      state.windowWidth = val
    },
    TOGGLE_OVERLAY(state, val) {
      state.shallShowOverlay = val !== undefined ? val : !state.shallShowOverlay
    },
    UPDATE_FECHA_CORTE: function(state, val){
      state.fechaCorte = val;
    },
    UPDATE_ATOMO_TIPO_CORRIDA: function(state, val){
      state.atomo_tipo_corrida = val;
    },
  },
  actions: {},
}
