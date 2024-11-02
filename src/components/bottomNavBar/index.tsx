import { Link } from "react-router-dom";
import "./BottomNav.css";
import {
  IconHome,
  IconUsers,
  IconBox,
  IconShoppingCart,
  IconCurrencyDollar,
} from "@tabler/icons-react";

const BottomNav = () => {
  return (
    <div className="bottom-nav">
      <Link to="/billing" className="nav-item">
        <IconHome size={24} stroke={1.5} />
        <p>Home</p>
      </Link>
      <Link to="/users" className="nav-item">
        <IconUsers size={24} stroke={1.5} />
        <p>Customer</p>
      </Link>
      <Link to="/inventory" className="nav-item">
        <IconBox size={24} stroke={1.5} />
        <p>Inventory</p>
      </Link>
      <Link to="/orders" className="nav-item">
        <IconShoppingCart size={24} stroke={1.5} />
        <p>Orders</p>
      </Link>
      <Link to="/revenue" className="nav-item">
        <IconCurrencyDollar size={24} stroke={1.5} />
        <p>Revenue</p>
      </Link>
    </div>
  );
};

export default BottomNav;
