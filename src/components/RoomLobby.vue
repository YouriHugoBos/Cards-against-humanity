<template>
  <div>
    <h1>Room name: {{room.name}}</h1>
    <hr>
    <h3>Current players:</h3>
    <v-container grid-list-xs>
        <v-layout wrap>
          <v-flex :key="player.id" v-for="player in room.players" xs6>
            <v-sheet
              class="d-flex"
              color="secondary"
              height="50"
            >
            <p style="margin: auto" class="white--text text-xs-center">{{ player.username }}</p>
            </v-sheet>
          </v-flex>
        </v-layout>
        <v-btn color="secondary" @click="startGame">Start game!</v-btn>
    </v-container>
  </div>
</template>
<script>
export default {
    data() {
        return {
          roomId : this.id,
          colors: [
            'yellow lighten-3',
            'blue lighten-2',
            'red lighten-2',
            'grey lighten-2',
            'orange lighten-3',
            'green lighten-2'
          ]
        }
    },
    methods : {
      loadPlayers() {
        this.$store.dispatch('getPlayersInRoom', this.roomId)
      },
      startGame() {
        this.$store.dispatch('startGame');
      },
    },
    computed : {
      players() {
        return this.$store.getters.getPlayers;
      },
      room() {
        return this.$store.getters.getRoom;
      },
    },
    mounted() {
      const roomId = this.$route.params.id;
      this.$store.dispatch('fetchRoom', roomId);
    }
}
</script>
