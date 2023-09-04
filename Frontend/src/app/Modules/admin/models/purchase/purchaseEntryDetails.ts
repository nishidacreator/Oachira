import { Product } from "../settings/product"
import { PurchaseEntry } from "./purchaseEntry"
import { SecondaryUnit } from "../settings/secondaryUnit"
import { Tax } from "../settings/tax"

export interface PurchaseEntryDetails{
    id : number
    purchaseEntryId : number, 
    purchaseEntry : PurchaseEntry,
    purchaseOrderId : number,
    productId : number,
    product : Product
    quantity : number,
    discount : number,
    rate : number,
    grossAmount :number,
    secondaryUnitId : number,
    secondaryUnit : SecondaryUnit
    taxId : number,
    taxAmount : number,
    netAmount :number,
    mrp : number
    tax: Tax
}
