<template>
	<header :class="{collapsed: this.$store.state.fullScreen}">
		<div class="pageTitle">{{ title }}</div>
		<div id="aliceStatus" class="aliceStatus"></div>
		<div v-if="this.$store.state.settings['displaySystemUsage']" class="resourceUsage">
			CPU: {{ resources.cpu }}%
			SWP: {{ resources.swp }}%
			RAM: {{ resources.ram }}%
		</div>
		<div class="versionInfo">
			{{ $store.state.settings['aliceVersion'] }}
		</div>
		<div class="channelInfo">
			{{ $store.state.settings['aliceUpdateChannel'] }}
		</div>
		<div v-if="Object.keys(notifications).length !== 0" class="notifications">
			<span class="notification">
    		<i aria-hidden="true" class="fas fa-envelope clickable notificationIcon" @click="notificationsDisplayToggle = !notificationsDisplayToggle"></i>
    		<span class="notificationCounter">{{ Object.keys(notifications).length }}</span>
  		</span>
			<div v-if="notificationsDisplayToggle" class="notificationHolder">
				<div class="notification clickable" @click="dismissAll" v-if="Object.keys(notifications).length > 1">
					<div class="title">
						<i aria-hidden="true" class="far fa-check-double fa-fw"/>
					</div>
					<div class="content">
						{{ $t('buttons.dismissAllNotification') }}
					</div>
				</div>
				<notification v-for="notification in notifications" :key="notification.id" :notification="notification"/>
			</div>
		</div>
	</header>
</template>

<style scoped src="../css/header.css"/>
<script src="../js/header.js"/>
