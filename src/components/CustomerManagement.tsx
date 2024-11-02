import { useState, useEffect, useCallback } from "react";
import { database } from "../firebase"; // Firebase configuration
import { ref, set } from "firebase/database";
import readAllUsers from "../firebase/read-all-user";
import "./customer.css"; // Import custom CSS

const CustomerManagement = () => {
  const [newCustomer, setNewCustomer] = useState({ name: "", phone: "" });

  interface User {
    id: string;
    username: string;
    phone: string;
  }
  const [users, setUsers] = useState<User[]>([]);
  const fetchUsers = useCallback(async () => {
    const allUsers = await readAllUsers();
    setUsers(allUsers as User[]);
  }, []);
  
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const addCustomer = (name: string, phone: string) => {
    if (phone === "") {
      alert("Phone is required");
      return;
    }
    set(ref(database, "users/" + phone), {
      username: name,
      phone: phone,
    })
      .then(() => {
        console.log("User data saved successfully.");
        fetchUsers();
      })
      .catch((error) => {
        console.error("Error saving user data: ", error);
      });
  };

  return (
    <div className="customer-container">
      <h2 className="header">Customer Management</h2>

      <div className="form">
        <input
          type="text"
          className="input-field"
          placeholder="Customer Name"
          value={newCustomer.name}
          onChange={(e) =>
            setNewCustomer({ ...newCustomer, name: e.target.value })
          }
        />
        <input
          type="text"
          className="input-field"
          placeholder="Phone"
          value={newCustomer.phone}
          onChange={(e) =>
            setNewCustomer({ ...newCustomer, phone: e.target.value })
          }
        />
        <button
          className="add-btn"
          onClick={() => addCustomer(newCustomer.name, newCustomer.phone)}
        >
          Add Customer
        </button>
      </div>

      <h3 className="list-header">Customer List</h3>
      <ul className="customer-list">
        {users?.map((user) => (
          <li key={user.id} className="customer-item">
            <span className="customer-phone">{user.phone}</span> -{" "}
            <span className="customer-name">{user.username}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CustomerManagement;
