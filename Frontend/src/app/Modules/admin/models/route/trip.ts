import { Branch } from "../settings/branch"
import { Route } from "./route"


export interface Trip{
    id : number
    routeId : number
    route : Route
    date  : Date
    driver : string
    salesMan : string
    status : string
    branchId : number
    branch : Branch
}