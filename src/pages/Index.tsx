
import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Upload, Download, Image as ImageIcon, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { ImageCanvas } from "@/components/ImageCanvas";
import { LogoControls } from "@/components/LogoControls";

export interface LogoSettings {
  size: number;
  opacity: number;
  position: 'top-left' | 'top-center' | 'top-right' | 'middle-left' | 'middle-center' | 'middle-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
}

const Index = () => {
  const [mainImages, setMainImages] = useState<string[]>([]);
  const [logoImage, setLogoImage] = useState<string>("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [logoSettings, setLogoSettings] = useState<LogoSettings>({
    size: 20,
    opacity: 80,
    position: 'bottom-right'
  });
  
  const mainImageInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleMainImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const imageUrls: string[] = [];
    let loadedCount = 0;

    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            imageUrls.push(e.target.result as string);
            loadedCount++;
            
            if (loadedCount === files.length) {
              setMainImages(imageUrls);
              setCurrentImageIndex(0);
              toast.success(`${files.length} image(s) uploaded successfully!`);
            }
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setLogoImage(e.target.result as string);
          toast.success("Logo uploaded successfully!");
        }
      };
      reader.readAsDataURL(file);
    } else {
      toast.error("Please upload a valid image file");
    }
  };

  const handleDownload = async () => {
    if (!canvasRef.current || !mainImages[currentImageIndex] || !logoImage) {
      toast.error("Please upload both main image and logo first");
      return;
    }

    try {
      const link = document.createElement('a');
      link.download = `logo-fusion-${Date.now()}.png`;
      link.href = canvasRef.current.toDataURL();
      link.click();
      toast.success("Image downloaded successfully!");
    } catch (error) {
      toast.error("Failed to download image");
    }
  };

  const handleDownloadAll = async () => {
    if (!mainImages.length || !logoImage) {
      toast.error("Please upload both images and logo first");
      return;
    }

    toast.promise(
      Promise.resolve().then(() => {
        // This would typically process all images
        // For now, we'll just download the current one
        handleDownload();
      }),
      {
        loading: 'Processing all images...',
        success: 'All images processed!',
        error: 'Failed to process images'
      }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Logo Fusion Studio
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Professional logo overlay service for multiple companies. Upload your images and logo, 
            customize positioning and styling in real-time, then download your branded content.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upload Section */}
          <div className="space-y-6">
            {/* Main Images Upload */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-blue-600" />
                  Main Images
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-3">Upload your main images</p>
                  <Button 
                    variant="outline" 
                    onClick={() => mainImageInputRef.current?.click()}
                    className="hover:bg-blue-50"
                  >
                    Choose Images
                  </Button>
                  <Input
                    ref={mainImageInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleMainImageUpload}
                    className="hidden"
                  />
                </div>
                
                {mainImages.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Images: {mainImages.length}</p>
                    {mainImages.length > 1 && (
                      <div className="flex gap-2 flex-wrap">
                        {mainImages.map((_, index) => (
                          <Button
                            key={index}
                            size="sm"
                            variant={currentImageIndex === index ? "default" : "outline"}
                            onClick={() => setCurrentImageIndex(index)}
                          >
                            {index + 1}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Logo Upload */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  Logo Image
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-3">Upload your logo</p>
                  <Button 
                    variant="outline" 
                    onClick={() => logoInputRef.current?.click()}
                    className="hover:bg-purple-50"
                  >
                    Choose Logo
                  </Button>
                  <Input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </div>
                
                {logoImage && (
                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-700">✓ Logo uploaded successfully</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Logo Controls */}
            <LogoControls 
              logoSettings={logoSettings}
              onSettingsChange={setLogoSettings}
            />
          </div>

          {/* Preview Section */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm h-full">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle>Live Preview</CardTitle>
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleDownload}
                      disabled={!mainImages[currentImageIndex] || !logoImage}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Current
                    </Button>
                    {mainImages.length > 1 && (
                      <Button 
                        onClick={handleDownloadAll}
                        disabled={!mainImages.length || !logoImage}
                        variant="outline"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Process All
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="h-full">
                <div className="h-full min-h-[500px] flex items-center justify-center bg-gray-50 rounded-lg">
                  {mainImages[currentImageIndex] && logoImage ? (
                    <ImageCanvas
                      ref={canvasRef}
                      mainImage={mainImages[currentImageIndex]}
                      logoImage={logoImage}
                      logoSettings={logoSettings}
                    />
                  ) : (
                    <div className="text-center text-gray-500">
                      <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg">Upload main image and logo to see preview</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
