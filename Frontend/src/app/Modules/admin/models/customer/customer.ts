import { CustomerGrade } from './customerGrade';
import { CustomerCategory } from './customerCategory';
import { Branch } from '../settings/branch';

export interface Customer{
    id : number
    customerName : string,
    customerCategoryId : number,
    customerCategory : CustomerCategory
    customerGradeId : number
    customerGrade : CustomerGrade
    address : string,
    location : string,
    gstNo : string,
    email : string,
    remarks : string,
    subledgerCode : string
    branchId: number
    branch: Branch
}