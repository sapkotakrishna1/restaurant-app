import { Link, Outlet } from "react-router-dom";
import "./AdminLayout.css";

function AdminLayout() {
  return (
    <div className="admin-layout">

      <aside className="admin-sidebar">

        <h2 className="admin-logo">
          Restaurant Admin
        </h2>

        <nav className="admin-nav">

          <Link to="/admin">
            Dashboard
          </Link>

          <Link to="/admin/foods">
            Foods
          </Link>

          <Link to="/admin/categories">
            Categories
          </Link>

          <Link to="/admin/orders">
            Orders
          </Link>

          <Link to="/admin/customers">
            Customers
          </Link>

          <Link to="/admin/users">
            Users
          </Link>

        </nav>

      </aside>

      <main className="admin-main">
        <Outlet />
      </main>

    </div>
  );
}

export default AdminLayout;