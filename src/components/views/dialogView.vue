<template>
	<div class="dialogView">
		<div id="messageContainer" class="messageContainer">
			<SpeechBubble v-for="(msg, key) in msgs" :key="key" :aliceGender="$store.state.settings['ttsType']" :msg="msg"/>
			<SpeechBubble v-if="currentSpeech !== undefined" :key="msgs.length" :msg="currentSpeech"/>
		</div>
		<div class="dvInput">
			<!--suppress HtmlFormInputWithoutLabel -->
			<input type="text" v-bind:value="say" v-on:input="say = $event.target.value" @keyup.enter="sendQuery" @keyup.up="historyUp" @keyup.down="historyDown"/>
			<button @click="sendQuery"><i aria-hidden="true" class="fas fa-paper-plane"></i></button>
			<micStreamer icon="fas fa-microphone fa-2x"></micStreamer>
		</div>
	</div>
</template>


<script src="../js/dialogView.js"/>
<style scoped src="../css/speechBubble.css"/>
<style scoped src="../css/dialogView.css"/>
