import Vue from 'vue';
import VueRouter from 'vue-router';

// Import components (pages) to navigate between
import HomePage from './components/index.vue';
import PdfPage from './components/readPdf.vue';


Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage
  },
  {
    path: '/',
    name: 'readPdf',
    component: PdfPage
  }
];

const router = new VueRouter({
  routes, // Short for `routes: routes`
  mode: 'history' // To remove hash (#) in URL
});

export default router;