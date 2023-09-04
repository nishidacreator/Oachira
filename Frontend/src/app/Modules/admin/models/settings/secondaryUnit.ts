import { PrimaryUnit } from './primaryUnit';
export interface SecondaryUnit{
    id : number
    secondaryUnitName : string,
    primaryUnitId : PrimaryUnit,
    factor : number,
}