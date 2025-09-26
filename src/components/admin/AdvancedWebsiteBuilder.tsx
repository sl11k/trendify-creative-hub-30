import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Type, Image, Square, Circle as CircleIcon, Save, Eye, Trash2, Download, Upload, Palette, MousePointer, Settings, Plus, Edit, Move, Copy, RotateCw, Layers } from 'lucide-react';
import { useWebsiteDesign } from '@/hooks/useWebsiteDesign';

interface DragItem {
  id: string;
  type: 'text' | 'image' | 'button' | 'card' | 'section' | 'heading' | 'paragraph' | 'link' | 'list' | 'divider';
  content: string;
  styles: Record<string, string>;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  children?: DragItem[];
}

interface LayoutData {
  items: DragItem[];
  css: string;
  js: string;
}

const pages = [
  { value: 'home', label: 'الصفحة الرئيسية' },
  { value: 'about', label: 'من نحن' },
  { value: 'services', label: 'الخدمات' },
  { value: 'portfolio', label: 'الأعمال' },
  { value: 'blog', label: 'المدونة' },
  { value: 'contact', label: 'اتصل بنا' }
];

export const AdvancedWebsiteBuilder = () => {
  const [selectedPage, setSelectedPage] = useState<string>('home');
  const [layoutData, setLayoutData] = useState<LayoutData>({ items: [], css: '', js: '' });
  const [activeTool, setActiveTool] = useState<'select' | 'text' | 'image' | 'button' | 'card' | 'section' | 'heading' | 'paragraph' | 'link' | 'list' | 'divider'>('select');
  const [selectedElement, setSelectedElement] = useState<DragItem | null>(null);
  const [customCSS, setCustomCSS] = useState('');
  const [customJS, setCustomJS] = useState('');
  const [draggedElement, setDraggedElement] = useState<DragItem | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const { design, layoutData: existingLayout, isLoading, refetch } = useWebsiteDesign(selectedPage);

  useEffect(() => {
    if (existingLayout && existingLayout.items) {
      setLayoutData(existingLayout);
      setCustomCSS(existingLayout.css || '');
      setCustomJS(existingLayout.js || '');
    }
  }, [existingLayout]);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const createElement = (type: DragItem['type']): DragItem => {
    const baseElement = {
      id: generateId(),
      type,
      content: getDefaultContent(type),
      styles: getDefaultStyles(type),
      x: 0,
      y: 0,
      width: getDefaultWidth(type),
      height: getDefaultHeight(type)
    };
    return baseElement;
  };

  const getDefaultContent = (type: DragItem['type']): string => {
    const defaults = {
      text: 'نص جديد',
      heading: 'عنوان جديد',
      paragraph: 'فقرة جديدة، يمكنك تحرير هذا النص حسب احتياجاتك.',
      button: 'زر',
      card: 'بطاقة جديدة',
      section: 'قسم جديد',
      image: '/placeholder.svg',
      link: 'رابط جديد',
      list: 'عنصر أول\nعنصر ثاني\nعنصر ثالث',
      divider: ''
    };
    return defaults[type] || 'محتوى جديد';
  };

  const getDefaultStyles = (type: DragItem['type']): Record<string, string> => {
    const baseStyles = {
      text: { fontSize: '16px', color: '#000000', fontFamily: 'Arial' },
      heading: { fontSize: '32px', color: '#000000', fontWeight: 'bold', fontFamily: 'Arial' },
      paragraph: { fontSize: '16px', color: '#333333', lineHeight: '1.6', fontFamily: 'Arial' },
      button: { 
        backgroundColor: '#007bff', 
        color: '#ffffff', 
        padding: '10px 20px', 
        borderRadius: '5px',
        border: 'none',
        cursor: 'pointer',
        fontSize: '16px'
      },
      card: { 
        backgroundColor: '#ffffff', 
        border: '1px solid #e0e0e0', 
        borderRadius: '8px',
        padding: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      },
      section: { 
        backgroundColor: '#f8f9fa', 
        padding: '40px 20px',
        minHeight: '200px'
      },
      image: { maxWidth: '100%', height: 'auto', borderRadius: '4px' },
      link: { color: '#007bff', textDecoration: 'underline', cursor: 'pointer' },
      list: { padding: '0', margin: '10px 0', listStyle: 'disc', paddingLeft: '20px' },
      divider: { height: '1px', backgroundColor: '#e0e0e0', margin: '20px 0', border: 'none' }
    };
    return baseStyles[type] || {};
  };

  const getDefaultWidth = (type: DragItem['type']): number => {
    const widths = {
      text: 200, heading: 300, paragraph: 400, button: 120, card: 300, 
      section: 800, image: 200, link: 100, list: 250, divider: 400
    };
    return widths[type] || 200;
  };

  const getDefaultHeight = (type: DragItem['type']): number => {
    const heights = {
      text: 30, heading: 40, paragraph: 80, button: 40, card: 200, 
      section: 200, image: 150, link: 30, list: 100, divider: 1
    };
    return heights[type] || 50;
  };

  const addElement = (type: DragItem['type']) => {
    const newElement = createElement(type);
    setLayoutData(prev => ({
      ...prev,
      items: [...prev.items, newElement]
    }));
    setSelectedElement(newElement);
  };

  const updateElement = (id: string, updates: Partial<DragItem>) => {
    setLayoutData(prev => ({
      ...prev,
      items: prev.items.map(item => 
        item.id === id ? { ...item, ...updates } : item
      )
    }));
    if (selectedElement?.id === id) {
      setSelectedElement(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const deleteElement = (id: string) => {
    setLayoutData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
    if (selectedElement?.id === id) {
      setSelectedElement(null);
    }
  };

  const duplicateElement = (id: string) => {
    const element = layoutData.items.find(item => item.id === id);
    if (element) {
      const duplicated = {
        ...element,
        id: generateId(),
        x: (element.x || 0) + 20,
        y: (element.y || 0) + 20
      };
      setLayoutData(prev => ({
        ...prev,
        items: [...prev.items, duplicated]
      }));
    }
  };

  const saveDesign = async () => {
    if (!selectedPage) return;

    try {
      const { error } = await supabase
        .from('website_design')
        .upsert({
          page_slug: selectedPage,
          layout_json: JSON.stringify({
            items: layoutData.items,
            css: customCSS,
            js: customJS
          }),
          custom_css: customCSS,
          custom_js: customJS,
          is_active: true
        });

      if (error) throw error;

      toast({
        title: "تم الحفظ بنجاح",
        description: "تم حفظ تصميم الصفحة بنجاح"
      });

      refetch();
    } catch (error) {
      console.error('Error saving design:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حفظ التصميم",
        variant: "destructive"
      });
    }
  };

  const renderElement = (item: DragItem) => {
    const elementStyle: React.CSSProperties = {
      ...item.styles,
      position: 'absolute',
      left: item.x || 0,
      top: item.y || 0,
      width: item.width || 'auto',
      height: item.height || 'auto',
      cursor: 'pointer',
      border: selectedElement?.id === item.id ? '2px solid #007bff' : '1px solid transparent',
      minHeight: item.type === 'section' ? '100px' : 'auto'
    };

    const handleElementClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      setSelectedElement(item);
    };

    switch (item.type) {
      case 'text':
      case 'paragraph':
        return (
          <div
            key={item.id}
            style={elementStyle}
            onClick={handleElementClick}
            className="hover:shadow-md transition-shadow"
          >
            {item.content}
          </div>
        );
      
      case 'heading':
        return (
          <h2
            key={item.id}
            style={elementStyle}
            onClick={handleElementClick}
            className="hover:shadow-md transition-shadow"
          >
            {item.content}
          </h2>
        );
      
      case 'button':
        return (
          <button
            key={item.id}
            style={elementStyle}
            onClick={handleElementClick}
            className="hover:shadow-md transition-shadow"
          >
            {item.content}
          </button>
        );
      
      case 'image':
        return (
          <img
            key={item.id}
            src={item.content}
            alt="Element"
            style={elementStyle}
            onClick={handleElementClick}
            className="hover:shadow-md transition-shadow"
          />
        );
      
      case 'card':
        return (
          <div
            key={item.id}
            style={elementStyle}
            onClick={handleElementClick}
            className="hover:shadow-md transition-shadow"
          >
            <div className="p-4">
              {item.content}
            </div>
          </div>
        );
      
      case 'section':
        return (
          <section
            key={item.id}
            style={elementStyle}
            onClick={handleElementClick}
            className="hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              {item.content}
            </div>
          </section>
        );
      
      case 'link':
        return (
          <a
            key={item.id}
            style={elementStyle}
            onClick={handleElementClick}
            className="hover:shadow-md transition-shadow"
            href="#"
          >
            {item.content}
          </a>
        );
      
      case 'list':
        return (
          <ul
            key={item.id}
            style={elementStyle}
            onClick={handleElementClick}
            className="hover:shadow-md transition-shadow"
          >
            {item.content.split('\n').map((listItem, index) => (
              <li key={index}>{listItem}</li>
            ))}
          </ul>
        );
      
      case 'divider':
        return (
          <hr
            key={item.id}
            style={elementStyle}
            onClick={handleElementClick}
            className="hover:shadow-md transition-shadow"
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            تصميم الموقع الأسطوري
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">اختر الصفحة</Label>
                <Select value={selectedPage} onValueChange={setSelectedPage}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر صفحة للتعديل" />
                  </SelectTrigger>
                  <SelectContent>
                    {pages.map((page) => (
                      <SelectItem key={page.value} value={page.value}>
                        {page.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  عناصر التصميم
                </h3>
                <ScrollArea className="h-96">
                  <div className="space-y-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => addElement('heading')} 
                      className="w-full justify-start"
                    >
                      <Type className="h-4 w-4 mr-2" />
                      عنوان رئيسي
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => addElement('paragraph')} 
                      className="w-full justify-start"
                    >
                      <Type className="h-4 w-4 mr-2" />
                      فقرة نصية
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => addElement('text')} 
                      className="w-full justify-start"
                    >
                      <Type className="h-4 w-4 mr-2" />
                      نص عادي
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => addElement('button')} 
                      className="w-full justify-start"
                    >
                      <Square className="h-4 w-4 mr-2" />
                      زر تفاعلي
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => addElement('image')} 
                      className="w-full justify-start"
                    >
                      <Image className="h-4 w-4 mr-2" />
                      صورة
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => addElement('card')} 
                      className="w-full justify-start"
                    >
                      <Layers className="h-4 w-4 mr-2" />
                      بطاقة
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => addElement('section')} 
                      className="w-full justify-start"
                    >
                      <Square className="h-4 w-4 mr-2" />
                      قسم كامل
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => addElement('link')} 
                      className="w-full justify-start"
                    >
                      <CircleIcon className="h-4 w-4 mr-2" />
                      رابط
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => addElement('list')} 
                      className="w-full justify-start"
                    >
                      <Square className="h-4 w-4 mr-2" />
                      قائمة
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => addElement('divider')} 
                      className="w-full justify-start"
                    >
                      <Square className="h-4 w-4 mr-2" />
                      فاصل
                    </Button>
                  </div>
                </ScrollArea>
              </div>
            </div>

            {/* Canvas */}
            <div className="lg:col-span-2">
              <div className="border border-gray-200 rounded-lg shadow-lg overflow-hidden bg-white min-h-[600px]">
                <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b flex justify-between items-center">
                  <div className="flex gap-2">
                    <Button size="sm" onClick={saveDesign} className="bg-green-600 hover:bg-green-700">
                      <Save className="h-4 w-4 mr-2" />
                      حفظ التصميم
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setIsPreviewMode(!isPreviewMode)}>
                      <Eye className="h-4 w-4 mr-2" />
                      {isPreviewMode ? 'وضع التحرير' : 'معاينة'}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => setLayoutData({ items: [], css: '', js: '' })}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      مسح الكل
                    </Button>
                  </div>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    {pages.find(p => p.value === selectedPage)?.label || 'لم يتم اختيار صفحة'}
                  </Badge>
                </div>
                
                <div 
                  className="relative p-4 min-h-[550px] bg-white"
                  onClick={() => setSelectedElement(null)}
                  style={{ background: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,.05) 10px, rgba(0,0,0,.05) 20px)' }}
                >
                  {layoutData.items.map(renderElement)}
                  
                  {layoutData.items.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      <div className="text-center">
                        <Plus className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p className="text-lg mb-2">ابدأ بإضافة عناصر التصميم</p>
                        <p className="text-sm">اختر عنصر من القائمة الجانبية لإضافته</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Properties Panel */}
            <div className="lg:col-span-1 space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Edit className="h-4 w-4" />
                    خصائص العنصر
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedElement ? (
                    <>
                      <div>
                        <Label className="text-sm font-medium">نوع العنصر</Label>
                        <p className="text-sm text-muted-foreground bg-gray-50 p-2 rounded">
                          {selectedElement.type}
                        </p>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium">المحتوى</Label>
                        <Textarea
                          value={selectedElement.content}
                          onChange={(e) => updateElement(selectedElement.id, { content: e.target.value })}
                          rows={3}
                          className="mt-1"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-sm font-medium">العرض</Label>
                          <Input
                            type="number"
                            value={selectedElement.width || ''}
                            onChange={(e) => updateElement(selectedElement.id, { width: Number(e.target.value) })}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-medium">الارتفاع</Label>
                          <Input
                            type="number"
                            value={selectedElement.height || ''}
                            onChange={(e) => updateElement(selectedElement.id, { height: Number(e.target.value) })}
                            className="mt-1"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-sm font-medium">الموضع الأفقي</Label>
                          <Input
                            type="number"
                            value={selectedElement.x || ''}
                            onChange={(e) => updateElement(selectedElement.id, { x: Number(e.target.value) })}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-medium">الموضع العمودي</Label>
                          <Input
                            type="number"
                            value={selectedElement.y || ''}
                            onChange={(e) => updateElement(selectedElement.id, { y: Number(e.target.value) })}
                            className="mt-1"
                          />
                        </div>
                      </div>

                      <Separator />

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => duplicateElement(selectedElement.id)}
                          className="flex-1"
                        >
                          <Copy className="h-4 w-4 mr-1" />
                          نسخ
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteElement(selectedElement.id)}
                          className="flex-1 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          حذف
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <MousePointer className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm text-muted-foreground">اختر عنصر من التصميم للتعديل عليه</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Tabs defaultValue="css" className="w-full">
                <TabsList className="w-full">
                  <TabsTrigger value="css" className="flex-1">CSS مخصص</TabsTrigger>
                  <TabsTrigger value="js" className="flex-1">JS مخصص</TabsTrigger>
                </TabsList>
                <TabsContent value="css">
                  <Card>
                    <CardContent className="p-3">
                      <Textarea
                        placeholder="أضف CSS مخصص هنا..."
                        value={customCSS}
                        onChange={(e) => setCustomCSS(e.target.value)}
                        rows={8}
                        className="font-mono text-sm"
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="js">
                  <Card>
                    <CardContent className="p-3">
                      <Textarea
                        placeholder="أضف JavaScript مخصص هنا..."
                        value={customJS}
                        onChange={(e) => setCustomJS(e.target.value)}
                        rows={8}
                        className="font-mono text-sm"
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};