<template>
	<div
		:class="{
			extend: extend,
			retract: retract,
			extended: isExtended,
			cinemaMode: $store.state.fullScreen,
			magicMirrorMode: $store.state.magicMirrorMode
		}"
		class="menu"
		@animationend="animationEnd"
	>
		<i v-for="item in menuItems.slice(0, isExtended ? 999 : 1)"
			 :key="item.name"
			 v-tooltip="isExtended ? item.extendedName || item.name : item.name"
			 :class="!isExtended ? item.icon : item.extendedIcon || item.icon"
			 aria-hidden="true"
			 class="menuButton clickable"
			 @click="handleClick(item, $event)"
		/>
	</div>
</template>

<style scoped src="../css/actionsMenu.css"></style>
<script src="../js/actionsMenu.js"></script>
