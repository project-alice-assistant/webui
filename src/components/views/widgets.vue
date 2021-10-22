<template>
	<div :key="uid" class="container flexcolumn">
		<overlay :header="$t('dialogs.titles.addWidgets')" :opened="addWidgets" :visible="addWidgets" animate="zoom-in" @closed="addWidgets = false">
			<div v-for="(widgets, skillName) in $store.state.widgetTemplates" :key="skillName">
				<div class="skillTemplate">{{ skillName }}</div>
				<div v-for="widget in widgets" class="widgetTemplate clickable" @click="addWidget(skillName, widget)">
					{{ widget }}
				</div>
			</div>
		</overlay>
		<actions-menu v-if="$store.state.loggedInUser" :menuItems="menuItems"/>
		<tabs
			:activeTabId="activeTabId"
			:addTab="addTab"
			:onChange="changePage"
			:parent="this"
			:removeTab="removeTab"
			:renameTab="renameTab"
			:store="$store"
			:tabs="$store.state.widgetPages"
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

<style scoped src="../css/widgets.css"/>
<style scoped src="../css/tabs.css"/>
<style scoped src="../css/overrides/overlay.css"/>
<script src="../js/widgets.js"/>
