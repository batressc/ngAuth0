import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Headers } from '@angular/http';

import { JwtHelper } from 'angular2-jwt';
import { CLIENT_ID, DOMAIN, TOKEN_NAME, PROFILE_VAR, DELEGATION, DEVICE } from '../../app.auth.config';
import { errorConsoleGroup, infoConsoleGroup, warnConsoleGroup, verificarPropiedad } from '../tools/utilities.tool'; 

declare var Auth0Lock: any;

@Injectable()
class AuthService {
    lock: any;

    constructor(private router: Router, private http: Http) {
        this.configureAuth0Lock();
    }

    //Recupera y almacena la informacion del perfil
    private getAndSaveProfile(idToken: string): void {
        this.lock.getProfile(idToken, (error: any, data: any) => {
            if (!error) {
                localStorage.setItem(PROFILE_VAR, JSON.stringify(data));
                let temp = localStorage.getItem(PROFILE_VAR);
                if (temp) {
                    infoConsoleGroup('auth0-lock: getProfile', 'Datos de perfil almacenados con éxito', data);
                    this.router.navigate(['home']);
                }
                else warnConsoleGroup('auth0-lock: getProfile', 'No se guardaron los datos del perfil', data);
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
        infoConsoleGroup('auth0-lock: authenticated', 'Autenticacion exitosa', authResult);
        localStorage.setItem(TOKEN_NAME, JSON.stringify(authResult));
        let temp = localStorage.getItem(TOKEN_NAME);
        if (temp) infoConsoleGroup('auth0-lock: authenticated', 'Se guardó información de autenticación', authResult);
        else errorConsoleGroup('auth0-lock: authenticated', 'Error al guardar la informacion del token de autenticacion', authResult);
        this.getAndSaveProfile(authResult.idToken);
    }

    //Se produce cuando ocurre un error de autenticacion
    private authorizationErrorCallback(authError: any): void { 
        errorConsoleGroup('auth0-lock: authorization_error', 'Error al verificar la autenticación', authError);
    }

    //Metodo low-level. Si no hay nada => null, exito => authResult, error => authError
    private hashParsedCallback(result: any): void {
         if (!result) {
            if (this.isValidToken()) this.router.navigate(['home']);
            else {
                this.router.navigate(['login']);
            }
        } else if (verificarPropiedad(result, 'idToken')) this.authenticatedCallback(result);
        else this.authorizationErrorCallback(result);
    }

    //Configurando callbacks para auth0-lock
    private configureCallbacksAuth0Lock(): void {
        //Ver explicacion de porque se utiliza local fat arrow en https://github.com/Microsoft/TypeScript/wiki/'this'-in-TypeScript
        this.lock.on('show', () => this.showCallback());
        this.lock.on('hide', () => this.hideCallback());
        this.lock.on('unrecoverable_error', (unrecoverableError) => this.unrecoverableErrorCallback(unrecoverableError));
        this.lock.on('authenticated', (authResult) => this.authenticatedCallback(authResult));
        this.lock.on('authorization_error', (authError) => this.authorizationErrorCallback(authError));
        //this.lock.on('hash_parsed', (result) => this.hashParsedCallback(result));
    }

    //Configura valores y callbacks de auth0-lock
    private configureAuth0Lock(): void {
        //Inicializacion y opciones
        let lockOptions = {
            language: 'es',
            rememberLastLogin: false,
            auth: {
                params: {
                    scope: 'openid offline_access',
                    device: DEVICE
                }
            }
        };
        this.lock = new Auth0Lock(CLIENT_ID, DOMAIN, lockOptions);
        //Configurando callbacks
        this.configureCallbacksAuth0Lock();
    }

    /** Devuelve el token nuevo a partir del token de refresco */
    regreshToken(refreshToken: string) {
        let body = {
            client_id: CLIENT_ID,
            grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            refreshToken: refreshToken,
            api_type: 'app'
        };
        let headers: Headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post(DELEGATION, body, { headers: headers });
    }

    /** Devuelve el token actual */
    getToken(): string {
        let tokenId: string = '';
        let token = localStorage.getItem(TOKEN_NAME);
        if (token) {
            let tokenObject = JSON.parse(token);
            tokenId = tokenObject.idToken;
        }
        return tokenId;
    }

    /** Obtiene el token de refresco */
    getRefreshToken(): string {
        let tokenRefresh: string = '';
        let token = localStorage.getItem(TOKEN_NAME);
        if (token) {
            let tokenObject = JSON.parse(token);
            tokenRefresh = tokenObject.refreshToken;
        }
        return tokenRefresh;
    }

    /** Verifica si el token de autenticacion es valido */
    isValidToken(): boolean {
        let resultado: boolean = false;
        let token = localStorage.getItem(TOKEN_NAME);
        if (token) {
            let tokenObject = JSON.parse(token);
            let jwtHelper = new JwtHelper();
            resultado = tokenObject.idToken != null && !jwtHelper.isTokenExpired(tokenObject.idToken);
            infoConsoleGroup('AuthService: isValidToken', 'Resultado de información de token', tokenObject, resultado);
        } else warnConsoleGroup('AuthService.isValidToken', 'No se encontraron datos de token de autenticación', TOKEN_NAME);
        return resultado;
    }

    /** Lanza el widget de login de auth0 */
    login(): void {
        this.lock.show();
    }

    /** Remueve la informacion del token de autenticacion */
    logout(redirect: boolean = true): void {
        localStorage.removeItem(TOKEN_NAME);
        localStorage.removeItem(PROFILE_VAR);
        infoConsoleGroup('auth0-lock: logout', 'Se removió informacion del token de autenticación y perfil de usuario', TOKEN_NAME)
        if (redirect) this.router.navigate(['login']);
    }

    /** Devuelve la informacion del perfil de usuario almacenada en el storage local */
    getLocalProfile(): any {
        return JSON.parse(localStorage.getItem(PROFILE_VAR));
    }
}

export { AuthService }