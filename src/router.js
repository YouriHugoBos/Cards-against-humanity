import Vue from 'vue'
import Router from 'vue-router'
import CreateUser from './CreateUser.vue'
import Lobby from './Lobby.vue'
import HostRoom from './components/HostRoom.vue'
import RoomLobby from './components/RoomLobby.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'start',
      component: CreateUser
    },
    {
      path: '/lobby',
      name: 'lobby',
      props: true,
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: Lobby
    },
    {
      path: '/host',
      name: 'host',
      component: HostRoom
    },
    {
      path: '/roomLobby/:name',
      name: 'roomLobby',
      props: true,
      component: RoomLobby
    }
  ]
})
