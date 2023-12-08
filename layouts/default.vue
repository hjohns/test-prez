<script setup>
import { ref, watch } from 'vue';

const route = useRoute();

const path = ref(route.path);
watch(()=> path.value = route.path, ()=>{});

</script>


<template>
  <v-app>

    <v-toolbar color="white" dark fixed app>
      <v-app-bar-nav-icon></v-app-bar-nav-icon>

      <v-toolbar-title><img style="width:160px;" src="https://kurrawong.ai/KurrawongAI_350.png" /></v-toolbar-title>

      <v-spacer></v-spacer>

      <CommonNavigation />

    </v-toolbar>
    
    <v-container fluid="">
      <slot></slot>
    </v-container>
  </v-app>
</template>

<style scoped>
.v-toolbar {
  border-bottom:2px solid #eee !important;
}
</style>
