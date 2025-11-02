import type { FridgeData } from '../types/fridge';
import ZoneCard from './ZoneCard';
import './FridgeView.css';

interface FridgeViewProps {
  fridgeData: FridgeData;
}

function FridgeView({ fridgeData }: FridgeViewProps) {
  const { fridge } = fridgeData;
  const lastUpdated = new Date(fridge.lastUpdated).toLocaleString();

  return (
    <div className="fridge-view">
      <header className="fridge-header">
        <h1 className="fridge-name">{fridge.name}</h1>
        <p className="last-updated">Last updated: {lastUpdated}</p>
      </header>

      <div className="zones-container">
        {fridge.zones.map((zone) => (
          <ZoneCard key={zone.id} zone={zone} />
        ))}
      </div>
    </div>
  );
}

export default FridgeView;
