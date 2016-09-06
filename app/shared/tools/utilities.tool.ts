/** Muestra un grupo de mensajes de consola de error */
function errorConsoleGroup(grupo: string, ...elementos: Array<any>): void {
    console.group(grupo);
    for(let item of elementos) console.error(item);
    console.groupEnd();
}

/** Muestra un grupo de mensajes de consola de informacion */
function infoConsoleGroup(grupo: string, ...elementos: Array<any>): void {
    console.group(grupo);
    for(let item of elementos) console.info(item);
    console.groupEnd();
}

/** Muestra un grupo de mensajes de consola de advertencia */
function warnConsoleGroup(grupo: string, ...elementos: Array<any>): void {
    console.group(grupo);
    for(let item of elementos) console.warn(item);
    console.groupEnd();
}

export { errorConsoleGroup, infoConsoleGroup, warnConsoleGroup }