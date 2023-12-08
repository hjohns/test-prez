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
    {title: tpl('{{!bc}}Profiles'), disabled: true}
  ]" />

  <ContainersList 
    :header-title="tpl('{{ header.label }} collection')"
    :data-url="config.API_BASE_URL + route.path"
    :fields="['skos:prefLabel', 'dcterms:identifier', 'iri']"
  />
</template>
