<template>
	<div class="menu" :class="{extended: isExtended}">
		<i :class="!isExtended ? item.icon : item.extendedIcon || item.icon"
			 class="menuButton clickable"
			 aria-hidden="true"
			 v-for="(item, i) in menuItems.slice(0, isExtended ? 999 : 1)"
			 :key="item.name"
			 @click="!item.hasOwnProperty('callback') ? toggle() : item.callback()"
		/>
	</div>
</template>

<style src="../css/actionsMenu.css" scoped></style>
<script src="../js/actionsMenu.js"></script>
