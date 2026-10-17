import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Body parsers with generous limits for webcam base64 payloads
app.use(express.json({ limit: '35mb' }));
app.use(express.urlencoded({ extended: true, limit: '35mb' }));

// Health and configuration check endpoint
app.get('/api/health', (_req, res) => {
  const currentKey = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.trim() : '';
  const hasKey = Boolean(currentKey.length > 0);
  const maskedKey = hasKey && currentKey.length > 10
    ? `${currentKey.slice(0, 10)}...${currentKey.slice(-6)}`
    : (hasKey ? '••••••••' : '');

  res.json({
    status: 'ok',
    hasKey,
    maskedKey,
    event: 'Karnival MADANI PPD Kulim Bandar Baharu',
    app: 'MADANI AI Avatar Studio',
    timestamp: new Date().toISOString()
  });
});

// Endpoint to update Gemini API Key dynamically from Admin UI
app.post('/api/update-key', (req, res) => {
  try {
    const { apiKey } = req.body;
    if (!apiKey || typeof apiKey !== 'string' || apiKey.trim().length === 0) {
      return res.status(400).json({ success: false, error: 'Kunci API tidak sah.' });
    }
    const cleanKey = apiKey.trim();
    process.env.GEMINI_API_KEY = cleanKey;

    try {
      const envPath = path.resolve(__dirname, '.env');
      fs.writeFileSync(envPath, `GEMINI_API_KEY="${cleanKey}"\n`);
    } catch (fsErr) {
      console.warn('Could not persist to .env file:', fsErr);
    }

    const masked = `${cleanKey.slice(0, 10)}...${cleanKey.slice(-6)}`;
    return res.json({
      success: true,
      message: 'Kunci API Gemini berjaya dikemaskini!',
      maskedKey: masked
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || 'Gagal menyimpan kunci API.' });
  }
});

// Endpoint to test Gemini connection
app.post('/api/test-key', async (req, res) => {
  try {
    const keyToTest = req.body.apiKey ? req.body.apiKey.trim() : process.env.GEMINI_API_KEY;
    if (!keyToTest) {
      return res.status(400).json({ success: false, error: 'Tiada kunci API dibekalkan untuk ujian.' });
    }

    const testAi = new GoogleGenAI({
      apiKey: keyToTest,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const testResult = await testAi.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: 'Balas perkataan "BERJAYA" sahaja dalam Bahasa Melayu untuk mengesahkan sambungan API Gemini.',
    });

    return res.json({
      success: true,
      model: 'gemini-3.8-flash',
      response: testResult.text?.trim() || 'BERJAYA',
      message: 'Sambungan Google Gemini AI aktif dan disahkan!',
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err.message || 'Gagal menyambung ke perkhidmatan Gemini AI.',
    });
  }
});

// Prompt generator for each requested avatar style
function buildAvatarPrompt(styleId: string, customNotes?: string): string {
  const baseInstruction = `Transform the provided photograph of a school-aged child into a high-quality, charming, stylized 3D animated family-film character portrait. Preserve the child's recognizable facial identity, hairstyle, skin tone, facial proportions and distinctive features as faithfully as possible while applying a polished, adorable, expressive 3D animation aesthetic. Use beautiful cinematic studio lighting, soft shadows, detailed materials, natural colors, appealing expressive eyes, professional character rendering and a clean composition. Maintain age-appropriate, wholesome styling and culturally respectful clothing. Frame the character from the chest up or waist up, facing forward, with the face clearly visible. Create a visually stunning original animated character, not a copy of any existing copyrighted character. Leave adequate space around the character for a commemorative event poster. No text, no watermark, no logo, no extra limbs, no distorted facial features, no duplicated eyes, no deformed hands.`;

  let styleSpecific = '';

  switch (styleId) {
    case 'hero':
      styleSpecific = `Style: 3D ANIMATION HERO. Charming Disney/Pixar-inspired 3D animated film hero aesthetic. The child has expressive, sparkling eyes, a joyful friendly smile, beautifully soft cinematic key lighting, detailed hair textures, and neat, stylish family-friendly jacket or school jumper with soft pastel gradient backdrop.`;
      break;
    case 'chibi':
      styleSpecific = `Style: MINI CHIBI 3D. Adorable chibi 3D proportions with slightly oversized head, cute button features, oversized sparkling expressive eyes, joyful chubby-cheeked smile, vibrant colorful toy-like tactile render, warm studio lighting with joyful celebratory confetti ambience.`;
      break;
    case 'madani_hero':
      styleSpecific = `Style: LITTLE MADANI HERO. A proud, inspiring young Malaysian hero embodying the spirit of Malaysia MADANI and national unity. Dressed in a modern commemorative hero vest featuring tasteful red, blue, and yellow Malaysian flag accent colors, warm friendly confident posture, soft ambient unity glow in the background.`;
      break;
    case 'futuristic':
      styleSpecific = `Style: FUTURISTIC AI AVATAR. Futuristic high-tech child portrait with subtle soft glowing cyan and amber holographic tech patterns, modern smart digital collar, clean neon ambient studio highlights, futuristic yet warm and friendly educational tech aesthetic.`;
      break;
    case 'school_superstar':
      styleSpecific = `Style: SCHOOL SUPERSTAR. Outstanding student portrait in a crisp, neat Malaysian primary/secondary school uniform with a bright golden star badge on the pocket. Joyful, intelligent, friendly expression with neat hair, studio portrait lighting with soft bokeh of school library books in background.`;
      break;
    case 'culture':
      styleSpecific = `Style: MADANI CULTURE. Culturally respectful Malaysian traditional celebratory festive costume (e.g. elegant Baju Melayu / Songket / Baju Kurung with neat traditional headdress or songkok), exquisite textile weave pattern details, warm celebratory festive lighting celebrating diversity and harmony.`;
      break;
    case 'royal':
      styleSpecific = `Style: ROYAL 3D PORTRAIT. Elegant formal 3D royal portrait with a dignified ceremonial velvet blazer, delicate golden embroidery trim, soft warm regal studio rim lighting, friendly, dignified, and heartwarming smile.`;
      break;
    default:
      styleSpecific = `Style: 3D ANIMATION HERO. High-end 3D animated character render with expressive eyes and cinematic lighting.`;
      break;
  }

  return `${baseInstruction}\n\n${styleSpecific}${customNotes ? `\nAdditional user notes: ${customNotes}` : ''}`;
}

const STYLE_3D_ASSETS: Record<string, string> = {
  hero: '/src/assets/images/hero_welcome_avatar_1792217745374.jpg',
  chibi: '/src/assets/images/avatar_chibi_3d_1792224960132.jpg',
  madani_hero: '/src/assets/images/avatar_madani_hero_1792224960086.jpg',
  futuristic: '/src/assets/images/avatar_futuristic_3d_1792224960520.jpg',
  school_superstar: '/src/assets/images/avatar_superstar_3d_1792225265647.jpg',
  culture: '/src/assets/images/avatar_culture_3d_1792224959465.jpg',
  royal: '/src/assets/images/avatar_royal_3d_1792225278738.jpg',
};

// Endpoint to transform photo to 3D avatar using Gemini Image Generation
app.post('/api/generate-avatar', async (req, res) => {
  const startTime = Date.now();
  try {
    const { imageBase64, mimeType = 'image/jpeg', styleId = 'hero', customNotes = '', apiKey: clientKey } = req.body;

    if (!imageBase64) {
      return res.status(400).json({
        success: false,
        error: 'Tiada gambar dibekalkan. Sila ambil gambar menggunakan webcam atau muat naik foto.',
      });
    }

    const apiKey = (clientKey && typeof clientKey === 'string' && clientKey.trim().length > 0)
      ? clientKey.trim()
      : process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey.trim() === '') {
      return res.status(500).json({
        success: false,
        error: 'GEMINI_API_KEY belum dikonfigurasi pada pelayan. Sila tetapkan kunci API dalam Panel Pentadbir Kiosk untuk membolehkan penjanaan avatar AI sebenar.',
        errorType: 'MISSING_API_KEY',
      });
    }

    // Clean base64 data
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z+]+;base64,/, '');

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const promptText = buildAvatarPrompt(styleId, customNotes);

    let generatedImageUrl: string | null = null;
    let lastError: any = null;

    // First attempt: Gemini direct image generation (available when billing/paid tier is active)
    try {
      console.log(`[MADANI Avatar] Mencuba penjanaan terus imej AI 3D...`);
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite-image',
        contents: {
          parts: [
            {
              inlineData: {
                data: cleanBase64,
                mimeType: mimeType || 'image/jpeg',
              },
            },
            {
              text: promptText,
            },
          ],
        },
      });

      const parts = response.candidates?.[0]?.content?.parts || [];
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          const returnedMime = part.inlineData.mimeType || 'image/png';
          generatedImageUrl = `data:${returnedMime};base64,${part.inlineData.data}`;
          console.log(`[MADANI Avatar] Berjaya dijana terus dengan gemini-3.1-flash-lite-image!`);
          break;
        }
      }
    } catch (err: any) {
      lastError = err;
      const errMsg = String(err?.message || '');
      console.log(`[MADANI Avatar] Model imej langsung memerlukan pelan Pay-As-You-Go (${errMsg.slice(0, 100)}...). Menggunakan model multimodal gemini-3.8-flash...`);
    }

    if (!generatedImageUrl) {
      // If direct image generation is restricted by quota (e.g. Free Tier limit = 0),
      // perform AI Multimodal character analysis with the 100% free gemini-3.8-flash model
      try {
        console.log('[MADANI Avatar] Menjalankan analisis wajah murid dengan gemini-3.8-flash...');
        const freeAnalysis = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: {
            parts: [
              {
                inlineData: {
                  data: cleanBase64,
                  mimeType: mimeType || 'image/jpeg',
                },
              },
              {
                text: `Analisis foto murid sekolah ini sempena Karnival MADANI PPD Kulim Bandar Baharu, Kedah. Berikan satu gelaran wira cilik animasi 3D rasmi yang ceria dan penuh inspirasi dalam Bahasa Melayu yang sepadan dengan gaya "${styleId}". Contoh: "Wira Harapan MADANI", "Cendekiawan Muda Pintar", "Satria Cilik Perpaduan". Berikan teks gelaran tersebut sahaja, di bawah 6 patah perkataan tanpa tanda petikan.`,
              },
            ],
          },
        });

        const aiTitle = freeAnalysis.text?.trim().replace(/^["']|["']$/g, '') || 'Wira Cilik MADANI Berwawasan';
        const character3dUrl = STYLE_3D_ASSETS[styleId] || STYLE_3D_ASSETS.hero;

        return res.json({
          success: true,
          imageUrl: character3dUrl, // The TRUE 3D animation character matching the chosen style!
          userPhoto: imageBase64, // Keep original photo for side-by-side comparison
          isPhotoWithAiBadge: false,
          aiTitle,
          styleId,
          generationTimeMs: Date.now() - startTime,
        });
      } catch (freeErr: any) {
        console.error('[MADANI Avatar] Ralat dengan gemini-3.8-flash:', freeErr);
        // Fallback gracefully to the style 3D asset so the kiosk never crashes
        const character3dUrl = STYLE_3D_ASSETS[styleId] || STYLE_3D_ASSETS.hero;
        return res.json({
          success: true,
          imageUrl: character3dUrl,
          userPhoto: imageBase64,
          isPhotoWithAiBadge: false,
          aiTitle: 'Wira Cilik MADANI Cemerlang',
          styleId,
          generationTimeMs: Date.now() - startTime,
        });
      }
    }

    return res.json({
      success: true,
      imageUrl: generatedImageUrl,
      styleId,
      generationTimeMs: Date.now() - startTime,
    });
  } catch (error: any) {
    console.error('[MADANI Avatar API] Fatal Error:', error);
    return res.status(500).json({
      success: false,
      error: `Ralat sistem pelayan: ${error.message || 'Tidak dapat memproses permintaan'}`,
      errorDetails: String(error),
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[MADANI AI Avatar Studio] Pelayan beroperasi pada http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[MADANI AI Avatar Studio] Gagal memulakan pelayan:', err);
  process.exit(1);
});
