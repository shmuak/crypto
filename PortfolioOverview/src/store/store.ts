import { configureStore } from "@reduxjs/toolkit";
import assetsReducer from './slice/assetsSlice';
import pricesReducer from './slice/priceSlice';

export const store = configureStore({
    reducer: {
        assets: assetsReducer,
        prices: pricesReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;