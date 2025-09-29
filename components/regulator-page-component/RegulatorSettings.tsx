import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { Save, AlertCircle, Building2 } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

interface OrganizationData {
  id: string;
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
  const [editing, setEditing] = useState(false);
  const [originalSettings, setOriginalSettings] = useState<OrganizationData | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/regulator/settings');

        if (response.ok) {
          const data = await response.json();
          console.log('Fetched organization data:', data); // Debug log

          setSettings({
            id: data.id || "",
            contactEmail: data.contactEmail || "",
            contactPhone: data.contactPhone || "",
            contactPersonName: data.contactPersonName || "",
            address: data.address || "",
            country: data.country || "",
            state: data.state || "",
            agencyName: data.agencyName || "",
            officialId: data.officialId || "",
            isVerified: data.isVerified || false,
            isActive: data.isActive !== undefined ? data.isActive : true
          });
        } else if (response.status === 404) {
          // Organization not found - this is expected for new organizations
          console.log('No regulator organization found, using default settings');
          setError('No organization found. Please contact your administrator to set up your regulatory agency.');
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
    if (successMessage) setSuccessMessage(null);
  };

  const handleEditClick = () => {
    setOriginalSettings(settings); // Save current state for cancel
    setEditing(true);
    setSuccessMessage(null);
    setError(null);
  };

  const handleCancelEdit = () => {
    if (originalSettings) setSettings(originalSettings);
    setEditing(false);
    setSuccessMessage(null);
    setError(null);
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
        const org = data.organization || data;
        setSettings({
          id: org.id || "",
          contactEmail: org.contactEmail || "",
          contactPhone: org.contactPhone || "",
          contactPersonName: org.contactPersonName || "",
          address: org.address || "",
          country: org.country || "",
          state: org.state || "",
          agencyName: org.agencyName || "",
          officialId: org.officialId || "",
          isVerified: org.isVerified || false,
          isActive: org.isActive !== undefined ? org.isActive : true
        });
        setSuccessMessage('Settings saved successfully!');
        setEditing(false);
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
        <div className="flex justify-between items-center">
          <h1 className="font-montserrat font-bold text-3xl text-foreground">Settings</h1> 
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Loading Settings...</CardTitle>
            <CardDescription>Please wait while we load your organization settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
                  <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
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
      <div className="flex justify-between items-center">
        <h1 className="font-montserrat font-bold text-3xl text-foreground">Settings</h1>
        {/* Hide ThemeToggle on mobile, show on desktop */}
        <div className="hidden sm:block">
          <ThemeToggle />
        </div>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-800 dark:text-red-200">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {successMessage && (
        <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
              <Save className="h-4 w-4" />
              <span>{successMessage}</span>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Organization Settings
          </CardTitle>
          <CardDescription>Manage your regulatory agency information and contact details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div className="space-y-2">
                <Label htmlFor="agency-name">Agency Name</Label>
                <Input
                  id="agency-name"
                  value={settings.agencyName || ''}
                  onChange={(e) => handleInputChange('agencyName', e.target.value)}
                  placeholder="e.g., NAFDAC, FDA"
                  disabled={!editing}
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
                  disabled={!editing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact-phone">Contact Phone</Label>
                <Input
                  id="contact-phone"
                  value={settings.contactPhone || ''}
                  onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                  placeholder="Enter contact phone"
                  disabled={!editing}
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
                  disabled={!editing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="official-id">Official ID</Label>
                <Input
                  id="official-id"
                  value={settings.officialId || ''}
                  onChange={(e) => handleInputChange('officialId', e.target.value)}
                  placeholder="Enter official identification"
                  disabled={!editing}
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
                disabled={!editing}
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
                  disabled={!editing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State/Region</Label>
                <Input
                  id="state"
                  value={settings.state || ''}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  placeholder="Enter state or region"
                  disabled={!editing}
                />
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
                  <div className="text-sm text-muted-foreground">
                    <p>Status: <Badge variant={settings.isActive ? 'default' : 'destructive'}>
                      {settings.isActive ? 'Active' : 'Inactive'}
                    </Badge></p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>Verified: <Badge variant={settings.isVerified ? 'default' : 'secondary'}>
                      {settings.isVerified ? 'Verified' : 'Pending'}
                    </Badge></p>
                  </div>
                </div>

                {!editing ? (
                  <Button
                    onClick={handleEditClick}
                    className="min-w-[120px] w-full sm:w-auto cursor-pointer"
                  >
                    Edit Settings
                  </Button>
                ) : (
                  <div className="flex flex-col gap-2 w-full sm:flex-row sm:w-auto">
                    <Button
                      onClick={handleSaveSettings}
                      disabled={saving}
                      className="min-w-[120px] w-full sm:w-auto cursor-pointer"
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
                    <Button
                      onClick={handleCancelEdit}
                      variant="outline"
                      className="min-w-[120px] w-full sm:w-auto cursor-pointer"
                      disabled={saving}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegulatorSettings;
