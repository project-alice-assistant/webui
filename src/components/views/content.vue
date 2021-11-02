<template>
	<section id="mainSection">
		<keep-alive>
			<router-view/>
		</keep-alive>
		<pa-scenarios-iframe/> <!-- Load scenarios iframe outside of router-view to prevent recreation after navigation -->
		<div v-if="!connected" :class="{connected: reconnected}" class="connectionStatus">
			<i :class="{'fa-heart-broken': !connected && !reconnected, 'fa-heartbeat': connected || reconnected}" aria-hidden="true" class="fas fa-5x"/>
		</div>
	</section>
</template>

<script src="../js/content.js"/>
<style src="../css/content.css"/>
