import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productsApi, categoriesApi, bannersApi, authApi, reviewsApi } from "./api";
import { useAuthStore } from "./store";
import type { Product, Category, Banner, Review } from "@/types";

// ─── Products ──────────────────────────────────────────────────────────────

export function useProducts(params?: { page?: number; size?: number; sort?: string; category?: string }) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => productsApi.getAll(params),
    staleTime: 60_000,
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => productsApi.getById(id) as Promise<Product>,
    enabled: !!id,
  });
}

export function useNewArrivals() {
  return useQuery({
    queryKey: ["products", "new-arrivals"],
    queryFn: () => productsApi.getNewArrivals() as Promise<Product[]>,
    staleTime: 60_000,
  });
}

export function useTrendingProducts() {
  return useQuery({
    queryKey: ["products", "trending"],
    queryFn: () => productsApi.getTrending() as Promise<Product[]>,
    staleTime: 60_000,
  });
}

export function useRecommendations() {
  return useQuery({
    queryKey: ["products", "recommendations"],
    queryFn: () => fetch("/api/products/recommendations").then(r => r.json()) as Promise<Product[]>,
    staleTime: 60_000,
  });
}

export function useFeaturedProducts() {
  return useQuery({
    queryKey: ["products", "featured"],
    queryFn: () => productsApi.getFeatured() as Promise<Product[]>,
    staleTime: 60_000,
  });
}

export function useSearchProducts(q: string, page = 0) {
  return useQuery({
    queryKey: ["products", "search", q, page],
    queryFn: () => productsApi.search(q, page),
    enabled: !!q && q.length >= 2,
    staleTime: 30_000,
  });
}

// ─── Categories ────────────────────────────────────────────────────────────

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => categoriesApi.getAll() as Promise<Category[]>,
    staleTime: 300_000,
  });
}

export function useCategory(slug: string) {
  return useQuery({
    queryKey: ["category", slug],
    queryFn: () => categoriesApi.getBySlug(slug) as Promise<Category>,
    enabled: !!slug,
  });
}

// ─── Banners ───────────────────────────────────────────────────────────────

export function useBanners() {
  return useQuery({
    queryKey: ["banners"],
    queryFn: () => bannersApi.getActive() as Promise<Banner[]>,
    staleTime: 300_000,
  });
}

// ─── Reviews ───────────────────────────────────────────────────────────────

export function useProductReviews(productId: string) {
  return useQuery({
    queryKey: ["reviews", productId],
    queryFn: () => reviewsApi.getByProduct(productId) as Promise<Review[]>,
    enabled: !!productId,
  });
}

// ─── Auth Mutations ────────────────────────────────────────────────────────

export function useLogin() {
  const setAuth = useAuthStore((state) => state.setAuth);
  return useMutation({
    mutationFn: (data: { email: string; password: string }) => authApi.login(data) as Promise<any>,
    onSuccess: (data: any) => {
      if (data?.token) setAuth(data.user, data.token);
    },
  });
}

export function useRegister() {
  const setAuth = useAuthStore((state) => state.setAuth);
  return useMutation({
    mutationFn: (data: { name: string; email: string; password: string }) =>
      authApi.register(data) as Promise<any>,
    onSuccess: (data: any) => {
      if (data?.token) setAuth(data.user, data.token);
    },
  });
}

// ─── Admin mutations ───────────────────────────────────────────────────────

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (product: Partial<Product>) =>
      fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      }).then((r) => {
        if (!r.ok) throw new Error("Failed to create product");
        return r.json();
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, product }: { id: string; product: Partial<Product> }) =>
      fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      }).then((r) => {
        if (!r.ok) throw new Error("Failed to update product");
        return r.json();
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      fetch(`/api/products/${id}`, {
        method: "DELETE",
      }).then((r) => {
        if (!r.ok) throw new Error("Failed to delete product");
        return r.json();
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}

// ─── Admin Category mutations ────────────────────────────────────────────────

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (category: Partial<Category>) => categoriesApi.create(category),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
}

export function useUpdateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, category }: { id: string; category: Partial<Category> }) => categoriesApi.update(id, category),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => categoriesApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
}

export function useUploadImage() {
  return useMutation({
    mutationFn: async ({ file, folder }: { file: File; folder?: string }) => {
      const formData = new FormData();
      formData.append("file", file);
      if (folder) formData.append("folder", folder);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      return res.json() as Promise<{ url: string; publicId: string }>;
    },
  });
}

