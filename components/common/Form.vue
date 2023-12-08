<script setup lang="ts">
import type { Form, HeaderLink } from '~/lib/prez.d';
import { template } from '~/helpers/str';
import registry from './widgets/registry';

const props = defineProps<{form: Form, formTitle?:string, headerTitle?:string, excludeFields?: string[], fields?: string[], info?: boolean, links?: HeaderLink[]}>();
const excludeFields = props.excludeFields ? props.excludeFields : [/^prez:./];

const customWidgets:Record<string, boolean>= {};
const fields = (props.fields ? props.fields : Object.keys(props.form.formHeaders))
  .filter(field=>{
    // check the field to output is available
    if(!(field in props.form.formHeaders) || !(field in props.form.fields)) {
      console.warn(`${field} not found in form\n(${Object.keys(props.form.formHeaders)})`)
      return false;
    }
    // if this field is in the registry, then only exclude if we have an exact match
    if(field in registry) {
      if((excludeFields as string[]).indexOf(field) >= 0) {
        if(props.fields && props.fields.indexOf(field) >= 0) { // explicitly requested
          return true;
        }
        return false;
      } else {
        return true;
      }
    } else {
      // check it doesn't match one of the exclude fields
      for(const idx in excludeFields) {
        if(field.match(excludeFields[idx])) {
          return false;
        }
      }
      return true;
    }
  });

const isSubForm = (field:string) => {
  return Array.isArray(props.form.fields[field]) && typeof(props.form.fields[field][0]) == 'object'
}

const isStringArray = (field:string) => {
  return Array.isArray(props.form.fields[field]) && typeof(props.form.fields[field][0]) == 'string'
}

const route = useRouter();

</script>
<template>
  <div class="form" style="position:relative" v-if="form && form.count > 0">
    <div v-if="headerTitle && form" class="text-h3 mb-5 mt-2">{{ template(headerTitle, form) }}</div>
    <v-chip v-if="form.header.label" variant="flat" style="position: absolute; right: 0;top:0;">{{ form.header.label }}</v-chip>
    <v-table theme="dark" v-if="form">
      <thead v-if="formTitle">
        <tr><th colspan="2">{{ template(formTitle, form) }}</th></tr>
      </thead>
      <tbody>
        <tr v-for="field in fields">
          <th style="white-space: nowrap;">
            {{ form.formHeaders[field].label }}
            &nbsp;<a :href="form.formHeaders[field].iri" :title="field"><v-icon icon="mdi-link"></v-icon></a>
            <div v-if="info">{{ field }}</div>
          </th>
          <td v-if="!(field in registry)" :class="isSubForm(field) ? 'td-nest' : undefined">
            <v-chip size="x-small" v-if="form.fields._meta?.[field]?.type">{{ form.fields._meta[field].type }}</v-chip>

            <div :title="field in form.fields._meta! && form.fields[field] != form.fields._meta![field].value ? form.fields._meta![field].value : null" >
              <nuxt-link v-if="field == 'prez:link'" :to="form.fields[field]">{{ form.fields[field] }}</nuxt-link>
              {{ (typeof(form.fields[field]) != 'object' && field != 'prez:link' ? form.fields[field] : '') }}
              {{isStringArray(field) ? form.fields[field].join(', ') : '' }}
              <CommonForm
                v-for="f in form.fields[field]" 
                v-if="isSubForm(field)"
                :form="f"
                :exclude-fields="excludeFields"
              />
            </div>
          </td>
          <td v-else>
            <CommonWidgets v-if="field in registry" :form="form" :info="form.fields[field]" :field-name="field as keyof typeof registry" />
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
/* tbody tr:hover, tbody tr:hover table:hover * {
  background-color: #555 !important;
} */
th {
  width: 1%;
}
td {
  width: 100%;
}
td a {
  color:#333;
}
td.td-nest {
  padding-right:0 !important;
}

table .td-nest table td, table .td-nest table th  {
  background-color: #eee;
}

table .td-nest .v-table {
  border-left:3px solid #ccc;
}

td .v-chip {
  float:right;
}
.v-table thead {
  background-color: rgb(24,103,192);
  /* background-color: #19198c; */
}
.v-table thead th {
  color:white !important;
}
.v-table tbody {
  background-color: #eee;
  color:#333;
}
.v-table tbody tr td, .v-table tbody tr th {
  border-right:1px solid #bbb;
  border-bottom:1px solid #bbb !important;
}
.v-table tbody tr td:last-child {
  border-right:0;
}
.v-table tbody tr:last-child td, .v-table tbody tr:last-child th {
  border-bottom:0 !important;
}
.v-table tbody tr:hover td, .v-table tbody tr:hover th {
  background-color: #ddd !important;
}

td.td-nest div.form .v-table {
  margin-bottom:5px;
  border-bottom:2px solid #ddd;
}
td.td-nest div.form .v-table {
  margin-top:5px;
  border-top:1px solid #ddd;
}

</style>