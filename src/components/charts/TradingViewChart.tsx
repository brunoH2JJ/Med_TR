
import { useRef, useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

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
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  useEffect(() => {
    setIsLoading(true);
    
    // Create a unique container ID
    const containerId = `tradingview_${symbol.replace(/[^a-zA-Z0-9]/g, '_')}_${Math.random().toString(36).substr(2, 9)}`;
    
    if (containerRef.current) {
      containerRef.current.id = containerId;
      containerRef.current.innerHTML = '';
    }
    
    // Function to load the TradingView widget
    const loadTradingViewWidget = () => {
      if (!containerRef.current) return;
      
      try {
        // @ts-ignore
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
          container_id: containerId,
          studies: ['RSI@tv-basicstudies', 'MACD@tv-basicstudies'],
          hide_side_toolbar: false,
          withdateranges: true,
          save_image: true,
          hide_volume: false,
          loading_screen: { backgroundColor: "#f4f4f5" },
          overrides: {
            "paneProperties.background": "#fff",
            "scalesProperties.backgroundColor": "#fff",
          },
          disabled_features: ["use_localstorage_for_settings"],
          enabled_features: ["save_chart_properties_to_local_storage"],
          onChartReady: function() {
            setIsLoading(false);
            
            // Add custom indicators for entry/exit points if available
            if (entryPrice || stopLoss || takeProfit || exitPrice) {
              const chart = (window as any).tvWidget.chart();
              
              // Add entry price line
              if (entryPrice) {
                chart.createMultipointShape([
                  { price: entryPrice, time: chart.getVisibleRange().from },
                  { price: entryPrice, time: chart.getVisibleRange().to }
                ], {
                  shape: 'horizontal_line',
                  text: `Entry: ${entryPrice}`,
                  overrides: {
                    linecolor: direction === 'long' ? 'green' : 'red',
                    linestyle: 0,
                    linewidth: 2,
                    showLabel: true,
                    textcolor: '#1D1D1D',
                    fontsize: 12
                  }
                });
              }
              
              // Add stop loss line
              if (stopLoss) {
                chart.createMultipointShape([
                  { price: stopLoss, time: chart.getVisibleRange().from },
                  { price: stopLoss, time: chart.getVisibleRange().to }
                ], {
                  shape: 'horizontal_line',
                  text: `SL: ${stopLoss}`,
                  overrides: {
                    linecolor: '#FF4136',
                    linestyle: 2,
                    linewidth: 2,
                    showLabel: true,
                    textcolor: '#1D1D1D',
                    fontsize: 12
                  }
                });
              }
              
              // Add take profit line
              if (takeProfit) {
                chart.createMultipointShape([
                  { price: takeProfit, time: chart.getVisibleRange().from },
                  { price: takeProfit, time: chart.getVisibleRange().to }
                ], {
                  shape: 'horizontal_line',
                  text: `TP: ${takeProfit}`,
                  overrides: {
                    linecolor: '#2ECC40',
                    linestyle: 2,
                    linewidth: 2,
                    showLabel: true,
                    textcolor: '#1D1D1D',
                    fontsize: 12
                  }
                });
              }
              
              // Add exit price line if trade is closed
              if (exitPrice) {
                chart.createMultipointShape([
                  { price: exitPrice, time: chart.getVisibleRange().from },
                  { price: exitPrice, time: chart.getVisibleRange().to }
                ], {
                  shape: 'horizontal_line',
                  text: `Exit: ${exitPrice}`,
                  overrides: {
                    linecolor: '#0074D9',
                    linestyle: 0,
                    linewidth: 2,
                    showLabel: true,
                    textcolor: '#1D1D1D',
                    fontsize: 12
                  }
                });
              }
            }
          }
        });
      } catch (error) {
        console.error('Error initializing TradingView widget:', error);
        setHasError(true);
        setIsLoading(false);
      }
    };
    
    // Check if TradingView script is already loaded
    if (window.TradingView) {
      loadTradingViewWidget();
    } else {
      // Load TradingView script
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/tv.js';
      script.async = true;
      script.onload = loadTradingViewWidget;
      script.onerror = () => {
        console.error('Failed to load TradingView script');
        setHasError(true);
        setIsLoading(false);
      };
      
      document.head.appendChild(script);
      
      return () => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      };
    }
    
    // Cleanup function
    return () => {
      if (window.tvWidget) {
        try {
          window.tvWidget.remove();
          delete window.tvWidget;
        } catch (e) {
          console.error('Error cleaning up TradingView widget:', e);
        }
      }
    };
  }, [symbol, interval, entryPrice, exitPrice, stopLoss, takeProfit, direction]);
  
  return (
    <div className={`relative ${className || ''}`} style={{ height, width }}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50 z-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
          <div className="text-center p-4">
            <p className="text-destructive font-medium">Error loading chart</p>
            <p className="text-muted-foreground text-sm mt-1">Please check your connection or try again later</p>
          </div>
        </div>
      )}
      <div ref={containerRef} style={{ height: '100%', width: '100%' }} />
    </div>
  );
}

// Add the TradingView type to the Window interface
declare global {
  interface Window {
    TradingView: any;
    tvWidget: any;
  }
}
