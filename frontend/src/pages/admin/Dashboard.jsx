import { useEffect, useState } from "react";
import { API_URL } from "../../config/config";
import { useAuth } from "../../context/AuthContext";
import "./Dashboard.css";

function Dashboard() {

  const { token } = useAuth();

  const [stats, setStats] = useState({
    totalOrders: 0,
    totalCustomers: 0,
    totalFoods: 0,
    totalRevenue: 0
  });

  const [loading, setLoading] = useState(true);


  useEffect(() => {

    const fetchStats = async () => {

      try {

        const response = await fetch(
  `${API_URL}/orders/dashboard/stats`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );


        const data = await response.json();


        if (!response.ok) {

          console.error(data);

          return;

        }


        setStats(data);


      } catch (error) {

        console.error(
          "Dashboard error:",
          error
        );

      } finally {

        setLoading(false);

      }

    };


    if (token) {

      fetchStats();

    }

  }, [token]);


  if (loading) {

    return (
      <div>
        <h1>
          Admin Dashboard
        </h1>

        <p>
          Loading statistics...
        </p>
      </div>
    );

  }


  return (

    <div className="admin-dashboard">

      <h1>
        Admin Dashboard
      </h1>


      <div className="dashboard-stats">


        <div className="stat-card">

          <h3>
            Total Orders
          </h3>

          <p>
            {stats.totalOrders}
          </p>

        </div>


        <div className="stat-card">

          <h3>
            Customers
          </h3>

          <p>
            {stats.totalCustomers}
          </p>

        </div>


        <div className="stat-card">

          <h3>
            Foods
          </h3>

          <p>
            {stats.totalFoods}
          </p>

        </div>


        <div className="stat-card">

          <h3>
            Revenue
          </h3>

          <p>
            Rs. {stats.totalRevenue}
          </p>

        </div>


      </div>

    </div>

  );

}

export default Dashboard;