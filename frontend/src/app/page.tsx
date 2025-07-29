"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, Shield, ShieldAlert, Zap, TrendingUp, Clock, CheckCircle, AlertTriangle, Loader2 } from "lucide-react"

interface PredictionResult {
  isSpam: boolean
  confidence: number
  riskFactors: string[]
  processingTime: number
}

export default function SpamDetector() {
  const [emailContent, setEmailContent] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<PredictionResult | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Replace the existing analyzeEmail function with this:
  const analyzeEmail = async () => {
    setIsAnalyzing(true)
    setShowResult(false)

    try {
      // Make API call to your backend
      const response = await fetch("http://localhost:8000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email_content: emailContent
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("Backend response:", data) // Debug log

      // Map backend response to frontend format
      // Backend returns: {"prediction": 0} where 0 = spam, 1 = not spam
      const prediction = Number(data.prediction)
      const apiResult: PredictionResult = {
        isSpam: prediction === 0,
        confidence: prediction === 0 ? 85 : 90, // Default confidence levels
        riskFactors: data.risk_factors || data.features || [
          prediction === 0 
            ? "Email classified as spam by ML model" 
            : "Email classified as legitimate by ML model"
        ],
        processingTime: data.processing_time || data.inference_time || 50,
      }
      
      console.log("Processed result:", apiResult) // Debug log

      setResult(apiResult)
      setIsAnalyzing(false)
      setTimeout(() => setShowResult(true), 100)
    } catch (error) {
      console.error("Error analyzing email:", error)
      setIsAnalyzing(false)
      setError("Failed to analyze email. Please try again.")

      // Show error in UI
      setResult({
        isSpam: false,
        confidence: 0,
        riskFactors: ["Connection error - please check your network and try again"],
        processingTime: 0,
      })
      setTimeout(() => setShowResult(true), 100)
    }
  }

  const resetAnalysis = () => {
    setResult(null)
    setShowResult(false)
    setEmailContent("")
    setError(null) // Add this line
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Spam Detector
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Advanced machine learning powered email analysis to detect spam and malicious content with high accuracy
          </p>
        </div>

        {/* Main Analysis Card */}
        <Card className="max-w-4xl mx-auto shadow-2xl border-0">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl flex items-center justify-center gap-2">
              <Mail className="w-6 h-6 text-blue-600" />
              Email Analysis
            </CardTitle>
            <CardDescription className="text-base">
              Paste your email content below for instant spam detection analysis
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Input Section */}
            <div className="space-y-4">
              <Textarea
                placeholder="Paste your email content here... (subject line, body, etc.)"
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
                className="min-h-[200px] text-base border-2 focus:border-blue-500 transition-colors"
                disabled={isAnalyzing}
              />

              <div className="flex gap-3 justify-center">
                <Button
                  onClick={analyzeEmail}
                  disabled={!emailContent.trim() || isAnalyzing}
                  className="px-8 py-3 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5 mr-2" />
                      Analyze Email
                    </>
                  )}
                </Button>

                {result && (
                  <Button
                    onClick={resetAnalysis}
                    variant="outline"
                    className="px-6 py-3 text-lg border-2 hover:bg-gray-50 transition-all duration-300 bg-transparent"
                  >
                    New Analysis
                  </Button>
                )}
              </div>
            </div>

            {/* Loading Animation */}
            {isAnalyzing && (
              <div className="text-center py-8 animate-fade-in">
                <div className="inline-flex items-center gap-3 px-6 py-3 bg-blue-50 rounded-full">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                  <span className="text-blue-700 font-medium">AI is analyzing your email...</span>
                </div>
                <div className="mt-4 max-w-md mx-auto">
                  <Progress value={33} className="h-2" />
                </div>
              </div>
            )}

            {/* Results Section */}
            {result && showResult && (
              <div
                className={`space-y-6 animate-slide-up ${showResult ? "opacity-100" : "opacity-0"} transition-all duration-500`}
              >
                {error && (
                  <Alert className="border-2 border-orange-200 bg-orange-50">
                    <AlertTriangle className="w-6 h-6 text-orange-600" />
                    <AlertDescription className="text-orange-700 text-base">{error}</AlertDescription>
                  </Alert>
                )}
                {/* Main Result */}
                <Alert
                  className={`border-2 ${result.isSpam ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}`}
                >
                  <div className="flex items-center gap-3">
                    {result.isSpam ? (
                      <ShieldAlert className="w-6 h-6 text-red-600" />
                    ) : (
                      <Shield className="w-6 h-6 text-green-600" />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge
                          variant={result.isSpam ? "destructive" : "default"}
                          className={`text-sm px-3 py-1 ${result.isSpam ? "bg-red-600" : "bg-green-600"}`}
                        >
                          {result.isSpam ? "SPAM DETECTED" : "LEGITIMATE EMAIL"}
                        </Badge>
                        <span className={`font-bold text-lg ${result.isSpam ? "text-red-700" : "text-green-700"}`}>
                          {result.confidence}% Confidence
                        </span>
                      </div>
                      <AlertDescription className={`text-base ${result.isSpam ? "text-red-700" : "text-green-700"}`}>
                        {result.isSpam
                          ? "This email shows characteristics of spam or malicious content."
                          : "This email appears to be legitimate and safe."}
                      </AlertDescription>
                    </div>
                  </div>
                </Alert>

                {/* Confidence Meter */}
                <Card className="border-2">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-semibold text-gray-700">Confidence Level</span>
                      <span className="text-2xl font-bold text-gray-800">{result.confidence}%</span>
                    </div>
                    <Progress
                      value={result.confidence}
                      className={`h-4 ${result.isSpam ? "[&>div]:bg-red-500" : "[&>div]:bg-green-500"}`}
                    />
                  </CardContent>
                </Card>

                {/* Risk Factors */}
                <Card className="border-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      Analysis Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {result.riskFactors.map((factor, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className={`w-2 h-2 rounded-full ${result.isSpam ? "bg-red-500" : "bg-green-500"}`} />
                        <span className="text-gray-700">{factor}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>

              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slide-up {
          from { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
        }
      `}</style>
    </div>
  )
}
