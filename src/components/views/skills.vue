<template>
  <div class="tileContainer horizontal">
		<skill v-for="(skill, index) in skills" :key="skill.name" :skill="skill" :index="index"/>
		<actions-menu :menuItems="menuItems"/>
		<v-tour name="skills" :steps="steps" :callbacks="tourCallbacks"/>
	</div>
</template>

<script src="../js/skills.js"></script>
