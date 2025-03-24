<template>
  <div>
    <h1>VNC Viewer</h1>
    <NoVNCComponent :url="'ws://127.0.0.1:5000/websockify'" :debug="true" />
  </div>
</template>

<script>
import NoVNCComponent from '@/components/NoVNCComponent.vue';

export default {
  components: {
    NoVNCComponent,
  },
};
</script>
