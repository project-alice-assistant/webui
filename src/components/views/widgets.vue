<template>
	<div class="container">
		<overlay :opened="addWidgets" :visible="addWidgets" @closed="addWidgets = false" animate="zoom-in" header="Add widgets">
			<div v-for="(widgets, skillName) in widgetTemplates" :key="skillName">
				<div class="skill">{{ skillName }}</div>
				<div class="widget clickable" v-for="widget in widgets" @click="addWidget(skillName, widget)">
					{{ widget }}
				</div>
			</div>
		</overlay>
		<actions-menu :menuItems="menuItems"/>
		<tabs :tabs="tabs" :onChange="changePage"/>
	</div>
</template>

<style src="../css/widgets.css" scoped/>
<script src="../js/widgets.js"/>
