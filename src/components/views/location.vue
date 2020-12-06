<template>
	<div
		:id="location.id"
		:ref="location.id"
		:style="computeCustomStyle()"
		:class="{
			childLocation: location.parentLocation !== 0,
			painting: myHome.paintingFloors,
			clickable: myHome.locationsEditMode && !myHome.addingLocation && !myHome.paintingFloors
		}"
		class="location"
		@click="handleClick"
	>
		<span
			v-fit2box="location.name"
			:class="{clickable: myHome.locationsEditMode && !myHome.addingLocation && !myHome.paintingFloors}"
			class="locationName"
			@click="rename"
		/>
		<div v-if="myHome.deletingLocations" class="widgetTool deleter" @click="deleteMe">
			<i aria-hidden="true" class="far fa-trash-alt clickable"/>
		</div>
		<div v-if="myHome.settingLocations" class="widgetTool zindexer">
			<i aria-hidden="true" class="fas fa-level-up-alt clickable"/>
			<i aria-hidden="true" class="fas fa-level-down-alt clickable"/>
		</div>
	</div>
</template>

<style scoped src="../css/location.css"/>
<style scoped src="../css/widgets.css"/>
<script src="../js/location.js"/>
