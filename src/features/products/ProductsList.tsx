import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchProducts, deleteProduct } from "./productsSlice";
import { AppDispatch, RootState } from "../../app/store";
import ProductModal from "../modals/ProductModal";
import ConfirmModal from "../modals/ConfirmModal";

const ProductsList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading, error } = useSelector(
    (state: RootState) => state.products
  );

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [productIdToRemove, setProductIdToRemove] = useState<number | null>(null);
  const [sortOption, setSortOption] = useState<string>("alphabetical");

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleRemoveProduct = (id: number) => {
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

  const sortedProducts = [...products].sort((a, b) => {
    if (sortOption === "alphabetical") {
      return a.name.localeCompare(b.name);
    } else if (sortOption === "count") {
      return a.count - b.count;
    }
    return 0;
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Products List</h1>
      <button onClick={() => setIsAddModalOpen(true)}>Add Product</button>
      <select value={sortOption} onChange={handleSortChange}>
        <option value="alphabetical">Sort by Alphabet</option>
        <option value="count">Sort by Count</option>
      </select>
      <ul>
        {sortedProducts.map((product) => (
          <li key={product.id}>
            <Link to={`/products/${product.id}`}>
              {product.name} - {product.count}
            </Link>
            <button onClick={() => handleRemoveProduct(product.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <ProductModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={confirmRemoveProduct}
        message="Are you sure you want to delete this product?"
      />
    </div>
  );
};

export default ProductsList;
