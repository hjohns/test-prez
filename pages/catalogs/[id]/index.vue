<script setup>
import { ref } from 'vue';
import config from '~/config';
import { tpl } from '~/helpers/str';

const route = useRoute();
const id = ref(route.params.id);
const runtimeConfig = useRuntimeConfig();

</script>
<template>
  <CommonBreadcrumbs :items="[
    {title: tpl('{{!bc}}Home'), to: '/'},
    {helper: 'context'},
    {title: tpl('{{!bc}}Catalogs'), helper: 'relative', options: 1},
    {title: `${id}`, disabled: true}
  ]" />
  <ContainersForm
    :key="route.fullPath"
    :header-title="'{{ header.label }}'"
    :form-title="tpl('form-title')"
    :data-url="config.getUrl(config.API_BASE_URL + route.fullPath, runtimeConfig)"
  />

</template>

