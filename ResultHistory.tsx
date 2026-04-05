import React, { useState } from 'react';
import { Button, Card, Input } from './ui';
import { Result, Student, Class } from '@/src/types';
import { History, Search, Filter, Download, Printer, Eye, Trash2, GraduationCap, Calendar } from 'lucide-react';
import { SESSIONS, TERMS } from '@/src/constants';

interface ResultHistoryProps {
  results: Result[];
  students: Student[];
  classes: Class[];
  onViewResult: (result: Result) => void;
  onDeleteResult: (resultId: string) => void;
}

export const ResultHistory = ({ results, students, classes, onViewResult, onDeleteResult }: ResultHistoryProps) => {
  const [selectedSession, setSelectedSession] = useState('');
  const [selectedTerm, setSelectedTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('');

  const filteredResults = results.filter(r => {
    return (!selectedSession || r.session === selectedSession) &&
           (!selectedTerm || r.term === selectedTerm) &&
           (!selectedClass || r.classId === selectedClass);
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Result History & Archives</h1>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Download size={18} className="mr-2" /> Export CSV
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-4 border-0 shadow-sm">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Academic Session</label>
          <select 
            className="w-full h-10 px-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium"
            value={selectedSession}
            onChange={(e) => setSelectedSession(e.target.value)}
          >
            <option value="">All Sessions</option>
            {SESSIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </Card>
        <Card className="p-4 border-0 shadow-sm">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Term</label>
          <select 
            className="w-full h-10 px-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium"
            value={selectedTerm}
            onChange={(e) => setSelectedTerm(e.target.value)}
          >
            <option value="">All Terms</option>
            {TERMS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </Card>
        <Card className="p-4 border-0 shadow-sm">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Class Level</label>
          <select 
            className="w-full h-10 px-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="">All Classes</option>
            {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </Card>
        <Card className="p-4 border-0 shadow-sm flex items-center justify-center bg-blue-50">
          <div className="text-center">
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Total Results</p>
            <p className="text-2xl font-black text-blue-900">{filteredResults.length}</p>
          </div>
        </Card>
      </div>

      <Card className="border-0 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 uppercase text-[10px] font-black tracking-widest border-b border-gray-100">
                <th className="px-6 py-4">Student Name</th>
                <th className="px-6 py-4">Class</th>
                <th className="px-6 py-4">Session/Term</th>
                <th className="px-6 py-4">Average</th>
                <th className="px-6 py-4">Position</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-50">
              {filteredResults.length > 0 ? (
                filteredResults.map((result) => {
                  const student = students.find(s => s.id === result.studentId);
                  return (
                    <tr key={result.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                            {student?.name.charAt(0) || 'S'}
                          </div>
                          <span className="font-bold text-gray-900 uppercase">{student?.name || 'Unknown Student'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-600 uppercase">{result.classId}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-xs font-bold text-gray-500">
                          <Calendar size={14} className="mr-2" /> {result.session} • {result.term}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-black text-blue-600">{result.studentAverage.toFixed(1)}%</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-blue-50 text-blue-700 text-[10px] font-black uppercase rounded-full tracking-wider">
                          {result.classPosition} of {result.totalStudentsInClass}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <button 
                            onClick={() => onViewResult(result)}
                            className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                          >
                            <Eye size={18} />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors">
                            <Printer size={18} />
                          </button>
                          <button 
                            onClick={() => onDeleteResult(result.id)}
                            className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center space-y-4">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mx-auto">
                      <History size={40} />
                    </div>
                    <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">No Results Found</h3>
                    <p className="text-gray-500 font-medium max-w-xs mx-auto">Try adjusting your filters or generate new results to see them here.</p>
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
