
/**
 * Utility for adding technical indicators and trade markers to TradingView charts
 */

interface IndicatorProps {
  chart: any; // TradingView chart instance
  visibleRange: { from: number; to: number };
  entryPrice?: number;
  exitPrice?: number;
  stopLoss?: number;
  takeProfit?: number;
  direction?: 'long' | 'short';
}

/**
 * Adds custom trade indicators to a TradingView chart
 */
export const addChartIndicators = ({
  chart,
  visibleRange,
  entryPrice,
  exitPrice,
  stopLoss,
  takeProfit,
  direction = 'long'
}: IndicatorProps): void => {
  try {
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
  } catch (error) {
    console.error('Error adding indicators to chart:', error);
  }
};
