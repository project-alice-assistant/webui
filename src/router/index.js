import Vue from 'vue'
import VueRouter from 'vue-router'
import PortalVue from 'portal-vue'
import skills from '@/components/views/skills'
import scenarios from '@/components/views/scenarios'
import login from '@/components/views/login'
import admin from '@/components/views/admin'
import connect from '@/components/views/connect'
import syslog from '@/components/views/syslog'
import alicewatch from '@/components/views/alicewatch'
import devmode from '@/components/views/devmode'
import myhome from '@/components/views/myhome'
import dialogView from '@/components/views/dialogView'
import widgets from '@/components/views/widgets'
import telemetry from '@/components/views/telemetry'

Vue.use(VueRouter)
Vue.use(PortalVue)

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
		name: 'Skills',
		component: skills,
		meta: {
			title: 'nav.skills'
		}
	},
	{
		path: '/scenarios',
		component: scenarios,
		name: 'Scenarios',
		meta: {
			title: 'nav.scenarios'
		}
	},
	{
		path: '/login',
		name: 'Login',
		component: login,
		meta: {
			title: 'nav.login'
		}
	},
	{
		path: '/syslog',
		name: 'Syslog',
		component: syslog,
		meta: {
			title: 'nav.syslog'
		}
	},
	{
		path: '/alicewatch',
		name: 'AliceWatch',
		component: alicewatch,
		meta: {
			title: 'nav.alicewatch'
		}
	},
	{
		path: '/admin',
		name: 'Admin',
		component: admin,
		meta: {
			title: 'nav.admin'
		}
	},
	{
		path: '/devmode',
		name: 'Devmode',
		component: devmode,
		meta: {
			title: 'nav.devmode'
		}
	},
	{
		path: '/myhome',
		name: 'MyHome',
		component: myhome,
		meta: {
			title: 'nav.myhome'
		}
	},
	{
		path: '/dialogView',
		name: 'Dialog View',
		component: dialogView,
		meta: {
			title: 'nav.dialogView'
		}
	},
	{
		path: '/widgets',
		name: 'Widgets',
		component: widgets,
		meta: {
			title: 'nav.widgets'
		}
	},
	{
		path: '/telemetry',
		name: 'Telemetry',
		component: telemetry,
		meta: {
			title: 'nav.telemetry'
		}
	},
	{
		path: '*',
		name: 'Home',
		component: widgets,
		meta: {
			title: 'nav.widgets'
		}
	}
]

const router = new VueRouter({
	routes,
	mode: 'abstract'
})

export default router
