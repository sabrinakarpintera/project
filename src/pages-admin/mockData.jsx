export const mockStats = {
  totalSales: 24830.0,
  totalCustomers: 148,
  totalOrders: 213,
  pendingOrders: 17,
  dailySales: 3420.0,
};

export const mockOrders = [
  {
    id: "ORD-2024-001",
    customer: "Maria Santos",
    date: "April 20, 2026",
    items: 2,
    total: 2396.0,
    status: "Delivered",
    products: [
      { name: "Ruched Faux Leather", color: "Brown", size: "Small", qty: 2, price: 1398.0, image: null },
      { name: "Off Shoulder Lace",   color: "Brown", size: "Small", qty: 2, price: 998.0,  image: null },
    ],
    subtotal: 2396.0,
    shipping: 0.0,
    payment: "G-Cash",
    address: "1234, Puting Buhangin, Orion",
  },
];

export const statusColors = {
  Delivered:  "status-delivered",
  Shipped:    "status-shipped",
  Processing: "status-processing",
  Cancelled:  "status-cancelled",
};

export const trackingSteps = ["Processing", "Shipped", "Delivered"];

export function getTrackingIndex(status) {
  if (status === "Cancelled") return -1;
  return trackingSteps.indexOf(status);
}