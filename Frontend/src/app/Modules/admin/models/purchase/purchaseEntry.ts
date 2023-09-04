import { User } from "../settings/user";
import { Vendor } from "../settings/vendor";

export interface PurchaseEntry{
    id: number;
    purchaseInvoice : string,
    vendorId : number,
    vendor : Vendor
    purchaseAmount : number,
    userId : number,
    user : User
    //purchaseOrderId : ,
    eWayBillNo : string,
    purachseDate : string
}