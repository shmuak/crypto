import { useState, useEffect, useRef, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { addAsset } from '../../store/slice/assetsSlice';
import './addAssetForm.scss';

interface CryptoCurrency {
  symbol: string;
  name: string;
  price?: number;
  change?: number;
}

interface AddAssetFormProps {
  show: boolean;
  onClose: () => void;
}

export const AddAssetForm = ({ show, onClose }: AddAssetFormProps) => {
  const dispatch = useDispatch();
  const [cryptos, setCryptos] = useState<CryptoCurrency[]>([]);
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoCurrency | null>(null);
  const [amount, setAmount] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const formRef = useRef<HTMLDivElement>(null);

  // Обработчик закрытия по Escape
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  // Обработчик клика по оверлею
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (formRef.current && !formRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  // Добавляем и удаляем обработчик Escape
  useEffect(() => {
    if (show) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [show, handleKeyDown]);

  // Загрузка криптовалют
  useEffect(() => {
    const fetchCryptos = async () => {
      try {
        const infoResponse = await fetch('https://api.binance.com/api/v3/exchangeInfo');
        const infoData = await infoResponse.json();
        
        const pricesResponse = await fetch('https://api.binance.com/api/v3/ticker/24hr');
        const pricesData = await pricesResponse.json();

        const cryptoList = infoData.symbols
          .filter((s: { symbol: string }) => s.symbol.endsWith('USDT'))
          .map((s: { symbol: string; baseAsset: string }) => {
            const priceInfo = pricesData.find((p: { symbol: string }) => p.symbol === s.symbol);
            return {
              symbol: s.symbol,
              name: s.baseAsset,
              price: priceInfo ? parseFloat(priceInfo.lastPrice) : 0,
              change: priceInfo ? parseFloat(priceInfo.priceChangePercent) : 0
            };
          });
          
        setCryptos(cryptoList);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCryptos();
  }, []);

  if (!show) return null;

  return (
    <div className="add-asset-form">
      <div className="modal-overlay" onClick={handleOverlayClick}>
        <div className="modal-container" ref={formRef}>
          <div className="modal-header">
            <h2>Добавить актив</h2>
          </div>

          <div className="search-container">
            <input
              type="text"
              placeholder="Поиск криптовалюты..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>

          <div className="crypto-list">
            {isLoading ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
              </div>
            ) : (
              <ul>
                {cryptos
                  .filter(crypto =>
                    crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    crypto.name.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((crypto) => (
                    <li
                      key={crypto.symbol}
                      className={`crypto-item ${
                        selectedCrypto?.symbol === crypto.symbol ? 'selected' : ''
                      }`}
                      onClick={() => setSelectedCrypto(crypto)}
                    >
                      <div className="crypto-info">
                        <div>
                          <div className="crypto-name">{crypto.name}</div>
                          <div className="crypto-symbol">{crypto.symbol}</div>
                        </div>
                        <div>
                          <div className="crypto-price">
                            ${crypto.price?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </div>
                          <div 
                            className="crypto-change"
                            style={{ 
                              color: crypto.change && crypto.change >= 0 ? '#0ecb81' : '#f6465d' 
                            }}
                          >
                            {crypto.change && crypto.change >= 0 ? '+' : ''}
                            {crypto.change?.toFixed(2)}%
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
              </ul>
            )}
          </div>

          {selectedCrypto && (
            <div className="form-container">
              <form onSubmit={(e) => {
                e.preventDefault();
                dispatch(addAsset({
                  id: Date.now().toString(),
                  name: selectedCrypto.name,
                  symbol: selectedCrypto.symbol,
                  amount: parseFloat(amount),
                }));
                onClose();
              }}>
                <label>
                  Количество {selectedCrypto.name}
                </label>
                <input
                  type="number"
                  step="any"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  placeholder="0.00"
                />
                <button
                  type="submit"
                  disabled={!amount}
                >
                  Добавить
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};