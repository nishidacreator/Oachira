import { BankAccount } from "./bankAccount"
import { Branch } from "./branch"

export interface BranchAccount{
    branchId : number
    branch : Branch
    bankAccountId : number
    bankAccount : BankAccount
}