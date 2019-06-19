
import firebase from 'firebase'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAG07Sr9OzUc-rVJitwnQ1ZvRY97GHzrcM',
  authDomain: 'vuejs-couse-http.firebaseapp.com',
  databaseURL: 'https://vuejs-couse-http.firebaseio.com',
  projectId: 'vuejs-couse-http',
  storageBucket: 'vuejs-couse-http.appspot.com',
  messagingSenderId: '1069209526949',
  appId: '1:1069209526949:web:733ac7efbd90da6e'
}
// Initialize Firebase
firebase.initializeApp(firebaseConfig)

export default firebase.database()
