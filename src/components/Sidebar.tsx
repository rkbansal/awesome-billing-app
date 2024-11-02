import { Link } from "react-router-dom";
import { useState } from "react";
import { CSSProperties } from "react"; // Import CSSProperties

const styles = {
  sidebar: (isOpen: boolean) => ({
    width: isOpen ? "200px" : "0", // Slide-in effect
    height: "100vh",
    backgroundColor: "#333",
    color: "#fff",
    position: "fixed" as const,
    top: 0,
    left: 0,
    padding: isOpen ? "20px" : "0", // Adjust padding when sidebar is closed
    overflowX: "hidden" as "hidden", // Explicitly type the overflowX property
    transition: "0.3s", // Smooth transition for opening and closing
    zIndex: 1000, // Ensure sidebar is on top
  }),
  logo: {
    fontSize: "24px",
    marginBottom: "20px",
    textAlign: "center" as CSSProperties["textAlign"], // Explicitly type textAlign
  },
  ul: {
    listStyleType: "none",
    padding: 0,
    margin: 0,
  },
  li: {
    marginBottom: "10px",
    textAlign: "center" as CSSProperties["textAlign"], // Explicitly type textAlign
  },
  link: {
    textDecoration: "none",
    color: "#fff",
    fontSize: "18px",
    display: "block",
    padding: "10px 0",
  },
  hamburger: {
    fontSize: "30px",
    position: "fixed" as const,
    top: "10px",
    left: "10px",
    cursor: "pointer",
    color: "#333",
    zIndex: 1100, // Ensure the hamburger is above other elements
  },
};

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false); // Toggle state for sidebar

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Hamburger Menu */}
      <div style={styles.hamburger} onClick={toggleSidebar}>
        &#9776; {/* Hamburger icon */}
      </div>

      {/* Sidebar */}
      <div className="sidebar" style={styles.sidebar(isOpen)}>
        <h2 style={styles.logo}>Dairy Billing</h2>
        <nav>
          <ul style={styles.ul}>
            <li style={styles.li}>
              <Link to="/users" style={styles.link} onClick={toggleSidebar}>
                Users
              </Link>
            </li>
            <li style={styles.li}>
              <Link to="/billing" style={styles.link} onClick={toggleSidebar}>
                Billing
              </Link>
            </li>
            <li style={styles.li}>
              <Link to="/revenue" style={styles.link} onClick={toggleSidebar}>
                Revenue
              </Link>
            </li>
            <li style={styles.li}>
              <Link to="/inventory" style={styles.link} onClick={toggleSidebar}>
                Inventory
              </Link>
            </li>
            <li style={styles.li}>
              <Link to="/orders" style={styles.link} onClick={toggleSidebar}>
                Orders
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
