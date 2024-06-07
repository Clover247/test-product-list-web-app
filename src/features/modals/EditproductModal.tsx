import React, { useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { fetchProducts } from "../products/productsSlice";
import { AppDispatch } from "../../app/store";
import Modal from "./Modal";
import styles from "./Modal.module.scss";

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
  product: Product;
  onUpdateProduct: (product: Product) => void;
}

const EditProductModal: React.FC<EditProductModalProps> = ({
  isOpen,
  onClose,
  product,
  onUpdateProduct,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState<Product>({ ...product });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    if (name.includes('size.')) {
      const sizeKey = name.split('.')[1] as 'width' | 'height';
      setFormData((prevData) => ({
        ...prevData,
        size: {
          ...prevData.size,
          [sizeKey]: parseInt(value),
        },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: name === 'count' ? parseInt(value) : value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:5000/products/${formData.id}`,
        formData
      );
      onUpdateProduct(response.data);
      dispatch(fetchProducts());
      onClose();
    } catch (error) {
      console.error("Failed to update product", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.productCreateModal}>
        <h2 className={styles.title}>Edit Product</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className={styles.input}
          />
          <input
            type="text"
            name="imageUrl"
            placeholder="Image URL"
            value={formData.imageUrl}
            onChange={handleInputChange}
            required
            className={styles.input}
          />
          <input
            type="number"
            name="count"
            placeholder="Count"
            value={formData.count !== undefined ? formData.count : ""}
            onChange={handleInputChange}
            required
            className={styles.input}
            min="1"
          />
          <input
            type="number"
            name="size.width"
            placeholder="Width"
            value={formData.size.width !== undefined ? formData.size.width : ""}
            onChange={handleInputChange}
            required
            className={styles.input}
            min="1"
          />
          <input
            type="number"
            name="size.height"
            placeholder="Height"
            value={formData.size.height !== undefined ? formData.size.height : ""}
            onChange={handleInputChange}
            required
            className={styles.input}
            min="1"
          />
          <input
            type="text"
            name="weight"
            placeholder="Weight"
            value={formData.weight}
            onChange={handleInputChange}
            required
            className={styles.input}
          />
          <div className={styles.buttonContainer}>
            <button type="submit" className={styles.button}>Save Changes</button>
            <button type="button" onClick={onClose} className={`${styles.button} ${styles.cancelButton}`}>Cancel</button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default EditProductModal;
