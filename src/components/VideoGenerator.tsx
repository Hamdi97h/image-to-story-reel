import React, { useState } from 'react';
import { Upload, FileVideo, Wand2, Download, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const VideoGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const [scenario, setScenario] = useState<string | null>(null);
  const [duration, setDuration] = useState<number>(10);
  const { toast } = useToast();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateVideoFromScenario = async (scenarioText: string, imageFile: File) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    canvas.width = 1280;
    canvas.height = 720;

    // Load the image
    const img = new Image();
    const imageUrl = URL.createObjectURL(imageFile);
    
    return new Promise<string>((resolve, reject) => {
      img.onload = async () => {
        const stream = canvas.captureStream(30);
        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: 'video/webm;codecs=vp9'
        });
        
        const chunks: Blob[] = [];
        mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'video/webm' });
          const videoUrl = URL.createObjectURL(blob);
          resolve(videoUrl);
        };

        mediaRecorder.start();

        // Calculate timing
        const totalDuration = duration * 1000; // Convert to milliseconds
        const scenes = scenarioText.split(/Scène \d+:/).filter(scene => scene.trim().length > 0);
        const sceneDuration = totalDuration / scenes.length;
        const frameInterval = 1000 / 30; // 30 FPS
        const framesPerScene = Math.floor(sceneDuration / frameInterval);

        for (let sceneIndex = 0; sceneIndex < scenes.length; sceneIndex++) {
          const scene = scenes[sceneIndex].trim();
          
          for (let frame = 0; frame < framesPerScene; frame++) {
            const progress = frame / framesPerScene;
            
            // Clear canvas
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Calculate image transformations for animations
            const aspectRatio = img.width / img.height;
            let baseWidth = canvas.width;
            let baseHeight = canvas.width / aspectRatio;
            
            if (baseHeight > canvas.height) {
              baseHeight = canvas.height;
              baseWidth = canvas.height * aspectRatio;
            }
            
            // Add zoom effect
            const zoomFactor = 1 + (Math.sin(progress * Math.PI * 2) * 0.1);
            const drawWidth = baseWidth * zoomFactor;
            const drawHeight = baseHeight * zoomFactor;
            
            // Add slow pan effect
            const panX = Math.sin(progress * Math.PI) * 20;
            const panY = Math.cos(progress * Math.PI) * 10;
            
            const x = (canvas.width - drawWidth) / 2 + panX;
            const y = (canvas.height - drawHeight) / 2 + panY;
            
            // Draw image with smooth scaling
            ctx.save();
            ctx.filter = `brightness(${0.8 + Math.sin(progress * Math.PI) * 0.2})`;
            ctx.drawImage(img, x, y, drawWidth, drawHeight);
            ctx.restore();
            
            // Add animated overlay
            const overlayOpacity = 0.4 + Math.sin(progress * Math.PI * 4) * 0.1;
            ctx.fillStyle = `rgba(0, 0, 0, ${overlayOpacity})`;
            ctx.fillRect(0, canvas.height - 200, canvas.width, 200);
            
            // Add animated text
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 28px Arial';
            ctx.textAlign = 'center';
            ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
            ctx.shadowBlur = 10;
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;
            
            // Text animation effects
            const textAlpha = Math.min(1, progress * 3); // Fade in effect
            const textScale = 0.8 + (textAlpha * 0.2); // Scale effect
            const textY = canvas.height - 150 + (1 - textAlpha) * 30; // Slide up effect
            
            ctx.save();
            ctx.globalAlpha = textAlpha;
            ctx.scale(textScale, textScale);
            
            // Word wrap for long text
            const words = scene.split(' ');
            const lines: string[] = [];
            let currentLine = '';
            
            words.forEach(word => {
              const testLine = currentLine + (currentLine ? ' ' : '') + word;
              const metrics = ctx.measureText(testLine);
              if (metrics.width > (canvas.width - 100) / textScale && currentLine) {
                lines.push(currentLine);
                currentLine = word;
              } else {
                currentLine = testLine;
              }
            });
            if (currentLine) lines.push(currentLine);
            
            // Draw text lines with animation
            lines.forEach((line, index) => {
              const lineY = (textY + (index * 35)) / textScale;
              const lineDelay = index * 0.2;
              const lineAlpha = Math.max(0, Math.min(1, (progress - lineDelay) * 4));
              
              ctx.globalAlpha = textAlpha * lineAlpha;
              ctx.fillText(line, canvas.width / 2 / textScale, lineY);
            });
            
            ctx.restore();
            
            // Add scene transition effect
            if (sceneIndex > 0 && frame < 15) {
              const transitionAlpha = 1 - (frame / 15);
              ctx.fillStyle = `rgba(0, 0, 0, ${transitionAlpha})`;
              ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
            
            // Wait for next frame
            await new Promise(resolve => setTimeout(resolve, frameInterval));
          }
        }

        mediaRecorder.stop();
        URL.revokeObjectURL(imageUrl);
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = imageUrl;
    });
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || !image) {
      toast({
        title: "Champs manquants",
        description: "Veuillez entrer un texte et uploader une image.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      // Call the Edge Function to generate scenario
      const { data, error } = await supabase.functions.invoke('generate-video', {
        body: {
          prompt: prompt
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      setScenario(data.scenario);
      
      // Generate video from scenario
      const videoUrl = await generateVideoFromScenario(data.scenario, image);
      setGeneratedVideo(videoUrl);
      
      toast({
        title: "Vidéo générée !",
        description: "Votre vidéo a été créée avec succès.",
      });

    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la génération.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-secondary p-6">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8 animate-slide-up">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
            Générateur de Vidéos IA
          </h1>
          <p className="text-muted-foreground text-lg">
            Transformez vos idées en vidéos avec DeepSeek AI et FFmpeg
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Formulaire d'entrée */}
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wand2 className="w-5 h-5" />
                Créer votre vidéo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="prompt">Prompt texte</Label>
                <Textarea
                  id="prompt"
                  placeholder="Ex: Un robot marche dans une forêt mystérieuse..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="h-24 resize-none"
                />
              </div>

              <div>
                <Label htmlFor="duration">Durée de la vidéo</Label>
                <select
                  id="duration"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full p-2 border border-input rounded-md bg-background"
                >
                  <option value={5}>5 secondes</option>
                  <option value={10}>10 secondes</option>
                  <option value={15}>15 secondes</option>
                  <option value={20}>20 secondes</option>
                </select>
              </div>

              <div>
                <Label htmlFor="image">Image de fond</Label>
                <div className="border-2 border-dashed border-upload-border rounded-lg p-6 text-center">
                  {imagePreview ? (
                    <div className="space-y-4">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="max-h-32 mx-auto rounded-lg shadow-md"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setImage(null);
                          setImagePreview(null);
                        }}
                      >
                        Changer d'image
                      </Button>
                    </div>
                  ) : (
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Cliquez pour uploader une image
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        JPG, PNG jusqu'à 10MB
                      </p>
                    </label>
                  )}
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              </div>

              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-pulse-slow w-4 h-4 mr-2 bg-primary-foreground rounded-full" />
                    Génération en cours...
                  </>
                ) : (
                  <>
                    <FileVideo className="w-4 h-4 mr-2" />
                    Générer la vidéo
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Résultats */}
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="w-5 h-5" />
                Résultat
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {scenario && (
                <div>
                  <Label>Scénario généré</Label>
                  <div className="bg-muted p-4 rounded-lg">
                    <pre className="text-sm whitespace-pre-wrap font-mono">
                      {scenario}
                    </pre>
                  </div>
                </div>
              )}

              {isGenerating && (
                <div className="text-center space-y-4">
                  <div className="animate-pulse-slow">
                    <FileVideo className="w-16 h-16 mx-auto text-video-bg" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Génération de la vidéo en cours...
                  </p>
                </div>
              )}

              {generatedVideo && (
                <div className="space-y-4">
                  <video
                    controls
                    className="w-full rounded-lg aspect-video bg-black"
                    src={generatedVideo}
                  >
                    Votre navigateur ne supporte pas la lecture vidéo.
                  </video>
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => window.open(generatedVideo, '_blank')}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Télécharger la vidéo
                  </Button>
                </div>
              )}

              {!scenario && !isGenerating && (
                <div className="text-center text-muted-foreground py-12">
                  <FileVideo className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Votre vidéo apparaîtra ici</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VideoGenerator;