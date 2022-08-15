<template>
	<div class="notification clickable" @click="dismiss(notification.id)">
		<div class="title">
			<i :class=icon aria-hidden="true" class="fa-fw"/> {{ notification['title'] }}
		</div>
		<div class="content">
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
			console.log(this.notification)
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

<style scoped>
.notification {
	background-color: var(--secondary);
	box-sizing: border-box;
	font-size: 1em;
	margin-bottom: 5px;
	padding: 5px;
	width: 100%;
}

.title {
	font-weight: bolder;
	margin-bottom: 10px;
}

.content {
	margin-left: 25px;
}
</style>
