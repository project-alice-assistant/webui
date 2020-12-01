<template>
	<i :class="classes" aria-hidden="true" v-tooltip="tooltip ? $t(tooltip) : ''" @click="handleClick"/>
</template>

<style src="../css/reactiveIcon.css" scoped/>
<script src="../js/reactiveIcon.js"/>
