import { acceptHMRUpdate, defineStore } from 'pinia'

import { type AxiosRequestConfig } from 'axios';
import { DataFactory } from "n3";
const { namedNode } = DataFactory;
import { Prez } from '~/lib/prez2';

export const useRDFStore = defineStore('rdf', {
  // other options...

  state: ()=>({
    cache: {} as Record<string, Prez>,
    loading: false,
    error: <string|null>'',
    success: false,
    prez: <Prez|null>null
  }),

  actions: {
    
    clearCache() {
      this.cache = {};
    },

    async load(apiUrl:string, apiConfig?: AxiosRequestConfig) {
      try {
        // initialise the state
        this.loading = true;
        this.success = false;


//        console.log(response.headers.link);
//        await this.prez.load(response.data);

        const hash = apiUrl + JSON.stringify(apiConfig);
        if(hash in this.cache) {
          this.prez = this.cache[hash];
        } else {
          this.prez = new Prez();
          await this.prez.fetch(apiUrl, apiConfig);
          this.cache[hash] = this.prez as Prez;
        }
        // successfully processed
        this.success = true
        this.error = null

      } catch (error:any) {

        // set the error status
        this.error = error.message
        this.success = false

      } finally {
        // always set loading to complete
        this.loading = false
      }
    }    
  },

})
