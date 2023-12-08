<script setup lang="ts">
import config from '~/config';
import { tpl } from '~/helpers/str';
const runtimeConfig = useRuntimeConfig();
const route = useRoute();
</script>
<template>
    <CommonBreadcrumbs :items="[{title: tpl('{{!bc}}Home'), to: '/'}, {helper: 'context'}, {title: tpl('{{!bc}}Catalogs'), to: '/catalogs', disabled: true}]" />
    <ContainersList
      :key="route.fullPath"
      :header-title="tpl('{{ header.label }} collection')"
      :data-url="config.getUrl(config.API_BASE_URL + route.fullPath, runtimeConfig)"
      :exclude-fields="['iri']"
    />
</template>
