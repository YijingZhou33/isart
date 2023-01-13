import { createApp } from 'vue';
import App from '@/App.vue';

// style
import '@/assets/css/index.css';
import 'element-plus/theme-chalk/display.css';

// element-plus
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

// font awesome icon
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import {
  faEnvelope,
  faBars,
  faXmark,
  faMagnifyingGlass,
  faFile,
  faUserPen,
  faUser,
  faHome,
  faEdit,
  faArrowRight,
  faCircleInfo,
  faLightbulb,
  faUpRightFromSquare,
  faUserGear,
  faToggleOn,
  faFilter,
  faListCheck,
  faOutdent,
  faBookBookmark,
  faComments,
  faHouse,
  faFolderPlus,
} from '@fortawesome/free-solid-svg-icons';

library.add(
  faEnvelope,
  faBars,
  faXmark,
  faMagnifyingGlass,
  faFile,
  faUserPen,
  faUser,
  faHome,
  faEdit,
  faArrowRight,
  faCircleInfo,
  faLightbulb,
  faUpRightFromSquare,
  faUserGear,
  faToggleOn,
  faFilter,
  faListCheck,
  faOutdent,
  faBookBookmark,
  faComments,
  faHouse,
  faFolderPlus
);

// router
import router from './router';
const app = createApp(App);

app.use(ElementPlus).use(router).component('font-awesome-icon', FontAwesomeIcon).mount('#app');
