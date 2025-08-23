import React from 'react'
import { Link, Routes, Route } from 'react-router-dom'
import ProductAdmin from './admin/productsAdminPage'
import ProductAdd from './admin/addProductAdminPage'
import ProductUpdate from './admin/updateProduct'
import UserAdmin from './admin/userAdmin'

export default function AdminPage(){
	return(
		<div className='admin'>
			<div className='sidebar'>
				<h1 className='admin-title'>Admin Panel</h1>
				<nav className='nav-links'>
					<Link to="/admin/" className='nav-link'>Dashboard</Link>
					<Link to="/admin/products" className='nav-link'>Products</Link>
					<Link to="/admin/users" className='nav-link'>Users</Link>
				</nav>
			</div>
			<div className='main-content'>
				<Routes>
					<Route path="/" element={<ProductAdmin />} />
					<Route path="/products" element={<ProductAdd />} />
					<Route path="/users" element={<UserAdmin/>} />
					<Route path="/update-product" element={<ProductUpdate/>} />
				</Routes>
			</div>
		</div>
	)
}