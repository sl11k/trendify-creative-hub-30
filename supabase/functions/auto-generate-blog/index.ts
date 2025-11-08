import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!LOVABLE_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Missing required environment variables');
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    console.log('Starting auto blog generation...');

    // Topics related to Trendify's services
    const topics = [
      'كيف يساعد الذكاء الاصطناعي في تحويل الشركات الناشئة السعودية',
      'دليل التحول الرقمي الشامل للمؤسسات الصغيرة في السعودية',
      'استراتيجيات التسويق بالذكاء الاصطناعي للشركات السعودية',
      'كيفية اختيار منصة الذكاء الاصطناعي المناسبة لعملك',
      'تحليلات البيانات التنبؤية: مستقبل اتخاذ القرارات التجارية',
      'أفضل ممارسات UX/UI للمواقع والتطبيقات السعودية',
      'التسويق الآلي: كيف توفر الوقت وتزيد المبيعات',
      'الذكاء الاصطناعي في إدارة المشاريع: دليل عملي',
      'كيف تقيس نجاح مشروع التحول الرقمي',
      'مستقبل التجارة الإلكترونية بالذكاء الاصطناعي في السعودية'
    ];

    // Select random topic
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];
    
    console.log('Selected topic:', randomTopic);

    // Generate comprehensive blog post
    const systemPrompt = `أنت كاتب محتوى محترف متخصص في Trendify - شركة حلول الأعمال بالذكاء الاصطناعي والتحول الرقمي في السعودية.

معلومات عن Trendify:
- شريك نمو ذكي متكامل (ليست وكالة تسويق تقليدية)
- نقدم: حلول الذكاء الاصطناعي، تطوير المواقع والتطبيقات الذكية، تحليلات تنبؤية، تصميم UX/UI، أتمتة التسويق، استراتيجيات نمو الشركات الناشئة
- نركز على السوق السعودي والخليجي
- نستخدم AI في كل عملية لتحقيق نمو مستدام

مهمتك: اكتب مقالة شاملة محسّنة لـ SEO تتضمن:

1. **العنوان**: جذاب ومحسّن لمحركات البحث (بالعربية والإنجليزية)
2. **المقدمة**: 150-200 كلمة تلخص أهمية الموضوع
3. **المحتوى الرئيسي**: 1500-2000 كلمة مقسمة إلى أقسام واضحة بعناوين H2 و H3
4. **نصائح عملية**: قابلة للتطبيق ومفيدة للقارئ
5. **دراسات حالة أو أمثلة**: ذات صلة بالسوق السعودي
6. **الخلاصة**: ملخص قوي مع دعوة للعمل
7. **Keywords**: 5-10 كلمات مفتاحية استراتيجية
8. **Meta Description**: محسّن تحت 160 حرف

**مهم جداً:**
- اكتب بأسلوب احترافي ومفيد
- ركز على القيمة الحقيقية للقارئ
- اربط المحتوى بخدمات Trendify بشكل طبيعي
- استخدم أمثلة من السوق السعودي
- تأكد من دقة المعلومات

أعد المقالة بصيغة JSON التالية:
{
  "title_ar": "العنوان بالعربية",
  "title_en": "Title in English",
  "excerpt_ar": "مقتطف قصير بالعربية (150 حرف)",
  "excerpt_en": "Short excerpt in English (150 chars)",
  "content_ar": "المحتوى الكامل بالعربية (استخدم Markdown)",
  "content_en": "Full content in English (use Markdown)",
  "meta_description_ar": "وصف ميتا بالعربية",
  "meta_description_en": "Meta description in English",
  "keywords_ar": ["كلمة1", "كلمة2", ...],
  "keywords_en": ["keyword1", "keyword2", ...],
  "canonical_url": "suggested-url-slug"
}`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `اكتب مقالة شاملة عن: ${randomTopic}\n\nتأكد من أن المقالة:\n- تحتوي على معلومات دقيقة وحديثة\n- محسّنة لمحركات البحث\n- مفيدة للشركات السعودية\n- تعرض خبرة Trendify في المجال\n- تحتوي على نصائح عملية قابلة للتطبيق` }
        ],
        response_format: { type: "json_object" }
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', aiResponse.status, errorText);
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    
    // Clean the response - remove markdown code blocks if present
    let content = aiData.choices[0].message.content;
    content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    const blogData = JSON.parse(content);

    console.log('Generated blog:', blogData.title_ar);

    // Generate featured image using AI
    let imageUrl = null;
    try {
      const imageResponse = await fetch("https://ai.gateway.lovable.dev/v1/images/generations", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash-image",
          prompt: `Create a professional, modern hero image for a blog post about "${blogData.title_en}". Style: clean, corporate, tech-focused, Saudi Arabia themes. Colors: blue, purple gradients. Include: AI elements, digital transformation symbols, business growth imagery. High quality, 16:9 aspect ratio.`,
          n: 1,
          size: "1024x1024"
        }),
      });

      if (imageResponse.ok) {
        const imageData = await imageResponse.json();
        imageUrl = imageData.data[0]?.url;
        console.log('Generated image URL:', imageUrl);
      }
    } catch (imageError) {
      console.error('Image generation failed:', imageError);
      // Continue without image
    }

    // Insert blog post into database
    const { data: insertedBlog, error: insertError } = await supabase
      .from('blogs')
      .insert({
        title_ar: blogData.title_ar,
        title_en: blogData.title_en,
        excerpt_ar: blogData.excerpt_ar,
        excerpt_en: blogData.excerpt_en,
        content_ar: blogData.content_ar,
        content_en: blogData.content_en,
        meta_description_ar: blogData.meta_description_ar,
        meta_description_en: blogData.meta_description_en,
        keywords_ar: blogData.keywords_ar,
        keywords_en: blogData.keywords_en,
        canonical_url: `https://trendify.com/blog/${blogData.canonical_url}`,
        image_url: imageUrl,
        published: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (insertError) {
      console.error('Database insert error:', insertError);
      throw insertError;
    }

    console.log('Blog post published successfully!', insertedBlog.id);

    // Generate sitemap update notification
    const response = {
      success: true,
      blog: {
        id: insertedBlog.id,
        title_ar: insertedBlog.title_ar,
        title_en: insertedBlog.title_en,
        url: insertedBlog.canonical_url,
        published_at: insertedBlog.created_at
      },
      message: 'Auto-generated blog post published successfully'
    };

    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in auto-generate-blog:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.toString()
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
