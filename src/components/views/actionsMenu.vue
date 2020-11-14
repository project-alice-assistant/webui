<template>
	<transition name="smooth" mode="out-in" appear>
	<div :class="extended ? 'extended' : ''" class="menu">
		<i :class="!extended ? item.icon : item.extendedIcon || item.icon"
			 class="menuButton clickable"
			 aria-hidden="true"
			 v-for="(item, i) in menuItems.slice(0, extended ? 999 : 1)"
			 :key="item.name"
			 @click="toggle"
		/>
	</div>
	</transition>
</template>

<style src="../css/actionsMenu.css" scoped></style>
<script src="../js/actionsMenu.js"></script>
