<template>
	<section id="mainSection">
		<keep-alive>
			<router-view/>
		</keep-alive>
		<div class="connectionStatus" :class="{initialHidden: connected, connected: reconnected}">
			<i class="fas fa-heart-broken fa-5x" aria-hidden="true"/>
		</div>
	</section>
</template>

<style src="../css/content.css"/>
<script src="../js/content.js"/>
