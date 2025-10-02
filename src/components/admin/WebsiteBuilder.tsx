import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Save, Code, Palette, Eye, Trash2, Plus, MousePointer, Square, Circle, Type, Image as ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Canvas as FabricCanvas, Rect, Circle as FabricCircle, Textbox } from "fabric";

interface WebsiteDesign {
  id: string;
  page_slug: string;
  layout_json: string;
  custom_css: string;
  custom_js: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface DragItem {
  id: string;
  type: 'text' | 'image' | 'button' | 'card' | 'section';
  content: string;
  styles: Record<string, string>;
}

export const WebsiteBuilder = () => {
  const [designs, setDesigns] = useState<WebsiteDesign[]>([]);
  const [selectedDesign, setSelectedDesign] = useState<WebsiteDesign | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pageSlug, setPageSlug] = useState("");
  const [customCSS, setCustomCSS] = useState("");
  const [customJS, setCustomJS] = useState("");
  const [dragItems, setDragItems] = useState<DragItem[]>([]);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [activeTool, setActiveTool] = useState<"select" | "text" | "rectangle" | "circle" | "image">("select");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Available drag items
  const availableItems: Omit<DragItem, 'id'>[] = [
    {
      type: 'text',
      content: 'نص جديد',
      styles: { fontSize: '16px', color: '#000000' }
    },
    {
      type: 'image',
      content: 'https://via.placeholder.com/300x200',
      styles: { width: '300px', height: '200px' }
    },
    {
      type: 'button',
      content: 'اضغط هنا',
      styles: { backgroundColor: '#007bff', color: '#ffffff', padding: '10px 20px', borderRadius: '5px' }
    },
    {
      type: 'card',
      content: 'محتوى الكارد',
      styles: { padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }
    },
    {
      type: 'section',
      content: 'قسم جديد',
      styles: { padding: '40px 20px', backgroundColor: '#f8f9fa' }
    }
  ];

  useEffect(() => {
    loadDesigns();
  }, []);

  useEffect(() => {
    if (canvasRef.current && !fabricCanvas) {
      const canvas = new FabricCanvas(canvasRef.current, {
        width: 800,
        height: 600,
        backgroundColor: "#ffffff",
      });

      setFabricCanvas(canvas);

      return () => {
        canvas.dispose();
      };
    }
  }, [canvasRef.current]);

  useEffect(() => {
    if (!fabricCanvas) return;

    fabricCanvas.isDrawingMode = false;
    fabricCanvas.selection = activeTool === "select";
  }, [activeTool, fabricCanvas]);

  const loadDesigns = async () => {
    try {
      const { data, error } = await supabase
        .from('website_design')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDesigns(data || []);
    } catch (error) {
      console.error('Error loading designs:', error);
      toast.error('خطأ في تحميل التصاميم');
    } finally {
      setIsLoading(false);
    }
  };

  const saveDesign = async () => {
    if (!pageSlug.trim()) {
      toast.error('يرجى إدخال slug الصفحة');
      return;
    }

    try {
      const layoutData = {
        items: dragItems,
        css: customCSS,
        js: customJS
      };

      const designData = {
        page_slug: pageSlug,
        layout_json: JSON.stringify(layoutData),
        custom_css: customCSS,
        custom_js: customJS,
        is_active: false
      };

      let query;
      if (selectedDesign) {
        query = supabase
          .from('website_design')
          .update(designData)
          .eq('id', selectedDesign.id);
      } else {
        query = supabase
          .from('website_design')
          .insert([designData]);
      }

      const { error } = await query;
      if (error) throw error;

      toast.success('تم حفظ التصميم بنجاح');
      loadDesigns();
      
      if (!selectedDesign) {
        setPageSlug("");
        setCustomCSS("");
        setCustomJS("");
        setDragItems([]);
      }
    } catch (error) {
      console.error('Error saving design:', error);
      toast.error('خطأ في حفظ التصميم');
    }
  };

  const toggleDesignStatus = async (design: WebsiteDesign) => {
    try {
      const { error } = await supabase
        .from('website_design')
        .update({ is_active: !design.is_active })
        .eq('id', design.id);

      if (error) throw error;
      
      toast.success(`تم ${design.is_active ? 'إلغاء تفعيل' : 'تفعيل'} التصميم`);
      loadDesigns();
    } catch (error) {
      console.error('Error toggling design status:', error);
      toast.error('خطأ في تغيير حالة التصميم');
    }
  };

  const deleteDesign = async (design: WebsiteDesign) => {
    if (!confirm('هل أنت متأكد من حذف هذا التصميم؟')) return;

    try {
      const { error } = await supabase
        .from('website_design')
        .delete()
        .eq('id', design.id);

      if (error) throw error;
      
      toast.success('تم حذف التصميم بنجاح');
      loadDesigns();
      
      if (selectedDesign?.id === design.id) {
        setSelectedDesign(null);
        setPageSlug("");
        setCustomCSS("");
        setCustomJS("");
        setDragItems([]);
      }
    } catch (error) {
      console.error('Error deleting design:', error);
      toast.error('خطأ في حذف التصميم');
    }
  };

  const loadDesign = (design: WebsiteDesign) => {
    setSelectedDesign(design);
    setPageSlug(design.page_slug);
    setCustomCSS(design.custom_css || "");
    setCustomJS(design.custom_js || "");
    
    try {
      const layoutData = JSON.parse(design.layout_json);
      setDragItems(layoutData.items || []);
    } catch (error) {
      console.error('Error parsing layout JSON:', error);
      setDragItems([]);
    }
  };

  const addDragItem = (item: Omit<DragItem, 'id'>) => {
    const newItem: DragItem = {
      ...item,
      id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    setDragItems(prev => [...prev, newItem]);
  };

  const handleToolClick = (tool: typeof activeTool) => {
    setActiveTool(tool);

    if (!fabricCanvas) return;

    if (tool === "rectangle") {
      const rect = new Rect({
        left: 100,
        top: 100,
        fill: "#007bff",
        width: 100,
        height: 100,
        stroke: "#333",
        strokeWidth: 2,
      });
      fabricCanvas.add(rect);
    } else if (tool === "circle") {
      const circle = new FabricCircle({
        left: 100,
        top: 100,
        fill: "#28a745",
        radius: 50,
        stroke: "#333",
        strokeWidth: 2,
      });
      fabricCanvas.add(circle);
    } else if (tool === "text") {
      const text = new Textbox("نص جديد", {
        left: 100,
        top: 100,
        fontFamily: "Arial",
        fontSize: 20,
        fill: "#333",
      });
      fabricCanvas.add(text);
    }
  };

  const handleClearCanvas = () => {
    if (!fabricCanvas) return;
    fabricCanvas.clear();
    fabricCanvas.backgroundColor = "#ffffff";
    fabricCanvas.renderAll();
    toast.success("تم مسح اللوحة!");
  };

  const saveCanvasToItems = () => {
    if (!fabricCanvas) return;

    const objects = fabricCanvas.getObjects();
    const newItems: DragItem[] = objects.map((obj, index) => {
      let type: DragItem['type'] = 'text';
      let content = '';

      if (obj.type === 'rect') {
        type = 'card';
        content = 'مربع جديد';
      } else if (obj.type === 'circle') {
        type = 'section';
        content = 'قسم دائري';
      } else if (obj.type === 'textbox') {
        type = 'text';
        content = (obj as any).text || 'نص جديد';
      } else if (obj.type === 'image') {
        type = 'image';
        content = (obj as any).src || '';
      }

      return {
        id: `canvas_item_${index}_${Date.now()}`,
        type,
        content,
        styles: {
          position: 'absolute',
          left: `${obj.left || 0}px`,
          top: `${obj.top || 0}px`,
          width: `${obj.width || 100}px`,
          height: `${obj.height || 100}px`,
          backgroundColor: obj.fill as string || 'transparent',
          border: obj.stroke ? `${obj.strokeWidth || 1}px solid ${obj.stroke}` : 'none',
          color: obj.type === 'textbox' ? obj.fill as string : '#000000',
          fontSize: obj.type === 'textbox' ? `${(obj as any).fontSize || 16}px` : undefined,
          fontFamily: obj.type === 'textbox' ? (obj as any).fontFamily || 'Arial' : undefined,
          borderRadius: obj.type === 'circle' ? '50%' : undefined,
          zIndex: '1'
        }
      };
    });

    setDragItems(prev => [...prev, ...newItems]);
    toast.success("تم إضافة عناصر التصميم المرئي!");
  };

  const updateDragItem = (id: string, updates: Partial<DragItem>) => {
    setDragItems(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const removeDragItem = (id: string) => {
    setDragItems(prev => prev.filter(item => item.id !== id));
  };

  if (isLoading) {
    return <div className="p-6">جاري التحميل...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">منشئ المواقع</h2>
          <p className="text-muted-foreground">تحكم في تصميم الموقع بالكامل</p>
        </div>
        <Button onClick={() => {
          setSelectedDesign(null);
          setPageSlug("");
          setCustomCSS("");
          setCustomJS("");
          setDragItems([]);
        }} className="gap-2">
          <Plus className="h-4 w-4" />
          تصميم جديد
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Existing Designs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              التصاميم الموجودة
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {designs.map((design) => (
              <div key={design.id} className="p-3 border rounded-lg space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{design.page_slug}</h4>
                    <p className="text-sm text-muted-foreground">
                      {new Date(design.updated_at).toLocaleDateString('ar')}
                    </p>
                  </div>
                  <Badge variant={design.is_active ? "default" : "secondary"}>
                    {design.is_active ? "نشط" : "غير نشط"}
                  </Badge>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => loadDesign(design)}
                  >
                    تحرير
                  </Button>
                  <Button 
                    size="sm" 
                    variant={design.is_active ? "destructive" : "default"}
                    onClick={() => toggleDesignStatus(design)}
                  >
                    {design.is_active ? "إلغاء التفعيل" : "تفعيل"}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => deleteDesign(design)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            
            {designs.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                لا توجد تصاميم حتى الآن
              </p>
            )}
          </CardContent>
        </Card>

        {/* Design Builder */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              {selectedDesign ? `تحرير: ${selectedDesign.page_slug}` : 'تصميم جديد'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="builder" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="builder">البناء</TabsTrigger>
                <TabsTrigger value="css">CSS</TabsTrigger>
                <TabsTrigger value="js">JavaScript</TabsTrigger>
              </TabsList>
              
              <TabsContent value="builder" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="pageSlug">slug الصفحة</Label>
                    <Input
                      id="pageSlug"
                      value={pageSlug}
                      onChange={(e) => setPageSlug(e.target.value)}
                      placeholder="home, about, services, portfolio, blog..."
                      dir="ltr"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      اكتب home للصفحة الرئيسية، services للخدمات، portfolio للأعمال، إلخ...
                    </p>
                  </div>
                </div>

                {/* Visual Design Tools */}
                <div>
                  <h4 className="font-medium mb-2">أدوات التصميم المرئي</h4>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <Button
                      variant={activeTool === "select" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleToolClick("select")}
                    >
                      <MousePointer className="h-4 w-4 mr-1" />
                      اختيار
                    </Button>
                    <Button
                      variant={activeTool === "text" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleToolClick("text")}
                    >
                      <Type className="h-4 w-4 mr-1" />
                      نص
                    </Button>
                    <Button
                      variant={activeTool === "rectangle" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleToolClick("rectangle")}
                    >
                      <Square className="h-4 w-4 mr-1" />
                      مربع
                    </Button>
                    <Button
                      variant={activeTool === "circle" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleToolClick("circle")}
                    >
                      <Circle className="h-4 w-4 mr-1" />
                      دائرة
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleClearCanvas}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      مسح
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={saveCanvasToItems}
                    >
                      <Save className="h-4 w-4 mr-1" />
                      حفظ التصميم
                    </Button>
                  </div>
                  
                  {/* Canvas */}
                  <div className="border border-gray-200 rounded-lg shadow-lg overflow-hidden mb-4">
                    <canvas ref={canvasRef} className="max-w-full" />
                  </div>
                </div>

                {/* Available Items */}
                <div>
                  <h4 className="font-medium mb-2">العناصر المتاحة</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {availableItems.map((item, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => addDragItem(item)}
                        className="justify-start"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        {item.type === 'text' && 'نص'}
                        {item.type === 'image' && 'صورة'}
                        {item.type === 'button' && 'زر'}
                        {item.type === 'card' && 'كارد'}
                        {item.type === 'section' && 'قسم'}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Drag Items */}
                <div>
                  <h4 className="font-medium mb-2">عناصر التصميم</h4>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {dragItems.map((item) => (
                      <div key={item.id} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-medium">
                            {item.type === 'text' && 'نص'}
                            {item.type === 'image' && 'صورة'}
                            {item.type === 'button' && 'زر'}
                            {item.type === 'card' && 'كارد'}
                            {item.type === 'section' && 'قسم'}
                          </span>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => removeDragItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <Input
                          value={item.content}
                          onChange={(e) => updateDragItem(item.id, { content: e.target.value })}
                          placeholder="المحتوى"
                          className="mb-2"
                        />
                        
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <Input
                            value={item.styles.backgroundColor || ''}
                            onChange={(e) => updateDragItem(item.id, { 
                              styles: { ...item.styles, backgroundColor: e.target.value }
                            })}
                            placeholder="لون الخلفية"
                          />
                          <Input
                            value={item.styles.color || ''}
                            onChange={(e) => updateDragItem(item.id, { 
                              styles: { ...item.styles, color: e.target.value }
                            })}
                            placeholder="لون النص"
                          />
                          <Input
                            value={item.styles.fontSize || ''}
                            onChange={(e) => updateDragItem(item.id, { 
                              styles: { ...item.styles, fontSize: e.target.value }
                            })}
                            placeholder="حجم الخط"
                          />
                          <Input
                            value={item.styles.padding || ''}
                            onChange={(e) => updateDragItem(item.id, { 
                              styles: { ...item.styles, padding: e.target.value }
                            })}
                            placeholder="المسافة الداخلية"
                          />
                        </div>
                      </div>
                    ))}
                    
                    {dragItems.length === 0 && (
                      <p className="text-center text-muted-foreground py-4">
                        أضف عناصر لبناء تصميمك
                      </p>
                    )}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="css" className="space-y-4">
                <div>
                  <Label htmlFor="customCSS">CSS مخصص</Label>
                  <Textarea
                    id="customCSS"
                    value={customCSS}
                    onChange={(e) => setCustomCSS(e.target.value)}
                    placeholder="/* أضف CSS المخصص هنا */"
                    className="min-h-[300px] font-mono"
                    dir="ltr"
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="js" className="space-y-4">
                <div>
                  <Label htmlFor="customJS">JavaScript مخصص</Label>
                  <Textarea
                    id="customJS"
                    value={customJS}
                    onChange={(e) => setCustomJS(e.target.value)}
                    placeholder="// أضف JavaScript المخصص هنا"
                    className="min-h-[300px] font-mono"
                    dir="ltr"
                  />
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end pt-4">
              <Button onClick={saveDesign} className="gap-2">
                <Save className="h-4 w-4" />
                حفظ التصميم
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
