import { ref, get, update } from "firebase/database";
import { database } from "../firebase";

// Function to read all users from Firebase Realtime Database
const readAllUsers = async () => {
  try {
    // Reference the "users" node
    const usersRef = ref(database, "users");

    // Fetch data from the users node
    const snapshot = await get(usersRef);

    if (snapshot.exists()) {
      const usersData = snapshot.val();

      // Convert object into array format (if needed)
      const usersArray = Object.entries(usersData).map(
        ([userId, userData]) => ({
          id: userId,
          ...(userData as object),
        })
      );

      console.log(usersArray); // Display all users
      return usersArray; // You can also return the array
    } else {
      console.log("No users found");
      return [];
    }
  } catch (error) {
    console.error("Error reading users: ", error);
  }
};

// Function to update a user's data in Firebase Realtime Database
export const updateUser = async (userId: string, updatedData: object) => {
  try {
    if (!userId || !updatedData) {
      throw new Error(
        "Invalid parameters: userId and updatedData are required."
      );
    }

    // Reference the specific user node
    const userRef = ref(database, `users/${userId}`);

    // Update the user data
    await update(userRef, updatedData);

    console.log(`User ${userId} updated successfully.`);
  } catch (error) {
    console.error("Error updating user: ", error);
  }
};

export default readAllUsers;
