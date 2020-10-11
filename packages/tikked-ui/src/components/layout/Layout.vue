<template>
  <Topbar />

  <div class="flex justify-center">
    <div class="max-w-screen-md w-full">
      <slot />
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
