const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface ParsedCVData {
  extractedText: string;
  personalInfo?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  sections?: {
    summary?: string;
    experience?: string;
    education?: string;
    skills?: string;
  };
}

/**
 * Clean text by removing null characters and other problematic Unicode sequences
 */
const cleanText = (text: string): string => {
  return text
    .replace(/\u0000/g, '') // Remove null characters
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // Remove other control characters except \n, \r, \t
    .trim();
};

/**
 * Extract personal information from text using regex patterns
 */
const extractPersonalInfo = (text: string) => {
  const personalInfo: any = {};

  // Extract email
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  const emailMatch = text.match(emailRegex);
  if (emailMatch) {
    personalInfo.email = emailMatch[0];
  }

  // Extract phone number (various formats)
  const phoneRegex = /(\+?1?[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/g;
  const phoneMatch = text.match(phoneRegex);
  if (phoneMatch) {
    personalInfo.phone = phoneMatch[0];
  }

  // Extract name (first line that looks like a name)
  const lines = text.split('\n').filter(line => line.trim().length > 0);
  for (const line of lines.slice(0, 5)) { // Check first 5 lines
    const trimmedLine = line.trim();
    // Simple heuristic: if line has 2-4 words and no special characters, likely a name
    if (trimmedLine.split(' ').length >= 2 && trimmedLine.split(' ').length <= 4 && 
        !/[@#$%^&*()_+=\[\]{}|\\:";'<>?,./]/.test(trimmedLine)) {
      personalInfo.name = trimmedLine;
      break;
    }
  }

  return personalInfo;
};

/**
 * Extract different sections from CV text
 */
const extractSections = (text: string) => {
  const sections: any = {};

  // Common section headers
  const sectionPatterns = {
    summary: /(?:summary|profile|objective|about|overview)[\s\S]*?(?=\n\s*(?:experience|education|skills|work|employment|qualifications)|$)/i,
    experience: /(?:experience|work|employment|career|professional)[\s\S]*?(?=\n\s*(?:education|skills|qualifications|projects)|$)/i,
    education: /(?:education|academic|qualifications|degrees?)[\s\S]*?(?=\n\s*(?:skills|experience|projects|certifications)|$)/i,
    skills: /(?:skills|competencies|technologies|technical)[\s\S]*?(?=\n\s*(?:experience|education|projects|certifications)|$)/i
  };

  for (const [sectionName, pattern] of Object.entries(sectionPatterns)) {
    const match = text.match(pattern);
    if (match) {
      sections[sectionName] = cleanText(match[0]);
    }
  }

  return sections;
};

/**
 * Simple PDF text extraction using basic parsing
 * This is a simplified approach that works with most PDFs
 */
const parsePDF = async (arrayBuffer: ArrayBuffer): Promise<string> => {
  try {
    // Convert ArrayBuffer to Uint8Array
    const uint8Array = new Uint8Array(arrayBuffer);
    
    // Convert to string and look for text content
    const pdfString = new TextDecoder('latin1').decode(uint8Array);
    
    // Extract text using regex patterns for PDF text objects
    const textMatches = pdfString.match(/\(([^)]+)\)/g) || [];
    const extractedTexts = textMatches
      .map(match => match.slice(1, -1)) // Remove parentheses
      .filter(text => text.length > 1 && /[a-zA-Z]/.test(text)) // Filter meaningful text
      .join(' ');

    // Also try to extract text between BT and ET markers (PDF text objects)
    const btEtMatches = pdfString.match(/BT\s+(.*?)\s+ET/gs) || [];
    const btEtTexts = btEtMatches
      .map(match => {
        // Extract text from Tj operations
        const tjMatches = match.match(/\(([^)]+)\)\s*Tj/g) || [];
        return tjMatches.map(tj => tj.match(/\(([^)]+)\)/)?.[1] || '').join(' ');
      })
      .filter(text => text.length > 0)
      .join(' ');

    const combinedText = cleanText(extractedTexts + ' ' + btEtTexts);
    
    if (combinedText.length < 50) {
      throw new Error('Could not extract sufficient text from PDF');
    }
    
    return combinedText;
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error('Failed to parse PDF file. Please try a different PDF or use the CV builder instead.');
  }
};

/**
 * Parse Word document - simplified approach
 */
const parseWordDocument = async (arrayBuffer: ArrayBuffer): Promise<string> => {
  try {
    // For now, we'll use a basic approach for Word documents
    // In a production environment, you'd want to use a proper DOCX parser
    const uint8Array = new Uint8Array(arrayBuffer);
    const docString = new TextDecoder('utf-8', { fatal: false }).decode(uint8Array);
    
    // Try to extract readable text (this is a very basic approach)
    const textContent = docString
      .replace(/[^\x20-\x7E\n\r\t]/g, ' ') // Keep only printable ASCII + whitespace
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
    
    const cleanedText = cleanText(textContent);
    
    if (cleanedText.length < 50) {
      throw new Error('Could not extract sufficient text from Word document');
    }
    
    return cleanedText;
  } catch (error) {
    console.error('Error parsing Word document:', error);
    throw new Error('Failed to parse Word document. Please try converting to PDF or use the CV builder instead.');
  }
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Get the uploaded file from the request
    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return new Response(
        JSON.stringify({ error: 'No file provided' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedTypes.includes(file.type)) {
      return new Response(
        JSON.stringify({ error: 'Unsupported file type. Please upload a PDF or Word document.' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return new Response(
        JSON.stringify({ error: 'File size must be less than 5MB' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Convert file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()
    let extractedText = ''

    // Parse based on file type
    if (file.type === 'application/pdf') {
      extractedText = await parsePDF(arrayBuffer)
    } else if (
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      file.type === 'application/msword'
    ) {
      extractedText = await parseWordDocument(arrayBuffer)
    }

    // Additional cleaning step to ensure no problematic characters remain
    extractedText = cleanText(extractedText);

    // Validate extracted text
    if (!extractedText || extractedText.trim().length < 50) {
      return new Response(
        JSON.stringify({ 
          error: 'Could not extract sufficient text from the file. The file may be image-based or corrupted. Please try a different file or use our CV builder instead.' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Extract structured information
    const personalInfo = extractPersonalInfo(extractedText)
    const sections = extractSections(extractedText)

    const result: ParsedCVData = {
      extractedText,
      personalInfo,
      sections
    }

    return new Response(
      JSON.stringify(result),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Error in parse-cv function:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to process CV file',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})