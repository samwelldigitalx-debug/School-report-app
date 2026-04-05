import React, { useState } from 'react';
import { Button, Card, Input } from './ui';
import { School, User } from '@/src/types';
import { School as SchoolIcon, Plus, Search, Filter, Trash2, Edit2, CreditCard, CheckCircle, AlertCircle, MoreVertical, Shield, Users, History } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface SuperAdminDashboardProps {
  schools: School[];
  onAddSchool: (schoolData: Partial<School>) => void;
  onDeactivateSchool: (schoolId: string) => void;
}

export const SuperAdminDashboard = ({ schools, onAddSchool, onDeactivateSchool }: SuperAdminDashboardProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Partial<School>>({
    name: '',
    subscriptionPlan: 'basic',
    subscriptionExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  });

  const handleAdd = () => {
    if (formData.name) {
      onAddSchool(formData);
      setFormData({ name: '', subscriptionPlan: 'basic', subscriptionExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() });
      setIsAdding(false);
    }
  };

  const stats = [
    { label: 'Total Schools', value: schools.length, icon: <SchoolIcon size={24} />, color: 'bg-blue-500' },
    { label: 'Active Subscriptions', value: schools.filter(s => new Date(s.subscriptionExpiry) > new Date()).length, icon: <CreditCard size={24} />, color: 'bg-emerald-500' },
    { label: 'Total Students', value: '12,450', icon: <Users size={24} />, color: 'bg-purple-500' },
    { label: 'Platform Revenue', value: '₦1.2M', icon: <History size={24} />, color: 'bg-orange-500' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Platform Administration</h1>
          <p className="text-gray-500 font-medium tracking-tight uppercase text-xs">Super Admin Control Panel</p>
        </div>
        <Button onClick={() => setIsAdding(true)}>
          <Plus size={18} className="mr-2" /> Register New School
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <Card key={idx} className="p-6 flex items-center space-x-4 border-0 shadow-sm">
            <div className={cn('p-3 rounded-2xl text-white shadow-lg', stat.color)}>
              {stat.icon}
            </div>
            <div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
              <p className="text-2xl font-black text-gray-900">{stat.value}</p>
            </div>
          </Card>
        ))}
      </div>

      {isAdding && (
        <Card className="p-6 border-2 border-blue-100 shadow-xl animate-in slide-in-from-top-4">
          <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider mb-6">Register New School</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input 
              label="School Name" 
              placeholder="e.g. Royal International School" 
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase">Initial Plan</label>
              <select 
                className="w-full h-10 px-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium"
                value={formData.subscriptionPlan}
                onChange={(e) => setFormData({ ...formData, subscriptionPlan: e.target.value as any })}
              >
                <option value="basic">Basic Plan (₦10k)</option>
                <option value="standard">Standard Plan (₦25k)</option>
                <option value="premium">Premium Plan (₦50k)</option>
              </select>
            </div>
            <div className="flex items-end space-x-2">
              <Button onClick={handleAdd} className="flex-1">Register School</Button>
              <Button variant="outline" onClick={() => setIsAdding(false)}>Cancel</Button>
            </div>
          </div>
        </Card>
      )}

      <Card className="border-0 shadow-sm overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search schools by name..." 
              className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Filter size={16} className="mr-2" /> Filter by Plan
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 uppercase text-[10px] font-black tracking-widest border-b border-gray-100">
                <th className="px-6 py-4">School Name</th>
                <th className="px-6 py-4">Plan</th>
                <th className="px-6 py-4">Expiry Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-50">
              {schools.length > 0 ? (
                schools.map((school) => {
                  const isExpired = new Date(school.subscriptionExpiry) < new Date();
                  return (
                    <tr key={school.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-black text-sm">
                            {school.name.charAt(0)}
                          </div>
                          <div>
                            <span className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors uppercase">{school.name}</span>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">ID: {school.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-[10px] font-black uppercase rounded-full tracking-wider">
                          {school.subscriptionPlan}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-600">
                        {new Date(school.subscriptionExpiry).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                          isExpired ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"
                        )}>
                          {isExpired ? 'Expired' : 'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <button className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => onDeactivateSchool(school.id)}
                            className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center space-y-4">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mx-auto">
                      <SchoolIcon size={40} />
                    </div>
                    <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">No Schools Registered</h3>
                    <p className="text-gray-500 font-medium max-w-xs mx-auto">Register your first school to start managing the platform.</p>
                    <Button onClick={() => setIsAdding(true)}>Register Your First School</Button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
