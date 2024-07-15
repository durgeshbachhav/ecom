// ChangeUserRole.jsx
import { changeUserRole } from '@/store/slices/UserSlice';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AdminLayout from './AdminLayout';


const ChangeUserRole = () => {
     const [email, setEmail] = useState('');
     const [newRole, setNewRole] = useState('');
     const dispatch = useDispatch();
     const { status, error } = useSelector(state => state.user);

     const handleSubmit = (e) => {
          e.preventDefault();
          dispatch(changeUserRole({ email, newRole }));
     };

     return (
          <AdminLayout>
               <h2>Change User Role</h2>
               <form onSubmit={handleSubmit}>
                    <input
                         type="email"
                         value={email}
                         onChange={(e) => setEmail(e.target.value)}
                         placeholder="User Email"
                         required
                    />
                    <select
                         value={newRole}
                         onChange={(e) => setNewRole(e.target.value)}
                         required
                    >
                         <option value="">Select Role</option>
                         <option value="user">User</option>
                         <option value="admin">Admin</option>
                         <option value="super_admin">Super Admin</option>
                    </select>
                    <button type="submit" disabled={status === 'loading'}>
                         Change Role
                    </button>
               </form>
               {status === 'loading' && <p>Loading...</p>}
               {status === 'failed' && <p>Error: {error}</p>}
               {status === 'succeeded' && <p>Role updated successfully!</p>}
          </AdminLayout>
     );
};

export default ChangeUserRole;