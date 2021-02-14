<template>
	<div :class="{
		magicMirrorMode: $store.state.magicMirrorMode
	}" class="tabs">
		<div v-for="tab in tabs" :key="tab.id" :class="{active: activeTabId === tab.id}" class="tab clickable"
				 @click="handleClick(tab.id)"
				 @contextmenu.prevent="remove(tab.id)"
				 @dblclick="rename(tab.id)"
		>
			<i :class="tab.icon" aria-hidden="true"/>
		</div>
		<div class="tab clickable" @click="add" v-if="addTab && $store.state.loggedInUser">
			<i class="fas fa-plus" aria-hidden="true"/>
		</div>
	</div>
</template>

<style src="../css/tabs.css" scoped/>
<script src="../js/tabs.js"/>
