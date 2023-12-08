import { Util, Store, Parser, DataFactory, Quad, NamedNode, type Prefixes, Literal, type Quad_Subject, type OTerm, BlankNode } from "n3";
const { namedNode } = DataFactory;
import axios, { type AxiosRequestConfig } from 'axios';
import type { ListItem, List, HeaderLink, Form, Header } from './prez.d'
import { getDefaultLabelFromURIOrString, parseLinkHeader } from "@/helpers/str";

const filterRDFType = namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type');
const filterRDFSLabel = namedNode('http://www.w3.org/2000/01/rdf-schema#label');

export class Prez {
  public store: Store;
  private data: Quad[];
  private parser: Parser;
  public prefixes: Prefixes;
  public headerLinks: HeaderLink[];

  constructor() {
    this.store = new Store();
    this.parser = new Parser();
    this.data = [];
    this.prefixes = {};
    this.headerLinks = [];
  }

  async fetch(url:string, options?: AxiosRequestConfig) {
    try {
      
      options = {...options, headers: {
        "Accept": "text/anot+turtle"
      }}
      const response = await axios(url, options);
      if (response.status != 200) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      this.headerLinks = parseLinkHeader(response.headers['link']!);
      await this.load(await response.data);

    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error: ${error.message}`);
      } else {
        throw new Error(`An unknown error occurred.`);
      }
    }
  }

  async load(rdf: string) {
    // process the response through the N3 parser
    await this.parser.parse(rdf, (error, quad, prefixes)=>{
      if(prefixes) {
        this.prefixes = prefixes;
      }
      if(quad) {
        this.data.push(quad);
      }
    });
    this.store = new Store(this.data);    
  }

  expandAll(iri: string[]): string[] {
    return iri.map(item=>this.expand(item));
  }

  expand(iri: string): string {
    // Split the IRI into parts using ':' as the separator
    const parts = iri.split(':');
  
    // Check if the first part (before the first ':') is a valid prefix
    if (parts.length >= 2 && parts[0] in this.prefixes) {
      // Replace the prefix with its corresponding IRI
      parts[0] = this.prefixes[parts[0]].toString();
  
      // Join the modified parts back together to form the updated IRI
      return parts[0] + parts.slice(1).join(':');
    }
  
    return iri;
  };

  firstQuad(subject: OTerm, predicate: OTerm, object: OTerm | OTerm[], graph: OTerm):Quad|null {
    const quads = this.store.getQuads(subject, predicate, object, graph);
    if(quads && quads.length > 0) {
      return quads[0];
    } else {
      return null;
    }
  }

  list(labelPredicates: string[]=[], descriptionPredicates: string[]=[]): List {
    let mainSubject = '';
    let subjects: Quad_Subject[] = [];
    let count = 0;

    const countQuad = this.firstQuad(null, this.expand('prez:count'), null, null);
    if(countQuad !== null) {
      count = parseInt(countQuad.object.value);
      mainSubject = countQuad.subject.value;
      const predicateFilter = filterRDFType;
      subjects = this.store.getSubjects(predicateFilter, mainSubject, null);
    } else {
      throw new Error('prez:count predicate not found');
    }

    const mainHeaderMatches = this.store.getQuads(mainSubject, filterRDFSLabel, null, null);
    const mainShortName:string = this.compact(mainSubject);
    const result:List = {
      listHeaders: {},
      header: {
        label: mainHeaderMatches.length > 0 ? mainHeaderMatches[0].object.value : mainShortName,
        iri: mainSubject,
        link: mainSubject
      },
      count,
      list: [],
      iri: mainShortName
    };

    // expand out predicate labels to full IRI
    const expandedPredicateLabels = this.expandAll(labelPredicates);
    const expandedPredicateDescriptions = this.expandAll(descriptionPredicates);

    // loop through each item's subject in this list
    for (const si in subjects) {
      const subject = subjects[si].value;
      const item = this.getSubjectData(subject, expandedPredicateLabels, expandedPredicateDescriptions);
      Object.keys(item).filter(field=>field != '_meta').forEach(field=>{
        if(!(field in result.listHeaders)) {//} && !(mainSubject.match(/^_:/) && field == 'iri')) {
          result.listHeaders[field] = this.getHeader(this.expand(field), item[field]);
        }
      })
  
      result.list.push(item);
    }
    return result;
  }

  search(labelPredicates: string[]=[], descriptionPredicates: string[]=[]): List {
    const list = this.list(labelPredicates, descriptionPredicates);
    // expand out predicate labels to full IRI
    const expandedPredicateLabels = this.expandAll(labelPredicates);
    const expandedPredicateDescriptions = this.expandAll(descriptionPredicates);

    list.list.forEach(item=>{
      const child = this.getSubjectData(item.iri, expandedPredicateLabels, expandedPredicateDescriptions);
      console.log(child);
    })

    return list;
  }

  form(labelPredicates: string[]=[], descriptionPredicates: string[]=[],  subform?: string): Form {

    console.log("FORM")
    let count = 0;
    let mainSubject = subform ? subform : '';
    let mainObject = '';

    if(mainSubject == '') {
      const typeQuad = this.firstQuad(null, filterRDFType, null, null);
      if(typeQuad !== null) {
        mainSubject = typeQuad.subject.value;
        mainObject = typeQuad.object.value;
      } else {
        throw new Error('rdf:type predicate not found');
      }
    }

    const mainHeaderMatches = this.store.getQuads(mainSubject, filterRDFSLabel, null, null);
    const mainShortName:string = this.compact(mainSubject);

    const result:Form = {
      formHeaders: {},
      header: {
        label: mainHeaderMatches.length > 0 ? mainHeaderMatches[0].object.value : mainShortName,
        iri: mainSubject,
        link: mainSubject
      },
      count,
      fields: {},
      iri: this.compact(mainSubject)
    };

    // expand out predicate labels to full IRI
    const expandedPredicateLabels = this.expandAll(labelPredicates);
    const expandedPredicateDescriptions = this.expandAll(descriptionPredicates);

    let s = '';

    const item = this.getSubjectData(mainSubject, expandedPredicateLabels, expandedPredicateDescriptions);

    Object.keys(item).filter(field=>field != '_meta').forEach(field=>{
      if(!(field in result.formHeaders)) {
        // ignore internal
        if(mainSubject[0] != '_' || field != 'iri') {
          result.formHeaders[field] = this.getHeader(this.expand(field), item[field]);
        }
      }
    })
    result.count = Object.keys(result.formHeaders).length;

    result.fields = item;
  
    return result;
  }

  getSubjectData(subject: string, expandedPredicateLabels:string[], expandedPredicateDescriptions:string[]) {

    const item:ListItem = {
      iri: subject,
      _meta: {
      }
    };

    const matches = this.store.getQuads(subject, null, null, null);

    for(const mi in matches) {
      const match = matches[mi];
      const shortName:string = this.compact(match.predicate.value);

      const meta:any = this.getMeta(match, expandedPredicateLabels, expandedPredicateDescriptions);
      console.log(mi, ' = ' + match.object.value);

//      if(mi == '1') {
        console.log("XX")
  //    }

      // recrusive form
      if(match.object instanceof BlankNode) {
        
        // initialise the item, ready for many sub items
        if(!(shortName in item)) {
          item[shortName] = [];
        }

        // recursive lookup...
        item[shortName].push(this.form(expandedPredicateLabels, expandedPredicateDescriptions, '_:' + match.object.value));
      } else {
        const valueQuads = this.store.getQuads(subject, match.predicate.value, null, null);

        let value:string|string[]|undefined = undefined;//match.predicate.value;
        valueQuads.map(valueQuad=>{
          const { label, description } = this.getAnnotations(valueQuad.object.value, expandedPredicateLabels, expandedPredicateDescriptions);
          const useValue = (label !== undefined ? label : valueQuad.object.value);
          if(value !== undefined) {
            if(!Array.isArray(value)) {
              value = [value];
            }
            value.push(useValue);
          } else {
            value = useValue;
          }          
        })
        meta.value = (value === undefined ? match.predicate.value : value);
        item[shortName] = meta.value;
      }
      item._meta![shortName] = meta;

    }
  
    return item;
  }

  getMeta(quad:Quad, predicateLabels:string[], predicateDescriptions:string[]) {
    const { label, description } = this.getAnnotations(quad.predicate.value, predicateLabels, predicateDescriptions);
    // lookup data type, if available
    let type = undefined;
    let typeIRI = undefined;

    if((quad.object as any).datatype) {
      console.log("DATA TYPE = ", quad.object)
      typeIRI = (quad.object as any).datatype.value;
      const typeQuad = this.firstQuad(typeIRI, filterRDFSLabel, null, null);
      type = getDefaultLabelFromURIOrString(
        typeQuad !== null && typeQuad.object.value 
          ? typeQuad.object.value.toString()
          : typeIRI);
    }

    const meta = {
      iri: quad.predicate.value,
      label: label,
      description,
      typeIRI,
      type
    };
    return meta;

  }

  getHeader(subject:string, itemField:any):Header {
    const headerQuad = this.firstQuad(subject, filterRDFSLabel, null, null);
    const head:Header = {
      iri: subject,
      link: filterRDFSLabel.value,
      label: getDefaultLabelFromURIOrString(
        headerQuad !== null && headerQuad.object.value 
          ? headerQuad.object.value 
          : subject),
      description: ''
    }
    console.log('HEAD=', head, 'ITEM=', itemField)
    return head;

  }

  getAnnotations(subject: string, predicateLabels:string[], predicateDescriptions:string[]) {

    let label:string|undefined = undefined;
    let description:string|undefined = undefined;

    predicateLabels.map(predicate=>{
      if(label === undefined) {
        const quad = this.firstQuad(subject, predicate, null, null);
        if(quad) {
          label = quad.object.value;
        }
      }
    });

    predicateDescriptions.map(predicate=>{
      if(description === undefined) {
        const quad = this.firstQuad(subject, predicate, null, null);
        if(quad) {
          description = quad.object.value;
        }
      }
    });

    return {
      label,
      description 
    }
  }
  
  compact(iri: string): string {
    for (const prefix in this.prefixes) {
      if (iri.startsWith(this.prefixes[prefix].toString())) {
        return `${prefix}:${iri.substring(this.prefixes[prefix].toString().length)}`;
      }
    }
    // to handle standard "a" processing
    if(iri == filterRDFType.value) {
      return 'rdf:type';
    }
    // If no prefix matches, return the original IRI
    return iri;
  }
  

};

// helper functions

