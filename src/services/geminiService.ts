
interface GeminiResponse {
  success: boolean;
  data?: string;
  error?: string;
}

// Service to interact with Gemini API
export const generateEmailContent = async (
  apiKey: string, 
  productDetails: string, 
  customerSegment: string, 
  campaignGoal: string
): Promise<GeminiResponse> => {
  try {
    // Example prompt template for email generation
    const prompt = `
      Generate a marketing email for the following:
      
      Product Details: ${productDetails}
      Customer Segment: ${customerSegment}
      Campaign Goal: ${campaignGoal}
      
      The email should include:
      - An attention-grabbing subject line
      - Professional greeting
      - Engaging introduction
      - Key product benefits
      - Clear call to action
      - Professional sign-off
      
      Format the response as HTML that can be used directly in an email template.
    `;

    // Gemini API request
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
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
      error: 'Failed to connect to Gemini API' 
    };
  }
};
