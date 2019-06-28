<template>
  <v-app>
    <app-toolbar />
    <v-content>
      <v-container fluid>
      <transition
        name="fade"
        mode="out-in"
      >
        <router-view></router-view>
      </transition>
      </v-container> 
    </v-content>
    <v-footer app></v-footer>
  </v-app>
</template>
<script>
  import Toolbar from '@/components/Toolbar.vue'
export default {
  components: {
    appToolbar: Toolbar
  },
}
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition-duration: 0.3s;
  transition-property: opacity;
  transition-timing-function: ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0
}
</style>
