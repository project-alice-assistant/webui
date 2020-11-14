<template>
  <div class="tileContainer horizontal">
		<skill v-for="(skill, index) in skills" :key="skill.name" :skill="skill" :index="index"/>
		<v-tour name="skills" :steps="steps" :callbacks="tourCallbacks"></v-tour>
	</div>
</template>

<script src="../js/skills.js"></script>
