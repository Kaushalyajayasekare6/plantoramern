import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { productAPI } from '../../services/api';
import { getImageUrl, handleImageError } from '../../utils/imageUtils';
import './admin.css'
export default function ProductAdmin(){
	const navigate = useNavigate();
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	
	// Fetch products from database
	useEffect(() => {
		fetchProducts();
	}, []);

	const fetchProducts = async () => {
		try {
			setLoading(true);
			const data = await productAPI.getAllProducts();
			setProducts(data);
			setError(null);
		} catch (err) {
			setError('Failed to fetch products: ' + err.message);
			console.error('Error fetching products:', err);
		} finally {
			setLoading(false);
		}
	};

	// Function to handle delete product
	const handleDeleteProduct = async (productId) => {
		if (window.confirm('Are you sure you want to delete this product?')) {
			try {
				await productAPI.deleteProduct(productId);
				// Refresh the products list
				fetchProducts();
				alert('Product deleted successfully!');
			} catch (err) {
				alert('Failed to delete product: ' + err.message);
				console.error('Error deleting product:', err);
			}
		}
	};

	// Function to handle update product
	const handleUpdateProduct = (product) => {
		// Navigate to update page with product data
		navigate('/admin/update-product', { 
			state: { productData: product } 
		});
	};

	if (loading) {
		return (
			<div className='dashboard'>
				<h1 className='dashboard-title'>Dashboard</h1>
				<div className='loading'>Loading products...</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className='dashboard'>
				<h1 className='dashboard-title'>Dashboard</h1>
				<div className='error'>Error: {error}</div>
				<button onClick={fetchProducts} className='retry-btn'>Retry</button>
			</div>
		);
	}

	return(
		<div className='dashboard'>
			<h1 className='dashboard-title'>Dashboard</h1>
			{products.length === 0 ? (
				<div className='no-products'>No products found. Add some products to get started!</div>
			) : (
				<table className='product-table'>
					<thead>
						<tr>
							<th>Product Image</th>
							<th>Product Name</th>
							<th>Price</th>
							<th>Category</th>
							<th>Status</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{products.map((product) => (
							<tr key={product._id}>
								<td>
									<img 
										src={getImageUrl(product.images && product.images[0])} 
										alt={product.name} 
										className='product-image'
										onError={handleImageError}
									/>
								</td>
								<td className='product-title'>{product.name}</td>
								<td className='price'>LKR {product.price}</td>
								<td className='category'>{product.category}</td>
								<td className='status'>
									<span className={`status-badge ${product.isAvailable ? 'available' : 'unavailable'}`}>
										{product.isAvailable ? 'Available' : 'Unavailable'}
									</span>
								</td>
								<td className='actions'>
									<button 
										className='action-btn update-btn'
										onClick={() => handleUpdateProduct(product)}
										title='Update Product'
									>
										✏️
									</button>
									<button 
										className='action-btn delete-btn'
										onClick={() => handleDeleteProduct(product._id)}
										title='Delete Product'
									>
										🗑️
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</div>
	)
}