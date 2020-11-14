<template>
	<div class="skill vertical" data-tour="0">
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
			<div class="clickable" @click="viewSkill = viewIntents = viewInfos = false; viewInstructions = true" data-tour="7">Instructions</div>
			<div class="clickable" @click="viewSkill = viewInstructions = viewInfos = false; viewIntents = true" data-tour="8">Intents</div>
			<div class="clickable" @click="viewSkill = viewIntents = viewInstructions = false; viewInfos = true" data-tour="9">Infos</div>
			<div class="skillActions">
				<i class="fas fa-cog clickable" aria-hidden="true" v-if="Object.keys(skill.settings).length" data-tour="1"/>
				<i class="fas fa-power-off clickable" aria-hidden="true" v-if="!skill.required" @click="toggle" data-tour="2"/>
				<i class="fas fa-sync clickable" aria-hidden="true" v-if="skill.active" @click="reloadSkill" data-tour="3"/>
				<i class="fas fa-arrow-alt-circle-up clickable" aria-hidden="true" v-if="skill.updateAvailable" @click="update" data-tour="4"/>
				<i class="far fa-times-circle clickable" aria-hidden="true" v-if="!skill.required" @click="remove" data-tour="5"/>
			</div>
			<div class="skillStatusAround" />
			<div class="skillStatus" :class="skill.active ? 'active' : 'disabled'" data-tour="6"/>
		</div>
	</div>
</template>

<style src="../css/skill.css" scoped></style>
<style src="../css/tour.css" scoped></style>
<script src="../js/skill.js"></script>
