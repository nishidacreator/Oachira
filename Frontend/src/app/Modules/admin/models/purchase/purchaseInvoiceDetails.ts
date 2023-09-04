import { PurchaseEntryDetails } from "./purchaseEntryDetails";
import { User } from "../settings/user";
import { Vendor } from "../settings/vendor";

export interface PurchaseInvoiceDetails{
    purchaseEntryId : number, 
    purchaseInvoice : string,
    vendorId : number,
    vendor : Vendor
    purchaseAmount : number,
    userId : number,
    user : User
    purchaseOrderId : number,
    eWayBillNo : string,
    purachseDate : string,
    purchaseEntryDetails : PurchaseEntryDetails
}





