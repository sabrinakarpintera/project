import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import "./style/OrderDetailsPage.css";
import logoImage from "../assets/fuku-logo.png";

const Icon = ({ name }) => <span className="material-icons">{name}</span>;

const statusColors = {
  Delivered:          "status-delivered",
  Shipped:            "status-shipped",
  Processing:         "status-processing",
  Cancelled:          "status-cancelled",
  Completed:          "status-completed",
  "Refund Requested": "status-refund-requested",
  "Refund Approved":  "status-refund-approved",
  Refunded:           "status-refunded",
};

const trackingSteps = ["Processing", "Shipped", "Delivered", "Received"];

function getTrackingIndex(status) {
  if (status === "Cancelled") return -1;
  if (["Refund Requested", "Refund Approved", "Refunded", "Completed"].includes(status)) return 3;
  return trackingSteps.indexOf(status);
}

function getStatusLabel(status) {
  if (status === "Completed") return "Received";
  return status;
}

const statusActions = {
  Processing: [
    {
      label: "Mark as Shipped",
      nextStatus: "Shipped",
      icon: "local_shipping",
      className: "status-action-btn status-action-ship",
    },
  ],
  Shipped: [
    {
      label: "Mark as Delivered",
      nextStatus: "Delivered",
      icon: "check_circle",
      className: "status-action-btn status-action-deliver",
    },
  ],
  Delivered:          [],
  Completed:          [],
  Cancelled:          [],
  "Refund Requested": [
    {
      label: "Approve Refund Request",
      nextStatus: "Refund Approved",
      icon: "verified",
      className: "status-action-btn status-action-refund-approve",
    },
  ],
  "Refund Approved": [
    {
      label: "Mark as Refunded",
      nextStatus: "Refunded",
      icon: "payments",
      className: "status-action-btn status-action-refunded",
    },
  ],
  Refunded: [],
};

export default function OrderDetailsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([]);

  const fetchOrders = () => {
    fetch("http://localhost/Fuku/src/api/get_orders.php")
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((err) => console.error(err));
  };

  useEffect(() => { fetchOrders(); }, []);

  const filters = [
    "All", "Processing", "Shipped", "Delivered",
    "Completed", "Cancelled",
    "Refund Requested", "Refund Approved", "Refunded",
  ];

  const filteredOrders =
    filterStatus === "All"
      ? orders
      : orders.filter((o) => o.status === filterStatus);

  const navItems = [
    { label: "Home",           icon: "home",         path: "/admin/dashboard" },
    { label: "Product Listed", icon: "inventory_2",  path: "/admin/productlist" },
    { label: "Order Details",  icon: "receipt_long", path: "/admin/orderdetails" },
  ];

  const handleStatusUpdate = (updatedOrder) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o))
    );
    setSelectedOrder(updatedOrder);
  };

  return (
    <div className="admin-root">
      <header className="admin-header">
        <div className="admin-header-inner">
          <span className="logo">
            <img src={logoImage} alt="Fuku Logo" />
          </span>
          <nav className="admin-nav">
            {navItems.map((item) => (
              <button
                key={item.label}
                className={`nav-btn ${item.path === currentPath ? "nav-btn--active" : ""}`}
                onClick={() => navigate(item.path)}
              >
                <Icon name={item.icon} />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
          <button className="signout-btn" onClick={handleLogout}>
            <Icon name="logout" />
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
                {filteredOrders.map((order) => (
                  <OrderRowWithAction
                    key={order.id}
                    order={order}
                    onView={setSelectedOrder}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {selectedOrder && (
        <OrderModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusUpdate={handleStatusUpdate}
        />
      )}
    </div>
  );
}

/* ─── Order Table Row ─────────────────────────────────────────── */
function OrderRowWithAction({ order, onView }) {
  return (
    <tr className="order-row">
      <td className="order-id">{order.id}</td>
      <td>{order.customer}</td>
      <td>{order.date}</td>
      <td>{order.item_count} {order.item_count === 1 ? "item" : "items"}</td>
      <td className="order-total">
        ₱{order.total.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
      </td>
      <td>
        <span className={`status-badge ${statusColors[order.status] ?? ""}`}>
          {getStatusLabel(order.status)}
        </span>
      </td>
      <td className="action-cell">
        <button className="action-view" onClick={() => onView(order)}>
          View
        </button>
      </td>
    </tr>
  );
}

/* ─── Order Modal ─────────────────────────────────────────────── */
function OrderModal({ order, onClose, onStatusUpdate }) {
  const trackIdx = getTrackingIndex(order.status);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showRefundModal, setShowRefundModal]   = useState(false);
  const [updating, setUpdating]                 = useState(false);
  const [confirmAction, setConfirmAction]       = useState(null);
  const [refundDetails, setRefundDetails]       = useState(null);
  const [refundLoading, setRefundLoading]       = useState(false);

  const isRefundStatus = ["Refund Requested", "Refund Approved", "Refunded"].includes(order.status);

  useEffect(() => {
    if (!isRefundStatus) return;
    setRefundLoading(true);
    fetch(`http://localhost/Fuku/src/api/get_refund_details.php?order_code=${order.id}`)
      .then((res) => res.json())
      .then((data) => setRefundDetails(data.refund ?? null))
      .catch((err) => console.error("Refund fetch error:", err))
      .finally(() => setRefundLoading(false));
  }, [order.id, order.status]);

  const handleStatusChange = (nextStatus) => {
    setUpdating(true);
    fetch("http://localhost/Fuku/src/api/update_order_status.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: order.id, status: nextStatus }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          onStatusUpdate({ ...order, status: nextStatus });
        } else {
          alert("Failed to update status.");
        }
      })
      .catch((err) => console.error(err))
      .finally(() => {
        setUpdating(false);
        setConfirmAction(null);
      });
  };

  const actions = statusActions[order.status] || [];

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-box" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={onClose}>✕</button>
          <h2 className="modal-title">Order Details</h2>
          <p className="modal-subtitle">{order.id} · {order.date}</p>

          {/* ── Tracking Bar ── */}
          {order.status !== "Cancelled" ? (
            <div className="tracking-bar">
              {trackingSteps.map((step, i) => (
                <div key={step} className="tracking-step-wrap">
                  <div className={[
                    "tracking-circle",
                    i <= trackIdx ? "tracking-done" : "",
                    step === "Received" && i <= trackIdx ? "tracking-received" : "",
                  ].join(" ")}>
                    {i <= trackIdx ? "✓" : ""}
                  </div>
                  <span className={[
                    "tracking-label",
                    i <= trackIdx ? "tracking-label-done" : "",
                    step === "Received" && i <= trackIdx ? "tracking-label-received" : "",
                  ].join(" ")}>
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

          {/* ── Refund Status Banner ── */}
          {isRefundStatus && (
            <div className={`refund-status-banner refund-banner-${order.status.replace(/\s+/g, "-").toLowerCase()}`}>
              <Icon name={
                order.status === "Refund Requested" ? "assignment_return" :
                order.status === "Refund Approved"  ? "verified"          :
                "payments"
              } />
              <span>
                {order.status === "Refund Requested" && "Customer has submitted a refund request for this order."}
                {order.status === "Refund Approved"  && "Refund has been approved. Awaiting disbursement to customer."}
                {order.status === "Refunded"         && "Refund has been completed and sent to the customer."}
              </span>
            </div>
          )}

          <div className="modal-divider" />

          {/* ── Status Actions ── */}
          {actions.length > 0 && (
            <>
              <div className="status-actions-section">
                <span className="status-actions-label">
                  <Icon name="tune" /> Manage Order Status
                </span>
                <div className="status-actions-row">
                  {actions.map((action) => (
                    <button
                      key={action.nextStatus}
                      className={action.className}
                      disabled={updating}
                      onClick={() => setConfirmAction(action)}
                    >
                      <Icon name={action.icon} />
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="modal-divider" />
            </>
          )}

          {/* ── Customer ── */}
          <div className="modal-customer-row">
            <span className="modal-field-label">Customer</span>
            <span className="modal-field-value">{order.customer}</span>
          </div>
          <div className="modal-divider" />

          {/* ── Products ── */}
          <div className="modal-products">
            {order.items && order.items.map((p, i) => (
              <div key={i} className="modal-product-row">
                <div className="modal-product-img-wrap">
                  <img
                    src={`http://localhost/Fuku/src/api/${p.image}`}
                    alt={p.name}
                    className="modal-product-img"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://placehold.co/60x60?text=No+Image";
                    }}
                  />
                </div>
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

          {/* ── Summary ── */}
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

          {/* ── Total ── */}
          <div className="modal-total-row">
            <span className="modal-total-label">Total</span>
            <span className="modal-total-value">
              ₱{order.total.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="modal-divider" />

          {/* ── Footer Buttons ── */}
          <div className="modal-footer-actions">
            <button className="payment-verify-btn" onClick={() => setShowPaymentModal(true)}>
              <Icon name="verified" /> View Payment Verification
            </button>
            {isRefundStatus && (
              <button
                className="refund-details-btn"
                onClick={() => setShowRefundModal(true)}
                disabled={refundLoading}
              >
                <Icon name="assignment_return" />
                {refundLoading ? "Loading..." : "View Refund Details"}
              </button>
            )}
          </div>
        </div>
      </div>

      {confirmAction && (
        <ConfirmStatusModal
          action={confirmAction}
          order={order}
          updating={updating}
          onConfirm={() => handleStatusChange(confirmAction.nextStatus)}
          onCancel={() => setConfirmAction(null)}
        />
      )}

      {showPaymentModal && (
        <PaymentVerificationModal
          payment={{
            ref_number: order.refNumber,
            sender_name: order.sender,
            proof_image: order.proof,
          }}
          onClose={() => setShowPaymentModal(false)}
        />
      )}

      {showRefundModal && (
        <RefundDetailsModal
          refund={refundDetails}
          orderStatus={order.status}
          onClose={() => setShowRefundModal(false)}
        />
      )}
    </>
  );
}

/* ─── Refund Details Modal ────────────────────────────────────── */
function RefundDetailsModal({ refund, orderStatus, onClose }) {
  const [lightboxImg, setLightboxImg] = useState(null);

  const statusMeta = {
    "Refund Requested": { label: "Pending Review", color: "#f59e0b" },
    "Refund Approved":  { label: "Approved",        color: "#10b981" },
    Refunded:           { label: "Completed",        color: "#6366f1" },
  }[orderStatus] ?? { label: orderStatus, color: "#6b7280" };

  const ewalletIcon = {
    GCash: "account_balance_wallet",
    Maya:  "account_balance_wallet",
    PayMaya: "account_balance_wallet",
  }[refund?.ewallet] ?? "account_balance_wallet";

  return (
    <>
      <div className="modal-overlay refund-modal-overlay" onClick={onClose}>
        <div className="modal-box refund-details-box" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={onClose}>✕</button>

          {/* Header */}
          <div className="refund-modal-header">
            <Icon name="assignment_return" />
            <h2 className="modal-title">Refund Request Details</h2>
          </div>
          <div className="modal-divider" />

          {refund ? (
            <>
              {/* Status + Date row */}
              <div className="refund-meta-row">
                <div className="refund-detail-status-row">
                  <span className="payment-verify-label">
                    <Icon name="flag" /> Status
                  </span>
                  <span
                    className="refund-status-pill"
                    style={{
                      background: statusMeta.color + "22",
                      color: statusMeta.color,
                      border: `1px solid ${statusMeta.color}55`,
                    }}
                  >
                    {statusMeta.label}
                  </span>
                </div>
                <div className="payment-verify-field">
                  <span className="payment-verify-label">
                    <Icon name="event" /> Requested On
                  </span>
                  <span className="payment-verify-value">{refund.requested_at || "—"}</span>
                </div>
              </div>

              <div className="modal-divider" />

              {/* Requester */}
              <div className="payment-verify-field">
                <span className="payment-verify-label">
                  <Icon name="person" /> Requester Name
                </span>
                <span className="payment-verify-value">{refund.requester_name || "—"}</span>
              </div>

              {/* Reason */}
              <div className="payment-verify-field">
                <span className="payment-verify-label">
                  <Icon name="help_outline" /> Reason
                </span>
                <span className="payment-verify-value">{refund.reason || "—"}</span>
              </div>

              {/* Additional Info */}
              {refund.additional_info && (
                <div className="payment-verify-field refund-desc-field">
                  <span className="payment-verify-label">
                    <Icon name="description" /> Additional Information
                  </span>
                  <p className="refund-description-text">{refund.additional_info}</p>
                </div>
              )}

              <div className="modal-divider" />

              {/* Refund Account Section */}
              <div className="refund-account-section">
                <span className="refund-section-title">
                  <Icon name="account_balance_wallet" /> Refund Account
                </span>
                <div className="refund-account-card">
                  <div className="refund-account-row">
                    <span className="refund-account-label">E-Wallet</span>
                    <span className="refund-account-value refund-ewallet-badge">
                      <Icon name={ewalletIcon} />
                      {refund.ewallet || "—"}
                    </span>
                  </div>
                  <div className="refund-account-row">
                    <span className="refund-account-label">Account Name</span>
                    <span className="refund-account-value">{refund.account_name || "—"}</span>
                  </div>
                  <div className="refund-account-row">
                    <span className="refund-account-label">Account Number</span>
                    <span className="refund-account-value refund-acct-number">
                      {refund.account_number || "—"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Product Images */}
              {refund.product_images && refund.product_images.length > 0 && (
                <>
                  <div className="modal-divider" />
                  <div className="refund-images-section">
                    <span className="refund-section-title">
                      <Icon name="photo_library" /> Product Images ({refund.product_images.length})
                    </span>
                    <div className="refund-images-grid">
                      {refund.product_images.map((img, i) => (
                        <div
                          key={i}
                          className="refund-image-thumb"
                          onClick={() => setLightboxImg(`http://localhost/Fuku/src/api/${img}`)}
                          title="Click to enlarge"
                        >
                          <img
                            src={`http://localhost/Fuku/src/api/${img}`}
                            alt={`Product image ${i + 1}`}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://placehold.co/80x80?text=N/A";
                            }}
                          />
                          <div className="refund-thumb-overlay">
                            <Icon name="zoom_in" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="refund-no-data">
              <Icon name="info" />
              <span>No refund request details found.</span>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxImg && (
        <div className="modal-overlay lightbox-overlay" onClick={() => setLightboxImg(null)}>
          <div className="lightbox-box" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close lightbox-close" onClick={() => setLightboxImg(null)}>✕</button>
            <img src={lightboxImg} alt="Enlarged product" className="lightbox-img" />
          </div>
        </div>
      )}
    </>
  );
}

/* ─── Confirm Status Modal ────────────────────────────────────── */
function ConfirmStatusModal({ action, order, updating, onConfirm, onCancel }) {
  const isRefundAction = ["Refund Approved", "Refunded"].includes(action.nextStatus);

  return (
    <div className="modal-overlay confirm-overlay" onClick={onCancel}>
      <div className="confirm-box" onClick={(e) => e.stopPropagation()}>
        <div className={`confirm-icon-wrap ${isRefundAction ? "confirm-icon-refund" : "confirm-icon-proceed"}`}>
          <Icon name={action.icon} />
        </div>
        <h3 className="confirm-title">{action.label}?</h3>
        <p className="confirm-desc">
          You're about to mark order <strong>{order.id}</strong> as{" "}
          <strong>"{action.nextStatus}"</strong>.
          {action.nextStatus === "Refund Approved" && (
            <> An approval email will be sent to the customer.
            </>
          )}
          {action.nextStatus === "Refunded" && (
            <> A refund completion email will be sent to the customer.
            </>
          )}
        </p>
        <div className="confirm-actions">
          <button className="confirm-btn-no" onClick={onCancel} disabled={updating}>
            No, Go Back
          </button>
          <button className="confirm-btn-yes" onClick={onConfirm} disabled={updating}>
            {updating ? (
              <><Icon name="hourglass_top" /> Updating...</>
            ) : (
              <><Icon name="check" /> Yes, Confirm</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Payment Verification Modal ─────────────────────────────── */
function PaymentVerificationModal({ payment, onClose }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="modal-overlay payment-verify-overlay" onClick={onClose}>
      <div className="modal-box payment-verify-box" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>

        <div className="payment-verify-header">
          <Icon name="receipt" />
          <h2 className="modal-title">Payment Verification</h2>
        </div>
        <div className="modal-divider" />

        <div className="payment-verify-field">
          <span className="payment-verify-label">
            <Icon name="tag" /> Reference Number
          </span>
          <span className="payment-verify-value">{payment.ref_number || "—"}</span>
        </div>
        <div className="payment-verify-field">
          <span className="payment-verify-label">
            <Icon name="person" /> Sender Name
          </span>
          <span className="payment-verify-value">{payment.sender_name || "—"}</span>
        </div>
        <div className="modal-divider" />

        <div className="payment-verify-proof">
          <span className="payment-verify-label">
            <Icon name="image" /> Proof of Payment
          </span>
          <div className="payment-verify-img-wrap">
            {payment.proof_image && !imgError ? (
              <img
                src={`http://localhost/Fuku/src/api/${payment.proof_image}`}
                className="payment-verify-img"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="payment-verify-img-placeholder">
                <Icon name="broken_image" />
                <span>No image available</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}