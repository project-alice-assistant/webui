<template>
	<div class="skill">
		<div class="skillTitle">
			<div v-resize-text="{ratio: 1.3, minFontSize: '8px', delay: 200}" class="skillName">{{ skill.name }}</div>
			<div class="skillIcon"><i :class="skill.icon" aria-hidden="true"/></div>
		</div>
		<div class="skillAuthor">
			<i class="fas fa-user" aria-hidden="true"/> <span class="clickable">{{ skill.author }}</span>
		</div>
		<div class="skillDescription">
			{{ skill.desc }}
		</div>
		<div class="download" @click="handleDownloadClick">
			<i class="fas clickable" :class="{'fa-download': !isWanted && !isDownloading, 'fa-check': isWanted && !isDownloading, 'fa-spinner fa-spin': !isWanted && isDownloading}" aria-hidden="true"/>
		</div>
	</div>
</template>

<style src="../css/storeSkill.css" scoped></style>
<script src="../js/storeSkill.js"></script>
