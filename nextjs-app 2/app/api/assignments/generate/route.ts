import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY environment variable is not configured. Please add your actual Gemini API Key inside your Netlify site settings (Environment Variables).' },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { subject, grade, dueDate, sections, additionalInstructions } = body;

    if (!subject || !grade || !sections || !Array.isArray(sections) || sections.length === 0) {
      return NextResponse.json(
        { error: 'Missing mandatory criteria parameters (subject, grade, sections)' },
        { status: 400 }
      );
    }

    // Construct highly specific generation instructions
    let sectionsPrompt = '';
    sections.forEach((s, idx) => {
      sectionsPrompt += `\nSection ${String.fromCharCode(65 + idx)}:
- Question Type: ${s.type}
- Number of Questions to generate: ${s.questionCount}
- Marks per question: ${s.marksPerQuestion}
`;
    });

    const promptText = `Act as an expert educator and academic test developer.
Your task is to generate a comprehensive, highly formal, and challenging examination paper based on the following criteria:

Subject Matter: ${subject}
Target Class / Grade: ${grade}
Due Date Threshold: ${dueDate}
${additionalInstructions ? `Additional Directives / Syllabus parameters: ${additionalInstructions}` : ''}

Question Sections Structure to generate:
${sectionsPrompt}

Rules:
1. Generate high-quality academic questions matching the grade target. Ensure clarity and pedagogical rigor.
2. For "Multiple Choice" questions, you MUST generate exactly 4 options. Make options realistic but with exactly one correct answer.
3. For other question types, "options" must be omitted or empty.
4. For each question, provide a solid, concise "correctAnswer" explaining the core solution key.
5. Set the difficulty of each question as either "Easy", "Moderate", or "Hard".
6. Align each question's "marks" property exactly to the configured marks per question.
7. Return a single fully populated exam structure matching the JSON schema.`;

    // Direct fetch call to official Gemini serverless API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: promptText,
                },
              ],
            },
          ],
          generationConfig: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: 'OBJECT',
              properties: {
                title: { 
                  type: 'STRING',
                  description: 'Descriptive test header title, e.g. "MID-TERM EXAMINATION IN PHYSICAL CHEMISTRY"'
                },
                subject: { type: 'STRING' },
                grade: { type: 'STRING' },
                sections: {
                  type: 'ARRAY',
                  items: {
                    type: 'OBJECT',
                    properties: {
                      title: { type: 'STRING', description: 'e.g. "Section A: Multiple Choice Questions"' },
                      instruction: { type: 'STRING', description: 'e.g. "Answer all questions inside this section."' },
                      questionType: { type: 'STRING' },
                      questions: {
                        type: 'ARRAY',
                        items: {
                          type: 'OBJECT',
                          properties: {
                            text: { type: 'STRING' },
                            options: {
                              type: 'ARRAY',
                              items: { type: 'STRING' }
                            },
                            correctAnswer: { type: 'STRING' },
                            difficulty: { type: 'STRING', description: '"Easy", "Moderate", or "Hard"' },
                            marks: { type: 'NUMBER' }
                          },
                          required: ['text', 'correctAnswer', 'difficulty', 'marks']
                        }
                      }
                    },
                    required: ['title', 'instruction', 'questionType', 'questions']
                  }
                }
              },
              required: ['title', 'subject', 'grade', 'sections']
            }
          }
        }),
      }
    );

    if (!response.ok) {
      const errorResponse = await response.text();
      console.error('Gemini API Error:', errorResponse);
      return NextResponse.json(
        { error: `Gemini AI service error: ${response.statusText}. Please verify your GEMINI_API_KEY is active and valid.` },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Parse generated JSON block inside candidates
    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      return NextResponse.json(
        { error: 'Invalid structured response returned from Gemini. Please try again with simplified parameters.' },
        { status: 502 }
      );
    }

    const examJson = JSON.parse(data.candidates[0].content.parts[0].text);
    
    // Assign structural IDs for React loops
    const processedSections = examJson.sections.map((s: any, sIdx: number) => ({
      ...s,
      id: `sec_${Date.now()}_${sIdx}`,
      questions: s.questions.map((q: any, qIdx: number) => ({
        ...q,
        id: `q_${Date.now()}_${sIdx}_${qIdx}`
      }))
    }));

    const finalResult = {
      id: `paper_${Date.now()}`,
      title: examJson.title || `${subject.toUpperCase()} ASSESSMENT`,
      subject: examJson.subject || subject,
      grade: examJson.grade || grade,
      dueDate,
      createdAt: new Date().toISOString(),
      sections: processedSections,
      totalQuestionsCount: processedSections.reduce((sum: number, s: any) => sum + s.questions.length, 0),
      totalMarks: processedSections.reduce((sum: number, s: any) => sum + s.questions.reduce((qSum: number, q: any) => qSum + q.marks, 0), 0),
      additionalInstructions
    };

    return NextResponse.json(finalResult);

  } catch (err: any) {
    console.error('API Route Generation Error:', err);
    return NextResponse.json(
      { error: err.message || 'An unexpected error occurred during exam compilation.' },
      { status: 500 }
    );
  }
}
