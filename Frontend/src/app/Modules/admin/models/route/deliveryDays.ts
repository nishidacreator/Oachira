import { Route } from "./route"


export interface DeliveryDays{
    id: number
    routeId: number
    route: Route
    weekDay: string
}