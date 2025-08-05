import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Download, 
  Highlighter, 
  Edit3, 
  Square, 
  Circle as CircleIcon, 
  Type,
  MousePointer,
  Save,
  Undo,
  Redo,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

type AnnotationTool = 'select' | 'highlight' | 'draw' | 'rectangle' | 'circle' | 'text';

interface AdvancedPdfViewerProps {
  pdfUrl: string;
  paperId: string;
  onSaveAnnotations?: (annotations: any) => Promise<void>;
}

export const AdvancedPdfViewer: React.FC<AdvancedPdfViewerProps> = ({
  pdfUrl,
  paperId,
  onSaveAnnotations
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState(1.0);
  const [rotation, setRotation] = useState(0);
  const [activeTool, setActiveTool] = useState<AnnotationTool>('select');
  const [activeColor, setActiveColor] = useState('#ffff00');
  const [annotations, setAnnotations] = useState<any[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState<{x: number, y: number} | null>(null);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    toast.success('PDF loaded successfully');
  };

  const onDocumentLoadError = (error: Error) => {
    console.error('Error loading PDF:', error);
    toast.error('Failed to load PDF');
  };


  // Initialize Canvas for annotations
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    
    // Add event listeners for drawing
    const handleMouseDown = (e: MouseEvent) => {
      if (activeTool === 'draw') {
        setIsDrawing(true);
        const rect = canvas.getBoundingClientRect();
        setLastPoint({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDrawing || activeTool !== 'draw' || !lastPoint) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const rect = canvas.getBoundingClientRect();
      const currentPoint = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };

      ctx.strokeStyle = activeColor;
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(lastPoint.x, lastPoint.y);
      ctx.lineTo(currentPoint.x, currentPoint.y);
      ctx.stroke();

      setLastPoint(currentPoint);
    };

    const handleMouseUp = () => {
      setIsDrawing(false);
      setLastPoint(null);
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseUp);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseleave', handleMouseUp);
    };
  }, [activeTool, activeColor, isDrawing, lastPoint]);

  // Handle cursor changes based on tool
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    canvas.style.cursor = activeTool === 'select' ? 'default' : 'crosshair';
  }, [activeTool]);

  const handleToolClick = (tool: AnnotationTool) => {
    setActiveTool(tool);

    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    if (tool === 'rectangle') {
      ctx.strokeStyle = activeColor;
      ctx.lineWidth = 2;
      ctx.strokeRect(100, 100, 100, 80);
    } else if (tool === 'circle') {
      ctx.strokeStyle = activeColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(150, 140, 40, 0, 2 * Math.PI);
      ctx.stroke();
    } else if (tool === 'text') {
      ctx.fillStyle = activeColor;
      ctx.font = '16px Arial';
      ctx.fillText('Add your text here', 100, 120);
    } else if (tool === 'highlight') {
      setActiveColor('#ffff0080'); // Semi-transparent yellow
    }
  };

  const handleZoom = (direction: 'in' | 'out') => {
    const newScale = direction === 'in' 
      ? Math.min(scale * 1.2, 3.0)
      : Math.max(scale / 1.2, 0.5);
    setScale(newScale);
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handlePageChange = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    } else if (direction === 'next' && pageNumber < numPages) {
      setPageNumber(pageNumber + 1);
    }
  };

  const handleSaveAnnotations = async () => {
    if (!canvasRef.current) return;

    try {
      const canvas = canvasRef.current;
      const dataURL = canvas.toDataURL();
      const annotationData = {
        paperId,
        page: pageNumber,
        annotations: dataURL,
        timestamp: new Date().toISOString()
      };

      setAnnotations(prev => [...prev, annotationData]);
      
      if (onSaveAnnotations) {
        await onSaveAnnotations(annotationData);
      }
      
      toast.success('Annotations saved successfully');
    } catch (error) {
      console.error('Error saving annotations:', error);
      toast.error('Failed to save annotations');
    }
  };

  const handleDownloadPDF = () => {
    if (!canvasRef.current) return;

    // Create a temporary canvas to combine PDF and annotations
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    
    if (!tempCtx) return;

    // For now, just download the annotations
    canvasRef.current.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `annotated-paper-page-${pageNumber}.png`;
        a.click();
        URL.revokeObjectURL(url);
      }
    });
  };

  const handleClearAnnotations = () => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        toast.success('Annotations cleared');
      }
    }
  };

  const handleUndo = () => {
    // This would require implementing a history system for Fabric.js
    toast.info('Undo functionality coming soon');
  };

  const handleRedo = () => {
    // This would require implementing a history system for Fabric.js
    toast.info('Redo functionality coming soon');
  };

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <Card className="mb-4">
        <CardContent className="p-3">
          <div className="flex items-center justify-between gap-4">
            {/* Tool Selection */}
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">Tools</Badge>
              <Button
                size="sm"
                variant={activeTool === 'select' ? 'default' : 'outline'}
                onClick={() => handleToolClick('select')}
              >
                <MousePointer className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant={activeTool === 'highlight' ? 'default' : 'outline'}
                onClick={() => handleToolClick('highlight')}
              >
                <Highlighter className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant={activeTool === 'draw' ? 'default' : 'outline'}
                onClick={() => handleToolClick('draw')}
              >
                <Edit3 className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant={activeTool === 'rectangle' ? 'default' : 'outline'}
                onClick={() => handleToolClick('rectangle')}
              >
                <Square className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant={activeTool === 'circle' ? 'default' : 'outline'}
                onClick={() => handleToolClick('circle')}
              >
                <CircleIcon className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant={activeTool === 'text' ? 'default' : 'outline'}
                onClick={() => handleToolClick('text')}
              >
                <Type className="h-4 w-4" />
              </Button>
            </div>

            <Separator orientation="vertical" className="h-6" />

            {/* Color Picker */}
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">Color</Badge>
              <input
                type="color"
                value={activeColor}
                onChange={(e) => setActiveColor(e.target.value)}
                className="w-8 h-8 rounded border"
              />
            </div>

            <Separator orientation="vertical" className="h-6" />

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={handleUndo}>
                <Undo className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={handleRedo}>
                <Redo className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={handleClearAnnotations}>
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button size="sm" onClick={handleSaveAnnotations}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button size="sm" variant="outline" onClick={handleDownloadPDF}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Bar */}
      <Card className="mb-4">
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handlePageChange('prev')}
                  disabled={pageNumber <= 1}
                >
                  Previous
                </Button>
                <span className="text-sm">
                  Page {pageNumber} of {numPages}
                </span>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handlePageChange('next')}
                  disabled={pageNumber >= numPages}
                >
                  Next
                </Button>
              </div>

              <Separator orientation="vertical" className="h-6" />

              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => handleZoom('out')}>
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-sm min-w-[60px] text-center">
                  {Math.round(scale * 100)}%
                </span>
                <Button size="sm" variant="outline" onClick={() => handleZoom('in')}>
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={handleRotate}>
                  <RotateCw className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Badge variant="secondary">
              {annotations.length} annotation{annotations.length !== 1 ? 's' : ''}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* PDF Viewer Container */}
      <div className="flex-1 relative overflow-auto bg-muted/20 rounded-lg">
        <div 
          ref={containerRef}
          className="relative mx-auto"
          style={{ 
            width: 'fit-content',
            transform: `rotate(${rotation}deg)`,
          }}
        >
          {/* React PDF Document */}
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p>Loading PDF...</p>
                </div>
              </div>
            }
          >
            <div className="relative">
              <Page
                pageNumber={pageNumber}
                scale={scale}
                rotate={rotation}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
              
              {/* Annotation Canvas (overlay) */}
              <canvas
                ref={canvasRef}
                className="absolute inset-0 z-10"
                style={{ 
                  pointerEvents: activeTool === 'select' ? 'none' : 'auto',
                  width: '100%',
                  height: '100%'
                }}
              />
            </div>
          </Document>
        </div>
      </div>
    </div>
  );
};