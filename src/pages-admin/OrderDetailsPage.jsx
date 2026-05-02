import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard1.css";
import {
  mockOrders,
  statusColors,
  trackingSteps,
  getTrackingIndex,
} from "./mockData";

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

export default function OrderDetailsPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const filters = ["All", "Processing", "Shipped", "Delivered", "Cancelled"];
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const filteredOrders =
    filterStatus === "All"
      ? mockOrders
      : mockOrders.filter((o) => o.status === filterStatus);

  const navItems = [
    { label: "Home",           icon: HomeIcon,    onClick: () => navigate("/admin/dashboard") },
    { label: "Add Item",       icon: AddIcon,     onClick: () => navigate("/admin/addproduct") },
    { label: "Product Listed", icon: ProductIcon, onClick: () => navigate("/admin/productlist") },
    { label: "Order Details",  icon: OrderIcon,   onClick: null /* current page */ },
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
                className={`nav-btn ${item.label === "Order Details" ? "nav-btn--active" : ""}`}
                onClick={item.onClick ?? undefined}
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
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center", padding: "1.5rem" }}>
                      No orders found.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="order-row">
                      <td className="order-id">{order.id}</td>
                      <td>{order.customer}</td>
                      <td>{order.date}</td>
                      <td>{order.items} {order.items === 1 ? "item" : "items"}</td>
                      <td className="order-total">
                        ₱{order.total.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                      </td>
                      <td>
                        <span className={`status-badge ${statusColors[order.status]}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="action-cell">
                        <button className="action-view" onClick={() => setSelectedOrder(order)}>
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {selectedOrder && (
        <OrderModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </div>
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
                <span className={`tracking-label ${i <= trackIdx ? "tracking-label-done" : ""}`}>
                  {step}
                </span>
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
                <span className="modal-product-meta">
                  Color: {p.color} · Size: {p.size} · x{p.qty}
                </span>
              </div>
              <span className="modal-product-price">
                ₱{p.price.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
              </span>
            </div>
          ))}
        </div>

        <div className="modal-divider" />

        <div className="modal-summary">
          <div className="modal-summary-row">
            <span>Subtotal</span>
            <span>₱{order.subtotal.toLocaleString("en-PH", { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="modal-summary-row">
            <span>Shipping</span>
            <span>₱{order.shipping.toLocaleString("en-PH", { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="modal-summary-row">
            <span>Payment</span>
            <span>{order.payment}</span>
          </div>
          <div className="modal-summary-row">
            <span>Address</span>
            <span className="modal-address">{order.address}</span>
          </div>
        </div>

        <div className="modal-divider" />

        <div className="modal-total-row">
          <span className="modal-total-label">Total</span>
          <span className="modal-total-value">
            ₱{order.total.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>
    </div>
  );
}