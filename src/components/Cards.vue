<template>
  <div class="cardHolder">
    <div class="title">Choose a card!</div>
      <v-layout row>
        <v-flex xs12 sm6 offset-sm3>
          <v-container fluid grid-list-lg>
            <v-layout row wrap>
              <div class="scrolling-wrapper-flexbox">
              <v-flex  v-for="(card,i) in cards" :key="i" xs6>
                <v-card class="card" @click="selectCard(card, i)" v-bind="{dark:i == selected}" min-height="200px" min-width="150px">
                  <v-card-title primary-title>
                      <div class="subheading">{{card.text}}</div>
                  </v-card-title>
                </v-card>   
              </v-flex>
              </div>
            </v-layout>
          </v-container>
      </v-flex>
    </v-layout>
    <v-flex xs12 sm4 text-xs-center>
        <v-btn :disabled="selected == undefined || user.submitted" color="secondary" @click="submitCard">Submit card!</v-btn>
    </v-flex>
  </div>
</template> 

<script>
export default {
  data() {
    return {
      selected : undefined,
      currentCard: undefined,
    }
  },
  computed : {
    user() {
      return this.$store.getters.getUser
    },
    cards() {
      const cards = this.$store.getters.getPlayerWhiteCards
      console.log(cards);
      if(cards){
        return cards
      }
    },
  },
  methods : {
    selectCard(card, i) {
      if (this.user.submitted) return;

      this.selected = i
      this.currentCard = card
    },
    submitCard(){
      // set submit on true in user en in room -> speler
      // set card name in room -> speler
      // uit eigen speler lijst halen (nieuwe kaart erin stoppen)
      this.selected = undefined;
      this.$store.dispatch('submitCard', this.currentCard)
      this.$store.dispatch('submitCardToRoom', this.currentCard)
    }
  }
}
</script>
<style scoped>
.scrolling-wrapper-flexbox {
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}
.scrolling-wrapper-flexbox::-webkit-scrollbar { 
    display: none; 
}
.scrolling-wrapper-flexbox .card {
  display: inline-block;
}
.cardHolder {
  vertical-align: bottom;
}
</style>
