export interface ListItem {
  iri?: string;
  _meta?: {
    [key: string]: any;
  };
  [key: string]: any;
}

export interface Header {
  iri: string;
  link: string;
  label: string;
  description: string;
}

export interface List {
  iri: string;
  header: HeaderType;
  count: number;
  listHeaders: {
    [key: string]: HeaderType;
  };
  list: ListItemType[]; 
}

export interface Form {
  iri: string;
  header: HeaderType;
  count: number;
  formHeaders: {
    [key: string]: HeaderType;
  };
  fields: ListItem;
}

export type HeaderLink = {
  iri: string;
  rel?: string;
  title?: string;
  token?: string;
  anchor?: string;
  [key: string]: string | undefined;
}
