import { ref, get } from "firebase/database";
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

export default readAllUsers;
