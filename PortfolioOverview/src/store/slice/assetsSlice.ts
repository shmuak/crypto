import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Asset } from '../../types/asset'

const initialState: Asset[] = []

const assetsSlice = createSlice({
  name: 'assets',
  initialState,
  reducers: {
    addAsset: (state, action: PayloadAction<Asset>) => {
      state.push(action.payload)
    },
    removeAsset: (state, action: PayloadAction<string>) => {
      return state.filter(asset => asset.id !== action.payload)
    },
    loadAssets: (state, action: PayloadAction<Asset[]>) => {
      return action.payload
    }
  },
})

export const { addAsset, removeAsset, loadAssets } = assetsSlice.actions
export default assetsSlice.reducer