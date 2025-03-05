// components/ProductForm.tsx
import { useState, useRef, ChangeEvent } from "react";
import { useProducts } from "../../context/ProductContext";
import { 
  Plus, 
  X, 
  Save, 
  Image, 
  Tag, 
  Banknote, 
  BarChart, 
  ShoppingBag, 
  Bookmark, 
  Ruler 
} from "lucide-react";
import React from "react";
import axios from "axios";

interface ProductFormProps {
  categories?: string[]; // Opcional: lista de categorías predefinidas
}

const ProductForm: React.FC<ProductFormProps> = ({ categories = [] }) => {
  const { addProduct } = useProducts();
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: 0,
    stock: 0,
    category: "",
    brand: "",
    sizeProduct: "",
    imageUrl: "",
    description: "", // Nuevo campo
  });

  const calculateSalePrice = (price: number) => {
    return price + price * 0.3;
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      setIsUploading(true);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "tiendamigue");
      formData.append("cloud_name", "dswafbkxt");

      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dswafbkxt/image/upload",
        formData
      );

      setNewProduct({ ...newProduct, imageUrl: response.data.secure_url });
      setIsUploading(false);
    } catch (error) {
      console.error("Error al subir imagen:", error);
      setIsUploading(false);
      alert("Error al subir la imagen. Intente nuevamente.");
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar que haya una imagen
    if (!newProduct.imageUrl) {
      alert("Por favor sube una imagen del producto");
      return;
    }

    // Crear un nuevo objeto combinando el nombre y el tamaño
    const productToSave = {
      ...newProduct,
      name: `${newProduct.name} ${newProduct.sizeProduct}`.trim(), // Combinar nombre y tamaño
      price: calculateSalePrice(newProduct.price),
      createdAt: new Date().toISOString(), // Agregar fecha de creación
    };

    await addProduct(productToSave);
    
    // Resetear formulario
    setNewProduct({
      name: "",
      price: 0,
      stock: 0,
      category: "",
      brand: "",
      sizeProduct: "",
      imageUrl: "",
      description: "",
    });
    setImagePreview(null);
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-5 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 flex items-center justify-center"
        aria-label="Agregar producto"
      >
        <Plus className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-screen overflow-y-auto">
        <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center z-10">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <ShoppingBag className="w-5 h-5 mr-2 text-blue-600" />
            Agregar Nuevo Producto
          </h2>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Sección de imagen */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <Image className="w-4 h-4 mr-1 text-blue-600" />
              Imagen del Producto
            </label>
            
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-colors cursor-pointer" 
              onClick={() => fileInputRef.current?.click()}
            >
              {imagePreview ? (
                <div className="relative">
                  <img 
                    src={imagePreview} 
                    alt="Vista previa" 
                    className="mx-auto max-h-40 rounded"
                  />
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation(); 
                      setImagePreview(null);
                      setNewProduct({...newProduct, imageUrl: ""});
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="text-gray-500">
                  {isUploading ? (
                    <div className="flex flex-col items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
                      <p>Subiendo imagen...</p>
                    </div>
                  ) : (
                    <>
                      <Image className="w-10 h-10 mx-auto text-gray-400 mb-2" />
                      <p>Haz clic para subir una imagen</p>
                      <p className="text-xs">o arrastra y suelta aquí</p>
                    </>
                  )}
                </div>
              )}
              <input 
                type="file" 
                ref={fileInputRef}
                accept="image/*" 
                className="hidden" 
                onChange={handleImageUpload}
                disabled={isUploading}
              />
            </div>
          </div>

          {/* Información básica del producto */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <Tag className="w-4 h-4 mr-1 text-blue-600" />
                Nombre
              </label>
              <input
                type="text"
                required
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, name: e.target.value })
                }
                placeholder="Nombre del producto"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <Banknote className="w-4 h-4 mr-1 text-blue-600" />
                Precio de Costo
              </label>
              <input
                type="number"
                required
                min="1"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                value={newProduct.price}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, price: Number(e.target.value) })
                }
                placeholder="0.00"
              />
              {newProduct.price > 0 && (
                <div className="mt-1 text-sm">
                  <span className="text-gray-600">Precio de venta (+30%): </span>
                  <span className="font-medium text-green-600">
                    ${calculateSalePrice(newProduct.price).toFixed(2)}
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <BarChart className="w-4 h-4 mr-1 text-blue-600" />
                Stock
              </label>
              <input
                type="number"
                required
                min="1"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                value={newProduct.stock}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, stock: Number(e.target.value) })
                }
                placeholder="Cantidad disponible"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <Bookmark className="w-4 h-4 mr-1 text-blue-600" />
                Categoría
              </label>
              {categories.length > 0 ? (
                <select
                  required
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  value={newProduct.category}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, category: e.target.value })
                  }
                >
                  <option value="">Seleccionar categoría</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  required
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  value={newProduct.category}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, category: e.target.value })
                  }
                  placeholder="Categoría del producto"
                />
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <ShoppingBag className="w-4 h-4 mr-1 text-blue-600" />
                Marca
              </label>
              <input
                type="text"
                required
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                value={newProduct.brand}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, brand: e.target.value })
                }
                placeholder="Marca del producto"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <Ruler className="w-4 h-4 mr-1 text-blue-600" />
                Tamaño
              </label>
              <input
                type="text"
                required
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                value={newProduct.sizeProduct}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, sizeProduct: e.target.value })
                }
                placeholder="Ej: 500ml, XL, 1Kg"
              />
            </div>
          </div>

          {/* Descripción del producto */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción (opcional)
            </label>
            <textarea
              rows={3}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              value={newProduct.description}
              onChange={(e) =>
                setNewProduct({ ...newProduct, description: e.target.value })
              }
              placeholder="Descripción detallada del producto"
            ></textarea>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center ${
                isUploading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              <Save className="w-4 h-4 mr-1" />
              Guardar Producto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;