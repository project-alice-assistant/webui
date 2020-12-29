<template>
	<div
		:id="`dev_${data.id}`"
		:ref="`dev_${data.id}`"
		:style="computeCustomStyle()"
		v-tooltip="data.displayName"
		class="device clickable"
		@click="handleClick"
		@mouseenter="onMouseEnter"
		@mouseleave="onMouseExit"
	>
		<div class="deviceState">
			<span v-if="parseInt(data.uid) === -1">
				<i aria-hidden="true" class="fas fa-unlink red"/>
			</span>
			<span v-else-if="!data.connected">
				<i aria-hidden="true" class="fas fa-heart-broken red"/>
			</span>
			<span v-else>
				<i v-if="data.deviceParams.micMuted" aria-hidden="true" class="fas fa-microphone-alt-slash red"/>
				<i v-if="data.deviceParams.soundMuted" aria-hidden="true" class="fas fa-volume-mute red"/>
			</span>
		</div>
		<div v-if="data.id !== 1 && myHome.toolsState.deletingDevices" class="widgetTool deleter" @click="deleteMe">
			<i aria-hidden="true" class="far fa-trash-alt clickable"/>
		</div>
		<div v-if="myHome.toolsState.settingDevices" class="widgetTool zindexer">
			<i aria-hidden="true" class="fas fa-level-up-alt clickable"/>
			<i aria-hidden="true" class="fas fa-level-down-alt clickable"/>
		</div>
	</div>
</template>

<style scoped src="../css/device.css"/>
<script src="../js/device.js"/>
