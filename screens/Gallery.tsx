import React from 'react';
import { useAppStore } from '../store';
import { Card, Header, PageContainer } from '../components/Components';
import { Trash2, ImageIcon } from 'lucide-react';

export const MedGalleryScreen: React.FC = () => {
  const { gallery, deleteFromGallery } = useAppStore();

  return (
    <PageContainer>
      <Header title="Med Gallery" showBack={true} />
      <div className="p-4">
        {gallery.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-20 text-slate-400 dark:text-slate-600">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
              <ImageIcon size={40} />
            </div>
            <p className="text-lg">No photos yet.</p>
            <p className="text-sm">Take a photo of your tablet before taking it.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {gallery.map(item => (
              <div key={item.id} className="relative group">
                <div className="aspect-square bg-slate-200 dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm">
                  <img src={item.imageData} alt="Medicine" className="w-full h-full object-cover" />
                </div>
                <div className="mt-2 flex justify-between items-start px-1">
                   <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      {new Date(item.timestamp).toLocaleDateString()}
                      <br/>
                      {new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                   </p>
                   <button 
                      onClick={() => deleteFromGallery(item.id)}
                      className="text-red-400 hover:text-red-600 p-1"
                   >
                      <Trash2 size={16} />
                   </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
};