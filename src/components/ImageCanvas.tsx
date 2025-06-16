
import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { LogoSettings } from '@/pages/Index';

interface ImageCanvasProps {
  mainImage: string;
  logoImage: string;
  logoSettings: LogoSettings;
}

export const ImageCanvas = forwardRef<HTMLCanvasElement, ImageCanvasProps>(
  ({ mainImage, logoImage, logoSettings }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mainImgRef = useRef<HTMLImageElement>();
    const logoImgRef = useRef<HTMLImageElement>();

    useImperativeHandle(ref, () => canvasRef.current!);

    const getLogoPosition = (canvasWidth: number, canvasHeight: number, logoWidth: number, logoHeight: number) => {
      const padding = 20;
      
      switch (logoSettings.position) {
        case 'top-left':
          return { x: padding, y: padding };
        case 'top-center':
          return { x: (canvasWidth - logoWidth) / 2, y: padding };
        case 'top-right':
          return { x: canvasWidth - logoWidth - padding, y: padding };
        case 'middle-left':
          return { x: padding, y: (canvasHeight - logoHeight) / 2 };
        case 'middle-center':
          return { x: (canvasWidth - logoWidth) / 2, y: (canvasHeight - logoHeight) / 2 };
        case 'middle-right':
          return { x: canvasWidth - logoWidth - padding, y: (canvasHeight - logoHeight) / 2 };
        case 'bottom-left':
          return { x: padding, y: canvasHeight - logoHeight - padding };
        case 'bottom-center':
          return { x: (canvasWidth - logoWidth) / 2, y: canvasHeight - logoHeight - padding };
        case 'bottom-right':
          return { x: canvasWidth - logoWidth - padding, y: canvasHeight - logoHeight - padding };
        default:
          return { x: canvasWidth - logoWidth - padding, y: canvasHeight - logoHeight - padding };
      }
    };

    const drawImages = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      
      if (!canvas || !ctx || !mainImgRef.current || !logoImgRef.current) return;

      const mainImg = mainImgRef.current;
      const logoImg = logoImgRef.current;

      // Set canvas size to match main image
      canvas.width = mainImg.naturalWidth;
      canvas.height = mainImg.naturalHeight;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw main image
      ctx.drawImage(mainImg, 0, 0);

      // Calculate logo size
      const logoScale = logoSettings.size / 100;
      const maxLogoSize = Math.min(canvas.width, canvas.height) * 0.3; // Max 30% of canvas
      const logoWidth = Math.min(logoImg.naturalWidth * logoScale, maxLogoSize);
      const logoHeight = (logoImg.naturalHeight / logoImg.naturalWidth) * logoWidth;

      // Set opacity
      ctx.globalAlpha = logoSettings.opacity / 100;

      // Get logo position
      const position = getLogoPosition(canvas.width, canvas.height, logoWidth, logoHeight);

      // Draw logo
      ctx.drawImage(logoImg, position.x, position.y, logoWidth, logoHeight);

      // Reset opacity
      ctx.globalAlpha = 1;
    };

    useEffect(() => {
      if (!mainImage || !logoImage) return;

      // Load main image
      const mainImg = new Image();
      mainImg.crossOrigin = 'anonymous';
      mainImg.onload = () => {
        mainImgRef.current = mainImg;
        drawImages();
      };
      mainImg.src = mainImage;

      // Load logo image
      const logoImg = new Image();
      logoImg.crossOrigin = 'anonymous';
      logoImg.onload = () => {
        logoImgRef.current = logoImg;
        drawImages();
      };
      logoImg.src = logoImage;
    }, [mainImage, logoImage]);

    useEffect(() => {
      drawImages();
    }, [logoSettings]);

    return (
      <div className="max-w-full max-h-full overflow-auto">
        <canvas
          ref={canvasRef}
          className="max-w-full max-h-full object-contain border rounded-lg shadow-sm"
          style={{ maxHeight: '600px' }}
        />
      </div>
    );
  }
);

ImageCanvas.displayName = 'ImageCanvas';
