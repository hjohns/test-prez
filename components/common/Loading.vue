<script setup lang="ts">
const props = defineProps<{loading: boolean, error: string|null}>();
</script>
<template>
    <v-progress-circular
    v-if="loading"
    :size="50"
    color="primary"
    indeterminate
    >
    </v-progress-circular>
    <v-alert v-if="error" :text="error!"></v-alert>
</template>