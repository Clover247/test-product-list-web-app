import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import styles from './ProductsView.module.scss';
import EditProductModal from "../../modals/EditProductModal";

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

const ProductView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newComment, setNewComment] = useState<string>("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/products/${id}`);
        setProduct(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch product');
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleUpdateProduct = async (updatedProduct: Product) => {
    setProduct(updatedProduct);
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!product) return;

    try {
      const updatedComments = product.comments.filter(comment => comment.id !== commentId);
      const updatedProduct = { ...product, comments: updatedComments };
      await axios.put(`http://localhost:5000/products/${product.id}`, updatedProduct);
      setProduct(updatedProduct);
    } catch (err) {
      console.error('Failed to delete comment', err);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !product) return;

    try {
      const newCommentObj: ProductComment = {
        id: Math.random().toString(36).substr(2, 9),
        description: newComment,
        date: new Date().toISOString(),
      };
      const updatedProduct = {
        ...product,
        comments: [...product.comments, newCommentObj],
      };
      await axios.put(`http://localhost:5000/products/${product.id}`, updatedProduct);
      setProduct(updatedProduct);
      setNewComment("");
    } catch (err) {
      console.error('Failed to add comment', err);
    }
  };

  const handleEditComment = async (commentId: string, newDescription: string) => {
    if (!product) return;

    try {
      const updatedComments = product.comments.map(comment =>
        comment.id === commentId ? { ...comment, description: newDescription, date: new Date().toISOString() } : comment
      );
      const updatedProduct = { ...product, comments: updatedComments };
      await axios.put(`http://localhost:5000/products/${product.id}`, updatedProduct);
      setProduct(updatedProduct);
    } catch (err) {
      console.error('Failed to edit comment', err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!product) return <p>Product not found</p>;

  return (
    <div className={styles.productContainer}>
      <button onClick={() => navigate(-1)} className={styles.backButton}>Back</button>
      <div className={styles.productDetails}>
        <div className={styles.imageContainer}>
          <img src={product.imageUrl} alt={product.name} />
        </div>
        <div className={styles.productInfo}>
          <h1 className={styles.productName}>{product.name}</h1>
          <p>Count: {product.count}</p>
          <p>Weight: {product.weight}</p>
          <p>Size: {product.size.width} x {product.size.height}</p>
          <button onClick={() => setIsEditModalOpen(true)} className={styles.editButton}>Edit Product</button>
        </div>
      </div>
      <div className={styles.commentsSection}>
        <h2>Comments</h2>
        <ul className={styles.commentsList}>
          {product.comments.map((comment) => (
            <li key={comment.id} className={styles.comment}>
              <input
                type="text"
                value={comment.description}
                onChange={(e) => handleEditComment(comment.id, e.target.value)}
                className={styles.commentInput}
              />
              <button onClick={() => handleDeleteComment(comment.id)} className={styles.deleteButton}>Delete</button>
            </li>
          ))}
        </ul>
        <div className={styles.addComment}>
          <textarea
            placeholder="Add a comment"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className={styles.commentTextarea}
          ></textarea>
          <button onClick={handleAddComment} className={styles.submitButton}>Submit</button>
        </div>
      </div>
      <EditProductModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        product={product}
        onUpdateProduct={handleUpdateProduct}
      />
    </div>
  );
};

export default ProductView;
