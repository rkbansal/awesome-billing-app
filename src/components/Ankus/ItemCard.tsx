// ItemCard.js
import { useEffect, useState } from "react";
import styles from "./ItemCard.module.css";

type ItemCardProps = {
  itemName: string;
  totalQuantity: number;
  initialPrice: number;
  quantity: number;
  imageUrl?: string;
  handleAddItem: (name: string, price: string, quantity?: number) => void;
  handleRemoveItem: (name: string, price: string, quantity?: number) => void;
  handleSetItemQuantity: (
    name: string,
    price: string,
    quantity?: number
  ) => void;
};
const ItemCard = ({
  itemName,
  initialPrice,
  totalQuantity,
  quantity,
  imageUrl,
  handleSetItemQuantity,
}: ItemCardProps) => {
  console.log(itemName, initialPrice, quantity, totalQuantity);
  // const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(initialPrice);
  const [newQuantity, setNewQuantity] = useState(0);

  useEffect(() => {
    setNewQuantity(quantity);
  }, [quantity]);
  // const increaseQuantity = () => {
  //   // setQuantity(quantity + 1);
  //   handleAddItem(itemName, price.toString());
  // };
  // const decreaseQuantity = () => {
  //   // setQuantity(Math.max(0, quantity - 1));
  //   handleRemoveItem(itemName, price.toString());
  // };

  const setQuantity = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newQuantity =
      totalQuantity - Number(e.target.value) >= 0
        ? Number(e.target.value)
        : totalQuantity;
    setNewQuantity(newQuantity);
    handleSetItemQuantity(itemName, price.toString(), newQuantity);
  };
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPrice(Number(e.target.value));

  return (
    <div className={styles.card}>
      <img src={imageUrl} alt={itemName} className={styles.image} />
      <p className={styles.itemName}>Stock: {totalQuantity - quantity}</p>
      <p className={styles.itemName}>{itemName}</p>
      {/* <div className={styles.controls}>
        <button onClick={decreaseQuantity} className={styles.quantityBtn}>
          -
        </button>
        <span className={styles.quantity}>{quantity}</span>
        <button onClick={increaseQuantity} className={styles.quantityBtn}>
          +
        </button>
      </div> */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {/* <label>Qty: </label> */}
        <input
          type="number"
          style={{ border: "1px dashed blue", fontSize: "13px" }}
          value={newQuantity}
          onChange={setQuantity}
        />
        <input
          type="number"
          value={price}
          style={{
            border: "1px dashed red",
            fontSize: "13px",
          }}
          onChange={handlePriceChange}
          className={styles.price}
        />
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* <label>Rs: </label> */}
        {/* <input
          type="number"
          value={price}
          onChange={handlePriceChange}
          className={styles.price}
        /> */}
      </div>
    </div>
  );
};

export default ItemCard;
