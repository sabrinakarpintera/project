import { useState } from "react";
import "./style/OrderManagement.css";
 
const mockOrders = [
  {
    id: "ORD-2024-001",
    date: "April 20, 2026",
    status: "Delivered",
    items: [
      { name: "Ruched Faux Leather", color: "Brown", size: "Small", qty: 2, price: 699 },
      { name: "Off Shoulder Lace", color: "Brown", size: "Small", qty: 2, price: 499 },
    ],
    total: 2396,
    payment: "G-Cash",
    address: "1234, Puting Buhangin, Orion",
  },
];
 
const STEPS = ["Processing", "Shipped", "Delivered"];
 
const STATUS_CLASS = {
  Delivered: "badge-delivered",
  Shipped: "badge-shipped",
  Processing: "badge-processing",
  Cancelled: "badge-cancelled",
};
 
export default function OrderManagement() {
  const [orders, setOrders] = useState(mockOrders);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("All");
  const [cancelId, setCancelId] = useState(null);
 
  const filtered = filter === "All" ? orders : orders.filter(o => o.status === filter);
 
  const doCancel = (id) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: "Cancelled" } : o));
    if (selected?.id === id) setSelected(prev => ({ ...prev, status: "Cancelled" }));
    setCancelId(null);
  };
 
  const stepIdx = selected ? STEPS.indexOf(selected.status) : -1;
 
  return (
    
    <div className="root">
 
      <main className="main">
        
        <h1 className="page-title">My Orders</h1>
 
        <div className="filters">
          {["All", "Processing", "Shipped", "Delivered", "Cancelled"].map(f => (
            <button key={f} className={`filter-btn ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>
 
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Order ID</th><th>Date</th><th>Items</th><th>Total</th><th>Status</th><th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(order => (
                <tr key={order.id} className="table-row" onClick={() => setSelected(order)}>
                  <td className="order-id">{order.id}</td>
                  <td>{order.date}</td>
                  <td>{order.items.length} item{order.items.length > 1 ? "s" : ""}</td>
                  <td><strong>₱{order.total.toLocaleString()}.00</strong></td>
                  <td><span className={`badge ${STATUS_CLASS[order.status]}`}>{order.status}</span></td>
                  <td onClick={e => e.stopPropagation()}>
                    <button className="btn-view" onClick={() => setSelected(order)}>View</button>
                    {["Processing", "Shipped"].includes(order.status) && (
                      <button className="btn-cancel" onClick={() => setCancelId(order.id)}>Cancel</button>
                    )}
                  </td>
                </tr>
              ))}
              {!filtered.length && <tr><td colSpan={6} className="empty">No orders found.</td></tr>}
            </tbody>
          </table>
        </div>
      </main>
 
      {selected && (
        <div className="overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2 className="modal-title">Order Details</h2>
                <p className="modal-sub">{selected.id} · {selected.date}</p>
              </div>
              <button className="close-btn" onClick={() => setSelected(null)}>✕</button>
            </div>
 
            {selected.status !== "Cancelled" ? (
              <div className="tracker">
                {STEPS.map((step, i) => (
                  <div key={step} className="step-wrap">
                    <div className={`step ${i <= stepIdx ? "step-done" : ""}`}>
                      <div className="step-dot">{i <= stepIdx ? "✓" : i + 1}</div>
                      <span className="step-label">{step}</span>
                    </div>
                    {i < STEPS.length - 1 && <div className={`step-line ${i < stepIdx ? "line-done" : ""}`} />}
                  </div>
                ))}
              </div>
            ) : (
              <div className="cancelled-banner">Order Cancelled</div>
            )}
 
            <div className="modal-items">
              {selected.items.map((item, i) => (
                <div key={i} className="modal-item">
                  <div className="item-thumb" />
                  <div className="item-info">
                    <p className="item-name">{item.name}</p>
                    <p className="item-sub">Color: {item.color} · Size: {item.size} · x{item.qty}</p>
                  </div>
                  <p className="item-price">₱{(item.price * item.qty).toLocaleString()}.00</p>
                </div>
              ))}
            </div>
 
            <div className="summary">
              {[["Subtotal", `₱${selected.total.toLocaleString()}.00`], ["Shipping", "₱0.00"], ["Payment", selected.payment], ["Address", selected.address]].map(([k, v]) => (
                <div key={k} className="summary-row"><span>{k}</span><span>{v}</span></div>
              ))}
              <div className="summary-row summary-total"><span>Total</span><span>₱{selected.total.toLocaleString()}.00</span></div>
            </div>
 
            {["Processing", "Shipped"].includes(selected.status) && (
              <button className="btn-cancel-order" onClick={() => setCancelId(selected.id)}>Cancel Order</button>
            )}
          </div>
        </div>
      )}
 
      {cancelId && (
        <div className="overlay" onClick={() => setCancelId(null)}>
          <div className="confirm" onClick={e => e.stopPropagation()}>
            <h3>Cancel Order?</h3>
            <p>Are you sure you want to cancel this order? This cannot be undone.</p>
            <div className="confirm-actions">
              <button className="btn-keep" onClick={() => setCancelId(null)}>Keep Order</button>
              <button className="btn-confirm-cancel" onClick={() => doCancel(cancelId)}>Yes, Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
