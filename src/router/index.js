import Vue from 'vue'
import VueRouter from 'vue-router'

import FeedList from '@/views/FeedList'
import CreateFeed from '@/views/CreateFeed'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'FeedList',
    component: FeedList
  },
  {
    path: '/feed/create',
    name: 'CreateFeed',
    component: CreateFeed
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
