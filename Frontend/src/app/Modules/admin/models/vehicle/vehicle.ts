import { VehicleType } from "./vehicle-type"

export interface Vehicle{
    id : number,
    registrationNumber : string,
    vehicleTypeId : number,
    vehicleType: VehicleType
    taxExpiry : Date,
    insuranceExpiry : Date,
    polutionExpiry : Date,
    capacity : Date
    fitnessExpiry : Date
    permitExpiry : Date
}