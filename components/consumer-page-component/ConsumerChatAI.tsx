"use client"

import { useState, useRef, useEffect } from "react"
import { MessageCircle, Mic, MicOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ChatMessage {
  type: "user" | "ai"
  content: string
  timestamp: string
}

interface ScanResult {
  id: string
  status: "genuine" | "suspicious" | "fake"
  drugName: string
  batchId: string
  manufacturer: string
  expiryDate: string
  verificationScore: number
  safetyRating: string
  aiRecommendation: string
  sideEffects: string[]
  dosage: string
}

interface ConsumerChatAIProps {
  scanResult: ScanResult | null
  showChat: boolean
}

export function ConsumerChatAI({ scanResult, showChat }: ConsumerChatAIProps) {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [chatInput, setChatInput] = useState("")
  const [isAILoading, setIsAILoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [userProfile, setUserProfile] = useState({
    weight: "",
    age: "",
    currentMedications: [] as string[]
  })
  
  const recognitionRef = useRef<any>(null)

  // Load chat messages from localStorage on component mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('consumerChatMessages')
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
      localStorage.setItem('consumerChatMessages', JSON.stringify(chatMessages))
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

  // Clear chat function with localStorage cleanup
  const clearChat = () => {
    setChatMessages([])
    localStorage.removeItem('consumerChatMessages')
  }

  const sendChatMessage = async () => {
    if (!chatInput.trim() || isAILoading) return

    const userMessage: ChatMessage = { 
      type: "user", 
      content: chatInput,
      timestamp: new Date().toISOString()
    }
    
    // Add user message immediately
    setChatMessages(prev => [...prev, userMessage])
    setChatInput("")
    setIsAILoading(true)

    try {
      // Simulate AI response with contextual information
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      let aiResponse = ""
      const question = chatInput.toLowerCase()

      // Context-aware responses based on scan result
      if (scanResult) {
        if (question.includes("dosage") || question.includes("dose") || question.includes("how much")) {
          aiResponse = `For ${scanResult.drugName}, the recommended dosage is: ${scanResult.dosage}. Always follow your healthcare provider's specific instructions for your condition.`
        } else if (question.includes("side effect") || question.includes("reaction")) {
          aiResponse = `Possible side effects of ${scanResult.drugName} include: ${scanResult.sideEffects.join(", ")}. If you experience any unusual symptoms, consult your healthcare provider immediately.`
        } else if (question.includes("safe") || question.includes("safety")) {
          aiResponse = `Based on the scan, this medication shows: ${scanResult.safetyRating}. ${scanResult.aiRecommendation}`
        } else if (question.includes("expire") || question.includes("expiry")) {
          aiResponse = `This ${scanResult.drugName} expires on ${scanResult.expiryDate}. Check the packaging for storage instructions and do not use after the expiration date.`
        } else if (question.includes("genuine") || question.includes("authentic") || question.includes("real")) {
          aiResponse = `The scan result shows this medication as "${scanResult.status}" with a verification score of ${scanResult.verificationScore}%. ${scanResult.aiRecommendation}`
        } else {
          aiResponse = `I can help you with information about ${scanResult.drugName}. You can ask me about dosage, side effects, safety, or expiration. ${scanResult.aiRecommendation}`
        }
      } else {
        // General responses when no scan result
        if (question.includes("how") && question.includes("scan")) {
          aiResponse = "To scan a medication, click the 'Scan Medication' button and point your camera at the QR code on the medication package. Make sure the code is well-lit and clearly visible."
        } else if (question.includes("what") && question.includes("qr")) {
          aiResponse = "QR codes on medications contain information about the drug, batch number, expiration date, and authenticity. Scanning helps verify if your medication is genuine and safe to use."
        } else if (question.includes("safe") || question.includes("safety")) {
          aiResponse = "Always verify medications before use. Check expiration dates, look for signs of tampering, and only purchase from licensed pharmacies. If you're unsure about a medication's authenticity, consult your pharmacist."
        } else {
          aiResponse = "I'm here to help you with medication verification and safety information. You can ask me about scanning procedures, medication safety, or any concerns about your prescriptions. Scan a medication first to get specific information!"
        }
      }

      const aiMessage: ChatMessage = {
        type: "ai",
        content: aiResponse,
        timestamp: new Date().toISOString()
      }

      setChatMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('Error generating AI response:', error)
      const errorMessage: ChatMessage = {
        type: "ai",
        content: "I'm sorry, I'm having trouble responding right now. Please try again later.",
        timestamp: new Date().toISOString()
      }
      setChatMessages(prev => [...prev, errorMessage])
    } finally {
      setIsAILoading(false)
    }
  }

  const isSpeechRecognitionSupported = () => {
    return typeof window !== 'undefined' && 
           ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)
  }

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

  return (
    <div className={`${showChat ? "block" : "hidden lg:block"}`}>
      <Card className="border-2 border-primary/10 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full">
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
                Clear Chat
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Chat Messages */}
          <div className="space-y-3 h-64 overflow-y-auto">
            {chatMessages.length === 0 ? (
              <div className="text-center text-slate-500 dark:text-slate-400 py-8">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 text-slate-300 dark:text-slate-600" />
                <p className="text-sm">Ask me anything about your medication!</p>
              </div>
            ) : (
              <>
                {chatMessages.map((message: ChatMessage, index: number) => (
                  <div key={index} className={`flex flex-col ${message.type === "user" ? "items-end" : "items-start"}`}>
                    <div
                      className={`max-w-xs p-3 rounded-lg ${
                        message.type === "user" 
                          ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg" 
                          : "bg-slate-100 text-slate-900 border border-slate-200 shadow-lg dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                    <span className="text-xs text-slate-400 dark:text-slate-500 mt-1">
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
                    <div className="bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/10 p-3 rounded-lg">
                      <div className="flex items-center space-x-1">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span className="text-xs text-slate-500 ml-2">AI is thinking...</span>
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
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && !isAILoading && sendChatMessage()}
                placeholder="Ask about dosage, side effects..."
                disabled={isAILoading || isListening}
                className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm transition-colors duration-200 disabled:opacity-50 ${
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
                    ? "bg-red-100 border-red-300 text-red-600 hover:bg-red-200 dark:bg-red-950 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900" 
                    : "border-primary/20 hover:border-primary/40 hover:bg-primary/5"
                }`}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </Button>
            )}
            
            <Button 
              onClick={sendChatMessage} 
              size="sm" 
              disabled={isAILoading || !chatInput.trim()}
              className="cursor-pointer bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAILoading ? (
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>AI...</span>
                </div>
              ) : (
                "Send"
              )}
            </Button>
          </div>

          {/* AI Recommendation */}
          {scanResult && (
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 border-2 border-primary/20 rounded-lg p-4 hover:shadow-md transition-all duration-200 dark:from-primary/5 dark:to-accent/5 dark:border-primary/30">
              <h4 className="font-bold text-primary mb-2">AI Recommendation</h4>
              <p className="text-sm text-slate-800 dark:text-slate-200">{scanResult.aiRecommendation}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}