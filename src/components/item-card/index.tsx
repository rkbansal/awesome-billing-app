import "./index.css";

export type ItemProps = {
  item: {
    imageUrl?: string;
    name: string;
    price: number;
    stock: number;
  };
};

const ItemCard = ({ item }: ItemProps) => {
  return (
    <div className="item-card">
      <div className="item-image">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.name} className="item-img" />
        ) : (
          <div className="placeholder-icon">📷</div>
        )}
      </div>
      <div className="item-details">
        <h3 className="item-name">{item.name}</h3>
        <p className="item-price">₹ {item.price}</p>
        <p className={`item-stock ${item.stock < 0 ? "negative-stock" : ""}`}>
          Current Stock: {item.stock}
        </p>
        <button className="adjust-stock-btn">Adjust Stock</button>
      </div>
      <div className="item-actions">
        <button className="icon-btn star-btn">⭐</button>
        <button
          className={`icon-btn check-btn ${item.stock <= 0 ? "cross-btn" : ""}`}
        >
          {item.stock > 0 ? "✔️" : "x"}
        </button>
      </div>
    </div>
  );
};

export default ItemCard;
