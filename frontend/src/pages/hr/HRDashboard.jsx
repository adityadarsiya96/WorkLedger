import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Users, 
  UserPlus, 
  Settings, 
  CreditCard, 
  Calendar, 
  ClipboardList, 
  LogOut 
} from 'lucide-react';
import axios from 'axios';

const HRDashboard = () => {
  const { user, setUser } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardStats, setDashboardStats] = useState({
    totalEmployees: 0,
    pendingRequests: 0,
    leaveRequests: 0,
    payrollStatus: "Pending"
  });

  const [requests, setRequests] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [payrolls, setPayrolls] = useState([]);
  const [approving, setApproving] = useState(null);
  const [formData, setFormData] = useState({ employeecode: '', department: '', designation: '', joiningDate: '' });
  
  const [assigningManager, setAssigningManager] = useState(null);
  const [selectedManagerId, setSelectedManagerId] = useState('');

  const [runPayrollForm, setRunPayrollForm] = useState({ 
    month: new Date().getMonth() + 1, 
    year: new Date().getFullYear() 
  });
  const [isProcessingPayroll, setIsProcessingPayroll] = useState(false);

  const [salaryForm, setSalaryForm] = useState({
    employeeId: '', basic: '', hra: '', allowances: '', pf: '', tax: '', other: '', effectiveFrom: ''
  });
  const [isDefiningSalary, setIsDefiningSalary] = useState(false);
  const baseUrl = import.meta.env.VITE_API_URL;

  const fetchEmployees = async () => {
      try {
        const res = await axios.get(`${baseUrl}/hr/show-employee`, { withCredentials: true });
        if(res.data.success && res.data.data) {
          setEmployees(res.data.data);
        } else {
          setEmployees([]);
        }
      } catch (err) {
        console.error(err);
      }
  };

  const fetchPayrolls = async () => {
    try {
      const res = await axios.get(`${baseUrl}/hr/payrolls`, { withCredentials: true });
      if(res.data.success) setPayrolls(res.data.data);
    } catch(err) {
      console.error(err);
    }
  };

  const handlePromoteToManager = async (employeeDocId) => {
    if(!confirm("Promote this employee to Manager?")) return;
    try {
      const res = await axios.put(`${baseUrl}/hr/create-manager/${employeeDocId}`, {}, { withCredentials: true });
      alert(res.data.message);
      fetchEmployees();
    } catch (err) {
      alert("Error promoting: " + (err.response?.data?.message || err.message));
    }
  };

  const handleAssignManager = async (employeeDocId) => {
    if(!selectedManagerId) return alert("Please select a manager first");
    try {
      const res = await axios.put(`${baseUrl}/hr/assign-manager`, {
        employeeId: employeeDocId,
        managerId: selectedManagerId 
      }, { withCredentials: true });
      alert(res.data.message);
      setAssigningManager(null);
      setSelectedManagerId('');
      fetchEmployees();
    } catch (err) {
      alert("Error assigning: " + (err.response?.data?.message || err.message));
    }
  };

  useEffect(() => {
    if (activeTab === 'employees' || activeTab === 'payroll') {
      axios.get(`${baseUrl}/hr/show-employee`, { withCredentials: true })
        .then(res => {
           if(res.data.success && res.data.data) {
             setEmployees(res.data.data);
           } else {
             setEmployees([]);
           }
        })
        .catch(console.error);
    }
    if (activeTab === 'payroll') {
      fetchPayrolls();
    }
  }, [activeTab]);

  const handleRunPayroll = async (e) => {
    e.preventDefault();
    setIsProcessingPayroll(true);
    try {
      const res = await axios.post(`${baseUrl}/hr/payroll/run`, {
        month: Number(runPayrollForm.month),
        year: Number(runPayrollForm.year)
      }, { withCredentials: true });
      
      alert(res.data.message);
      fetchPayrolls();
      
      // Also silently refresh dashboard stats globally
      axios.get(`${baseUrl}/hr/dashboard-stats`, { withCredentials: true })
        .then(res => { if(res.data.success) setDashboardStats(res.data.stats); });
        
    } catch(err) {
      alert("Payroll run failed: " + (err.response?.data?.message || err.message));
    } finally {
      setIsProcessingPayroll(false);
    }
  };

  const handleDefineSalary = async (e) => {
    e.preventDefault();
    setIsDefiningSalary(true);
    try {
      const payload = {
        employeeId: salaryForm.employeeId,
        basic: Number(salaryForm.basic),
        hra: Number(salaryForm.hra),
        allowances: Number(salaryForm.allowances),
        deductions: {
          pf: Number(salaryForm.pf),
          tax: Number(salaryForm.tax),
          other: Number(salaryForm.other)
        },
        effectiveFrom: salaryForm.effectiveFrom
      };
      
      const res = await axios.post(`${baseUrl}/hr/define-salary`, payload, { withCredentials: true });
      alert(res.data.message);
      
      setSalaryForm({ employeeId: '', basic: '', hra: '', allowances: '', pf: '', tax: '', other: '', effectiveFrom: '' });
    } catch(err) {
      alert("Error defining salary: " + (err.response?.data?.message || err.message));
    } finally {
      setIsDefiningSalary(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'requests') {
      axios.get(`${baseUrl}/hr/show-request`, { withCredentials: true })
        .then(res => {
           if(res.data.success && res.data.data) {
             setRequests(res.data.data);
           } else {
             setRequests([]);
           }
        })
        .catch(console.error);
    }
  }, [activeTab]);

  const handleApprove = async (userId) => {
    try {
      await axios.post(`${baseUrl}/hr/create-employee`, {
        userId,
        ...formData
      }, { withCredentials: true });
      
      setApproving(null);
      setFormData({ employeecode: '', department: '', designation: '', joiningDate: '' });
      
      const res = await axios.get(`${baseUrl}/hr/show-request`, { withCredentials: true });
      if(res.data.success && res.data.data) setRequests(res.data.data);
      else setRequests([]);
      
    } catch(err) {
      alert("Error approving employee: " + (err.response?.data?.message || err.message));
    }
  };


  useEffect(() => {
    const fetchStats = async () => {
      if (activeTab === 'overview') {
        try {
          const response = await axios.get(`${baseUrl}/hr/dashboard-stats`, { withCredentials: true });
          if (response.data.success) {
            setDashboardStats(response.data.stats);
          }
        } catch (error) {
          console.error("Failed to fetch dashboard stats", error);
        }
      }
    };
    fetchStats();
  }, [activeTab]);

  const stats = [
    { label: 'Total Employees', value: dashboardStats.totalEmployees, icon: Users },
    { label: 'Pending Requests', value: dashboardStats.pendingRequests, icon: ClipboardList },
    { label: 'Leave Requests', value: dashboardStats.leaveRequests, icon: Calendar },
    { label: 'Payroll Status', value: dashboardStats.payrollStatus, icon: CreditCard },
  ];

  const handleLogout = async () => {
    try {
    await axios.get(`${baseUrl}/auth/logout`, { withCredentials: true });
      setUser(null);
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const SidebarItem = ({ icon: Icon, label, id }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center space-x-3 px-4 py-3 text-left border-l-4 ${
        activeTab === id 
        ? 'border-blue-800 bg-blue-50 text-blue-900 font-semibold' 
        : 'border-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      }`}
    >
      <Icon size={20} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans text-gray-900">
      
      {/* Sidebar - Classic solid border and clean background */}
      <aside className="w-64 bg-white border-r border-gray-300 flex flex-col">
        <div className="p-6 border-b border-gray-300">
          <h1 className="text-xl font-bold text-gray-800 tracking-tight">WorkLedger</h1>
          <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider mt-1">HR Portal</p>
        </div>
        
        <nav className="flex-1 py-4 flex flex-col space-y-1">
          <SidebarItem id="overview" icon={Settings} label="Dashboard" />
          <SidebarItem id="employees" icon={Users} label="Employees" />
          <SidebarItem id="requests" icon={ClipboardList} label="Account Requests" />
          <SidebarItem id="leave" icon={Calendar} label="Leave Management" />
          <SidebarItem id="payroll" icon={CreditCard} label="Payroll" />
        </nav>

        <div className="p-4 border-t border-gray-300 bg-gray-50">
          <div className="mb-4">
            <p className="text-sm font-semibold text-gray-800">{user?.name || 'HR Admin'}</p>
            <p className="text-xs text-gray-500">{user?.email || 'hr@company.com'}</p>
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
      <main className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-300 h-16 flex items-center px-8 justify-between">
          <h2 className="text-xl font-semibold text-gray-800 capitalize">
            {activeTab.replace('-', ' ')}
          </h2>
          <div className="text-sm text-gray-600 font-medium">
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
                    <div key={index} className="bg-white p-6 border border-gray-300 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">{stat.label}</h3>
                        <Icon className="text-gray-400" size={20} />
                      </div>
                      <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                    </div>
                  );
                })}
              </div>

              {/* Quick Actions Panel */}
              <div className="bg-white border border-gray-300 shadow-sm">
                <div className="px-6 py-4 border-b border-gray-300 bg-gray-50">
                  <h3 className="text-lg font-semibold text-gray-800">Quick Actions</h3>
                </div>
                <div className="p-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <button onClick={() => setActiveTab('employees')} className="bg-gray-50 border border-gray-300 text-gray-800 py-4 px-4 hover:bg-gray-100 font-medium text-sm flex flex-col items-center justify-center space-y-3">
                    <UserPlus size={24} className="text-blue-800" />
                    <span>Manage Employees</span>
                  </button>
                  <button onClick={() => setActiveTab('requests')} className="bg-gray-50 border border-gray-300 text-gray-800 py-4 px-4 hover:bg-gray-100 font-medium text-sm flex flex-col items-center justify-center space-y-3">
                    <ClipboardList size={24} className="text-blue-800" />
                    <span>Review Requests</span>
                  </button>
                  <button onClick={() => setActiveTab('leave')} className="bg-gray-50 border border-gray-300 text-gray-800 py-4 px-4 hover:bg-gray-100 font-medium text-sm flex flex-col items-center justify-center space-y-3">
                    <Calendar size={24} className="text-blue-800" />
                    <span>Manage Leaves</span>
                  </button>
                  <button onClick={() => setActiveTab('payroll')} className="bg-gray-50 border border-gray-300 text-gray-800 py-4 px-4 hover:bg-gray-100 font-medium text-sm flex flex-col items-center justify-center space-y-3">
                    <CreditCard size={24} className="text-blue-800" />
                    <span>Process Payroll</span>
                  </button>
                </div>
              </div>

              {/* Recent HR Activity Panel could go here if needed, keeping it minimal */}
            </div>
          )}

          {activeTab === 'requests' && (
            <div className="bg-white border border-gray-300 shadow-sm mt-8">
              <div className="px-6 py-4 border-b border-gray-300 bg-gray-50 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">Pending Registrations</h3>
              </div>
              <div className="p-0">
                <table className="w-full text-left text-sm text-gray-600">
                  <thead className="bg-gray-100 text-gray-700 uppercase font-semibold border-b border-gray-300">
                    <tr>
                      <th className="px-6 py-3">Account Name</th>
                      <th className="px-6 py-3">Email Address</th>
                      <th className="px-6 py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {requests.length === 0 ? (
                      <tr><td colSpan="3" className="px-6 py-8 text-center text-gray-500">No pending requests found</td></tr>
                    ) : requests.map(reqUser => (
                      <tr key={reqUser._id}>
                        <td className="px-6 py-4 font-medium text-gray-800">{reqUser.name}</td>
                        <td className="px-6 py-4">{reqUser.email}</td>
                        <td className="px-6 py-4">
                          {approving === reqUser._id ? (
                            <div className="flex flex-wrap bg-gray-50 p-3 rounded border border-gray-300 gap-2 items-center">
                               <input type="text" placeholder="Emp Code" className="border px-2 py-1 text-xs w-24 outline-none" 
                                value={formData.employeecode} onChange={e => setFormData({...formData, employeecode: e.target.value})} />
                               <input type="text" placeholder="Dept" className="border px-2 py-1 text-xs w-24 outline-none" 
                                value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} />
                               <input type="text" placeholder="Title" className="border px-2 py-1 text-xs w-24 outline-none" 
                                value={formData.designation} onChange={e => setFormData({...formData, designation: e.target.value})} />
                               <input type="date" className="border px-2 py-1 text-xs w-32 outline-none" 
                                value={formData.joiningDate} onChange={e => setFormData({...formData, joiningDate: e.target.value})} />
                               
                               <button onClick={() => handleApprove(reqUser._id)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-semibold">Save</button>
                               <button onClick={() => setApproving(null)} className="text-gray-500 hover:text-gray-700 underline text-xs">Cancel</button>
                            </div>
                          ) : (
                            <button onClick={() => setApproving(reqUser._id)} className="text-blue-600 font-medium hover:underline border border-blue-600 px-3 py-1 rounded-sm hover:bg-blue-50">Approve</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'employees' && (
            <div className="bg-white border border-gray-300 shadow-sm mt-8">
              <div className="px-6 py-4 border-b border-gray-300 bg-gray-50 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">Corporate Directory</h3>
              </div>
              <div className="p-0">
                <table className="w-full text-left text-sm text-gray-600">
                  <thead className="bg-gray-100 text-gray-700 uppercase font-semibold border-b border-gray-300">
                    <tr>
                      <th className="px-6 py-3">Employee Name</th>
                      <th className="px-6 py-3">Emp Code</th>
                      <th className="px-6 py-3">Role & Dept</th>
                      <th className="px-6 py-3">Manager</th>
                      <th className="px-6 py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {employees.length === 0 ? (
                      <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">No active employees found</td></tr>
                    ) : employees.map(emp => {
                      const isManager = emp.userId?.role === 'MANAGER';
                      const activeManagers = employees.filter(e => e.userId?.role === 'MANAGER' && e._id !== emp._id);

                      return (
                      <tr key={emp._id}>
                        <td className="px-6 py-4 font-medium text-gray-800 flex items-center gap-2">
                           <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs uppercase">
                             {emp.userId?.name ? emp.userId.name.substring(0, 2) : 'EM'}
                           </div>
                           <div>
                             <p>{emp.userId?.name || 'Unknown User'}</p>
                             <p className="text-xs text-gray-400 font-normal">{emp.userId?.email || 'N/A'}</p>
                           </div>
                        </td>
                        <td className="px-6 py-4">{emp.employeecode}</td>
                        <td className="px-6 py-4">
                           <span className={`px-2 py-0.5 rounded text-xs font-bold ${isManager ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'} mb-1 inline-block`}>{emp.userId?.role || 'EMPLOYEE'}</span><br/>
                           <span className="text-xs">{emp.department}</span>
                        </td>
                        <td className="px-6 py-4">
                           {emp.userId?.manager ? (
                             <span className="bg-amber-50 text-amber-800 px-2 py-1 rounded text-xs font-medium border border-amber-200">{emp.userId?.manager?.name}</span>
                           ) : (
                             <span className="text-gray-400 text-xs italic">Unassigned</span>
                           )}
                        </td>
                        <td className="px-6 py-4">
                          {!isManager && (
                            <div className="flex flex-col gap-2">
                              {assigningManager === emp._id ? (
                                <div className="flex gap-2 items-center">
                                  <select 
                                    className="border rounded px-2 py-1 text-xs"
                                    value={selectedManagerId}
                                    onChange={e => setSelectedManagerId(e.target.value)}
                                  >
                                    <option value="">Select Manager</option>
                                    {activeManagers.map(m => (
                                      <option key={m._id} value={m._id}>{m.userId?.name}</option>
                                    ))}
                                  </select>
                                  <button onClick={() => handleAssignManager(emp._id)} className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs font-semibold">Assign</button>
                                  <button onClick={() => setAssigningManager(null)} className="text-gray-500 text-xs font-semibold">Cancel</button>
                                </div>
                              ) : (
                                <div className="flex space-x-2">
                                  <button onClick={() => handlePromoteToManager(emp._id)} className="border border-purple-300 text-purple-700 bg-purple-50 hover:bg-purple-100 px-3 py-1 rounded text-xs font-semibold">Promote to Manager</button>
                                  <button onClick={() => { setAssigningManager(emp._id); setSelectedManagerId(''); }} className="border border-gray-300 text-gray-700 bg-gray-50 hover:bg-gray-100 px-3 py-1 rounded text-xs font-semibold">Assign Manager</button>
                                </div>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    )})}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'payroll' && (
            <div className="space-y-6">
              
              {/* Define Salary Section */}
              <div className="bg-white border border-gray-300 shadow-sm p-6">
                 <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Define / Update Salary Structure</h3>
                 <form onSubmit={handleDefineSalary} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="col-span-1 md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Employee</label>
                      <select 
                        required
                        value={salaryForm.employeeId} 
                        onChange={e => setSalaryForm({...salaryForm, employeeId: e.target.value})}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-50 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      >
                        <option value="">Select Employee</option>
                        {employees.map(emp => (
                          <option key={emp.userId?._id} value={emp.userId?._id}>
                            {emp.userId?.name || emp.employeecode} ({emp.employeecode})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Basic Salary ($)</label>
                      <input 
                        required type="number" min="0" step="0.01"
                        value={salaryForm.basic} onChange={e => setSalaryForm({...salaryForm, basic: e.target.value})}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-50 outline-none"
                        placeholder="e.g. 5000"
                      />
                    </div>
                    
                    <div className="col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">HRA ($)</label>
                      <input 
                        type="number" min="0" step="0.01"
                        value={salaryForm.hra} onChange={e => setSalaryForm({...salaryForm, hra: e.target.value})}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-50 outline-none"
                        placeholder="e.g. 1000"
                      />
                    </div>

                    <div className="col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Allowances ($)</label>
                      <input 
                        type="number" min="0" step="0.01"
                        value={salaryForm.allowances} onChange={e => setSalaryForm({...salaryForm, allowances: e.target.value})}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-50 outline-none"
                        placeholder="e.g. 500"
                      />
                    </div>

                    <div className="col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">PF Deduction ($)</label>
                      <input 
                        type="number" min="0" step="0.01"
                        value={salaryForm.pf} onChange={e => setSalaryForm({...salaryForm, pf: e.target.value})}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-50 outline-none"
                        placeholder="e.g. 200"
                      />
                    </div>

                    <div className="col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tax Deduction ($)</label>
                      <input 
                        type="number" min="0" step="0.01"
                        value={salaryForm.tax} onChange={e => setSalaryForm({...salaryForm, tax: e.target.value})}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-50 outline-none"
                        placeholder="e.g. 300"
                      />
                    </div>
                    
                    <div className="col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Other Deductions ($)</label>
                      <input 
                        type="number" min="0" step="0.01"
                        value={salaryForm.other} onChange={e => setSalaryForm({...salaryForm, other: e.target.value})}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-50 outline-none"
                        placeholder="e.g. 50"
                      />
                    </div>

                    <div className="col-span-1 md:col-span-2">
                       <label className="block text-sm font-medium text-gray-700 mb-1">Effective From</label>
                       <input 
                         required type="date"
                         value={salaryForm.effectiveFrom} onChange={e => setSalaryForm({...salaryForm, effectiveFrom: e.target.value})}
                         className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-50 outline-none"
                       />
                    </div>

                    <div className="col-span-1 md:col-span-4 flex justify-end mt-2">
                      <button 
                        type="submit" disabled={isDefiningSalary}
                        className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded shadow-sm transition-all disabled:opacity-50"
                      >
                        {isDefiningSalary ? 'Saving...' : 'Define Structure'}
                      </button>
                    </div>
                 </form>
              </div>

              {/* Action Bar */}
              <div className="bg-white border border-gray-300 shadow-sm p-6 flex flex-col md:flex-row justify-between items-center gap-4">
                 <div>
                   <h3 className="text-lg font-bold text-gray-800">Process Monthly Payroll</h3>
                   <p className="text-sm text-gray-500 mt-1">Disburse salaries for all employees with defined structures.</p>
                 </div>
                 <form onSubmit={handleRunPayroll} className="flex gap-3 items-center">
                    <select 
                      value={runPayrollForm.month} 
                      onChange={e => setRunPayrollForm({...runPayrollForm, month: e.target.value})}
                      className="border border-gray-300 rounded px-3 py-2 text-sm bg-gray-50 outline-none"
                    >
                      {Array.from({length: 12}, (_, i) => i + 1).map(m => (
                        <option key={m} value={m}>{new Date(0, m - 1).toLocaleString('default', { month: 'long' })}</option>
                      ))}
                    </select>
                    <input 
                      type="number" 
                      value={runPayrollForm.year} 
                      onChange={e => setRunPayrollForm({...runPayrollForm, year: e.target.value})}
                      className="border border-gray-300 rounded px-3 py-2 text-sm bg-gray-50 w-24 outline-none"
                    />
                    <button 
                      type="submit" 
                      disabled={isProcessingPayroll}
                      className={`bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded shadow-sm transition-all ${isProcessingPayroll ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {isProcessingPayroll ? 'Processing...' : 'Run Payroll'}
                    </button>
                 </form>
              </div>

              {/* Payroll History Log */}
              <div className="bg-white border border-gray-300 shadow-sm">
                <div className="px-6 py-4 border-b border-gray-300 bg-gray-50 flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800">Payroll Disbursement Log</h3>
                </div>
                <div className="p-0">
                  <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-100 text-gray-700 uppercase font-semibold border-b border-gray-300">
                      <tr>
                        <th className="px-6 py-3">Employee</th>
                        <th className="px-6 py-3">Period</th>
                        <th className="px-6 py-3">Net Pay</th>
                        <th className="px-6 py-3">Disbursed Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {payrolls.length === 0 ? (
                        <tr><td colSpan="4" className="px-6 py-8 text-center text-gray-500">No payroll records found. Have you defined salaries?</td></tr>
                      ) : payrolls.map(pr => (
                        <tr key={pr._id}>
                          <td className="px-6 py-4 font-medium text-gray-800 flex items-center gap-2">
                             <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs uppercase">
                               {pr.employeeId?.name ? pr.employeeId.name.substring(0, 2) : 'EM'}
                             </div>
                             <div>
                               <p>{pr.employeeId?.name || 'Unknown User'}</p>
                               <span className="text-xs text-gray-500 font-normal">{pr.employeeId?.email || 'N/A'}</span>
                             </div>
                          </td>
                          <td className="px-6 py-4 font-medium text-gray-700 p-0 m-0 align-middle text-left border-t-0 border-r-0 border-l-0 text-xs">
                             <span className="bg-blue-50 text-blue-800 px-3 py-1 rounded inline-block">{pr.month}/{pr.year}</span>
                          </td>
                          <td className="px-6 py-4 text-green-700 font-bold">${pr.netPay?.toLocaleString() || 0}</td>
                          <td className="px-6 py-4 text-gray-500">{new Date(pr.generatedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'})}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {activeTab !== 'overview' && activeTab !== 'requests' && activeTab !== 'employees' && activeTab !== 'payroll' && (
            <div className="bg-white p-12 border border-gray-300 shadow-sm flex flex-col items-center justify-center min-h-[400px] text-gray-500">
              <Settings size={48} className="text-gray-300 mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Module Under Construction</h3>
              <p className="text-md mt-2">The {activeTab} functionality is currently being implemented.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default HRDashboard;

