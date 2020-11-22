import Vue from 'vue'
import VueRouter from 'vue-router'
import widgets from '../components/views/widgets';
import skills from '../components/views/skills';
import scenarios from '../components/views/scenarios';
import login from '../components/views/login';
import admin from '../components/views/admin';

Vue.use(VueRouter)

const routes = [
	{
		path: '/',
		name: 'Home',
		component: widgets,
		meta: {
			title: 'widgets'
		}
	},
	{
		path: '/home',
		redirect: '/'
	},
	{
		path: '/widgets',
		redirect: '/'
	},
	{
		path: '/skills',
		component: skills,
		meta: {
			title: 'skills'
		}
	},
	{
		path: '/scenarios',
		component: scenarios,
		meta: {
			title: 'scenarios'
		}
	},
	{
		path: '/login',
		component: login,
		meta: {
			title: 'login'
		}
	},
	{
		path: '/admin',
		component: admin,
		meta: {
			title: 'admin'
		}
	}
]

const router = new VueRouter({
	routes,
	mode: 'abstract'
})

export default router
