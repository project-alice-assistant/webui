<template>
	<div class="tabs">
		<div class="tab clickable" :class="{active: activeTab === tab.position}" v-for="tab in tabs" :key="tab.id"
				 @click="handleClick(tab.position, tab.id)"
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
