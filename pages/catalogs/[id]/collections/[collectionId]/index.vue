<script setup>
import { ref } from 'vue';
import config from '~/config';
import { tpl } from '~/helpers/str';
const route = useRoute();
const id = ref(route.params.id);
const runtimeConfig = useRuntimeConfig();

const collectionId = ref(route.params.collectionId);
</script>

<template>
  <CommonBreadcrumbs :items="[
    {title: tpl('{{!bc}}Home'), to: '/'},
    {helper: 'context'},
    {title: tpl('{{!bc}}Catalogs'), helper: 'relative', options: 3},
    {title: `${id}`, helper: 'relative', options: 2},
    {title: tpl('{{!bc}}Collections'), helper: 'relative', options: 1},
    {title: `${collectionId}`, disabled: true}
  ]" />

  <ContainersForm
    :key="route.fullPath"
    :header-title="tpl('{{ header.label }} resource')"
    :form-title="tpl('form-title')"
    :data-url="config.getUrl(config.API_BASE_URL + route.fullPath, runtimeConfig)"
  />
</template>
