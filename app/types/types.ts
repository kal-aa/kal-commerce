import { ObjectId } from "mongodb";

export type Navlink = { name: string; href: string };
export type Testimony = { id: number; name: string; testimony: string };

export interface ProductCardProps {
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
export interface ProductsLogicHandlerProps {
  isAddOrdersPage: boolean;
  query?: string;
  productsPage?: string;
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
export interface ProductsListProps {
  allProducts: EnhancedProduct[];
  isAddOrdersPage: boolean;
}

export interface LazyButtonProps {
  checked: boolean;
  setChecked: React.Dispatch<React.SetStateAction<boolean>>;
  text?: "Testimonials" | "Purchases";
}

export interface OrderCardProps {
  order: OrderAlongWithProduct;
  isProcessingSection: boolean;
  loadingId: string | null;
  handleCancel: (orderId: string, isRefundable: boolean) => void;
  removeOrder: (orderId: string, action: string) => void;
}

export interface ProcessingOrdersProps {
  mappedProcessingOrders: OrderAlongWithProduct[];
  processingPage: number;
  pagesProcessing: number;
  hasMoreProcessing: boolean;
}

export interface PendingOrdersProps {
  mappedPendingOrders: OrderAlongWithProduct[];
  pagesPending: number;
  pendingPage: number;
  hasMorePending: boolean;
}

export interface OrdersPageViewProps
  extends ProcessingOrdersProps,
    PendingOrdersProps {}

export interface AdminOrderCardProps {
  order: OrderAlongWithProduct;
  userName: string;
  ordersOnPage: OrderAlongWithProduct[];
}
