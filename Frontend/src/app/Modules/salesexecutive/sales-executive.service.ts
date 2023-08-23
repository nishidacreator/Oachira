import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DailyCollection } from './models/dailyCollection';
import { Observable } from 'rxjs';
import { PickList } from './models/pickList';
import { PickListDetails } from './models/pickListDetails';
import { SecondaryUnit } from '../admin/models/secondaryUnit';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SalesExecutiveService {

  url = environment.baseUrl;

  constructor(private _http:HttpClient) { }


  addCollection(data : any){
    return this._http.post(this.url + '/dailycollection', data)
  }

  getCollection(): Observable<DailyCollection[]>{
    return this._http.get<DailyCollection[]>(this.url+'/dailycollection');
  }
  
  deleteCollection(id:Number){
    return this._http.delete(this.url+'/dailycollection/'+id);
  }

  updateCollection(id:Number, data:any){
    return this._http.patch<DailyCollection>(this.url+'/dailycollection/'+id, data);
  }

  addPickList(data:any){
    return this._http.post(this.url+'/picklist', data);
  }

  getPickList(): Observable<PickList[]>{
    return this._http.get<PickList[]>(this.url+'/picklist');
  }

  getPickListById(id : number): Observable<PickList>{
    return this._http.get<PickList>(this.url+'/picklist/' +id);
  }

  getPickListByRouteId(id : number): Observable<PickList[]>{
    return this._http.get<PickList[]>(this.url+'/picklist/routeid/' +id);
  }

  updatePickList(id : number): Observable<PickList>{
    return this._http.get<PickList>(this.url+'/picklist/'+id);
  }

  getPickListDetails(id: number): Observable<PickListDetails[]>{
    return this._http.get<PickListDetails[]>(this.url+'/picklistdetails/'+id);
  }

  getPickListDetailsById(id: number): Observable<PickListDetails>{
    return this._http.get<PickListDetails>(this.url+'/picklistdetails/byid/'+id);
  }

  getPickListDetailsByProductId(id: number): Observable<PickListDetails[]>{
    return this._http.get<PickListDetails[]>(this.url+'/picklistdetails/byproductid/'+id);
  }

  addPickListDetails(data : any){
    return this._http.post(this.url+'/picklistdetails/', data);
  }

  updatePickListDetails(data : any, id : number): Observable<PickListDetails>{
    return this._http.patch<PickListDetails>(this.url+'/picklistdetails/'+id, data);
  }

  deletePickListDetails(id : number){
    return this._http.delete(this.url+'/picklistdetails/'+id);
  }

  getSecondaryUnitByName(name : string): Observable<SecondaryUnit>{
    return this._http.get<SecondaryUnit>(this.url+'/secondaryunit/byname/' + name);
  }

  getSecondaryUnitById(id : any): Observable<SecondaryUnit>{
    return this._http.get<SecondaryUnit>(this.url+'/secondaryunit/byid/' + id);
  }

}
