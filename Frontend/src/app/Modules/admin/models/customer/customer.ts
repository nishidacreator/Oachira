import { CustomerGrade } from './customerGrade';
import { CustomerCategory } from './customerCategory';
export interface Customer{
    id : number
    customerName : string,
    customerCategoryId : number,
    customerCategory : CustomerCategory
    customerGradeId : number
    customerGrade : CustomerGrade
    phoneNumber : string,
    address : string,
    location : string,
    gstNo : string,
    email : string,
    remarks : string
}