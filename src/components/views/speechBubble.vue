<template>
<div>
	<div v-if="msg.topic === 'hermes/hotword/#/detected'" class="userSpeech male extend"> Hey Alice!</div>
	<div v-if="msg.topic === 'hermes/tts/say'" :class="aliceGender" class="aliceSpeech extend">
		{{ JSON.parse(msg.payloadString)['text'] }}
	</div>
	<div v-if="msg.topic === 'hermes/nlu/query'" class="userSpeech male extend">
		{{ JSON.parse(msg.payloadString)['input'] }}
	</div>
	<div v-if="msg.topic === 'hermes/dialogueManager/sessionEnded'" class="sessionEnded extend">
		---- Session ended: {{ JSON.parse(msg.payloadString)['termination']['reason'] }} ----
	</div>
	<div v-if="msg.topic === 'hermes/asr/partialTextCaptured'" class="userSpeech male extend">
		{{ JSON.parse(msg.payloadString)['text'] }} ...
	</div>
</div>
</template>

<script>
export default {
	name: 'speechBubble',
	data: function () {
		return {}
	},
	props: [
		'msg',
		'aliceGender'
	]
}
</script>

<style src="../css/speechBubble.css" scoped/>
