import React, { useState } from 'react';
import { Button, Card, Input } from './ui';
import { School } from '@/src/types';
import { Upload, Trash2, CheckCircle, Save, Image as ImageIcon } from 'lucide-react';
import { db } from '@/src/firebase';
import { doc, updateDoc } from 'firebase/firestore';

interface BrandingSettingsProps {
  school: School;
  onUpdate: (updatedSchool: School) => void;
}

export const BrandingSettings = ({ school, onUpdate }: BrandingSettingsProps) => {
  const [formData, setFormData] = useState<Partial<School>>({
    name: school.name,
    motto: school.motto,
    address: school.address,
    phone: school.phone,
    email: school.email,
    website: school.website,
    logo: school.logo,
    principalSignature: school.principalSignature,
    schoolStamp: school.schoolStamp,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof School) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, [field]: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateDoc(doc(db, 'schools', school.id), formData);
      onUpdate({ ...school, ...formData });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to update school branding:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase">School Branding & Assets</h1>
        <Button onClick={handleSave} isLoading={isLoading} className="px-8">
          {success ? <CheckCircle className="mr-2" size={18} /> : <Save className="mr-2" size={18} />}
          {success ? 'Saved!' : 'Save Changes'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Basic Info */}
        <Card className="lg:col-span-2 p-8 border-0 shadow-sm space-y-6">
          <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight mb-4">Official Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
              label="School Name" 
              value={formData.name} 
              onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
            />
            <Input 
              label="School Motto" 
              value={formData.motto} 
              onChange={(e) => setFormData({ ...formData, motto: e.target.value })} 
            />
            <Input 
              label="Official Address" 
              value={formData.address} 
              onChange={(e) => setFormData({ ...formData, address: e.target.value })} 
            />
            <Input 
              label="Contact Phone" 
              value={formData.phone} 
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
            />
            <Input 
              label="Official Email" 
              value={formData.email} 
              onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
            />
            <Input 
              label="Website (Optional)" 
              value={formData.website} 
              onChange={(e) => setFormData({ ...formData, website: e.target.value })} 
            />
          </div>
        </Card>

        {/* Assets Upload */}
        <div className="space-y-6">
          {/* Logo */}
          <Card className="p-6 border-0 shadow-sm">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider mb-4">School Logo</h3>
            <div className="flex flex-col items-center space-y-4">
              <div className="w-32 h-32 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center overflow-hidden bg-gray-50 group relative">
                {formData.logo ? (
                  <>
                    <img src={formData.logo} alt="Logo" className="w-full h-full object-contain p-2" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button 
                        onClick={() => setFormData({ ...formData, logo: '' })}
                        className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </>
                ) : (
                  <ImageIcon className="text-gray-300" size={40} />
                )}
              </div>
              <label className="w-full">
                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'logo')} />
                <div className="flex items-center justify-center w-full px-4 py-2 border border-gray-300 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50 cursor-pointer transition-colors">
                  <Upload size={16} className="mr-2" /> Upload Logo
                </div>
              </label>
            </div>
          </Card>

          {/* Signature */}
          <Card className="p-6 border-0 shadow-sm">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider mb-4">Principal's Signature</h3>
            <div className="flex flex-col items-center space-y-4">
              <div className="w-full h-24 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center overflow-hidden bg-gray-50 group relative">
                {formData.principalSignature ? (
                  <>
                    <img src={formData.principalSignature} alt="Signature" className="max-h-full p-2" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button 
                        onClick={() => setFormData({ ...formData, principalSignature: '' })}
                        className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </>
                ) : (
                  <span className="text-gray-300 font-bold text-xs uppercase tracking-widest">No Signature</span>
                )}
              </div>
              <label className="w-full">
                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'principalSignature')} />
                <div className="flex items-center justify-center w-full px-4 py-2 border border-gray-300 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50 cursor-pointer transition-colors">
                  <Upload size={16} className="mr-2" /> Upload Signature
                </div>
              </label>
            </div>
          </Card>

          {/* Stamp */}
          <Card className="p-6 border-0 shadow-sm">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider mb-4">School Stamp / Seal</h3>
            <div className="flex flex-col items-center space-y-4">
              <div className="w-24 h-24 border-2 border-dashed border-gray-200 rounded-full flex items-center justify-center overflow-hidden bg-gray-50 group relative">
                {formData.schoolStamp ? (
                  <>
                    <img src={formData.schoolStamp} alt="Stamp" className="w-full h-full object-contain p-2" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button 
                        onClick={() => setFormData({ ...formData, schoolStamp: '' })}
                        className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </>
                ) : (
                  <span className="text-gray-300 font-bold text-[10px] uppercase tracking-widest">No Stamp</span>
                )}
              </div>
              <label className="w-full">
                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'schoolStamp')} />
                <div className="flex items-center justify-center w-full px-4 py-2 border border-gray-300 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50 cursor-pointer transition-colors">
                  <Upload size={16} className="mr-2" /> Upload Stamp
                </div>
              </label>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
