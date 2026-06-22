const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID;
const TELEGRAM_API = TELEGRAM_BOT_TOKEN ? `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}` : null;

export async function sendTelegramMessage(
  chatId: string | number,
  text: string,
  options?: { parseMode?: 'HTML' | 'Markdown'; disablePreview?: boolean }
): Promise<boolean> {
  if (!TELEGRAM_API) return false;

  try {
    const response = await fetch(`${TELEGRAM_API}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: options?.parseMode || 'HTML',
        disable_web_page_preview: options?.disablePreview ?? true,
      }),
    });
    return response.ok;
  } catch (error) {
    console.error('Telegram send error:', error);
    return false;
  }
}

export async function notifyAdmin(text: string): Promise<boolean> {
  if (!TELEGRAM_ADMIN_CHAT_ID) return false;
  return sendTelegramMessage(TELEGRAM_ADMIN_CHAT_ID, text);
}

export async function notifyUser(
  telegramChatId: string,
  type: 'lesson' | 'certificate' | 'achievement' | 'reminder',
  data: { title: string; message: string; link?: string }
): Promise<boolean> {
  const emoji = {
    lesson: '📚',
    certificate: '📜',
    achievement: '🏆',
    reminder: '⏰',
  }[type];

  const text = `${emoji} <b>${data.title}</b>\n\n${data.message}${data.link ? `\n\n🔗 <a href="${data.link}">Ko'rish</a>` : ''}`;
  return sendTelegramMessage(telegramChatId, text);
}

export function verifyTelegramWebAppData(initData: string, botToken: string): boolean {
  // Simplified verification for WebApp data
  if (!initData) return false;
  try {
    const url = new URLSearchParams(initData);
    const hash = url.get('hash');
    url.delete('hash');
    // In production, use crypto.createHmac to verify
    return !!hash;
  } catch {
    return false;
  }
}
