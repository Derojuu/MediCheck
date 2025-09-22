import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useState, useEffect } from "react"
import { Save, AlertCircle } from "lucide-react"

interface OrganizationData {
  id: string;
  companyName: string;
  contactEmail: string;
  contactPhone: string | null;
  contactPersonName: string | null;
  address: string;
  country: string;
  state: string | null;
  agencyName: string | null;
  officialId: string | null;
  isVerified: boolean;
  isActive: boolean;
}

const RegulatorSettings = () => {
  const [settings, setSettings] = useState<OrganizationData>({
    id: "",
    companyName: "",
    contactEmail: "",
    contactPhone: "",
    contactPersonName: "",
    address: "",
    country: "",
    state: "",
    agencyName: "",
    officialId: "",
    isVerified: false,
    isActive: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/regulator/settings');

        if (response.ok) {
          const data = await response.json();
          setSettings(data);
        } else if (response.status === 404) {
          // Organization not found - this is expected for new organizations
          // Don't show an error, just use default empty settings
          console.log('No regulator organization found, using default settings');
        } else {
          const errorData = await response.json();
          setError(errorData.error || 'Failed to fetch settings');
        }
      } catch (error) {
        console.error('Error fetching regulator settings:', error);
        setError('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleInputChange = (field: keyof OrganizationData, value: string) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear any success message when user starts editing
    if (successMessage) {
      setSuccessMessage(null);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccessMessage(null);

      const response = await fetch('/api/regulator/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companyName: settings.companyName,
          contactEmail: settings.contactEmail,
          contactPhone: settings.contactPhone,
          contactPersonName: settings.contactPersonName,
          address: settings.address,
          country: settings.country,
          state: settings.state,
          agencyName: settings.agencyName,
          officialId: settings.officialId
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSettings(data.organization);
        setSuccessMessage('Settings saved successfully!');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving regulator settings:', error);
      setError('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="font-montserrat font-bold text-3xl text-foreground">Settings</h1>
        <Card>
          <CardHeader>
            <CardTitle>Regulatory Agency Settings</CardTitle>
            <CardDescription>Loading settings...</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="font-montserrat font-bold text-3xl text-foreground">Settings</h1>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {successMessage && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-green-800">
              <Save className="h-4 w-4" />
              <span>{successMessage}</span>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Regulatory Agency Settings</CardTitle>
          <CardDescription>Manage regulatory system preferences and configurations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="company-name">Organization Name *</Label>
                <Input
                  id="company-name"
                  value={settings.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  placeholder="Enter organization name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="agency-name">Agency Name</Label>
                <Input
                  id="agency-name"
                  value={settings.agencyName || ''}
                  onChange={(e) => handleInputChange('agencyName', e.target.value)}
                  placeholder="e.g., NAFDAC, FDA"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="contact-email">Contact Email *</Label>
                <Input
                  id="contact-email"
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                  placeholder="Enter contact email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact-phone">Contact Phone</Label>
                <Input
                  id="contact-phone"
                  value={settings.contactPhone || ''}
                  onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                  placeholder="Enter contact phone"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="contact-person">Contact Person Name</Label>
                <Input
                  id="contact-person"
                  value={settings.contactPersonName || ''}
                  onChange={(e) => handleInputChange('contactPersonName', e.target.value)}
                  placeholder="Enter contact person name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="official-id">Official ID</Label>
                <Input
                  id="official-id"
                  value={settings.officialId || ''}
                  onChange={(e) => handleInputChange('officialId', e.target.value)}
                  placeholder="Enter official identification"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <Textarea
                id="address"
                value={settings.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Enter complete address"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="country">Country *</Label>
                <Input
                  id="country"
                  value={settings.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  placeholder="Enter country"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State/Region</Label>
                <Input
                  id="state"
                  value={settings.state || ''}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  placeholder="Enter state or region"
                />
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  <p>Status: <span className={settings.isActive ? 'text-green-600' : 'text-red-600'}>
                    {settings.isActive ? 'Active' : 'Inactive'}
                  </span></p>
                  <p>Verified: <span className={settings.isVerified ? 'text-green-600' : 'text-orange-600'}>
                    {settings.isVerified ? 'Yes' : 'Pending'}
                  </span></p>
                </div>

                <Button
                  onClick={handleSaveSettings}
                  disabled={saving}
                  className="min-w-[120px]"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Settings
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegulatorSettings;