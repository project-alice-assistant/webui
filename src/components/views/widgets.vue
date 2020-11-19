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
				v-for="widget in widgetInstances"
				:key="widget.id"
				v-if="widget['page'] === activePageId"
			>
				<component is="style" type="text/css" scoped>
					{{ widget.css }}
				</component>
				<div class="widgetIcon" v-if="widget.params['title']">
					<i :class="widget.icon" aria-hidden="true"></i>
				</div>
				<p v-html="widget.html"/>
				<script type="application/javascript">
					{{ widget.js }}
				</script>
				<div class="widgetTool optioner" v-if="settings">
					<i class="fas fa-cogs clickable" aria-hidden="true"/>
				</div>
				<div class="widgetTool deleter" v-if="removeWidgets">
					<i class="far fa-trash-alt clickable" aria-hidden="true"/>
				</div>
				<div class="widgetTool zindexer" v-if="settings">
					<i class="fas fa-level-up-alt clickable" aria-hidden="true"/>
					<i class="fas fa-level-down-alt clickable" aria-hidden="true"/>
				</div>
			</vue-draggable-resizable>
		</div>
	</div>
</template>

<style src="../css/widgets.css" scoped/>
<style src="../css/tabs.css" scoped/>
<script src="../js/widgets.js"/>
