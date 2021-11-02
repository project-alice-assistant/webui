<template>
	<div :class="{'modified':skill.modified}" class="skill">
		<div class="skillTitle">
			<svg class="skillName">
				<text y="15">{{ skill.name }}</text>
			</svg>
			<div class="skillIcon"><i :class="skill.icon" aria-hidden="true"/></div>
		</div>
		<div class="skillAuthor">
			<i aria-hidden="true" class="fas fa-user"/> <span class="clickable">{{ skill.author }}</span>
		</div>
		<div class="skillDescription">
			{{ skill.description }}
		</div>
		<div class="download" @click="startEditing">
			<i aria-hidden="true" class="fas fa-cogs clickable"/>
		</div>
	</div>
</template>

<style scoped>
.skill {
	background-color: var(--windowBG);
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	height: 200px;
	margin: 15px 0 0 15px;
	max-height: 200px;
	min-height: 200px;
	min-width: 300px;
	overflow: hidden;
	position: relative;
	transition: var(--shortAnimation);
	width: 19%;
}

.skill:hover {
	transform: var(--lightLift)
}

.skill:hover > .skillTitle {
	color: var(--hover)
}

.skill:hover .skillIcon {
	font-size: 1.1em;
}

.skillTitle {
	background-color: var(--secondary);
	box-sizing: border-box;
	height: 25px;
	width: 100%;
}

.skillNameeee {
	align-items: center;
	display: flex;
	font-size: 1em;
	height: 22px;
	margin-left: 5px;
	max-height: 22px;
	max-width: 220px;
	width: 220px;
}

.skillName {
	height: 21px;
	margin: 2px;
	max-height: 21px;
	max-width: 250px;
	width: 250px;
}

.skillName text {
	fill: var(--text);
	pointer-events: none;
	text-anchor: start;
	text-shadow: 2px 2px 2px var(--accent);
}

.skillIcon {
	position: absolute;
	right: 3px;
	top: 3px;
	transition: var(--shortAnimation);
}

.skillAuthor {
	margin: 5px;
	overflow: hidden;
	width: 100%;
}

.skillDescription {
	background-color: var(--mainBG);
	border: 1px solid var(--text);
	box-sizing: border-box;
	color: var(--text);
	font-size: 0.9em;
	margin: 5px auto auto;
	max-height: 110px;
	min-height: 110px;
	overflow: hidden;
	padding: 5px;
	text-align: justify;
	width: 90%;
}

.download {
	bottom: 0;
	font-size: 1.5em;
	left: 0;
	margin-left: 5px;
	position: absolute;
}

.modified {
	background: darkred;
}

</style>
<script>
export default {
	name:    'editSkillTile',
	data:    function () {
		return {}
	},
	props:   [
		'skill'
	],
	methods: {
		startEditing() {
			this.$emit('skill-selected', this.skill)
		}
	}
}
</script>
