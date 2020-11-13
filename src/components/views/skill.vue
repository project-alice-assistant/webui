<template>
	<div class="skill vertical">
		<div class="skillTitle">
			<div class="skillName">{{ skill.name }}</div>
			<div class="skillIcon"><i :class="skill.icon" aria-hidden="true"/></div>
		</div>
		<div class="skillBody" v-if="viewInfos">

		</div>
		<div class="skillBody" v-if="viewInstructions">

		</div>
		<div class="skillBody" v-if="viewIntents"></div>
		<div class="skillBody" v-if="viewSkill">
			<div class="clickable" @click="viewSkill = viewIntents = viewInfos = false; viewInstructions = true">Instructions</div>
			<div class="clickable" @click="viewSkill = viewInstructions = viewInfos = false; viewIntents = true">Intents</div>
			<div class="clickable" @click="viewSkill = viewIntents = viewInstructions = false; viewInfos = true">Infos</div>
			<div class="skillActions">
				<i class="fas fa-cog clickable" aria-hidden="true" v-if="Object.keys(skill.settings).length"/>
				<i class="fas fa-power-off clickable" aria-hidden="true" v-if="!skill.required" @click="toggle"/>
				<i class="fas fa-sync clickable" aria-hidden="true" v-if="skill.active" @click="reloadSkill"/>
				<i class="fas fa-arrow-alt-circle-up clickable" aria-hidden="true" v-if="skill.updateAvailable" @click="update"/>
				<i class="far fa-times-circle clickable" aria-hidden="true" v-if="!skill.required" @click="remove"/>
			</div>
			<div class="skillStatus" :class="skill.active ? 'active' : 'disabled'"/>
		</div>
	</div>
</template>

<style src="../css/skill.css" scoped></style>
<script src="../js/skill.js"></script>
