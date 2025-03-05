
import { useRef, useEffect } from 'react';
import { Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTradingViewWidget, TradingViewWidgetProps } from '@/hooks/useTradingViewWidget';

// Creating an interface for the props
interface TradingViewChartProps extends TradingViewWidgetProps {
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
  
  const {
    isLoading,
    hasError,
    widgetKey,
    containerId,
    initializeWidget,
    handleRetry,
    cleanupWidget
  } = useTradingViewWidget({
    symbol,
    interval,
    entryPrice,
    exitPrice,
    stopLoss,
    takeProfit,
    direction
  });
  
  // Effect to load the script and initialize the widget
  useEffect(() => {
    let isMounted = true;
    
    // When widget key changes, we reinitialize everything
    if (containerRef.current) {
      containerRef.current.id = containerId;
      
      if (isMounted) {
        initializeWidget(containerRef.current);
      }
    }
    
    // Cleanup function
    return () => {
      isMounted = false;
      cleanupWidget();
    };
  }, [containerId, initializeWidget, cleanupWidget, widgetKey]);
  
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
