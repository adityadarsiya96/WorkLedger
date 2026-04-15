import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Calendar, 
  Settings, 
  LogOut,
  Wallet,
  FileText,
  User as UserIcon,
  Activity,
  Briefcase
} from 'lucide-react';
import axios from 'axios';

const EmployeeDashboard = () => {
  const { user, setUser } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Dashboard State
  const [profile, setProfile] = useState(null);
  const [leaves, setLeaves] = useState([]);
  const [salary, setSalary] = useState(null);
  const [payrolls, setPayrolls] = useState([]);

  // Form State
  const [leaveForm, setLeaveForm] = useState({ type: 'Sick Leave', startDate: '', endDate: '', reason: '' });
  const [isApplying, setIsApplying] = useState(false);
  const [message, setMessage] = useState('');

  // Fetch Data
  const fetchDashboardData = async () => {
    try {
      const pRes = await axios.get('http://localhost:3000/employee/employeeProfile', { withCredentials: true });
      if (pRes.data.success) setProfile(pRes.data.data);

      const lRes = await axios.get('http://localhost:3000/employee/viewLeave', { withCredentials: true });
      if (lRes.data.success) setLeaves(lRes.data.data);

      const sRes = await axios.get('http://localhost:3000/employee/viewsalary', { withCredentials: true });
      if (sRes.data.success) setSalary(sRes.data.data);

      const prRes = await axios.get('http://localhost:3000/employee/viewpayroll', { withCredentials: true });
      if (prRes.data.success) setPayrolls(prRes.data.data);

    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.get('http://localhost:3000/auth/logout', { withCredentials: true });
      setUser(null);
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const handleApplyLeave = async (e) => {
    e.preventDefault();
    setIsApplying(true);
    setMessage('');
    try {
      const res = await axios.post('http://localhost:3000/employee/apply-leave', leaveForm, { withCredentials: true });
      setMessage(res.data.message);
      setLeaveForm({ type: 'Sick Leave', startDate: '', endDate: '', reason: '' });
      fetchDashboardData(); // Refresh leave history
    } catch (err) {
      setMessage("Error: " + (err.response?.data?.message || err.message));
    } finally {
      setIsApplying(false);
    }
  };

  const handleCancelLeave = async (id) => {
    if(!confirm("Are you sure you want to cancel this leave?")) return;
    try {
       await axios.delete(`http://localhost:3000/employee/cancel-leave/${id}`, { withCredentials: true });
       fetchDashboardData();
    } catch (err) {
       alert("Error cancelling leave.");
    }
  }

  const SidebarItem = ({ icon: Icon, label, id }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center space-x-3 px-4 py-3 text-left border-l-4 ${
        activeTab === id 
        ? 'border-emerald-800 bg-emerald-50 text-emerald-900 font-semibold' 
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
          <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider mt-1">Employee Portal</p>
        </div>
        
        <nav className="flex-1 py-4 flex flex-col space-y-1">
          <SidebarItem id="overview" icon={Settings} label="Dashboard" />
          <SidebarItem id="leave" icon={Calendar} label="Leave Management" />
          <SidebarItem id="salary" icon={Wallet} label="Salary & Payroll" />
        </nav>

        <div className="p-4 border-t border-gray-300 bg-gray-50">
          <div className="mb-4 text-left">
            <p className="text-sm font-semibold text-gray-800">{user?.name || 'Employee'}</p>
            <p className="text-xs text-gray-500">{profile?.employeeInfo?.employeecode || 'No Code'}</p>
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
          {activeTab === 'overview' && profile && (
            <div className="space-y-8">
              
              {/* Profile Card */}
              <div className="bg-white p-8 border border-gray-300 shadow-sm flex items-center space-x-6">
                <div className="h-20 w-20 rounded-full bg-emerald-100 flex items-center justify-center">
                  <UserIcon size={40} className="text-emerald-700" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">{profile.user.name}</h3>
                  <p className="text-gray-500 font-medium mt-1">{profile.user.email}</p>
                  <p className="text-sm text-emerald-700 font-semibold mt-2 px-3 py-1 bg-emerald-50 inline-block rounded-full">Status: {profile.employeeInfo?.status || profile.user.role}</p>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 <div className="bg-white p-6 border border-gray-300 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Employee Code</h3>
                      <Briefcase className="text-gray-400" size={20} />
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{profile.employeeInfo?.employeecode || 'N/A'}</p>
                 </div>
                 
                 <div className="bg-white p-6 border border-gray-300 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Designation</h3>
                      <Activity className="text-gray-400" size={20} />
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{profile.employeeInfo?.designation || 'N/A'}</p>
                 </div>

                 <div className="bg-white p-6 border border-gray-300 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Leave Balance</h3>
                      <Calendar className="text-gray-400" size={20} />
                    </div>
                    <p className="text-2xl font-bold text-gray-800">
                      {leaves.length > 0 ? (leaves[0].leaveBalance || 20) : 20} Days
                    </p>
                 </div>
              </div>
            </div>
          )}

          {activeTab === 'leave' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               {/* Left Col: Apply for Leave */}
               <div className="lg:col-span-1 bg-white border border-gray-300 shadow-sm p-6 space-y-6 h-fit">
                 <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Apply for Leave</h3>
                 {message && <div className={`p-3 rounded text-sm font-medium ${message.startsWith('Error') ? 'bg-red-50 text-red-800 border border-red-200' : 'bg-green-50 text-green-800 border border-green-200'}`}>{message}</div>}
                 
                 <form onSubmit={handleApplyLeave} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
                      <select required value={leaveForm.type} onChange={e => setLeaveForm({...leaveForm, type: e.target.value})} className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-50">
                        <option>Sick Leave</option>
                        <option>Casual Leave</option>
                        <option>Annual Leave</option>
                        <option>Unpaid Leave</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                      <input required type="date" value={leaveForm.startDate} onChange={e => setLeaveForm({...leaveForm, startDate: e.target.value})} className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-50" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                      <input required type="date" value={leaveForm.endDate} onChange={e => setLeaveForm({...leaveForm, endDate: e.target.value})} className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-50" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                      <textarea required rows="3" value={leaveForm.reason} onChange={e => setLeaveForm({...leaveForm, reason: e.target.value})} className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-50"></textarea>
                    </div>
                    <button type="submit" disabled={isApplying} className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-semibold py-2 px-4 rounded transition-all disabled:opacity-50">
                      {isApplying ? 'Submitting...' : 'Submit Request'}
                    </button>
                 </form>
               </div>

               {/* Right Col: Request History */}
               <div className="lg:col-span-2 bg-white border border-gray-300 shadow-sm p-6 overflow-hidden flex flex-col">
                 <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">Leave Application History</h3>
                 <div className="overflow-auto flex-1">
                   <table className="w-full text-left border-collapse">
                     <thead>
                       <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-600">
                         <th className="p-3 font-semibold">Type</th>
                         <th className="p-3 font-semibold">Duration</th>
                         <th className="p-3 font-semibold">Reason</th>
                         <th className="p-3 font-semibold">Status</th>
                         <th className="p-3 font-semibold">Action</th>
                       </tr>
                     </thead>
                     <tbody>
                       {leaves.length === 0 ? (
                         <tr><td colSpan="5" className="p-4 text-center text-gray-500">No leave requests found.</td></tr>
                       ) : leaves.map(l => (
                         <tr key={l._id} className="border-b border-gray-100 hover:bg-gray-50 text-sm">
                           <td className="p-3 font-medium text-gray-800">{l.type}</td>
                           <td className="p-3 text-gray-600">
                             {new Date(l.startDate).toLocaleDateString()} to {new Date(l.endDate).toLocaleDateString()}
                           </td>
                           <td className="p-3 text-gray-600 truncate max-w-xs">{l.reason}</td>
                           <td className="p-3">
                             <span className={`px-2 py-1 rounded text-xs font-semibold ${l.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' : l.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'}`}>
                               {l.status}
                             </span>
                           </td>
                           <td className="p-3">
                             {l.status === 'Pending' && (
                               <button onClick={() => handleCancelLeave(l._id)} className="text-red-600 hover:text-red-800 font-medium text-xs">Cancel</button>
                             )}
                           </td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                 </div>
               </div>
            </div>
          )}

          {activeTab === 'salary' && (
            <div className="space-y-8">
              {/* Current Salary Structure */}
              <div className="bg-white border border-gray-300 shadow-sm p-6 flex flex-col">
                <div className="flex items-center space-x-3 mb-6 border-b pb-4">
                  <Wallet className="text-emerald-700" size={28} />
                  <h3 className="text-xl font-bold text-gray-800">Current Salary Structure</h3>
                </div>
                
                {salary ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-gray-50 p-4 border border-gray-200 rounded">
                      <p className="text-xs text-gray-500 uppercase font-semibold">Basic Pay</p>
                      <p className="text-xl font-bold text-gray-800 mt-1">${salary.basic.toLocaleString()}</p>
                    </div>
                    <div className="bg-gray-50 p-4 border border-gray-200 rounded">
                      <p className="text-xs text-gray-500 uppercase font-semibold">HRA & Allowances</p>
                      <p className="text-xl font-bold text-gray-800 mt-1">${(salary.hra + salary.allowances).toLocaleString()}</p>
                    </div>
                    <div className="bg-gray-50 p-4 border border-gray-200 rounded">
                      <p className="text-xs text-gray-500 uppercase font-semibold">Total Deductions</p>
                      <p className="text-xl font-bold text-red-600 mt-1">-${((salary.deductions?.pf || 0) + (salary.deductions?.tax || 0) + (salary.deductions?.other || 0)).toLocaleString()}</p>
                    </div>
                    <div className="bg-emerald-50 p-4 border border-emerald-200 rounded">
                      <p className="text-xs text-emerald-700 uppercase font-bold">Net Salary (Monthly)</p>
                      <p className="text-2xl font-black text-emerald-900 mt-1">${salary.netSalary?.toLocaleString() || (salary.basic + salary.hra + salary.allowances - ((salary.deductions?.pf || 0) + (salary.deductions?.tax || 0) + (salary.deductions?.other || 0))).toLocaleString()}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 p-4 italic">No salary structure has been defined for your account yet.</p>
                )}
              </div>

              {/* Generated Payroll Receipts */}
              <div className="bg-white border border-gray-300 shadow-sm p-6 flex flex-col">
                <div className="flex items-center space-x-3 mb-6 border-b pb-4">
                  <FileText className="text-emerald-700" size={28} />
                  <h3 className="text-xl font-bold text-gray-800">Payroll Receipts</h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-600">
                          <th className="p-4 font-semibold">Period (MM/YYYY)</th>
                          <th className="p-4 font-semibold">Net Pay Disbursed</th>
                          <th className="p-4 font-semibold">Disbursement Date</th>
                          <th className="p-4 font-semibold">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {payrolls.length === 0 ? (
                          <tr><td colSpan="4" className="p-6 text-center text-gray-500">No payroll receipts generated yet.</td></tr>
                        ) : payrolls.map(p => (
                          <tr key={p._id} className="border-b border-gray-100 hover:bg-gray-50 text-sm">
                            <td className="p-4 font-bold text-gray-800">{String(p.month).padStart(2, '0')} / {p.year}</td>
                            <td className="p-4 text-emerald-700 font-bold">${p.netPay.toLocaleString()}</td>
                            <td className="p-4 text-gray-600">{new Date(p.generatedAt).toLocaleDateString()}</td>
                            <td className="p-4"><span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">Transferred</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                </div>
              </div>

            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default EmployeeDashboard;
