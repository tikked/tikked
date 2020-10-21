<template>
  <Topbar />

  <div class="flex justify-center">
    <div class="max-w-screen-lg w-full">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import Topbar from '@/components/layout/Topbar';

export default {
  components: {
    Topbar
  }
};
</script>
