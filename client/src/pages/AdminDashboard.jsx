import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Users, ShieldCheck, Flame, Dumbbell, Key, Trash2, 
  Search, Copy, Check, AlertTriangle, X, RefreshCw, Lock, 
  UserCheck, Loader2 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeStreaks: 0,
    totalWorkouts: 0,
    totalAdmins: 0
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  // Modal states
  const [passwordModal, setPasswordModal] = useState({ open: false, user: null, newPassword: '', loading: false, error: '', success: '' });
  const [deleteModal, setDeleteModal] = useState({ open: false, user: null, loading: false, error: '' });
  const [actionNotice, setActionNotice] = useState(null);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes] = await Promise.all([
        axios.get('/api/admin/stats'),
        axios.get(`/api/admin/users${search ? `?search=${encodeURIComponent(search)}` : ''}`)
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [search]);

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!passwordModal.newPassword || passwordModal.newPassword.length < 6) {
      setPasswordModal(prev => ({ ...prev, error: 'Password must be at least 6 characters' }));
      return;
    }

    setPasswordModal(prev => ({ ...prev, loading: true, error: '', success: '' }));
    try {
      await axios.put(`/api/admin/users/${passwordModal.user._id}/password`, {
        newPassword: passwordModal.newPassword
      });
      setPasswordModal(prev => ({ 
        ...prev, 
        loading: false, 
        success: `Password updated successfully for ${passwordModal.user.email}!`,
        newPassword: ''
      }));
      setTimeout(() => {
        setPasswordModal({ open: false, user: null, newPassword: '', loading: false, error: '', success: '' });
      }, 1500);
    } catch (err) {
      setPasswordModal(prev => ({ 
        ...prev, 
        loading: false, 
        error: err.response?.data?.message || 'Failed to update password' 
      }));
    }
  };

  const handleDeleteUser = async () => {
    setDeleteModal(prev => ({ ...prev, loading: true, error: '' }));
    try {
      await axios.delete(`/api/admin/users/${deleteModal.user._id}`);
      setUsers(users.filter(u => u._id !== deleteModal.user._id));
      setDeleteModal({ open: false, user: null, loading: false, error: '' });
      setActionNotice(`User ${deleteModal.user.name} was successfully removed.`);
      setTimeout(() => setActionNotice(null), 4000);
      fetchAdminData();
    } catch (err) {
      setDeleteModal(prev => ({ 
        ...prev, 
        loading: false, 
        error: err.response?.data?.message || 'Failed to delete user' 
      }));
    }
  };

  const handleToggleRole = async (targetUser) => {
    const newRole = targetUser.role === 'admin' ? 'user' : 'admin';
    try {
      await axios.put(`/api/admin/users/${targetUser._id}/role`, { role: newRole });
      setUsers(users.map(u => u._id === targetUser._id ? { ...u, role: newRole } : u));
      setActionNotice(`Updated ${targetUser.name}'s role to ${newRole.toUpperCase()}.`);
      setTimeout(() => setActionNotice(null), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to change role');
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-purple-400 via-primary to-secondary bg-clip-text text-transparent flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-primary" />
            ADMIN COMMAND CENTER
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Global management portal: monitor athlete streaks, oversee user credentials, and control access permissions.
          </p>
        </div>

        <Button 
          onClick={fetchAdminData} 
          variant="outline" 
          size="sm"
          className="w-fit border-gray-700 text-gray-300 hover:text-white"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh Stats
        </Button>
      </div>

      {actionNotice && (
        <div className="p-4 rounded-xl bg-purple-950/60 border border-purple-500/50 text-purple-200 text-sm flex items-center justify-between shadow-lg">
          <span>{actionNotice}</span>
          <button onClick={() => setActionNotice(null)} className="text-gray-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gray-900/90 border-gray-800 shadow-lg">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Total Athletes</p>
              <h3 className="text-3xl font-bold text-white mt-1">{stats.totalUsers}</h3>
              <p className="text-xs text-gray-500 mt-1">Registered members</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
              <Users className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/90 border-gray-800 shadow-lg">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Active Streaks</p>
              <h3 className="text-3xl font-bold text-amber-400 mt-1">{stats.activeStreaks}</h3>
              <p className="text-xs text-gray-500 mt-1">Athletes training consistently</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
              <Flame className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/90 border-gray-800 shadow-lg">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Total Workouts</p>
              <h3 className="text-3xl font-bold text-emerald-400 mt-1">{stats.totalWorkouts}</h3>
              <p className="text-xs text-gray-500 mt-1">Logged sessions across app</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Dumbbell className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/90 border-gray-800 shadow-lg">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Administrators</p>
              <h3 className="text-3xl font-bold text-purple-400 mt-1">{stats.totalAdmins}</h3>
              <p className="text-xs text-gray-500 mt-1">Superuser privileges</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Management Section */}
      <Card className="bg-gray-900/90 border-gray-800 shadow-xl overflow-hidden">
        <CardHeader className="border-b border-gray-800/80 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Athlete & Credential Directory
            </CardTitle>
            <CardDescription className="text-gray-400">
              Live user database: inspect streaks, manage credentials, and delete inactive or violating accounts.
            </CardDescription>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-black/60 border-gray-700 text-sm focus:border-primary"
            />
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <Loader2 className="w-10 h-10 animate-spin text-primary mb-3" />
              <p className="text-sm">Loading athlete directory...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-base font-semibold text-gray-400">No users found</p>
              <p className="text-xs mt-1">Try clearing your search query.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-300">
                <thead className="bg-black/60 text-xs uppercase tracking-wider text-gray-400 border-b border-gray-800 font-semibold">
                  <tr>
                    <th className="px-6 py-4">User ID</th>
                    <th className="px-6 py-4">Athlete</th>
                    <th className="px-6 py-4">Streak</th>
                    <th className="px-6 py-4">Workouts</th>
                    <th className="px-6 py-4">Level</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Joined</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60 font-medium">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-white/[0.02] transition-colors">
                      {/* User ID with Copy */}
                      <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-gray-400">
                        <button
                          onClick={() => copyToClipboard(u._id, u._id)}
                          className="flex items-center gap-1.5 hover:text-white bg-black/40 px-2 py-1 rounded border border-gray-800 transition"
                          title="Click to copy User ID"
                        >
                          <span>{u._id.substring(0, 8)}...</span>
                          {copiedId === u._id ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3 text-gray-500" />
                          )}
                        </button>
                      </td>

                      {/* Name & Email */}
                      <td className="px-6 py-4">
                        <div className="font-bold text-white">{u.name}</div>
                        <div className="text-xs text-gray-400">{u.email}</div>
                      </td>

                      {/* Streak */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
                          <Flame className="w-3.5 h-3.5 text-amber-400 fill-current" />
                          <span>{u.currentStreak || 0} days</span>
                        </div>
                      </td>

                      {/* Workouts */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-gray-200 font-semibold">{u.totalWorkouts || 0}</span>
                      </td>

                      {/* Fitness Level */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-xs text-gray-400 capitalize">{u.fitnessLevel || 'Beginner'}</span>
                      </td>

                      {/* Role Badge */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          u.role === 'admin'
                            ? 'bg-purple-900/40 text-purple-300 border border-purple-500/40'
                            : 'bg-gray-800 text-gray-400 border border-gray-700'
                        }`}>
                          {u.role === 'admin' && <ShieldCheck className="w-3 h-3" />}
                          {u.role === 'admin' ? 'ADMIN' : 'ATHLETE'}
                        </span>
                      </td>

                      {/* Joined Date */}
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-400">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                      </td>

                      {/* Action Buttons */}
                      <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                        {/* Reset Password */}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setPasswordModal({ open: true, user: u, newPassword: '', loading: false, error: '', success: '' })}
                          className="h-8 px-2.5 text-xs border-gray-700 text-amber-400 hover:bg-amber-900/20 hover:text-amber-300"
                          title="Reset User Password"
                        >
                          <Key className="w-3.5 h-3.5 mr-1" />
                          Pass
                        </Button>

                        {/* Toggle Role */}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleRole(u)}
                          className={`h-8 px-2.5 text-xs border-gray-700 ${
                            u.role === 'admin' 
                              ? 'text-purple-400 hover:bg-purple-900/20' 
                              : 'text-gray-400 hover:text-white'
                          }`}
                          title={u.role === 'admin' ? 'Demote to regular athlete' : 'Promote to admin'}
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                        </Button>

                        {/* Delete User */}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setDeleteModal({ open: true, user: u, loading: false, error: '' })}
                          className="h-8 px-2.5 text-xs border-gray-700 text-red-400 hover:bg-red-950/40 hover:text-red-300 hover:border-red-600/50"
                          title="Delete User Account"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Password Reset Modal */}
      {passwordModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <Card className="w-full max-w-md bg-gray-950 border-gray-800 shadow-2xl">
            <CardHeader className="border-b border-gray-800 pb-4 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                  <Lock className="w-5 h-5 text-amber-400" />
                  Reset Athlete Password
                </CardTitle>
                <CardDescription className="text-xs text-gray-400 mt-1">
                  Target: {passwordModal.user?.name} ({passwordModal.user?.email})
                </CardDescription>
              </div>
              <button 
                onClick={() => setPasswordModal({ open: false, user: null, newPassword: '', loading: false, error: '', success: '' })}
                className="text-gray-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleResetPassword} className="space-y-4">
                {passwordModal.error && (
                  <div className="p-3 rounded-lg bg-red-950/60 border border-red-500/40 text-red-300 text-xs">
                    {passwordModal.error}
                  </div>
                )}
                {passwordModal.success && (
                  <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
                    {passwordModal.success}
                  </div>
                )}

                <div>
                  <label className="text-xs text-gray-300 font-semibold block mb-1.5">
                    New Password (minimum 6 characters)
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter new strong password..."
                    value={passwordModal.newPassword}
                    onChange={(e) => setPasswordModal(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="bg-black/80 border-gray-700 text-white font-mono text-sm"
                    required
                  />
                  <p className="text-[11px] text-gray-500 mt-1.5">
                    This password will be immediately hashed with bcrypt and updated in MongoDB.
                  </p>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setPasswordModal({ open: false, user: null, newPassword: '', loading: false, error: '', success: '' })}
                    className="text-gray-400 hover:text-white"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={passwordModal.loading}
                    className="bg-amber-600 hover:bg-amber-500 text-black font-bold"
                  >
                    {passwordModal.loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Update Password
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Delete User Confirmation Modal */}
      {deleteModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <Card className="w-full max-w-md bg-gray-950 border-red-900/60 shadow-2xl">
            <CardHeader className="border-b border-gray-800 pb-4 flex flex-row items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-950/80 border border-red-500/40 flex items-center justify-center text-red-400">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold text-white">
                  Confirm Account Removal
                </CardTitle>
                <CardDescription className="text-xs text-red-400 mt-0.5">
                  This action is permanent and cannot be undone.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              {deleteModal.error && (
                <div className="p-3 rounded-lg bg-red-950/60 border border-red-500/40 text-red-300 text-xs">
                  {deleteModal.error}
                </div>
              )}

              <p className="text-sm text-gray-300 leading-relaxed">
                Are you sure you want to permanently delete athlete{' '}
                <span className="font-bold text-white">{deleteModal.user?.name}</span> (
                <span className="font-mono text-xs text-purple-300">{deleteModal.user?.email}</span>
                )? All associated streaks, workouts, and training logs will be cleared.
              </p>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setDeleteModal({ open: false, user: null, loading: false, error: '' })}
                  className="text-gray-400 hover:text-white"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDeleteUser}
                  disabled={deleteModal.loading}
                  className="bg-red-600 hover:bg-red-500 text-white font-bold"
                >
                  {deleteModal.loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
