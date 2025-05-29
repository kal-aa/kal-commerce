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
  status: Status;
  price: number;
  for: string;
  type: string;
  selectedColor: string;
  selectedSize: string;
  selectedQuantity: number;
  createdAt: Date;
  updatedAt: Date;
  paymentDate?: Date;
  // paymentIntentId: string; //paymentIntent.id;
  // chargeId: string; //charge.id;
}

export interface Order {
  orderId: string;
  productId: number;
  selectedColor: string;
  selectedSize: string;
  selectedQuantity: number;
}

export type Status = "Processing" | "Pending Checkout" | "Dispatched";

// type OmitOrder = Omit<Order, "orderId">;
export interface EnhancedOrder {
  _id: ObjectId;
  userId: string;
  productId: number;
  status: Status;
  selectedColor: string;
  selectedSize: string;
  selectedQuantity: number;
  createdAt: Date;
  updatedAt: Date;
  paymentDate?: Date; //new Date(paymentIntent.created * 1000);
  // paymentIntentId: string; //paymentIntent.id;
  // chargeId: string; //charge.id;
}

export interface PaginationProps {
  page: number;
  pageKey?: string;
  hasMore: boolean;
  totalPages: number;
  baseUrl: string;
}

// MainGenerate Props interface
export interface ProductsGenerateProps {
  allProducts: EnhancedProduct[];
  isAddOrdersPage: boolean;
}

export interface checkedOrdersProps {
  mappedProcessingOrders: OrderAlongWithProduct[];
  pageProcessing: number;
  pagesProcessing: number;
  hasMoreProcessing: boolean;
}

export interface LazyButtonProps {
  checked: boolean;
  setChecked: React.Dispatch<React.SetStateAction<boolean>>;
  text?: "Testimonials" | "Purchases";
}
