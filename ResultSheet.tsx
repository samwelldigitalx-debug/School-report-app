import React from 'react';
import { School, Student, Result, GRADING_SYSTEM, PSYCHOMOTOR_RATING_SCALE } from '@/src/types';
import { cn } from '@/src/lib/utils';

interface ResultSheetProps {
  school: School;
  student: Student;
  result: Result;
}

export const ResultSheet = React.forwardRef<HTMLDivElement, ResultSheetProps>(
  ({ school, student, result }, ref) => {
    return (
      <div 
        ref={ref} 
        className="w-[210mm] min-h-[297mm] p-10 bg-white text-gray-900 font-sans shadow-lg mx-auto print:shadow-none print:p-0"
      >
        {/* Header Section */}
        <div className="flex items-center justify-between border-b-4 border-blue-800 pb-6 mb-8">
          <div className="w-24 h-24 flex-shrink-0">
            {school.logo ? (
              <img src={school.logo} alt="School Logo" className="w-full h-full object-contain" />
            ) : (
              <div className="w-full h-full bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold text-2xl">
                LOGO
              </div>
            )}
          </div>
          
          <div className="flex-1 text-center px-6">
            <h1 className="text-3xl font-black text-blue-900 uppercase tracking-tight leading-none mb-2">
              {school.name}
            </h1>
            <p className="text-sm font-bold italic text-blue-700 mb-2 uppercase">"{school.motto}"</p>
            <p className="text-sm font-medium text-gray-600 max-w-md mx-auto">{school.address}</p>
            <p className="text-sm font-medium text-gray-600">{school.phone} | {school.email}</p>
          </div>

          <div className="w-24 h-24 flex-shrink-0 border-2 border-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-400 font-medium">
            PASSPORT
          </div>
        </div>

        <div className="bg-blue-900 text-white py-2 px-4 rounded-md mb-8 flex justify-between items-center">
          <h2 className="text-lg font-bold uppercase tracking-wider">Student Academic Report Card</h2>
          <p className="font-bold">{result.session} Session | {result.term} Term</p>
        </div>

        {/* Bio Data Section */}
        <div className="grid grid-cols-3 gap-6 mb-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="space-y-1">
            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Student Name</p>
            <p className="text-sm font-black uppercase text-gray-900">{student.name}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Admission No</p>
            <p className="text-sm font-black text-gray-900">{student.admissionNumber}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Class</p>
            <p className="text-sm font-black text-gray-900 uppercase">{student.classId}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Gender</p>
            <p className="text-sm font-black text-gray-900 uppercase">{student.gender}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Position</p>
            <p className="text-sm font-black text-blue-700">{result.classPosition} of {result.totalStudentsInClass}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Average</p>
            <p className="text-sm font-black text-blue-700">{result.studentAverage.toFixed(1)}%</p>
          </div>
        </div>

        {/* Academic Performance Table */}
        <div className="mb-8 overflow-hidden rounded-lg border border-gray-300">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700 uppercase text-xs font-black tracking-wider">
                <th className="px-4 py-3 border-b border-r border-gray-300">Subject</th>
                <th className="px-4 py-3 border-b border-r border-gray-300 text-center">CA (40)</th>
                <th className="px-4 py-3 border-b border-r border-gray-300 text-center">Exam (60)</th>
                <th className="px-4 py-3 border-b border-r border-gray-300 text-center">Total (100)</th>
                <th className="px-4 py-3 border-b border-r border-gray-300 text-center">Grade</th>
                <th className="px-4 py-3 border-b border-r border-gray-300">Remark</th>
                <th className="px-4 py-3 border-b border-gray-300 text-center">Sign</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {result.scores.map((score, idx) => (
                <tr key={idx} className={cn(idx % 2 === 0 ? 'bg-white' : 'bg-gray-50')}>
                  <td className="px-4 py-3 border-b border-r border-gray-300 font-bold uppercase">{score.subjectName}</td>
                  <td className="px-4 py-3 border-b border-r border-gray-300 text-center">{score.ca}</td>
                  <td className="px-4 py-3 border-b border-r border-gray-300 text-center">{score.exam}</td>
                  <td className="px-4 py-3 border-b border-r border-gray-300 text-center font-black text-blue-800">{score.total}</td>
                  <td className="px-4 py-3 border-b border-r border-gray-300 text-center font-black">{score.grade}</td>
                  <td className="px-4 py-3 border-b border-r border-gray-300 font-medium">{score.remark}</td>
                  <td className="px-4 py-3 border-b border-gray-300 text-center italic text-gray-300 text-[10px]">
                    {score.teacherSignature ? 'Signed' : '________'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bottom Sections: Psychomotor and Attendance */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          {/* Psychomotor Domain */}
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <div className="bg-gray-100 px-4 py-2 border-b border-gray-300">
              <h3 className="text-xs font-black uppercase tracking-wider text-gray-700">Affective & Psychomotor Domain</h3>
            </div>
            <div className="p-4 space-y-3">
              {Object.entries(result.psychomotor).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between text-xs">
                  <span className="font-bold uppercase text-gray-600">{key.replace(/([A-Z])/g, ' $1')}</span>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <div 
                        key={rating}
                        className={cn(
                          "w-5 h-5 flex items-center justify-center border border-gray-300 rounded text-[10px] font-bold",
                          value === rating ? "bg-blue-800 text-white border-blue-800" : "text-gray-400"
                        )}
                      >
                        {rating}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <div className="pt-2 mt-2 border-t border-gray-100 flex justify-between text-[10px] text-gray-400 font-bold uppercase italic">
                <span>1: Very Poor</span>
                <span>5: Excellent</span>
              </div>
            </div>
          </div>

          {/* Attendance & Grading Key */}
          <div className="space-y-6">
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <div className="bg-gray-100 px-4 py-2 border-b border-gray-300">
                <h3 className="text-xs font-black uppercase tracking-wider text-gray-700">Attendance Record</h3>
              </div>
              <div className="p-4 grid grid-cols-3 gap-4 text-center">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-gray-500 uppercase">Opened</p>
                  <p className="text-sm font-black">{result.attendance.opened}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-gray-500 uppercase">Present</p>
                  <p className="text-sm font-black">{result.attendance.present}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-gray-500 uppercase">Absent</p>
                  <p className="text-sm font-black">{result.attendance.absent}</p>
                </div>
              </div>
            </div>

            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <div className="bg-gray-100 px-4 py-2 border-b border-gray-300">
                <h3 className="text-xs font-black uppercase tracking-wider text-gray-700">Grading Key</h3>
              </div>
              <div className="p-3 grid grid-cols-2 gap-x-4 gap-y-1 text-[10px]">
                {GRADING_SYSTEM.map((g) => (
                  <div key={g.grade} className="flex justify-between border-b border-gray-100 pb-1">
                    <span className="font-black text-gray-700">{g.min}-{g.max} = {g.grade}</span>
                    <span className="font-bold text-gray-500 uppercase">{g.remark}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="space-y-6 mb-10">
          <div className="border-b border-gray-300 pb-4">
            <p className="text-xs font-black uppercase text-gray-500 mb-2">Class Teacher's Comment</p>
            <p className="text-sm font-medium italic text-gray-800 underline decoration-gray-300 underline-offset-4">
              {result.comments.teacher}
            </p>
          </div>
          
          <div className="flex justify-between items-end">
            <div className="flex-1 border-b border-gray-300 pb-4 mr-10">
              <p className="text-xs font-black uppercase text-gray-500 mb-2">Principal's Comment</p>
              <p className="text-sm font-medium italic text-gray-800 underline decoration-gray-300 underline-offset-4">
                {result.comments.principal}
              </p>
            </div>
            
            <div className="w-48 text-center space-y-2">
              <div className="h-16 flex items-center justify-center">
                {school.principalSignature && (
                  <img src={school.principalSignature} alt="Principal Signature" className="max-h-full" />
                )}
              </div>
              <div className="border-t border-gray-900 pt-1">
                <p className="text-[10px] font-black uppercase">Principal's Signature</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="flex justify-between items-center pt-6 border-t-2 border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          <p>Next Term Resumes: {result.resumptionDate || 'TBA'}</p>
          <div className="flex items-center space-x-2">
            <div className="w-16 h-16 border-2 border-gray-200 rounded-full flex items-center justify-center opacity-30">
              {school.schoolStamp ? (
                <img src={school.schoolStamp} alt="School Stamp" className="w-full h-full object-contain" />
              ) : (
                <span className="text-[8px]">STAMP</span>
              )}
            </div>
            <p>Official School Stamp</p>
          </div>
          <p>Generated by EduResult Nigeria</p>
        </div>
      </div>
    );
  }
);
