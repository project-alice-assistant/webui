<template>
	<div class="custom-view-wrapper">
		<h3>Widget settings</h3>
		<div class="configLayout">
			<div class="labels">
				<label for="background">Display title: </label>
				<label for="background">Background color: </label>
				<label for="opacity">Background opacity: </label>
				<label for="font-size">Font size: </label>
				<label for="font-color">Font color: </label>
			</div>
			<div class="inputs">
				<div class="input">
					<VueToggles id="title" checked-text="Yes" unchecked-text="No" :value="options['widget']['params']['title']" @click="options['widget']['params']['title'] = !options['widget']['params']['title']" uncheckedBg="var(--windowBG)" checkedBg="var(--windowBG)"/>
				</div>
				<div class="input">
					<input id="background" type="color" v-model="options['widget']['params']['background']"/>
				</div>
				<div class="input">
					<input id="opacity" type="range" min="0" max="1" step="0.1" v-model="options['widget']['params']['background-opacity']"/> {{ options['widget']['params']['background-opacity'] }}%
				</div>
				<div class="input">
					<input id="font-size" type="range" min="0.15" max="10" step="0.01" v-model="options['widget']['params']['font-size']"/> {{ options['widget']['params']['font-size'] }}em
				</div>
				<div class="input">
					<input id="font-color" type="color" v-model="options['widget']['params']['color']"/>
				</div>
			</div>
		</div>
		<div>
			<button @click="handleDismiss">Cancel</button>
			<button class="dg-pull-right" @click="handleConfirm">Confirm</button>
		</div>
	</div>
</template>

<script>
import VueDialogMixin from 'vuejs-dialog/dist/vuejs-dialog-mixin.min.js'

export default {
	mixins: [VueDialogMixin],
	data: function() {
		return {
			hasTitle: true
		}
	},
	methods: {
		handleConfirm() {
			this.proceed(this.options['widget']['params'])
		},
		handleDismiss() {
			this.cancel()
		}
	}
};
</script>
