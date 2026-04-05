import React, { useState, useEffect } from 'react';
import { auth, db } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { User, School } from './types';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { Pricing } from './components/Pricing';
import { GraduationCap } from 'lucide-react';
import { RegisterSchool } from './components/RegisterSchool';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [school, setSchool] = useState<School | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPricing, setShowPricing] = useState(false);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch user data from Firestore with real-time listener
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const unsubscribeUser = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            const userData = docSnap.data() as User;
            setUser({ ...userData, id: firebaseUser.uid });

            // If user belongs to a school, fetch school data with real-time listener
            if (userData.schoolId) {
              const schoolDocRef = doc(db, 'schools', userData.schoolId);
              const unsubscribeSchool = onSnapshot(schoolDocRef, (schoolSnap) => {
                if (schoolSnap.exists()) {
                  setSchool({ id: schoolSnap.id, ...schoolSnap.data() } as School);
                }
              });
              return () => unsubscribeSchool();
            } else {
              setSchool(null);
            }
          } else {
            // Handle new user or user without profile
            const newUser: User = {
              id: firebaseUser.uid,
              uid: firebaseUser.uid,
              schoolId: '', // No school yet
              name: firebaseUser.displayName || 'New User',
              email: firebaseUser.email || '',
              role: 'school-admin',
              createdAt: new Date().toISOString(),
            };
            
            // Create the user document
            setDoc(doc(db, 'users', firebaseUser.uid), newUser);
            setUser(newUser);
          }
          setLoading(false);
        });

        return () => unsubscribeUser();
      } else {
        setUser(null);
        setSchool(null);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
  };

  const handlePaymentSuccess = async (reference: string, planId: string, amount: number) => {
    if (!user || !user.schoolId) return;

    const schoolDocRef = doc(db, 'schools', user.schoolId);
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 1); // 1 month subscription

    await setDoc(schoolDocRef, {
      subscriptionPlan: planId,
      subscriptionStatus: 'active',
      subscriptionExpiry: expiryDate.toISOString(),
      lastPaymentReference: reference,
      lastPaymentAmount: amount,
      lastPaymentDate: new Date().toISOString(),
    }, { merge: true });

    // Also record the transaction
    const subDocRef = doc(db, 'schools', user.schoolId, 'subscriptions', reference);
    await setDoc(subDocRef, {
      id: reference,
      reference,
      plan: planId,
      amount,
      status: 'successful',
      createdAt: new Date().toISOString(),
    });

    setShowPricing(false);
    alert('Payment successful! Your subscription has been updated.');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <div className="bg-blue-600 p-4 rounded-3xl shadow-2xl animate-bounce mb-8">
          <GraduationCap className="text-white" size={48} />
        </div>
        <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase">EduResult Nigeria</h2>
        <p className="text-gray-500 font-bold mt-2 tracking-widest uppercase text-xs">Initializing System...</p>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  if (!user.schoolId && user.role !== 'super-admin') {
    return <RegisterSchool user={user} onComplete={(s) => setSchool(s)} />;
  }

  if (showPricing) {
    return (
      <Pricing 
        userEmail={user.email} 
        onSelectPlan={(planId) => console.log('Selected plan:', planId)} 
        onPaymentSuccess={handlePaymentSuccess}
      />
    );
  }

  return (
    <Dashboard 
      user={user} 
      school={school || undefined} 
      onLogout={handleLogout} 
      onPaymentSuccess={handlePaymentSuccess}
    />
  );
}
