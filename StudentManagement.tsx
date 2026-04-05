import React, { useState } from 'react';
import { Button, Card, Input } from './ui';
import { Student, Class } from '@/src/types';
import { Users, Plus, Search, Filter, Trash2, Edit2, GraduationCap, Calendar, Download, MoreVertical } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface StudentManagementProps {
  students: Student[];
  classes: Class[];
  onAddStudent: (student: Partial<Student>) => void;
  onDeleteStudent: (studentId: string) => void;
}

export const StudentManagement = ({ students, classes, onAddStudent, onDeleteStudent }: StudentManagementProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Partial<Student>>({
    name: '',
    admissionNumber: '',
    classId: '',
    gender: 'male',
    dob: '',
  });

  const handleAdd = () => {
    if (formData.name && formData.admissionNumber && formData.classId) {
      onAddStudent(formData);
      setFormData({ name: '', admissionNumber: '', classId: '', gender: 'male', dob: '' });
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Student Management</h1>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Download size={18} className="mr-2" /> Bulk Upload
          </Button>
          <Button onClick={() => setIsAdding(true)}>
            <Plus size={18} className="mr-2" /> Register Student
          </Button>
        </div>
      </div>

      {isAdding && (
        <Card className="p-6 border-2 border-blue-100 shadow-xl animate-in slide-in-from-top-4">
          <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider mb-6">Register New Student</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input 
              label="Full Name" 
              placeholder="e.g. Chidi Okoro" 
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <Input 
              label="Admission Number" 
              placeholder="SCH/2024/001" 
              value={formData.admissionNumber}
              onChange={(e) => setFormData({ ...formData, admissionNumber: e.target.value })}
            />
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase">Assign to Class</label>
              <select 
                className="w-full h-10 px-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium"
                value={formData.classId}
                onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
              >
                <option value="">Choose a class...</option>
                {classes.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase">Gender</label>
              <select 
                className="w-full h-10 px-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium"
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'male' | 'female' })}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <Input 
              label="Date of Birth" 
              type="date" 
              value={formData.dob}
              onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
            />
            <div className="flex items-end space-x-2">
              <Button onClick={handleAdd} className="flex-1">Register Student</Button>
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
              placeholder="Search by name or admission number..." 
              className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Filter size={16} className="mr-2" /> Filter by Class
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 uppercase text-[10px] font-black tracking-widest border-b border-gray-100">
                <th className="px-6 py-4">Student Name</th>
                <th className="px-6 py-4">Admission No</th>
                <th className="px-6 py-4">Class</th>
                <th className="px-6 py-4">Gender</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-50">
              {students.length > 0 ? (
                students.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                          {student.name.charAt(0)}
                        </div>
                        <span className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors uppercase">{student.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-600">{student.admissionNumber}</td>
                    <td className="px-6 py-4 font-medium text-gray-600 uppercase">
                      {classes.find(c => c.id === student.classId)?.name || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-600 capitalize">{student.gender}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase rounded-full tracking-wider">Active</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <button className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => onDeleteStudent(student.id)}
                          className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center space-y-4">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mx-auto">
                      <Users size={40} />
                    </div>
                    <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">No Students Registered</h3>
                    <p className="text-gray-500 font-medium max-w-xs mx-auto">Register your students to start generating academic results.</p>
                    <Button onClick={() => setIsAdding(true)}>Register Your First Student</Button>
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
