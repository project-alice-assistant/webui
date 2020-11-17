<template>
	<div class="container">
		<overlay :opened="addWidgets" :visible="addWidgets" @closed="addWidgets = false" animate="zoom-in" header="Add widgets">
			here
		</overlay>
		<actions-menu :menuItems="menuItems"/>
		<tabs :tabs="tabs"/>
	</div>
</template>

<script src="../js/widgets.js"/>
