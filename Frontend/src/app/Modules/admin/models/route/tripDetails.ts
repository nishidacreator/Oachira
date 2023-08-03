import { Customer } from 'src/app/Modules/admin/models/customer/customer';
import { Trip } from "./trip"

export interface TripDetails{
    id : number
    tripId : number
    trip : Trip
    customerId  : number
    customer : Customer
    amount : number
    invoiceNo : string
}