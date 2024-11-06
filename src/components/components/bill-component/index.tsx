import { useParams } from "react-router-dom";
import "./index.css";
import { useCallback, useEffect, useState } from "react";
import { getOrder } from "../../../firebase/order";

export type OrderType = {
  totalAmount: number;
  paidAmount: number;
  superTotal?: number;
  customerId: string;
  customerName: string;
  date: string;
  id: number;
  items: [
    {
      name: string;
      price: number;
      quantity: number;
    }
  ];
};
export type BillComponentProps = {
  isOpen: boolean;
};
const BillComponent = ({ isOpen }: BillComponentProps) => {
  const { orderId } = useParams();
  const [order, setOrder] = useState<OrderType | null>(null);
  const getOrderMemo = useCallback(async () => {
    const newOrder = await getOrder(orderId);
    if (newOrder) {
      setOrder(newOrder);
    }
  }, [orderId]);

  useEffect(() => {
    getOrderMemo();
  }, [getOrderMemo]);

  return (
    isOpen && (
      <div
        style={{
          fontFamily: "Arial, sans-serif",
          padding: "20px",
          maxWidth: "400px",
          margin: "auto",
          border: "1px solid #ddd",
          borderRadius: "5px",
        }}
      >
        <header
          style={{
            backgroundColor: "#673ab7",
            color: "white",
            padding: "10px",
            textAlign: "center",
            fontSize: "1.2em",
          }}
        >
          <div>Sale</div>
          <div style={{ fontSize: "0.8em" }}>
            {order?.customerId} | {order?.totalAmount}
          </div>
        </header>

        <div style={{ padding: "10px" }}>
          <p>Phone Number: {order?.customerId}</p>
          <p>Bill No: {order?.id}</p>
          <p>Created On: {order?.date} PM</p>
          <p>Bill To: Cash Sale</p>
          <p>
            Bill To: {order?.customerName} | {order?.customerId}
          </p>

          <table
            style={{
              width: "100%",
              marginTop: "10px",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Qty</th>
                <th>Rate</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {order?.items?.map((item) => (
                <tr>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>{item.price}</td>
                  <td>{item.price * item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <p>Total Items: {order?.items?.length}</p>
          <p>
            Total Quantity:{" "}
            {order?.items?.reduce((prev, item) => prev + item.price, 0)}
          </p>

          <div style={{ marginTop: "10px" }}>
            {/* <div>Sub Total: 707.25</div>
            <div>Discount: 14.14</div> */}
            <h2>Total {order?.totalAmount}</h2>
          </div>

          <div style={{ marginTop: "10px" }}>
            <div>Mode of Payment: Cash</div>
            <div>Current Total: {order?.totalAmount}</div>
            <div>Super Total: {order?.superTotal}</div>
            <div>Paid: {order?.paidAmount}</div>
            <div>
              Balance: {(order?.superTotal || 0) - (order?.paidAmount || 0)}
            </div>
          </div>

          <footer
            style={{
              textAlign: "center",
              marginTop: "20px",
              fontSize: "0.9em",
            }}
          >
            <p>Thank You! Visit Again!</p>
          </footer>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "10px",
              marginTop: "20px",
            }}
          >
            <button
              style={{
                padding: "10px 20px",
                backgroundColor: "#4caf50",
                color: "white",
                border: "none",
                borderRadius: "5px",
              }}
            >
              PRINT
            </button>
            <button
              style={{
                padding: "10px 20px",
                backgroundColor: "#673ab7",
                color: "white",
                border: "none",
                borderRadius: "5px",
              }}
            >
              New Sale
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default BillComponent;
