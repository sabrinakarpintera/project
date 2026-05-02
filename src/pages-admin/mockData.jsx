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
  {
    id: "ORD-2024-002",
    customer: "Lea Reyes",
    date: "April 15, 2026",
    items: 1,
    total: 849.0,
    status: "Shipped",
    products: [
      { name: "Floral Wrap Dress", color: "Ivory", size: "Medium", qty: 1, price: 849.0, image: null },
    ],
    subtotal: 849.0,
    shipping: 0.0,
    payment: "GCash",
    address: "56 Sampaguita St., Batangas City",
  },
  {
    id: "ORD-2024-003",
    customer: "Ana Cruz",
    date: "April 10, 2026",
    items: 1,
    total: 1499.0,
    status: "Processing",
    products: [
      { name: "Linen Co-ord Set", color: "Beige", size: "Small", qty: 1, price: 1499.0, image: null },
    ],
    subtotal: 1499.0,
    shipping: 0.0,
    payment: "Cash on Delivery",
    address: "89 Mabini Ave., Cavite",
  },
  {
    id: "ORD-2024-004",
    customer: "Joy Dela Cruz",
    date: "April 5, 2026",
    items: 1,
    total: 499.0,
    status: "Cancelled",
    products: [
      { name: "Knit Crop Top", color: "Cream", size: "XS", qty: 1, price: 499.0, image: null },
    ],
    subtotal: 499.0,
    shipping: 0.0,
    payment: "GCash",
    address: "12 Rizal St., Laguna",
  },
  {
    id: "ORD-2024-005",
    customer: "Carla Mendoza",
    date: "April 28, 2026",
    items: 3,
    total: 3247.0,
    status: "Processing",
    products: [
      { name: "Satin Slip Dress",    color: "Mocha", size: "Medium", qty: 2, price: 1798.0, image: null },
      { name: "Pearl Button Blouse", color: "White", size: "Small",  qty: 1, price: 1449.0, image: null },
    ],
    subtotal: 3247.0,
    shipping: 0.0,
    payment: "GCash",
    address: "321 Orchid Lane, Quezon City",
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