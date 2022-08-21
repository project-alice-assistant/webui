<template>
	<div class="notification clickable" @click="dismiss(notification.id)">
		<div class="notificationTitle">
			<i :class=icon aria-hidden="true" class="fa-fw"/> {{ notification['title'] }}
		</div>
		<div class="notificationContent">
			{{ notification['text'] }}
		</div>
	</div>
</template>

<script>
export default {
	name:     'notification',
	props:    [
		'notification'
	],
	computed: {
		icon: function () {
			if (parseInt(this.notification['type']) === 0) {
				return 'far fa-times-circle'
			} else if (parseInt(this.notification['type']) === 1) {
				return 'far fa-comment-dots'
			} else if (parseInt(this.notification['type']) === 2) {
				return 'fas fa-exclamation-triangle'
			}
		}
	},
	methods:  {
		dismiss: function (id) {
			// noinspection JSUnresolvedFunction
			this.$parent.dismissNotification(id)
		}
	}
}
</script>

<style scoped src="../css/header.css"/>
