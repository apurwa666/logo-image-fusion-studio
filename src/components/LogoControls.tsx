
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { LogoSettings } from '@/pages/Index';
import { Settings, Move, Resize, Eye } from "lucide-react";

interface LogoControlsProps {
  logoSettings: LogoSettings;
  onSettingsChange: (settings: LogoSettings) => void;
}

export const LogoControls = ({ logoSettings, onSettingsChange }: LogoControlsProps) => {
  const handleSizeChange = (value: number[]) => {
    onSettingsChange({ ...logoSettings, size: value[0] });
  };

  const handleOpacityChange = (value: number[]) => {
    onSettingsChange({ ...logoSettings, opacity: value[0] });
  };

  const handlePositionChange = (position: LogoSettings['position']) => {
    onSettingsChange({ ...logoSettings, position });
  };

  const positionOptions = [
    { value: 'top-left', label: 'Top Left' },
    { value: 'top-center', label: 'Top Center' },
    { value: 'top-right', label: 'Top Right' },
    { value: 'middle-left', label: 'Middle Left' },
    { value: 'middle-center', label: 'Middle Center' },
    { value: 'middle-right', label: 'Middle Right' },
    { value: 'bottom-left', label: 'Bottom Left' },
    { value: 'bottom-center', label: 'Bottom Center' },
    { value: 'bottom-right', label: 'Bottom Right' },
  ] as const;

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-green-600" />
          Logo Controls
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Size Control */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Resize className="w-4 h-4 text-blue-600" />
            <Label className="font-medium">Size: {logoSettings.size}%</Label>
          </div>
          <Slider
            value={[logoSettings.size]}
            onValueChange={handleSizeChange}
            max={100}
            min={5}
            step={1}
            className="w-full"
          />
        </div>

        {/* Opacity Control */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-purple-600" />
            <Label className="font-medium">Opacity: {logoSettings.opacity}%</Label>
          </div>
          <Slider
            value={[logoSettings.opacity]}
            onValueChange={handleOpacityChange}
            max={100}
            min={10}
            step={1}
            className="w-full"
          />
        </div>

        {/* Position Control */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Move className="w-4 h-4 text-green-600" />
            <Label className="font-medium">Position</Label>
          </div>
          <RadioGroup
            value={logoSettings.position}
            onValueChange={handlePositionChange}
            className="grid grid-cols-3 gap-2"
          >
            {positionOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-2 text-xs">
                <RadioGroupItem value={option.value} id={option.value} />
                <Label 
                  htmlFor={option.value} 
                  className="text-xs cursor-pointer leading-tight"
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
};
