const BASE = "http://localhost:5000/api";

export const getProducts = () =>
  fetch(`${BASE}/products`).then((r) => r.json());

export const getManufacturers = () =>
  fetch(`${BASE}/manufacturers`).then((r) => r.json());

export const getCategories = () =>
  fetch(`${BASE}/categories`).then((r) => r.json());

export const getCustomers = () =>
  fetch(`${BASE}/customers`).then((r) => r.json());

export const getOrders = () => fetch(`${BASE}/orders`).then((r) => r.json());

export const getOrderItems = (id) =>
  fetch(`${BASE}/orders/${id}/items`).then((r) => r.json());

export const createProduct = (data) =>
  fetch(`${BASE}/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then((r) => r.json());

export const updateProduct = (id, data) =>
  fetch(`${BASE}/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then((r) => r.json());

export const deleteProduct = (id) =>
  fetch(`${BASE}/products/${id}`, { method: "DELETE" }).then((r) => r.json());
