import Vue from 'vue'
import VueRouter from 'vue-router'

import FeedList from '@/views/FeedList'
import CreateFeed from '@/views/CreateFeed'
import VerifyEmail from '@/views/VerifyEmail'

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
  },
  {
    path: '/verify/email',
    name: 'VerifyEmail',
    component: VerifyEmail
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
