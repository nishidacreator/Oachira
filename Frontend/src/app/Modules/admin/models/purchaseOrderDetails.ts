import { Product } from "./product"
import { PurchaseOrder } from "./purchaseOrder"


export interface PurchaseOrderDetails{
    id : number;
    purchaseOrderId : number, 
    purchaseOrder : PurchaseOrder
    productId : number,
    product : Product
    quantity : number
}
