<template>
	<div class="custom-view-wrapper">
		<div class="dg-content-body dg-content-body--has-title">
			<h6 class="dg-title">{{ data['title'] }}</h6>
			<div class="dg-content">{{ data['body'] }}
				<!--suppress HtmlFormInputWithoutLabel -->
				<select v-model="selected" name="device">
					<option v-for="answer in data['list']" :value="answer">{{ answer }}</option>
				</select>
			</div>
		</div>
		<div>
			<button @click="handleDismiss">
				{{ parent.$t('buttons.cancel') }}
			</button>
			<button class="dg-pull-right" @click="handleConfirm">
				{{ parent.$t('buttons.ok') }}
			</button>
		</div>
	</div>
</template>


<script>
import VueDialogMixin from 'vuejs-dialog/dist/vuejs-dialog-mixin.min.js'

export default {
	mixins: [VueDialogMixin],
	data: function () {
		return {
			parent: this.options['parent'],
			data: this.options['data'],
			selected: ''
		}
	},
	methods: {
		handleConfirm() {
			this.proceed(this.selected)
		},
		handleDismiss() {
			this.cancel()
		},
		update() {
			this.$forceUpdate()
		}
	}
}
</script>
