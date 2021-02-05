<template>
	<div class="dialogView">
		<div class="messageContainer" id="messageContainer">
			<SpeechBubble v-for="(msg, key) in msgs" :key="key" :aliceGender="$store.state.settings['ttsType']" :msg="msg"/>
			<SpeechBubble v-if="currentSpeech !== undefined" :key="msgs.length" :msg="currentSpeech"/>
		</div>
		<div class="dvInput">
			<!--suppress HtmlFormInputWithoutLabel -->
			<input type="text" v-bind:value="say" v-on:input="say = $event.target.value" @keyup.enter="sendQuery"/>
			<button @click="sendQuery"><i aria-hidden="true" class="fas fa-paper-plane"></i></button>
		</div>
	</div>
</template>


<script src="../js/dialogView.js"/>
<style src="../css/speechBubble.css" scoped/>
