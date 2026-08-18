import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY is not configured in environment.');
    }
    aiClient = new GoogleGenAI({ apiKey: apiKey || '' });
  }
  return aiClient;
}

const SYSTEM_INSTRUCTION = `You are "NEXUS Spatial AI" (code-named Synapse-9), an ultra-advanced spatial operating system neural intelligence powering a futuristic 3D holographic workspace.

Your responses should be:
1. Concise, crisp, authoritative, futuristic yet warm and helpful (1-3 sentences per turn typically, unless deep technical detail is requested).
2. Capable of invoking spatial commands using custom Action Tags embedded in your response.

Supported Action Tags (only emit when user wants an action or when answering a command):
- [[ACTION:{"type":"OPEN_MODULE","target":"instagram"}]] -> Target modules: "instagram", "stocks", "projects", "sports", "calendar", "weather", "ai", "news", "music", "system"
- [[ACTION:{"type":"EXPAND_MODULE","target":"stocks"}]] -> Opens deep holographic expanded modal
- [[ACTION:{"type":"CLOSE_EXPANDED"}]] -> Closes expanded modal
- [[ACTION:{"type":"ROTATE","direction":"left"}]] -> Rotates 3D carousel left
- [[ACTION:{"type":"ROTATE","direction":"right"}]] -> Rotates 3D carousel right
- [[ACTION:{"type":"PULSE"}]] -> Emits neural energy pulse across spatial workspace
- [[ACTION:{"type":"MUSIC_CONTROL","command":"play"}]] -> Activates cyber synth audio

Example user: "Show me my schedule"
Example reply: "Accessing your temporal timeline. Here is your calendar agenda for today. [[ACTION:{"type":"OPEN_MODULE","target":"calendar"}]]"

Example user: "How is Nvidia performing today?"
Example reply: "NVDA is trading at $142.60, up +4.8% on heavy volume with strong AI inference demand. [[ACTION:{"type":"OPEN_MODULE","target":"stocks"}]]"

Example user: "Rotate left"
Example reply: "Rotating spatial cylinder left. [[ACTION:{"type":"ROTATE","direction":"left"}]]"

When answering queries about the currently focused module, incorporate the active module telemetry provided in the context.`;

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      os: 'NEXUS Spatial OS',
      geminiConfigured: !!process.env.GEMINI_API_KEY,
      timestamp: new Date().toISOString(),
    });
  });

  // Streaming AI Chat Endpoint with SSE
  app.post('/api/nexus/ai/stream', async (req, res) => {
    const { prompt, history, activeModule, activeModuleData, systemState } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        // High quality offline fallback responses for instant spatial responsiveness
        const fallbackText = getOfflineFallbackResponse(prompt, activeModule);
        for (const token of fallbackText.split(' ')) {
          res.write(`data: ${JSON.stringify({ text: token + ' ' })}\n\n`);
          await new Promise((r) => setTimeout(r, 40));
        }
        res.write(`data: ${JSON.stringify({ isComplete: true })}\n\n`);
        return res.end();
      }

      const ai = getGeminiClient();

      // Build context envelope
      const contextSummary = `\n[CURRENT SPATIAL ENVIRONMENT STATE]\n- Active Focused 3D Module: ${activeModule || 'None'}\n- Module Telemetry: ${JSON.stringify(
        activeModuleData || {}
      )}\n- Hand Tracking Active: ${systemState?.isHandTrackingActive ?? true}\n- System FPS: ${
        systemState?.fps || 60
      }\n`;

      const contents: any[] = [];

      // Include past history
      if (Array.isArray(history)) {
        for (const msg of history.slice(-6)) {
          if (msg.role === 'user' || msg.role === 'assistant') {
            contents.push({
              role: msg.role === 'assistant' ? 'model' : 'user',
              parts: [{ text: msg.text }],
            });
          }
        }
      }

      // Add current user prompt with context
      contents.push({
        role: 'user',
        parts: [{ text: `${contextSummary}\nUser Query: ${prompt}` }],
      });

      const responseStream = await ai.models.generateContentStream({
        model: 'gemini-3.7-flash',
        contents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.7,
          maxOutputTokens: 300,
        },
      });

      for await (const chunk of responseStream) {
        const chunkText = chunk.text;
        if (chunkText) {
          res.write(`data: ${JSON.stringify({ text: chunkText })}\n\n`);
        }
      }

      res.write(`data: ${JSON.stringify({ isComplete: true })}\n\n`);
      res.end();
    } catch (error: any) {
      console.error('Gemini Stream Error:', error);
      const fallbackText = getOfflineFallbackResponse(prompt, activeModule);
      res.write(`data: ${JSON.stringify({ text: fallbackText, isComplete: true })}\n\n`);
      res.end();
    }
  });

  // Text-To-Speech (TTS) Endpoint using Gemini 3.1 Flash TTS
  app.post('/api/nexus/ai/tts', async (req, res) => {
    const { text, voice = 'Zephyr' } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(503).json({ error: 'GEMINI_API_KEY not configured' });
      }

      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-tts-preview',
        contents: [{ role: 'user', parts: [{ text }] }],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: {
                voiceName: voice,
              },
            },
          },
        },
      });

      const candidates = response.candidates;
      if (candidates && candidates[0]?.content?.parts) {
        for (const part of candidates[0].content.parts) {
          if (part.inlineData && part.inlineData.mimeType?.startsWith('audio/')) {
            return res.json({
              audio: part.inlineData.data,
              mimeType: part.inlineData.mimeType,
              sampleRate: 24000,
            });
          }
        }
      }

      res.status(404).json({ error: 'No audio candidate returned' });
    } catch (err: any) {
      console.warn('Gemini TTS Error:', err?.message);
      res.status(500).json({ error: err?.message || 'TTS generation failed' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true, host: '0.0.0.0', port: 3000 },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`NEXUS Spatial OS Server running on http://0.0.0.0:${PORT}`);
  });
}

function getOfflineFallbackResponse(prompt: string, activeModule?: string): string {
  const p = prompt.toLowerCase();
  if (p.includes('instagram') || p.includes('feed') || p.includes('reels')) {
    return `Opening Holographic Instagram Feed. You have 3 new notifications and trending posts ready. [[ACTION:{"type":"OPEN_MODULE","target":"instagram"}]]`;
  }
  if (p.includes('nvidia') || p.includes('stock') || p.includes('market') || p.includes('finance')) {
    return `Accessing Quantum Financial Feeds. NVDA is at $142.60 (+4.8%) and NASDAQ composite +1.4%. [[ACTION:{"type":"OPEN_MODULE","target":"stocks"}]]`;
  }
  if (p.includes('calendar') || p.includes('schedule') || p.includes('agenda') || p.includes('meeting')) {
    return `Retrieving temporal calendar data. Next event: "Spatial Architecture Sync" at 14:00. [[ACTION:{"type":"OPEN_MODULE","target":"calendar"}]]`;
  }
  if (p.includes('project') || p.includes('task') || p.includes('linear') || p.includes('sprint')) {
    return `Linear Sprint 48 loaded: 14 completed, 3 in progress. [[ACTION:{"type":"OPEN_MODULE","target":"projects"}]]`;
  }
  if (p.includes('sports') || p.includes('game') || p.includes('match') || p.includes('score')) {
    return `Live Sports Arena: Real Madrid vs Man City (2-1 78'), Lakers vs Warriors (Q3). [[ACTION:{"type":"OPEN_MODULE","target":"sports"}]]`;
  }
  if (p.includes('weather') || p.includes('climate') || p.includes('atmosphere')) {
    return `Atmospheric Sensor: 22°C, Atmospheric Pressure 1013hPa, Optimal air quality index. [[ACTION:{"type":"OPEN_MODULE","target":"weather"}]]`;
  }
  if (p.includes('news') || p.includes('headline')) {
    return `Quantum Newsfeed updated: Breakthroughs in Room-Temperature Superconductors and Spatial AI. [[ACTION:{"type":"OPEN_MODULE","target":"news"}]]`;
  }
  if (p.includes('rotate left') || p.includes('spin left')) {
    return `Rotating carousel left. [[ACTION:{"type":"ROTATE","direction":"left"}]]`;
  }
  if (p.includes('rotate right') || p.includes('spin right')) {
    return `Rotating carousel right. [[ACTION:{"type":"ROTATE","direction":"right"}]]`;
  }
  if (p.includes('expand') || p.includes('fullscreen') || p.includes('maximize')) {
    return `Expanding active module into deep holographic analytical view. [[ACTION:{"type":"EXPAND_MODULE","target":"${activeModule || 'stocks'}"}]]`;
  }
  if (p.includes('pulse') || p.includes('scan') || p.includes('ping')) {
    return `Initiating full spatial resonance scan. [[ACTION:{"type":"PULSE"}]]`;
  }
  if (p.includes('music') || p.includes('synth') || p.includes('sound')) {
    return `Synthesizing spatial ambient frequencies. [[ACTION:{"type":"MUSIC_CONTROL","command":"play"}]]`;
  }
  return `NEXUS AI Neural Subsystem online. Monitoring spatial telemetry and ready for multimodal voice and gesture commands.`;
}

startServer().catch((err) => {
  console.error('Server startup failed:', err);
});
