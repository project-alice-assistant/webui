<template>
	<section id="mainSection">
		<keep-alive>
			<router-view/>
		</keep-alive>
		<pa-scenarios-iframe/> <!-- Load scenarios iframe outside of router-view to prevent recreation after navigation -->
		<div class="connectionStatus" :class="{connected: reconnected}" v-if="!connected">
			<i class="fas fa-5x" aria-hidden="true" :class="{'fa-heart-broken': !connected && !reconnected, 'fa-heartbeat': connected || reconnected}"/>
		</div>
	</section>
</template>

<script src="../js/content.js"/>
<style src="../css/content.css"/>
