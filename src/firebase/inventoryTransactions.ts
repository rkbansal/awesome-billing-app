import { ref, get, update } from "firebase/database";
import { database } from "./firebase";

// Function to read all users from Firebase Realtime Database
export const getAllInventory = async () => {
  try {
    // Reference the "users" node
    const inventoryTransRef = ref(database, "inventory-transactions");

    // Fetch data from the users node
    const snapshot = await get(inventoryTransRef);

    if (snapshot.exists()) {
      const inventoryData = snapshot.val();

      // Convert object into array format (if needed)
      const inventoryArray = Object.entries(inventoryData).map(
        ([itemId, itemData]) => ({
          id: itemId,
          ...(itemData as Object),
        })
      );

      console.log(inventoryArray); // Display all users
      return inventoryArray; // You can also return the array
    } else {
      console.log("No users found");
      return [];
    }
  } catch (error) {
    console.error("Error reading users: ", error);
  }
};

export const addToInventoryTransaction = async (item: any) => {
  const inventoryTransRef = ref(database, "inventory-transactions");
  const newTransactionKey = (await get(inventoryTransRef)).size + 1; // Create a new order ID
  item.id = newTransactionKey;
  await update(
    ref(database, `inventory-transactions/${newTransactionKey}`),
    item
  );
};

export const fetchInventory = async (setInventory: any) => {
  const inventoryRef = ref(database, "inventory-transactions");
  const snapshot = await get(inventoryRef);
  if (snapshot.exists()) {
    setInventory(snapshot.val());
  } else {
    console.log("No inventory data available");
  }
};
