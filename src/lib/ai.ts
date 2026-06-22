import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || '',
});

const MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
const MAX_TOKENS = parseInt(process.env.GROQ_MAX_TOKENS || '2048');

const SYSTEM_PROMPT = `Siz CyberUz Academy platformasining AI o'qituvchisi "CyberAI"siz. Siz kiberxavfsizlik bo'yicha ekspert bo'lsangiz, o'zbek tilida (asosan) va rus/ingliz tillarida ham javob bera olasiz.

Qoidalar:
1. Javoblaringizni o'zbek tilida, sodda va tushunarli qiling
2. Misollar va amaliy maslahatlar bering
3. Zararli maqsadlarda yordam bermang (faqat defensive va educational)
4. Har bir javob oxirida foydalanuvchini rag'batlantiring
5. Agar savol kiberxavfsizlikka oid bo'lmasa, muloyimlik bilan boshqa mavzuga yo'naltiring
6. Kod misollarini ``` til ``` bloki ichida yozing
7. Emoji va formatting ishlatib, vizual jozibador qiling`;

interface ChatContext {
  lessonTitle?: string;
  courseTitle?: string;
  history?: Array<{ role: 'user' | 'assistant'; content: string }>;
  systemPrompt?: string;
}

export async function chatWithAI(message: string, context: ChatContext = {}): Promise<string> {
  if (!process.env.GROQ_API_KEY) {
    return '⚠️ AI xizmati hozircha mavjud emas. Iltimos, keyinroq urinib ko\'ring.';
  }

  try {
    const messages: any[] = [
      { role: 'system', content: context.systemPrompt || SYSTEM_PROMPT },
    ];

    // Add lesson context if provided
    if (context.lessonTitle || context.courseTitle) {
      let contextMsg = '\n\nHozirgi dars konteksti:';
      if (context.courseTitle) contextMsg += `\nKurs: ${context.courseTitle}`;
      if (context.lessonTitle) contextMsg += `\nDars: ${context.lessonTitle}`;
      messages.push({ role: 'system', content: contextMsg });
    }

    // Add history
    if (context.history && context.history.length > 0) {
      for (const msg of context.history) {
        messages.push({ role: msg.role, content: msg.content });
      }
    }

    messages.push({ role: 'user', content: message });

    const completion = await groq.chat.completions.create({
      messages,
      model: MODEL,
      temperature: 0.7,
      max_tokens: MAX_TOKENS,
      top_p: 0.9,
    });

    return completion.choices[0]?.message?.content || 'Kechirasiz, javob bera olmadim.';
  } catch (error: any) {
    console.error('Groq AI error:', error);
    return '⚠️ AI xizmatida xatolik yuz berdi. Iltimos, keyinroq urinib ko\'ring.';
  }
}

export async function analyzeVideoContent(videoTitle: string, videoDescription: string): Promise<{
  summary: string;
  topics: string[];
  difficulty: string;
  duration_minutes: number;
}> {
  const prompt = `Quyidagi video kontentini tahlil qiling va JSON formatda qaytaring:
Title: ${videoTitle}
Description: ${videoDescription}

Quyidagi formatda javob bering:
{
  "summary": "Qisqa 2-3 gapli o'zbekcha xulosa",
  "topics": ["mavzu1", "mavzu2", "mavzu3"],
  "difficulty": "BEGINNER" | "INTERMEDIATE" | "ADVANCED",
  "duration_minutes": taxminiy_daqiqalar
}`;

  try {
    const text = await chatWithAI(prompt, { systemPrompt: 'Siz video kontent tahlilchisiz. Faqat JSON qaytaring, boshqa hech narsa emas.' });
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('No JSON found');
  } catch {
    return {
      summary: videoDescription.substring(0, 200),
      topics: ['Cybersecurity'],
      difficulty: 'BEGINNER',
      duration_minutes: 10,
    };
  }
}

export async function generateQuiz(topic: string, difficulty: string = 'INTERMEDIATE', count: number = 5): Promise<any[]> {
  const prompt = `"${topic}" mavzusida ${count} ta test savolini yarating. 

JSON formatda qaytaring:
[
  {
    "question": "Savol matni",
    "options": ["A", "B", "C", "D"],
    "correctAnswer": 0,
    "explanation": "To'g'ri javob tushuntirmasi"
  }
]`;

  try {
    const text = await chatWithAI(prompt, { systemPrompt: `Siz ${difficulty} darajadagi kiberxavfsizlik testlarini yaratuvchisiz. Faqat JSON array qaytaring.` });
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
    return [];
  } catch {
    return [];
  }
}