import { useState, useEffect } from "react";
import { ref, update } from "firebase/database";
import { database } from "../../firebase/firebase";
import "./Inventory.css";
import { fetchInventory } from "../../firebase/inventory";
import ItemCard from "../../components/item-card";
import Modal from "../../components/components/InventoryUpdateModal";
import { addToInventoryTransaction } from "../../firebase/inventoryTransactions";

type InventoryType = {
  [key: string]: {
    quantity: number;
    price: number;
    imageUrl?: string;
    buyPrice?: number;
  };
};

const Inventory = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInventoryUpdatePending, setIsInventoryUpdatePending] =
    useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const [inventory, setInventory] = useState<InventoryType>({});
  const [newStock, setNewStock] = useState<InventoryType>(inventory);
  const [newItem, setNewItem] = useState({
    name: "",
    quantity: 0,
    price: 0,
    buyPrice: 0,
    image: "",
  });

  const [currentEditStock, setCurrentEditStock] = useState({
    name: "",
    quantity: 0,
    price: 0,
    buyPrice: 0,
    image: "",
  });

  useEffect(() => {
    setNewStock(inventory);
  }, [inventory]);

  useEffect(() => {
    fetchInventory(setInventory);
  }, []);

  const updateInventory = async () => {
    setIsInventoryUpdatePending(true);
    // const inventoryRef = ref(database, "inventory");
    // await set(inventoryRef, newStock);

    const inventoryRef = ref(database, `inventory/${currentEditStock.name}`);
    await update(inventoryRef, {
      quantity: currentEditStock.quantity,
      price: currentEditStock.price,
      imageUrl: currentEditStock.image,
      buyPrice: currentEditStock.buyPrice,
    });
    setInventory(newStock);
    addToInventoryTransaction(currentEditStock);
    setIsInventoryUpdatePending(false);
    closeModal();
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
      buyPrice: newItem.buyPrice,
    });

    setInventory({
      ...inventory,
      [newItem.name]: {
        quantity: newItem.quantity,
        price: newItem.price,
        imageUrl: newItem.image,
        buyPrice: newItem.buyPrice,
      },
    });

    setNewItem({ name: "", quantity: 0, price: 0, image: "", buyPrice: 0 });
  };

  const handleEditStock = async (key: string) => {
    // console.log(inventory[key]);
    setCurrentEditStock({
      name: key,
      quantity: inventory[key]?.quantity || 0,
      price: inventory[key]?.price || 0,
      image: inventory[key]?.imageUrl || "",
      buyPrice: inventory[key]?.buyPrice || 0,
    });
    openModal();
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
                onAdjustStock={() => {
                  handleEditStock(key);
                }}
              />
            ))}
          </div>
        </div>
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <div className="input-group">
            <label>{currentEditStock.name}</label>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", gap: "10px" }}>
                <label>Stock: </label>
                <input
                  type="number"
                  value={currentEditStock?.quantity}
                  onChange={(e) => {
                    setCurrentEditStock({
                      ...currentEditStock,
                      quantity: parseFloat(e.target.value),
                    });
                    setNewStock({
                      ...newStock,
                      [currentEditStock.name]: {
                        ...newStock[currentEditStock.name],
                        quantity: parseInt(e.target.value),
                      },
                    });
                  }}
                  placeholder={`Enter new ${currentEditStock.name} stock`}
                />
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <label>Price: </label>
                <input
                  type="number"
                  value={currentEditStock?.price}
                  onChange={(e) => {
                    setCurrentEditStock({
                      ...currentEditStock,
                      price: parseFloat(e.target.value),
                    });
                    setNewStock({
                      ...newStock,
                      [currentEditStock.name]: {
                        ...newStock[currentEditStock.name],
                        price: parseFloat(e.target.value),
                      },
                    });
                  }}
                  placeholder={`Enter new ${currentEditStock.name} price per unit`}
                />
              </div>
              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <label>Buy Price: </label>
                <input
                  type="number"
                  value={currentEditStock?.buyPrice}
                  onChange={(e) => {
                    setCurrentEditStock({
                      ...currentEditStock,
                      buyPrice: parseFloat(e.target.value),
                    });
                    setNewStock({
                      ...newStock,
                      [currentEditStock.name]: {
                        ...newStock[currentEditStock.name],
                        buyPrice: parseFloat(e.target.value),
                      },
                    });
                  }}
                  placeholder={`Enter new ${currentEditStock.name} buy price per unit`}
                />
              </div>
            </div>
            {isInventoryUpdatePending ? (
              <div>Updating...</div>
            ) : (
              <button className="update-btn" onClick={updateInventory}>
                Update Inventory
              </button>
            )}
          </div>
        </Modal>
        <div className="inventory-section">
          {/* <h3>Update Stock</h3>
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
          ))} */}
          {/* <button className="update-btn" onClick={updateInventory}>
            Update Inventory
          </button> */}
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
            <label>Sell Price</label>
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
            <label>Buy Price</label>
            <input
              type="number"
              value={newItem.buyPrice}
              onChange={(e) =>
                setNewItem({ ...newItem, buyPrice: parseFloat(e.target.value) })
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
