import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { User, School, Class, Student, Result, Subscription, Subject } from '@/src/types';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  GraduationCap, 
  Settings, 
  CreditCard, 
  History, 
  CheckSquare, 
  MessageSquare,
  School as SchoolIcon,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Download,
  Printer,
  ChevronRight,
  TrendingUp,
  Award,
  AlertCircle
} from 'lucide-react';
import { Button, Card, Input } from './ui';
import { cn } from '@/src/lib/utils';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';

// New Components
import { StudentManagement } from './StudentManagement';
import { TeacherManagement } from './TeacherManagement';
import { ClassManagement } from './ClassManagement';
import { SubjectManagement } from './SubjectManagement';
import { AttendanceManagement } from './AttendanceManagement';
import { ResultHistory } from './ResultHistory';
import { BrandingSettings } from './BrandingSettings';
import { Billing } from './Billing';
import { AIAssistant } from './AIAssistant';
import { SuperAdminDashboard } from './SuperAdminDashboard';

import { 
  subscribeToDocuments,
  createDocument,
  updateDocument,
  deleteDocument
} from '@/src/services/firebaseService';
import { where } from 'firebase/firestore';

interface DashboardProps {
  user: User;
  school?: School;
  onLogout: () => void;
  onPaymentSuccess: (reference: string, planId: string, amount: number) => void;
}

export const Dashboard = ({ user, school, onLogout, onPaymentSuccess }: DashboardProps) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Real Data from Firestore
  const [schools, setSchools] = useState<School[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [teachers, setTeachers] = useState<User[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

  useEffect(() => {
    if (user.role === 'super-admin') {
      const unsubSchools = subscribeToDocuments('schools', [], setSchools);
      return () => unsubSchools();
    } else if (school?.id) {
      const schoolQuery = [where('schoolId', '==', school.id)];
      
      const unsubClasses = subscribeToDocuments('classes', schoolQuery, setClasses);
      const unsubSubjects = subscribeToDocuments('subjects', schoolQuery, setSubjects);
      const unsubTeachers = subscribeToDocuments('users', [...schoolQuery, where('role', '==', 'teacher')], setTeachers);
      const unsubStudents = subscribeToDocuments('students', schoolQuery, setStudents);
      const unsubResults = subscribeToDocuments('results', schoolQuery, setResults);
      const unsubSubscriptions = subscribeToDocuments(`schools/${school.id}/subscriptions`, [], setSubscriptions);
      
      return () => {
        unsubClasses();
        unsubSubjects();
        unsubTeachers();
        unsubStudents();
        unsubResults();
        unsubSubscriptions();
      };
    }
  }, [user, school]);

  const handleAddStudent = async (studentData: Partial<Student>) => {
    if (school?.id) {
      await createDocument('students', { ...studentData, schoolId: school.id });
    }
  };

  const handleDeleteStudent = async (studentId: string) => {
    await deleteDocument('students', studentId);
  };

  const handleAddTeacher = async (name: string, email: string) => {
    if (school?.id) {
      await createDocument('users', { name, email, schoolId: school.id, role: 'teacher' });
    }
  };

  const handleDeleteTeacher = async (teacherId: string) => {
    await deleteDocument('users', teacherId);
  };

  const handleAddClass = async (className: string, teacherId?: string) => {
    if (school?.id) {
      await createDocument('classes', { name: className, teacherId, schoolId: school.id });
    }
  };

  const handleDeleteClass = async (classId: string) => {
    await deleteDocument('classes', classId);
  };

  const handleAddSubject = async (name: string, classId: string, teacherId?: string) => {
    if (school?.id) {
      await createDocument('subjects', { name, classId, teacherId, schoolId: school.id });
    }
  };

  const handleDeleteSubject = async (subjectId: string) => {
    await deleteDocument('subjects', subjectId);
  };

  const stats = [
    { label: 'Total Students', value: students.length.toString(), icon: <Users size={24} />, color: 'bg-blue-500' },
    { label: 'Total Teachers', value: teachers.length.toString(), icon: <Users size={24} />, color: 'bg-emerald-500' },
    { label: 'Classes', value: classes.length.toString(), icon: <GraduationCap size={24} />, color: 'bg-purple-500' },
    { label: 'Results Generated', value: results.length.toString(), icon: <History size={24} />, color: 'bg-orange-500' },
  ];

  const performanceData = classes.map(c => ({
    name: c.name,
    avg: results.filter(r => r.classId === c.id).reduce((acc, curr) => acc + curr.studentAverage, 0) / (results.filter(r => r.classId === c.id).length || 1)
  }));

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        if (user.role === 'super-admin') {
          return <SuperAdminDashboard schools={schools} onAddSchool={(data) => createDocument('schools', data)} onDeactivateSchool={(id) => updateDocument('schools', id, { subscriptionStatus: 'expired' })} />;
        }
        return (
          <div className="space-y-8">
            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Welcome back, {user.name}!</h1>
                <p className="text-gray-500 font-medium tracking-tight uppercase text-xs">Here's what's happening at {school?.name || 'your school'} today.</p>
              </div>
              <div className="flex items-center space-x-3">
                <Button variant="outline" size="sm">
                  <Download size={18} className="mr-2" /> Export Data
                </Button>
                <Button size="sm" onClick={() => setActiveTab('results')}>
                  <Plus size={18} className="mr-2" /> New Result
                </Button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, idx) => (
                <Card key={idx} className="p-6 flex items-center space-x-4 border-0 shadow-sm hover:shadow-md transition-shadow">
                  <div className={cn('p-3 rounded-2xl text-white shadow-lg', stat.color)}>
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                    <p className="text-2xl font-black text-gray-900">{stat.value}</p>
                  </div>
                </Card>
              ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="p-6 border-0 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">Class Performance Average</h3>
                  <TrendingUp className="text-emerald-500" size={20} />
                </div>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        cursor={{ fill: '#f8fafc' }}
                      />
                      <Bar dataKey="avg" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card className="p-6 border-0 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">Recent Activity</h3>
                  <History className="text-blue-500" size={20} />
                </div>
                <div className="space-y-6">
                  {results.slice(0, 5).map((result, idx) => {
                    const student = students.find(s => s.id === result.studentId);
                    return (
                      <div key={result.id} className="flex items-center space-x-4 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                          {student?.name.charAt(0) || 'S'}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors uppercase">Result generated for {student?.name || 'Unknown'}</p>
                          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{classes.find(c => c.id === result.classId)?.name} • {new Date(result.createdAt).toLocaleDateString()}</p>
                        </div>
                        <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-900" />
                      </div>
                    );
                  })}
                  {results.length === 0 && (
                    <p className="text-center py-10 text-gray-400 font-bold uppercase text-xs">No recent activity</p>
                  )}
                </div>
                <Button variant="ghost" className="w-full mt-6 text-blue-600 font-black uppercase tracking-widest text-xs" onClick={() => setActiveTab('results')}>View All Activity</Button>
              </Card>
            </div>
          </div>
        );
      case 'students':
        return <StudentManagement students={students} classes={classes} onAddStudent={handleAddStudent} onDeleteStudent={handleDeleteStudent} />;
      case 'teachers':
        return <TeacherManagement teachers={teachers} classes={classes} onAddTeacher={handleAddTeacher} onDeleteTeacher={handleDeleteTeacher} />;
      case 'classes':
        return <ClassManagement classes={classes} teachers={teachers} onAddClass={handleAddClass} onDeleteClass={handleDeleteClass} />;
      case 'subjects':
        return <SubjectManagement subjects={subjects} classes={classes} teachers={teachers} onAddSubject={handleAddSubject} onDeleteSubject={handleDeleteSubject} />;
      case 'results':
        return <ResultHistory results={results} students={students} classes={classes} onViewResult={() => {}} onDeleteResult={(id) => deleteDocument('results', id)} />;
      case 'attendance':
        return <AttendanceManagement students={students} classes={classes} onSaveAttendance={(data) => createDocument('attendance', data)} />;
      case 'branding':
        return school ? <BrandingSettings school={school} onUpdate={(data) => updateDocument('schools', school.id, data)} /> : null;
      case 'billing':
        return school ? (
          <Billing 
            school={school} 
            subscriptions={subscriptions} 
            userEmail={user.email}
            onUpgrade={() => {}} 
            onPaymentSuccess={onPaymentSuccess}
          />
        ) : null;
      case 'ai-assistant':
        return <AIAssistant />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
              <Settings size={40} />
            </div>
            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">{activeTab} Section</h2>
            <p className="text-gray-500 font-medium max-w-md">This section is currently under development. Please check back soon!</p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar 
        role={user.role} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={onLogout}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header 
          user={{ name: user.name, role: user.role, schoolName: school?.name }} 
          onMenuClick={() => setIsSidebarOpen(true)}
        />
        
        <main className="flex-1 overflow-y-auto p-6 lg:p-10">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};
