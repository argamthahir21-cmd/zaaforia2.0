import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/types";

/* ============================================
   Auth Store
   ============================================ */
interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  loyaltyPoints: number;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: AuthUser, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) => {
        localStorage.setItem("zaaforia_token", token);
        set({ user, token, isAuthenticated: true });
      },
      logout: () => {
        localStorage.removeItem("zaaforia_token");
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    { name: "zaaforia-auth" }
  )
);

/* ============================================
   Cart Store
   ============================================ */
export interface CartItem {
  product: Product;
  quantity: number;
  size: string;
  color: string;
}

interface CartState {
  items: CartItem[];
  addItem: (product: Product, size: string, color: string, quantity?: number) => void;
  removeItem: (productId: string, size: string, color: string) => void;
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, size, color, quantity = 1) => {
        const items = get().items;
        const existing = items.find(
          (i) => i.product.id === product.id && i.size === size && i.color === color
        );
        if (existing) {
          set({
            items: items.map((i) =>
              i.product.id === product.id && i.size === size && i.color === color
                ? { ...i, quantity: i.quantity + quantity }
                : i
            ),
          });
        } else {
          set({ items: [...items, { product, quantity, size, color }] });
        }
      },

      removeItem: (productId, size, color) => {
        set({
          items: get().items.filter(
            (i) => !(i.product.id === productId && i.size === size && i.color === color)
          ),
        });
      },

      updateQuantity: (productId, size, color, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, size, color);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.product.id === productId && i.size === size && i.color === color
              ? { ...i, quantity }
              : i
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      getTotal: () => get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),

      getItemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: "zaaforia-cart" }
  )
);

/* ============================================
   Wishlist Store
   ============================================ */
interface WishlistState {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  toggleItem: (product: Product) => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        if (!get().items.find((i) => i.id === product.id)) {
          set({ items: [...get().items, product] });
        }
      },

      removeItem: (productId) => {
        set({ items: get().items.filter((i) => i.id !== productId) });
      },

      isWishlisted: (productId) => get().items.some((i) => i.id === productId),

      toggleItem: (product) => {
        if (get().isWishlisted(product.id)) {
          get().removeItem(product.id);
        } else {
          get().addItem(product);
        }
      },
    }),
    { name: "zaaforia-wishlist" }
  )
);

/* ============================================
   UI Store (Search, Mobile Menu, etc.)
   ============================================ */
interface UIState {
  searchOpen: boolean;
  mobileMenuOpen: boolean;
  cartDrawerOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  setMobileMenuOpen: (open: boolean) => void;
  setCartDrawerOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  searchOpen: false,
  mobileMenuOpen: false,
  cartDrawerOpen: false,
  setSearchOpen: (open) => set({ searchOpen: open }),
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
  setCartDrawerOpen: (open) => set({ cartDrawerOpen: open }),
}));

/* ============================================
   3D Scene Store
   ============================================ */
type SceneState = "home" | "login" | "dashboard" | "shop";

interface SceneStore {
  sceneState: SceneState;
  setSceneState: (state: SceneState) => void;
}

export const useSceneStore = create<SceneStore>((set) => ({
  sceneState: "home",
  setSceneState: (state) => set({ sceneState: state }),
}));
