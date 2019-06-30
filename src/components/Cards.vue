<template>
  <div>
    <div class="title">Choose a card!</div>
      <v-layout row>
        <v-flex xs12 sm6 offset-sm3>
          <v-container fluid grid-list-sm>
            <v-layout row wrap>
              <v-flex  v-for="(card,i) in cards" :key="i" xs6>
                <v-card 
                  @click="selectCard(card, i)"
                  v-bind="{dark:i == selected}"
                  min-height="120px">
                  <v-card-title primary-title>
                      <div class="subheading">{{card}}</div>
                  </v-card-title>
                </v-card>   
              </v-flex>
            </v-layout>
          </v-container>
      </v-flex>
    </v-layout>
    <v-flex xs12 sm4 text-xs-center>
        <v-btn :disabled="selected == undefined" color="secondary" @click="submitCard">Submit card!</v-btn>
    </v-flex>
  </div>
</template> 

<script>
export default {
  props: ['cards'],
  data() {
    return {
      selected : undefined,
      currentCard: undefined,
    }
  },
  methods : {
    selectCard(card, i) {
      this.selected = i
      this.currentCard = card
    },
    submitCard(){
      console.log(this.currentCard)
    }
  }
}
</script>
