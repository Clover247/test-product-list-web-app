import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import { addNewProduct } from "../products/productsSlice";
import Modal from "../Modal";


interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [productData, setProductData] = useState({
    name: "",
    imageUrl: "",
    count: 0,
    width: 0,
    height: 0,
    weight: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(addNewProduct({
      ...productData,
      size: { width: productData.width, height: productData.height },
      comments: []
    }));
    setProductData({
      name: "",
      imageUrl: "",
      count: 0,
      width: 0,
      height: 0,
      weight: "",
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2>Add New Product</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={productData.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="imageUrl"
          placeholder="Image URL"
          value={productData.imageUrl}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="count"
          placeholder="Count"
          value={productData.count}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="width"
          placeholder="Width"
          value={productData.width}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="height"
          placeholder="Height"
          value={productData.height}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="weight"
          placeholder="Weight"
          value={productData.weight}
          onChange={handleChange}
          required
        />
        <button type="submit">Add Product</button>
      </form>
    </Modal>
  );
};

export default ProductModal;
