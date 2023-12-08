export const constants = [
    '{{!bc}}Home',
    '{{!bc}}Profiles',
    '{{!bc}}Catalogs',
    '{{!bc}}Collections',
    '{{!bc}}Items',
    'Home Page',
    'View Members',
    '{{ header.label }} collection',
    '{{ header.label }} resource',
    '{{!toolbar}}VocPrez',
    '{{!toolbar}}CatPrez',
    '{{!toolbar}}SpacePrez',
    'form-title'
] as const;

export type Texts = typeof constants[number];

export type OverrideTexts = Partial<Record<Texts, string>>;
