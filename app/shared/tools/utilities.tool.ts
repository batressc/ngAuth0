function errorGroup(grupo: string, ...elementos: Array<any>): void {
    console.group(grupo);
    for(let item of elementos) console.error(item);
    console.groupEnd();
}

function informationGroup(grupo: string, ...elementos: Array<any>): void {
    console.group(grupo);
    for(let item of elementos) console.info(item);
    console.groupEnd();
}

function warningGroup(grupo: string, ...elementos: Array<any>): void {
    console.group(grupo);
    for(let item of elementos) console.warn(item);
    console.groupEnd();
}

export { errorGroup, informationGroup, warningGroup }