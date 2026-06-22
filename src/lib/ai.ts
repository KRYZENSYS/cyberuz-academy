import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || '',
});

const MODEL = process.env.GROQ_MODEL || 'llama-3.1-70b-versatile';

export interface AIAnalysis {
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  topics: string[];
  tags: string[];
  learningPaths: string[];
  summary: string;
  keyConcepts: string[];
  prerequisites: string[];
}

export interface QuizQuestion {
  type: 'MCQ' | 'TRUE_FALSE' | 'FILL_BLANK' | 'PRACTICAL';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  points: number;
}

/**
 * Analyze video content using AI to determine difficulty, topics, etc.
 */
export async function analyzeVideoContent(
  title: string,
  description: string,
  transcript?: string
): Promise<AIAnalysis> {
  const prompt = `Quyidagi kiberxavfsizlik videosini tahlil qil va JSON formatida javob ber:

Sarlavha: ${title}
Tavsif: ${description}
${transcript ? `Transcript (qisqartirilgan): ${transcript.substring(0, 3000)}` : ''}

Quyidagi formatda javob ber:
{
  "difficulty": "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT",
  "topics": ["mavzu1", "mavzu2", ...],
  "tags": ["tag1", "tag2", ...],
  "learningPaths": ["CYBERSECURITY_FUNDAMENTALS" | "LINUX_FOR_SECURITY" | "NETWORKING_BASICS" | "WEB_APPLICATION_SECURITY" | "BUG_BOUNTY" | "SOC_ANALYST" | "DIGITAL_FORENSICS" | "MALWARE_ANALYSIS" | "RED_TEAM" | "BLUE_TEAM"],
  "summary": "Video haqida 2-3 gapli qisqacha tavsif o'zbek tilida",
  "keyConcepts": ["tushuncha1", "tushuncha2", ...],
  "prerequisites": ["oldindan bilish kerak bo'lgan mavzu1", ...]
}

Faqat JSON qaytar, boshqa hech narsa yozma.`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'Siz kiberxavfsizlik bo\'yicha mutaxassis AI assistentsiz. Faqat JSON formatida javob bering.',
        },
        { role: 'user', content: prompt },
      ],
      model: MODEL,
      temperature: 0.3,
      max_tokens: 2000,
      response_format: { type: 'json_object' },
    });

    const text = completion.choices[0]?.message?.content || '{}';
    return JSON.parse(text);
  } catch (error) {
    console.error('AI analysis error:', error);
    return {
      difficulty: 'BEGINNER',
      topics: [],
      tags: [],
      learningPaths: [],
      summary: '',
      keyConcepts: [],
      prerequisites: [],
    };
  }
}

/**
 * Generate quiz questions for a lesson
 */
export async function generateQuiz(
  topic: string,
  difficulty: 'EASY' | 'MEDIUM' | 'HARD' = 'MEDIUM',
  count: number = 5
): Promise<QuizQuestion[]> {
  const prompt = `"${topic}" mavzusi bo'yicha ${count} ta ${difficulty} darajadagi quiz savolini yarat.

Quyidagi turlarda bo'lsin:
- MCQ (4 ta variant, 1 to'g'ri)
- TRUE_FALSE
- FILL_BLANK

JSON array formatida:
[
  {
    "type": "MCQ" | "TRUE_FALSE" | "FILL_BLANK",
    "question": "Savol matni o'zbek tilida",
    "options": ["A) variant1", "B) variant2", "C) variant3", "D) variant4"], // faqat MCQ uchun
    "correctAnswer": "to'g'ri javob",
    "explanation": "tushuntirish o'zbek tilida",
    "points": 1
  }
]

Faqat JSON array qaytar.`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'Siz kiberxavfsizlik o\'qituvchisisiz. O\'zbek tilida professional quiz savollari yarating.',
        },
        { role: 'user', content: prompt },
      ],
      model: MODEL,
      temperature: 0.7,
      max_tokens: 3000,
      response_format: { type: 'json_object' },
    });

    const text = completion.choices[0]?.message?.content || '{}';
    const parsed = JSON.parse(text);
    return Array.isArray(parsed) ? parsed : parsed.questions || [];
  } catch (error) {
    console.error('Quiz generation error:', error);
    return [];
  }
}

/**
 * Chat with CyberAI teacher
 */
export async function chatWithAI(
  message: string,
  context?: { lessonTitle?: string; courseTitle?: string; history?: { role: string; content: string }[] }
): Promise<string> {
  let systemPrompt = `Siz CyberAI — kiberxavfsizlik bo'yicha AI o'qituvchisiz. Sizning ismingiz CyberAI.
O'zbek tilida professional, do'stona va tushunarli tarzda javob bering.
Javoblaringiz aniq, amaliy misollar bilan boyitilgan bo'lsin.
Hech qachon o'zingizni OpenAI, ChatGPT, yoki boshqa AI deb tanishtirmang — siz CyberAI siz.`;

  if (context?.lessonTitle) {
    systemPrompt += `\n\nHozirgi dars: "${context.lessonTitle}"`;
    if (context.courseTitle) systemPrompt += ` (Kurs: ${context.courseTitle})`;
    systemPrompt += `\nFaqat shu darsga oid savollarga javob bering.`;
  }

  try {
    const messages: any[] = [{ role: 'system', content: systemPrompt }];

    if (context?.history) {
      messages.push(...context.history.map((m) => ({ role: m.role, content: m.content })));
    }

    messages.push({ role: 'user', content: message });

    const completion = await groq.chat.completions.create({
      messages,
      model: MODEL,
      temperature: 0.7,
      max_tokens: 2000,
    });

    return completion.choices[0]?.message?.content || 'Kechirasiz, hozir javob bera olmadim. Qayta urinib ko\'ring.';
  } catch (error) {
    console.error('AI chat error:', error);
    return 'Kechirasiz, AI xizmatida xatolik yuz berdi. Iltimos, keyinroq urinib ko\'ring.';
  }
}

/**
 * Generate learning path recommendations
 */
export async function recommendLearningPath(
  userLevel: string,
  interests: string[],
  completedCourses: string[]
): Promise<{ path: string; reason: string }[]> {
  const prompt = `Foydalanuvchi darajasi: ${userLevel}
Qiziqishlari: ${interests.join(', ')}
Tugatgan kurslari: ${completedCourses.join(', ')}

unga 3 ta eng mos o'rganish yo'lini (learning path) tavsiya qil.

JSON formatida:
{
  "recommendations": [
    { "path": "kurs_slug", "reason": "Qisqa sabab o'zbek tilida" }
  ]
}

Faqat JSON qaytar.`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: 'Siz ta\'lim maslahatchisisiz. Faqat JSON qaytaring.' },
        { role: 'user', content: prompt },
      ],
      model: MODEL,
      temperature: 0.5,
      response_format: { type: 'json_object' },
    });

    const text = completion.choices[0]?.message?.content || '{}';
    return JSON.parse(text).recommendations || [];
  } catch (error) {
    console.error('Recommendation error:', error);
    return [];
  }
}

/**
 * Generate roadmap for cybersecurity career
 */
export async function generateRoadmap(
  goal: string,
  currentLevel: string,
  availableHours: number
): Promise<{ weeks: { week: number; title: string; topics: string[]; resources: string[] }[] }> {
  const prompt = `Foydalanuvchi maqsadi: ${goal}
Hozirgi darajasi: ${currentLevel}
Haftada ${availableHours} soat vaqti bor.

Unga ${Math.min(12, Math.ceil(availableHours / 5))} haftalik o'rganish rejasi tuzib ber.

JSON formatida:
{
  "weeks": [
    {
      "week": 1,
      "title": "Hafta mavzusi",
      "topics": ["mavzu1", "mavzu2"],
      "resources": ["resurs1", "resurs2"]
    }
  ]
}

Faqat JSON qaytar.`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: 'Siz kiberxavfsizlik karyera maslahutchisisiz. JSON qaytaring.' },
        { role: 'user', content: prompt },
      ],
      model: MODEL,
      temperature: 0.5,
      max_tokens: 4000,
      response_format: { type: 'json_object' },
    });

    const text = completion.choices[0]?.message?.content || '{}';
    return JSON.parse(text);
  } catch (error) {
    console.error('Roadmap generation error:', error);
    return { weeks: [] };
  }
}

/**
 * Generate practical task
 */
export async function generatePracticalTask(
  topic: string,
  difficulty: 'EASY' | 'MEDIUM' | 'HARD' = 'MEDIUM'
): Promise<{ title: string; description: string; hints: string[]; solution: string }> {
  const prompt = `"${topic}" mavzusi bo'yicha ${difficulty} darajadagi amaliy topshiriq yarat.

JSON formatida:
{
  "title": "Topshiriq nomi",
  "description": "Batafsil tavsif o'zbek tilida",
  "hints": ["maslahat1", "maslahat2"],
  "solution": "Yechim ko'rsatmasi"
}

Faqat JSON qaytar.`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: 'Siz kiberxavfsizlik o\'qituvchisi. JSON qaytaring.' },
        { role: 'user', content: prompt },
      ],
      model: MODEL,
      temperature: 0.7,
      response_format: { type: 'json_object' },
    });

    const text = completion.choices[0]?.message?.content || '{}';
    return JSON.parse(text);
  } catch (error) {
    return { title: '', description: '', hints: [], solution: '' };
  }
}
