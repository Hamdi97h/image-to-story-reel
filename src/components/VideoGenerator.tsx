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
      // Convert image to base64
      const reader = new FileReader();
      const imageBase64 = await new Promise<string>((resolve) => {
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(image);
      });

      // Call the Edge Function to generate video
      const { data, error } = await supabase.functions.invoke('generate-video', {
        body: {
          prompt: prompt,
          imageFile: imageBase64
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      setScenario(data.scenario);
      setGeneratedVideo(data.videoUrl);
      
      toast({
        title: "Vidéo générée !",
        description: "Votre vidéo est prête à être visionnée.",
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