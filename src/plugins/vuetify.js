import Vue from "vue";
import Vuetify from "vuetify/lib/framework";

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: "mdiSvg"
  },
  theme: {
    themes: {
      light: {
        primary: "#1976D2"
      },
      dark: {
        primary: "#1976D2",
        background: "#212121"
      }
    }
  }
});
