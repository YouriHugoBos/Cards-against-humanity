<template>
  <div>
    <h1>Room name: {{}}</h1>
    <hr>
    <h6>Current players: </h6>
  </div>
</template>
<script>
export default {
    data() {
        return {
        }
    },
    computed : {
        players() {
            this.$store.getters.roomPlayers()
        }
    }
}
</script>
