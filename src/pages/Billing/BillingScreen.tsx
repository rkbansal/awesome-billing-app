import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./billing.css"; // Import custom CSS
import { fetchInventory } from "../../firebase/inventory";
import readAllUsers from "../../firebase/read-all-user";
import { placeOrder } from "../../firebase/order";
import NumericInput from "../../components/NumberInput";
import SelectItems from "../../components/Ankus/SelectItems";

const BillingScreen = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<any[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any>({});
  const [customer, setCustomer] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [paidAmount, setPaidAmout] = useState("0");
  const [isOrderPending, setIsOrderPending] = useState(false);

  const total = useMemo(() => {
    return items.reduce((acc, item) => acc + item.quantity * item.price, 0);
  }, [items]);

  const superTotal = useMemo(() => {
    return total + (customer?.balance || 0);
  }, [items, customer]);

  useEffect(() => {
    const fetchUsers = async () => {
      const allUsers = await readAllUsers();
      setCustomers(allUsers || []);
      // setFilteredCustomers(allUsers || []);
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    fetchInventory(setInventory);
  }, []);

  // Filter customers based on search input
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value;
    setSearchTerm(searchValue);
    const filtered = customers.filter((customer) =>
      customer.username.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredCustomers(filtered);
  };

  // Select a customer from the dropdown
  const handleSelectCustomer = (selectedPhone: number) => {
    const selectedCustomer = customers.find(
      (customer) => customer.phone === selectedPhone
    );
    setCustomer({
      phone: selectedPhone,
      username: selectedCustomer ? selectedCustomer.username : "",
      balance: selectedCustomer ? selectedCustomer.balance || 0 : 0,
    });
    setSearchTerm(`${selectedCustomer.username}-${selectedCustomer.phone}`);
    setFilteredCustomers([]); // Hide dropdown after selection
  };

  const handleAddItem = (name: string, price: string, quantity?: number) => {
    const existingItem = items.find((item) => item.name === name);
    const inventoryItem = inventory[name];
    if (inventoryItem.quantity === 0) {
      alert("Item out of stock");
      return;
    }
    const actualQuantity = quantity || 1;
    if (existingItem) {
      const updatedItems = items.map((item) =>
        item.name === name
          ? {
              ...item,
              quantity:
                item.quantity + actualQuantity < inventoryItem.quantity
                  ? item.quantity + actualQuantity
                  : inventoryItem.quantity,
            }
          : item
      );
      setItems(updatedItems);
    } else {
      setItems([
        ...items,
        {
          name,
          price,
          quantity:
            actualQuantity < inventoryItem.quantity ? actualQuantity : 0,
        },
      ]);
    }
  };

  const handleSetItemQuantity = (
    name: string,
    price: string,
    quantity?: number
  ) => {
    const existingItem = items.find((item) => item.name === name);
    const inventoryItem = inventory[name];
    if (inventoryItem.quantity === 0) {
      alert("Item out of stock");
      return;
    }
    const actualQuantity = quantity || 0;
    if (existingItem) {
      const updatedItems = items.map((item) =>
        item.name === name
          ? {
              ...item,
              quantity:
                actualQuantity < inventoryItem.quantity
                  ? actualQuantity
                  : inventoryItem.quantity,
            }
          : item
      );
      setItems(updatedItems);
    } else {
      setItems([
        ...items,
        {
          name,
          price,
          quantity:
            actualQuantity < inventoryItem.quantity ? actualQuantity : 0,
        },
      ]);
    }
  };

  const handleRemoveItem = (
    name: string,
    price?: string,
    quantity?: number
  ) => {
    console.log(price, quantity);
    const existingItem = items.find((item) => item.name === name);
    if (existingItem.quantity > 1) {
      const updatedItems = items.map((item) =>
        item.name === name ? { ...item, quantity: item.quantity - 1 } : item
      );
      setItems(updatedItems);
    } else {
      const updatedItems = items.filter((item) => item.name !== name);
      setItems(updatedItems);
    }
  };

  const handleCompleteSale = async () => {
    if (!customer) {
      alert("Please select a customer.");
      return;
    }
    if (!items?.length) {
      alert("Items are not selected");
      return;
    }

    if (isOrderPending) {
      return;
    }
    try {
      // Step 1: Store the order in Firebase Realtime Database under "orders" node
      setIsOrderPending(true);
      const orderId =
        (await placeOrder(
          customer,
          items,
          Number(paidAmount),
          total,
          superTotal
        )) || -1;
      // Reset items and total after sale is completed
      setItems([]);
      fetchInventory(setInventory);
      setIsOrderPending(false);
      navigate(`/order/${orderId}`);
    } catch (error) {
      console.error("Error completing sale or updating inventory:", error);
      fetchInventory(setInventory);
    }
  };

  return (
    <div className="billing-container">
      <h2 className="billing-header">Billing</h2>

      <div className="form-group">
        <label>Search Customer</label>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search customer by name"
        />
        {filteredCustomers.length > 0 && (
          <div className="dropdown">
            {filteredCustomers.map((customer) => (
              <div
                key={customer.phone}
                className="dropdown-item"
                onClick={() => handleSelectCustomer(customer.phone)}
              >
                {customer.username} - {customer.phone}
              </div>
            ))}
          </div>
        )}
      </div>

      <h3 className="section-header">Add Items</h3>
      <SelectItems
        handleAddItem={handleAddItem}
        handleRemoveItem={handleRemoveItem}
        handleSetItemQuantity={handleSetItemQuantity}
        inventory={inventory}
        items={items}
      />

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

      <h3 className="section-header">Payment</h3>
      <p className="total-amount">Balance: Rs.{customer?.balance || 0}</p>
      <p className="total-amount">Current: Rs.{total}</p>
      <p className="total-amount">Total: Rs.{superTotal}</p>
      <NumericInput value={paidAmount} setValue={setPaidAmout} />

      <button className="complete-btn" onClick={handleCompleteSale}>
        {isOrderPending ? "Processing Payment..." : "Complete Sale"}
      </button>
    </div>
  );
};

export default BillingScreen;
