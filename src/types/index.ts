export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  tags: string[];
  sizes: string[];
  colors: string[];
  rating: number;
  reviewCount: number;
  description: string;
  isNew?: boolean;
  isTrending?: boolean;
  isFeatured?: boolean;
  stock: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  productCount: number;
  description?: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  cta: string;
  link: string;
}

export interface Review {
  id: string;
  userName: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
  productName?: string;
}

export interface Collection {
  id: string;
  name: string;
  tagline: string;
  image: string;
  productCount: number;
  slug: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  size: string;
  color: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "USER" | "ADMIN";
}
