import Vue from 'vue'
import Vuex from 'vuex'

import room from './modules/room.js'
import player from './modules/player.js'
import debug from './modules/debug.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {

  },
  mutations: {

  },
  actions: {

  },
  modules: {
    room,
    player,
    debug,
  }
})
