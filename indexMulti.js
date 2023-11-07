import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";
import { getDatabase, ref, child, get, set, update, onValue, onDisconnect, push } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js";


const firebaseConfig = {
    apiKey: "AIzaSyBKW6zOBWPF5kAePceZLxEztapp3SqvuI0",
    authDomain: "wordlemultiplayer-7ed5b.firebaseapp.com",
    databaseURL: "https://wordlemultiplayer-7ed5b-default-rtdb.firebaseio.com",
    projectId: "wordlemultiplayer-7ed5b",
    storageBucket: "wordlemultiplayer-7ed5b.appspot.com",
    messagingSenderId: "578962748622",
    appId: "1:578962748622:web:ef95cc5866c9d740d40c9f"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const database = getDatabase(app);


function randomFromArray(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function createName() {
  const firstName = randomFromArray(["Oliver", "Bennet", "Sutter"]);
  const lastName = randomFromArray(["Reynolds", "Rau", "Zolan"]);
  return `${firstName} ${lastName}`;
}

function initGame() {
  signInAnonymously(auth)
      .then((userCredential) => {
          const user = userCredential.user;
          console.log("Anonymous user signed in:", user);
          handleUserAuthentication(user);
      })
      .catch((error) => {
          console.error("Error signing in anonymously:", error);
      });
}

function handleUserAuthentication(user) {
  if (user) {
      const playerId = user.uid;
      const playerRef = ref(database, `players/${playerId}`);
      const name = createName();
      const word = randomFromArray(["hello", "world", "goodbye", "cruel", "world"]);

      // Create a player
      set(playerRef, {
          id: playerId,
          name,
          score: 0,
          word,
          guess: "",
          wordValid: true,
          wordRevealed: false,
          wordRevealedAt: 0,
          wordRevealedBy: ""
      });

      // Set up onDisconnect to remove player data when the user disconnects
      onDisconnect(playerRef).remove();

      console.log("User is signed in:", user);

      // Example usage of game room functions
      const gameRoomRef = createGameRoom();
      //joinGameRoom(gameRoomRef, name);
      listenToGameRoom(gameRoomRef);
  } else {
      // User is signed out, handle sign-out logic here
      console.log("User is signed out");
  }
}

function createGameRoom() {
  const gameRoomRef = ref(database, 'gameRooms/');
  const newGameRoomRef = push(gameRoomRef);

  // Set initial game room data
  set(newGameRoomRef, {
      players: [],
      gameState: 'waiting'
  });

  console.log('New game room created:', newGameRoomRef.key);
  return newGameRoomRef;
}

function joinGameRoom(gameRoomRef, playerName) {
  const newPlayerRef = push(ref(gameRoomRef, 'players'));

  // Set player data
  set(newPlayerRef, {
    name: playerName
  }).then(() => {
    console.log('Player joined game room:', newPlayerRef.key);
  }).catch((error) => {
    console.error('Error joining game room:', error);
  });
}

function listenToGameRoom(gameRoomRef) {
  onValue(gameRoomRef, (snapshot) => {
      const gameRoomData = snapshot.val();
      console.log('Game room data updated:', gameRoomData);
      // Update your game UI or logic based on the new game room data
  });
}

// Initialize the game
initGame();
