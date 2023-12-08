

// export const API_BASE_URL = 'https://rdframe.sgraljii8d3km.ap-southeast-2.cs.amazonlightsail.com'
// export const DATASET_LIST_URL = '/shacl-profiles/sp-dataset-listing/results'
// export const DATASET_OBJECT_URL = '/shacl-profiles/sp-dataset-object/results'

import type { RuntimeConfig } from "@nuxt/schema";

//export const API_BASE_URL = 'http://localhost:3000/bblocks6';
//export const API_BASE_URL = 'https://ogcprez.sgraljii8d3km.ap-southeast-2.cs.amazonlightsail.com';
export const API_BASE_URL = 'https://prez-v4.sgraljii8d3km.ap-southeast-2.cs.amazonlightsail.com';
export const CATALOG_LIST_URL = 'catalogs'

const getUrl = (url:string, cfg:RuntimeConfig) => {
    if(cfg.app.baseURL) {
        return url.replace(cfg.app.baseURL, "");
    } else {
        return url;
    }
}

export default {
    getUrl,
    API_BASE_URL,
    CATALOG_LIST_URL
}
