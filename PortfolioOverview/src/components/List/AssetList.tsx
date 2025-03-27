import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { useEffect, useState } from "react";
import { removeAsset } from "../../store/slice/assetsSlice";
import './list.scss';

export const AssetList = () => {
  const dispatch = useDispatch();
  const assets = useSelector((state: RootState) => state.assets);
  const prices = useSelector((state: RootState) => state.prices);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("Assets:", assets, "Prices:", prices);
    setIsLoading(false);
  }, [assets, prices]);

  const formatValue = (value: number | undefined | null, decimals: number) => {
    if (value === undefined || value === null || isNaN(value)) return '-';
    return value.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  };

  const handleRemoveAsset = (id: string) => {
    dispatch(removeAsset(id));
  };

  if (isLoading) {
    return <div className="asset-table__loading">Загрузка данных...</div>;
  }

  if (!assets || assets.length === 0) {
    return <div className="asset-table__empty">Нет активов для отображения</div>;
  }

  const portfolioTotal = assets.reduce((sum, asset) => {
    const priceData = prices[asset.symbol];
    const price = priceData?.price || 0;
    return sum + price * asset.amount;
  }, 0);

  return (
    <div className="asset-table__wrapper">
      <table className="asset-table">
        <thead>
          <tr>
            <th>Актив</th>
            <th className="asset-table__amount">Количество</th>
            <th className="asset-table__amount">Цена</th>
            <th className="asset-table__amount">Общая стоимость</th>
            <th className="asset-table__amount">Изм. за 24 ч.</th>
            <th className="asset-table__amount">% портфеля</th>
          </tr>
        </thead>
        <tbody>
          {assets.map((asset) => {
            const priceData = prices[asset.symbol];
            const currentPrice = priceData?.price ?? null;
            const totalValue = currentPrice ? asset.amount * currentPrice : null;
            const change24h = priceData?.change24h ?? null;
            const portfolioPercentage = portfolioTotal > 0 && totalValue 
              ? (totalValue / portfolioTotal) * 100 
              : 0;

            return (
              <tr key={asset.id} onClick={() => handleRemoveAsset(asset.id)}>
                <td>{asset.name} ({asset.symbol})</td>
                <td className="asset-table__amount">{formatValue(asset.amount, 5)}</td>
                <td className="asset-table__amount">
                  {currentPrice !== null ? `$${formatValue(currentPrice, 2)}` : '-'}
                </td>
                <td className="asset-table__amount">
                  {totalValue !== null ? `$${formatValue(totalValue, 2)}` : '-'}
                </td>
                <td className={`asset-table__amount ${
                  (change24h || 0) >= 0 ? 'asset-table__positive' : 'asset-table__negative'
                }`}>
                  {change24h !== null ? `${formatValue(change24h, 2)}%` : '-'}
                </td>
                <td className="asset-table__amount">
                  {formatValue(portfolioPercentage, 2)}%
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};