export type Navlink = { name: string; href: string };
export type Testimony = { id: number; name: string; testimony: string };

export interface ProductsFormProps {
  product: Product;
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
  id: number;
  price: number;
  for: string;
  type: string;
  color: {
    black: string;
    electricBlue: string;
    fieryRed: string;
    limeGreen: string;
    sunsetOrange: string;
  };
  selectedColor: string;
  selectedSize: string;
  selectedQuantity: number;
}

// export interface Order {
//   _id: string;
//   userId: string;
//   productId: number;
//   selectedColor: string;
//   selectedSize: string;
//   selectedQuantity: number;
//   status: string;
//   createdAt: Date;
//   updatedAt: Date;
// }

export interface OrderAlongWithProduct {
  id: string;
  productId: number;
  price: number;
  for: string;
  type: string;
  selectedColor: string;
  selectedSize: string;
  selectedQuantity: number;
  status: string;
  updatedAt: Date;
}

// MainGenerate Props interface
export interface MainGenerateProps {
  allProducts: Product[];
  isAddOrdersPage: boolean;
}
