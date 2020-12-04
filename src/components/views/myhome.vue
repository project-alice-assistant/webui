<template>
	<div class="container flexcolumn">
		<actions-menu :menuItems="menuItems" v-if="$store.state.loggedInUser"/>
		<div v-if="locationsEditMode" class="tools manageLocations">
			<i v-tooltip="$t('tooltips.addLocations')" :class="{clickable: !addingLocation, yellow: addingLocation}"
				 aria-hidden="true" class="fas fa-plus-circle fa-2x fa-fw" @click="addLocationDialog"/>
			<i v-tooltip="$t('tooltips.removeLocations')" aria-hidden="true" class="fas fa-trash-alt fa-2x fa-fw clickable"/>
			<i v-tooltip="$t('tooltips.paintFloors')" aria-hidden="true" class="fas fa-paint-roller fa-2x fa-fw clickable"
				 @click="paintingFloors = !paintingFloors"/>
			<i v-tooltip="$t('tooltips.buildMode')" aria-hidden="true" class="fas fa-hard-hat fa-2x fa-fw clickable"/>
			<i v-tooltip="$t('tooltips.manageFurniture')" aria-hidden="true" class="fas fa-couch fa-2x fa-fw clickable"/>
		</div>
		<div v-if="locationsEditMode && paintingFloors" class="tools paintFloors">
			<img
				v-for="imageId in floorTiles"
				:key="imageId"
				:class="{selected: imageId === activeFloorTile}"
				:src="`http://${$store.state.settings['aliceIp']}:${$store.state.settings['apiPort']}/api/v1.0.1/myHome/locations/floors/${imageId}.png`"
				class="clickable"
				@click="activeFloorTile === imageId ? activeFloorTile = '' : activeFloorTile = imageId"
			/>
		</div>
		<div class="myHomeEditor" :class="{fullscreen: $store.state.fullScreen}">
			<div
				:style="`transform: scale(${zoomLevel})`"
				:class="{
					locationsEditMode: locationsEditMode,
					addLocation: addingLocation
				}"
				class="floorPlan"
				@click="handleClick"
				@mousedown="mouseDown"
			>
				<location
					v-for="location in locations"
					v-if="location.parentLocation === 0"
					:key="location.id"
					:location="location"
					:locations="locations"
					:myHome="me"
				/>
			</div>
		</div>
	</div>
</template>

<style src="../css/myhome.css" scoped/>
<script src="../js/myhome.js"/>
