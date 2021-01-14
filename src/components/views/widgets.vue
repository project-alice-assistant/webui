<template>
	<div :key="uid" class="container flexcolumn">
		<overlay :opened="addWidgets" :visible="addWidgets" @closed="addWidgets = false" animate="zoom-in" :header="$t('dialogs.titles.addWidgets')">
			<div v-for="(widgets, skillName) in widgetTemplates" :key="skillName">
				<div class="skillTemplate">{{ skillName }}</div>
				<div class="widgetTemplate clickable" v-for="widget in widgets" @click="addWidget(skillName, widget)">
					{{ widget }}
				</div>
			</div>
		</overlay>
		<actions-menu :menuItems="menuItems" v-if="$store.state.loggedInUser"/>
		<tabs
			:tabs="tabs"
			:activeTabId="activeTabId"
			:addTab="addTab"
			:removeTab="removeTab"
			:renameTab="renameTab"
			:onChange="changePage"
		/>
		<div :key="activeTabId" class="tab_page">
			<vue-draggable-resizable
				class-name="widgetContainer"
				classNameActive="nothingtoseehere"
				:w="parseInt(widget['params']['size'].split('x')[0])"
				:h="parseInt(widget['params']['size'].split('x')[1])"
				:x="widget['params']['x']"
				:min-width="50"
				:min-height="50"
				:y="widget['params']['y']"
				:z="widget['params']['z']"
				:grid="[10, 10]"
				:parent="true"
				:draggable="dragAndResizeEnabled"
				:resizable="dragAndResizeEnabled"
				@activated="selectedWidget = widget.id"
				@dragstop="savePosition"
				@resizestop="saveSize"
				v-for="widget in activePageWidgets"
				:key="widget.id"
			>
				<div class="widget" :style="computeCustomStyle(widget)">
					<component is="style" type="text/css" scoped>
						{{ widget.css }}
					</component>
					<div class="widgetIcon" v-if="widget.params['title']">
						<i :class="widget.icon" aria-hidden="true"></i>
					</div>
					<p v-html="widget.taggedHtml"/>
					<div class="widgetTool optioner" v-if="settings" @click="openWidgetSettings(widget)">
						<i class="fas fa-cogs clickable" aria-hidden="true"/>
					</div>
					<div class="widgetTool deleter" v-if="removeWidgets" @click="removeWidget(widget.id)">
						<i class="far fa-trash-alt clickable" aria-hidden="true"/>
					</div>
					<div class="widgetTool zindexer" v-if="settings">
						<i class="fas fa-level-up-alt clickable" aria-hidden="true" @click="moveZUp(widget)"/>
						<i class="fas fa-level-down-alt clickable" aria-hidden="true" @click="moveZDown(widget)"/>
					</div>
				</div>
			</vue-draggable-resizable>
		</div>
	</div>
</template>

<style src="../css/widgets.css" scoped/>
<style src="../css/tabs.css" scoped/>
<script src="../js/widgets.js"/>
