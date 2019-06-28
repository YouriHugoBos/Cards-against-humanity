<template>
  <v-app>
    <app-toolbar />
    <v-content>
      <v-container fluid>
        <router-view></router-view>
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

