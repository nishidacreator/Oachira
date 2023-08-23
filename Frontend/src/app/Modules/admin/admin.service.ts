import { CustomerGrade } from './models/customer/customerGrade';
import { CustomerCategory } from './models/customer/customerCategory';
import { Tax } from './models/tax';
import { Category } from './models/category';
import { SecondaryUnit } from './models/secondaryUnit';
import { Brand } from './models/brand';
import { PrimaryUnit } from './models/primaryUnit';
import { HttpClient, HttpEvent, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from './models/product';
import { Customer } from './models/customer/customer';
import { Vendor } from './models/vendor';
import { Vehicle } from './models/vehicle/vehicle';
import { Route } from './models/route/route';
import { CollectionDays } from './models/route/collectionDays';
import { RouteDetails } from './models/route/routeDetails';
import { Role } from './models/role';
import { User } from './models/user';
import { PickList } from '../salesexecutive/models/pickList';
import { Trip } from './models/route/trip';
import { TripDetails } from './models/route/tripDetails';
import { DeliveryDays } from './models/route/deliveryDays';
import { PurchaseEntry } from './models/purchaseEntry';
import { PurchaseEntryDetails } from './models/purchaseEntryDetails';
import { PurchaseOrder } from './models/purchaseOrder';
import { PurchaseOrderDetails } from './models/purchaseOrderDetails';
import { Stock } from './models/stock/stock';
import { PurchaseTransaction } from './models/stock/purchaseTransaction';
// import * as puppeteer from 'puppeteer';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  url = 'http://localhost:8000'

  constructor(private _http:HttpClient) { }

  

  //brand
  addBrand(data : any){
    return this._http.post(this.url + '/brand', data)
  }

  getBrand(): Observable<Brand[]>{
    return this._http.get<Brand[]>(this.url+'/brand');
  }
  
  deleteBrand(id:Number){
    return this._http.delete(this.url+'/brand/'+id);
  }

  updateBrand(id:Number, data:any){
    return this._http.patch<Brand>(this.url+'/brand/'+id, data);
  }

  //UNIT
  addPrimaryUnit(data : any){
    return this._http.post(this.url + '/primaryUnit', data)
  }

  getPrimaryUnit(): Observable<PrimaryUnit[]>{
    return this._http.get<PrimaryUnit[]>(this.url+'/primaryunit');
  }

  deletePUnit(id:Number){
    return this._http.delete(this.url+'/primaryunit/'+id);
  }

  updatePUnit(id:Number, data:any){
    return this._http.patch<PrimaryUnit>(this.url+'/primaryunit/'+id, data);
  }

  addSecondaryUnit(data : any){
    return this._http.post(this.url + '/secondaryUnit', data)
  }

  getSecondaryUnit(): Observable<SecondaryUnit[]>{
    return this._http.get<SecondaryUnit[]>(this.url+'/secondaryunit');
  }

  deleteSUnit(id:Number){
    return this._http.delete(this.url+'/secondaryunit/'+id);
  }

  updateSUnit(id:Number, data:any){
    return this._http.patch<SecondaryUnit>(this.url+'/secondaryUnit/'+id, data);
  }

  //CATEGORY
  addCategory(data : any): Observable<any>{
    return this._http.post(this.url + '/category', data)
  }

  getCategory(): Observable<Category[]>{
    return this._http.get<Category[]>(this.url+'/category');
  }
  
  updateCategory(id:Number, data:any){
    return this._http.patch<Category>(this.url+'/category/'+id, data);
  }

  deleteCategory(id:Number){
    return this._http.delete(this.url+'/category/'+id);
  }

  //PRODUCT
  addProduct(data : any){
    return this._http.post(this.url + '/product', data)
  }

  getProduct(): Observable<Product[]>{
    return this._http.get<Product[]>(this.url + '/product');
  }

  updateProduct(id:Number, data:any){
    return this._http.patch<Product>(this.url+'/product/'+id, data);
  }

  deleteProduct(id:Number){
    return this._http.delete(this.url+'/product/'+id);
  }

  //TAX
  addTax(data : any){
    return this._http.post(this.url + '/tax', data)
  }

  getTax(): Observable<Tax[]>{
    return this._http.get<Tax[]>(this.url + '/tax');
  }

  getTaxById(id: number): Observable<Tax>{
    return this._http.get<Tax>(this.url + '/tax/'+ id);
  }

  updateTax(id:Number, data:any){
    return this._http.patch<Tax>(this.url+'/tax/'+id, data);
  }

  deleteTax(id:Number){
    return this._http.delete(this.url+'/tax/'+id);
  }

  //customer

  addCustomerCategory(data : any){
    return this._http.post(this.url + '/customercategory', data)
  }

  getCustomerCategory(): Observable<CustomerCategory[]>{
    return this._http.get<CustomerCategory[]>(this.url + '/customercategory');
  }

  updateCustomerCategory(id:Number, data:any){
    return this._http.patch<CustomerCategory>(this.url+'/customercategory/'+id, data);
  }

  deleteCustomerCategory(id:Number){
    return this._http.delete(this.url+'/customercategory/'+id);
  }

  addCustomerGrade(data : any){
    return this._http.post(this.url + '/customergrade', data)
  }

  getCustomerGrade(): Observable<CustomerGrade[]>{
    return this._http.get<CustomerGrade[]>(this.url + '/customergrade');
  }

  updateCustomerGrade(id:Number, data:any){
    return this._http.patch<CustomerGrade>(this.url+'/customergrade/'+id, data);
  }

  deleteCustomerGrade(id:Number){
    return this._http.delete(this.url+'/customergrade/'+id);
  }

  addCustomer(data : any){
    return this._http.post(this.url + '/customer', data)
  }

  getCustomer(): Observable<Customer[]>{
    return this._http.get<Customer[]>(this.url + '/customer');
  }

  updateCustomer(id:Number, data:any){
    return this._http.patch<Customer>(this.url+'/customer/'+id, data);
  }

  deleteCustomer(id:Number){
    return this._http.delete(this.url+'/customer/'+id);
  }

  //VENDOR
  addVendor(data : any){
    return this._http.post(this.url + '/vendor', data)
  }

  getVendor(): Observable<Vendor[]>{
    return this._http.get<Vendor[]>(this.url + '/vendor');
  }

  updateVendor(id:Number, data:any): Observable<Vendor>{
    return this._http.patch<Vendor>(this.url+'/vendor/'+id, data);
  }

  deleteVendor(id:Number){
    return this._http.delete(this.url+'/vendor/'+id);
  }

  //PURCHASE ENTRY

  addPurachaseEntry(data : any){
    return this._http.post(this.url + '/purchaseentry', data);
  }

  getPurchaseEntry(): Observable<PurchaseEntry[]>{
    return this._http.get<PurchaseEntry[]>(this.url + '/purchaseentry');
  }

  getPurchaseEntryById(id: number): Observable<PurchaseEntry>{
    return this._http.get<PurchaseEntry>(this.url + '/purchaseentry/'+ id);
  }

  addPurchaseEntryDetails(data: any){
    return this._http.post(this.url + '/purchaseentry', data)
  }

  getPurchaseEntryDetailsByEntry(id: number): Observable<PurchaseEntryDetails[]>{
    return this._http.get<PurchaseEntryDetails[]>(this.url + '/purchaseentrydetails/'+id);
  }

  findProduct(data : any):Observable<any>{
    return this._http.get<any>(this.url + '/product/filter' , data);
  }

  getPurchaseEntryByPurchaseOrderId(id: number): Observable<PurchaseEntry>{
    return this._http.get<PurchaseEntry>(this.url + '/purchaseentry/view/'+ id);
  }

  //PURCHASE ORDER

  getPurchaseOrder(): Observable<PurchaseOrder[]>{
    return this._http.get<PurchaseOrder[]>(this.url + '/purchaseorder');
  }

  addPurchaseOrder(data : any){
    return this._http.post(this.url + '/purchaseorder', data);
  }

  getPurchaseOrderById(id: number): Observable<PurchaseOrder>{
    return this._http.get<PurchaseOrder>(this.url + '/purchaseorder/'+id);
  }

  getPurchaseOrderDetailsById(id: number): Observable<PurchaseOrderDetails[]>{
    return this._http.get<PurchaseOrderDetails[]>(this.url + '/viewpurchaseorder/'+id);
  }
  //VEHICLE
  addVehicle(data : any){
    return this._http.post(this.url +'/vehicle', data);
  }

  getVehicle(): Observable<Vehicle[]>{
    return this._http.get<Vehicle[]>(this.url +'/vehicle');
  }

  deleteVehicle(id : Number){
    return this._http.delete(this.url+'/vehicle/'+ id);
  }

  updateVehicle(id:Number, data:any): Observable<Vehicle>{
    return this._http.patch<Vehicle>(this.url+'/vehicle/'+id, data);
  }

  //Route
  addRoute(data : any){
    return this._http.post(this.url +'/route', data);
  }

  getRoute(): Observable<Route[]>{
    return this._http.get<Route[]>(this.url +'/route');
  }

  getRouteById(id: number): Observable<Route>{
    return this._http.get<Route>(this.url +'/route/'+id);
  }

  deleteRoute(id : Number){
    return this._http.delete(this.url+'/route/'+ id);
  }

  updateRoute(id:Number, data:any): Observable<Route>{
    return this._http.patch<Route>(this.url+'/route/'+id, data);
  }

  addCollectionDays(data : any){
    return this._http.post(this.url +'/routedays', data);
  }

  getCollectionDays(): Observable<CollectionDays[]>{
    return this._http.get<CollectionDays[]>(this.url +'/routedays');
  }

  getCollectionDayById(id: number): Observable<DeliveryDays[]>{
    return this._http.get<DeliveryDays[]>(this.url +'/routedays/'+id);
  }

  deleteCollectionDays(id : Number){
    return this._http.delete(this.url+'/routedays/'+ id);
  }

  updateCollectionDays(id:Number, data:any): Observable<CollectionDays>{
    return this._http.patch<CollectionDays>(this.url+'/routedays/'+id, data);
  }

  addRouteDetails(data : any){
    return this._http.post(this.url +'/routedetails', data);
  }

  getRouteDetails(): Observable<RouteDetails[]>{
    return this._http.get<RouteDetails[]>(this.url +'/routedetails');
  }

  deleteRouteDetails(id : Number){
    return this._http.delete(this.url+'/routedetails/'+ id);
  }

  updateRouteDetails(id:Number, data:any): Observable<RouteDetails>{
    return this._http.patch<RouteDetails>(this.url+'/routedetails/'+id, data);
  }

  getRouteDetailsByRouteId(id: number): Observable<RouteDetails[]>{
    return this._http.get<RouteDetails[]>(this.url +'/routedetails/byrouteid/'+ id);
  }

  addTrip(data: any){
    return this._http.post(this.url +'/trip', data);
  }

  getTrip(): Observable<Trip[]>{
    return this._http.get<Trip[]>(this.url +'/trip');
  }

  getTripDetails(id : number): Observable<TripDetails[]>{
    return this._http.get<TripDetails[]>(this.url +'/tripdetails/'+id);
  }

  getTripById(id : number): Observable<Trip>{
    return this._http.get<Trip>(this.url +'/trip/'+id);
  }

  addTripDetails(data: any){
    return this._http.post(this.url +'/tripdetails', data);
  }

  //USER ROLE
  addRole(data : any){
    return this._http.post(this.url +'/role', data);
  }

  getRole(): Observable<Role[]>{
    return this._http.get<Role[]>(this.url +'/role');
  }

  getRoleById(id: string): Observable<Role>{
    return this._http.get<Role>(this.url +'/role/'+id);
  }

  deleteRole(id : Number){
    return this._http.delete(this.url+'/role/'+ id);
  }

  updateRole(id:Number, data:any): Observable<Role>{
    return this._http.patch<Role>(this.url+'/role/'+id, data);
  }

   //USER 
  addUser(data : any){
    return this._http.post(this.url +'/register', data);
  }

  getUser(): Observable<User[]>{
    return this._http.get<User[]>(this.url +'/register');
  }

  deleteUser(id : Number){
    return this._http.delete(this.url+'/register/'+ id);
  }

  updateUser(id:Number, data:any): Observable<User>{
    return this._http.patch<User>(this.url+'/register/'+id, data);
  }

  addDeliveryDays(data : any){
    return this._http.post(this.url +'/tripdays', data);
  }

  getDeliveryDays(): Observable<DeliveryDays[]>{
    return this._http.get<DeliveryDays[]>(this.url +'/tripdays');
  }

  getDeliveryDaysByRouteId(id: number): Observable<DeliveryDays[]>{
    return this._http.get<DeliveryDays[]>(this.url +'/tripdays/byrouteid/'+id);
  }

  deleteDeliveryDays(id : Number){
    return this._http.delete(this.url+'/tripdays/'+ id);
  }

  updateDeliveryDays(id:Number, data:any): Observable<DeliveryDays>{
    return this._http.patch<DeliveryDays>(this.url+'/tripdays/'+id, data);
  }

  // STOCK
  getStocks(): Observable<Stock[]>{
    return this._http.get<Stock[]>(this.url +'/stock');
  }

  getPurchaseTransaction(): Observable<PurchaseTransaction[]>{
    return this._http.get<PurchaseTransaction[]>(this.url +'/stock');
  }

  getStocksById(id: number): Observable<Stock>{
    return this._http.get<Stock>(this.url +'/stock/'+ id);
  }

  getPurchaseTransactionByStockId(id: number): Observable<PurchaseTransaction>{
    return this._http.get<PurchaseTransaction>(this.url +'/purchasetransaction/stockid/'+ id);
  }
  
}


