import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { CompanyProfile } from '@shared/schema';
import { LogoUploader } from './logo-uploader';
import { StorageService } from '@/utils/storage';
import { useToast } from '@/hooks/use-toast';

interface CompanyProfileFormProps {
  companyProfile: CompanyProfile;
  onUpdate: (updates: Partial<CompanyProfile>) => void;
}

export function CompanyProfileForm({ companyProfile, onUpdate }: CompanyProfileFormProps) {
  const { toast } = useToast();

  const handleSaveProfile = () => {
    try {
      StorageService.saveCompanyProfile(companyProfile);
      toast({
        title: "Profile Saved",
        description: "Your company profile has been saved successfully."
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save company profile. Please try again.",
        variant: "destructive"
      });
    }
  };

  const loadSavedProfiles = () => {
    const profiles = StorageService.getCompanyProfiles();
    if (profiles.length > 0) {
      onUpdate(profiles[0]); // Load the first profile for now
      toast({
        title: "Profile Loaded",
        description: "Company profile loaded successfully."
      });
    } else {
      toast({
        title: "No Profiles Found",
        description: "No saved company profiles found."
      });
    }
  };

  return (
    <div className="bg-card rounded-xl p-6 border border-border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center">
          <i className="fas fa-building mr-2 text-primary"></i>
          Company Profile
        </h2>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={loadSavedProfiles}
            data-testid="button-load-profile"
          >
            <i className="fas fa-folder-open mr-1"></i>
            Load
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleSaveProfile}
            data-testid="button-save-profile"
          >
            <i className="fas fa-save mr-1"></i>
            Save
          </Button>
        </div>
      </div>
      
      <LogoUploader
        currentLogo={companyProfile.logo}
        onLogoChange={(logo) => onUpdate({ logo })}
        className="mb-6"
      />

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="company-name" className="block text-sm font-medium text-foreground mb-2">
            Company Name *
          </label>
          <Input
            id="company-name"
            type="text"
            value={companyProfile.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            placeholder="Your company name"
            data-testid="input-company-name"
          />
        </div>
        
        <div>
          <label htmlFor="company-email" className="block text-sm font-medium text-foreground mb-2">
            Email *
          </label>
          <Input
            id="company-email"
            type="email"
            value={companyProfile.email}
            onChange={(e) => onUpdate({ email: e.target.value })}
            placeholder="company@example.com"
            data-testid="input-company-email"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mt-4">
        <div>
          <label htmlFor="company-phone" className="block text-sm font-medium text-foreground mb-2">
            Phone
          </label>
          <Input
            id="company-phone"
            type="tel"
            value={companyProfile.phone || ''}
            onChange={(e) => onUpdate({ phone: e.target.value })}
            placeholder="+1 (555) 123-4567"
            data-testid="input-company-phone"
          />
        </div>
        <div>
          <label htmlFor="company-website" className="block text-sm font-medium text-foreground mb-2">
            Website
          </label>
          <Input
            id="company-website"
            type="url"
            value={companyProfile.website || ''}
            onChange={(e) => onUpdate({ website: e.target.value })}
            placeholder="www.example.com"
            data-testid="input-company-website"
          />
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="company-address" className="block text-sm font-medium text-foreground mb-2">
          Address
        </label>
        <Textarea
          id="company-address"
          value={companyProfile.address || ''}
          onChange={(e) => onUpdate({ address: e.target.value })}
          placeholder="123 Business St, Suite 100&#10;City, State 12345&#10;Country"
          rows={3}
          className="resize-none"
          data-testid="input-company-address"
        />
      </div>
    </div>
  );
}
