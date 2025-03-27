import { useEffect } from 'react';
import { loadAssets } from '../store/slice/assetsSlice';
import { useDispatch } from 'react-redux';
import { store } from '../store/store';

export const useLocalStorage = () => {
  const dispatch = useDispatch();

  // Сначала подписываемся на изменения
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      const state = store.getState();
      localStorage.setItem('assets', JSON.stringify(state.assets));
    });
    return unsubscribe;
  }, []);

  // Затем загружаем данные
  useEffect(() => {
    const savedAssets = localStorage.getItem('assets');
    if (savedAssets) {
      try {
        const parsed = JSON.parse(savedAssets);
        dispatch(loadAssets(parsed));
      } catch (err) {
        console.error('Failed to parse saved assets:', err);
      }
    }
  }, [dispatch]);
};