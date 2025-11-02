import type { FridgeZone } from '../types/fridge';
import ItemCard from './ItemCard';
import './ZoneCard.css';

interface ZoneCardProps {
  zone: FridgeZone;
}

function ZoneCard({ zone }: ZoneCardProps) {
  return (
    <div className='zone-card'>
      <div className='zone-header'>
        <div className='zone-title'>
          <h2 className='zone-name'>{zone.name}</h2>
          <span className='zone-type'>{zone.type}</span>
        </div>
        <div className='zone-info'>
          {zone.temperature && <span className='temperature'>{zone.temperature}°C</span>}
          <span className='item-count'>{zone.items.length} items</span>
        </div>
      </div>

      <div className='items-grid'>
        {zone.items.map((item) => <ItemCard key={item.id} item={item} />)}
      </div>
    </div>
  );
}

export default ZoneCard;
