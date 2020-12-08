<template>
	<div
		:id="`loc_${location.id}`"
		:style="computeCustomStyle()"
		:class="{
			painting: myHome.paintingFloors,
			clickable: myHome.locationsEditMode && !myHome.addingLocation && !myHome.paintingFloors
		}"
		class="location"
		@click="handleClick"
	>
		<location
			v-for="loc in locations"
			v-if="loc.parentLocation === location.id"
			:key="`loc_${loc.id}`"
			:location="loc"
			:locations="locations"
			:myHome="myHome"
		/>
		<furniture
			v-for="fur in furnitures"
			v-if="fur.parentLocation === location.id"
			:key="`fur_${fur.id}`"
			:class="{clickable: myHome.locationsEditMode && !myHome.addingLocation && !myHome.paintingFloors}"
			:furniture="fur"
			:location="location"
			:myHome="myHome"
		/>
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
