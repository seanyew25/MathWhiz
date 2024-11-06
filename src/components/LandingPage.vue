<template>
  <!-- <h1 class="tw-bg-blue-500 tw-decoration-dashed tw-underline">Landing Page</h1> -->
  <div class="video-container">
    <video autoplay muted loop>
      <source src="../media/final_background_video.mp4" type="video/mp4">
    </video>
    <h1 class="text-over-video tw-text-6xl tw-font-bold tw-text-white-600">
        Welcome to Mathwhiz!
    </h1>
  </div>
  <div class="background-container">
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
        <div class="tw-bg-white tw-p-6 tw-rounded-xl tw-shadow-md tw-col-span-2 tw-sm:col-span-4 tw-lg:col-span-3 tw-row-span-2">
          <h3 class="tw-text-xl tw-font-semibold tw-text-gray-800 tw-mb-4">Weekly Activity</h3>
          <div class="tw-h-64 tw-flex tw-items-end tw-justify-between">
            <div v-for="day in ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']" :key="day" class="w-1/7">
              <div 
                class="tw-bg-indigo-500 tw-rounded-t"
                :style="{ height: `${Math.random() * 100}%` }"
              ></div>
              <p class="tw-text-xs tw-text-center tw-mt-2 tw-text-gray-600">{{ day }}</p>
            </div>
          </div>
        </div>

        <!-- Tasks Card -->
        <div class="tw-bg-white tw-p-6 tw-rounded-xl tw-shadow-md tw-col-span-2 tw-lg:col-span-3">
          <h3 class="tw-text-xl tw-font-semibold tw-text-gray-800 tw-mb-4">Recent Tasks</h3>
          <ul class="tw-space-y-3">
            <li v-for="task in ['Design new landing page', 'Fix navigation bug', 'Update user profile', 'Optimize database queries']" :key="task" class="tw-flex tw-items-center">
              <span class="tw-w-3 tw-h-3 tw-bg-indigo-500 tw-rounded-full tw-mr-3"></span>
              <span class="tw-text-gray-700">{{ task }}</span>
            </li>
          </ul>
        </div>

        <!-- Calendar Card -->
        <div class="tw-bg-white tw-p-6 tw-rounded-xl tw-shadow-md tw-col-span-2 tw-sm:col-span-4 tw-lg:col-span-2 tw-row-span-2">
          <h3 class="tw-text-xl tw-font-semibold tw-text-gray-800 tw-mb-4">Upcoming Deadlines</h3>
          <div class="tw-grid tw-grid-cols-7 tw-gap-2 tw-text-center">
            <div v-for="day in ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']" :key="day" class="tw-text-xs tw-font-semibold tw-text-gray-600">
              {{ day }}
            </div>
            <div v-for="date in 31" :key="date" 
                 :class="[
                   'tw-p-2 tw-rounded-full tw-text-sm',
                   date === 15 ? 'tw-bg-indigo-600 tw-text-white' : 'tw-hover:bg-gray-100'
                 ]">
              {{ date }}
            </div>
          </div>
        </div>

        <!-- Notes Card -->
        <div class="tw-bg-yellow-100 tw-p-6 tw-rounded-xl tw-shadow-md tw-col-span-2 tw-lg:col-span-1">
          <h3 class="tw-text-xl tw-font-semibold tw-text-gray-800 tw-mb-4">Quick Notes</h3>
          <textarea 
            class="tw-w-full tw-h-32 tw-bg-yellow-50 tw-border-yellow-200 tw-rounded tw-p-2 tw-text-sm"
            placeholder="Type your notes here..."
          ></textarea>
        </div>

        <!-- Project Progress Card -->
        <div class="tw-bg-green-100 tw-p-6 tw-rounded-xl tw-shadow-md tw-col-span-2 tw-lg:col-span-1">
          <h3 class="tw-text-xl tw-font-semibold tw-text-gray-800 tw-mb-4">Project Progress</h3>
          <div class="tw-space-y-4">
            <div v-for="project in ['Website Redesign', 'Mobile App', 'API Integration']" :key="project">
              <div class="tw-flex tw-justify-between tw-text-sm tw-text-gray-600 tw-mb-1">
                <span>{{ project }}</span>
                <span>{{ Math.floor(Math.random() * 100) }}%</span>
              </div>
              <div class="tw-w-full tw-bg-green-200 tw-rounded-full tw-h-2">
                <div class="tw-bg-green-500 tw-h-2 tw-rounded-full" :style="{ width: `${Math.random() * 100}%` }"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Team Card -->
        <div class="tw-bg-purple-100 tw-p-6 tw-rounded-xl tw-shadow-md tw-col-span-2 tw-lg:col-span-2">
          <h3 class="tw-text-xl tw-font-semibold tw-text-gray-800 tw-mb-4">Team Members</h3>
          <div class="tw-flex tw-flex-wrap tw-m-1">
            <div v-for="n in 5" :key="n" class="m-1">
            </div>
            <div class="tw-w-10 tw-h-10 tw-bg-purple-200 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-m-1">
              <span class="tw-text-purple-600 tw-font-semibold">+3</span>
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
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

.background-container{
  background-image: linear-gradient(to right, #B7E0FF, #95e3ff);
  /* background-color: #B7E0FF; */
  min-height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.text-over-video {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  text-align: center;
}

.video-container {
  position: relative;
  top: 0;
  bottom: 0;
  width: 100%;
  height: 100%; 
  overflow: hidden;
  margin: 0;
}

video {
  /* Make video to at least 100% wide and tall */
  min-width: 100%; 
  min-height: 100%; 

  /* Setting width & height to auto prevents the browser from stretching or squishing the video */
  width: auto;
  height: auto;

  opacity: 0.5;

  z-index: -2;
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
