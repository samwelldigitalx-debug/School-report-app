export type UserRole = 'super-admin' | 'school-admin' | 'teacher';

export interface School {
  id: string;
  name: string;
  logo?: string;
  motto?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  principalSignature?: string;
  schoolStamp?: string;
  subscriptionPlan: 'basic' | 'standard' | 'premium';
  subscriptionExpiry: string; // ISO date
  createdAt: string;
}

export interface User {
  id: string;
  uid?: string; // Firebase Auth UID
  schoolId: string;
  name: string;
  email: string;
  role: UserRole;
  assignedClassId?: string;
  assignedSubjectIds?: string[];
  createdAt: string;
}

export interface Class {
  id: string;
  schoolId: string;
  name: string; // e.g., "Primary 1", "JSS1", "SS1"
  teacherId?: string; // Class teacher
  createdAt: string;
}

export interface Subject {
  id: string;
  schoolId: string;
  classId: string;
  name: string;
  teacherId?: string; // Subject teacher
  createdAt: string;
}

export interface Student {
  id: string;
  schoolId: string;
  classId: string;
  name: string;
  admissionNumber: string;
  gender: 'male' | 'female';
  dob?: string;
  createdAt: string;
}

export interface SubjectScore {
  subjectId: string;
  subjectName: string;
  ca: number;
  exam: number;
  total: number;
  grade: string;
  remark: string;
  teacherSignature?: string;
}

export interface Psychomotor {
  punctuality: number; // 1-5
  neatness: number;
  handwriting: number;
  sports: number;
  drawing: number;
  socialBehaviour: number;
}

export interface Result {
  id: string;
  schoolId: string;
  studentId: string;
  classId: string;
  session: string; // e.g., "2023/2024"
  term: '1st' | '2nd' | '3rd';
  scores: SubjectScore[];
  attendance: {
    opened: number;
    present: number;
    absent: number;
  };
  psychomotor: Psychomotor;
  comments: {
    teacher: string;
    principal: string;
  };
  studentAverage: number;
  classPosition?: number;
  totalStudentsInClass?: number;
  resumptionDate?: string;
  createdAt: string;
}

export const GRADING_SYSTEM = [
  { min: 75, max: 100, grade: 'A1', remark: 'Excellent' },
  { min: 70, max: 74, grade: 'B2', remark: 'Very Good' },
  { min: 65, max: 69, grade: 'B3', remark: 'Good' },
  { min: 60, max: 64, grade: 'C4', remark: 'Credit' },
  { min: 55, max: 59, grade: 'C5', remark: 'Credit' },
  { min: 50, max: 54, grade: 'C6', remark: 'Credit' },
  { min: 45, max: 49, grade: 'D7', remark: 'Pass' },
  { min: 40, max: 44, grade: 'E8', remark: 'Pass' },
  { min: 0, max: 39, grade: 'F9', remark: 'Fail' },
];

export const PSYCHOMOTOR_RATING_SCALE = [
  { value: 5, label: 'Excellent' },
  { value: 4, label: 'Very Good' },
  { value: 3, label: 'Good' },
  { value: 2, label: 'Fair' },
  { value: 1, label: 'Poor' },
];

export interface Subscription {
  id: string;
  schoolId: string;
  plan: 'basic' | 'standard' | 'premium';
  amount: number;
  status: 'active' | 'expired' | 'pending';
  reference: string;
  createdAt: string;
  expiryDate: string;
}
