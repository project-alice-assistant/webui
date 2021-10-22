<template>
	<div :class="{
		magicMirrorMode: store.state.magicMirrorMode
	}" class="tabs">
		<div v-for="tab in tabs" :key="tab.id" :class="{active: activeTabId === tab.id}" class="tab clickable"
				 @click="handleClick(tab.id)"
				 @dblclick="rename(tab.id)"
				 @contextmenu.prevent="remove(tab.id)"
		>
			<i :class="tab.icon" aria-hidden="true"/>
		</div>
		<div v-if="addTab && store.state.loggedInUser" class="tab clickable" @click="add">
			<i aria-hidden="true" class="fas fa-plus"/>
		</div>
	</div>
</template>

<style scoped src="../css/tabs.css"/>
<script src="../js/tabs.js"/>
