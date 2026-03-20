import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  placeholder?: string;
  bucket?: string;
  folder?: string;
  className?: string;
}

const ImageUpload = ({ 
  value, 
  onChange, 
  placeholder = "Cliquez pour uploader une image",
  bucket = "uploads",
  folder = "images",
  className = ""
}: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadImage = async (file: File) => {
    setUploading(true);
    
    try {
      // Validation du fichier
      if (!file.type.startsWith('image/')) {
        throw new Error('Le fichier doit être une image');
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB max
        throw new Error('L\'image ne doit pas dépasser 5MB');
      }

      // Génération d'un nom de fichier unique
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      // Upload vers Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Récupération de l'URL publique
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      onChange(publicUrl);
    } catch (error) {
      console.error('Erreur upload:', error);
      alert(error instanceof Error ? error.message : 'Erreur lors de l\'upload');
    } finally {
      setUploading(false);
    }
  };

  const handleFile = (file: File) => {
    if (file) uploadImage(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const removeImage = () => {
    onChange('');
  };

  return (
    <div className={`relative ${className}`}>
      {/* Input caché */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />

      {/* Si une image est déjà uploadée */}
      {value ? (
        <div className="relative group">
          <div className="relative overflow-hidden rounded-xl border-2 border-[#E9ECEF] bg-[#F8F9FA]">
            <img 
              src={value} 
              alt="Image uploadée" 
              className="w-full h-32 object-cover"
            />
            
            {/* Overlay au hover */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2 bg-white/90 rounded-lg hover:bg-white transition-colors"
                title="Changer l'image"
              >
                <Upload size={16} className="text-[#212529]" />
              </button>
              <button
                onClick={removeImage}
                className="p-2 bg-red-500/90 rounded-lg hover:bg-red-500 transition-colors"
                title="Supprimer l'image"
              >
                <X size={16} className="text-white" />
              </button>
            </div>
          </div>
          
          {/* Bouton de suppression rapide */}
          <button
            onClick={removeImage}
            className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
            title="Supprimer"
          >
            <X size={12} />
          </button>
        </div>
      ) : (
        /* Zone d'upload */
        <div
          className={`
            relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200
            ${dragActive 
              ? 'border-[#FF6B35] bg-[#FF6B35]/5' 
              : 'border-[#E9ECEF] bg-[#F8F9FA] hover:border-[#FF6B35]/50 hover:bg-[#FF6B35]/5'
            }
            ${uploading ? 'pointer-events-none opacity-60' : ''}
          `}
          onClick={() => fileInputRef.current?.click()}
          onDragEnter={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setDragActive(false);
          }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 text-[#FF6B35] animate-spin" />
              <p className="text-sm text-[#6C757D]">Upload en cours...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#FF6B35]/20 to-[#1E3A5F]/20 flex items-center justify-center">
                <ImageIcon size={24} className="text-[#6C757D]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#212529] mb-1">
                  {placeholder}
                </p>
                <p className="text-xs text-[#6C757D]">
                  PNG, JPG, GIF jusqu'à 5MB
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
