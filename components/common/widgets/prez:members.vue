<script setup lang="ts">
import type { Form } from '~/lib/prez.d';
const props = defineProps<{info: any, form:Form}>();
</script>

<template>
    <v-btn :to="info[0].fields['prez:link']">View Members</v-btn>
</template>

<style scoped>
.v-btn {
    text-transform: unset !important;
    color:white;
}

</style>