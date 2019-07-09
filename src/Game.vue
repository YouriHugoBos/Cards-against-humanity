
<template>
  <div>
      <div class="body-2"> The question is: </div>
      <p class="headline font-weight-light font-italic">"{{blackCard}}"</p>
      <app-submitted-view></app-submitted-view>
      <app-cards v-if="roomState == 'playing'"></app-cards>
      <p class="pa-4 title text-xs-center" v-else> Vote for the best response</p>
  </div>
</template> 
<script>
//  -------------done---------------
// room -> state playing 
// give players cards (firebase get x random white cards, prevent duplicates) -> user state
// select random black card as question for all players -> room state

// player submit a card as awnser (firebase add submitted card to specific room) -> room state hidden
// if all players submitted -> players see all submitted cards -> room state visible
// players vote on eachothers cards not their own and player gets points == votes on his card
// first player to reach x points wins (maybe configurable in room settings)
import Cards from './components/Cards'
import SubmittedView from './components/SubmittedView'

export default {
    methods : {
    },
    computed : {
        blackCard() {
            return this.$store.getters.getBlackCard
        },
        roomState() {
            return this.$store.getters.getRoomState
        }
    },
    components : {
        appCards : Cards,
        appSubmittedView: SubmittedView
    },
    mounted() {
      console.log('route param' ,this.$route.params.id)
      const roomId = this.$route.params.id;
    }
}
</script>
