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
    const { topic, language = 'both' } = await req.json();
    
    if (!topic) {
      return new Response(
        JSON.stringify({ error: 'Topic is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Generating blog post for topic:', topic);

    const systemPrompt = `أنت كاتب محتوى محترف في Trendify. مهمتك إنشاء مقالات عالية الجودة.
    
القواعد:
- اكتب محتوى قيم وجذاب
- استخدم لغة احترافية وواضحة
- أضف عناوين فرعية منظمة
- اجعل المحتوى متوافق مع SEO
- اختر كلمات مفتاحية ذات صلة`;

    const userPrompt = `اكتب مقالة كاملة عن: "${topic}"

يجب أن تتضمن الإجابة JSON بالشكل التالي:
{
  "title_ar": "عنوان المقالة بالعربية",
  "title_en": "Article title in English",
  "excerpt_ar": "ملخص قصير بالعربية (150-200 حرف)",
  "excerpt_en": "Short excerpt in English (150-200 chars)",
  "content_ar": "المحتوى الكامل بالعربية مع عناوين فرعية",
  "content_en": "Full content in English with subheadings",
  "keywords_ar": ["كلمة1", "كلمة2", "كلمة3", "كلمة4", "كلمة5"],
  "keywords_en": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "meta_description_ar": "وصف ميتا بالعربية (150-160 حرف)",
  "meta_description_en": "Meta description in English (150-160 chars)",
  "image_prompt": "A detailed prompt for generating a relevant blog image"
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
    const blogData = JSON.parse(content);

    console.log('Blog post generated successfully');

    return new Response(
      JSON.stringify(blogData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in generate-blog-post:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
