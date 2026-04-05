import React, { useState } from 'react';
import { Button, Card, Input } from './ui';
import { Class, User } from '@/src/types';
import { GraduationCap, Plus, Users, Trash2, Edit2, Search, Filter } from 'lucide-react';
import { CLASSES } from '@/src/constants';

interface ClassManagementProps {
  classes: Class[];
  teachers: User[];
  onAddClass: (className: string, teacherId?: string) => void;
  onDeleteClass: (classId: string) => void;
}

export const ClassManagement = ({ classes, teachers, onAddClass, onDeleteClass }: ClassManagementProps) => {
  const [newClassName, setNewClassName] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = () => {
    if (newClassName) {
      onAddClass(newClassName, selectedTeacher);
      setNewClassName('');
      setSelectedTeacher('');
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Class Management</h1>
        <Button onClick={() => setIsAdding(true)}>
          <Plus size={18} className="mr-2" /> Create New Class
        </Button>
      </div>

      {isAdding && (
        <Card className="p-6 border-2 border-blue-100 shadow-xl animate-in slide-in-from-top-4">
          <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider mb-6">Setup New Class</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase">Select Class Level</label>
              <select 
                className="w-full h-10 px-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium"
                value={newClassName}
                onChange={(e) => setNewClassName(e.target.value)}
              >
                <option value="">Choose a class...</option>
                {CLASSES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase">Assign Class Teacher</label>
              <select 
                className="w-full h-10 px-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium"
                value={selectedTeacher}
                onChange={(e) => setSelectedTeacher(e.target.value)}
              >
                <option value="">Select a teacher...</option>
                {teachers.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end space-x-2">
              <Button onClick={handleAdd} className="flex-1">Create Class</Button>
              <Button variant="outline" onClick={() => setIsAdding(false)}>Cancel</Button>
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.length > 0 ? (
          classes.map((cls) => (
            <Card key={cls.id} className="p-6 border-0 shadow-sm hover:shadow-md transition-all group">
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 bg-blue-50 rounded-2xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <GraduationCap size={24} />
                </div>
                <div className="flex items-center space-x-1">
                  <button className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => onDeleteClass(cls.id)}
                    className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-2">{cls.name}</h3>
              
              <div className="space-y-4 pt-4 border-t border-gray-50">
                <div className="flex items-center text-sm">
                  <Users size={16} className="text-gray-400 mr-3" />
                  <span className="text-gray-500 font-medium">Class Teacher:</span>
                  <span className="ml-2 font-bold text-gray-900">
                    {teachers.find(t => t.id === cls.teacherId)?.name || 'Unassigned'}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <Users size={16} className="text-gray-400 mr-3" />
                  <span className="text-gray-500 font-medium">Total Students:</span>
                  <span className="ml-2 font-bold text-gray-900">45</span>
                </div>
              </div>

              <Button variant="ghost" className="w-full mt-6 text-blue-600 font-bold hover:bg-blue-50">
                View Class Details
              </Button>
            </Card>
          ))
        ) : (
          <div className="col-span-full py-20 text-center space-y-4">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mx-auto">
              <GraduationCap size={40} />
            </div>
            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">No Classes Added Yet</h3>
            <p className="text-gray-500 font-medium max-w-xs mx-auto">Start by creating your first class level and assigning a teacher.</p>
            <Button onClick={() => setIsAdding(true)}>Create Your First Class</Button>
          </div>
        )}
      </div>
    </div>
  );
};
