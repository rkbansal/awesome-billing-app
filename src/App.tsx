import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import BillingScreen from "./components/BillingScreen";
import RevenueScreen from "./components/RevenueScreen";
import CustomerManagement from "./components/CustomerManagement";
import InventoryScreen from "./components/InventoryScreen";
import { OrdersScreen } from "./components/OrdersScreen";
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
