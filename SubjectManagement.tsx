import React, { useState } from 'react';
import { Button, Card, Input } from './ui';
import { Subject, Class, User } from '@/src/types';
import { BookOpen, Plus, Users, Trash2, Edit2, Search, Filter, GraduationCap } from 'lucide-react';

interface SubjectManagementProps {
  subjects: Subject[];
  classes: Class[];
  teachers: User[];
  onAddSubject: (name: string, classId: string, teacherId?: string) => void;
  onDeleteSubject: (subjectId: string) => void;
}

export const SubjectManagement = ({ subjects, classes, teachers, onAddSubject, onDeleteSubject }: SubjectManagementProps) => {
  const [newSubjectName, setNewSubjectName] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = () => {
    if (newSubjectName && selectedClass) {
      onAddSubject(newSubjectName, selectedClass, selectedTeacher);
      setNewSubjectName('');
      setSelectedClass('');
      setSelectedTeacher('');
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Subject Management</h1>
        <Button onClick={() => setIsAdding(true)}>
          <Plus size={18} className="mr-2" /> Add New Subject
        </Button>
      </div>

      {isAdding && (
        <Card className="p-6 border-2 border-blue-100 shadow-xl animate-in slide-in-from-top-4">
          <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider mb-6">Setup New Subject</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase">Subject Name</label>
              <Input 
                placeholder="e.g. Mathematics" 
                value={newSubjectName}
                onChange={(e) => setNewSubjectName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase">Assign to Class</label>
              <select 
                className="w-full h-10 px-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
              >
                <option value="">Choose a class...</option>
                {classes.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase">Assign Subject Teacher</label>
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
              <Button onClick={handleAdd} className="flex-1">Add Subject</Button>
              <Button variant="outline" onClick={() => setIsAdding(false)}>Cancel</Button>
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.length > 0 ? (
          subjects.map((sub) => (
            <Card key={sub.id} className="p-6 border-0 shadow-sm hover:shadow-md transition-all group">
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 bg-blue-50 rounded-2xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <BookOpen size={24} />
                </div>
                <div className="flex items-center space-x-1">
                  <button className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => onDeleteSubject(sub.id)}
                    className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-2">{sub.name}</h3>
              
              <div className="space-y-4 pt-4 border-t border-gray-50">
                <div className="flex items-center text-sm">
                  <GraduationCap size={16} className="text-gray-400 mr-3" />
                  <span className="text-gray-500 font-medium">Class:</span>
                  <span className="ml-2 font-bold text-gray-900 uppercase">
                    {classes.find(c => c.id === sub.classId)?.name || 'Unknown'}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <Users size={16} className="text-gray-400 mr-3" />
                  <span className="text-gray-500 font-medium">Teacher:</span>
                  <span className="ml-2 font-bold text-gray-900">
                    {teachers.find(t => t.id === sub.teacherId)?.name || 'Unassigned'}
                  </span>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-full py-20 text-center space-y-4">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mx-auto">
              <BookOpen size={40} />
            </div>
            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">No Subjects Added Yet</h3>
            <p className="text-gray-500 font-medium max-w-xs mx-auto">Start by adding subjects to your classes and assigning teachers.</p>
            <Button onClick={() => setIsAdding(true)}>Add Your First Subject</Button>
          </div>
        )}
      </div>
    </div>
  );
};
