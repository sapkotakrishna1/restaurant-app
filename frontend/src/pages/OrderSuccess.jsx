import { Link } from "react-router-dom";

function OrderSuccess() {

  return (

    <div>

      <h1>
        Order Placed Successfully! 🎉
      </h1>

      <p>
        Thank you for your order.
      </p>

      <Link to="/menu">
        Continue Shopping
      </Link>

    </div>
  );
}

export default OrderSuccess;