<script setup lang="ts">
import type { BreadcrumbItem } from './Breadcrumbs.d';
import { getContextBreadcrumbTitle, getRelativePath } from "~/helpers/routing"

const enhanceBreadcrumbs = (breadCrumbs: BreadcrumbItem[], fullPath:string) => {
    return breadCrumbs.map(bc=>{
        if(bc.helper == 'context') {
            const ctx = getContextBreadcrumbTitle(fullPath);
            if(ctx) {
                return { ...bc, title: ctx};
            } else {
                return null;
            }
        } else if(bc.helper == 'relative') {
            return { ...bc, to: getRelativePath(fullPath, bc.options!)};
        }
        return bc;
    }).filter(bc=>bc ? bc : false);
}

const route = useRoute();
const props = defineProps<{items: BreadcrumbItem[]}>();
</script>
<template>
    <v-breadcrumbs
        :items="enhanceBreadcrumbs(items, route.fullPath)"
    ></v-breadcrumbs>
</template>
<style scoped>
.v-breadcrumbs {
    font-size:14pt;
    padding-left:0;
}
</style>
