import { GoogleGenAI } from '@google/genai';

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

let isImageQuotaAvailable = true;

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const startTime = Date.now();
  try {
    const { imageBase64, mimeType = 'image/jpeg', styleId = 'hero', customNotes = '' } = req.body || {};

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
        error: 'GEMINI_API_KEY belum dikonfigurasi pada persekitaran Vercel. Sila tambah GEMINI_API_KEY di Vercel Dashboard > Project Settings > Environment Variables.',
        errorType: 'MISSING_API_KEY',
      });
    }

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

    if (isImageQuotaAvailable) {
      const modelsToTry = [
        'gemini-3.1-flash-lite-image',
      ];

      for (const modelName of modelsToTry) {
        try {
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

        const parts = response.candidates?.[0]?.content?.parts || [];
        for (const part of parts) {
          if (part.inlineData && part.inlineData.data) {
            const returnedMime = part.inlineData.mimeType || 'image/png';
            generatedImageUrl = `data:${returnedMime};base64,${part.inlineData.data}`;
            break;
          }
        }

        if (generatedImageUrl) break;
      } catch (err: any) {
        lastError = err;
        const errMsg = String(err?.message || '');
        if (err?.status === 429 || errMsg.includes('429') || errMsg.includes('Quota exceeded') || errMsg.includes('RESOURCE_EXHAUSTED')) {
          isImageQuotaAvailable = false;
          break;
        }
      }
    }
  }

    // Free tier fallback using gemini-3.8-flash
    if (!generatedImageUrl) {
      try {
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
        return res.status(200).json({
          success: true,
          imageUrl: imageBase64,
          isPhotoWithAiBadge: true,
          aiTitle,
          styleId,
          freeTierNotice: 'Kunci API percuma anda aktif! Foto murid asal digunakan bersama profil watak AI.',
          generationTimeMs: Date.now() - startTime,
        });
      } catch (freeErr: any) {
        return res.status(502).json({
          success: false,
          error: `Penjanaan avatar AI gagal: ${lastError?.message || freeErr?.message || 'Model AI tidak dapat diakses'}`,
          errorDetails: String(lastError || freeErr),
        });
      }
    }

    return res.status(200).json({
      success: true,
      imageUrl: generatedImageUrl,
      styleId,
      generationTimeMs: Date.now() - startTime,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: `Ralat sistem pelayan: ${error.message || 'Tidak dapat memproses permintaan'}`,
      errorDetails: String(error),
    });
  }
}
