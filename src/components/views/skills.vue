<template>
	<div class="container flexrow yscroll">
		<actions-menu :menuItems="menuItems" data-tour="10"/>
		<v-tour name="skills" :steps="steps" :callbacks="tourCallbacks"/>
		<skill v-for="skill in skills" :key="skill.name" :skill="skill" v-if="!shopOpen"/>
		<store-skill :ref="skill.name.toLowerCase()" v-for="skill in storeSkills" :key="skill.name" :skill="skill" :addMethod="addSkillToDownload" :removeMethod="removeSkillToDownload" v-if="shopOpen"/>
	</div>
</template>

<script src="../js/skills.js"/>
