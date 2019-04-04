<template>
  <v-tooltip bottom>
    <v-btn
      slot="activator"
      fab
      small
      flat
      @click="copyLink()"
      @onmouseout="outFunc()"
    >
      <v-icon> link </v-icon>
    </v-btn>
    <a ref="sharepoint_link" :value="link" target="_blank">
      Sharepoint Link
    </a>
  </v-tooltip>
</template>

<script>
export default {
  name: 'SharepointLink',
  props: {
    link: {
      type: String,
      required: true,
    },
  },
  methods: {
    copyLink() {
      const el = document.createElement('textarea');
      el.value = this.link;
      el.setAttribute('readonly', '');
      el.style.position = 'absolute';
      el.style.left = '-9999px';
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      const tooltip = this.$refs.sharepoint_link;
      tooltip.innerHTML = `Copied: ${el.value}`;
    },
    outFunc() {
      const tooltip = this.$refs.sharepoint_link;
      tooltip.innerHTML = 'Copy sharepoint link';
    },
  },
};
</script>
