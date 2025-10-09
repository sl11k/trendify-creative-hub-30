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
    const { pageSlug, currentSeo } = await req.json();
    
    if (!pageSlug) {
      return new Response(
        JSON.stringify({ error: 'Page slug is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Optimizing SEO for page:', pageSlug);

    const systemPrompt = `أنت خبير SEO محترف في Trendify - شريك النمو المتكامل للمشاريع والشركات الناشئة.

معلومات عن Trendify:
- شريك نمو متكامل (ليست وكالة تسويق)
- نقدم منظومة دعم شاملة: استراتيجية، برمجة، تصميم، تسويق، إدارة محتوى، تحليل، تشغيل
- أدوات ذكية لتسريع التنفيذ وتقليل التكلفة
- نركز على تمكين رواد الأعمال والشركات الناشئة

مهمتك: تحسين SEO للصفحات بشكل احترافي`;

    const userPrompt = `حسّن SEO لصفحة: "${pageSlug}"
${currentSeo ? `\nSEO الحالي:\n${JSON.stringify(currentSeo, null, 2)}` : ''}

قدم الإجابة بصيغة JSON:
{
  "title_ar": "عنوان محسّن بالعربية (50-60 حرف)",
  "title_en": "Optimized title in English (50-60 chars)",
  "description_ar": "وصف محسّن بالعربية (150-160 حرف)",
  "description_en": "Optimized description in English (150-160 chars)",
  "keywords_ar": ["كلمة1", "كلمة2", "كلمة3", "كلمة4", "كلمة5"],
  "keywords_en": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "canonical_url": "https://trendify.com/${pageSlug}"
}`;

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
          { role: "user", content: userPrompt }
        ],
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    const seoData = JSON.parse(content);

    console.log('SEO optimized successfully');

    return new Response(
      JSON.stringify(seoData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in optimize-seo:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
