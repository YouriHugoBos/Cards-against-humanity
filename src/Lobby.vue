<template>
  <div>
    <div>
      <h1 class="display-2">Hi! {{username}}</h1>
      <hr>
      <br><br>
      <h1>Join or <v-btn color="secondary" @click="hostRoom">Host a room</v-btn> </h1> 
        <p>Current Rooms: </p>
        <hr>
        <v-container grid-list-xl>
          <v-layout row wrap>
            <v-flex xs4 :key="room.id" v-for="room in rooms">
              <v-card @click="joinRoom(room)" style="cursor: pointer" dark >
                <v-card-text :disabled="room.gameState == 'PLAYING'" >{{room.name}}</v-card-text>
              </v-card>
            </v-flex>
          </v-layout>
      </v-container>
    </div>
  </div>
</template>

<script>
export default {
  computed : {
    username() {
      return this.$store.getters.getUsername;
    },
    rooms() {
      return this.$store.getters.getRooms;
    }
  },
  methods : {
    hostRoom() {
      this.$router.push({name: 'host'})
    },
    loadRooms() {
      this.$store.dispatch('getRooms')
    },
    joinRoom(room) {
      this.$store.dispatch('userJoinRoom', room)
    }
  },
  created() {
    this.loadRooms();
  }
}
</script>
