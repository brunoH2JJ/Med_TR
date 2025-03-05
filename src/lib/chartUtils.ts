
/**
 * Utility functions for chart-related operations
 */

/**
 * Loads the TradingView script if it's not already loaded
 * @returns A promise that resolves when the script is loaded
 */
export const loadTradingViewScript = (): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    // If the script is already loaded, resolve immediately
    if (window.TradingView) {
      resolve();
      return;
    }
    
    // Create and load the script
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
};

/**
 * Creates a unique container ID for the TradingView widget
 * @param symbol The trading symbol
 * @returns A unique ID string
 */
export const createContainerId = (symbol: string): string => {
  return `tradingview_${symbol.replace(/[^a-zA-Z0-9]/g, '_')}_${Math.random().toString(36).substr(2, 9)}`;
};
