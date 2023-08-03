import { Customer } from "../customer/customer";
import { Route } from "./route";

export interface RouteDetails{
    id : number,
    routeId : Route,
    customerId : number,
    customer : Customer
    routeIndex : number
}