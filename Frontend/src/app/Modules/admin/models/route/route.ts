import { User } from "../user";
import { Vehicle } from "../vehicle/vehicle";

export interface Route{
    id : number,
    routeName : string,
    vehicleId  :number,
    vehicle : Vehicle
    driverId : number,
    driver : User
    salesManId : number
    salesman : User
    salesExecutiveId : number
    salesexecutive : User
}