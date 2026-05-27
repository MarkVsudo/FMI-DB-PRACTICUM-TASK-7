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
