import { useSelector } from 'react-redux';
import { useBinanceWS } from './hooks/useBinanceWS';
import { useLocalStorage } from './hooks/useLocalStorage';
import AssetList from './components/List';
import { RootState } from './store/store';
import Header from './components/header';
const App = () => {
  const assets = useSelector((state: RootState) => state.assets);
  const symbols = assets.map(asset => asset.symbol);
  
  useBinanceWS(symbols); // Подключает WebSocket для текущих активов
  useLocalStorage(); // Синхронизация с localStorage

  return (
    <div>
      <Header />
      <AssetList />
    </div>
  );
};

export default App;