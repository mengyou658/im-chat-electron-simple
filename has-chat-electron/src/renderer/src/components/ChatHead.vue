<script setup lang="ts">
import { useMainStore } from "../store/main";
const store = useMainStore();
</script>

<template>
  <header class="head">
    <span class="name">{{ store.reciver.Name }}</span>
  </header>
</template>

<style scoped lang="less">
.head {
  height: 5%;
  padding: 0 20px;
  display: flex;
  width: 100%;
  background-color: #fff;
  align-items: center;
  .name {
    color: #272e36;
    font-size: 16px;
    font-weight: 900;
  }
}
</style>
