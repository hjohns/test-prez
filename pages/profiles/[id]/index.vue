<script setup>
import { ref } from 'vue';
import config from '~/config';
import { tpl } from '~/helpers/str';

const route = useRoute();
const id = ref(route.params.id);

</script>
<template>
  <CommonBreadcrumbs :items="[
    {title: tpl('{{!bc}}Home'), to: '/'},
    {title: tpl('{{!bc}}Profiles'), helper: 'relative', options: 1},
    {title: `${id}`, disabled: true}
  ]" />
 
  <ContainersForm
    :header-title="tpl('{{ header.label }} resource')"
    form-title="{{ fields.dcterms:title }}"
    :data-url="config.API_BASE_URL + route.path"
  />

</template>

