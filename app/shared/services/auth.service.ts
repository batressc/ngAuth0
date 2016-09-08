import { Injectable } from '@angular/core';

import { JwtHelper } from 'angular2-jwt';
import { CLIENT_ID, DOMAIN, TOKEN_NAME, PROFILE_VAR } from '../../app.auth.config';
import { errorConsoleGroup, infoConsoleGroup, warnConsoleGroup } from '../tools/utilities.tool';
const localforage: LocalForage = require('localforage');

declare var Auth0Lock: any;

@Injectable()
class AuthService {
    lock: any;

    constructor() {
        this.configureStorage();
        this.configureAuth0Lock();
    }

    //Configura opciones para LocalForage
    private configureStorage(): void {
        let config: LocalForageOptions = {
            name: 'ngAuth0',
            storeName: 'authData',
            description: 'Datos de autenticación'
        };
        if (localforage.config(config)) {
            infoConsoleGroup('localForage: Inicialización', 'Creado almacén de datos de autenticación', config);     
        } else {
            warnConsoleGroup('localForage: Inicialización', 'No se inicializó almacén de datos. Utilizando valores por defecto', localforage);
            console.warn();
        }
    }

    //Recupera y almacena la informacion del perfil
    private getAndSaveProfile(idToken: string): void {
        this.lock.getProfile(idToken, (error: any, data: any) => {
            if (!error) {
                localforage.setItem(PROFILE_VAR, data)
                    .then(saveData => {
                        if (saveData) {
                            infoConsoleGroup('auth0-lock: getProfile', 'Datos de perfil almacenados con éxito', saveData);
                        } else {
                            warnConsoleGroup('auth0-lock: getProfile', 'No se guardaron los datos del perfil', data);
                        }
                    })
                    .catch(error => {
                            errorConsoleGroup('auth0-lock: getProfile', 'Error al trata de guardar los datos del perfil', data);
                    });
            } else {
                errorConsoleGroup('auth0-lock: getProfile', 'No se pudo recuperar la inforamción del perfil', error);
            }
        });
    }

    //Se produce cuando se muestra la ventana de login
    private showCallback(): void {
        infoConsoleGroup('auth0-lock: show', 'Mostrando Auth0 Lock screen'); 
    }

    //Se produce cuando se oculta la ventana de login
    private hideCallback(): void { 
        infoConsoleGroup('auth0-lock: hide', 'Ocultando Auth0 Lock screen');
    }

    //Se produce cuando ocurre un error irrecuperable (ej: no conexion)
    private unrecoverableErrorCallback(unrecoverableError: any): void { 
        errorConsoleGroup('auth0-lock: unrecoverable_error', 'Ha ocurrido un error irrecuperable', unrecoverableError);
    }

    //Se produce despues de autenticacion exitosa
    private authenticatedCallback(authResult: any): void { 
        localforage.setItem(TOKEN_NAME, authResult)
            .then(data => infoConsoleGroup('auth0-lock: authenticated', 'Autenticacion exitosa', data))
            .catch(error => errorConsoleGroup('auth0-lock: authenticated', 'Error al guardar la informacion del token de autenticacion', error));
        this.getAndSaveProfile(authResult.idToken);
    }

    //Se produce cuando ocurre un error de autenticacion
    private authorizationErrorCallback(authError: any): void { 
        errorConsoleGroup('auth0-lock: authorization_error', 'Error al verificar la autenticación', authError);
    }

    //Metodo low-level. Si no hay nada => null, exito => authResult, error => authError
    private hashParsedCallback(result: any): void { 
        warnConsoleGroup('auth0-lock: hash_parsed', 'Mostrando unicamente lo que pasa en este evento', result);
    }

    //Configurando callbacks para auth0-lock
    private configureCallbacksAuth0Lock(): void {
        //Ver explicacion de porque se utiliza local fat arrow en https://github.com/Microsoft/TypeScript/wiki/'this'-in-TypeScript
        this.lock.on('show', () => this.showCallback());
        this.lock.on('hide', () => this.hideCallback());
        this.lock.on('unrecoverable_error', (unrecoverableError) => this.unrecoverableErrorCallback(unrecoverableError));
        this.lock.on('authenticated', (authResult) => this.authenticatedCallback(authResult));
        this.lock.on('authorization_error', (authError) => this.authorizationErrorCallback(authError));
        this.lock.on('hash_parsed', (result) => this.hashParsedCallback(result));
    }

    //Configura valores y callbacks de auth0-lock
    private configureAuth0Lock(): void {
        //Inicializacion y opciones
        let lockOptions = { language: 'es' };
        this.lock = new Auth0Lock(CLIENT_ID, DOMAIN, lockOptions);
        //Configurando callbacks
        this.configureCallbacksAuth0Lock();
    }

    /** Devuelve el idToken del token JWT */
    getIdToken(): Promise<string> {
        return localforage.getItem<any>(TOKEN_NAME)
            .then(data => { 
                if (data) {
                    infoConsoleGroup('angular2-jwt: tokenGetter', 'Datos de token de autenticación recuperados', data);
                    return <string>data.idToken;
                } else {
                    warnConsoleGroup('angular2-jwt: tokenGetter', 'No se encontraron datos de token de autenticación', `Nombre del token: ${TOKEN_NAME}`);
                    return null;
                } 
            })
            .catch(error => {
                errorConsoleGroup('angular2-jwt: tokenGetter', 'Error al recuperar los datos del token de autenticación', `Nombre del token: ${TOKEN_NAME}`, error);
                return null;
            });
    }

    /** Verifica si el token de autenticacion es valido */
    authenticated(): Promise<boolean> {
        return Promise.resolve(true);
        /*return this.getIdToken()
            .then(token => {
                let jwtHelper = new JwtHelper();
                let resultado: boolean;
                resultado = token != null && !jwtHelper.isTokenExpired(token);
                infoConsoleGroup('AuthService: authenticated', 'Resultado de información de token', resultado);
                return resultado;
            })
            .catch(error => {
                errorConsoleGroup('AuthService: authenticated', 'Error al verificar el token de autenticación', error);
                return false;
            });*/
    }

    /** Lanza el widget de login de auth0 */
    login(): void {
        this.lock.show();
    }

    /** Remueve la informacion del token de autenticacion */
    logout(): void {
        localforage.removeItem(TOKEN_NAME)
            .then(() => infoConsoleGroup('auth0-lock: logout', 'Se removió informacion del token de autenticación', TOKEN_NAME))
            .catch(error => errorConsoleGroup('auth0-lock: logout', 'No se pudo eliminar la informacion del token de autenticación', error));
    }

    /** Devuelve la informacion del perfil de usuario almacenada en el storage local */
    getLocalProfile(): Promise<any> {
        return localforage.getItem<any>(PROFILE_VAR)
            .then(profile => {
                infoConsoleGroup('AuthService: getLocalProfile', 'Datos de perfil local recuperados', profile); 
                return profile;
            })
            .catch(error => {
                errorConsoleGroup('AuthService: getLocalProfile', 'No se pudo recuperar los datos del perfil local', error);
                return null;
            });
    }
}

export { AuthService }