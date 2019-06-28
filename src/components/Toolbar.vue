<template>
  <v-card color="#FAFAFA" light >
      <v-layout row child-flex wrap>
        <div>
          <v-toolbar> 
            <v-toolbar-title>Cards against</v-toolbar-title>
          </v-toolbar>
        </div>
        <div>
          <v-toolbar dark>
            <v-toolbar-title>Humanity</v-toolbar-title>
          </v-toolbar>
        </div>
      </v-layout>
  </v-card>
</template>

<script>
export default {
  methods : {
    navigateHome() {
       this.$route.go({name:'start'})
    }
  }
}
</script>
