export interface CryptoCurrency {
  symbol: string;
  name: string;
}

export interface Asset {
  id: string;
  name: string;
  symbol: string; 
  amount: number;
}

export interface PriceData {
  symbol: string; 
  price: number;
  change24h: number; 
}