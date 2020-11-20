<template>
	<div class="custom-view-wrapper">
		<div class="dg-content-body dg-content-body--has-title">
			<h6 class="dg-title">New icon</h6>
			<div class="dg-content">Please enter the new font awesome icon, including the prefix</div>
			<form autocomplete="off" class="dg-form" data-children-count="1">
				<label for="dg-input-elem">Example: fas fa-biohazard</label><br/><br/>
				<input type="text" autocomplete="off" id="dg-input-elem" v-model="icon" @input="update"/>
			</form>
		</div>
		<div class="dg-content-footer">
			<button style="background-color: var(--windowBG);" @click="handleDismiss">Cancel</button>
			<button class="dg-pull-right" style="background-color: var(--windowBG);" @click="handleConfirm"><i :class="icon" class="fa-2x" aria-hidden="true"/></button>
		</div>
	</div>
</template>

<script>
import VueDialogMixin from 'vuejs-dialog/dist/vuejs-dialog-mixin.min.js'

export default {
	mixins: [VueDialogMixin],
	data: function() {
		return {
			icon: 'fas fa-biohazard'
		}
	},
	methods: {
		handleConfirm() {
			this.proceed(this.icon)
		},
		handleDismiss() {
			this.cancel()
		},
		update() {
			this.$forceUpdate()
		}
	}
};
</script>
