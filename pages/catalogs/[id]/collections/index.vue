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
    {title: tpl('{{!bc}}Catalogs'), helper: 'relative', options: 2},
    {title: `${id}`, helper: 'relative', options: 1},
    {title: tpl('{{!bc}}Collections'), disabled: true}
  ]" />

  <ContainersList 
    :key="route.fullPath"
    :header-title="tpl('{{ header.label }} collection')"
    :data-url="config.getUrl(config.API_BASE_URL + route.fullPath, runtimeConfig)"
    :exclude-fields="['iri']"
  />
</template>
