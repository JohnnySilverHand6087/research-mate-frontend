
import React, { useRef, useState } from 'react';
import { Camera, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { cn } from '@/lib/utils';

interface AvatarUploadProps {
  currentAvatarUrl?: string;
  onUpload: (file: File) => Promise<void>;
  isUploading: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const AvatarUpload: React.FC<AvatarUploadProps> = ({
  currentAvatarUrl,
  onUpload,
  isUploading,
  className,
  size = 'md',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    try {
      await onUpload(file);
      setPreviewUrl(null);
    } catch (error) {
      setPreviewUrl(null);
    }
  };

  const avatarSrc = previewUrl || currentAvatarUrl;

  return (
    <div className={cn('relative', className)}>
      <div
        className={cn(
          'relative overflow-hidden rounded-full bg-muted flex items-center justify-center glass-effect',
          sizeClasses[size]
        )}
      >
        {avatarSrc ? (
          <img
            src={avatarSrc}
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        ) : (
          <User className="w-1/2 h-1/2 text-muted-foreground" />
        )}
        
        {isUploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <LoadingSpinner className="text-white" size="sm" />
          </div>
        )}
      </div>

      <Button
        size="sm"
        variant="secondary"
        className="absolute -bottom-2 -right-2 rounded-full p-2 h-auto w-auto shadow-md"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
      >
        <Camera className="w-3 h-3" />
      </Button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};
