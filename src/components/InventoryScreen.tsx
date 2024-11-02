import { useState, useEffect } from "react";
import { ref, set, update } from "firebase/database";
import { database } from "../firebase";
import "./Inventory.css"; // Import the custom CSS file
import { fetchInventory } from "../firebase/inventory";

type InventoryType = {
  [key: string]: {
    quantity: number;
    price: number;
  };
};
const Inventory = () => {
  const [inventory, setInventory] = useState<InventoryType>({});
  const [newStock, setNewStock] = useState<InventoryType>(inventory);
  const [newItem, setNewItem] = useState({ name: "", quantity: 0, price: 0 });

  useEffect(() => {
    setNewStock(inventory);
    console.log(inventory);
  }, [inventory]);
  // Fetch inventory data from Firebase
  useEffect(() => {
    fetchInventory(setInventory);
  }, []);

  // Update inventory in Firebase
  const updateInventory = async () => {
    const inventoryRef = ref(database, "inventory");
    await set(inventoryRef, newStock);
    setInventory(newStock);
  };

  // Add new item to the inventory
  const addNewItem = async () => {
    if (!newItem.name) {
      alert("Item name is required");
      return;
    }

    const inventoryRef = ref(database, `inventory/${newItem.name}`);
    await update(inventoryRef, {
      quantity: newItem.quantity,
      price: newItem.price,
    });

    setInventory({
      ...inventory,
      [newItem.name]: {
        quantity: newItem.quantity,
        price: newItem.price,
      },
    });

    // Clear new item fields
    setNewItem({ name: "", quantity: 0, price: 0 });
  };

  return (
    <div className="inventory-container">
      <div className="inventory-card">
        <h2>Inventory Management</h2>
        {/* Display Current Inventory */}
        <div className="inventory-section">
          <h2>Current Stock</h2>
          <div className="inventory-grid">
            {Object.keys(inventory).map((key) => (
              <p key={key}>
                {key}: {inventory[key]?.quantity} units - ₹
                {inventory[key]?.price}/unit
              </p>
            ))}
          </div>
        </div>
        {/* Update Inventory */}
        <div className="inventory-section">
          <h3>Update Stock</h3>
          {Object.keys(inventory).map((key) => (
            <div className="input-group">
              <label>{key}</label>
              <input
                type="number"
                value={newStock[key]?.quantity}
                onChange={(e) =>
                  setNewStock({
                    ...newStock,
                    [key]: {
                      ...newStock[key],
                      quantity: parseInt(e.target.value),
                    },
                  })
                }
                placeholder={`Enter new ${key} stock`}
              />
              <input
                type="number"
                value={newStock[key]?.price}
                onChange={(e) =>
                  setNewStock({
                    ...newStock,
                    [key]: {
                      ...newStock[key],
                      price: parseFloat(e.target.value),
                    },
                  })
                }
                placeholder={`Enter new ${key} price per unit`}
              />
            </div>
          ))}
          <button className="update-btn" onClick={updateInventory}>
            Update Inventory
          </button>
        </div>
        {/* Add New Inventory Item */}
        <div className="inventory-section">
          <h3>Add New Item</h3>
          <div className="input-group">
            <label>Item Name</label>
            <input
              type="text"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              placeholder="Enter item name"
            />
          </div>
          <div className="input-group">
            <label>Quantity</label>
            <input
              type="number"
              value={newItem.quantity}
              onChange={(e) =>
                setNewItem({ ...newItem, quantity: parseInt(e.target.value) })
              }
              placeholder="Enter item quantity"
            />
          </div>
          <div className="input-group">
            <label>Price</label>
            <input
              type="number"
              value={newItem.price}
              onChange={(e) =>
                setNewItem({ ...newItem, price: parseFloat(e.target.value) })
              }
              placeholder="Enter item price per unit"
            />
          </div>
          <button className="add-item-btn" onClick={addNewItem}>
            Add Item
          </button>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
