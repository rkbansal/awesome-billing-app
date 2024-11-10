import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import BillingScreen from "./pages/Billing/BillingScreen";
import RevenueScreen from "./pages/Revenue/RevenueScreen";
import CustomerManagement from "./pages/Customer/CustomerManagement";
import InventoryScreen from "./pages/Inventory/InventoryScreen";
import { OrdersScreen } from "./pages/Order/OrdersScreen";
import BottomNav from "./components/bottomNavBar";
import BillComponent from "./components/components/bill-component";
const App = () => {
  return (
    <div className="flex flex-row">
      <Router>
        <div style={{ display: "flex" }}>
          <div style={{ height: "calc(100vh - 67px)", overflow: "scroll" }}>
            <Routes>
              <Route path="/" element={<InventoryScreen />} />
              <Route path="/users" element={<CustomerManagement />} />
              <Route path="/billing" element={<BillingScreen />} />
              <Route path="/revenue" element={<RevenueScreen />} />
              <Route path="/inventory" element={<InventoryScreen />} />
              <Route path="/orders" element={<OrdersScreen />} />
              <Route
                path="/order/:orderId"
                element={<BillComponent isOpen={true} />}
              />
            </Routes>
          </div>
          <BottomNav />
        </div>
      </Router>
    </div>
  );
};

export default App;
