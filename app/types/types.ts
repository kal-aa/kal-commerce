import { ObjectId } from "mongodb";

export type Navlink = { name: string; href: string };
export type Testimony = { id: number; name: string; testimony: string };

export interface ProductsFormProps {
  product: EnhancedProduct;
  isAddOrdersPage: boolean;
  handleColorChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    productId: number
  ) => void;
  handleSizeChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    productId: number
  ) => void;
  handleQuantityChange: (
    e: React.ChangeEvent<HTMLSelectElement>,
    productId: number
  ) => void;
}

// Define the `Product` type (if not already defined)
export interface Product {
  productId: number;
  price: number;
  for: string;
  type: string;
  color: string[];
  size: string[];
}

export interface EnhancedProduct extends Product {
  selectedColor: string;
  selectedSize: string;
  selectedQuantity: number;
}

export interface OrderAlongWithProduct {
  id: string;
  productId: number;
  userId: string;
  price: number;
  for: string;
  type: string;
  selectedColor: string;
  selectedSize: string;
  selectedQuantity: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  orderId: string;
  productId: number;
  selectedColor: string;
  selectedSize: string;
  selectedQuantity: number;
}

// type OmitOrder = Omit<Order, "orderId">;
export interface EnhancedOrder {
  _id: ObjectId;
  userId: string;
  productId: number;
  selectedColor: string;
  selectedSize: string;
  selectedQuantity: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginationProps {
  page: number;
  pageKey?: string;
  hasMore: boolean;
  totalPages: number;
  baseUrl: string;
}

// MainGenerate Props interface
export interface MainGenerateProps {
  allProducts: EnhancedProduct[];
  isAddOrdersPage: boolean;
}
