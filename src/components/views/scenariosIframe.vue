<template>
    <portal-target id="scenarios-portal-target" name="scenarios-iframe">
        <iframe id="nodered" v-show="$route.name == 'Scenarios'" title="nodered" :src="'//'+this.$store.state.settings['aliceIp']+':1880'"></iframe>
    </portal-target>
</template>

<style src="../css/scenariosIframe.css" scoped></style>
<script src="../js/scenariosIframe.js"></script>