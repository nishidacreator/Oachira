import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, of} from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators'
import { Role } from './models/role';
import { Token } from '@angular/compiler';
import { User } from './models/user';
import { mapTo } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  url = environment.baseUrl;

  private readonly token = 'token'
  private readonly JWT_TOKEN = 'JWT_TOKEN';
  private readonly REFRESH_TOKEN = 'REFRESH_TOKEN'
  private loggedUser: any

  constructor(private _http:HttpClient) { }

  private  currentUserSource = new ReplaySubject<User | null>(1)
  currentUser$ = this.currentUserSource.asObservable();

  getRole():Observable<Role[]>{
    return this._http.get<Role[]>(this.url + '/role')
  }

  registerUser(data : any){
    return this._http.post(this.url + '/register', data)
  }

  getUser():Observable<User[]>{
    return this._http.get<User[]>(this.url + '/register')
  }

  login(data: any){
    return this._http.post(this.url + '/login', data)
    .pipe(
      tap((tokens) => this.doLoginUser(data.phoneNumber, tokens)),
      mapTo(true),
      catchError((error: any) => {
        return of(false)
      })
    )
  }

  private doLoginUser(userName: String, tokens: any){
    this.loggedUser = userName
    this.storeTokens(tokens)
  }

  private storeTokens(tokens: any){
    localStorage.setItem(this.JWT_TOKEN, tokens.token.accessToken)
    localStorage.setItem(this.REFRESH_TOKEN, tokens.token.refreshToken)
    localStorage.setItem('token', JSON.stringify(tokens))
  }

  getJwtToken(){
    return localStorage.getItem(this.JWT_TOKEN);
  }

  isLoggedIn(): boolean{
    let loggedStatus = this.getJwtToken()
    return !!this.getJwtToken();
  }

  logout(){
    // localStorage.clear()
    localStorage.removeItem(this.JWT_TOKEN);
    localStorage.removeItem(this.REFRESH_TOKEN);
    localStorage.removeItem("token");
    // return this._http.post(this.url + '/logout', {
    //   'refreshToken': this.getRefreshToken()
    // }).pipe(
    //   tap((tokens) => this.doLogoutUser()),
    //   mapTo(true),
    //   catchError((error: any) => {
    //     alert(error.error)
    //     return of(false)
    //   })
    // )
    
  }

//   private getRefreshToken(){}

//   private doLogoutUser(){
//     this.loggedUser = null;
//     this.removeTokens();
//   }

//   private removeTokens(){
//     localStorage.removeItem(this.JWT_TOKEN)
//     localStorage.removeItem(this.REFRESH_TOKEN)
//   }

//   refreshToken(){
//     return this._http.post<any>(this.url+'/refresh', {
//       'refreshToken': this.getRefreshToken()
//     }).pipe(tap((tokens : any)=>{
//       this.storeJwtTokens(tokens.accessToken)
//     }))
//   }

//   private storeJwtTokens(jwt : string){}
}
