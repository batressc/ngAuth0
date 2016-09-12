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

/** Verifica si un objeto posee una determinada propiedad */
function verificarPropiedad(obj: any, prop: string): boolean {
    var proto = obj.__proto__ || obj.constructor.prototype;
    return (prop in obj) && (!(prop in proto) || proto[prop] !== obj[prop]);
}

export { errorConsoleGroup, infoConsoleGroup, warnConsoleGroup, verificarPropiedad }