import { type OverrideTexts } from "./constants";

export default <OverrideTexts>{
    '{{!bc}}Home': 'Home',
    
    'form-title': `{{#fields.skos:prefLabel}}
    {{fields.skos:prefLabel}}
  {{/fields.skos:prefLabel}}
  {{^fields.skos:prefLabel}}
    {{#fields.dcterms:title}}
      {{fields.dcterms:title}}
    {{/fields.dcterms:title}}
    {{^fields.dcterms:title}}
      {{#fields.rdfs:label}}
        {{fields.rdfs:label}}
      {{/fields.rdfs:label}}
      {{^fields.rdfs:label}}
        {{fields.schema:name}}
      {{/fields.rdfs:label}}
    {{/fields.dcterms:title}}
  {{/fields.skos:prefLabel}}`
};
