import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface Product {
  id: number;
  imageUrl: string;
  name: string;
  count: number;
  size: { width: number; height: number };
  weight: string;
  comments: Comment[];
}

interface Comment {
  id: number;
  productId: number;
  description: string;
  date: string;
}

interface ProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  products: [],
  loading: false,
  error: null,
};

export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
  const response = await axios.get('http://localhost:5000/products');
  return response.data;
});

export const addNewProduct = createAsyncThunk('products/addNewProduct', async (newProduct: Omit<Product, 'id'>) => {
  const response = await axios.post('http://localhost:5000/products', newProduct);
  return response.data;
});

export const deleteProduct = createAsyncThunk('products/deleteProduct', async (productId: number) => {
  await axios.delete(`http://localhost:5000/products/${productId}`);
  return productId;
});

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch products';
      })
      .addCase(addNewProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.products.push(action.payload);
      })
      .addCase(deleteProduct.fulfilled, (state, action: PayloadAction<number>) => {
        state.products = state.products.filter(product => product.id !== action.payload);
      });
  },
});

export default productsSlice.reducer;
