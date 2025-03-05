import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { Sale, SaleContextType } from "../types/SaleTypes";

const SaleContext = createContext<SaleContextType | null>(null);

export const SaleProvider = ({ children }: { children: React.ReactNode }) => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_API_URL; // Usar variable de entorno

  const fetchSales = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/sales`);
      setSales(response.data);
    } catch (err) {
      setError("Error al cargar las ventas");
    } finally {
      setLoading(false);
    }
  };

  const addSale = async (sale: Omit<Sale, "_id" | "date">) => {
    try {
      // Registrar la venta
      const response = await axios.post(`${API_URL}/api/sales/register`, sale);
      const newSale = response.data;
      setSales((prev) => [...prev, newSale]);

      // Actualizar el stock de los productos
      await axios.put(`${API_URL}/api/products/update-stock`, {
        products: sale.products,
      });
    } catch (err) {
      setError("Error al registrar la venta");
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  return (
    <SaleContext.Provider value={{ sales, loading, error, addSale, fetchSales }}>
      {children}
    </SaleContext.Provider>
  );
};

export const useSales = () => {
  const context = useContext(SaleContext);
  if (!context) {
    throw new Error("useSales debe ser usado dentro de un SaleProvider");
  }
  return context;
};
