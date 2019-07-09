<template>
    <v-list dense style="background: #FAFAFA">
        <p v-if="!allSubmitted">Waiting for players to submit cards: {{submittedAmount}} / {{room.players.length}}</p>
        <p v-else> Everyone submitted their card, choose the best card! </p>
        <div v-if="!voted" >
            <div v-show="allSubmitted && !voted" v-for="player in room.players" :key="player.id">
                <v-checkbox @click="votePlayer(player)" visible :label="`${allSubmitted ? player.card : undefined}`" ></v-checkbox>
            </div>
        </div>
        <div v-else>
            <h3 class="subheader"> You voted for: <b>{{votedPlayer.username}} </b> </h3>
            <br>
            <p>with card: {{votedPlayer.card}}</p>
            <div  class="pa-6">

            <h2> Score </h2>
            <p :key="player" v-for="player in players">
                {{player.username}} : {{player.score}}
            </p>
            <h3>Waiting for players to vote...</h3>
            </div>
        </div>
    </v-list>
</template>
<script>
export default {
    data () {
        return {
            allSubmitted: false,
            voted: false,
            votedPlayer: {
                card : undefined,
                username : undefined
            }
        }
    },
    computed : {
        room() {
            return this.$store.getters.getRoom
        },
        submittedAmount () {
            let submittedAmount = 0;
            for(var player in this.room.players) {
                if(this.room.players[player].submitted){
                    submittedAmount += 1;
                }
            }
            if(this.room.players.length == submittedAmount) {
                this.allSubmitted = true
            }
            return submittedAmount
        },
        players() {
            return this.$store.getters.getPlayers
        }
    },
    methods: {
        votePlayer(player) {
            this.votedPlayer = { username: player.username, card: player.card }
            this.voted = true
            this.$store.dispatch('votePlayer', player)
        }
    }
}
</script>
