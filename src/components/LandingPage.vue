<template>
  <h1 class="tw-bg-blue-500 tw-decoration-dashed tw-underline">Landing Page</h1>
  <div class="background-container">
    <h1 class="hero-title">
      Welcome to Mathwhiz!
    </h1>
    <h3>We Gamify Primary School Math</h3>
  </div>
  <div class="min-h-screen bg-gray-100 p-4 sm:p-8">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-3xl sm:text-4xl font-bold text-gray-800 mb-8">Bento Dashboard</h1>
      <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
        <div class="bg-white p-6 rounded-xl shadow-md col-span-2 sm:col-span-4 lg:col-span-3 flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-semibold text-gray-800">Welcome back, User!</h2>
            <p class="text-gray-600 mt-2">Here's what's happening with your projects.</p>
          </div>
          <img src="" alt="User avatar" class="w-16 h-16 sm:w-20 sm:h-20 rounded-full" />
        </div>
      </div>
    </div>
  </div>

</template>

<style>

.hero-title{
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  margin: 0;
  padding: 0;
}

.background-container{
  background-image: linear-gradient(to right, #B7E0FF, #95e3ff);
  /* background-color: #B7E0FF; */
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

</style>

<script setup></script>
