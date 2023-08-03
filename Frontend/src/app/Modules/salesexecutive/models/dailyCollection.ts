
import { Customer } from "../../admin/models/customer/customer"
import { Route } from "../../admin/models/route/route"
import { User } from "../../auth/models/user"

export interface DailyCollection{
    id : number
    customerId : Customer
    amount  : number,
    date : Date,
    invoiceNo : string,
    salesExecutiveId : number,
    salesexecutive : User
    paymentMode : string
    remarks : string,
    routeId : Route
}