<template>
	<div
		:id="`con_${data.id}`"
		:ref="data.id"
		:class="{
			clickable: myHome.toolsState.placingConstructions
		}"
		:style="computeCustomStyle()"
		class="construction"
		@click="handleClick"
		@mouseenter="hovered = true"
		@mouseleave="hovered = false"
	>
		<div v-if="myHome.toolsState.deletingLocations" class="widgetTool deleter" @click="deleteMe">
			<i aria-hidden="true" class="far fa-trash-alt clickable"/>
		</div>
		<div v-if="myHome.toolsState.settingLocations && hovered" class="widgetTool zindexer">
			<i aria-hidden="true" class="fas fa-level-up-alt clickable"/>
			<i aria-hidden="true" class="fas fa-level-down-alt clickable"/>
		</div>
	</div>
</template>

<style scoped src="../css/construction.css"/>
<script src="../js/construction.js"/>
