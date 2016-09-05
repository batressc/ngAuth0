import { Injectable } from '@angular/core';

import { tokenNotExpired } from 'angular2-jwt';
import { CLIENT_ID, DOMAIN, TOKEN_NAME } from '../../app.auth.config';
import { errorGroup, informationGroup, warningGroup } from '../tools/utilities.tool';
const locaforage: LocalForage = require('localforage');

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
        if (locaforage.config(config)) {
            console.info('Creado almacén de datos de autenticación');
        } else {
            console.warn('No se inicializó almacén de datos. Utilizando valores por defecto');
        }
    }

    //Se produce cuando se muestra la ventana de login
    private showCallback(): void { 
        console.info('Mostrando Auth0 Lock screen');
    }

    //Se produce cuando se oculta la ventana de login
    private hideCallback(): void { 
        console.info('Ocultando Auth0 Lock screen');
    }

    //Se produce cuando ocurre un error irrecuperable (ej: no conexion)
    private unrecoverableErrorCallback(unrecoverableError: any): void { 
        errorGroup(
            'auth0-lock: unrecoverable_error',
            'Ha ocurrido un error irrecuperable',
            unrecoverableError);
    }

    //Se produce despues de autenticacion exitosa
    private authenticatedCallback(authResult: any): void { 
        locaforage.setItem(TOKEN_NAME, authResult)
            .then(data => informationGroup(
                'auth0-lock: authenticated',
                'Autenticacion exitosa',
                data))
            .catch(error => errorGroup(
                'auth0-lock: authenticated',
                'Error al guardar la informacion del token de autenticacion',
                error));
    }

    //Se produce cuando ocurre un error de autenticacion
    private authorizationErrorCallback(authError: any): void { 
        errorGroup(
            'auth0-lock: authorization_error',
            'Error al verificar la autenticación',
            authError);
    }

    //Metodo low-level. Si no hay nada => null, exito => authResult, error => authError
    private hashParsedCallback(result: any): void { 
        warningGroup(
            'auth0-lock: hash_parsed',
            'Mostrando unicamente lo que pasa en este evento',
            result
        );
    }

    //Configurando callbacks para auth0-lock
    private configureCallbacksAuth0Lock(): void {
        this.lock.on('show', this.showCallback);
        this.lock.on('hide', this.hideCallback);
        this.lock.on('unrecoverable_error', this.unrecoverableErrorCallback);
        this.lock.on('authenticated', this.authenticatedCallback);
        this.lock.on('authorization_error', this.authorizationErrorCallback);
        this.lock.on('hash_parsed', this.hashParsedCallback);
    }

    //Configura valores y callbacks de auth0-lock
    private configureAuth0Lock(): void {
        //Inicializacion y opciones
        let lockOptions = { language: 'es' };
        this.lock = new Auth0Lock(CLIENT_ID, DOMAIN, lockOptions);
        //Configurando callbacks
        this.configureCallbacksAuth0Lock();
    }

    /** Lanza el widget de login de auth0 */
    login(): void {
        this.lock.show();
    }

    authenticated(): boolean {
        return tokenNotExpired();
    }

    logout(): void {
        locaforage.removeItem(TOKEN_NAME)
            .then(() => informationGroup(
                'auth0-lock: logout',
                'Se removió informacion del token de autenticación'))
            .catch(error => errorGroup(
                'auth0-lock: logout',
                'No se pudo eliminar la informacion del token de autenticación',
                error));
    }
}

export { AuthService }