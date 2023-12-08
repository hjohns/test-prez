<script setup lang="ts">
import { tpl } from '~/helpers/str';
import config from '~/config';
const route = useRoute();
const router = useRouter();
const runtimeConfig = useRuntimeConfig();

const q = ref(route.query.q);

function submitClick() {
    router.push({path: '/search', query: {...route.query, q: q.value}});
}
const searchTermQuery = computed(() => {
    return 'q' in route.query && route.query.q !== '' ? route.fullPath : null;
});

</script>
<template>

    <div class="justify-center">
    
        <v-card
        class="mx-auto"
        max-width="800"
        flat
    >
        <v-card-text>
            <h1 class="mb-5">Text search</h1>
            
            <form class="d-flex justify-end mt-5" method="get" @submit.stop.prevent="submitClick">
                <v-text-field
                    :loading="loading"
                    density="compact"
                    variant="solo"
                    label="Enter text to lookup"
                    append-inner-icon="mdi-magnify"
                    single-line
                    hide-details
                    :autofocus="true"
                    name="q"
                    v-model="q"
                    @click:append-inner="onClick"
                ></v-text-field>
                <v-btn type="submit" color="primary" class="ml-5 pl-4 pr-4" size="medium">Search</v-btn>
            </form>
        </v-card-text>
        </v-card>

        <ContainersSearch v-if="searchTermQuery"
            :key="searchTermQuery"
            :header-title="'{{ count }} Result(s)'"
            :data-url="config.getUrl(config.API_BASE_URL + route.fullPath, runtimeConfig)"
            :fields="['prez:searchResultMatch', 'prez:searchResultPredicate', 'prez:searchResultWeight']"
        />

    </div>
</template>