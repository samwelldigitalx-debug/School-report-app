import React, { useState } from 'react';
import { Button, Card, Input } from './ui';
import { User, Class } from '@/src/types';
import { Users, Plus, Mail, Lock, Trash2, Edit2, Search, Filter, GraduationCap, BookOpen } from 'lucide-react';

interface TeacherManagementProps {
  teachers: User[];
  classes: Class[];
  onAddTeacher: (name: string, email: string) => void;
  onDeleteTeacher: (teacherId: string) => void;
}

export const TeacherManagement = ({ teachers, classes, onAddTeacher, onDeleteTeacher }: TeacherManagementProps) => {
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = () => {
    if (newName && newEmail) {
      onAddTeacher(newName, newEmail);
      setNewName('');
      setNewEmail('');
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Teacher Management</h1>
        <Button onClick={() => setIsAdding(true)}>
          <Plus size={18} className="mr-2" /> Add New Teacher
        </Button>
      </div>

      {isAdding && (
        <Card className="p-6 border-2 border-blue-100 shadow-xl animate-in slide-in-from-top-4">
          <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider mb-6">Register New Teacher</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input 
              label="Full Name" 
              placeholder="e.g. Mr. John Doe" 
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <Input 
              label="Email Address" 
              type="email" 
              placeholder="teacher@school.com" 
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />
            <div className="flex items-end space-x-2">
              <Button onClick={handleAdd} className="flex-1">Register Teacher</Button>
              <Button variant="outline" onClick={() => setIsAdding(false)}>Cancel</Button>
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teachers.length > 0 ? (
          teachers.map((teacher) => (
            <Card key={teacher.id} className="p-6 border-0 shadow-sm hover:shadow-md transition-all group">
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 font-black text-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  {teacher.name.charAt(0)}
                </div>
                <div className="flex items-center space-x-1">
                  <button className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => onDeleteTeacher(teacher.id)}
                    className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-1">{teacher.name}</h3>
              <p className="text-sm text-gray-500 font-medium mb-6 flex items-center">
                <Mail size={14} className="mr-2" /> {teacher.email}
              </p>
              
              <div className="space-y-4 pt-4 border-t border-gray-50">
                <div className="flex items-center text-sm">
                  <GraduationCap size={16} className="text-gray-400 mr-3" />
                  <span className="text-gray-500 font-medium">Class Teacher:</span>
                  <span className="ml-2 font-bold text-gray-900 uppercase">
                    {classes.find(c => c.teacherId === teacher.id)?.name || 'None'}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <BookOpen size={16} className="text-gray-400 mr-3" />
                  <span className="text-gray-500 font-medium">Subjects:</span>
                  <span className="ml-2 font-bold text-gray-900">
                    {teacher.assignedSubjectIds?.length || 0} Assigned
                  </span>
                </div>
              </div>

              <Button variant="ghost" className="w-full mt-6 text-blue-600 font-bold hover:bg-blue-50">
                Manage Permissions
              </Button>
            </Card>
          ))
        ) : (
          <div className="col-span-full py-20 text-center space-y-4">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mx-auto">
              <Users size={40} />
            </div>
            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">No Teachers Registered</h3>
            <p className="text-gray-500 font-medium max-w-xs mx-auto">Register your school teachers and assign them to classes and subjects.</p>
            <Button onClick={() => setIsAdding(true)}>Register Your First Teacher</Button>
          </div>
        )}
      </div>
    </div>
  );
};
