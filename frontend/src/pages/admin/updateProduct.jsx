import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { productAPI } from '../../services/api';
import './admin.css'

export default function ProductUpdate(){
	const location = useLocation();
	const navigate = useNavigate();
	const productData = location.state?.productData;

	const [formData, setFormData] = useState({
		productId: '',
		name: '',
		description: '',
		price: '',
		category: '',
		isAvailable: true
	})
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	// Populate form with product data when component mounts
	useEffect(() => {
		if (productData) {
			setFormData({
				productId: productData.productId || '',
				name: productData.name || '',
				description: productData.description || '',
				price: productData.price || '',
				category: productData.category || '',
				isAvailable: productData.isAvailable !== undefined ? productData.isAvailable : true
			});
		}
	}, [productData]);

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target
		setFormData(prev => ({
			...prev,
			[name]: type === 'checkbox' ? checked : value
		}))
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		setLoading(true);
		setError(null);

		try {
			// Validate required fields
			if (!formData.productId || !formData.name || !formData.description || !formData.price || !formData.category) {
				throw new Error('Please fill in all required fields');
			}

			// Validate price
			const price = parseFloat(formData.price);
			if (isNaN(price) || price < 0) {
				throw new Error('Please enter a valid positive price');
			}

			// Create update data object
			const updateData = {
				name: formData.name.trim(),
				description: formData.description.trim(),
				price: price,
				category: formData.category.trim(),
				isAvailable: formData.isAvailable
			};

			console.log('Product data received:', productData);
			console.log('Updating product with ID:', productData.productId);
			console.log('Update data:', updateData);

			// Debug: Check if productId exists
			if (!productData.productId) {
				throw new Error('Product ID is missing from product data');
			}

			// Use the custom productId (not MongoDB _id) for the update
			await productAPI.updateProduct(productData.productId, updateData);
			alert('Product updated successfully!');
			
			// Navigate back to products list
			navigate('/admin/');
		} catch (err) {
			setError(err.message);
			console.error('Error updating product:', err);
		} finally {
			setLoading(false);
		}
	}

	const handleCancel = () => {
		navigate('/admin/');
	}

	if (!productData) {
		return (
			<div className='dashboard'>
				<h1 className='dashboard-title'>Update Product</h1>
				<div className='error-message' style={{
					backgroundColor: '#fee',
					border: '1px solid #fcc',
					color: '#c33',
					padding: '10px',
					marginBottom: '20px',
					borderRadius: '4px'
				}}>
					No product data found. Please go back and select a product to update.
				</div>
				<button onClick={handleCancel} className='cancel-btn'>Go Back</button>
			</div>
		);
	}

	return(
		<div className='dashboard'>
			<h1 className='dashboard-title'>Update Product</h1>
			{error && (
				<div className='error-message' style={{
					backgroundColor: '#fee',
					border: '1px solid #fcc',
					color: '#c33',
					padding: '10px',
					marginBottom: '20px',
					borderRadius: '4px'
				}}>
					{error}
				</div>
			)}
			<form className='add-product-form' onSubmit={handleSubmit}>
				<div className='form-group'>
					<label htmlFor='productId'>Product ID *</label>
					<input
						type='text'
						id='productId'
						name='productId'
						value={formData.productId}
						onChange={handleChange}
						className='form-input'
						required
						placeholder='Enter unique product ID'
						disabled={true} // Disable editing of productId during update
						style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
						title='Product ID cannot be changed during update'
					/>
					<small className='form-help'>Product ID cannot be changed after creation</small>
				</div>

				<div className='form-group'>
					<label htmlFor='name'>Product Name *</label>
					<input
						type='text'
						id='name'
						name='name'
						value={formData.name}
						onChange={handleChange}
						className='form-input'
						required
						placeholder='Enter product name'
						maxLength={100}
					/>
				</div>

				<div className='form-group'>
					<label htmlFor='description'>Product Description *</label>
					<textarea
						id='description'
						name='description'
						value={formData.description}
						onChange={handleChange}
						className='form-textarea'
						rows='4'
						required
						placeholder='Enter product description'
						maxLength={1000}
					></textarea>
				</div>

				<div className='form-group'>
					<label htmlFor='price'>Product Price (LKR) *</label>
					<input
						type='number'
						id='price'
						name='price'
						value={formData.price}
						onChange={handleChange}
						className='form-input'
						step='0.01'
						min='0'
						required
						placeholder='0.00'
					/>
				</div>

				<div className='form-group'>
					<label htmlFor='category'>Product Category *</label>
					<select
						id='category'
						name='category'
						value={formData.category}
						onChange={handleChange}
						className='form-select'
						required
					>
						<option value=''>Select a category</option>
						<option value='artificial-plants'>Artificial Plants</option>
						<option value='real-plants'>Real Plants</option>
						<option value='pots'>Pots</option>
						<option value='accessories'>Accessories</option>
						<option value='cosmetics'>Cosmetics</option>
					</select>
				</div>

				<div className='form-group'>
					<label className='checkbox-label'>
						<input
							type='checkbox'
							name='isAvailable'
							checked={formData.isAvailable}
							onChange={handleChange}
							className='form-checkbox'
						/>
						Product is available for sale
					</label>
				</div>

				<div className='form-actions'>
					<button 
						type='button' 
						className='cancel-btn' 
						onClick={handleCancel}
					>
						Cancel
					</button>
					<button 
						type='submit' 
						className='add-product-btn'
						disabled={loading}
					>
						{loading ? 'Updating Product...' : 'Update Product'}
					</button>
				</div>
			</form>
		</div>
	)
}