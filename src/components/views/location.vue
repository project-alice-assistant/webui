<template>
	<vue-draggable-resizable
		:id="location.id"
		:class="{
			childLocation: location.parentLocation !== 0,
			painting: myHome.paintingFloors,
			clickable: myHome.settingLocations
		}"
		:active="!myHome.addingLocation"
		:draggable="myHome.locationsEditMode && !myHome.addingLocation"
		:onDragStart="stopPropagation"
		:grid="[5, 5]"
		:h="parseInt(location.settings['h'])"
		:min-height="5"
		:min-width="5"
		:parent="true"
		:w="parseInt(location.settings['w'])"
		:x="location['settings']['x']"
		:y="location.settings['y']"
		:z="location.settings['z']"
		class-name="location"
		:resizable="myHome.locationsEditMode && !myHome.addingLocation"
		classNameActive="nothingtoseehere"
		@dragstop="savePosition"
		@resizestop="saveSize"
		:style="`background: url('http://${$store.state.settings['aliceIp']}:${$store.state.settings['apiPort']}/api/v1.0.1/myHome/locations/floors/${location.settings['t'] || 'floor-80'}.png'); background-color: var(--windowBG)`"
		@activated="handleClick"
	>
		<span
			v-fit2box="location.name"
			:class="{clickable: myHome.locationsEditMode && !myHome.addingLocation && !myHome.paintingFloors}"
			class="locationName"
			@click="rename"
		/>
		<location
			v-for="loc in myHome.locations"
			v-if="loc.parentLocation === location.id"
			:key="loc.id"
			:location="loc"
			:myHome="myHome"
		/>
		<div v-if="myHome.deletingLocations" class="widgetTool deleter" @click="deleteMe">
			<i aria-hidden="true" class="far fa-trash-alt clickable"/>
		</div>
		<div v-if="myHome.settingLocations" class="widgetTool zindexer">
			<i aria-hidden="true" class="fas fa-level-up-alt clickable"/>
			<i aria-hidden="true" class="fas fa-level-down-alt clickable"/>
		</div>
	</vue-draggable-resizable>
</template>

<style scoped src="../css/location.css"/>
<style scoped src="../css/widgets.css"/>
<script src="../js/location.js"/>
