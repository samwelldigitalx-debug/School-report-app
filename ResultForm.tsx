import React, { useState } from 'react';
import { Button, Input, Card } from './ui';
import { cn } from '@/src/lib/utils';
import { Student, Subject, SubjectScore, Psychomotor, GRADING_SYSTEM } from '@/src/types';
import { Save, Calculator, MessageSquare, CheckCircle } from 'lucide-react';
import { calculateGrade, generateComment } from '@/src/services/geminiService';

interface ResultFormProps {
  student: Student;
  subjects: Subject[];
  onSave: (result: any) => void;
  onCancel: () => void;
}

export const ResultForm = ({ student, subjects, onSave, onCancel }: ResultFormProps) => {
  const [scores, setScores] = useState<SubjectScore[]>(
    subjects.map(s => ({
      subjectId: s.id,
      subjectName: s.name,
      ca: 0,
      exam: 0,
      total: 0,
      grade: 'F',
      remark: 'Poor',
    }))
  );

  const [attendance, setAttendance] = useState({ opened: 0, present: 0, absent: 0 });
  const [psychomotor, setPsychomotor] = useState<Psychomotor>({
    punctuality: 3,
    neatness: 3,
    handwriting: 3,
    sports: 3,
    drawing: 3,
    socialBehaviour: 3,
  });
  const [comments, setComments] = useState({ teacher: '', principal: '' });
  const [isGenerating, setIsGenerating] = useState(false);

  const updateScore = (idx: number, field: 'ca' | 'exam', value: number) => {
    const newScores = [...scores];
    newScores[idx][field] = value;
    const total = newScores[idx].ca + newScores[idx].exam;
    newScores[idx].total = total;
    
    // Local calculation
    const grading = GRADING_SYSTEM.find(g => total >= g.min && total <= g.max) || GRADING_SYSTEM[GRADING_SYSTEM.length - 1];
    newScores[idx].grade = grading.grade;
    newScores[idx].remark = grading.remark;
    
    setScores(newScores);
  };

  const handleGenerateAI = async () => {
    setIsGenerating(true);
    try {
      const totalScore = scores.reduce((acc, s) => acc + s.total, 0);
      const average = totalScore / scores.length;
      
      const teacherComment = await generateComment(average, 'teacher');
      const principalComment = await generateComment(average, 'principal');
      
      setComments({ teacher: teacherComment, principal: principalComment });
    } catch (err) {
      console.error('AI Generation failed:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const calculateAverage = () => {
    const total = scores.reduce((acc, s) => acc + s.total, 0);
    return total / scores.length;
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Enter Scores: {student.name}</h2>
          <p className="text-gray-500 font-medium">{student.admissionNumber} • {student.classId}</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button onClick={() => onSave({ scores, attendance, psychomotor, comments, studentAverage: calculateAverage() })}>
            <Save size={18} className="mr-2" /> Save Result
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Scores Table */}
        <Card className="lg:col-span-2 border-0 shadow-sm overflow-hidden">
          <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider">Subject Scores</h3>
            <div className="flex items-center space-x-2 text-xs font-bold text-gray-500">
              <Calculator size={14} />
              <span>Auto-calculating grading system</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 uppercase text-[10px] font-black tracking-widest border-b border-gray-100">
                  <th className="px-6 py-4">Subject</th>
                  <th className="px-6 py-4 w-24">CA (40)</th>
                  <th className="px-6 py-4 w-24">Exam (60)</th>
                  <th className="px-6 py-4 w-24">Total</th>
                  <th className="px-6 py-4 w-24">Grade</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-50">
                {scores.map((score, idx) => (
                  <tr key={score.subjectId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900 uppercase">{score.subjectName}</td>
                    <td className="px-6 py-4">
                      <input
                        type="number"
                        max={40}
                        min={0}
                        value={score.ca}
                        onChange={(e) => updateScore(idx, 'ca', parseInt(e.target.value) || 0)}
                        className="w-full px-2 py-1 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="number"
                        max={60}
                        min={0}
                        value={score.exam}
                        onChange={(e) => updateScore(idx, 'exam', parseInt(e.target.value) || 0)}
                        className="w-full px-2 py-1 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "font-black",
                        score.total >= 50 ? "text-emerald-600" : "text-red-600"
                      )}>{score.total}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-gray-100 rounded text-[10px] font-black uppercase tracking-wider">{score.grade}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Side Sections */}
        <div className="space-y-6">
          {/* Attendance */}
          <Card className="p-6 border-0 shadow-sm">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider mb-4">Attendance Record</h3>
            <div className="grid grid-cols-1 gap-4">
              <Input 
                label="Times School Opened" 
                type="number" 
                value={attendance.opened}
                onChange={(e) => setAttendance({ ...attendance, opened: parseInt(e.target.value) || 0 })}
              />
              <Input 
                label="Times Present" 
                type="number" 
                value={attendance.present}
                onChange={(e) => setAttendance({ ...attendance, present: parseInt(e.target.value) || 0 })}
              />
              <Input 
                label="Times Absent" 
                type="number" 
                value={attendance.absent}
                onChange={(e) => setAttendance({ ...attendance, absent: parseInt(e.target.value) || 0 })}
              />
            </div>
          </Card>

          {/* Psychomotor */}
          <Card className="p-6 border-0 shadow-sm">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider mb-4">Psychomotor Domain (1-5)</h3>
            <div className="space-y-4">
              {Object.entries(psychomotor).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-600 uppercase">{key.replace(/([A-Z])/g, ' $1')}</span>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((r) => (
                      <button
                        key={r}
                        onClick={() => setPsychomotor({ ...psychomotor, [key]: r })}
                        className={cn(
                          "w-6 h-6 rounded flex items-center justify-center text-[10px] font-black transition-all",
                          value === r ? "bg-blue-600 text-white shadow-md scale-110" : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                        )}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Comments Section */}
      <Card className="p-6 border-0 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider">Comments & Remarks</h3>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleGenerateAI}
            isLoading={isGenerating}
            className="text-blue-600 border-blue-200 hover:bg-blue-50"
          >
            <MessageSquare size={16} className="mr-2" /> Generate AI Comments
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase">Class Teacher's Comment</label>
            <textarea
              className="w-full h-24 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium"
              value={comments.teacher}
              onChange={(e) => setComments({ ...comments, teacher: e.target.value })}
              placeholder="Enter teacher's comment..."
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase">Principal's Comment</label>
            <textarea
              className="w-full h-24 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium"
              value={comments.principal}
              onChange={(e) => setComments({ ...comments, principal: e.target.value })}
              placeholder="Enter principal's comment..."
            />
          </div>
        </div>
      </Card>
    </div>
  );
};
