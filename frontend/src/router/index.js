import { createWebHistory, createRouter } from 'vue-router';
import Home from '@/views/Home.vue';
import Login from '@/views/Login.vue';
import UserCenter from '@/views/UserCenter.vue';
import Signup from '@/views/Signup.vue';
import FailureModeDetail from '@/components/user/FailureModeDetail.vue';
import FailureModeList from '@/components/user/FailureModeList.vue';
import FmeaOverview from '@/components/user/FmeaOverview.vue';
import NotFound from '@/views/NotFound.vue';
import UserWelcome from '@/components/user/UserWelcome.vue';
import FailureModeCreation from '@/components/user/FailureModeCreation.vue';
import AdminCenter from '@/views/AdminCenter.vue';
import AdminWelcome from '@/components/admin/AdminWelcome.vue';
import FailureModeEdition from '@/components/admin/FailureModeEdition.vue';
import NewFailureModeList from '@/components/admin/NewFailureModeList.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: '/signup',
    name: 'signup',
    component: Signup,
  },
  {
    path: '/admin/:username',
    component: AdminCenter,
    children: [
      {
        path: '',
        name: 'admin-landing',
        component: AdminWelcome,
      },
      {
        path: 'new-fms',
        name: 'new-fms',
        component: NewFailureModeList,
      },
      {
        path: 'fm-edit/:id(\\d+)', // /1, /2, ...
        name: 'fm-edit',
        component: FailureModeEdition,
      },
    ],
  },
  // user
  {
    path: '/user/:username',
    component: UserCenter,
    children: [
      {
        path: '',
        name: 'user-landing',
        component: UserWelcome,
      },
      {
        path: 'fm-list',
        name: 'fm-list',
        component: FailureModeList,
      },
      {
        path: 'fm-detail/:process_ids(\\d+)*', // /1, /1/2
        name: 'fm-detail',
        component: FailureModeDetail,
      },
      {
        path: 'fm-create',
        name: 'fm-create',
        component: FailureModeCreation,
      },
      {
        path: 'fmea',
        name: 'fmea',
        component: FmeaOverview,
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
