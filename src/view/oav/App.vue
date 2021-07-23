<template>
    <div id="app">
        <keep-alive :include="keepAlive">
            <router-view />
        </keep-alive>
    </div>
</template>

<script>
export default {
    name: 'App',
    computed: {
        keepAlive() {
            return this.$store.getters.keepAlive
        },
    },
    creted() {},
}
</script>

<style lang="stylus" scoped>
#app
    height: 100%;
    width: 100%;
</style>
