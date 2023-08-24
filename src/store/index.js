import { createStore } from 'vuex'

export default createStore({
  state(){
    return {
      sliderValue: [0,0]
    }
  },
  getters: {
  },
  mutations: {
    changeSliderValue(state, payload){
      state.sliderValue = payload
    }
  },
  actions: {
  },
  modules: {
  }
})
