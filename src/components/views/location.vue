<template>
	<vue-draggable-resizable
		:id="location.id"
		:class="{childLocation: location.parentLocation !== 0}"
		:active="!myHome.addingLocation"
		:draggable="myHome.locationsEditMode && !myHome.addingLocation"
		:onDragStart="stopPropagation"
		:grid="[5, 5]"
		:h="parseInt(location.settings['h'])"
		:min-height="50"
		:min-width="50"
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
		:style="`background: url('http://${$store.state.settings['aliceIp']}:${$store.state.settings['apiPort']}/api/v1.0.1/myHome/locations/floors/${location.settings['t']}.png'); background-color: var(--windowBG)`"
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
	</vue-draggable-resizable>
</template>

<style scoped src="../css/location.css"/>
<script src="../js/location.js"/>
