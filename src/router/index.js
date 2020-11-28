import Vue from 'vue'
import VueRouter from 'vue-router'
import widgets from '../components/views/widgets'
import skills from '../components/views/skills'
import scenarios from '../components/views/scenarios'
import login from '../components/views/login'
import admin from '../components/views/admin'
import connect from '../components/views/connect'
import syslog from '../components/views/syslog';
import alicewatch from '../components/views/alicewatch';
import devmode from '../components/views/devmode';

Vue.use(VueRouter)

const routes = [
	{
		path: '/connect',
		name: 'Connect',
		component: connect,
		meta: {
			title: 'connect'
		}
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
		path: '/syslog',
		component: syslog,
		meta: {
			title: 'syslog'
		}
	},
	{
		path: '/alicewatch',
		component: alicewatch,
		meta: {
			title: 'alicewatch'
		}
	},
	{
		path: '/admin',
		component: admin,
		meta: {
			title: 'admin'
		}
	},
	{
		path: '/devmode',
		component: devmode,
		meta: {
			title: 'dev mode'
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
		path: '*',
		name: 'Home',
		component: widgets,
		meta: {
			title: 'widgets'
		}
	}
]

const router = new VueRouter({
	routes,
	mode: 'abstract'
})

export default router
