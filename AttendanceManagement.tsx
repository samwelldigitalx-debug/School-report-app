import React, { useState } from 'react';
import { Button, Card, Input } from './ui';
import { Student, Class } from '@/src/types';
import { CheckSquare, Save, Search, Filter, GraduationCap, Users, Calendar } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface AttendanceManagementProps {
  students: Student[];
  classes: Class[];
  onSaveAttendance: (attendanceData: any) => void;
}

export const AttendanceManagement = ({ students, classes, onSaveAttendance }: AttendanceManagementProps) => {
  const [selectedClass, setSelectedClass] = useState('');
  const [attendanceData, setAttendanceData] = useState<{ [key: string]: { opened: number, present: number, absent: number } }>({});
  const [globalOpened, setGlobalOpened] = useState(0);

  const filteredStudents = students.filter(s => s.classId === selectedClass);

  const updateAttendance = (studentId: string, field: 'present' | 'absent', value: number) => {
    setAttendanceData({
      ...attendanceData,
      [studentId]: {
        ...attendanceData[studentId],
        opened: globalOpened,
        [field]: value,
        // Auto-calculate the other field if possible
        ...(field === 'present' ? { absent: Math.max(0, globalOpened - value) } : { present: Math.max(0, globalOpened - value) })
      }
    });
  };

  const handleSave = () => {
    onSaveAttendance(attendanceData);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Attendance Management</h1>
        <Button onClick={handleSave} disabled={!selectedClass}>
          <Save size={18} className="mr-2" /> Save Attendance
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border-0 shadow-sm">
          <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Select Class</label>
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
        </Card>

        <Card className="p-6 border-0 shadow-sm">
          <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Total School Days Opened</label>
          <Input 
            type="number" 
            value={globalOpened}
            onChange={(e) => setGlobalOpened(parseInt(e.target.value) || 0)}
            placeholder="e.g. 60"
          />
        </Card>

        <Card className="p-6 border-0 shadow-sm flex items-center justify-center bg-blue-50">
          <div className="text-center">
            <p className="text-xs font-black text-blue-600 uppercase tracking-widest">Active Class</p>
            <p className="text-xl font-black text-blue-900 uppercase">
              {classes.find(c => c.id === selectedClass)?.name || 'None Selected'}
            </p>
          </div>
        </Card>
      </div>

      {selectedClass ? (
        <Card className="border-0 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 uppercase text-[10px] font-black tracking-widest border-b border-gray-100">
                  <th className="px-6 py-4">Student Name</th>
                  <th className="px-6 py-4">Admission No</th>
                  <th className="px-6 py-4 w-32">Days Present</th>
                  <th className="px-6 py-4 w-32">Days Absent</th>
                  <th className="px-6 py-4 w-32 text-right">Percentage</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-50">
                {filteredStudents.map((student) => {
                  const data = attendanceData[student.id] || { present: 0, absent: 0 };
                  const percentage = globalOpened > 0 ? (data.present / globalOpened) * 100 : 0;
                  
                  return (
                    <tr key={student.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                            {student.name.charAt(0)}
                          </div>
                          <span className="font-bold text-gray-900 uppercase">{student.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-600">{student.admissionNumber}</td>
                      <td className="px-6 py-4">
                        <input
                          type="number"
                          max={globalOpened}
                          min={0}
                          value={data.present}
                          onChange={(e) => updateAttendance(student.id, 'present', parseInt(e.target.value) || 0)}
                          className="w-full px-2 py-1 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="number"
                          max={globalOpened}
                          min={0}
                          value={data.absent}
                          onChange={(e) => updateAttendance(student.id, 'absent', parseInt(e.target.value) || 0)}
                          className="w-full px-2 py-1 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                        />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={cn(
                          "px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                          percentage >= 75 ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                        )}>
                          {percentage.toFixed(0)}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <div className="py-20 text-center space-y-4">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mx-auto">
            <CheckSquare size={40} />
          </div>
          <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Select a Class to Manage Attendance</h3>
          <p className="text-gray-500 font-medium max-w-xs mx-auto">Choose a class from the dropdown above to start recording student attendance.</p>
        </div>
      )}
    </div>
  );
};
