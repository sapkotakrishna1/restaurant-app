
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function MyOrders() {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/orders/my-orders",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      console.log("My orders:", data);

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load orders"
        );
      }

      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("My orders error:", error);

      setError(
        error.message || "Failed to load orders"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [token]);

  // ============================================
  // CANCEL ORDER
  // ============================================

  const handleCancelOrder = async (orderId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmCancel) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/orders/${orderId}/cancel`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to cancel order"
        );
      }

      alert("Order cancelled successfully.");

      fetchOrders();
    } catch (error) {
      console.error(
        "Cancel order error:",
        error
      );

      alert(
        error.message ||
          "Failed to cancel order"
      );
    }
  };

  // ============================================
  // LOADING
  // ============================================

  if (loading) {
    return (
      <div
        style={{
          padding: "50px",
          textAlign: "center",
        }}
      >
        <h1>My Orders</h1>
        <p>Loading orders...</p>
      </div>
    );
  }

  // ============================================
  // ERROR
  // ============================================

  if (error) {
    return (
      <div
        style={{
          padding: "50px",
          textAlign: "center",
        }}
      >
        <h1>My Orders</h1>

        <p
          style={{
            color: "red",
          }}
        >
          {error}
        </p>

        <button onClick={fetchOrders}>
          Try Again
        </button>
      </div>
    );
  }

  // ============================================
  // NO ORDERS
  // ============================================

  if (orders.length === 0) {
    return (
      <div
        style={{
          padding: "60px 20px",
          textAlign: "center",
        }}
      >
        <h1>My Orders</h1>

        <p>
          You haven't placed any orders yet.
        </p>

        <button
          onClick={() => navigate("/menu")}
          style={{
            padding: "12px 25px",
            marginTop: "20px",
            cursor: "pointer",
          }}
        >
          Browse Menu
        </button>
      </div>
    );
  }

  // ============================================
  // ORDERS
  // ============================================

  return (
    <div
      style={{
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "40px 20px",
      }}
    >
      <h1>My Orders</h1>

      <div
        style={{
          marginTop: "30px",
        }}
      >
        {orders.map((order) => (
          <div
            key={order.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "12px",
              padding: "20px",
              marginBottom: "20px",
              background: "#fff",
              boxShadow:
                "0 3px 10px rgba(0,0,0,0.05)",
            }}
          >
            {/* ORDER HEADER */}

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "15px",
                flexWrap: "wrap",
              }}
            >
              <div>
                <h2
                  style={{
                    margin: 0,
                  }}
                >
                  Order #{order.id}
                </h2>

                <p
                  style={{
                    color: "#777",
                  }}
                >
                  {order.created_at
                    ? new Date(
                        order.created_at
                      ).toLocaleString()
                    : ""}
                </p>
              </div>

              <div>
                <strong
                  style={{
                    textTransform:
                      "capitalize",
                  }}
                >
                  {order.status}
                </strong>
              </div>
            </div>

            {/* ORDER ITEMS */}

            <div
              style={{
                marginTop: "20px",
              }}
            >
              {Array.isArray(order.items) &&
                order.items.map(
                  (item, index) => (
                    <div
                      key={`${order.id}-${index}`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "15px",
                        padding: "12px 0",
                        borderBottom:
                          "1px solid #eee",
                      }}
                    >
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          width="70"
                          height="70"
                          style={{
                            objectFit:
                              "cover",
                            borderRadius:
                              "8px",
                          }}
                        />
                      )}

                      <div
                        style={{
                          flex: 1,
                        }}
                      >
                        <h3
                          style={{
                            margin:
                              "0 0 5px 0",
                          }}
                        >
                          {item.name}
                        </h3>

                        <p
                          style={{
                            margin: 0,
                            color: "#666",
                          }}
                        >
                          Quantity:{" "}
                          {item.quantity}
                        </p>

                        <p
                          style={{
                            margin: "5px 0 0",
                          }}
                        >
                          Rs.{" "}
                          {item.price}
                        </p>
                      </div>
                    </div>
                  )
                )}
            </div>

            {/* TOTAL */}

            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
                marginTop: "20px",
                flexWrap: "wrap",
                gap: "15px",
              }}
            >
              <h2>
                Total: Rs. {order.total}
              </h2>

              {/* CANCEL */}

              {order.status ===
                "pending" && (
                <button
                  onClick={() =>
                    handleCancelOrder(
                      order.id
                    )
                  }
                  style={{
                    padding:
                      "10px 18px",
                    border: "none",
                    borderRadius:
                      "7px",
                    background:
                      "#dc3545",
                    color: "#fff",
                    cursor:
                      "pointer",
                  }}
                >
                  Cancel Order
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyOrders;

