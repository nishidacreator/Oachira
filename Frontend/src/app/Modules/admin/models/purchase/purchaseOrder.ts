import { PurchaseEntry } from "./purchaseEntry";
import { User } from "../settings/user";
import { Vendor } from "../settings/vendor";

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