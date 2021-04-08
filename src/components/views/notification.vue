<template>
	<div class="notification clickable" @click="dismiss(id)">
		<div class="title">
			<i :class=icon class="fa-fw" aria-hidden="true"/> {{ notification['title'] }}
		</div>
		<div class="content">
			{{ notification['text'] }}
		</div>
	</div>
</template>

<script>
export default {
	name: 'notification',
	props: [
		'notification',
		'id'
	],
	computed: {
		icon: function () {
			if (this.notification['type'] === 0) {
				return 'far fa-times-circle'
			} else if (this.notification['type'] === 1) {
				return 'far fa-comment-dots'
			} else if (this.notification['type'] === 2) {
				return 'fas fa-exclamation-triangle'
			}
		}
	},
	methods: {
		dismiss: function(id) {
			// noinspection JSUnresolvedFunction
			this.$parent.dismissNotification(id)
		}
	}
}
</script>

<style scoped>
.notification {
	background-color: var(--secondary);
	width: 100%;
	font-size: 1em;
	box-sizing: border-box;
	padding: 5px;
	margin-bottom: 5px;
}

.title {
	font-weight: bolder;
	margin-bottom: 10px;
}

.content {
	margin-left: 25px;
}
</style>
