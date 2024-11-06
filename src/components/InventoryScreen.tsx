import { useState, useEffect } from "react";
import { ref, set, update } from "firebase/database";
import { database } from "../firebase";
import "./Inventory.css";
import { fetchInventory } from "../firebase/inventory";
import ItemCard from "./item-card";

type InventoryType = {
  [key: string]: {
    quantity: number;
    price: number;
    imageUrl?: string;
  };
};

const Inventory = () => {
  const [inventory, setInventory] = useState<InventoryType>({});
  const [newStock, setNewStock] = useState<InventoryType>(inventory);
  const [newItem, setNewItem] = useState({ name: "", quantity: 0, price: 0, image: "" });

  useEffect(() => {
    setNewStock(inventory);
  }, [inventory]);

  useEffect(() => {
    fetchInventory(setInventory);
  }, []);

  const updateInventory = async () => {
    const inventoryRef = ref(database, "inventory");
    await set(inventoryRef, newStock);
    setInventory(newStock);
  };

  const handleImageChange = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setNewItem((prevItem) => ({
        ...prevItem,
        image: reader.result as string, // This sets the data URL as the image
      }));
    };
    reader.readAsDataURL(file);
  };

  const addNewItem = async () => {
    if (!newItem.name) {
      alert("Item name is required");
      return;
    }

    const inventoryRef = ref(database, `inventory/${newItem.name}`);
    await update(inventoryRef, {
      quantity: newItem.quantity,
      price: newItem.price,
      imageUrl: newItem.image,
    });

    setInventory({
      ...inventory,
      [newItem.name]: {
        quantity: newItem.quantity,
        price: newItem.price,
        imageUrl: newItem.image,
      },
    });

    setNewItem({ name: "", quantity: 0, price: 0, image: "" });
  };

  return (
    <div className="inventory-container">
      <div className="inventory-card">
        <h2>Inventory Management</h2>
        
        <div className="inventory-section">
          <div className="inventory-grid">
            {Object.keys(inventory).map((key) => (
              <ItemCard
                item={{
                  name: key,
                  price: inventory[key]?.price,
                  stock: inventory[key]?.quantity,
                  imageUrl: inventory[key]?.imageUrl,
                }}
              />
            ))}
          </div>
        </div>
        
        <div className="inventory-section">
          <h3>Update Stock</h3>
          {Object.keys(inventory).map((key) => (
            <div className="input-group" key={key}>
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
          <div className="input-group">
            <label>Image</label>
            <input
              type="file"
              onChange={(e) =>
                e.target.files && handleImageChange(e.target.files[0])
              }
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
