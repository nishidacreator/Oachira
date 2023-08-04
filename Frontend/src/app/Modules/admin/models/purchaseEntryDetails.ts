import { Product } from "./product"
import { PurchaseEntry } from "./purchaseEntry"
import { SecondaryUnit } from "./secondaryUnit"
import { Tax } from "./tax"

export interface PurchaseEntryDetails{
    purchaseEntryId : number, 
    purchaseEntry : PurchaseEntry 
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