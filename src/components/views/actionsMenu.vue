<template>
	<div class="menu" :class="{extended: isExtended, cinemaMode: $store.state.fullScreen}">
		<i :class="!isExtended ? item.icon : item.extendedIcon || item.icon"
			 class="menuButton clickable"
			 aria-hidden="true"
			 v-for="(item, i) in menuItems.slice(0, isExtended ? 999 : 1)"
			 :key="item.name"
			 @click="handleClick(item)"
			 v-tooltip="isExtended ? item.extendedName || item.name : item.name"
		/>
	</div>
</template>

<style src="../css/actionsMenu.css" scoped></style>
<script src="../js/actionsMenu.js"></script>
