import React, { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import api, { getErrorMessage } from '../../api/client';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  const loadUsers = () => {
    setLoading(true);
    api.get('/admin/users')
      .then((res) => setUsers(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const toggleActive = async (id) => {
    try {
      await api.patch(`/admin/users/${id}/toggle-active`);
      loadUsers();
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  const filtered = users.filter((u) => roleFilter === 'ALL' || u.role === roleFilter);

  return (
    <AdminLayout title="User Accounts" subtitle="Manage families, companions, and account statuses.">
      <div className="flex flex-wrap gap-2 mb-6">
        {['ALL', 'FAMILY', 'COMPANION', 'ADMIN'].map((r) => (
          <button
            key={r}
            onClick={() => setRoleFilter(r)}
            className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
              roleFilter === r ? 'bg-forest-600 text-white' : 'bg-white border border-cream-300 text-forest-700'
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="h-64 rounded-3xl bg-white animate-pulse" />
      ) : (
        <div className="card-warm overflow-x-auto p-0">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-cream-200 bg-cream-50 text-xs uppercase text-forest-500">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">City</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-200">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-cream-50/50">
                  <td className="px-6 py-4 font-semibold text-forest-900">{u.fullName}</td>
                  <td className="px-6 py-4 text-forest-700">{u.email}</td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-mint-50 border border-mint-200 px-2.5 py-0.5 text-xs font-semibold text-forest-700">
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-forest-600">{u.city || '-'}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-semibold ${u.active ? 'text-forest-600' : 'text-red-600'}`}>
                      {u.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {u.role !== 'ADMIN' && (
                      <button
                        onClick={() => toggleActive(u.id)}
                        className="btn-outline px-3 py-1.5 text-xs"
                      >
                        {u.active ? 'Deactivate' : 'Activate'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
