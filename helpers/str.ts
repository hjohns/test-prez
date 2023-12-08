import type { HeaderLink } from '~/lib/prez.d'
import mustache, { render } from 'mustache';
import { constants, type OverrideTexts, type Texts } from '~/constants'

// get constant overrides
import overrides from '~/constantsOverride'

export function isURI(str: string): boolean {
  try {
    new URL(str);
    return true;
  } catch (ex) {
    return false;
  }
}

// tests if any uppercase char exists in a string
export function containsUppercase(input: string): boolean {
  const regex = /[A-Z\p{Lu}]/u;
  return regex.test(input);
}

// tests if an uppercase char appears in a word that has at least one lowercase char, e.g. version IRI, returns false
export function containsUppercaseInWord(input: string): boolean {
  // Define a regular expression to match words with at least one lowercase letter
  const wordWithLowercaseRegex = /\b[a-z\p{Ll}]+\b/u;

  // Find all words that match the regular expression
  const wordsWithLowercase = input.match(wordWithLowercaseRegex);

  if (wordsWithLowercase) {
    // Check if any of the matched words contain an uppercase letter
    for (const word of wordsWithLowercase) {
      if (/[A-Z\p{Lu}]/u.test(word)) {
        return true; // Found an uppercase letter in a word with lowercase
      }
    }
  }

  return false; // No uppercase letter in a word with lowercase
}

export function capitalizeFirstLetterIfNoUpperCase(input: string): string {
  if (containsUppercaseInWord(input)) {
    return input;
  } else {
    return input.charAt(0).toUpperCase() + input.slice(1);
  }
}

export function getDefaultLabelFromURIOrString(uriOrStr: string): string {
  return uriOrStr;
  let name = '';
  try {
    const urlObject = new URL(uriOrStr);
    // Check if there is a fragment identifier
    if (urlObject.hash) {
      name = urlObject.hash.substring(1).trim(); // Remove the "#" symbol
    }
    if(name == '') {
      const pathSegments = urlObject.pathname.split('/').filter(segment => segment !== '');
      if (pathSegments.length > 0) {
        name = pathSegments[pathSegments.length - 1];
      }
    }
    if(name == '') {
      return uriOrStr;
    }
  } catch (ex) {
    name = uriOrStr;
  }
  return capitalizeFirstLetterIfNoUpperCase(name);
}

export function parseLinkHeader(headerString: string): HeaderLink[] {
  const headersArray: HeaderLink[] = [];

  if(typeof(headerString) != 'string') {
    return [];
  }

  // Split the string by commas and process each header
  headerString.split(',').forEach(header => {
    // Extract URI and components
    const [uri, ...components] = header.split(';').map(item => item.trim());

    // Create an object for the header and set its main key
    const headerObject: HeaderLink = { iri: uri.replace(/[<>]/g, '') };

    // Process components into key-value pairs
    components.forEach(component => {
      const [key, value] = component.split('=');
      const trimmedKey = key.trim();
      const trimmedValue = value.replace(/["<>]/g, '').trim();

      // Check if the property exists on the object type before setting
      headerObject[trimmedKey] = trimmedValue;
    });

    // Store the header object in the array
    headersArray.push(headerObject);
  });

  return headersArray;
}

interface NestedObject {
  [key: string]: any;//NestedObject | string | number | boolean | null | Array<any>;
};

export const template = (templateString:string, obj:NestedObject) => {
  const replacedTemplate = templateString.replace(/{{(.*?)}}/g, (match, p1) => {
    // Replace colons with double underscores within {{ }}
    const replaced = p1.replace(/:/g, '__');
    return `{{${replaced}}}`;
  });
  return mustache.render(replacedTemplate, transformKeysForMustache(obj));
};


const transformKeysForMustache = (obj: NestedObject): NestedObject => {
  const transformedObj: NestedObject = {};

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];

      // Recursively transform nested objects
      if (value !== null && typeof value === 'object') {
        transformedObj[key.replace(/:/g, '__')] = transformKeysForMustache(value as NestedObject);
      } else {
        transformedObj[key.replace(/:/g, '__')] = value;
      }
    }
  }
  transformedObj._debug = Object.keys(transformedObj).map(key=>key.replace('__', ':'));
  return transformedObj;
};

export function tpl(key: Texts, data?: any): string {
  const str = constants.includes(key)
    ? key in overrides ? overrides[key]! : key : `"${key}" not found`;
  return (data !== undefined ? template(str, data) : str.replace(/{{\!.+}}/g, ''));
}
