<template>
	<div class="container flexrow yscroll">
		<actions-menu :menuItems="menuItems" data-tour="10"/>
		<v-tour name="skills" :steps="steps" :callbacks="tourCallbacks"/>
		<skill v-for="skill in skillsToDisplay" v-if="!shopOpen" :key="skill.name" :skill="skill"/>
		<store-skill v-for="skill in $store.state.storeSkills" v-if="shopOpen && !skill.installed" :key="skill.name" :ref="skill.name.toLowerCase()" :addMethod="addSkillToDownload" :removeMethod="removeSkillToDownload" :skill="skill"/>
	</div>
</template>

<script src="../js/skills.js"/>
