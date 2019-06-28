<template>
  <div>
    <h1>Host a room!</h1>
    <v-form
        ref="form"
        v-model="valid"
        lazy-validation
    >
        <v-text-field
        v-model="name"
        :counter="15"
        :rules="nameRules"
        label="Room name"
        required
        ></v-text-field>

        <v-select
        v-model="maxPlayers"
        :items="maxPlayerCountOptions"
        :rules="[v => !!v || 'Item is required']"
        label="Max players"
        required
        ></v-select>

        <v-btn
        :disabled="!maxPlayers || !name"
        color="success"
        @click="hostRoom(maxPlayers, name)"
        >
        Host!
        </v-btn>
    </v-form>
  </div>
</template>
<script>
export default {
    data() {
        return {
            valid: true,
            name: '',
            maxPlayerCountOptions : [
                3, 4, 5, 6
            ],
            nameRules: [
                v => !!v || 'Name is required',
                v => (v && v.length <= 15) || 'Name must be less than 10 characters'
            ],
            maxPlayers : undefined,
            username : this.$store.getters.getUsername,
        } 
    },
    methods : { 
        hostRoom() {
            this.$store.dispatch('createRoom' , {name : this.name, player: this.username, max : this.maxPlayers}).then(() => {
                this.$router.push({name: 'roomLobby', params: {id : this.name}, props: {roomId : this.playerRoomId}})
            })
        }
    },
}
</script>
