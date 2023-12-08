
export type BreadcrumbItem = {
    title: string,
    href?: string,
    to?: string,
    helper?: 'context', 'relative',
    options?: undefined | number,
    disabled?: boolean
}

