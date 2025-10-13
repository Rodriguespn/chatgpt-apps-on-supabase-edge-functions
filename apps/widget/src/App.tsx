import { useState, useEffect } from 'react';
import type { FridgeData } from './types/fridge';
import FridgeView from './components/FridgeView';
import './App.css';

/**
 * Main App component
 *
 * Data is provided via toolOutput prop by the adapter layer
 * No default data is loaded - widget requires toolOutput to function
 */

interface AppProps {
  fridgeData?: FridgeData; // Fridge data passed directly as prop
}

function App({ fridgeData: fridgeDataProp }: AppProps) {
  const [fridgeData, setFridgeData] = useState<FridgeData | null>(null);

  // Debug: Log all props received
  console.log('[Widget Debug] App props:', { fridgeDataProp });
  console.log('[Widget Debug] fridgeDataProp type:', typeof fridgeDataProp);
  console.log('[Widget Debug] fridgeDataProp value:', JSON.stringify(fridgeDataProp, null, 2));

  useEffect(() => {
    // Log all message events received by the widget
    const handleMessage = (event: MessageEvent) => {
      console.log('[Widget Debug] Message event received:', {
        origin: event.origin,
        type: event.data?.type,
        data: event.data,
        fullEvent: event
      });

      // Handle ui-lifecycle-iframe-render-data message
      if (event.data?.type === 'ui-lifecycle-iframe-render-data') {
        console.log('[Widget Debug] Received render data:', event.data.payload?.renderData);
        const renderData = event.data.payload?.renderData;

        if (renderData) {
          // The fridge data is in renderData.toolOutput.fridge
          // Check if renderData.toolOutput.fridge exists and has the expected properties
          if (renderData.toolOutput?.fridge && renderData.toolOutput.fridge.id && renderData.toolOutput.fridge.zones) {
            console.log('[Widget Debug] Setting fridge data from renderData.toolOutput.fridge');
            // Wrap the fridge object in the FridgeData structure expected by FridgeView
            setFridgeData({ fridge: renderData.toolOutput.fridge } as FridgeData);
          } else {
            console.log('[Widget Debug] renderData does not contain valid fridge data:', renderData);
          }
        }
      }
    };

    window.addEventListener('message', handleMessage);
    console.log('[Widget Debug] Message event listener registered');

    // Notify parent that widget is ready
    console.log('[Widget Debug] Sending ui-lifecycle-iframe-ready to parent');
    window.parent.postMessage({ type: "ui-lifecycle-iframe-ready" }, "*");

    return () => {
      window.removeEventListener('message', handleMessage);
      console.log('[Widget Debug] Message event listener removed');
    };
  }, []);

  useEffect(() => {
    console.log('[Widget Debug] useEffect triggered with fridgeDataProp:', fridgeDataProp);

    // Load data from fridgeData prop
    if (fridgeDataProp) {
      console.log('[Widget Debug] Setting fridge data from prop');
      setFridgeData(fridgeDataProp);
    } else {
      console.log('[Widget Debug] No fridgeDataProp received');
    }
  }, [fridgeDataProp]);

  const sendPrompt = (prompt: string) => {
    const messageId = `prompt-${Date.now()}`;
    console.log('[Widget Debug] Sending prompt:', prompt);

    window.parent.postMessage({
      type: 'prompt',
      messageId,
      payload: { prompt }
    }, '*');
  };

  const handleRecipeRequest = () => {
    sendPrompt('Based on the current fridge contents, propose me some recipes I can make with these ingredients.');
  };

  const handleExpiringRecipeRequest = () => {
    sendPrompt('Based on the ingredients that are expiring soon in my fridge, propose me recipes that use these expiring ingredients to avoid food waste.');
  };

  if (!fridgeData) {
    return (
      <div className="loading-container">
        <p>Loading fridge data...</p>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="recipe-actions">
        <button className="recipe-button" onClick={handleRecipeRequest}>
          Propose me recipes
        </button>
        <button className="recipe-button recipe-button-urgent" onClick={handleExpiringRecipeRequest}>
          Recipes for expiring ingredients
        </button>
      </div>
      <FridgeView fridgeData={fridgeData} />
    </div>
  );
}

export default App;
