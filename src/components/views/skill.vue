<template>
	<div :style="skill.name === 'ProjectAliceDemo' ? 'margin-left: 200px;' : ''" class="skill" data-tour="0">
		<div class="skillTitle">
			<div class="skillName">{{ skill.name }}</div>
			<div class="skillIcon"><i :class="skill.icon" aria-hidden="true"/></div>
		</div>
		<overlay :header="`${$t('skill.info')} - ${skill.name}`" :opened="viewInfos" :visible="viewInfos" animate="zoom-in" @closed="viewInfos = false">
			<ul class="fa-ul">
				<li><span class="fa-li"><i aria-hidden="true" class="fas fa-code-branch"></i></span>{{ skill.version }}</li>
				<li>
					<span class="fa-li"><i aria-hidden="true" class="fas fa-compress-arrows-alt"></i></span>{{ skill.aliceMinVersion }}
				</li>
				<li><span class="fa-li"><i aria-hidden="true" class="fas fa-user"></i></span>{{ skill.author }}</li>
				<li v-if="skill.maintainers">
					<span class="fa-li"><i aria-hidden="true" class="fas fa-users"></i></span>{{ skill.maintainers.join(', ') }}
				</li>
				<li><span class="fa-li"><i aria-hidden="true" class="fas fa-folder-open"></i></span>{{ skill.category }}</li>
				<li><span class="fa-li"><i aria-hidden="true" class="fas fa-quote-right"></i></span>{{ skill.description }}</li>
			</ul>
		</overlay>
		<overlay :header="`${$t('skill.intents')} - ${skill.name}`" :opened="viewIntents" :visible="viewIntents" animate="zoom-in" @closed="viewIntents = false">
			<p v-for="(utterances, intent) in skill['intents']" v-if="utterances.length > 0">
				<strong>{{ intent }}: «</strong>
				<i>{{ utterances[Math.floor(Math.random() * utterances.length)] }}</i> <strong>»</strong>
			</p>
		</overlay>
		<overlay :header="`${$t('skill.instructions')} - ${skill.name}`" :opened="viewInstructions" :visible="viewInstructions" animate="zoom-in" @closed="viewInstructions = false">
			<vue-simple-markdown :source="skill.instructions"/>
		</overlay>
		<div v-if="viewSkill" class="skillBody">
			<div class="clickable" data-tour="7" @click="$tours['skills'].currentStep !== -1 ? '' : viewIntents = true">{{ $t('skill.intents') }}</div>
			<div class="clickable" data-tour="8" @click="$tours['skills'].currentStep !== -1 ? '' : viewInfos = true">{{ $t('skill.info') }}</div>
			<div v-if="skill.instructions && skill.instructions.length > 0" class="clickable" data-tour="9" @click="$tours['skills'].currentStep !== -1 ? '' : viewInstructions = true">{{ $t('skill.instructions') }}</div>
			<div class="skillActions">
				<i v-if="skill.settings && Object.keys(skill.settings).length" v-tooltip="$t('tooltips.settings')" aria-hidden="true" class="fas fa-cog clickable" data-tour="1" @click="showSettings"/>
				<i v-if="!skill.required" v-tooltip="skill.active ? $t('tooltips.stop') : $t('tooltips.start')" aria-hidden="true" class="fas fa-power-off clickable" data-tour="2" @click="toggle"/>
				<i v-if="skill.active" v-tooltip="$t('tooltips.reload')" aria-hidden="true" class="fas fa-sync clickable" data-tour="3" @click="reloadSkill"/>
				<i v-if="skill.updateAvailable" v-tooltip="$t('tooltips.update')" aria-hidden="true" class="fas fa-arrow-alt-circle-up clickable" data-tour="4" @click="update"/>
				<i v-if="!skill.required" v-tooltip="$t('tooltips.remove')" aria-hidden="true" class="far fa-times-circle clickable" data-tour="5" @click="remove"/>
			</div>
			<div class="skillStatusAround"/>
			<div :class="skill.active ? 'active' : 'disabled'" class="skillStatus" data-tour="6"/>
		</div>
	</div>
</template>

<style scoped src="../css/skill.css"/>
<style scoped src="../css/tour.css"/>

<script src="../js/skill.js"/>
