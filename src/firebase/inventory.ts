import { ref, get, set } from "firebase/database";
import { database } from "../firebase";

// Function to read all users from Firebase Realtime Database
export const getAllInventory = async () => {
  try {
    // Reference the "users" node
    const inventoryRef = ref(database, "inventory");

    // Fetch data from the users node
    const snapshot = await get(inventoryRef);

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

export const addItemToInventory = async (item: any) => {
  set(ref(database, "inventory/" + item.id), item)
    .then(() => {
      console.log("Item data saved successfully.");
    })
    .catch((error) => {
      console.error("Error saving item data: ", error);
    });
};

export const fetchInventory = async (setInventory: any) => {
  const inventoryRef = ref(database, "inventory");
  const snapshot = await get(inventoryRef);
  if (snapshot.exists()) {
    setInventory(snapshot.val());
  } else {
    console.log("No inventory data available");
  }
};
