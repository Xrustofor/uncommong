export default {
  methods: {
    fbTrack(action = 'Purchase', data) {

      if(!this.$gtm.enabled()) return;

      fbq('track', 'Purchase', data);

      switch(action){
        case 'ViewContent': {
          break
        };
        case 'Purchase' : {
          break;
        };
        case 'Search' : {
          break;
        };
        case 'Lead' : {
          break;
        }
      }

    }
  }
}