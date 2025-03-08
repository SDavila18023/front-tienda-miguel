import { useState } from "react";
import { Product } from "../../types/ProductTypes";
import { useProducts } from "../../context/ProductContext";
import { Pencil, Trash2, X, Check } from "lucide-react";
import React from "react";

const ProductCard = ({ product }: { product: Product }) => {
  const { updateProduct, deleteProduct } = useProducts();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState(product);

  const handleSave = async () => {
    await updateProduct(product._id, editedProduct);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      await deleteProduct(product._id);
    }
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
        {/* Nombre */}
        <div>
          <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
            Nombre del producto:
          </label>
          <input
            type="text"
            id="name"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={editedProduct.name}
            onChange={(e) =>
              setEditedProduct({ ...editedProduct, name: e.target.value })
            }
            placeholder="Nombre del producto"
            required
          />
        </div>

        {/* Precio */}
        <div>
          <label htmlFor="price" className="block text-gray-700 text-sm font-bold mb-2">
            Precio:
          </label>
          <input
            type="number"
            id="price"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={editedProduct.price}
            onChange={(e) =>
              setEditedProduct({
                ...editedProduct,
                price: Number(e.target.value),
              })
            }
            placeholder="Precio"
            required
          />
        </div>

        {/* Stock */}
        <div>
          <label htmlFor="stock" className="block text-gray-700 text-sm font-bold mb-2">
            Stock:
          </label>
          <input
            type="number"
            id="stock"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={editedProduct.stock}
            onChange={(e) =>
              setEditedProduct({
                ...editedProduct,
                stock: Number(e.target.value),
              })
            }
            placeholder="Stock"
            required
          />
        </div>

        {/* Categoría */}
        <div>
          <label htmlFor="category" className="block text-gray-700 text-sm font-bold mb-2">
            Categoría:
          </label>
          <input
            type="text"
            id="category"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={editedProduct.category}
            onChange={(e) =>
              setEditedProduct({ ...editedProduct, category: e.target.value })
            }
            placeholder="Categoría"
            required
          />
        </div>

        {/* Marca */}
        <div>
          <label htmlFor="brand" className="block text-gray-700 text-sm font-bold mb-2">
            Marca:
          </label>
          <input
            type="text"
            id="brand"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={editedProduct.brand}
            onChange={(e) =>
              setEditedProduct({ ...editedProduct, brand: e.target.value })
            }
            placeholder="Marca"
            required
          />
        </div>

        {/* Talla */}
        <div>
          <label htmlFor="size" className="block text-gray-700 text-sm font-bold mb-2">
            Talla:
          </label>
          <input
            type="text"
            id="size"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={editedProduct.sizeProduct}
            onChange={(e) =>
              setEditedProduct({ ...editedProduct, sizeProduct: e.target.value })
            }
            placeholder="Talla"
            required
          />
        </div>

        <div className="flex justify-end space-x-2">
          <button
            onClick={() => setIsEditing(false)}
            className="bg-gray-100 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            <X className="w-5 h-5 inline-block align-middle mr-2" />
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            <Check className="w-5 h-5 inline-block align-middle mr-2" />
            Guardar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 space-y-2">
      <img
        src={product.imageUrl || "https://i.imgur.com/MCHK0CU.jpg"}
        alt={product.name}
        className="w-full h-64 object-contain rounded"
      />

      <h3 className="text-lg font-semibold">{product.name}</h3>
      <div className="text-sm text-gray-600">
        <p>Marca: {product.brand}</p>
        <p>Categoría: {product.category}</p>
        <p>Tamaño: {product.sizeProduct}</p>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-xl font-bold">${product.price}</span>
        <span className="text-sm text-gray-500">Stock: {product.stock}</span>
      </div>
      <div className="flex justify-end space-x-2">
        <button
          onClick={() => setIsEditing(true)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          <Pencil className="w-5 h-5 inline-block align-middle mr-2" />
          Editar
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          <Trash2 className="w-5 h-5 inline-block align-middle mr-2" />
          Eliminar
        </button>
      </div>
    </div>
  );
};

export default ProductCard
