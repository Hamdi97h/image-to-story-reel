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
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [scenario, setScenario] = useState<string | null>(null);
  const [generationType, setGenerationType] = useState<'text-to-image' | 'text-to-video' | 'image-to-video'>('image-to-video');
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

  const generateContent = async () => {
    let imageBase64 = '';
    
    // Convert image to base64 if needed
    if (image && (generationType === 'image-to-video')) {
      const reader = new FileReader();
      imageBase64 = await new Promise<string>((resolve) => {
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(image);
      });
    }

    // Call the Edge Function with Vyro AI
    const { data, error } = await supabase.functions.invoke('animate-image', {
      body: {
        imageBase64: imageBase64,
        prompt: prompt,
        type: generationType,
        style: 'kling-1.0-pro'
      }
    });

    if (error) {
      console.error('Edge function error:', error);
      throw new Error(`Generation failed: ${error.message || 'Unknown error'}`);
    }

    if (!data) {
      throw new Error('No data received from generation service');
    }

    if (data.error) {
      throw new Error(data.error);
    }

    return data.result;
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Champs manquants",
        description: "Veuillez entrer un texte.",
        variant: "destructive",
      });
      return;
    }

    if (generationType === 'image-to-video' && !image) {
      toast({
        title: "Image manquante",
        description: "Veuillez uploader une image pour la conversion image vers vidéo.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setGeneratedVideo(null);
    setGeneratedImage(null);
    
    try {
      // Generate content with Vyro AI
      const result = await generateContent();
      
      if (generationType === 'text-to-image') {
        // Handle image generation result
        if (result.url) {
          setGeneratedImage(result.url);
          toast({
            title: "Image générée !",
            description: "Votre image a été créée avec succès.",
          });
        }
      } else {
        // Handle video generation result
        if (result.url) {
          setGeneratedVideo(result.url);
          toast({
            title: "Vidéo générée !",
            description: "Votre vidéo a été créée avec succès.",
          });
        }
      }

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
            Générateur IA Vyro
          </h1>
          <p className="text-muted-foreground text-lg">
            Créez des images et vidéos avec Vyro AI
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
                <Label htmlFor="type">Type de génération</Label>
                <select
                  id="type"
                  value={generationType}
                  onChange={(e) => setGenerationType(e.target.value as any)}
                  className="w-full p-2 border border-input rounded-md bg-background"
                >
                  <option value="text-to-image">Texte vers Image</option>
                  <option value="text-to-video">Texte vers Vidéo</option>
                  <option value="image-to-video">Image vers Vidéo</option>
                </select>
              </div>

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

              {generationType === 'image-to-video' && (
                <div>
                  <Label htmlFor="image">Image de base</Label>
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
              )}

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
                    Générer {generationType === 'text-to-image' ? 'l\'image' : 'la vidéo'}
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
              {isGenerating && (
                <div className="text-center space-y-4">
                  <div className="animate-pulse-slow">
                    <FileVideo className="w-16 h-16 mx-auto text-video-bg" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Génération en cours...
                  </p>
                </div>
              )}

              {generatedImage && (
                <div className="space-y-4">
                  <img
                    src={generatedImage}
                    alt="Generated image"
                    className="w-full rounded-lg"
                  />
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => window.open(generatedImage, '_blank')}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Télécharger l'image
                  </Button>
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

              {!generatedImage && !generatedVideo && !isGenerating && (
                <div className="text-center text-muted-foreground py-12">
                  <FileVideo className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Votre contenu apparaîtra ici</p>
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