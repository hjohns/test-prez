
import type { BreadcrumbItem } from '~/components/common/Breadcrumbs.d';
import { tpl } from '~/helpers/str';
export const getContextBreadcrumbTitle = (fullPath: string) => {
    if(fullPath.includes('/v/')) {
        return tpl('{{!toolbar}}VocPrez');
    } else if(fullPath.includes('/c/')) {
        return tpl('{{!toolbar}}CatPrez');
    } else if(fullPath.includes('/s/')) {
        return tpl('{{!toolbar}}SpacePrez');
    }
    return undefined;
}
export const getRelativePath = (fullPath: string, relativeNumBack: number) => {
    let newPath = fullPath.replace(/\/+$/, ''); // make sure we don't have a slash at the end already
    while(relativeNumBack > 0) {
        // Find the last occurrence of '/'
        const lastSlashIndex = newPath.lastIndexOf('/');
        if(lastSlashIndex !== -1 && lastSlashIndex !== newPath.length - 1) {
            newPath = newPath.substring(0, lastSlashIndex);
        }
        relativeNumBack--;
    }
    return newPath;
}
