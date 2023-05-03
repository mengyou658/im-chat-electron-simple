import { createApp } from 'vue'
import App from './App.vue'
// css
import "./assets/css/common.less"
import "viewerjs/dist/viewer.css";
import './assets/style/variables.less'

import VueViewer from "v-viewer";
import router from "./router";
import store from './store'
import commom from "./common/common.js"

let options = {
  defaultOptions: {
    zIndex: 99999,
    'title': false, 'toolbar': false,
  }
}

import {
  // create naive ui
  create,
  // component
  NButton,
  NScrollbar,
  NCollapseTransition,
  NTooltip,
  NMessageProvider,
  NSpin,
  NBadge,
  NAvatar,
  NSwitch,
  NResult,
  NModal
} from 'naive-ui'

const naive = create({
  components: [NButton, NScrollbar, NCollapseTransition, NTooltip, NMessageProvider, NSpin, NBadge, NAvatar, NSwitch, NResult, NModal]
})

const app = createApp(App)
app.config.globalProperties.$commom = commom;

app.use(naive).use(VueViewer, options).use(router).use(store).mount('#app')
