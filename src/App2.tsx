import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";


import BillingScreen from "./components/BillingScreen";
import RevenueScreen from "./components/RevenueScreen";
import CustomerManagement from "./components/CustomerManagement";
import InventoryScreen from "./components/InventoryScreen";
import { OrdersScreen } from "./components/OrdersScreen";
import BottomNav from "./components/bottomNavBar";

const App2 = () => {
  return (
    <div className="flex flex-row">
      <Router>
        <div style={{ display: "flex" }}>
          {/* <Sidebar /> */}

          <div>
            <Routes>
              <Route path="/users" element={<CustomerManagement />} />
              <Route path="/billing" element={<BillingScreen />} />
              <Route path="/revenue" element={<RevenueScreen />} />
              <Route path="/inventory" element={<InventoryScreen />} />
              <Route path="/orders" element={<OrdersScreen />} />
            </Routes>
          </div>
          <BottomNav />
        </div>
      </Router>
    </div>
  );
};

export default App2;
