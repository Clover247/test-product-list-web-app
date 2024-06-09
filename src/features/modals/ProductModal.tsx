import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import { addNewProduct } from "../products/productsSlice";
import Modal from "./Modal";
import styles from "./Modal.module.scss";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [productData, setProductData] = useState({
    name: "",
    imageUrl: "",
    count: undefined,
    width: undefined,
    height: undefined,
    weight: "",
  });

  useEffect(() => {
    if (!isOpen) {
      setProductData({
        name: "",
        imageUrl: "",
        count: undefined,
        width: undefined,
        height: undefined,
        weight: "",
      });
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({
      ...prevData,
      [name]:
        name === "count" || name === "width" || name === "height"
          ? value === ""
            ? undefined
            : parseInt(value)
          : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Перевіряємо чи є значення undefined і замінюємо на 0
    const sanitizedProductData = {
      ...productData,
      count: productData.count || 0,
      width: productData.width || 0,
      height: productData.height || 0,
    };

    dispatch(
      addNewProduct({
        ...sanitizedProductData,
        size: {
          width: sanitizedProductData.width,
          height: sanitizedProductData.height,
        },
        comments: [],
      })
    );

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.productCreateModal}>
        <h2 className={styles.title}>Add New Product</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={productData.name}
            onChange={handleChange}
            required
            className={styles.input}
          />
          <input
            type="text"
            name="imageUrl"
            placeholder="Image URL"
            value={productData.imageUrl}
            onChange={handleChange}
            required
            className={styles.input}
          />
          <input
            type="number"
            name="count"
            placeholder="Count"
            value={productData.count !== undefined ? productData.count : ""}
            onChange={handleChange}
            required
            className={styles.input}
            min="1"
          />
          <input
            type="number"
            name="width"
            placeholder="Width"
            value={productData.width !== undefined ? productData.width : ""}
            onChange={handleChange}
            required
            className={styles.input}
            min="1"
          />
          <input
            type="number"
            name="height"
            placeholder="Height"
            value={productData.height !== undefined ? productData.height : ""}
            onChange={handleChange}
            required
            className={styles.input}
            min="1"
          />
          <input
            type="text"
            name="weight"
            placeholder="Weight"
            value={productData.weight}
            onChange={handleChange}
            required
            className={styles.input}
          />
          <button type="submit" className={styles.button}>
            Add Product
          </button>
        </form>
      </div>
    </Modal>
  );
};

export default ProductModal;
