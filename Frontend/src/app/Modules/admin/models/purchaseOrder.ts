import { PurchaseEntry } from "./purchaseEntry";
import { User } from "./user";
import { Vendor } from "./vendor";

export interface PurchaseOrder{
    id: number;
    purchaseOrderNo : string,
    vendorId : number,
    vendor : Vendor
    purchaseAmount : number,
    userId : number,
    user : User
    //purchaseOrderId : ,
    eWayBillNo : string,
    purachseDate : string
    requestedPurchaseDate: Date
    purchaseEntry: PurchaseEntry
}