<script setup lang="ts">

import type { Form } from '~/lib/prez.d';
import registry from './registry';
const props = defineProps<{fieldName: keyof typeof registry, form:Form, info:any}>();

</script>
<template>
    <component :is="registry[fieldName]" :info="info" :form="form"/>
</template>
