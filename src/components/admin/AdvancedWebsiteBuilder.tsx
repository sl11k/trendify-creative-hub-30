import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Save, Code, Palette, Eye, Trash2, Plus, MousePointer, Square, Circle, Type, 
  Image as ImageIcon, Layout, Layers, Move, RotateCcw, Copy, Settings,
  Monitor, Tablet, Smartphone, Zap, Wand, Grid, List, ArrowUp, ArrowDown,
  ChevronLeft, ChevronRight, Home, FileText, Briefcase, Phone, Mail
} from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Canvas as FabricCanvas, Rect, Circle as FabricCircle, Textbox, FabricImage } from "fabric";

// Available pages to customize
const availablePages = [
  { id: 'home', name: 'الصفحة الرئيسية', icon: Home, slug: '/' },
  { id: 'about', name: 'من نحن', icon: FileText, slug: '/about' },
  { id: 'services', name: 'الخدمات', icon: Settings, slug: '/services' },
  { id: 'portfolio', name: 'الأعمال', icon: Briefcase, slug: '/portfolio' },
  { id: 'blog', name: 'المدونة', icon: FileText, slug: '/blog' },
  { id: 'contact', name: 'اتصل بنا', icon: Phone, slug: '/contact' }
];

interface PageElement {
  id: string;
  type: 'text' | 'image' | 'button' | 'card' | 'section' | 'hero' | 'navbar' | 'footer';
  content: string;
  styles: Record<string, any>;
  position: { x: number; y: number };
  size: { width: number; height: number };
  properties: Record<string, any>;
  children?: PageElement[];
}

interface PageDesign {
  id: string;
  page_id: string;
  page_name: string;
  elements: PageElement[];
  global_styles: Record<string, any>;
  responsive_settings: Record<string, any>;
  custom_css: string;
  custom_js: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const AdvancedWebsiteBuilder = () => {
  const [selectedPage, setSelectedPage] = useState('home');
  const [currentDesign, setCurrentDesign] = useState<PageDesign | null>(null);
  const [elements, setElements] = useState<PageElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<PageElement | null>(null);
  const [activeTool, setActiveTool] = useState<'select' | 'text' | 'image' | 'button' | 'section'>('select');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [showLayers, setShowLayers] = useState(true);
  const [showProperties, setShowProperties] = useState(true);
  const [customCSS, setCustomCSS] = useState('');
  const [customJS, setCustomJS] = useState('');

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);

  // Element templates
  const elementTemplates = [
    {
      type: 'hero',
      name: 'قسم البطل',
      icon: Layout,
      template: {
        type: 'hero' as const,
        content: 'مرحباً بكم في موقعنا',
        styles: {
          backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: '#ffffff',
          padding: '100px 20px',
          textAlign: 'center',
          fontSize: '3rem',
          fontWeight: 'bold'
        },
        properties: {
          backgroundImage: '',
          overlayOpacity: 0.5,
          alignment: 'center'
        }
      }
    },
    {
      type: 'text',
      name: 'نص',
      icon: Type,
      template: {
        type: 'text' as const,
        content: 'نص جديد',
        styles: {
          fontSize: '16px',
          color: '#333333',
          fontFamily: 'Arial, sans-serif',
          lineHeight: '1.5'
        },
        properties: {
          tag: 'p',
          editable: true
        }
      }
    },
    {
      type: 'image',
      name: 'صورة',
      icon: ImageIcon,
      template: {
        type: 'image' as const,
        content: 'https://via.placeholder.com/300x200',
        styles: {
          width: '300px',
          height: '200px',
          borderRadius: '8px',
          objectFit: 'cover'
        },
        properties: {
          alt: 'صورة',
          lazy: true
        }
      }
    },
    {
      type: 'button',
      name: 'زر',
      icon: Square,
      template: {
        type: 'button' as const,
        content: 'اضغط هنا',
        styles: {
          backgroundColor: '#3b82f6',
          color: '#ffffff',
          padding: '12px 24px',
          borderRadius: '6px',
          border: 'none',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: '500'
        },
        properties: {
          href: '#',
          target: '_self',
          action: 'link'
        }
      }
    },
    {
      type: 'card',
      name: 'بطاقة',
      icon: Square,
      template: {
        type: 'card' as const,
        content: 'محتوى البطاقة',
        styles: {
          backgroundColor: '#ffffff',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb'
        },
        properties: {
          hoverable: true,
          clickable: false
        }
      }
    },
    {
      type: 'section',
      name: 'قسم',
      icon: Layout,
      template: {
        type: 'section' as const,
        content: 'قسم جديد',
        styles: {
          padding: '60px 20px',
          backgroundColor: '#f8fafc',
          minHeight: '200px'
        },
        properties: {
          container: true,
          fullWidth: false
        }
      }
    }
  ];

  useEffect(() => {
    loadPageDesign();
  }, [selectedPage]);

  useEffect(() => {
    if (canvasRef.current && !fabricCanvas) {
      const canvas = new FabricCanvas(canvasRef.current, {
        width: 1200,
        height: 800,
        backgroundColor: "#ffffff",
      });

      canvas.on('selection:created', (e) => {
        if (e.selected && e.selected.length > 0) {
        const selectedObj = e.selected[0] as any;
        // Find corresponding element
        const element = elements.find(el => el.id === selectedObj.elementId);
          if (element) {
            setSelectedElement(element);
          }
        }
      });

      canvas.on('selection:cleared', () => {
        setSelectedElement(null);
      });

      setFabricCanvas(canvas);

      return () => {
        canvas.dispose();
      };
    }
  }, [canvasRef.current]);

  const loadPageDesign = async () => {
    try {
      const { data, error } = await supabase
        .from('website_design')
        .select('*')
        .eq('page_slug', selectedPage)
        .eq('is_active', true)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        const design = JSON.parse(data.layout_json);
        setCurrentDesign(data as any);
        setElements(design.elements || []);
        setCustomCSS(data.custom_css || '');
        setCustomJS(data.custom_js || '');
      } else {
        // Initialize empty design
        setCurrentDesign(null);
        setElements([]);
        setCustomCSS('');
        setCustomJS('');
      }
    } catch (error) {
      console.error('Error loading page design:', error);
      toast.error('حدث خطأ في تحميل تصميم الصفحة');
    }
  };

  const savePageDesign = async () => {
    try {
      const designData = {
        page_slug: selectedPage,
        layout_json: JSON.stringify({
          elements,
          globalStyles: {},
          responsiveSettings: {}
        }),
        custom_css: customCSS,
        custom_js: customJS,
        is_active: true
      };

      if (currentDesign) {
        const { error } = await supabase
          .from('website_design')
          .update(designData)
          .eq('id', currentDesign.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('website_design')
          .insert([designData]);

        if (error) throw error;
      }

      toast.success('تم حفظ التصميم بنجاح');
      loadPageDesign();
    } catch (error) {
      console.error('Error saving page design:', error);
      toast.error('حدث خطأ في حفظ التصميم');
    }
  };

  const addElement = (template: any) => {
    const newElement: PageElement = {
      id: Date.now().toString(),
      ...template,
      position: { x: 100, y: 100 },
      size: { width: 300, height: 100 },
      properties: { ...template.properties }
    };

    setElements(prev => [...prev, newElement]);
    setSelectedElement(newElement);

    // Add to Fabric canvas
    if (fabricCanvas) {
      let fabricObject;
      
      switch (template.type) {
        case 'text':
          fabricObject = new Textbox(template.content, {
            left: 100,
            top: 100,
            fontSize: 16,
            fill: template.styles.color || '#000000'
          });
          break;
        case 'button':
          fabricObject = new Rect({
            left: 100,
            top: 100,
            width: 120,
            height: 40,
            fill: template.styles.backgroundColor || '#3b82f6',
            rx: 6,
            ry: 6
          });
          break;
        default:
          fabricObject = new Rect({
            left: 100,
            top: 100,
            width: 200,
            height: 100,
            fill: template.styles.backgroundColor || '#f0f0f0'
          });
      }

      fabricObject.set({ data: { elementId: newElement.id } });
      fabricCanvas.add(fabricObject);
      fabricCanvas.renderAll();
    }
  };

  const updateElement = (elementId: string, updates: Partial<PageElement>) => {
    setElements(prev => prev.map(el => 
      el.id === elementId ? { ...el, ...updates } : el
    ));

    if (selectedElement?.id === elementId) {
      setSelectedElement(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const deleteElement = (elementId: string) => {
    setElements(prev => prev.filter(el => el.id !== elementId));
    
    if (selectedElement?.id === elementId) {
      setSelectedElement(null);
    }

    // Remove from Fabric canvas
    if (fabricCanvas) {
      const objects = fabricCanvas.getObjects();
      const targetObject = objects.find(obj => (obj as any).elementId === elementId);
      if (targetObject) {
        fabricCanvas.remove(targetObject);
        fabricCanvas.renderAll();
      }
    }
  };

  const duplicateElement = (elementId: string) => {
    const element = elements.find(el => el.id === elementId);
    if (element) {
      const newElement = {
        ...element,
        id: Date.now().toString(),
        position: { x: element.position.x + 20, y: element.position.y + 20 }
      };
      setElements(prev => [...prev, newElement]);
    }
  };

  const moveElement = (elementId: string, direction: 'up' | 'down') => {
    const currentIndex = elements.findIndex(el => el.id === elementId);
    if (currentIndex === -1) return;

    const newElements = [...elements];
    if (direction === 'up' && currentIndex > 0) {
      [newElements[currentIndex], newElements[currentIndex - 1]] = 
      [newElements[currentIndex - 1], newElements[currentIndex]];
    } else if (direction === 'down' && currentIndex < elements.length - 1) {
      [newElements[currentIndex], newElements[currentIndex + 1]] = 
      [newElements[currentIndex + 1], newElements[currentIndex]];
    }

    setElements(newElements);
  };

  const currentPage = availablePages.find(page => page.id === selectedPage);

  return (
    <div className="h-screen flex bg-background">
      {/* Left Sidebar - Pages & Elements */}
      <div className="w-80 border-r bg-card">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">منشئ المواقع المتقدم</h2>
          <p className="text-sm text-muted-foreground">تحكم كامل في تصميم الموقع</p>
        </div>

        <Tabs defaultValue="pages" className="h-full">
          <TabsList className="grid w-full grid-cols-2 mx-4 mt-2">
            <TabsTrigger value="pages">الصفحات</TabsTrigger>
            <TabsTrigger value="elements">العناصر</TabsTrigger>
          </TabsList>

          <TabsContent value="pages" className="p-4 space-y-2">
            <h3 className="font-medium mb-3">اختر الصفحة للتحرير</h3>
            {availablePages.map((page) => {
              const PageIcon = page.icon;
              return (
                <Button
                  key={page.id}
                  variant={selectedPage === page.id ? 'default' : 'ghost'}
                  className="w-full justify-start gap-2"
                  onClick={() => setSelectedPage(page.id)}
                >
                  <PageIcon className="h-4 w-4" />
                  {page.name}
                </Button>
              );
            })}
          </TabsContent>

          <TabsContent value="elements" className="p-4 space-y-2">
            <h3 className="font-medium mb-3">إضافة عناصر</h3>
            {elementTemplates.map((template) => {
              const TemplateIcon = template.icon;
              return (
                <Button
                  key={template.type}
                  variant="ghost"
                  className="w-full justify-start gap-2"
                  onClick={() => addElement(template.template)}
                >
                  <TemplateIcon className="h-4 w-4" />
                  {template.name}
                </Button>
              );
            })}
          </TabsContent>
        </Tabs>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Toolbar */}
        <div className="border-b bg-card p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {currentPage && <currentPage.icon className="h-5 w-5" />}
                <span className="font-medium">{currentPage?.name}</span>
              </div>
              
              <div className="flex gap-1">
                <Button
                  variant={previewDevice === 'desktop' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPreviewDevice('desktop')}
                >
                  <Monitor className="h-4 w-4" />
                </Button>
                <Button
                  variant={previewDevice === 'tablet' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPreviewDevice('tablet')}
                >
                  <Tablet className="h-4 w-4" />
                </Button>
                <Button
                  variant={previewDevice === 'mobile' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPreviewDevice('mobile')}
                >
                  <Smartphone className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                معاينة
              </Button>
              <Button onClick={savePageDesign} size="sm">
                <Save className="h-4 w-4 mr-2" />
                حفظ
              </Button>
            </div>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 bg-muted/20 p-4 overflow-auto">
          <div className={`mx-auto bg-background shadow-lg rounded-lg overflow-hidden transition-all ${
            previewDevice === 'desktop' ? 'max-w-6xl' :
            previewDevice === 'tablet' ? 'max-w-2xl' : 'max-w-sm'
          }`}>
            <div className="relative">
              <canvas ref={canvasRef} className="w-full" />
              
              {/* Live Preview of Elements */}
              <div className="absolute inset-0 pointer-events-none">
                {elements.map((element) => (
                  <div
                    key={element.id}
                    className={`absolute ${selectedElement?.id === element.id ? 'ring-2 ring-primary' : ''}`}
                    style={{
                      left: element.position.x,
                      top: element.position.y,
                      width: element.size.width,
                      height: element.size.height,
                      ...element.styles
                    }}
                  >
                    {element.type === 'text' && (
                      <div dangerouslySetInnerHTML={{ __html: element.content }} />
                    )}
                    {element.type === 'image' && (
                      <img 
                        src={element.content} 
                        alt={element.properties.alt || ''} 
                        className="w-full h-full object-cover"
                      />
                    )}
                    {element.type === 'button' && (
                      <button className="w-full h-full">
                        {element.content}
                      </button>
                    )}
                    {(element.type === 'card' || element.type === 'section') && (
                      <div className="w-full h-full flex items-center justify-center">
                        {element.content}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Properties & Layers */}
      <div className="w-80 border-l bg-card">
        <Tabs defaultValue="properties" className="h-full">
          <TabsList className="grid w-full grid-cols-2 mx-4 mt-2">
            <TabsTrigger value="properties">الخصائص</TabsTrigger>
            <TabsTrigger value="layers">الطبقات</TabsTrigger>
          </TabsList>

          <TabsContent value="properties" className="p-4 space-y-4">
            {selectedElement ? (
              <>
                <div>
                  <h3 className="font-medium mb-3">خصائص العنصر</h3>
                  <Badge variant="outline">{selectedElement.type}</Badge>
                </div>

                <div className="space-y-3">
                  <div>
                    <Label>المحتوى</Label>
                    <Textarea
                      value={selectedElement.content}
                      onChange={(e) => updateElement(selectedElement.id, { content: e.target.value })}
                      className="mt-1"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label>العرض</Label>
                      <Input
                        type="number"
                        value={selectedElement.size.width}
                        onChange={(e) => updateElement(selectedElement.id, { 
                          size: { ...selectedElement.size, width: parseInt(e.target.value) }
                        })}
                      />
                    </div>
                    <div>
                      <Label>الارتفاع</Label>
                      <Input
                        type="number"
                        value={selectedElement.size.height}
                        onChange={(e) => updateElement(selectedElement.id, { 
                          size: { ...selectedElement.size, height: parseInt(e.target.value) }
                        })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label>موقع X</Label>
                      <Input
                        type="number"
                        value={selectedElement.position.x}
                        onChange={(e) => updateElement(selectedElement.id, { 
                          position: { ...selectedElement.position, x: parseInt(e.target.value) }
                        })}
                      />
                    </div>
                    <div>
                      <Label>موقع Y</Label>
                      <Input
                        type="number"
                        value={selectedElement.position.y}
                        onChange={(e) => updateElement(selectedElement.id, { 
                          position: { ...selectedElement.position, y: parseInt(e.target.value) }
                        })}
                      />
                    </div>
                  </div>

                  {selectedElement.type === 'text' && (
                    <>
                      <div>
                        <Label>حجم الخط</Label>
                        <Input
                          value={selectedElement.styles.fontSize || '16px'}
                          onChange={(e) => updateElement(selectedElement.id, { 
                            styles: { ...selectedElement.styles, fontSize: e.target.value }
                          })}
                        />
                      </div>
                      <div>
                        <Label>لون النص</Label>
                        <Input
                          type="color"
                          value={selectedElement.styles.color || '#000000'}
                          onChange={(e) => updateElement(selectedElement.id, { 
                            styles: { ...selectedElement.styles, color: e.target.value }
                          })}
                        />
                      </div>
                    </>
                  )}

                  {(selectedElement.type === 'button' || selectedElement.type === 'card' || selectedElement.type === 'section') && (
                    <div>
                      <Label>لون الخلفية</Label>
                      <Input
                        type="color"
                        value={selectedElement.styles.backgroundColor || '#ffffff'}
                        onChange={(e) => updateElement(selectedElement.id, { 
                          styles: { ...selectedElement.styles, backgroundColor: e.target.value }
                        })}
                      />
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => duplicateElement(selectedElement.id)}
                    className="flex-1"
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    نسخ
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => deleteElement(selectedElement.id)}
                    className="flex-1"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    حذف
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>اختر عنصر لتحرير خصائصه</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="layers" className="p-4">
            <div className="space-y-2">
              <h3 className="font-medium mb-3">طبقات الصفحة</h3>
              
              {elements.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Layers className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>لا توجد عناصر في الصفحة</p>
                </div>
              ) : (
                elements.map((element, index) => (
                  <div
                    key={element.id}
                    className={`flex items-center gap-2 p-2 rounded cursor-pointer ${
                      selectedElement?.id === element.id ? 'bg-primary/10 border border-primary/20' : 'hover:bg-muted'
                    }`}
                    onClick={() => setSelectedElement(element)}
                  >
                    <Type className="h-4 w-4 text-muted-foreground" />
                    <span className="flex-1 text-sm truncate">
                      {element.type} - {element.content.slice(0, 20)}...
                    </span>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          moveElement(element.id, 'up');
                        }}
                        disabled={index === 0}
                      >
                        <ArrowUp className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          moveElement(element.id, 'down');
                        }}
                        disabled={index === elements.length - 1}
                      >
                        <ArrowDown className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};