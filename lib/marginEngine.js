export function calculateMargin({
  laborHours = 4,
  laborRatePerHour = 85,
  materialsCost = 150,
  targetMargin = 0.35,
}) {
  const laborCost = laborHours * laborRatePerHour;
  const totalDirectCost = laborCost + materialsCost;
  
  // Target Sell Price = Direct Cost / (1 - targetMargin)
  const targetSellPrice = Math.round(totalDirectCost / (1 - targetMargin));
  const estimatedProfit = targetSellPrice - totalDirectCost;
  const grossMarginPercent = Math.round((estimatedProfit / targetSellPrice) * 100);

  return {
    laborHours,
    laborRatePerHour,
    materialsCost,
    financials: {
      laborCost,
      totalDirectCost,
      targetSellPrice,
      estimatedProfit,
      grossMarginPercent,
    },
  };
}

export default calculateMargin;