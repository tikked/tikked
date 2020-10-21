<template>
  <div class="w-full sticky h-topbar shadow-md mb-4 bg-white">
    <div class="max-w-screen-lg flex mx-auto h-full">
      <div class="flex-auto py-2">
        <router-link to="/" class="flex flex-row items-center h-full">
          <img src="@/assets/images/logo.png" class="h-full max-h-full" />
          <span class="ml-2 text-lg">Tikked</span>
        </router-link>
      </div>

      <div class="flex-1 flex-grow-0 flex items-center">
        <router-link to="/about">About</router-link>
      </div>
    </div>
  </div>
</template>
