import { useState, useRef } from 'react';
import { StorageService } from '@/utils/storage';
import { useToast } from '@/hooks/use-toast';

interface LogoUploaderProps {
  currentLogo?: string;
  onLogoChange: (logoBase64: string) => void;
  className?: string;
}

export function LogoUploader({ currentLogo, onLogoChange, className = '' }: LogoUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (file: File) => {
    setIsUploading(true);
    
    try {
      const validation = StorageService.validateImageFile(file);
      if (!validation.valid) {
        toast({
          title: "Invalid File",
          description: validation.error,
          variant: "destructive"
        });
        return;
      }

      const base64 = await StorageService.convertImageToBase64(file);
      console.log('Logo uploaded, base64 length:', base64.length);
      console.log('Logo data URL starts with:', base64.substring(0, 50));
      onLogoChange(base64);
      
      toast({
        title: "Logo Uploaded",
        description: "Your company logo has been updated successfully."
      });
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload logo. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
    
    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const removeLogo = () => {
    onLogoChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-foreground mb-2">
        Company Logo
      </label>
      
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragOver ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}
          ${isUploading ? 'opacity-50 pointer-events-none' : ''}
        `}
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        data-testid="logo-uploader"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
          data-testid="logo-file-input"
        />

        {currentLogo ? (
          <div className="space-y-2">
            <img
              src={currentLogo}
              alt="Company Logo"
              className="max-h-16 mx-auto object-contain"
              data-testid="logo-preview"
            />
            <p className="text-sm text-muted-foreground">
              Click to change logo
            </p>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeLogo();
              }}
              className="text-xs text-destructive hover:text-destructive/80 underline"
              data-testid="button-remove-logo"
            >
              Remove Logo
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {isUploading ? (
              <div className="space-y-2">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-sm text-muted-foreground">Uploading...</p>
              </div>
            ) : (
              <>
                <i className="fas fa-cloud-upload-alt text-3xl text-muted-foreground"></i>
                <p className="text-sm text-muted-foreground">
                  Drag and drop your logo here, or click to browse
                </p>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG, GIF, WebP up to 2MB
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
