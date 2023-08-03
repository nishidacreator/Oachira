import { Customer } from "../../admin/models/customer/customer"
import { Route } from "../../admin/models/route/route"
import { User } from "../../auth/models/user"


export interface PickList{
    id : number
    routeId : number
    route : Route
    customerId  : number,
    customer : Customer
    date : Date,
    status : string,
    salesExecutiveId : number,
    salesexecutive : User
}