import { Category } from "./category";
import { Brand } from "./brand";
import { PrimaryUnit } from "./primaryUnit";
export interface Product {
    id: number;
    productName: string;
    code: string;
    barCode: string;
    primaryUnitId: number; 
    categoryId: number; 
    brandId: number; 
    reorderQuantity: number | null;
    loyaltyPoint: number | null;
    primaryUnit: PrimaryUnit,
    brand: Brand; 
    category: Category; 
    product_image?: string;
  }