<template>
  <v-card color="#FAFAFA" light >
      <v-layout row child-flex wrap>
        <div>
          <v-toolbar> 
            <v-btn @click="navigateBack" icon>
              <v-icon>arrow_back</v-icon>
            </v-btn>
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
    },
    navigateBack() {
        this.$router.back()
    }
  }
}
</script>
