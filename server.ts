import express from 'express';
import path from 'path';
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
  const hasKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 0);
  res.json({
    status: 'ok',
    hasKey,
    event: 'Karnival MADANI PPD Kulim Bandar Baharu',
    app: 'MADANI AI Avatar Studio',
    timestamp: new Date().toISOString()
  });
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

// Endpoint to transform photo to 3D avatar using Gemini Image Generation
app.post('/api/generate-avatar', async (req, res) => {
  const startTime = Date.now();
  try {
    const { imageBase64, mimeType = 'image/jpeg', styleId = 'hero', customNotes = '' } = req.body;

    if (!imageBase64) {
      return res.status(400).json({
        success: false,
        error: 'Tiada gambar dibekalkan. Sila ambil gambar menggunakan webcam atau muat naik foto.',
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey.trim() === '') {
      return res.status(500).json({
        success: false,
        error: 'GEMINI_API_KEY belum dikonfigurasi pada pelayan. Sila tetapkan kunci API dalam panel Secrets untuk membolehkan penjanaan avatar AI sebenar.',
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

    // List candidate models for image editing/generation
    const modelsToTry = [
      'gemini-3.1-flash-lite-image',
      'gemini-nano-banana-2.1',
      'gemini-2.5-flash-image',
    ];

    let generatedImageUrl: string | null = null;
    let lastError: any = null;

    for (const modelName of modelsToTry) {
      try {
        console.log(`[MADANI Avatar] Memulakan penjanaan menggunakan model: ${modelName}...`);

        const response = await ai.models.generateContent({
          model: modelName,
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

        // Search for image in returned parts
        const parts = response.candidates?.[0]?.content?.parts || [];
        for (const part of parts) {
          if (part.inlineData && part.inlineData.data) {
            const returnedMime = part.inlineData.mimeType || 'image/png';
            generatedImageUrl = `data:${returnedMime};base64,${part.inlineData.data}`;
            console.log(`[MADANI Avatar] Berjaya dijana dengan ${modelName}! Masa: ${(Date.now() - startTime) / 1000}s`);
            break;
          }
        }

        if (generatedImageUrl) {
          break;
        } else {
          console.warn(`[MADANI Avatar] Model ${modelName} membalas tetapi tiada bahagian imej ditemui.`);
        }
      } catch (err: any) {
        lastError = err;
        console.error(`[MADANI Avatar] Ralat dengan model ${modelName}:`, err?.message || err);
      }
    }

    if (!generatedImageUrl) {
      // If image generation models are restricted on the user's key (e.g. Free tier),
      // perform genuine AI Multimodal Character Analysis using the 100% free gemini-3.8-flash model
      try {
        console.log('[MADANI Avatar] Menggunakan model percuma gemini-3.8-flash untuk analisis karakter murid...');
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
                text: `Analisis foto murid ini dan berikan satu gelaran wira animasi 3D rasmi yang ceria dan membanggakan sempena Karnival MADANI PPD Kulim Bandar Baharu dalam Bahasa Melayu. Berikan gelaran wira tersebut sahaja, ringkas di bawah 6 perkataan.`,
              },
            ],
          },
        });

        const aiTitle = freeAnalysis.text?.trim() || 'Wira Cilik MADANI Berwawasan';
        return res.json({
          success: true,
          imageUrl: imageBase64, // Keep genuine student photo
          isPhotoWithAiBadge: true,
          aiTitle,
          styleId,
          freeTierNotice: 'Kunci API percuma anda aktif! Foto murid asal digunakan bersama profil watak AI.',
          generationTimeMs: Date.now() - startTime,
        });
      } catch (freeErr: any) {
        console.error('[MADANI Avatar] Ralat dengan model percuma:', freeErr);
        const errorMsg = lastError?.message || freeErr?.message || 'Model AI tidak mengembalikan imej yang sah.';
        return res.status(502).json({
          success: false,
          error: `Penjanaan avatar AI gagal: ${errorMsg}`,
          errorDetails: String(lastError || freeErr),
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
