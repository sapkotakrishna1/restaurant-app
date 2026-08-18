
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

function Orders() {
  const { token } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ============================================
  // GET ALL ORDERS
  // ============================================

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      if (!token) {
        setError("Please login as admin.");
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/orders",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      console.log("Admin orders:", data);

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load orders"
        );
      }

      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(
        "Get admin orders error:",
        error
      );

      setError(
        error.message ||
          "Failed to load orders"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [token]);

  // ============================================
  // UPDATE STATUS
  // ============================================

  const updateStatus = async (
    orderId,
    status
  ) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/orders/${orderId}/status`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            status,
          }),
        }
      );

      const data = await response.json();

      console.log(
        "Update order response:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update order"
        );
      }

      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          Number(order.id) ===
          Number(orderId)
            ? {
                ...order,
                status,
              }
            : order
        )
      );
    } catch (error) {
      console.error(
        "Update status error:",
        error
      );

      alert(
        error.message ||
          "Failed to update order status"
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
          padding: "40px",
        }}
      >
        <h1>Orders</h1>
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
          padding: "40px",
        }}
      >
        <h1>Orders</h1>

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
  // PAGE
  // ============================================

  return (
    <div
      style={{
        padding: "30px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          marginBottom: "25px",
          gap: "15px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1>Orders</h1>

          <p
            style={{
              color: "#666",
            }}
          >
            Manage customer orders
          </p>
        </div>

        <button
          onClick={fetchOrders}
          style={{
            padding: "10px 18px",
            cursor: "pointer",
          }}
        >
          Refresh
        </button>
      </div>

      {/* ========================================
          NO ORDERS
      ======================================== */}

      {orders.length === 0 ? (
        <div
          style={{
            padding: "40px",
            textAlign: "center",
            border:
              "1px solid #ddd",
            borderRadius: "10px",
          }}
        >
          <h2>No Orders</h2>

          <p>
            There are no customer
            orders yet.
          </p>
        </div>
      ) : (
        <div>
          {orders.map((order) => (
            <div
              key={order.id}
              style={{
                background: "#fff",
                border:
                  "1px solid #ddd",
                borderRadius: "12px",
                padding: "20px",
                marginBottom: "20px",
                boxShadow:
                  "0 3px 10px rgba(0,0,0,0.05)",
              }}
            >
              {/* ORDER HEADER */}

              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems: "center",
                  gap: "20px",
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <h2
                    style={{
                      margin:
                        "0 0 8px",
                    }}
                  >
                    Order #{order.id}
                  </h2>

                  <p
                    style={{
                      margin: "4px 0",
                    }}
                  >
                    Customer:{" "}
                    <strong>
                      {order.name ||
                        "Unknown"}
                    </strong>
                  </p>

                  <p
                    style={{
                      margin: "4px 0",
                      color: "#666",
                    }}
                  >
                    Email:{" "}
                    {order.email ||
                      "N/A"}
                  </p>

                  <p
                    style={{
                      margin: "4px 0",
                      color: "#666",
                    }}
                  >
                    {order.created_at
                      ? new Date(
                          order.created_at
                        ).toLocaleString()
                      : ""}
                  </p>
                </div>

                {/* STATUS */}

                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom:
                        "7px",
                      fontWeight:
                        "bold",
                    }}
                  >
                    Status
                  </label>

                  <select
                    value={
                      order.status
                    }
                    onChange={(e) =>
                      updateStatus(
                        order.id,
                        e.target.value
                      )
                    }
                    style={{
                      padding:
                        "10px",
                      borderRadius:
                        "7px",
                      border:
                        "1px solid #ccc",
                      cursor:
                        "pointer",
                    }}
                  >
                    <option value="pending">
                      Pending
                    </option>

                    <option value="confirmed">
                      Confirmed
                    </option>

                    <option value="preparing">
                      Preparing
                    </option>

                    <option value="delivered">
                      Delivered
                    </option>

                    <option value="cancelled">
                      Cancelled
                    </option>
                  </select>
                </div>
              </div>

              {/* ITEMS */}

              <div
                style={{
                  marginTop: "20px",
                }}
              >
                <h3>
                  Order Items
                </h3>

                {Array.isArray(
                  order.items
                ) &&
                  order.items.map(
                    (item, index) => (
                      <div
                        key={`${order.id}-${index}`}
                        style={{
                          display:
                            "flex",
                          alignItems:
                            "center",
                          gap: "15px",
                          padding:
                            "12px 0",
                          borderBottom:
                            "1px solid #eee",
                        }}
                      >
                        {item.image && (
                          <img
                            src={
                              item.image
                            }
                            alt={
                              item.name
                            }
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
                          <strong>
                            {item.name}
                          </strong>

                          <p
                            style={{
                              margin:
                                "5px 0",
                              color:
                                "#666",
                            }}
                          >
                            Quantity:{" "}
                            {
                              item.quantity
                            }
                          </p>

                          <p
                            style={{
                              margin: 0,
                            }}
                          >
                            Price: Rs.{" "}
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
                  textAlign:
                    "right",
                  marginTop:
                    "20px",
                }}
              >
                <h2>
                  Total: Rs.{" "}
                  {order.total}
                </h2>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;

