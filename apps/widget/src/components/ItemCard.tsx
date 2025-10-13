import type { FridgeItem } from '../types/fridge';
import './ItemCard.css';

interface ItemCardProps {
  item: FridgeItem;
}

function ItemCard({ item }: ItemCardProps) {
  const expiryDate = item.expirationDate
    ? new Date(item.expirationDate).toLocaleDateString()
    : null;

  return (
    <div className={`item-card item-status-${item.status}`}>
      <div className="item-header">
        <h3 className="item-name">{item.name}</h3>
        <span className="item-category">{item.category}</span>
      </div>

      <div className="item-details">
        <p className="item-quantity">
          {item.quantity.value} {item.quantity.unit}
        </p>
        {expiryDate && (
          <p className="item-expiry">Expires: {expiryDate}</p>
        )}
      </div>

      <div className="item-footer">
        <span className={`status-badge status-${item.status}`}>
          {item.status.replace('-', ' ')}
        </span>
      </div>

      {item.notes && (
        <p className="item-notes">{item.notes}</p>
      )}
    </div>
  );
}

export default ItemCard;
