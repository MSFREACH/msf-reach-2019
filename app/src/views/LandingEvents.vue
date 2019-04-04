<template>
  <div class="landing-events">
    <EventList status="active" />
  </div>
</template>
<script>
import EventList from '@/components/EventList';

export default {
  name: 'RLandingEvents',
  components: {
    EventList
  }
};
</script>
