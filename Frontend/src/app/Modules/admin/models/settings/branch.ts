import { BankAccount } from "./bankAccount"
import { User } from "./user"

export interface Branch{
    id: number
    branchName : string
    address : string
    branchManagerId : number
    branchManager : User
    email : string
    phone : string
}