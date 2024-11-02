import { database } from "../firebase";
import { ref, get, update } from "firebase/database";

export const placeOrder = async (
  customer: { phone: string; username: string },
  items: any[],
  total: number
) => {
  console.log(customer, items, total);
  // Create order object
  const currentDate = new Date();
  const order = {
    customerId: customer.phone,
    customerName: customer.username,
    items: items,
    totalAmount: total,
    date: currentDate,
  };

  try {
    // Step 1: Store the order in Firebase Realtime Database under "orders" node
    const orderRef = ref(database, "orders");
    const newOrderKey = (await get(orderRef)).size + 1; // Create a new order ID
    await update(ref(database, `orders/${newOrderKey}`), order);

    // Step 2: Update inventory based on the purchased items
    const inventoryRef = ref(database, "inventory");
    const inventorySnapshot = await get(inventoryRef);
    const updatedInventory = { ...inventorySnapshot.val() };

    items.forEach((item) => {
      if (updatedInventory[item.name] !== undefined) {
        updatedInventory[item.name].quantity -= item.quantity;
        if (updatedInventory[item.name].quantity < 0) {
          throw new Error(`Item ${item.name} quantity is less than 0`);
        }
      } else {
        throw new Error(`Item ${item.name} not found in inventory`);
      }
    });
    console.log(updatedInventory);
    // Update the Firebase Realtime Database with new inventory values
    await update(inventoryRef, updatedInventory);

    // Reset items and total after sale is completed
    alert("Sale completed and inventory updated!");
  } catch (error) {
    console.error("Error completing sale or updating inventory:", error);
  }
};
