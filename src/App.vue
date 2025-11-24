<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <div id="app">
    <header>

    </header>
    <RouterView />
  </div>
</template>

<style>
/* 全局基础样式 */
* {
    font-family: "JetBrains Mono", "Microsoft YaHei", Helvetica, Arial, sans-serif;
    font-size: small;
    letter-spacing: 0.08em;
    line-height: 1.5;
}

/* body样式 */
body {
    margin: 0;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(128, 128, 128, 0.3);
}
</style>
