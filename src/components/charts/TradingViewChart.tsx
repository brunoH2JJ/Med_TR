
import { useRef, useEffect, useState, useCallback } from 'react';
import { Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  const [widgetKey, setWidgetKey] = useState(Date.now()); // Used to force re-render
  
  // Create a unique container ID
  const containerId = useRef(`tradingview_${symbol.replace(/[^a-zA-Z0-9]/g, '_')}_${Math.random().toString(36).substr(2, 9)}`);

  const loadTradingViewWidget = useCallback(() => {
    if (!containerRef.current) return;
    
    setIsLoading(true);
    setHasError(false);
    
    try {
      containerRef.current.innerHTML = '';
      
      // @ts-ignore
      const widget = new window.TradingView.widget({
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
        container_id: containerId.current,
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
          
          try {
            // Add custom indicators for entry/exit points if available
            if (entryPrice || stopLoss || takeProfit || exitPrice) {
              const chart = widget.chart();
              const visibleRange = chart.getVisibleRange();
              
              // Add entry price line
              if (entryPrice) {
                chart.createMultipointShape([
                  { price: entryPrice, time: visibleRange.from },
                  { price: entryPrice, time: visibleRange.to }
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
                  { price: stopLoss, time: visibleRange.from },
                  { price: stopLoss, time: visibleRange.to }
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
                  { price: takeProfit, time: visibleRange.from },
                  { price: takeProfit, time: visibleRange.to }
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
                  { price: exitPrice, time: visibleRange.from },
                  { price: exitPrice, time: visibleRange.to }
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
          } catch (innerError) {
            console.error('Error adding indicators to chart:', innerError);
          }
        }
      });
      
      // Store the widget instance for potential cleanup
      // @ts-ignore
      window.tvWidget = widget;
      
    } catch (error) {
      console.error('Error initializing TradingView widget:', error);
      setHasError(true);
      setIsLoading(false);
    }
  }, [symbol, interval, entryPrice, exitPrice, stopLoss, takeProfit, direction]);
  
  const loadTradingViewScript = useCallback(() => {
    return new Promise<void>((resolve, reject) => {
      if (window.TradingView) {
        resolve();
        return;
      }
      
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/tv.js';
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => {
        console.error('Failed to load TradingView script');
        reject(new Error('Failed to load TradingView script'));
      };
      
      document.head.appendChild(script);
    });
  }, []);
  
  const handleRetry = useCallback(() => {
    setWidgetKey(Date.now());
  }, []);
  
  // Effect to load the script and initialize the widget
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    
    // When widget key changes, we reinitialize everything
    if (containerRef.current) {
      containerRef.current.id = containerId.current;
    }
    
    loadTradingViewScript()
      .then(() => {
        if (isMounted) {
          loadTradingViewWidget();
        }
      })
      .catch((err) => {
        console.error('Error loading TradingView:', err);
        if (isMounted) {
          setHasError(true);
          setIsLoading(false);
        }
      });
    
    // Cleanup function
    return () => {
      isMounted = false;
      
      if (window.tvWidget) {
        try {
          // @ts-ignore
          window.tvWidget.remove();
          // @ts-ignore
          delete window.tvWidget;
        } catch (e) {
          console.error('Error cleaning up TradingView widget:', e);
        }
      }
    };
  }, [loadTradingViewScript, loadTradingViewWidget, widgetKey]);
  
  return (
    <div className={`relative ${className || ''}`} style={{ height, width }}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50 z-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
      
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 z-10">
          <div className="text-center p-4">
            <p className="text-destructive font-medium">Error loading chart</p>
            <p className="text-muted-foreground text-sm mt-1 mb-4">Please check your connection or try again</p>
            <Button onClick={handleRetry} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
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
