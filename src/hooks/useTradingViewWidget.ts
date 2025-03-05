
import { useState, useCallback, useRef, useEffect } from 'react';
import { loadTradingViewScript, createContainerId } from '@/lib/chartUtils';
import { addChartIndicators } from '@/components/charts/ChartIndicators';

export interface TradingViewWidgetProps {
  symbol: string;
  interval?: string;
  entryPrice?: number;
  exitPrice?: number;
  stopLoss?: number;
  takeProfit?: number;
  direction?: 'long' | 'short';
}

export const useTradingViewWidget = ({
  symbol,
  interval = '1D',
  entryPrice,
  exitPrice,
  stopLoss,
  takeProfit,
  direction = 'long',
}: TradingViewWidgetProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [widgetKey, setWidgetKey] = useState(Date.now()); // Used to force re-render
  
  // Create a unique container ID
  const containerId = useRef(createContainerId(symbol));

  const loadTradingViewWidget = useCallback((containerElement: HTMLDivElement) => {
    if (!containerElement) return;
    
    setIsLoading(true);
    setHasError(false);
    
    try {
      containerElement.innerHTML = '';
      
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
          
          if (entryPrice || stopLoss || takeProfit || exitPrice) {
            const chart = widget.chart();
            const visibleRange = chart.getVisibleRange();
            
            addChartIndicators({
              chart,
              visibleRange,
              entryPrice,
              exitPrice,
              stopLoss,
              takeProfit,
              direction
            });
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
  
  const initializeWidget = useCallback(async (containerElement: HTMLDivElement) => {
    try {
      await loadTradingViewScript();
      loadTradingViewWidget(containerElement);
    } catch (error) {
      console.error('Error loading TradingView:', error);
      setHasError(true);
      setIsLoading(false);
    }
  }, [loadTradingViewWidget]);
  
  const handleRetry = useCallback(() => {
    setWidgetKey(Date.now());
  }, []);
  
  // Cleanup function for the widget
  const cleanupWidget = useCallback(() => {
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
  }, []);

  return {
    isLoading,
    hasError,
    widgetKey,
    containerId: containerId.current,
    initializeWidget,
    handleRetry,
    cleanupWidget
  };
};
