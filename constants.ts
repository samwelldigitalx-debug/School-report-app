export const GRADING_SYSTEM = [
  { min: 70, max: 100, grade: 'A', remark: 'Excellent' },
  { min: 60, max: 69, grade: 'B', remark: 'Very Good' },
  { min: 50, max: 59, grade: 'C', remark: 'Good' },
  { min: 40, max: 49, grade: 'D', remark: 'Fair' },
  { min: 0, max: 39, grade: 'F', remark: 'Poor' },
];

export const PSYCHOMOTOR_RATING_SCALE = [
  { value: 1, label: 'Very Poor' },
  { value: 2, label: 'Poor' },
  { value: 3, label: 'Fair' },
  { value: 4, label: 'Good' },
  { value: 5, label: 'Excellent' },
];

export const SUBSCRIPTION_PLANS = [
  {
    id: 'basic',
    name: 'BASIC PLAN',
    price: 10000,
    features: [
      'Up to 150 students',
      'Result generation',
      'A4 print',
      'PDF export',
      'Logo upload',
      'Subject management',
      'Result history',
    ],
  },
  {
    id: 'standard',
    name: 'STANDARD PLAN',
    price: 25000,
    features: [
      'Up to 500 students',
      'Includes everything in Basic',
      'Multi-user login',
      'Admin / teacher roles',
      'AI assistant bot',
      'Class ranking',
      'Analytics dashboard',
      'Attendance reports',
      'Principal signature & stamp upload',
    ],
  },
  {
    id: 'premium',
    name: 'PREMIUM PLAN',
    price: 50000,
    features: [
      'Unlimited students',
      'Includes everything in Standard',
      'Multi-campus support',
      'Parent portal',
      'Student portal',
      'Excel bulk upload',
      'WhatsApp notifications',
      'Priority support',
    ],
  },
];

export const CLASSES = [
  'Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5', 'Primary 6',
  'JSS1', 'JSS2', 'JSS3',
  'SS1', 'SS2', 'SS3',
];

export const TERMS = ['1st', '2nd', '3rd'];

export const SESSIONS = ['2023/2024', '2024/2025', '2025/2026'];
