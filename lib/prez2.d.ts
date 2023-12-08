export type PrezHeaderLink = {
  iri: string;
  rel?: string;
  title?: string;
  token?: string;
  anchor?: string;
  [key: string]: string | undefined;
}

export type PrezTerm = {
  dataType?: PrezTerm;
  termType: 'Literal' | 'NamedNode' | 'BlankNode';
}

export type PrezLiteral = PrezTerm & {
  termType: 'Literal';
  text: string;
}

export type PrezNamedNode = PrezTerm & {
  termType: 'NamedNode';
  label?: PrezTerm;
  description?: PrezTerm;
  uri: string;
  curie?: string;
}

export type PrezBlankNode = PrezTerm & {
  termType: 'BlankNode';
  form: PrezForm;
}

export type PrezForm = {
  config: PrezConfig;
  class: PrezTerm;
  title: PrezTerm;
  description?: PrezTerm;
  properties: PrezProperties;
}

export type PrezConfig = {
  classPredicates: string[];
  labelPredicates: string[];
  descriptionPredicates: string[];
}

export type PrezList = {
  class: PrezTerm;
  headers: PrezListHeaders;
  rows: PrezListRows;
}

export type PrezListHeaders = Record<string, PrezNamedNode>;
export type PrezListRows = Record<string, PrezNamedNode[]>;

export type PrezProperty = {
  name: PrezNamedNode;
  value: PrezTerm|PrezTerm[];
}

export type PrezProperties = Record<string, PrezProperty>;

export const PrezDataFactory = {
  prezNamedNode(iri: string, label?: PrezTerm, description?: PrezTerm, uri?: string, curie?: string): PrezNamedNode {
    return {
      termType: 'NamedNode',
      uri: uri || iri,
      label,
      description,
      curie,
    };
  },

  prezLiteral(text: string): PrezLiteral {
    return {
      termType: 'Literal',
      text,
    };
  },

  prezBlankNode(form: PrezForm): PrezBlankNode {
    return {
      termType: 'BlankNode',
      form,
    };
  },

  // Add more factory functions for other types as needed
};