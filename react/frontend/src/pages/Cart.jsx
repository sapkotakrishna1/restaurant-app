import { useNavigate } from "react-router-dom";
import "./Cart.css";

function Cart({
  cart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
}) {
  const navigate = useNavigate();

  const subtotal = cart.reduce(
    (total, item) =>
      total + item.food.price * item.quantity,
    0
  );

  const deliveryFee = cart.length > 0 ? 50 : 0;
  const total = subtotal + deliveryFee;

  const handleCheckout = () => {
    if (cart.length === 0) return;

    navigate("/checkout");
  };

  return (
    <main className="cart-page">
      {/* Header */}
      <div className="cart-header">
        <div>
          <span className="cart-label">YOUR ORDER</span>

          <h1>Your Cart</h1>

          <p>
            Review your items before proceeding to checkout.
          </p>
        </div>

        <button
          className="continue-shopping"
          onClick={() => navigate("/")}
        >
          ← Continue Shopping
        </button>
      </div>

      {cart.length === 0 ? (
        /* Empty Cart */
        <section className="empty-cart">
          <div className="empty-cart-icon">🛒</div>

          <h2>Your cart is empty</h2>

          <p>
            Looks like you haven't added any delicious
            food yet.
          </p>

          <button
            className="browse-food-button"
            onClick={() => navigate("/")}
          >
            Browse Our Menu
          </button>
        </section>
      ) : (
        /* Cart Content */
        <section className="cart-content">
          {/* Cart Items */}
          <div className="cart-items-section">
            <div className="cart-items-header">
              <h2>
                Your Items
                <span>{cart.length}</span>
              </h2>
            </div>

            <div className="cart-list">
              {cart.map((item) => {
                const itemTotal =
                  item.food.price * item.quantity;

                return (
                  <div
                    className="cart-item"
                    key={item.food.id}
                  >
                    {/* Food */}
                    <div className="cart-food">
                      <div className="cart-image">
                        <img
                          src={item.food.image}
                          alt={item.food.name}
                        />
                      </div>

                      <div className="cart-food-info">
                        <h3>{item.food.name}</h3>

                        <p>
                          Rs. {item.food.price} each
                        </p>

                        <button
                          className="mobile-remove"
                          onClick={() =>
                            removeFromCart(
                              item.food.id
                            )
                          }
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    {/* Quantity */}
                    <div className="quantity">
                      <button
                        onClick={() =>
                          decreaseQuantity(
                            item.food.id
                          )
                        }
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        onClick={() =>
                          increaseQuantity(
                            item.food.id
                          )
                        }
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    {/* Price */}
                    <strong className="item-total">
                      Rs. {itemTotal}
                    </strong>

                    {/* Remove */}
                    <button
                      className="remove-button"
                      onClick={() =>
                        removeFromCart(item.food.id)
                      }
                    >
                      Remove
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Summary */}
          <aside className="cart-summary">
            <div className="summary-header">
              <div>
                <span>ORDER SUMMARY</span>
                <h2>Checkout</h2>
              </div>

              <div className="summary-icon">
                🧾
              </div>
            </div>

            <div className="summary-details">
              <div className="summary-row">
                <span>Subtotal</span>

                <strong>
                  Rs. {subtotal}
                </strong>
              </div>

              <div className="summary-row">
                <span>Delivery Fee</span>

                <strong>
                  Rs. {deliveryFee}
                </strong>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-total">
                <div>
                  <span>Total</span>
                  <small>Including delivery</small>
                </div>

                <strong>
                  Rs. {total}
                </strong>
              </div>
            </div>

            <button
              className="checkout-button"
              onClick={handleCheckout}
            >
              Proceed to Checkout
              <span>→</span>
            </button>

            <div className="secure-checkout">
              <span>🔒</span>
              <p>
                Secure checkout
                <br />
                Your order information is protected.
              </p>
            </div>
          </aside>
        </section>
      )}
    </main>
  );
}

export default Cart;