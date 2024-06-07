import React, { useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { fetchProducts } from "../products/productsSlice";
import { AppDispatch } from "../../app/store";

interface ProductComment {
  id: string;
  description: string;
  date: string;
}

interface Product {
  id: string;
  imageUrl: string;
  name: string;
  count: number;
  size: { width: number; height: number };
  weight: string;
  comments: ProductComment[];
}

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    name: string;
    imageUrl: string;
    count: number;
    size: { width: number; height: number };
    weight: string;
    comments: ProductComment[];
  };
  onUpdateProduct: (product: Product) => void;
}

const EditProductModal: React.FC<EditProductModalProps> = ({
  isOpen,
  onClose,
  product,
  onUpdateProduct,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState({ ...product });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:5000/products/${product.id}`,
        formData
      );
      onUpdateProduct(response.data);
      dispatch(fetchProducts());
      onClose();
    } catch (error) {
      console.error("Failed to update product", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <form onSubmit={handleSubmit}>
        <h2>Edit Product</h2>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </label>
        <label>
          Image URL:
          <input
            type="text"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
          />
        </label>
        <label>
          Count:
          <input
            type="number"
            name="count"
            value={formData.count}
            onChange={handleChange}
          />
        </label>
        <label>
          Width:
          <input
            type="number"
            name="size.width"
            value={formData.size.width}
            onChange={handleChange}
          />
        </label>
        <label>
          Height:
          <input
            type="number"
            name="size.height"
            value={formData.size.height}
            onChange={handleChange}
          />
        </label>
        <label>
          Weight:
          <input
            type="text"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Save</button>
        <button type="button" onClick={onClose}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default EditProductModal;
