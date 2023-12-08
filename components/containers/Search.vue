<script setup lang="ts">
import { useRDFStore } from "@/stores/rdf";
import type { List } from '~/lib/prez.d';
import { storeToRefs } from "pinia";

const props = defineProps<{dataUrl:string, headerTitle?:string, excludeFields?: string[], fields?:string[], info?:boolean}>();

const rdfStore = useRDFStore();
const { loading, success, error, prez } = storeToRefs(rdfStore);
const parseError = ref<string|null>(null);

const page = ref(1);
const list = ref<List|undefined>(undefined);

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
      list.value = prez.value!.search(['skos:prefLabel', 'rdfs:label']);
      list.value.list.sort((a:any, b:any)=>{
        const aw = parseInt(a['prez:searchResultWeight']);
        const bw = parseInt(b['prez:searchResultWeight']);
        if(aw > bw) {
          return 1;
        } else if(aw < bw) {
          return -1;
        } else {
          return 0;
        }
      })
    } catch(ex) {
      parseError.value = (ex as Error).message;
    }
  }
}

</script>

<template>
  <CommonSearch v-if="list"
    :header-title="headerTitle"
    :list="list"
    :fields="fields"
    :exclude-fields="excludeFields"
    :info="info"
    :links="prez!.headerLinks"
  />
  <CommonLoading :loading="loading" :error="error" />
  <CommonLoading :loading="false" :error="parseError" />

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