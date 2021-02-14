<template>
	<div
		class="menu"
		:class="{
			extend: extend,
			retract: retract,
			extended: isExtended,
			cinemaMode: $store.state.fullScreen,
			magicMirrorMode: $store.state.magicMirrorMode
		}"
		@animationend="animationEnd"
	>
		<i :class="!isExtended ? item.icon : item.extendedIcon || item.icon"
			 class="menuButton clickable"
			 aria-hidden="true"
			 v-for="(item, i) in menuItems.slice(0, isExtended ? 999 : 1)"
			 :key="item.name"
			 @click="handleClick(item, $event)"
			 v-tooltip="isExtended ? item.extendedName || item.name : item.name"
		/>
	</div>
</template>

<style src="../css/actionsMenu.css" scoped></style>
<script src="../js/actionsMenu.js"></script>
