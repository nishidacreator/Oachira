import { Product } from '../../admin/models/product';
import { PickList } from './pickList';
export interface PickListDetails{
    id : number
    pickListId : number,
    pickList : PickList
    productId  : number,
    product : Product
    quantity : number
}