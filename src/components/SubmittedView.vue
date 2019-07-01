<template>
    <v-list subheader three-line>
        <v-list-tile v-for="player in room.players" :key="player.id">
            <v-list-tile-content>
                <v-list-tile-title>{{ player.username }} </v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action>
                <v-checkbox
                    readonly
                    :input-value="player.submitted"
                >Submitted</v-checkbox>
            </v-list-tile-action>
        </v-list-tile>
    </v-list>
</template>
<script>
export default {
    computed : {
        room() {
            return this.$store.getters.getRoom
            console.log(room.gameState)
        }
    }
}
</script>
