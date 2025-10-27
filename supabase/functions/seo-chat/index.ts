import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, pageSlug } = await req.json();
    
    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'Messages array is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('SEO Chat request for page:', pageSlug);

    const systemPrompt = `أنت خبير SEO محترف في Trendify - شريك النمو المتكامل للمشاريع والشركات الناشئة.

معلومات عن Trendify:
- شريك نمو متكامل (ليست وكالة تسويق)
- نقدم منظومة دعم شاملة: استراتيجية، برمجة، تصميم، تسويق، إدارة محتوى، تحليل، تشغيل
- أدوات ذكية لتسريع التنفيذ وتقليل التكلفة
- نركز على تمكين رواد الأعمال والشركات الناشئة

مهمتك:
1. مساعدة المستخدم في تحسين SEO للصفحات بشكل احترافي
2. طرح أسئلة لفهم احتياجات SEO بالضبط
3. تقديم اقتراحات محسّنة بناءً على المتطلبات
4. عند الانتهاء من المناقشة، قدم الإجابة النهائية بصيغة JSON بين علامات \`\`\`json و \`\`\`

صيغة JSON النهائية:
\`\`\`json
{
  "title_ar": "عنوان محسّن بالعربية (50-60 حرف)",
  "title_en": "Optimized title in English (50-60 chars)",
  "description_ar": "وصف محسّن بالعربية (150-160 حرف)",
  "description_en": "Optimized description in English (150-160 chars)",
  "keywords_ar": ["كلمة1", "كلمة2", "كلمة3", "كلمة4", "كلمة5"],
  "keywords_en": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "canonical_url": "https://trendify.com/${pageSlug || 'page'}"
}
\`\`\`

تحدث بالعربية بشكل احترافي ومفيد.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages
        ],
        stream: true
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "تم تجاوز حد الطلبات، يرجى المحاولة لاحقاً" }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "يرجى إضافة رصيد إلى حساب Lovable AI" }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, 'Content-Type': 'text/event-stream' }
    });
  } catch (error) {
    console.error('Error in seo-chat:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
