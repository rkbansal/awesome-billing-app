import { database } from "../firebase";
import { ref, get, update } from "firebase/database";
import { updateUser } from "./read-all-user";

export const placeOrder = async (
  customer: { phone: string; username: string },
  items: any[],
  paidAmount: number = 0,
  total: number,
  superTotal: number
) => {
  console.log(customer, items, total);
  // Create order object
  const currentDate = new Date();
  const order = {
    customerId: customer.phone,
    customerName: customer.username,
    items: items,
    paidAmount: paidAmount,
    totalAmount: total,
    superTotal: superTotal,
    date: currentDate,
    id: -1,
  };

  try {
    // Step 1: Store the order in Firebase Realtime Database under "orders" node
    const orderRef = ref(database, "orders");
    const newOrderKey = (await get(orderRef)).size + 1; // Create a new order ID
    order.id = newOrderKey;
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
    // Update the Firebase Realtime Database with new inventory values
    await update(inventoryRef, updatedInventory);
    await updateUser(customer.phone, { balance: superTotal - paidAmount });

    return newOrderKey;
  } catch (error) {
    console.error("Error completing sale or updating inventory:", error);
    alert("Error completing sale or updating inventory: " + error);
  }
};

export const getOrder = async (orderId?: string) => {
  if (!orderId) {
    return null;
  }
  try {
    // console.log("orderId====:", orderId);
    const orderRef = ref(database, `orders/${orderId}`);
    const snapshot = await get(orderRef);
    // console.log("Snapshot====", snapshot.val());
    return snapshot.exists() ? snapshot.val() : null;
  } catch (err) {
    console.error("Error fetching order:", err);
    return null;
  }
};
