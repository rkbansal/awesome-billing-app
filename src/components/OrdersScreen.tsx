import React, { useState, useEffect, useCallback } from "react";
import { database } from "../firebase";
import { ref, get } from "firebase/database";
import "./orderScreen.css"; // Custom CSS for styling

interface Order {
  id: string;
  customerId: string;
  customerName: string;
  items: any[];
  totalAmount: number;
  date: string;
}

const WhatsappButton = ({
  customerNo,
  orderId,
  orderDate,
  items,
  total,
}: {
  customerNo: string;
  orderId: string;
  orderDate: string;
  items: any[];
  total: number;
}) => {
  // Format your message with order details
  const message = `Hello! Your order (ID: ${orderId}) placed on ${orderDate} with items: ${items?.join(
    ", "
  )} and total amount: Rs. ${total} is being processed. Thank you for shopping with us!`;

  // Encode the message to be URL-friendly
  const encodedMessage = encodeURIComponent(message);

  // WhatsApp link with phone number and message
  const whatsappLink = `https://wa.me/${customerNo}?text=${encodedMessage}`;

  return (
    <button onClick={() => window.open(whatsappLink, "_blank")}>
      Send Order Details via WhatsApp
    </button>
  );
};

export const OrdersScreen: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // Fetch orders from Firebase and sort by date
  useEffect(() => {
    const fetchOrders = async () => {
      const ordersRef = ref(database, "orders");
      const snapshot = await get(ordersRef);
      const ordersData = snapshot.val();
      const ordersArray = Object.values(ordersData) as Order[];
      console.log(ordersArray);
      setOrders(
        ordersArray.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )
      );
    };

    fetchOrders();
  }, []);

  // Filter orders by date range
  const filterOrdersByDate = () => {
    return orders.filter((order) => {
      const orderDate = new Date(order.date);
      const start = startDate ? new Date(startDate) : null;
      if (start) {
        start.setHours(0, 0, 0, 0);
      }
      const end = endDate ? new Date(endDate) : null;
      if (end) {
        end.setHours(23, 59, 59, 999); // sets hours, minutes, seconds, and milliseconds to their max values
      }
      console.log(start, end, orderDate);
      if (start && orderDate < start) return false;
      if (end && orderDate > end) return false;
      return true;
    });
  };

  const orderedItems = useCallback((order: Order) => {
    return order.items?.map((item) => `${item.quantity} x ${item.name}`);
  }, []);

  return (
    <div className="orders-container">
      <h2 className="orders-header">Orders</h2>

      {/* Date Filter Inputs */}
      <div className="date-filter">
        <div className="filter-group">
          <label>Start Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <label>End Date:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      {/* Orders Cards */}
      <div className="orders-cards">
        {filterOrdersByDate().map((order, index) => (
          <div key={index} className="order-card">
            <div className="order-card-header">
              <div className="order-date">
                {new Date(order.date).toLocaleDateString()}
              </div>
              <div className="order-total">Total: Rs.{order.totalAmount}</div>
            </div>
            <div className="order-customer">
              <strong>Customer Name:</strong> {order.customerName}
            </div>
            <div className="order-customer">
              <strong>Customer ID:</strong> {order.customerId}
            </div>
            <div className="order-items">
              <strong>Items:</strong>
              {order.items?.map((item, i) => (
                <div key={i} className="order-item">
                  {item.quantity} x {item.name}
                </div>
              ))}
            </div>
            <WhatsappButton
              customerNo={order.customerId}
              orderId={order.id}
              orderDate={order.date}
              items={orderedItems(order)}
              total={order.totalAmount}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersScreen;
