<script setup lang="ts">
import { useRDFStore } from "@/stores/rdf";
import type { Form } from '~/lib/prez.d';
import { storeToRefs } from "pinia";
import type { Prez } from "~/lib/prez";
import { emit } from "process";

const props = defineProps<{dataUrl:string, formTitle?:string, excludeFields?: string[], headerTitle?:string, fields?:string[], info?:boolean}>();

const rdfStore = useRDFStore();
const { loading, success, error, prez } = storeToRefs(rdfStore)

const page = ref(1);
const form = ref<Form|undefined>(undefined);
const parseError = ref<string|null>(null);

onMounted(async ()=> {
  await initData();
})

const route = useRoute();
const query = ref(route.query);
watch(()=> query.value = route.query, ()=>{});

async function initData() {
  await rdfStore.load(props.dataUrl, { params: { page: page.value } });

  if(success.value) {
    try {
      parseError.value = null;
      form.value = prez.value!.form(
        ['skos:prefLabel', 'dcterms:title', 'rdfs:label', 'schema:name'],
        ['skos:definition', 'dcterms:description', 'schema:description']
      );
        //['skos:prefLabel', 'rdfs:label']);
    } catch(ex) {
      parseError.value = (ex as Error).message;
    }
  }

  //emitPrezUpdate(prez.value);
}

// Emit an event with the updated title
function emitPrezUpdate(newPrez:Prez) {
  // Example event name: 'updateBreadcrumbTitle'
  // Emit the event with the new title information
  //emit('updatePrez', newPrez);
}

</script>

<template>
  <CommonForm v-if="form" 
    :header-title="headerTitle"
    :form-title="formTitle" 
    :form="form"
    :fields="fields"
    :exclude-fields="excludeFields"
    :info="info"
    :links="prez!.headerLinks"
  />
  <CommonLoading :loading="loading" :error="error" />
  <!-- <div>
    <nuxt-link to="?page=2">Page 2</nuxt-link>
  </div>
  <div>PAGE = {{ query.page }}</div>
  <div>

    <div>
      <div>URL = {{ listUrl }}</div>
      <div>Loading = {{ loading }}</div>
      <div>Error = {{ error }}</div>
      <div>Success = {{ success }}</div>
    </div>

  </div> -->
</template>