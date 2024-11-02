import { useState, useEffect, useMemo } from "react";
import "./billing.css"; // Import custom CSS
import { fetchInventory } from "../firebase/inventory";
import readAllUsers from "../firebase/read-all-user";
import { placeOrder } from "../firebase/order";

const BillingScreen = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any>({});
  const [customer, setCustomer] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  // const [total, setTotal] = useState(0);
  const total = useMemo(() => {
    return items.reduce((acc, item) => acc + item.quantity * item.price, 0);
  }, [items]);
  useEffect(() => {
    const fetchUsers = async () => {
      const allUsers = await readAllUsers();
      console.log(allUsers);
      setCustomers(allUsers || []);
    };

    fetchUsers();
  }, []);
  // Add item or update its quantity
  const handleAddItem = (name: string, price: number) => {
    const existingItem = items.find((item) => item.name === name);
    const inventoryItem = inventory[name];
    if (inventoryItem.quantity === 0) {
      alert("Item out of stock");
      return;
    }
    if (existingItem) {
      // Update quantity and total
      const updatedItems = items.map((item) => {
        return item.name === name
          ? {
              ...item,
              quantity:
                item.quantity + 1 < inventoryItem.quantity
                  ? item.quantity + 1
                  : inventoryItem.quantity,
            }
          : item;
      });
      console.log(updatedItems);
      setItems(updatedItems);
      // setTotal(total + price);
    } else {
      // Add new item to the list
      setItems([
        ...items,
        { name, price, quantity: 1 < inventoryItem.quantity ? 1 : 0 },
      ]);
      // if (inventoryItem.quantity > 0) {
      //   setTotal(total + price);
      // }
    }
  };

  // Remove an item
  const handleRemoveItem = (name: string) => {
    const existingItem = items.find((item) => item.name === name);

    if (existingItem.quantity > 1) {
      // Decrease quantity if more than 1
      const updatedItems = items.map((item) =>
        item.name === name ? { ...item, quantity: item.quantity - 1 } : item
      );
      setItems(updatedItems);
      // setTotal(total - price);
    } else {
      // Remove the item from the list if quantity is 1
      const updatedItems = items.filter((item) => item.name !== name);
      setItems(updatedItems);
      // setTotal(total - price);
    }
  };

  const handleCompleteSale = async () => {
    if (!customer) {
      alert("Please select a customer.");
      return;
    }

    try {
      console.log(customer, items, total);
      // Step 1: Store the order in Firebase Realtime Database under "orders" node
      await placeOrder(customer, items, total);

      // Reset items and total after sale is completed
      setItems([]);
      // setTotal(0);
      alert("Sale completed and inventory updated!");
    } catch (error) {
      console.error("Error completing sale or updating inventory:", error);
    }
  };

  useEffect(() => {
    fetchInventory(setInventory);
  }, []);

  return (
    <div className="billing-container">
      <h2 className="billing-header">Billing</h2>

      <div className="form-group">
        <label>Select Customer</label>
        <select
          onChange={(e) => {
            const selectedCustomer = customers.find(
              (customer) => customer.phone === e.target.value
            );
            setCustomer({
              phone: e.target.value,
              username: selectedCustomer ? selectedCustomer.username : "",
            });
          }}
        >
          <option value="">Select Customer</option>
          {customers.map((customer) => (
            <option key={customer.id} value={customer.phone}>
              {customer.username}
            </option>
          ))}
        </select>
      </div>

      <h3 className="section-header">Inventory</h3>
      <div className="inventory-list">
        {Object.keys(inventory).map((key) => (
          <p key={key}>
            {key}: {inventory[key].quantity} {key === "milk" ? "L" : "kg"} - ₹
            {inventory[key].price}/{key === "milk" ? "L" : "kg"}
          </p>
        ))}
      </div>

      <h3 className="section-header">Add Items</h3>
      <div className="item-buttons">
        {Object.keys(inventory).map((key) => (
          <button
            onClick={() => handleAddItem(key, inventory[key].price)}
            style={{
              backgroundColor: inventory[key].quantity === 0 ? "grey" : "",
            }}
          >
            {key}
          </button>
        ))}
      </div>

      <h3 className="section-header">Bill Summary</h3>
      <ul className="bill-summary">
        {items.map((item, index) => (
          <li key={index}>
            {item.quantity} x {item.name} @ Rs.{item.price} = Rs.
            {item.quantity * item.price}
            <button
              className="remove-btn"
              onClick={() => handleRemoveItem(item.name)}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
      <p className="total-amount">Total: Rs.{total}</p>
      <button className="complete-btn" onClick={handleCompleteSale}>
        Complete Sale
      </button>
    </div>
  );
};

export default BillingScreen;
