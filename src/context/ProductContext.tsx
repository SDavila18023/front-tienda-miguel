import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { Product, ProductContextType } from '../types/ProductTypes';

const ProductContext = createContext<ProductContextType | null>(null);

const API_URL = import.meta.env.VITE_API_URL;

export const ProductProvider = ({ children }: { children: React.ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/products/products`);
      setProducts(response.data);
    } catch (err) {
      setError('Error al cargar los productos');
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (product: Omit<Product, '_id'>) => {
    try {
      const response = await axios.post(`${API_URL}/api/products/products`, product, {
        headers: { 'Content-Type': 'application/json' },
      });
      setProducts(prev => [...prev, response.data]);
    } catch (err) {
      setError('Error al añadir el producto');
    }
  };

  const updateProduct = async (id: string, product: Partial<Product>) => {
    try {
      const response = await axios.put(`${API_URL}/api/products/products/${id}`, product, {
        headers: { 'Content-Type': 'application/json' },
      });
      setProducts(prev => prev.map(p => (p._id === id ? response.data : p)));
    } catch (err) {
      setError('Error al actualizar el producto');
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/api/products/products/${id}`);
      setProducts(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      setError('Error al eliminar el producto');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <ProductContext.Provider 
      value={{ 
        products, 
        loading, 
        error, 
        addProduct, 
        updateProduct, 
        deleteProduct,
        fetchProducts
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts debe ser usado dentro de un ProductProvider');
  }
  return context;
};