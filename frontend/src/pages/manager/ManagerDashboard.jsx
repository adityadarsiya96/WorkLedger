import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Users, 
  Settings, 
  Calendar,
  LogOut,
  Activity,
  Briefcase
} from 'lucide-react';
import axios from 'axios';

const ManagerDashboard = () => {
  const { user, setUser } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const [team, setTeam] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const baseUrl = import.meta.env.VITE_API_URL;
  
  const fetchDashboardData = async () => {
    try {
      const pRes = await axios.get(`${baseUrl}/manager/view-team`, { withCredentials: true });
      if (pRes.data.success) setTeam(pRes.data.data || []);

      const lRes = await axios.get(`${baseUrl}/manager/team-leaves`, { withCredentials: true });
      if (lRes.data.success) setLeaves(lRes.data.data || []);
    } catch (err) {
      console.error("Failed to load dashboard data", err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [activeTab]);

  const handleLogout = async () => {
    try {
      await axios.get(`${baseUrl}/auth/logout`, { withCredentials: true });
      setUser(null);
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const handleLeaveAction = async (leaveId, status) => {
    if(!confirm(`Are you sure you want to ${status.toLowerCase()} this request?`)) return;
    try {
      await axios.post(`${baseUrl}/manager/approve-leave`, { leaveId, status }, { withCredentials: true });
      fetchDashboardData();
    } catch (err) {
        alert("Error updating leave: "  + (err.response?.data?.message || err.message));
    }
  };

  const SidebarItem = ({ icon: Icon, label, id }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center space-x-3 px-4 py-3 text-left border-l-4 ${
        activeTab === id 
        ? 'border-indigo-800 bg-indigo-50 text-indigo-900 font-semibold' 
        : 'border-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      }`}
    >
      <Icon size={20} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans text-gray-900">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-300 flex flex-col">
        <div className="p-6 border-b border-gray-300">
          <h1 className="text-xl font-bold text-gray-800 tracking-tight">WorkLedger</h1>
          <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider mt-1">Manager Portal</p>
        </div>
        
        <nav className="flex-1 py-4 flex flex-col space-y-1">
          <SidebarItem id="overview" icon={Settings} label="Dashboard" />
          <SidebarItem id="team" icon={Users} label="My Team" />
          <SidebarItem id="leaves" icon={Calendar} label="Leave Requests" />
        </nav>

        <div className="p-4 border-t border-gray-300 bg-gray-50">
          <div className="mb-4">
            <p className="text-sm font-semibold text-gray-800">{user?.name || 'Manager'}</p>
            <p className="text-xs text-gray-500">{user?.email || 'manager@company.com'}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-2 text-sm text-red-700 hover:text-red-900 font-medium"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-300 h-16 flex items-center px-8 justify-between flex-shrink-0">
          <h2 className="text-xl font-semibold text-gray-800 capitalize">
            {activeTab.replace('-', ' ')}
          </h2>
          <div className="text-sm text-gray-600 font-medium">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8 flex-1 overflow-auto bg-gray-50">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-white p-6 border border-gray-300 shadow-sm flex justify-between items-center">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Total Subordinates</h3>
                        <p className="text-3xl font-bold text-gray-800 mt-2">{team.length}</p>
                      </div>
                      <Users className="text-indigo-200" size={48} />
                  </div>
                  <div className="bg-white p-6 border border-gray-300 shadow-sm flex justify-between items-center">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Pending Leaves</h3>
                        <p className="text-3xl font-bold text-orange-600 mt-2">{leaves.filter(l => l.status === 'Pending').length}</p>
                      </div>
                      <Calendar className="text-orange-200" size={48} />
                  </div>
                  <div className="bg-white p-6 border border-gray-300 shadow-sm flex justify-between items-center">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Active Leave History</h3>
                        <p className="text-3xl font-bold text-emerald-600 mt-2">{leaves.length}</p>
                      </div>
                      <Activity className="text-emerald-200" size={48} />
                  </div>
              </div>

              {/* Quick Actions Panel */}
              <div className="bg-white border border-gray-300 shadow-sm">
                <div className="px-6 py-4 border-b border-gray-300 bg-gray-50">
                  <h3 className="text-lg font-semibold text-gray-800">Quick Actions</h3>
                </div>
                <div className="p-6 grid grid-cols-2 lg:grid-cols-2 gap-4">
                  <button onClick={() => setActiveTab('team')} className="bg-gray-50 border border-gray-300 text-gray-800 py-4 px-4 hover:bg-gray-100 font-medium text-sm flex flex-col items-center justify-center space-y-3">
                    <Users size={24} className="text-indigo-800" />
                    <span>Review Team Map</span>
                  </button>
                  <button onClick={() => setActiveTab('leaves')} className="bg-gray-50 border border-gray-300 text-gray-800 py-4 px-4 hover:bg-gray-100 font-medium text-sm flex flex-col items-center justify-center space-y-3 relative">
                    <Calendar size={24} className="text-indigo-800" />
                    <span>Resolve Leaves</span>
                    {leaves.filter(l => l.status === 'Pending').length > 0 && (
                        <span className="absolute top-2 right-2 bg-red-500 text-white w-5 h-5 flex items-center justify-center rounded-full text-xs">
                          {leaves.filter(l => l.status === 'Pending').length}
                        </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'team' && (
            <div className="bg-white border border-gray-300 shadow-sm">
              <div className="px-6 py-4 border-b border-gray-300 bg-gray-50 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">My Subordinated Team</h3>
              </div>
              <div className="p-0">
                <table className="w-full text-left text-sm text-gray-600">
                  <thead className="bg-gray-100 text-gray-700 uppercase font-semibold border-b border-gray-300">
                    <tr>
                      <th className="px-6 py-3">Team Member</th>
                      <th className="px-6 py-3">Employee Code</th>
                      <th className="px-6 py-3">Department</th>
                      <th className="px-6 py-3">Designation</th>
                      <th className="px-6 py-3">System Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {team.length === 0 ? (
                      <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">You currently have no assigned subordinates.</td></tr>
                    ) : team.map(emp => (
                      <tr key={emp._id}>
                        <td className="px-6 py-4 font-medium text-gray-800 flex items-center gap-2">
                           <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs uppercase">
                             {emp.userId?.name ? emp.userId.name.substring(0, 2) : 'TM'}
                           </div>
                           <div>
                             <p>{emp.userId?.name}</p>
                             <p className="text-xs text-gray-400 font-normal">{emp.userId?.email}</p>
                           </div>
                        </td>
                        <td className="px-6 py-4"><Briefcase size={14} className="inline mr-1 text-gray-400"/> {emp.employeecode}</td>
                        <td className="px-6 py-4">{emp.department}</td>
                        <td className="px-6 py-4 font-medium">{emp.designation}</td>
                        <td className="px-6 py-4">
                           {emp.userId?.status !== 'ACTIVE' ? (
                             <span className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-semibold">Active Profile</span>
                           ) : (
                             <span className="px-2 py-1 bg-red-50 text-red-700 rounded text-xs font-semibold">Offline</span>
                           )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'leaves' && (
            <div className="bg-white border border-gray-300 shadow-sm flex flex-col h-full">
              <div className="px-6 py-4 border-b border-gray-300 bg-gray-50 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">Team Leave Requests</h3>
              </div>
              <div className="p-0 flex-1 overflow-auto">
                <table className="w-full text-left text-sm text-gray-600">
                  <thead className="bg-gray-100 text-gray-700 uppercase font-semibold border-b border-gray-300">
                    <tr>
                      <th className="px-6 py-3">Employee</th>
                      <th className="px-6 py-3">Leave Type</th>
                      <th className="px-6 py-3">Dates</th>
                      <th className="px-6 py-3">Reason</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3 text-right">Manager Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {leaves.length === 0 ? (
                      <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-500">No leave requests from your subordinates.</td></tr>
                    ) : leaves.map(l => (
                      <tr key={l._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-800">
                             <p>{l.employeId?.name}</p>
                             <p className="text-xs text-gray-400 font-normal">{l.employecode}</p>
                        </td>
                        <td className="px-6 py-4 font-semibold text-gray-700">{l.type}</td>
                        <td className="px-6 py-4">
                           {new Date(l.startDate).toLocaleDateString()} - <br/> {new Date(l.endDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 max-w-xs truncate" title={l.reason}>{l.reason}</td>
                        <td className="px-6 py-4">
                             <span className={`px-2 py-1 rounded text-xs font-bold ${l.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' : l.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'}`}>
                               {l.status}
                             </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                            {l.status === 'Pending' ? (
                                <div className="flex justify-end gap-2">
                                  <button onClick={() => handleLeaveAction(l._id, 'Approved')} className="bg-emerald-100 text-emerald-800 border border-emerald-200 hover:bg-emerald-200 px-3 py-1 rounded text-xs font-bold">Approve</button>
                                  <button onClick={() => handleLeaveAction(l._id, 'Rejected')} className="bg-red-100 text-red-800 border border-red-200 hover:bg-red-200 px-3 py-1 rounded text-xs font-bold">Reject</button>
                                </div>
                            ) : (
                                <span className="text-xs text-gray-400 italic">Resolved</span>
                            )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ManagerDashboard;
