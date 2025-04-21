import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PriceData } from '../../types/asset'; // Импортируем обновленный тип

const initialState: Record<string, Omit<PriceData, 'symbol'>> = {};

const pricesSlice = createSlice({
  name: 'prices',
  initialState,
  reducers: {
    updatePrice: (state, action: PayloadAction<PriceData>) => {
      const { symbol, price, change24h } = action.payload;
      state[symbol] = { price, change24h }; 
    },
  },
});

export const { updatePrice } = pricesSlice.actions;
export default pricesSlice.reducer;
