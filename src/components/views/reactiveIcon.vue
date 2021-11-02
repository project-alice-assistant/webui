<template>
	<i v-tooltip="tooltip ? $t(tooltip) : ''" :class="classes" aria-hidden="true" @click="handleClick"/>
</template>

<style scoped src="../css/reactiveIcon.css"/>
<script src="../js/reactiveIcon.js"/>
