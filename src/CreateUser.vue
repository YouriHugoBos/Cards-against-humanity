<template>
    <div>
        <h2 class="title">Enter a username!</h2>
        <v-form>
            <v-container>
                <v-text-field
                v-model="user.username"
                label="Username"
                solo-inverted
                ></v-text-field>
            </v-container>
        </v-form>
        <v-btn @click="createUsername" color="secondary"> Confirm! </v-btn>
    </div>
</template>

<script>
import {mapActions} from 'vuex'

export default {
    data() {
        return {
            user : {
                username: ''
            }
        }
    },
    methods: {
        ...mapActions([
            'insertUsername'
        ]),
        createUsername() {
            this.$store.dispatch('insertUsername', this.user.username)
            this.$router.push({name : 'lobby', params : { username : this.user.username }})
        }
    }
}
</script>
