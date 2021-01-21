<template>
	<div
		:id="`wid_${widget.id}`"
		:style="computeCustomStyle()"
		class="widget"
		@click="handleClick"
	>
		<component is="style" scoped type="text/css">
			{{ widget.css }}
		</component>
		<div v-if="widget.settings['title']" class="widgetIcon">
			<i :class="widget.icon" aria-hidden="true"></i>
		</div>
		<p :class="{noCursorEvents: controller.dragAndResizeEnabled}" v-html="widget.taggedHtml"/>
		<div v-if="controller.settings" class="widgetTool optioner" @click="openSettings(widget)">
			<i aria-hidden="true" class="fas fa-cogs clickable"/>
		</div>
		<div v-if="controller.removeWidgets" class="widgetTool deleter" @click="controller.removeWidget(widget.id)">
			<i aria-hidden="true" class="far fa-trash-alt clickable"/>
		</div>
		<div v-if="controller.settings" class="widgetTool zindexer">
			<i aria-hidden="true" class="fas fa-level-up-alt clickable" @click="controller.moveZUp(widget)"/>
			<i aria-hidden="true" class="fas fa-level-down-alt clickable" @click="controller.moveZDown(widget)"/>
		</div>
	</div>
</template>

<style scoped src="../css/widgets.css"/>
<script src="../js/widget.js"/>
