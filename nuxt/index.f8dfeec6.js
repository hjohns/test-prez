import{_ as p}from"./Breadcrumbs.be7fc2cc.js";import{_ as u}from"./Form.vue.e7f35e3a.js";import{f as _,r,c as f,b as d,g as t,h,F as b,o as l,i as g}from"./entry.bcf69c92.js";import{c as a}from"./config.cac9e108.js";import{t as e}from"./str.08505d9c.js";import"./_plugin-vue_export-helper.c27b6911.js";import"./nuxt-link.a33cd54d.js";import"./Loading.vue.1b0e05ea.js";import"./rdf.477be283.js";import"./axios.7bde71be.js";const y={__name:"index",setup(C){const o=_(),i=r(o.params.id),n=g(),s=r(o.params.collectionId);return(v,x)=>{const m=p,c=u;return l(),f(b,null,[d(m,{items:[{title:t(e)("{{!bc}}Home"),to:"/"},{helper:"context"},{title:t(e)("{{!bc}}Catalogs"),helper:"relative",options:3},{title:`${i.value}`,helper:"relative",options:2},{title:t(e)("{{!bc}}Collections"),helper:"relative",options:1},{title:`${s.value}`,disabled:!0}]},null,8,["items"]),(l(),h(c,{key:t(o).fullPath,"header-title":t(e)("{{ header.label }} resource"),"form-title":t(e)("form-title"),"data-url":t(a).getUrl(t(a).API_BASE_URL+t(o).fullPath,t(n))},null,8,["header-title","form-title","data-url"]))],64)}}};export{y as default};