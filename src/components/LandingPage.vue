<template>
  <!-- <h1 class="tw-bg-blue-500 tw-decoration-dashed tw-underline">Landing Page</h1> -->
  <div class="video-container">
    <video autoplay muted loop>
      <source src="../media/mathwhiz_background_video.mp4" type="video/mp4">
    </video>
  </div>
  <div class="background-container">
    <h1 class="hero-title">
      Welcome to Mathwhiz!
    </h1>
    <h3>We Gamify Primary School Math</h3>
  </div>
  <div class="tw-min-h-screen tw-bg-gray-100 tw-p-4 tw-sm:p-8">
    <div class="tw-max-w-7xl tw-mx-auto">
      <h1 class="tw-text-3xl tw-sm:text-4xl tw-font-bold tw-text-gray-800 tw-mb-8">Bento Dashboard</h1>
      <div class="tw-grid tw-grid-cols-2 tw-sm:grid-cols-4 tw-lg:grid-cols-6 tw-gap-4 tw-sm:gap-6">
        <!-- Welcome Card -->
        <div class="tw-bg-white tw-p-6 tw-rounded-xl tw-shadow-md tw-col-span-2 tw-sm:col-span-4 tw-lg:col-span-3 tw-flex tw-items-center tw-justify-between">
          <div>
            <h2 class="tw-text-2xl tw-font-semibold tw-text-gray-800">Welcome back, User!</h2>
            <p class="tw-text-gray-600 tw-mt-2">Here's what's happening with your projects.</p>
          </div>
        </div>

        <!-- Stats Card -->
        <div class="tw-bg-indigo-600 tw-p-6 tw-rounded-xl tw-shadow-md tw-text-white tw-col-span-2 tw-lg:col-span-3">
          <h3 class="tw-text-xl tw-font-semibold tw-mb-4">Quick Stats</h3>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-2xl font-bold">28</p>
              <p class="text-sm opacity-80">Active Projects</p>
            </div>
            <div>
              <p class="text-2xl font-bold">5.2k</p>
              <p class="text-sm opacity-80">Total Tasks</p>
            </div>
            <div>
              <p class="text-2xl font-bold">18</p>
              <p class="text-sm opacity-80">Team Members</p>
            </div>
            <div>
              <p class="text-2xl font-bold">92%</p>
              <p class="text-sm opacity-80">Task Completion</p>
            </div>
          </div>
        </div>

        <!-- Chart Card -->
        <div class="bg-white p-6 rounded-xl shadow-md col-span-2 sm:col-span-4 lg:col-span-3 row-span-2">
          <h3 class="text-xl font-semibold text-gray-800 mb-4">Weekly Activity</h3>
          <div class="h-64 flex items-end justify-between">
            <div v-for="day in ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']" :key="day" class="w-1/7">
              <div 
                class="bg-indigo-500 rounded-t"
                :style="{ height: `${Math.random() * 100}%` }"
              ></div>
              <p class="text-xs text-center mt-2 text-gray-600">{{ day }}</p>
            </div>
          </div>
        </div>

        <!-- Tasks Card -->
        <div class="bg-white p-6 rounded-xl shadow-md col-span-2 lg:col-span-3">
          <h3 class="text-xl font-semibold text-gray-800 mb-4">Recent Tasks</h3>
          <ul class="space-y-3">
            <li v-for="task in ['Design new landing page', 'Fix navigation bug', 'Update user profile', 'Optimize database queries']" :key="task" class="flex items-center">
              <span class="w-3 h-3 bg-indigo-500 rounded-full mr-3"></span>
              <span class="text-gray-700">{{ task }}</span>
            </li>
          </ul>
        </div>

        <!-- Calendar Card -->
        <div class="bg-white p-6 rounded-xl shadow-md col-span-2 sm:col-span-4 lg:col-span-2 row-span-2">
          <h3 class="text-xl font-semibold text-gray-800 mb-4">Upcoming Deadlines</h3>
          <div class="grid grid-cols-7 gap-2 text-center">
            <div v-for="day in ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']" :key="day" class="text-xs font-semibold text-gray-600">
              {{ day }}
            </div>
            <div v-for="date in 31" :key="date" 
                 :class="[
                   'p-2 rounded-full text-sm',
                   date === 15 ? 'bg-indigo-600 text-white' : 'hover:bg-gray-100'
                 ]">
              {{ date }}
            </div>
          </div>
        </div>

        <!-- Notes Card -->
        <div class="bg-yellow-100 p-6 rounded-xl shadow-md col-span-2 lg:col-span-1">
          <h3 class="text-xl font-semibold text-gray-800 mb-4">Quick Notes</h3>
          <textarea 
            class="w-full h-32 bg-yellow-50 border-yellow-200 rounded p-2 text-sm"
            placeholder="Type your notes here..."
          ></textarea>
        </div>

        <!-- Project Progress Card -->
        <div class="bg-green-100 p-6 rounded-xl shadow-md col-span-2 lg:col-span-1">
          <h3 class="text-xl font-semibold text-gray-800 mb-4">Project Progress</h3>
          <div class="space-y-4">
            <div v-for="project in ['Website Redesign', 'Mobile App', 'API Integration']" :key="project">
              <div class="flex justify-between text-sm text-gray-600 mb-1">
                <span>{{ project }}</span>
                <span>{{ Math.floor(Math.random() * 100) }}%</span>
              </div>
              <div class="w-full bg-green-200 rounded-full h-2">
                <div class="bg-green-500 h-2 rounded-full" :style="{ width: `${Math.random() * 100}%` }"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Team Card -->
        <div class="bg-purple-100 p-6 rounded-xl shadow-md col-span-2 lg:col-span-2">
          <h3 class="text-xl font-semibold text-gray-800 mb-4">Team Members</h3>
          <div class="flex flex-wrap -m-1">
            <div v-for="n in 5" :key="n" class="m-1">
            </div>
            <div class="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center m-1">
              <span class="text-purple-600 font-semibold">+3</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>

</template>

<style>
:root {
  --tw-content: '';
}

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

.video-container { 
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  right: 0;
  bottom: 0;
  min-width: 100vw; 
  max-width: none;
  min-height: 100vh;
}

</style>

<script setup>
import { ref } from 'vue'

// Tailwind CSS in JS
const tailwindCSS = ref(`
@tailwind base;
@tailwind components;
@tailwind utilities;
`)
</script>
