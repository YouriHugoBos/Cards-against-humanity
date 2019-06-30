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
        <v-btn :disabled="user.username.length < 1" @click="createUsername" color="secondary"> Confirm! </v-btn>
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
        createUsername() {
            this.$store.dispatch('createUser', this.user.username)
            this.$router.push('/lobby')
        }
    }
}
</script>
