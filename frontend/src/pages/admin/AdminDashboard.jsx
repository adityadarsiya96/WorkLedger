import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Users,
  Settings,
  Activity,
  ShieldCheck,
  LogOut,
  UserPlus
} from 'lucide-react';
import axios from 'axios';

const AdminDashboard = () => {
  const { user, setUser } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const [hrForm, setHrForm] = useState({ name: '', email: '', password: '' });
  const [isCreatingHr, setIsCreatingHr] = useState(false);
  const [message, setMessage] = useState('');

  const [dashboardStats, setDashboardStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    systemUptime: '99.9%',
    securityAlerts: 0
  });

  useEffect(() => {
    if (activeTab === 'overview') {
      axios.get('http://localhost:3000/admin/dashboard-stats', { withCredentials: true })
        .then(res => {
          if (res.data.success) {
            setDashboardStats(res.data.stats);
          }
        })
        .catch(err => console.error("Error fetching admin stats:", err));
    }
  }, [activeTab]);

  const stats = [
    { label: 'Total Users', value: dashboardStats.totalUsers, icon: Users },
    { label: 'Active Employees', value: dashboardStats.activeUsers, icon: Activity },
    { label: 'System Uptime', value: dashboardStats.systemUptime, icon: Activity },
    { label: 'Security Alerts', value: dashboardStats.securityAlerts, icon: ShieldCheck },
  ];

  const handleLogout = async () => {
    try {
      await axios.get('http://localhost:3000/auth/logout', { withCredentials: true });
      setUser(null);
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const handleCreateHr = async (e) => {
    e.preventDefault();
    setIsCreatingHr(true);
    setMessage('');
    try {
      const res = await axios.post('http://localhost:3000/admin/hr', hrForm, { withCredentials: true });
      setMessage(res.data.message);
      setHrForm({ name: '', email: '', password: '' });
    } catch (err) {
      setMessage("Error: " + (err.response?.data?.message || err.message));
    } finally {
      setIsCreatingHr(false);
    }
  };

  const SidebarItem = ({ icon: Icon, label, id }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center space-x-3 px-4 py-3 text-left border-l-4 ${activeTab === id
          ? 'border-blue-400 bg-blue-800 text-white font-semibold'
          : 'border-transparent text-blue-100 hover:bg-blue-800 hover:text-white'
        }`}
    >
      <Icon size={20} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-blue-50 flex font-sans text-gray-900">

      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 flex flex-col shadow-lg">
        <div className="p-6 border-b border-blue-800">
          <h1 className="text-xl font-bold text-white tracking-tight">WorkLedger</h1>
          <p className="text-xs text-blue-300 uppercase font-bold tracking-wider mt-1">Admin Portal</p>
        </div>

        <nav className="flex-1 py-4 flex flex-col space-y-1">
          <SidebarItem id="overview" icon={Settings} label="System Overview" />
          <SidebarItem id="users" icon={Users} label="User Management" />
          <SidebarItem id="security" icon={ShieldCheck} label="Security Logs" />
          <SidebarItem id="settings" icon={Settings} label="Platform Settings" />
        </nav>

        <div className="p-4 border-t border-blue-800 bg-blue-900">
          <div className="mb-4">
            <p className="text-sm font-bold text-white">{user?.name || 'Super Admin'}</p>
            <p className="text-xs text-blue-300">{user?.email || 'admin@company.com'}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 text-sm text-blue-200 hover:text-white font-bold"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-300 h-16 flex items-center px-8 justify-between shadow-sm">
          <h2 className="text-xl font-bold text-blue-900 capitalize">
            {activeTab.replace('-', ' ')}
          </h2>
          <div className="text-sm text-gray-600 font-bold">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8 flex-1 overflow-auto">
          {activeTab === 'overview' && (
            <div className="space-y-8">

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className="bg-white p-6 border-t-4 border-blue-600 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide">{stat.label}</h3>
                        <Icon className="text-blue-600" size={24} />
                      </div>
                      <p className="text-3xl font-bold text-blue-900">{stat.value}</p>
                    </div>
                  );
                })}
              </div>

              {/* Quick Actions Panel */}
              <div className="bg-white border border-gray-300 shadow-sm">
                <div className="px-6 py-4 border-b border-gray-300 bg-gray-50">
                  <h3 className="text-lg font-bold text-blue-900">System Controls</h3>
                </div>
                <div className="p-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <button onClick={() => setActiveTab('users')} className="bg-gray-50 border border-gray-300 text-blue-900 py-4 px-4 hover:bg-gray-200 font-bold text-sm flex flex-col items-center justify-center space-y-3">
                    <UserPlus size={24} className="text-blue-600" />
                    <span>Manage HR Roles</span>
                  </button>
                  <button className="bg-gray-50 border border-gray-300 text-blue-900 py-4 px-4 hover:bg-gray-200 font-bold text-sm flex flex-col items-center justify-center space-y-3">
                    <Activity size={24} className="text-blue-600" />
                    <span>View Activity Logs</span>
                  </button>
                  <button className="bg-gray-50 border border-gray-300 text-blue-900 py-4 px-4 hover:bg-gray-200 font-bold text-sm flex flex-col items-center justify-center space-y-3">
                    <ShieldCheck size={24} className="text-blue-600" />
                    <span>Run Security Scan</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="bg-white border-t-4 border-blue-600 shadow-sm p-6 max-w-2xl">
                <h3 className="text-lg font-bold text-blue-900 mb-4 border-b pb-2">Create HR User</h3>
                {message && <div className={`mb-4 p-3 font-bold ${message.startsWith('Error') ? 'bg-red-50 text-red-800 border border-red-200' : 'bg-green-50 text-green-800 border border-green-200'}`}>{message}</div>}
                <form onSubmit={handleCreateHr} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Name</label>
                    <input
                      required type="text"
                      value={hrForm.name} onChange={e => setHrForm({ ...hrForm, name: e.target.value })}
                      className="w-full border border-gray-300 px-3 py-2 text-sm bg-gray-50 outline-none focus:border-blue-600"
                      placeholder="e.g. Jane Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                    <input
                      required type="email"
                      value={hrForm.email} onChange={e => setHrForm({ ...hrForm, email: e.target.value })}
                      className="w-full border border-gray-300 px-3 py-2 text-sm bg-gray-50 outline-none focus:border-blue-600"
                      placeholder="e.g. hr@company.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
                    <input
                      required type="password"
                      value={hrForm.password} onChange={e => setHrForm({ ...hrForm, password: e.target.value })}
                      className="w-full border border-gray-300 px-3 py-2 text-sm bg-gray-50 outline-none focus:border-blue-600"
                      placeholder="Secure password"
                    />
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit" disabled={isCreatingHr}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 disabled:opacity-50"
                    >
                      {isCreatingHr ? 'Creating...' : 'Create HR Account'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {activeTab !== 'overview' && activeTab !== 'users' && (
            <div className="bg-white p-12 border-t-4 border-blue-600 shadow-sm flex flex-col items-center justify-center min-h-[400px] text-gray-500">
              <Settings size={48} className="text-blue-200 mb-4" />
              <h3 className="text-xl font-bold text-blue-900 mb-2">Module Under Construction</h3>
              <p className="font-medium mt-2">The {activeTab} functionality is currently being implemented.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
