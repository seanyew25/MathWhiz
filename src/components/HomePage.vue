<template>
    <div class="homepage">
      <h1 class="title">Math Adventure Land</h1>
      <button @click="openModal" class="login-button">Login</button>
  
      <div v-if="showModal" class="modal">
        <div class="modal-content">
          <span class="close" @click="closeModal">&times;</span>
          <h2>Login</h2>
          <form @submit.prevent="handleLogin">
            <div class="form-group">
              <label for="email">Email:</label>
              <input type="email" id="email" v-model="email" required placeholder="Enter your email">
            </div>
            <div class="form-group">
              <label for="password">Password:</label>
              <input type="password" id="password" v-model="password" required placeholder="Enter your password">
            </div>
            <button type="submit" class="submit-button">Submit</button>
          </form>
          <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
  
  const showModal = ref(false)
  const email = ref('')
  const password = ref('')
  const errorMessage = ref('')
  const auth = getAuth()
  
  const openModal = () => {
    showModal.value = true
    errorMessage.value = ''
  }
  
  const closeModal = () => {
    showModal.value = false
    email.value = ''
    password.value = ''
    errorMessage.value = ''
  }
  
  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email.value, password.value)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user
        console.log("You're logged in", user)
        closeModal()
        // Here you can add logic to redirect the user or update the UI
      })
      .catch((error) => {
        const errorCode = error.code
        errorMessage.value = error.message
        console.error("Login error:", errorCode, errorMessage.value)
      })
  }
  
  onMounted(() => {
    // Any initialization logic can go here
  })
  </script>
  
  <style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Comic+Neue:wght@700&display=swap');
  
  body {
    font-family: 'Comic Neue', cursive;
    margin: 0;
    padding: 0;
  }
  
  .homepage {
    min-height: 100vh;
    background-image: linear-gradient(to bottom right, #bfdbfe, #e9d5ff);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  
  .title {
    font-size: 3rem;
    font-weight: 700;
    text-align: center;
    color: #7c3aed;
    animation: bounce 1s infinite;
    margin-bottom: 2rem;
  }
  
  .login-button {
    background-color: #4caf50;
    border: none;
    color: white;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    cursor: pointer;
    border-radius: 12px;
    transition: background-color 0.3s;
  }
  
  .login-button:hover {
    background-color: #45a049;
  }
  
  .modal {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.4);
  }
  
  .modal-content {
    background-color: #fefefe;
    padding: 20px;
    border-radius: 15px;
    width: 300px;
    max-width: 80%;
  }
  
  .close {
    color: #aaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
    cursor: pointer;
  }
  
  .close:hover,
  .close:focus {
    color: #000;
    text-decoration: none;
    cursor: pointer;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 5px;
  }
  
  .form-group input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  
  .submit-button {
    background-color: #4caf50;
    color: white;
    padding: 10px 15px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .submit-button:hover {
    background-color: #45a049;
  }
  
  .error-message {
    color: #da2e2e;
    margin-top: 10px;
  }
  
  @keyframes bounce {
    0%, 100% {
      transform: translateY(-25%);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    50% {
      transform: translateY(0);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
  }
  
  @media (min-width: 768px) {
    .title {
      font-size: 4.5rem;
    }
  }
  </style>