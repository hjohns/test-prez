<script setup lang="ts">
import type { List, HeaderLink } from '~/lib/prez.d';
import { template } from '~/helpers/str';
const props = defineProps<{list: List, headerTitle?:string, excludeFields?: string[], fields?: string[], info?: boolean, links?: HeaderLink[]}>();
const excludeFields = props.excludeFields ? props.excludeFields : [/^prez:./]
const fields = (props.fields ? props.fields : Object.keys(props.list.listHeaders)).filter(field=>{
  // check it doesn't match one of the exclude fields
  for(const idx in excludeFields) {
    if(field.match(excludeFields[idx])) {
      if(props.fields && props.fields.indexOf(field) >= 0) { // explicitly requested
        return true;
      }
      return false;
    }
  }
  return true;
});
console.log("LIST =",props.list)
const route = useRouter();
</script>
<template>
  <div style="position: relative">
    <div v-if="headerTitle && list" class="text-h3 mb-5 mt-2">{{ template(headerTitle, list) }}</div>
    <v-chip variant="flat" style="position: absolute; right: 0;top:0;">{{ list.header.label }}</v-chip>
    <v-table theme="dark" v-if="list">
      <thead>
        <tr>
          <th style="white-space: nowrap;" v-for="field in fields">
            {{ field in list.listHeaders ? list.listHeaders[field].label : `${field} missing` }}
            &nbsp;<a v-if="field in list.listHeaders" :href="list.listHeaders[field].iri" :title="field"><v-icon icon="mdi-link"></v-icon></a>
            <div v-if="info">{{ field }}</div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in list.list" @click="typeof(item['prez:link']) == 'string' ? $router.push(item['prez:link']) : null">
          <td v-for="field in fields">
            <!-- <a href="#" :title="JSON.stringify(item._meta[field])">
            </a> -->
            <div :title="field in item ? item[field] : null" class="td-max" >
              <v-btn class="mr-4" v-if="field == 'prez:link'" :to="link" v-for="link in typeof(item[field]) == 'object' ? item[field] : [item[field]]">{{ link }}</v-btn>
              {{ field != 'prez:link' ? (field in item ? item[field] : `"${field}" not found`) : '' }}
            </div>
            <!-- {{ item }} -->
          </td>
        </tr>
      </tbody>
    </v-table>
    <CommonProfileSelector :links="links" />
  </div>
</template>

<style scoped>
.td-max {
  overflow: hidden;
   text-overflow: ellipsis;
   display: -webkit-box;
   -webkit-line-clamp: 2; /* number of lines to show */
           line-clamp: 2;
           text-overflow: ellipsis; 
   -webkit-box-orient: vertical;
}
tbody tr td {
  padding-top:8px !important;
  padding-bottom:8px !important;
}
tbody tr:hover {
  background-color: #333 !important;
  cursor:pointer;
}
.v-table thead {
  background-color: rgb(24,103,192);
}
.v-table thead th {
  color:white !important;
}
.v-table tbody {
  background-color: #eee;
  color:#333;
}
.v-table tbody tr:hover {
  background-color: #ddd !important;
}
.v-table tbody tr td {
  border-right:1px solid #bbb;
  border-bottom:1px solid #bbb !important;
}
.v-table tbody tr td:last-child {
  border-right:0;
}
.v-table tbody tr:last-child td {
  border-bottom:0 !important;
}
</style>