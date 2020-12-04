<template>
	<vue-draggable-resizable
		:id="location.id"
		:class="{childLocation: location.parentLocation !== 0}"
		:draggable="myHome.locationsEditMode && !myHome.addingLocation"
		:grid="[5, 5]"
		:h="parseInt(location.settings['h'])"
		:min-height="50"
		:min-width="50"
		:parent="true"
		:resizable="myHome.locationsEditMode && !myHome.addingLocation"
		:w="parseInt(location.settings['w'])"
		:x="location['settings']['x']"
		:y="location.settings['y']"
		:z="location.settings['z']"
		class-name="location"
		classNameActive="nothingtoseehere"
		@dragstop="savePosition"
		@resizestop="saveSize"
	>
		<span v-fit2box="location.name" :class="{clickable: myHome.locationsEditMode && !myHome.addingLocation}"
					class="locationName" @click="rename"/>
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
