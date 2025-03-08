// components/ProductGrid.tsx
import { useState } from 'react';
import { useProducts } from '../../context/ProductContext';
import ProductCard from './ProductCard';
import ProductForm from './ProductForm';
import SaleForm from './SaleForm';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react';

const ProductGrid = () => {
  const { products, loading, error } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Añadida configuración de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8; // Cantidad de productos por página
  
  // Filtrar productos según término de búsqueda
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sizeProduct.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Calcular total de páginas
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  
  // Obtener productos de la página actual
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  
  // Funciones para cambiar de página
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  
  // Mostrar paginación solo si hay más de una página
  const renderPagination = () => {
    if (totalPages <= 1) return null;
    
    // Crear array de números de página para mostrar
    const pageNumbers = [];
    const maxPagesToShow = 5; // Limitar cantidad de números de página mostrados
    
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return (
      <div className="flex justify-center items-center mt-8 space-x-2">
        <button
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
          className={`p-2 rounded-md ${
            currentPage === 1
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-blue-600 hover:bg-blue-100'
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        {startPage > 1 && (
          <>
            <button
              onClick={() => goToPage(1)}
              className="px-3 py-1 rounded-md hover:bg-blue-100"
            >
              1
            </button>
            {startPage > 2 && <span className="px-1">...</span>}
          </>
        )}
        
        {pageNumbers.map(number => (
          <button
            key={number}
            onClick={() => goToPage(number)}
            className={`px-3 py-1 rounded-md ${
              currentPage === number
                ? 'bg-blue-600 text-white'
                : 'hover:bg-blue-100'
            }`}
          >
            {number}
          </button>
        ))}
        
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="px-1">...</span>}
            <button
              onClick={() => goToPage(totalPages)}
              className="px-3 py-1 rounded-md hover:bg-blue-100"
            >
              {totalPages}
            </button>
          </>
        )}
        
        <button
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-md ${
            currentPage === totalPages || totalPages === 0
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-blue-600 hover:bg-blue-100'
          }`}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    );
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        {error}
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar por nombre, categoría, marca o talla..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Resetear a primera página al buscar
            }}
            className="w-full p-3 pl-10 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
        </div>
      </div>
     
      {filteredProducts.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No se encontraron productos que coincidan con la búsqueda
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
          
          {/* Componente de paginación */}
          {renderPagination()}
          
          {/* Información de paginación */}
          <div className="text-center text-gray-500 mt-4">
            Mostrando {indexOfFirstProduct + 1}-
            {Math.min(indexOfLastProduct, filteredProducts.length)} de{" "}
            {filteredProducts.length} productos
          </div>
        </>
      )}
     
      <ProductForm />
      <SaleForm />
    </div>
  );
};

export default ProductGrid;