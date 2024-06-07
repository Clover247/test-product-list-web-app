import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../../../app/store";
import { deleteProduct, fetchProducts } from "../productsSlice";
import ProductModal from "../../modals/ProductModal";
import ConfirmModal from "../../modals/ConfirmModal";
import EditProductModal from "../../modals/EditProductModal";
import styles from "./ProductsList.module.scss";

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

const ProductsList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading, error } = useSelector(
    (state: RootState) => state.products
  );
  const navigate = useNavigate();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [productIdToRemove, setProductIdToRemove] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [sortOption, setSortOption] = useState<string>("alphabetical");

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleRemoveProduct = (id: string) => {
    setProductIdToRemove(id);
    setIsConfirmModalOpen(true);
  };

  const confirmRemoveProduct = () => {
    if (productIdToRemove !== null) {
      dispatch(deleteProduct(productIdToRemove));
    }
    setIsConfirmModalOpen(false);
    setProductIdToRemove(null);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value);
  };

  const handleCardClick = (id: string) => {
    navigate(`/products/${id}`);
  };

  const handleButtonClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    callback: () => void
  ) => {
    e.stopPropagation();
    callback();
  };

  const handleEditProduct = (product: Product) => {
    setProductToEdit(product);
    setIsEditModalOpen(true);
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    dispatch(fetchProducts());
  };

  const sortedProducts = [...products].sort((a, b) => {
    if (sortOption === "alphabetical") {
      return a.name.localeCompare(b.name);
    } else if (sortOption === "count") {
      return b.count - a.count;
    }
    return 0;
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className={styles.productContainer}>
      <h1 className={styles.header}>Products List</h1>
      <div className={styles.headerActions}>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className={styles.header}
        >
          Add Product
        </button>
        <select value={sortOption} onChange={handleSortChange}>
          <option value="alphabetical">Sort by Alphabet</option>
          <option value="count">Sort by Count</option>
        </select>
      </div>
      <div className={styles.productsList}>
        {sortedProducts.map((product) => (
          <div
            key={product.id}
            className={styles.productCard}
            onClick={() => handleCardClick(product.id)}
          >
            <img src={product.imageUrl} alt={product.name} />
            <div className={styles.productDetails}>
              <h2>{product.name}</h2>
              <p>Count: {product.count}</p>
              <p>Weight: {product.weight}</p>
              <p>Height: {product.size.height}</p>
              <p>Width: {product.size.width}</p>
            </div>
            <div className={styles.actions}>
              <button
                className={`${styles.edit}`}
                onClick={(e) =>
                  handleButtonClick(e, () => handleEditProduct(product))
                }
              >
                Edit
              </button>
              <button
                className={`${styles.delete}`}
                onClick={(e) =>
                  handleButtonClick(e, () => handleRemoveProduct(product.id))
                }
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      <ProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={confirmRemoveProduct}
        message="Are you sure you want to delete this product?"
      />
      {productToEdit && (
        <EditProductModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          product={productToEdit}
          onUpdateProduct={handleUpdateProduct}
        />
      )}
    </div>
  );
};

export default ProductsList;
