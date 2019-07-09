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
    <v-footer app>
      <v-fab-transition v-if="debug">
        <v-btn color="secondary" dark absolute top right fab @click="clearDatabase">
          <v-icon>delete</v-icon>
        </v-btn>
      </v-fab-transition>
    </v-footer>
  </v-app>
</template>
<script>
  import Toolbar from '@/components/Toolbar.vue'

  export default {
    components: {
      appToolbar: Toolbar
    },
    data() {
      return {
        debug: true,
      };
    },
    mounted() {
      this.$store.dispatch('fetchUser');
      this.$store.dispatch('fetchWhiteCards');
      this.$store.dispatch('fetchBlackCards');
    },
    methods: {
      clearDatabase() {
        if (!this.debug) return;

        this.$store.dispatch('clearDatabase');
      }
    }
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
