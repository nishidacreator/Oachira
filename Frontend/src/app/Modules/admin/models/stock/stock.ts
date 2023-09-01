import { Product } from "../settings/product"

export interface Stock{
    id : number
    type : boolean
    productId : number
    product : Product
    quantity : number
    rate : number
    mrp : number
    netAmount : number
}