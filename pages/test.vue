<script setup lang="ts">
import { useRDFStore } from "@/stores/rdf2";
import { storeToRefs } from "pinia";
import { emit } from "process";
import config from "~/config";
import type { PrezForm } from "~/lib/prez2.d";

const rdfStore = useRDFStore();
const { loading, success, error, prez } = storeToRefs(rdfStore)

const page = ref(1);
const form = ref<PrezForm|undefined>(undefined);
const parseError = ref<string|null>(null);

onMounted(async ()=> {
    await rdfStore.load(config.API_BASE_URL + '/' + config.CATALOG_LIST_URL + '/bblck-ctlg:bblocks',
        { params: { page: page.value } });

    form.value = prez.value?.form({
        classPredicates: ['rdf:type'],
        labelPredicates: ['skos:prefLabel', 'dcterms:title', 'rdfs:label', 'schema:name'],
        descriptionPredicates: ['skos:definition', 'dcterms:description', 'schema:description']
    })
})
//['http://www.w3.org/1999/02/22-rdf-syntax-ns#type']
</script>
<template>
    OUTPUT:
<pre>{{ form }}</pre>
</template>