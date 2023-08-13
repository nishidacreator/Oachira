import { PurchaseEntry } from "../purchaseEntry"
import { Stock } from "./stock"

export interface PurchaseTransaction{
    id: number
    stockId: number
    stock: Stock
    purchaseEntryId: number
    purchaseEntry: PurchaseEntry
}