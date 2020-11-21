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
					<VueToggles
						id="title"
						checked-text="Yes"
						unchecked-text="No"
						:value="options['widget']['params']['title']"
						@click="options['widget']['params']['title'] = !options['widget']['params']['title']"
						uncheckedBg="var(--windowBG)"
						checkedBg="var(--windowBG)"
					/>
				</div>
				<div class="input">
					<input
						id="background"
						type="color"
						v-model="options['widget'].params['background']"
						v-init="options['widget'].params['background']"
						@input="hex2rgba"
					/>
				</div>
				<div class="input">
					<input
						id="opacity"
						type="range"
						min="0"
						max="1"
						step="0.1"
						v-model="options['widget'].params['background-opacity']"
						v-init="options['widget'].params['background-opacity']"
						@input="hex2rgba"
					/>{{ parseFloat(options['widget'].params['background-opacity']) * 100 }}%
				</div>
				<div class="input">
					<input
						id="font-size"
						type="range"
						min="0.25"
						max="5"
						step="0.01"
						v-model="options['widget'].params['font-size']"
						v-init="options['widget'].params['font-size']"
					/>{{ options['widget'].params['font-size'] }}em
				</div>
				<div class="input">
					<input
						id="font-color"
						type="color"
						v-model="options['widget'].params['color']"
						v-init="options['widget'].params['font-size']"
					/>
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
	methods: {
		handleConfirm() {
			this.proceed(this.options['widget'])
		},
		handleDismiss() {
			this.cancel()
		},
		hex2rgba() {
			let hex = this.options['widget'].params['background']
			let alpha = this.options['widget'].params['background-opacity']
			const [r, g, b] = hex.match(/\w\w/g).map(x => parseInt(x, 16));
			this.options['widget'].params['rgba'] = `rgba(${r}, ${g}, ${b}, ${alpha})`
		}
	}
};
</script>
