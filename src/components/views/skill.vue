<template>
	<div class="skill" data-tour="0">
		<div class="skillTitle">
			<div class="skillName">{{ skill.name }}</div>
			<div class="skillIcon"><i :class="skill.icon" aria-hidden="true"/></div>
		</div>
		<overlay :opened="viewInfos" :visible="viewInfos" @closed="viewInfos = false" animate="zoom-in" :header="`Infos - ${skill.name}`">
			<ul class="fa-ul">
				<li><span class="fa-li"><i class="fas fa-code-branch" aria-hidden="true"></i></span>{{ skill.version }}</li>
				<li><span class="fa-li"><i class="fas fa-compress-arrows-alt" aria-hidden="true"></i></span>{{ skill.aliceMinVersion }}</li>
				<li><span class="fa-li"><i class="fas fa-user" aria-hidden="true"></i></span>{{ skill.author }}</li>
				<li><span class="fa-li"><i class="fas fa-users" aria-hidden="true"></i></span>{{ skill.maintainers.join(', ') }}</li>
				<li><span class="fa-li"><i class="fas fa-folder-open" aria-hidden="true"></i></span>{{ skill.category }}</li>
				<li><span class="fa-li"><i class="fas fa-quote-right" aria-hidden="true"></i></span>{{ skill.description }}</li>
			</ul>
		</overlay>
		<overlay :opened="viewInstructions" :visible="viewInstructions" @closed="viewInstructions = false" animate="zoom-in" :header="`Instructions - ${skill.name}`">
				instructions
		</overlay>
		<overlay :opened="viewIntents" :visible="viewIntents" @closed="viewIntents = false" animate="zoom-in" :header="`Intents - ${skill.name}`">
				intents
		</overlay>
		<div class="skillBody" v-if="viewSkill">
			<div class="clickable" @click="viewInstructions = true" data-tour="7" v-if="skill.instructions.length > 0">Instructions</div>
			<div class="clickable" @click="viewIntents = true" data-tour="8">Intents</div>
			<div class="clickable" @click="viewInfos = true" data-tour="9">Infos</div>
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
