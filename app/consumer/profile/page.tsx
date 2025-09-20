"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Shield,
  User,
  MessageCircle,
  History,
  Settings,
  Scan,
  Calendar,
  MapPin,
  CheckCircle,
  AlertTriangle,
  Bell,
  LogOut,
  Mic,
  MicOff,
  X,
} from "lucide-react"
import Link from "next/link";
import { authRoutes } from "@/utils"
import { useClerk } from "@clerk/nextjs"
import { consumerRoutes } from "@/utils"

export default function ConsumerProfile() {

  const [activeTab, setActiveTab] = useState("profile");
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [scanHistory, setScanHistory] = useState<any[]>([]);
  const [isScanHistoryLoading, setIsScanHistoryLoading] = useState(false);

  // Editable profile fields
  const [editableProfile, setEditableProfile] = useState({
    fullName: "",
    phoneNumber: "",
    address: "",
  });
  const [isProfileSaving, setIsProfileSaving] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const { signOut } = useClerk();

  // Chatbot state variables
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [chatInput, setChatInput] = useState("")
  const [isAILoading, setIsAILoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [chatUserProfile, setChatUserProfile] = useState({
    weight: "",
    age: "",
    currentMedications: [] as string[]
  })

  const recognitionRef = useRef<any>(null)

  // Chat message interface
  interface ChatMessage {
    type: "user" | "ai"
    content: string
    timestamp: string
  }

  // Available languages
  const languages = [
    "English",
    "Spanish", 
    "French",
    "German",
    "Portuguese",
    "Italian",
    "Dutch",
    "Russian",
    "Chinese",
    "Japanese",
    "Arabic",
    "Hindi"
  ];

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/consumer/profile');
        if (response.ok) {
          const profileData = await response.json();
          setUserProfile(profileData);
          setSelectedLanguage(profileData.language || "English");
          
          // Initialize editable profile fields with current data
          setEditableProfile({
            fullName: profileData.name || "",
            phoneNumber: profileData.phoneNumber || "",
            address: profileData.address || "",
          });
        } else {
          console.error('Failed to fetch profile');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Update editable fields when userProfile changes
  useEffect(() => {
    if (userProfile) {
      setEditableProfile({
        fullName: userProfile.name || "",
        phoneNumber: userProfile.phoneNumber || "",
        address: userProfile.address || "",
      });
    }
  }, [userProfile]);

  // Update profile function
  const updateProfile = async () => {
    try {
      const response = await fetch('/api/consumer/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          language: selectedLanguage,
        }),
      });

      if (response.ok) {
        // Store language preference locally as well
        localStorage.setItem('preferredLanguage', selectedLanguage);
        
        // Update the userProfile state
        setUserProfile((prev: any) => ({
          ...prev,
          language: selectedLanguage
        }));
        
        showToastNotification('Profile updated successfully!');
      } else {
        showToastNotification('Failed to update profile', 'error');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      showToastNotification('Error updating profile', 'error');
    }
  };

  // Save profile changes function
  const saveProfileChanges = async () => {
    try {
      setIsProfileSaving(true);
      const response = await fetch('/api/consumer/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: editableProfile.fullName,
          phoneNumber: editableProfile.phoneNumber,
          address: editableProfile.address,
          language: selectedLanguage,
        }),
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        
        // Update the userProfile state
        setUserProfile((prev: any) => ({
          ...prev,
          name: editableProfile.fullName,
          phoneNumber: editableProfile.phoneNumber,
          address: editableProfile.address,
          language: selectedLanguage
        }));
        
        // Store language preference locally as well
        localStorage.setItem('preferredLanguage', selectedLanguage);
        
        // Exit edit mode
        setIsEditingProfile(false);
        
        showToastNotification('Profile saved successfully!');
      } else {
        const error = await response.json();
        showToastNotification('Failed to save profile: ' + (error.message || 'Unknown error'), 'error');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      showToastNotification('Error saving profile', 'error');
    } finally {
      setIsProfileSaving(false);
    }
  };

  // Enable edit mode
  const enableEditMode = () => {
    setIsEditingProfile(true);
  };

  // Cancel edit mode and reset fields
  const cancelEditMode = () => {
    setIsEditingProfile(false);
    // Reset editable fields to current profile data
    if (userProfile) {
      setEditableProfile({
        fullName: userProfile.name || "",
        phoneNumber: userProfile.phoneNumber || "",
        address: userProfile.address || "",
      });
    }
  };

  // Show toast notification
  const showToastNotification = (message: string, type: "success" | "error" = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    // Auto hide after 3 seconds
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  // Fetch scan history data
  const fetchScanHistory = async () => {
    try {
      setIsScanHistoryLoading(true);
      const response = await fetch('/api/consumer/scan-history');
      if (response.ok) {
        const historyData = await response.json();
        setScanHistory(historyData);
      } else {
        console.error('Failed to fetch scan history');
      }
    } catch (error) {
      console.error('Error fetching scan history:', error);
    } finally {
      setIsScanHistoryLoading(false);
    }
  };

  // Fetch scan history when history tab is accessed or refresh manually
  useEffect(() => {
    if (activeTab === 'history') {
      fetchScanHistory();
    }
  }, [activeTab]);

  // Add refresh function for manual refresh
  const refreshScanHistory = () => {
    fetchScanHistory();
  };

  const getResultColor = (result: string) => {
    switch (result) {
      case "GENUINE":
        return "bg-green-100 text-green-800"
      case "SUSPICIOUS":
        return "bg-yellow-100 text-yellow-800"
      case "COUNTERFEIT":
        return "bg-red-100 text-red-800"
      case "EXPIRED":
        return "bg-orange-100 text-orange-800"
      case "NOT_FOUND":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Load chat messages from localStorage on component mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('consumerProfileChatMessages')
    if (savedMessages) {
      try {
        setChatMessages(JSON.parse(savedMessages))
      } catch (error) {
        console.error('Error loading chat messages:', error)
      }
    }
  }, [])

  // Save chat messages to localStorage whenever they change
  useEffect(() => {
    if (chatMessages.length > 0) {
      localStorage.setItem('consumerProfileChatMessages', JSON.stringify(chatMessages))
    }
  }, [chatMessages])

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition()
        
        recognition.continuous = false
        recognition.interimResults = false
        recognition.lang = "en-US"
        
        recognition.onstart = () => {
          setIsListening(true)
        }
        
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript
          setChatInput(transcript)
          setIsListening(false)
        }
        
        recognition.onend = () => {
          setIsListening(false)
        }
        
        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error)
          setIsListening(false)
        }
        
        recognitionRef.current = recognition
      }
    }
  }, [])

  // Voice input functions
  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start()
      } catch (error) {
        console.error('Error starting speech recognition:', error)
      }
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
    }
  }

  // Check if speech recognition is supported
  const isSpeechRecognitionSupported = () => {
    return typeof window !== 'undefined' && 
           ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)
  }

  // Clear chat function with localStorage cleanup
  const clearChat = () => {
    setChatMessages([])
    localStorage.removeItem('consumerProfileChatMessages')
  }

  // Send chat message function
  const sendChatMessage = async () => {
    if (!chatInput.trim() || isAILoading) return

    const userMessage: ChatMessage = { 
      type: "user", 
      content: chatInput,
      timestamp: new Date().toISOString()
    }
    
    setChatMessages(prev => [...prev, userMessage])
    
    const currentInput = chatInput
    setChatInput("")
    setIsAILoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentInput,
          userProfile: chatUserProfile,
          features: {
            drugInteractionCheck: true,
            dosageCalculation: true
          }
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get AI response')
      }

      const data = await response.json()
      
      const aiResponse: ChatMessage = {
        type: "ai",
        content: data.message,
        timestamp: new Date().toISOString()
      }

      setChatMessages(prev => [...prev, aiResponse])
      
    } catch (error) {
      console.error('Error sending message:', error)
      
      const fallbackResponse: ChatMessage = {
        type: "ai",
        content: "I'm sorry, I'm having trouble connecting right now. Please consult your healthcare provider or pharmacist for medication guidance.",
        timestamp: new Date().toISOString()
      }
      
      setChatMessages(prev => [...prev, fallbackResponse])
    } finally {
      setIsAILoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-32 right-32 w-64 h-64 bg-primary/5 rounded-full blur-2xl"></div>
        <div className="absolute bottom-40 left-40 w-80 h-80 bg-accent/4 rounded-full blur-3xl"></div>
        <div className="absolute top-2/3 right-1/4 w-48 h-48 bg-primary/6 rounded-full blur-xl"></div>
      </div>
      
      {/* Navigation */}
      <nav className="border-b bg-card/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-primary" />
              <span className="font-bold text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">MedChain</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href={consumerRoutes.scan}>
                <Button variant="outline" className="border-primary/20 hover:border-primary/40 hover:bg-primary/5 cursor-pointer">
                  <Scan className="h-4 w-4 mr-2 text-primary" />
                  Scan Medicine
                </Button>
              </Link>
              <ThemeToggle />
              <Button 
                variant="ghost"
                className="cursor-pointer hover:bg-primary/5"
                onClick={() => signOut({ redirectUrl: authRoutes.login })}
              >
                <LogOut className="h-4 w-4 mr-2 text-primary" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="font-bold text-2xl sm:text-3xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">My Profile</h1>
          <p className="text-muted-foreground text-sm sm:text-base">Manage your account and view your medication verification history</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
            <TabsTrigger value="profile" className="text-xs sm:text-sm">Profile</TabsTrigger>
            <TabsTrigger value="history" className="text-xs sm:text-sm">History</TabsTrigger>
            <TabsTrigger value="ai-chat" className="text-xs sm:text-sm">AI Chat</TabsTrigger>
            <TabsTrigger value="settings" className="text-xs sm:text-sm">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 border-2 border-primary/10 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <CardTitle className="flex items-center font-bold">
                    <User className="h-5 w-5 mr-2 text-primary" />
                    <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Profile Information</span>
                  </CardTitle>
                  <CardDescription>Update your personal information and preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isLoading ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Full Name</Label>
                          <div className="h-9 bg-muted animate-pulse rounded-md"></div>
                        </div>
                        <div>
                          <Label>Phone Number</Label>
                          <div className="h-9 bg-muted animate-pulse rounded-md"></div>
                        </div>
                      </div>
                      <div>
                        <Label>Preferred Language</Label>
                        <div className="h-9 bg-muted animate-pulse rounded-md"></div>
                      </div>
                    </div>
                  ) : userProfile ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Full Name</Label>
                          <Input id="name" value={userProfile.name || ''} readOnly />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input id="phone" value={userProfile.phoneNumber || 'Not provided'} readOnly />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="address">Address</Label>
                          <Input id="address" value={userProfile.address || 'Not provided'} readOnly />
                        </div>
                        <div>
                          <Label htmlFor="country">Country</Label>
                          <Input id="country" value={userProfile.country || 'Not provided'} readOnly />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="language">Preferred Language</Label>
                        <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select your preferred language" />
                          </SelectTrigger>
                          <SelectContent>
                            {languages.map((language) => (
                              <SelectItem key={language} value={language}>
                                {language}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Button 
                        onClick={updateProfile}
                        className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        Update Profile
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-muted-foreground">Failed to load profile data</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-2 border-primary/10 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <CardTitle className="font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Account Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isLoading ? (
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-muted animate-pulse rounded-full mx-auto mb-4"></div>
                        <div className="h-4 bg-muted animate-pulse rounded mx-auto mb-2 w-24"></div>
                        <div className="h-3 bg-muted animate-pulse rounded mx-auto w-20"></div>
                      </div>
                      <div className="space-y-3">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className="flex justify-between">
                            <div className="h-3 bg-muted animate-pulse rounded w-20"></div>
                            <div className="h-3 bg-muted animate-pulse rounded w-12"></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : userProfile ? (
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                          <User className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="font-semibold">{userProfile.name}</h3>
                        <p className="text-sm text-muted-foreground">Consumer Account</p>
                      </div>

                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Member Since:</span>
                          <span className="font-medium">{userProfile.joinDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total Scans:</span>
                          <span className="font-medium">{userProfile.totalScans}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Phone:</span>
                          <span className="font-medium">{userProfile.phoneNumber || 'Not provided'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Country:</span>
                          <span className="font-medium">{userProfile.country || 'Not provided'}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-muted-foreground">Failed to load data</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      <History className="h-5 w-5 mr-2" />
                      Scan History
                    </CardTitle>
                    <CardDescription>All your medication verification records</CardDescription>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={refreshScanHistory}
                    disabled={isScanHistoryLoading}
                    className="text-primary hover:bg-primary/10"
                  >
                    {isScanHistoryLoading ? 'Refreshing...' : 'Refresh'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {isScanHistoryLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center justify-between p-4 border rounded-lg animate-pulse">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-muted rounded-lg"></div>
                          <div className="space-y-2">
                            <div className="h-4 bg-muted rounded w-32"></div>
                            <div className="h-3 bg-muted rounded w-24"></div>
                            <div className="h-3 bg-muted rounded w-20"></div>
                          </div>
                        </div>
                        <div className="text-right space-y-2">
                          <div className="h-6 bg-muted rounded w-20"></div>
                          <div className="h-3 bg-muted rounded w-16"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : scanHistory.length > 0 ? (
                  <div className="space-y-4">
                    {scanHistory.map((scan) => (
                      <div key={scan.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Scan className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{scan.batchId}</p>
                            <p className="text-sm text-muted-foreground">{scan.drugName}</p>
                            <p className="text-xs text-muted-foreground">{scan.manufacturer}</p>
                            <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                              <span className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                {scan.scanDate}
                              </span>
                              <span className="flex items-center">
                                <MapPin className="h-3 w-3 mr-1" />
                                {scan.location}
                              </span>
                              {scan.serialNumber && (
                                <span className="text-xs">
                                  Serial: {scan.serialNumber}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={getResultColor(scan.scanStatus)}>
                            {scan.scanStatus === "GENUINE" && <CheckCircle className="h-3 w-3 mr-1" />}
                            {(scan.scanStatus === "SUSPICIOUS" || scan.scanStatus === "EXPIRED") && <AlertTriangle className="h-3 w-3 mr-1" />}
                            {scan.scanStatus}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">Expires: {scan.expiryDate}</p>
                          {scan.warning && <p className="text-xs text-yellow-600 mt-1">{scan.warning}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Scan className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No scan history found</p>
                    <p className="text-sm text-muted-foreground mt-1">Start scanning medications to see your history here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai-chat" className="space-y-6">
            <Card className="border-2 border-primary/10 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2 font-bold">
                    <MessageCircle className="w-5 h-5 text-primary" />
                    <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">AI Health Assistant</span>
                  </CardTitle>
                  {chatMessages.length > 0 && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={clearChat}
                      className="text-xs border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400"
                    >
                      <X className="w-3 h-3 mr-1" />
                      Clear Chat
                    </Button>
                  )}
                </div>
                <CardDescription>Get personalized medication guidance and safety information</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Chat Messages */}
                <div className="space-y-3 h-96 overflow-y-auto border rounded-lg p-4 bg-gradient-to-br from-slate-50 to-cyan-50">
                  {chatMessages.length === 0 ? (
                    <div className="text-center text-slate-500 py-8">
                      <MessageCircle className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                      <p className="text-sm mb-2">Welcome to your AI Health Assistant!</p>
                      <p className="text-xs">Ask me about:</p>
                      <ul className="text-xs mt-2 space-y-1 text-left max-w-xs mx-auto">
                        <li>• Medication usage instructions</li>
                        <li>• Side effects and safety information</li>
                        <li>• Drug interactions</li>
                        <li>• Dosage guidance</li>
                        <li>• Storage recommendations</li>
                      </ul>
                    </div>
                  ) : (
                    <>
                      {chatMessages.map((message: ChatMessage, index: number) => (
                        <div key={index} className={`flex flex-col ${message.type === "user" ? "items-end" : "items-start"}`}>
                          <div
                            className={`max-w-xs p-3 rounded-lg ${
                              message.type === "user" 
                                ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg" 
                                : "bg-gradient-to-r from-slate-600 to-slate-700 text-white border border-slate-500 shadow-lg"
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                          </div>
                          <span className="text-xs text-slate-400 mt-1">
                            {new Date(message.timestamp).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                        </div>
                      ))}
                      
                      {/* AI Typing Indicator */}
                      {isAILoading && (
                        <div className="flex justify-start">
                          <div className="bg-gradient-to-r from-slate-600 to-slate-700 text-white border border-slate-500 p-3 rounded-lg">
                            <div className="flex items-center space-x-1">
                              <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                              </div>
                              <span className="text-xs text-slate-200 ml-2">AI is thinking...</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Chat Input */}
                <div className="flex space-x-2">
                  <div className="flex-1 relative">
                    <Input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && !isAILoading && sendChatMessage()}
                      placeholder="Ask about medications, dosage, side effects..."
                      disabled={isAILoading || isListening}
                      className={`w-full transition-colors duration-200 disabled:opacity-50 ${
                        isListening 
                          ? "border-red-400 bg-red-50" 
                          : "border-primary/20 focus:border-primary/40 hover:border-primary/30"
                      }`}
                    />
                    {isListening && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                          <span className="text-xs text-red-600">Listening...</span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {isSpeechRecognitionSupported() && (
                    <Button
                      onClick={isListening ? stopListening : startListening}
                      size="sm"
                      variant="outline"
                      disabled={isAILoading}
                      className={`cursor-pointer transition-colors ${
                        isListening 
                          ? "bg-red-100 border-red-300 text-red-600 hover:bg-red-200" 
                          : "border-primary/20 hover:border-primary/40 hover:bg-primary/5"
                      }`}
                    >
                      {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </Button>
                  )}
                  
                  <Button 
                    onClick={sendChatMessage} 
                    disabled={isAILoading || !chatInput.trim()}
                    className="cursor-pointer bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAILoading ? (
                      <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-sm">AI...</span>
                      </div>
                    ) : (
                      <>
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Send
                      </>
                    )}
                  </Button>
                </div>

                {/* Quick Action Buttons */}
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setChatInput("What are the side effects of paracetamol?")}
                    className="text-xs border-primary/20 hover:border-primary/40 hover:bg-primary/5"
                  >
                    Common Side Effects
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setChatInput("How should I store my medications?")}
                    className="text-xs border-primary/20 hover:border-primary/40 hover:bg-primary/5"
                  >
                    Storage Tips
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setChatInput("Can I take multiple medications together?")}
                    className="text-xs border-primary/20 hover:border-primary/40 hover:bg-primary/5"
                  >
                    Drug Interactions
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Consumer Settings
                </CardTitle>
                <CardDescription>Manage your consumer profile preferences and configurations</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="space-y-2">
                        <div className="h-4 bg-muted animate-pulse rounded w-24"></div>
                        <div className="h-9 bg-muted animate-pulse rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : userProfile ? (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="consumer-name">Full Name</Label>
                      {isEditingProfile ? (
                        <Input 
                          id="consumer-name" 
                          value={editableProfile.fullName} 
                          onChange={(e) => setEditableProfile(prev => ({ ...prev, fullName: e.target.value }))}
                          className="border-green-200 focus:border-green-400 dark:border-green-700 dark:focus:border-green-500"
                        />
                      ) : (
                        <Input id="consumer-name" value={userProfile.name || 'Not provided'} readOnly className="bg-slate-100 dark:bg-slate-800" />
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone-number">Phone Number</Label>
                      {isEditingProfile ? (
                        <Input 
                          id="phone-number" 
                          value={editableProfile.phoneNumber} 
                          onChange={(e) => setEditableProfile(prev => ({ ...prev, phoneNumber: e.target.value }))}
                          className="border-green-200 focus:border-green-400 dark:border-green-700 dark:focus:border-green-500"
                        />
                      ) : (
                        <Input id="phone-number" value={userProfile.phoneNumber || 'Not provided'} readOnly className="bg-slate-100 dark:bg-slate-800" />
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="date-of-birth">Date of Birth</Label>
                      <Input id="date-of-birth" value={userProfile.dateOfBirth ?? 'Not provided'} readOnly className="bg-slate-100 dark:bg-slate-800" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="consumer-address">Address</Label>
                      {isEditingProfile ? (
                        <Input 
                          id="consumer-address" 
                          value={editableProfile.address} 
                          onChange={(e) => setEditableProfile(prev => ({ ...prev, address: e.target.value }))}
                          className="border-green-200 focus:border-green-400 dark:border-green-700 dark:focus:border-green-500"
                        />
                      ) : (
                        <Input id="consumer-address" value={userProfile.address || 'Not provided'} readOnly className="bg-slate-100 dark:bg-slate-800" />
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="consumer-country">Country</Label>
                      <Input id="consumer-country" value={userProfile.country ?? 'Not provided'} readOnly className="bg-slate-100 dark:bg-slate-800" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="consumer-state">State</Label>
                      <Input id="consumer-state" value={userProfile.state ?? 'Not provided'} readOnly className="bg-slate-100 dark:bg-slate-800" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="join-date">Member Since</Label>
                      <Input id="join-date" value={userProfile.joinDate ?? ''} readOnly className="bg-slate-100 dark:bg-slate-800" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="total-scans">Total Scans</Label>
                      <Input id="total-scans" value={userProfile.totalScans?.toString() ?? '0'} readOnly className="bg-slate-100 dark:bg-slate-800" />
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      {!isEditingProfile ? (
                        <Button 
                          onClick={enableEditMode}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          Edit Profile
                        </Button>
                      ) : (
                        <>
                          <Button 
                            onClick={saveProfileChanges}
                            disabled={isProfileSaving}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            {isProfileSaving ? 'Saving...' : 'Save Changes'}
                          </Button>
                          <Button 
                            onClick={cancelEditMode}
                            variant="outline"
                            disabled={isProfileSaving}
                          >
                            Cancel
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">Failed to load profile settings</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg border transition-all duration-300 transform animate-in slide-in-from-right ${
          toastType === 'success' 
            ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-950 dark:border-green-800 dark:text-green-200' 
            : 'bg-red-50 border-red-200 text-red-800 dark:bg-red-950 dark:border-red-800 dark:text-red-200'
        }`}>
          <div className="flex items-center space-x-2">
            {toastType === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
            )}
            <span className="font-medium">{toastMessage}</span>
            <button 
              onClick={() => setShowToast(false)}
              className="ml-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
