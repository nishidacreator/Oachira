import { Category } from "./category";
import {Brand} from "./brand"
import { PrimaryUnit } from "./primaryUnit";

export interface Product{
    id:number,
    productName : string,
    code : string,
    barCode : string,
    primaryUnitId : PrimaryUnit,
    categoryId : Category,
    brandId : Brand,
    reorderQuantity : number,
    loyaltyPoint : number

}