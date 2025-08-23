import React, { useState, useEffect } from 'react'
import { userAPI } from "../../services/api";
import './admin.css'
export default function UserAdmin(){
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	
	// Fetch users from database
	useEffect(() => {
		fetchUsers();
	}, []);

	const fetchUsers = async () => {
		try {
			setLoading(true);
			const data = await userAPI.getAllUsers();
			setUsers(data);
			setError(null);
		} catch (err) {
			setError('Failed to fetch users: ' + err.message);
			console.error('Error fetching users:', err);
		} finally {
			setLoading(false);
		}
	};

	// Function to handle delete user
	const handleDeleteUser = async (userId) => {
		if (window.confirm('Are you sure you want to delete this user?')) {
			try {
				await userAPI.deleteUser(userId);
				// Refresh the users list
				fetchUsers();
				alert('User deleted successfully!');
			} catch (err) {
				alert('Failed to delete user: ' + err.message);
				console.error('Error deleting user:', err);
			}
		}
	};

	// Function to handle role change
	const handleRoleChange = async (userId, newRole) => {
		try {
			await userAPI.updateUserRole(userId, { role: newRole });
			// Refresh the users list
			fetchUsers();
			alert('User role updated successfully!');
		} catch (err) {
			alert('Failed to update user role: ' + err.message);
			console.error('Error updating user role:', err);
		}
	};

	if (loading) {
		return (
			<div className='dashboard'>
				<h1 className='dashboard-title'>Users</h1>
				<div className='loading'>Loading users...</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className='dashboard'>
				<h1 className='dashboard-title'>Users</h1>
				<div className='error'>Error: {error}</div>
				<button onClick={fetchUsers} className='retry-btn'>Retry</button>
			</div>
		);
	}

	return(
		<div className='dashboard'>
			<h1 className='dashboard-title'>Users</h1>
			{users.length === 0 ? (
				<div className='no-users'>No users found.</div>
			) : (
				<table className='product-table'>
					<thead>
						<tr>
							<th>Name</th>
							<th>Email</th>
							<th>Phone</th>
							<th>Role</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{users.map((user) => (
							<tr key={user._id}>
								<td className='username'>{`${user.firstName} ${user.lastName}`}</td>
								<td className='email'>{user.email}</td>
								<td className='phone'>{user.phone}</td>
								<td className='role'>
									<select 
										value={user.role} 
										onChange={(e) => handleRoleChange(user._id, e.target.value)}
										className='role-select'
									>
										<option value="user">User</option>
										<option value="admin">Admin</option>
									</select>
								</td>
								<td className='actions'>
									<button 
										className='action-btn delete-btn'
										onClick={() => handleDeleteUser(user._id)}
										title='Delete User'
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