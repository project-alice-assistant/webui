<template>
	<div class="container">
		<div class="tabs">
			<div class="tab clickable" :class="{active: activeTab === tab.id}" v-for="tab in myTabs" :key="tab.id"
					 @click="handleClick(tab.id)"
					 @contextmenu.prevent="removeTab(tab.id)"
					 @dblclick="rename(tab.id)"
			>
				<i :class="tab.icon" aria-hidden="true"/>
			</div>
			<div class="tab" v-if="adding">
				<i class="fa-spinner fa-spin" aria-hidden="true"/>
			</div>
			<div class="tab clickable" @click="addTab">
				<i class="fas fa-plus" aria-hidden="true"/>
			</div>
		</div>
		<div class="tab_page" v-for="tab in myTabs" :key="tab.id" v-if="tab.id === activeTab">
		</div>
	</div>
</template>

<style src="../css/tabs.css" scoped/>
<script src="../js/tabs.js"/>
