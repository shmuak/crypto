import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updatePrice } from '../store/slice/priceSlice';

export const useBinanceWS = (symbols: string[]) => {
  const dispatch = useDispatch();

  useEffect(() => {
    console.log('Connecting to WebSocket for symbols:', symbols); 
    if (symbols.length === 0) {
      console.warn('No symbols to subscribe!'); 
      return;
    }

    const streams = symbols.map(s => `${s.toLowerCase()}@ticker`).join('/');
    const socket = new WebSocket(`wss://stream.binance.com:9443/stream?streams=${streams}`);

    socket.onopen = () => console.log('WebSocket connected');
    socket.onerror = (err) => console.error('WebSocket error:', err);
    socket.onclose = () => console.log('WebSocket closed');

    socket.onmessage = (event) => {
      const parsed = JSON.parse(event.data);
      console.log('WS data:', parsed); 

      if (parsed.data?.e === '24hrTicker') {
        dispatch(updatePrice({
          symbol: parsed.data.s, 
          price: parseFloat(parsed.data.c), 
          change24h: parseFloat(parsed.data.P), 
        }));
      }
    };

    return () => {
      socket.close();
    };
  }, [symbols, dispatch]);
};