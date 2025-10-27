import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Sparkles, CheckCircle, Send, MessageSquare } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface PageSeo {
  id: string;
  page_slug: string;
  title_ar?: string;
  title_en?: string;
  description_ar?: string;
  description_en?: string;
  keywords_ar?: string[];
  keywords_en?: string[];
}

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export const AISeoOptimizer = () => {
  const { toast } = useToast();
  const [pages, setPages] = useState<PageSeo[]>([]);
  const [selectedPage, setSelectedPage] = useState<PageSeo | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadPages();
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const loadPages = async () => {
    const { data, error } = await supabase
      .from('page_seo')
      .select('*')
      .order('page_slug');

    if (!error && data) {
      setPages(data);
    }
  };

  const startChat = (page: PageSeo) => {
    setSelectedPage(page);
    setMessages([
      {
        role: 'assistant',
        content: `مرحباً! 👋\n\nأنا هنا لمساعدتك في تحسين SEO لصفحة "${page.page_slug}".\n\nأخبرني بالضبط:\n- ما هي الكلمات المفتاحية التي تريد التركيز عليها؟\n- ما هي الرسالة الأساسية للصفحة؟\n- أي متطلبات خاصة للعنوان أو الوصف؟\n\nسأساعدك في إنشاء SEO مخصص تماماً لاحتياجاتك! ✨`
      }
    ]);
  };

  const extractJsonFromMessage = (content: string) => {
    const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[1]);
      } catch (e) {
        console.error('Failed to parse JSON from message:', e);
      }
    }
    return null;
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !selectedPage || isStreaming) return;

    const userMessage: Message = { role: 'user', content: inputMessage };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsStreaming(true);

    try {
      const CHAT_URL = `https://sfgwaukvjwcwdvnxklod.supabase.co/functions/v1/seo-chat`;
      
      const response = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmZ3dhdWt2andjd2R2bnhrbG9kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1NjQyNTcsImV4cCI6MjA3MjE0MDI1N30.bM2hbn8mycmjv5Uqeax1zblJEHZrF-l39dCUBVjjCBc'}`
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          pageSlug: selectedPage.page_slug
        })
      });

      if (!response.ok) {
        if (response.status === 429) {
          toast({
            title: 'تنبيه',
            description: 'تم تجاوز حد الطلبات، يرجى المحاولة بعد قليل',
            variant: 'destructive'
          });
          return;
        }
        if (response.status === 402) {
          toast({
            title: 'تنبيه',
            description: 'يرجى إضافة رصيد إلى حساب Lovable AI',
            variant: 'destructive'
          });
          return;
        }
        throw new Error('Failed to start stream');
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader available');

      const decoder = new TextDecoder();
      let textBuffer = '';
      let assistantContent = '';
      let streamDone = false;

      // Add empty assistant message
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') {
            streamDone = true;
            break;
          }

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantContent += content;
              setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = {
                  role: 'assistant',
                  content: assistantContent
                };
                return newMessages;
              });
            }
          } catch {
            textBuffer = line + '\n' + textBuffer;
            break;
          }
        }
      }

      // Check if message contains JSON and apply it
      const seoData = extractJsonFromMessage(assistantContent);
      if (seoData && selectedPage) {
        const { error: updateError } = await supabase
          .from('page_seo')
          .update({
            title_ar: seoData.title_ar,
            title_en: seoData.title_en,
            description_ar: seoData.description_ar,
            description_en: seoData.description_en,
            keywords_ar: seoData.keywords_ar,
            keywords_en: seoData.keywords_en,
            canonical_url: seoData.canonical_url
          })
          .eq('id', selectedPage.id);

        if (!updateError) {
          toast({
            title: 'تم التطبيق بنجاح! ✨',
            description: `تم تحديث SEO لصفحة ${selectedPage.page_slug}`
          });
          await loadPages();
        }
      }

    } catch (error: any) {
      console.error('Error in chat:', error);
      toast({
        title: 'خطأ',
        description: error.message || 'حدث خطأ في المحادثة',
        variant: 'destructive'
      });
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Pages List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            محسّن SEO بالذكاء الاصطناعي
          </CardTitle>
          <CardDescription>
            اختر صفحة وتحدث مع الـ AI لتحسين SEO حسب احتياجاتك بالضبط
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {pages.map((page) => (
            <div
              key={page.id}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex-1">
                <p className="font-medium">{page.page_slug}</p>
                <p className="text-sm text-muted-foreground">
                  {page.title_ar || page.title_en || 'لا يوجد عنوان'}
                </p>
              </div>
              <Button
                onClick={() => startChat(page)}
                size="sm"
                variant={selectedPage?.id === page.id ? 'default' : 'outline'}
              >
                <MessageSquare className="h-4 w-4 mr-1" />
                {selectedPage?.id === page.id ? 'محادثة نشطة' : 'بدء محادثة'}
              </Button>
            </div>
          ))}
          
          {pages.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              لا توجد صفحات متاحة
            </p>
          )}
        </CardContent>
      </Card>

      {/* Chat Interface */}
      <Card className="flex flex-col h-[600px]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            {selectedPage ? `محادثة SEO - ${selectedPage.page_slug}` : 'اختر صفحة لبدء المحادثة'}
          </CardTitle>
          {selectedPage && (
            <CardDescription>
              أخبر الـ AI بالضبط ماذا تريد في الـ SEO وسيقوم بإنشائه لك
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="flex-1 flex flex-col min-h-0">
          {!selectedPage ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>اختر صفحة من القائمة لبدء تحسين SEO</p>
              </div>
            </div>
          ) : (
            <>
              {/* Messages */}
              <ScrollArea className="flex-1 pr-4 mb-4">
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Input */}
              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !isStreaming && sendMessage()}
                  placeholder="اكتب رسالتك هنا..."
                  disabled={isStreaming}
                  className="flex-1"
                />
                <Button
                  onClick={sendMessage}
                  disabled={!inputMessage.trim() || isStreaming}
                  size="icon"
                >
                  {isStreaming ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>

              <p className="text-xs text-muted-foreground mt-2">
                💡 عند الانتهاء، سيقوم الـ AI بتطبيق التحسينات تلقائياً
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
