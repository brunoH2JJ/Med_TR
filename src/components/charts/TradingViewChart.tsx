
import { useRef, useEffect } from 'react';

// Creating an interface for the props
interface TradingViewChartProps {
  symbol: string;
  interval?: string;
  entryPrice?: number;
  exitPrice?: number;
  stopLoss?: number;
  takeProfit?: number;
  direction?: 'long' | 'short';
  height?: string;
  width?: string;
  className?: string;
}

export function TradingViewChart({
  symbol,
  interval = '1D',
  entryPrice,
  exitPrice,
  stopLoss,
  takeProfit,
  direction = 'long',
  height = '400px',
  width = '100%',
  className,
}: TradingViewChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Clean up any existing chart widgets
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
    }
    
    // Create the TradingView widget
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      if (typeof window.TradingView !== 'undefined' && containerRef.current) {
        // Create a new widget instance
        new window.TradingView.widget({
          autosize: true,
          symbol: symbol,
          interval: interval,
          timezone: 'Etc/UTC',
          theme: 'light',
          style: '1',
          locale: 'en',
          toolbar_bg: '#f1f3f6',
          enable_publishing: false,
          allow_symbol_change: true,
          container_id: containerRef.current.id,
          studies: ['RSI@tv-basicstudies', 'MACD@tv-basicstudies'],
          hide_side_toolbar: false,
          withdateranges: true,
          save_image: true,
          hide_volume: false,
          // Draw levels with overrides if provided
          loading_screen: { backgroundColor: "#f4f4f5" },
          overrides: {
            "paneProperties.background": "#fff",
            "scalesProperties.backgroundColor": "#fff",
          },
          // Setup custom drawings once the chart is loaded
          drawings_access: { type: 'rectangle', tools: [{ name: 'rectangle' }] },
          saved_data: getCustomDrawings(symbol, entryPrice, exitPrice, stopLoss, takeProfit, direction),
        });
      }
    };
    
    document.head.appendChild(script);
    
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [symbol, interval, entryPrice, exitPrice, stopLoss, takeProfit, direction]);
  
  // Generate a unique ID for the container
  const containerId = `tradingview_${symbol.replace(/[^a-zA-Z0-9]/g, '_')}_${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div 
      ref={containerRef} 
      id={containerId} 
      className={className}
      style={{ height, width }}
    />
  );
}

// Helper function to create custom drawings
function getCustomDrawings(
  symbol: string,
  entryPrice?: number,
  exitPrice?: number,
  stopLoss?: number,
  takeProfit?: number,
  direction?: 'long' | 'short'
) {
  // This is a placeholder function - in a real app, you would create
  // drawing objects that TradingView can interpret to show entry/exit points
  // This requires more advanced integration with TradingView's API
  return null;
}

// Add the TradingView type to the Window interface
declare global {
  interface Window {
    TradingView: any;
  }
}
