import { PrimaryUnit } from 'src/app/Modules/admin/models/settings/primaryUnit';
export interface SecondaryUnit{
    id : number
    secondaryUnitName : string,
    primaryUnitId : number,
    primaryUnit : PrimaryUnit
    factor : number,
}