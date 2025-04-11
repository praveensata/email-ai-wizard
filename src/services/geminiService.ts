
interface GeminiResponse {
  success: boolean;
  data?: string;
  error?: string;
}

// Default Gemini API key
const DEFAULT_GEMINI_API_KEY = 'AIzaSyAozEoYBnZO3AXf4R30WjNN1ClF0F6MwP4';

// Validate Gemini API key format
const isValidGeminiApiKey = (apiKey: string): boolean => {
  // Basic validation - Gemini API keys typically start with "AI" and are reasonably long
  return apiKey && apiKey.length > 20 && apiKey.startsWith('AI');
};

// Service to interact with Gemini API
export const generateEmailContent = async (
  apiKey: string = DEFAULT_GEMINI_API_KEY, 
  productDetails: string, 
  customerSegment: string, 
  campaignGoal: string
): Promise<GeminiResponse> => {
  try {
    // If no API key is provided, use the default one
    const keyToUse = apiKey || DEFAULT_GEMINI_API_KEY;
    
    // Validate API key format
    if (!isValidGeminiApiKey(keyToUse)) {
      return { 
        success: false, 
        error: 'Invalid API key format. Please provide a valid Gemini API key.' 
      };
    }

    // Example prompt template for email generation
    const prompt = `
      Generate a marketing email for the following:
      
      Product Details: ${productDetails}
      Customer Segment: ${customerSegment}
      Campaign Goal: ${campaignGoal}
      
      The email should include:
      - A strong subject line (prefixed with "Subject Line:**" on its own line)
      - An introduction to the product
      - Key product features/benefits (with appropriate headings)
      - A clear call to action
      - Professional sign-off
      
      Format the email with Markdown or similar formatting to highlight key sections.
      Include appropriate line breaks between sections.
      Start with "Subject Line:**" followed by your subject.
    `;

    // Using the newer Gemini 2.0 Flash model with API key in URL parameter
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${keyToUse}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Gemini API error:', data);
      
      // Specific error handling for authentication issues
      if (data.error?.code === 401 || data.error?.status === 'UNAUTHENTICATED') {
        return { 
          success: false, 
          error: 'Authentication failed. Please check your Gemini API key and ensure it has access to the Gemini API.' 
        };
      }
      
      return { 
        success: false, 
        error: data.error?.message || 'Failed to generate email content' 
      };
    }

    // Extract the generated text from Gemini response
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    return {
      success: true,
      data: generatedText
    };
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return { 
      success: false, 
      error: 'Failed to connect to Gemini API. Please check your internet connection and try again.' 
    };
  }
};
