import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  onSnapshot,
  Timestamp,
  setDoc
} from 'firebase/firestore';
import { db, auth } from '../firebase';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Generic CRUD operations
export const createDocument = async (collectionPath: string, data: any) => {
  try {
    const docRef = await addDoc(collection(db, collectionPath), {
      ...data,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, collectionPath);
  }
};

export const setDocument = async (collectionPath: string, docId: string, data: any) => {
  try {
    await setDoc(doc(db, collectionPath, docId), {
      ...data,
      createdAt: Timestamp.now(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${collectionPath}/${docId}`);
  }
};

export const updateDocument = async (collectionPath: string, docId: string, data: any) => {
  try {
    await updateDoc(doc(db, collectionPath, docId), data);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${collectionPath}/${docId}`);
  }
};

export const deleteDocument = async (collectionPath: string, docId: string) => {
  try {
    await deleteDoc(doc(db, collectionPath, docId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${collectionPath}/${docId}`);
  }
};

export const getDocument = async (collectionPath: string, docId: string) => {
  try {
    const docSnap = await getDoc(doc(db, collectionPath, docId));
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `${collectionPath}/${docId}`);
  }
};

export const getDocuments = async (collectionPath: string, queries: any[] = []) => {
  try {
    const q = query(collection(db, collectionPath), ...queries);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, collectionPath);
  }
};

export const subscribeToDocuments = (
  collectionPath: string, 
  queries: any[], 
  callback: (data: any[]) => void
) => {
  const q = query(collection(db, collectionPath), ...queries);
  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(data);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, collectionPath);
  });
};
