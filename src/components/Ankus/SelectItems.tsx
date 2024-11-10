// SelectItems.js
import ItemCard from "./ItemCard";
import styles from "./SelectItems.module.css";

type SelectItemsProps = {
  handleAddItem: (name: string, price: string, quantity?: number) => void;
  handleRemoveItem: (name: string, price: string, quantity?: number) => void;
  handleSetItemQuantity: (name: string, price: string, quantity?: number) => void;
  inventory: {
    [index: string]: { quantity: number; price: number; imageUrl?: string };
  };
  items: any[];
};

const SelectItems = ({
  items,
  inventory,
  handleAddItem,
  handleRemoveItem,
  handleSetItemQuantity,
}: SelectItemsProps) => {
  // const items = [
  //   { id: 1, name: "Full Cream", price: 34.5 },
  //   { id: 2, name: "Full Cream", price: 34.5 },
  //   // Add more items as needed
  // ];
  console.log(inventory);
  console.log(items);

  return (
    <div className={styles.container}>
      {/* <header className={styles.header}>
        <button className={styles.backButton}>&larr;</button>
        <h2>Select Items</h2>
        <span className={styles.phoneNumber}>7827123846</span>
        <button className={styles.searchButton}>🔍</button>
      </header>
      <div className={styles.categoryButtons}>
        <button className={styles.categoryButton}>ALL</button>
        <button className={styles.categoryButton}>MILK</button>
        <button className={styles.categoryButton}>BREAD</button>
        <button className={styles.categoryButton}>CURD</button>
      </div> */}
      <div className={styles.itemsGrid}>
        {Object.keys(inventory).map((key) => (
          <ItemCard
            key={key}
            itemName={key}
            initialPrice={inventory[key].price}
            totalQuantity={inventory[key].quantity}
            quantity={items.find((item) => item.name === key)?.quantity || 0}
            imageUrl={inventory[key].imageUrl}
            handleAddItem={handleAddItem}
            handleRemoveItem={handleRemoveItem}
            handleSetItemQuantity={handleSetItemQuantity}
          />
        ))}
      </div>
      {/* <button className={styles.nextButton}>NEXT</button> */}
    </div>
  );
};

export default SelectItems;
