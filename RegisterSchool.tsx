import React, { useState } from 'react';
import { Card, Input, Button } from './ui';
import { School, User } from '@/src/types';
import { db } from '@/src/firebase';
import { doc, setDoc, collection } from 'firebase/firestore';
import { GraduationCap, Building2, Mail, Phone, Globe, ArrowRight } from 'lucide-react';

interface RegisterSchoolProps {
  user: User;
  onComplete: (school: School) => void;
}

export const RegisterSchool = ({ user, onComplete }: RegisterSchoolProps) => {
  const [schoolName, setSchoolName] = useState('');
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const schoolId = `school-${Date.now()}`;
      const newSchool: School = {
        id: schoolId,
        name: schoolName,
        email: email,
        phone: phone,
        subscriptionPlan: 'basic',
        subscriptionStatus: 'trialing',
        createdAt: new Date().toISOString(),
      } as any;

      // Create school document
      await setDoc(doc(db, 'schools', schoolId), newSchool);

      // Update user document with schoolId
      await setDoc(doc(db, 'users', user.id), {
        ...user,
        schoolId: schoolId,
        role: 'school-admin'
      }, { merge: true });

      onComplete(newSchool);
    } catch (err) {
      console.error('Failed to register school:', err);
      alert('Failed to register school. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-lg space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-2xl shadow-lg mb-6">
            <GraduationCap className="text-white" size={40} />
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Register Your School</h1>
          <p className="mt-2 text-gray-600 font-medium">Create your professional school portal in seconds.</p>
        </div>

        <Card className="p-8 shadow-xl border-0">
          <form onSubmit={handleRegister} className="space-y-6">
            <Input
              label="School Name"
              placeholder="e.g. Bright Stars International School"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              required
              icon={<Building2 size={18} />}
            />
            <Input
              label="School Official Email"
              type="email"
              placeholder="admin@school.ng"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              icon={<Mail size={18} />}
            />
            <Input
              label="Phone Number"
              placeholder="+234..."
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              icon={<Phone size={18} />}
            />

            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
              <p className="text-xs text-blue-700 font-bold leading-relaxed">
                By registering, you will start a <span className="font-black">14-day free trial</span> of the Standard Plan. No credit card required.
              </p>
            </div>

            <Button type="submit" className="w-full py-6 text-lg" isLoading={isLoading}>
              Create School Portal <ArrowRight className="ml-2" size={20} />
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};
