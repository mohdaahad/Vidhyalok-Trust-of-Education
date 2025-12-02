import { useState } from "react";
import { Upload, Image as ImageIcon, Trash2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const mockMedia = [
  { id: 1, name: "hero-image.jpg", size: "2.4 MB", type: "image", date: "2024-10-20" },
  { id: 2, name: "education-project.jpg", size: "1.8 MB", type: "image", date: "2024-10-18" },
  { id: 3, name: "health-project.jpg", size: "2.1 MB", type: "image", date: "2024-10-15" },
  { id: 4, name: "mission-icon.jpg", size: "500 KB", type: "image", date: "2024-10-12" },
];

const MediaLibrary = () => {
  const [media, setMedia] = useState(mockMedia);
  const { toast } = useToast();

  const handleUpload = () => {
    toast({
      title: "Upload Feature",
      description: "File upload will be enabled with backend integration.",
    });
  };

  const handleDelete = (id: number) => {
    setMedia(media.filter((m) => m.id !== id));
    toast({
      title: "Media Deleted",
      description: "The file has been removed from the library.",
    });
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Media Library</h1>
          <p className="text-muted-foreground mt-2">Manage images and files for your website</p>
        </div>
        <Button onClick={handleUpload}>
          <Upload className="w-4 h-4 mr-2" />
          Upload Media
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <div className="text-2xl font-bold text-foreground mb-1">{media.length}</div>
          <div className="text-sm text-muted-foreground">Total Files</div>
        </Card>
        <Card className="p-6">
          <div className="text-2xl font-bold text-primary mb-1">
            {(media.reduce((sum, m) => sum + parseFloat(m.size), 0) / 1000).toFixed(1)} MB
          </div>
          <div className="text-sm text-muted-foreground">Total Storage</div>
        </Card>
        <Card className="p-6">
          <div className="text-2xl font-bold text-secondary mb-1">100 MB</div>
          <div className="text-sm text-muted-foreground">Storage Limit</div>
        </Card>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {media.map((file) => (
          <Card key={file.id} className="overflow-hidden group">
            <div className="aspect-square bg-muted flex items-center justify-center relative">
              <ImageIcon className="w-16 h-16 text-muted-foreground" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-smooth flex items-center justify-center gap-2">
                <Button variant="secondary" size="sm">
                  <Download className="w-4 h-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleDelete(file.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="p-4">
              <div className="font-medium text-sm text-foreground truncate mb-1">
                {file.name}
              </div>
              <div className="text-xs text-muted-foreground">{file.size}</div>
              <div className="text-xs text-muted-foreground">{file.date}</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MediaLibrary;
