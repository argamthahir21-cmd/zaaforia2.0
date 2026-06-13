const API_BASE = "/api";

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("zaaforia_token") : null;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Request failed" }));
    throw new Error(error.message || `HTTP ${res.status}`);
  }

  return res.json();
}

// Auth
export const authApi = {
  register: (data: { name: string; email: string; password: string }) =>
    request("/auth/register", { method: "POST", body: JSON.stringify(data) }),

  login: (data: { email: string; password: string }) =>
    request("/auth/login", { method: "POST", body: JSON.stringify(data) }),

  getProfile: () => request("/auth/profile"),
};

// Products
export const productsApi = {
  getAll: (params?: { page?: number; size?: number; sort?: string; category?: string }) => {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.size) query.set("size", String(params.size));
    if (params?.sort) query.set("sort", params.sort);
    if (params?.category) query.set("category", params.category);
    return request(`/products?${query.toString()}`);
  },

  getById: (id: string) => request(`/products/${id}`),
  getNewArrivals: () => request("/products/new-arrivals"),
  getTrending: () => request("/products/trending"),
  getFeatured: () => request("/products/featured"),
  search: (q: string, page = 0) => request(`/products/search?q=${q}&page=${page}`),
};

// Categories
export const categoriesApi = {
  getAll: () => request("/categories"),
  getBySlug: (slug: string) => request(`/categories/${slug}`),
  create: (data: any) => request("/categories", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: any) => request(`/categories/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: string) => request(`/categories/${id}`, { method: "DELETE" }),
};

// Banners
export const bannersApi = {
  getActive: () => request("/banners"),
};

// Reviews
export const reviewsApi = {
  getByProduct: (productId: string) => request(`/reviews/${productId}`),
};

export default request;
