<script setup>
import { useRDFStore } from "@/stores/rdf";
import { storeToRefs } from "pinia";

const rdfStore = useRDFStore()
const { loading, success, error, prefixes, prez } = storeToRefs(rdfStore)

const matchall = ref([]);

const subject = ref('');
const predicate = ref('');
const object = ref('');
const url = ref('https://api.gswa.dev.kurrawong.ai/v/vocab/df:vertical-depth-reference-systems')

onMounted(async ()=> {
  await rdfStore.load(url.value);
  console.log('mounted')
  //await vocabStore.fetchAndParse();
  loadStuff();
})

async function reload() {
  await rdfStore.load(url.value);
  loadStuff();
}

const countRef = ref(0);
const dataRef = ref({});

function loadStuff() {
  console.log("LOAD")
  matchall.value = prez.value.store.getQuads(null, null, null, null);
  console.log("MATCH")
  const countData = prez.value.firstQuad(null, 'prez:count', null, null);
  console.log("COUNT")
  if(countData !== null) {
    countRef.value = countData.object.value;
    const lookupFilter = rdfStore.getPrefixExpandedFilter({predicate: 'rdf:type', object: countData.subject.value});
//    alert(loaderStore.prefixer('rdf:type'));
    dataRef.value = rdfStore.store.getSubjects(lookupFilter.predicate, countData[0].subject, null);
    //dataRef.value = loaderStore.getMatchedData({predicate: 'rdf:type', object: countData[0].subject})
  }
}

function update() {
  matchall.value = prez.value.store.getQuads(
    subject.value != '' ? subject.value : null, 
    predicate.value != '' ? predicate.value : null,
    object.value != '' ? object.value : null, null);  
}

</script>

<template>
  <div>COUNT = {{ countRef }}</div>
  <div>DATA = {{ dataRef }}</div>
  <div>
    <h1>Vocab listing</h1>

    <form method="post" v-on:submit="(e)=>{ e.preventDefault(); update()}">
      <div>
        <input placeholder="url" name="url" v-model="url" style="width:500px;" />
        <button type="button" v-on:click="reload()">Reload</button>
      </div>
      <div>
        <input placeholder="subject" name="subject" v-model="subject" />
        <input placeholder="predicate" name="predict" v-model="predicate" />
        <input placeholder="object" name="object" v-model="object" />
      </div>
      <div>
        <button type="submit">Refresh</button>
      </div>
    </form>
    {{ subject }} - {{ predicate }} - {{ object }}

    <div>
      <div>Loading = {{ loading }}</div>
      <div>Error = {{ error }}</div>
      <div>Success = {{ success }}</div>
    </div>

    <h2>Prefixes</h2>
    {{ prefixes }}


    <h2>Match All</h2>
    <table>
      <thead><tr><th>subject</th><th>predicate</th><th>object</th></tr></thead>
      <tbody>
        <tr v-for="(m, idx) in matchall">
          <td>{{ idx }}# {{ m.subject.value }}</td>
          <td>{{ m.predicate.value }}</td>
          <td>{{ m.object.value }}</td>
        </tr>
      </tbody>
    </table>

  </div>
</template>
