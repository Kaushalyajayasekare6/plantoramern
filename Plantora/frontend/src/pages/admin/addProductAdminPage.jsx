import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { productAPI } from '../../services/api'
import './admin.css'

export default function ProductAdd(){
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		productId: '',
		name: '',
		description: '',
		price: '',
		category: '',
		isAvailable: true
	})
	const [selectedImages, setSelectedImages] = useState([]);
	const [imagePreview, setImagePreview] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target
		setFormData(prev => ({
			...prev,
			[name]: type === 'checkbox' ? checked : value
		}))
	}

	const handleImageChange = (e) => {
		const files = Array.from(e.target.files);
		
		// Validate file types
		const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
		const invalidFiles = files.filter(file => !validTypes.includes(file.type));
		
		if (invalidFiles.length > 0) {
			setError('Please select only image files (JPEG, PNG, GIF, WebP)');
			return;
		}

		// Validate file sizes (5MB limit)
		const oversizedFiles = files.filter(file => file.size > 5 * 1024 * 1024);
		if (oversizedFiles.length > 0) {
			setError('Each image must be less than 5MB');
			return;
		}

		// Limit to 5 images
		if (files.length > 5) {
			setError('You can upload a maximum of 5 images');
			return;
		}

		setSelectedImages(files);
		setError(null);

		// Create preview URLs
		const previewUrls = files.map(file => URL.createObjectURL(file));
		setImagePreview(previewUrls);
	}

	const removeImage = (index) => {
		const newImages = selectedImages.filter((_, i) => i !== index);
		const newPreviews = imagePreview.filter((_, i) => i !== index);
		
		// Revoke the URL to free memory
		URL.revokeObjectURL(imagePreview[index]);
		
		setSelectedImages(newImages);
		setImagePreview(newPreviews);
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

			// Validate productId format (no spaces, special characters)
			const productIdRegex = /^[a-zA-Z0-9_-]+$/;
			if (!productIdRegex.test(formData.productId)) {
				throw new Error('Product ID can only contain letters, numbers, hyphens, and underscores');
			}

			// Create FormData for file upload
			const productFormData = new FormData();
			
			// Append text fields - ensure they're strings
			productFormData.append('productId', formData.productId.toString().trim());
			productFormData.append('name', formData.name.toString().trim());
			productFormData.append('description', formData.description.toString().trim());
			productFormData.append('price', price.toString());
			productFormData.append('category', formData.category.toString().trim());
			productFormData.append('isAvailable', formData.isAvailable.toString());

			// Append image files
			selectedImages.forEach((image) => {
				productFormData.append('images', image);
			});

			console.log('Submitting product data:', {
				productId: formData.productId,
				name: formData.name,
				description: formData.description,
				price: price,
				category: formData.category,
				isAvailable: formData.isAvailable,
				imageCount: selectedImages.length
			});

			const result = await productAPI.createProduct(productFormData);
			console.log('Product creation result:', result);
			
			alert('Product added successfully!');
			
			// Clean up preview URLs
			imagePreview.forEach(url => URL.revokeObjectURL(url));
			
			// Reset form
			setFormData({
				productId: '',
				name: '',
				description: '',
				price: '',
				category: '',
				isAvailable: true
			});
			setSelectedImages([]);
			setImagePreview([]);

			// Navigate back to products list
			navigate('/admin/');
		} catch (err) {
			console.error('Error adding product:', err);
			setError(err.message);
		} finally {
			setLoading(false);
		}
	}

	return(
		<div className='dashboard'>
			<h1 className='dashboard-title'>Add Product</h1>
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
						placeholder='Enter unique product ID (letters, numbers, hyphens, underscores only)'
						pattern='[a-zA-Z0-9_-]+'
						title='Product ID can only contain letters, numbers, hyphens, and underscores'
					/>
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
						<option value='artificial'>Artificial Plants</option>
						<option value='real-plants'>Real Plants</option>
						<option value='pots'>Pots</option>
						<option value='accessories'>Accessories</option>
						<option value='cosmetics'>Cosmetics</option>
					</select>
				</div>

				<div className='form-group'>
					<label htmlFor='images'>Product Images (Optional)</label>
					<input
						type='file'
						id='images'
						name='images'
						multiple
						accept='image/*'
						onChange={handleImageChange}
						className='form-input'
					/>
					<small className='form-help'>
						Select up to 5 images. Each image must be less than 5MB. Supported formats: JPEG, PNG, GIF, WebP
					</small>
				</div>

				{imagePreview.length > 0 && (
					<div className='form-group'>
						<label>Image Preview</label>
						<div className='image-preview-container'>
							{imagePreview.map((url, index) => (
								<div key={index} className='image-preview-item'>
									<img 
										src={url} 
										alt={`Preview ${index + 1}`} 
										className='image-preview'
									/>
									<button
										type='button'
										className='remove-image-btn'
										onClick={() => removeImage(index)}
										title='Remove image'
									>
										×
									</button>
								</div>
							))}
						</div>
					</div>
				)}

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
						type='submit' 
						className='add-product-btn'
						disabled={loading}
					>
						{loading ? 'Adding Product...' : 'Add Product'}
					</button>
					<button 
						type='button' 
						className='cancel-btn'
						onClick={() => navigate('/admin/')}
					>
						Cancel
					</button>
				</div>
			</form>
		</div>
	)
}