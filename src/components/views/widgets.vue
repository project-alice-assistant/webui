<template>
	<div :key="uid" class="container flexcolumn">
		<overlay :opened="addWidgets" :visible="addWidgets" @closed="addWidgets = false" animate="zoom-in" :header="$t('dialogs.titles.addWidgets')">
			<div v-for="(widgets, skillName) in $store.state.widgetTemplates" :key="skillName">
				<div class="skillTemplate">{{ skillName }}</div>
				<div class="widgetTemplate clickable" v-for="widget in widgets" @click="addWidget(skillName, widget)">
					{{ widget }}
				</div>
			</div>
		</overlay>
		<actions-menu :menuItems="menuItems" v-if="$store.state.loggedInUser"/>
		<tabs
			:tabs="$store.state.widgetPages"
			:activeTabId="activeTabId"
			:addTab="addTab"
			:removeTab="removeTab"
			:renameTab="renameTab"
			:onChange="changePage"
			:parent="this"
		/>
		<div :key="activeTabId" :class="{
			magicMirrorMode: $store.state.magicMirrorMode
		}" class="tab_page" @click="moveableItem.destroyMoveable()">
			<widget
				v-for="widget in activePageWidgets"
				:key="widget.id"
				:controller="controller"
				:widget="widget"
			/>
		</div>
	</div>
</template>

<style src="../css/widgets.css" scoped/>
<style src="../css/tabs.css" scoped/>
<style scoped src="../css/overrides/overlay.css"/>
<script src="../js/widgets.js"/>
