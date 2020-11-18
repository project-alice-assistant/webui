<template>
	<div class="container">
		<overlay :opened="addWidgets" :visible="addWidgets" @closed="addWidgets = false" animate="zoom-in" header="Add widgets">
			<div v-for="(widgets, skillName) in widgetTemplates" :key="skillName">
				<div class="skillTemplate">{{ skillName }}</div>
				<div class="widgetTemplate clickable" v-for="widget in widgets" @click="addWidget(skillName, widget)">
					{{ widget }}
				</div>
			</div>
		</overlay>
		<actions-menu :menuItems="menuItems"/>
		<tabs :tabs="tabs" :onChange="changePage"/>
		<div class="tab_page" v-for="tab in tabs" :key="tab.id" v-if="tab.id === activePageId">
			<vue-draggable-resizable
				class-name="widget"
				:w="parseInt(widget['params']['size'].split('x')[0])"
				:h="parseInt(widget['params']['size'].split('x')[1])"
				:x="widget['params']['x']"
				:y="widget['params']['y']"
				:z="widget['params']['z']"
				:grid="[10, 10]"
				:parent="true"
				v-for="widget in widgetInstances"
				:key="widget.id"
				v-if="widget['page'] === activePageId"
				:draggable="dragAndResizeEnabled"
				:resizable="dragAndResizeEnabled"
				@activated="selectedWidget = widget.id"
				@dragstop="savePosition"
				@resizestop="saveSize"
			>
				<div v-html="widget['html']">
				</div>
			</vue-draggable-resizable>
		</div>
	</div>
</template>

<style src="../css/widgets.css" scoped/>
<style src="../css/tabs.css" scoped/>
<script src="../js/widgets.js"/>
