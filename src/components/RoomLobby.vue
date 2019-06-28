<template>
  <div>
    <h1>Room name: {{name}}</h1>
    <hr>
    <h3>Current players:</h3>
    <v-container grid-list-xs>
        <v-layout wrap>
          <v-flex :key="player.name" v-for="player in players" xs6>
            <v-sheet
              class="d-flex"
              :class="colors[Math.floor(Math.random() * colors.length)]"
              height="50"
            >
              <sheet-footer>
                {{player}}
              </sheet-footer>
            </v-sheet>
          </v-flex>
        </v-layout>
    </v-container>
    <p >{{player}}</p>
  </div>
</template>
<script>
export default {
    props: ['id', 'name'],
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
    },
    computed : {
      players() {
        return this.$store.getters.getPlayers;
      }
    },
    created() {
      this.loadPlayers()
    }
}
</script>
