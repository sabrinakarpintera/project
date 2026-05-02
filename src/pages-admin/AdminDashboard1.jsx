import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./AdminDashboard1.css";
 
const mockStats = {
  totalSales: 24830.0,
  totalCustomers: 148,
  totalOrders: 213,
  pendingOrders: 17,
  dailySales: 3420.0,
};
 
const mockOrders = [
  {
    id: "ORD-2024-001",
    customer: "Maria Santos",
    date: "April 20, 2026",
    items: 2,
    total: 2396.0,
    status: "Delivered",
    products: [
      {
        name: "Ruched Faux Leather",
        color: "Brown",
        size: "Small",
        qty: 2,
        price: 1398.0,
        image: null,
      },
      {
        name: "Off Shoulder Lace",
        color: "Brown",
        size: "Small",
        qty: 2,
        price: 998.0,
        image: null,
      },
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
      {
        name: "Floral Wrap Dress",
        color: "Ivory",
        size: "Medium",
        qty: 1,
        price: 849.0,
        image: null,
      },
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
      {
        name: "Linen Co-ord Set",
        color: "Beige",
        size: "Small",
        qty: 1,
        price: 1499.0,
        image: null,
      },
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
      {
        name: "Knit Crop Top",
        color: "Cream",
        size: "XS",
        qty: 1,
        price: 499.0,
        image: null,
      },
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
      {
        name: "Satin Slip Dress",
        color: "Mocha",
        size: "Medium",
        qty: 2,
        price: 1798.0,
        image: null,
      },
      {
        name: "Pearl Button Blouse",
        color: "White",
        size: "Small",
        qty: 1,
        price: 1449.0,
        image: null,
      },
    ],
    subtotal: 3247.0,
    shipping: 0.0,
    payment: "GCash",
    address: "321 Orchid Lane, Quezon City",
  },
];
 
const statusColors = {
  Delivered: "status-delivered",
  Shipped: "status-shipped",
  Processing: "status-processing",
  Cancelled: "status-cancelled",
};
 
const trackingSteps = ["Processing", "Shipped", "Delivered"];
 
function getTrackingIndex(status) {
  if (status === "Cancelled") return -1;
  return trackingSteps.indexOf(status);
}
 
export default function AdminDashboard() {
  const navigate = useNavigate();

    const handleLogout = () => {
      localStorage.clear();
      navigate("/");
    };
    
  const [activePage, setActivePage] = useState("Home");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);
 
  const filters = ["All", "Processing", "Shipped", "Delivered", "Cancelled"];
 
  const filteredOrders =
    filterStatus === "All"
      ? mockOrders
      : mockOrders.filter((o) => o.status === filterStatus);
 
  const navItems = [
    { label: "Home", icon: HomeIcon },
    { label: "Add Item", icon: AddIcon, onClick: () => navigate("/admin/addproduct") },
    { label: "Product Listed", icon: ProductIcon, onClick: () => navigate("/admin/productlist") },
    { label: "Order Details", icon: OrderIcon },
  ];
 
  return (
    <div className="admin-root">
      <header className="admin-header">
        <div className="admin-header-inner">
          <span className="admin-logo">Fuku</span>
          <nav className="admin-nav">
            {navItems.map((item) => (
              <button
                key={item.label}
                className={`nav-btn ${activePage === item.label ? "nav-btn--active" : ""}`}
                onClick={() => setActivePage(item.label)}
              >
                <item.icon />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
          <button className="signout-btn" onClick={handleLogout}>
            <SignOutIcon />
            <span>Sign Out</span>
          </button>
        </div>
      </header>
 
      <main className="admin-main">
        {activePage === "Home" && (
          <HomePage stats={mockStats} orders={mockOrders} onView={(o) => { setSelectedOrder(o); setActivePage("Order Details"); }} />
        )}
        {activePage === "Add Item" && <BlankPage title="Add Item" />}
        {activePage === "Product Listed" && <BlankPage title="Product Listed" />}
        {activePage === "Order Details" && (
          <OrderDetailsPage
            orders={filteredOrders}
            allOrders={mockOrders}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            filters={filters}
            onView={setSelectedOrder}
          />
        )}
      </main>
 
      {selectedOrder && (
        <OrderModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </div>
  );
}
 
function HomePage({ stats, orders, onView }) {
  const recentOrders = orders.slice(0, 5);
  return (
    <div className="page-home">
      <div className="page-title-row">
        <h1 className="page-title">Dashboard</h1>
        <span className="page-date">April 28, 2026</span>
      </div>
 
      <div className="stats-grid">
        <StatCard
          label="Total Sales"
          value={`₱${stats.totalSales.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`}
          icon={<SalesIcon />}
          accent="accent-brown"
        />
        <StatCard
          label="Total Customers"
          value={stats.totalCustomers}
          icon={<CustomersIcon />}
          accent="accent-sage"
        />
        <StatCard
          label="Total Orders"
          value={stats.totalOrders}
          icon={<OrderIcon />}
          accent="accent-blush"
        />
        <StatCard
          label="Pending Orders"
          value={stats.pendingOrders}
          icon={<PendingIcon />}
          accent="accent-amber"
        />
        <StatCard
          label="Daily Sales"
          value={`₱${stats.dailySales.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`}
          icon={<DailyIcon />}
          accent="accent-teal"
        />
      </div>
 
      <div className="section-card">
        <div className="section-header">
          <h2 className="section-title">Recent Orders</h2>
        </div>
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order) => (
              <OrderRow key={order.id} order={order} onView={onView} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
 
function StatCard({ label, value, icon, accent }) {
  return (
    <div className={`stat-card ${accent}`}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-info">
        <span className="stat-label">{label}</span>
        <span className="stat-value">{value}</span>
      </div>
    </div>
  );
}
 
function OrderDetailsPage({ orders, filterStatus, setFilterStatus, filters, onView }) {
  return (
    <div className="page-orders">
      <div className="page-title-row">
        <h1 className="page-title">Order Details</h1>
      </div>
      <div className="filter-row">
        {filters.map((f) => (
          <button
            key={f}
            className={`filter-btn ${filterStatus === f ? "filter-btn--active" : ""}`}
            onClick={() => setFilterStatus(f)}
          >
            {f}
          </button>
        ))}
      </div>
      <div className="section-card">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <OrderRowWithAction key={order.id} order={order} onView={onView} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
 
function OrderRow({ order, onView }) {
  return (
    <tr className="order-row">
      <td className="order-id">{order.id}</td>
      <td>{order.customer}</td>
      <td>{order.date}</td>
      <td>{order.items} {order.items === 1 ? "item" : "items"}</td>
      <td className="order-total">₱{order.total.toLocaleString("en-PH", { minimumFractionDigits: 2 })}</td>
      <td>
        <span className={`status-badge ${statusColors[order.status]}`}>
          {order.status}
        </span>
      </td>
    </tr>
  );
}

function OrderRowWithAction({ order, onView }) {
  return (
    <tr className="order-row">
      <td className="order-id">{order.id}</td>
      <td>{order.customer}</td>
      <td>{order.date}</td>
      <td>{order.items} {order.items === 1 ? "item" : "items"}</td>
      <td className="order-total">₱{order.total.toLocaleString("en-PH", { minimumFractionDigits: 2 })}</td>
      <td>
        <span className={`status-badge ${statusColors[order.status]}`}>
          {order.status}
        </span>
      </td>
      <td className="action-cell">
        <button className="action-view" onClick={() => onView(order)}>View</button>
      </td>
    </tr>
  );
}
 
function OrderModal({ order, onClose }) {
  const trackIdx = getTrackingIndex(order.status);
 
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <h2 className="modal-title">Order Details</h2>
        <p className="modal-subtitle">{order.id} · {order.date}</p>
 
        {order.status !== "Cancelled" ? (
          <div className="tracking-bar">
            {trackingSteps.map((step, i) => (
              <div key={step} className="tracking-step-wrap">
                <div className={`tracking-circle ${i <= trackIdx ? "tracking-done" : ""}`}>
                  {i <= trackIdx ? "✓" : ""}
                </div>
                <span className={`tracking-label ${i <= trackIdx ? "tracking-label-done" : ""}`}>{step}</span>
                {i < trackingSteps.length - 1 && (
                  <div className={`tracking-line ${i < trackIdx ? "tracking-line-done" : ""}`} />
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="cancelled-badge-large">Order Cancelled</div>
        )}
 
        <div className="modal-divider" />
 
        <div className="modal-customer-row">
          <span className="modal-field-label">Customer</span>
          <span className="modal-field-value">{order.customer}</span>
        </div>
 
        <div className="modal-divider" />
 
        <div className="modal-products">
          {order.products.map((p, i) => (
            <div key={i} className="modal-product-row">
              <div className="modal-product-img" />
              <div className="modal-product-info">
                <span className="modal-product-name">{p.name}</span>
                <span className="modal-product-meta">Color: {p.color} · Size: {p.size} · x{p.qty}</span>
              </div>
              <span className="modal-product-price">₱{p.price.toLocaleString("en-PH", { minimumFractionDigits: 2 })}</span>
            </div>
          ))}
        </div>
 
        <div className="modal-divider" />
 
        <div className="modal-summary">
          <div className="modal-summary-row">
            <span>Subtotal</span><span>₱{order.subtotal.toLocaleString("en-PH", { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="modal-summary-row">
            <span>Shipping</span><span>₱{order.shipping.toLocaleString("en-PH", { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="modal-summary-row">
            <span>Payment</span><span>{order.payment}</span>
          </div>
          <div className="modal-summary-row">
            <span>Address</span><span className="modal-address">{order.address}</span>
          </div>
        </div>
 
        <div className="modal-divider" />
 
        <div className="modal-total-row">
          <span className="modal-total-label">Total</span>
          <span className="modal-total-value">₱{order.total.toLocaleString("en-PH", { minimumFractionDigits: 2 })}</span>
        </div>
      </div>
    </div>
  );
}
 
function BlankPage({ title }) {
  return (
    <div className="blank-page">
      <h1 className="page-title">{title}</h1>
    </div>
  );
}
 
function HomeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}
function AddIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  );
}
function ProductIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
    </svg>
  );
}
function OrderIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}
function SignOutIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}
function SalesIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}
function CustomersIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
function PendingIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
function DailyIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}
