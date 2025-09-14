import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

// Initialize the Gemini AI with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { message, scanResult, userProfile, features } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Get the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Create a context-aware prompt for medication guidance with advanced features
    let prompt = `You are a helpful AI assistant specializing in medication guidance and health information. 
    Please provide accurate, helpful information about medications while always recommending users consult healthcare professionals for medical advice.
    
    User message: "${message}"`;

    // Add scan result context if available
    if (scanResult) {
      prompt += `
      
      Context: The user has just scanned a medication with the following details:
      - Drug Name: ${scanResult.drugName || 'Unknown'}
      - Manufacturer: ${scanResult.manufacturer || 'Unknown'}
      - Batch ID: ${scanResult.batchId || 'Unknown'}
      - Expiry Date: ${scanResult.expiryDate || 'Unknown'}
      - Status: ${scanResult.status || 'Unknown'}
      
      Please provide guidance specific to this medication if relevant to their question.`;
    }

    // Add user profile context for dosage calculations
    if (userProfile && (userProfile.weight || userProfile.age)) {
      prompt += `
      
      User Profile:
      - Weight: ${userProfile.weight || 'Not provided'} kg
      - Age: ${userProfile.age || 'Not provided'} years
      - Current Medications: ${userProfile.currentMedications?.join(', ') || 'None listed'}`;
    }

    // Add advanced feature instructions
    if (features) {
      prompt += `
      
      Advanced Features Enabled:
      ${features.drugInteractionCheck ? '- Check for potential drug interactions if multiple medications are mentioned' : ''}
      ${features.dosageCalculation ? '- Provide dosage calculations based on weight/age when appropriate' : ''}`;
    }

    prompt += `
    
    Important guidelines:
    - Always remind users to consult healthcare professionals for medical advice
    - Provide general information about medications, dosages, and side effects
    - Be helpful but not prescriptive
    - If asked about drug interactions, emphasize the importance of consulting a pharmacist or doctor
    - For dosage calculations, always note these are general guidelines and actual prescriptions may differ
    - Keep responses concise and easy to understand`;

    // Generate content using Gemini
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({
      message: text,
      timestamp: new Date().toISOString()
    });

  }
  catch (error) {
    console.error('Error calling Gemini API:', error);
    
    // More detailed error logging
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    // Return a fallback response if the API fails
    return NextResponse.json({
      message: "I'm sorry, I'm having trouble connecting right now. Please consult your healthcare provider or pharmacist for medication guidance.",
      timestamp: new Date().toISOString(),
      debug: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : 'Unknown error' : undefined
    }, { status: 500 });
  }
  
}
