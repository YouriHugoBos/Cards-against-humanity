<template>
  <div class="hello">
    <h1>Your Cards</h1>
    <button @click="loadCards">load</button>
  </div>
</template>

<script>
export default {
  methods : {
    loadCards() {
      this.$http.get('whiteCards.json/')
        .then(response => {
          return response.json()
        })
        .then(data => {
          console.log(data)
        })
    }
  }
}
</script>
