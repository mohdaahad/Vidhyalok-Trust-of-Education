import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Users, Calendar, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { projectService, Project } from "@/services/project.service";
import { getImageUrl } from "@/utils/imageUrl";

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      loadProject();
    }
  }, [id]);

  const loadProject = async () => {
    try {
      setIsLoading(true);
      const response = await projectService.getProjectById(id!);
      setProject(response.data);
    } catch (error: any) {
      console.error("Failed to load project:", error);
      if (error.response?.status === 404) {
        // Project not found, will show error message
      }
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  };

  const handleShare = async () => {
    const url = window.location.href;
    const title = project?.title || "Project";
    const text = project?.description || "Check out this project";

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url,
        });
        toast({
          title: "Shared!",
          description: "Project shared successfully.",
        });
      } catch (error: any) {
        // User cancelled or error occurred
        if (error.name !== "AbortError") {
          console.error("Error sharing:", error);
        }
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(url);
        toast({
          title: "Link Copied!",
          description: "Project link has been copied to clipboard.",
        });
      } catch (error) {
        console.error("Failed to copy:", error);
        toast({
          title: "Error",
          description: "Failed to copy link. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-16">
        <div className="container mx-auto px-4 py-6">
          <Skeleton className="h-10 w-32 mb-6" />
        </div>
        <Skeleton className="h-[60vh] w-full mb-12" />
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Card className="p-6">
                <Skeleton className="h-8 w-1/2 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </Card>
            </div>
            <Card className="p-6">
              <Skeleton className="h-24 w-full mb-4" />
              <Skeleton className="h-12 w-full mb-4" />
              <Skeleton className="h-12 w-full" />
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Project Not Found</h1>
          <p className="text-muted-foreground mb-6">The project you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/projects">Back to Projects</Link>
          </Button>
        </div>
      </div>
    );
  }

  const imageUrl = project.image_url ? getImageUrl(project.image_url) : undefined;
  const gallery = project.gallery || [];
  const updates = project.updates || [];

  return (
    <div className="min-h-screen pt-16">
      {/* Back Button */}
      <div className="container mx-auto px-4 py-6">
        <Button variant="ghost" asChild>
          <Link to="/projects">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Link>
        </Button>
      </div>

      {/* Hero Image */}
      <section className="relative h-[60vh] overflow-hidden">
        {imageUrl ? (
          <img src={imageUrl} alt={project.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 container mx-auto px-4 pb-12 z-10">
          <div className="max-w-4xl">
            <span className="inline-block bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium mb-4">
              {project.category}
            </span>
            <h1 className="text-foreground mb-4">{project.title}</h1>
            <p className="text-xl text-foreground/90">{project.description}</p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Overview */}
              <Card className="p-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">Project Overview</h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {project.full_description || project.description}
                </p>

                {/* Meta Info */}
                <div className="grid md:grid-cols-3 gap-4 pt-6 border-t border-border">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="font-medium text-foreground">{project.location}</p>
                    </div>
                  </div>
                  {project.beneficiaries && (
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Beneficiaries</p>
                        <p className="font-medium text-foreground">{project.beneficiaries}</p>
                      </div>
                    </div>
                  )}
                  {project.start_date && (
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Started</p>
                        <p className="font-medium text-foreground">{formatDate(project.start_date)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </Card>

              {/* Gallery */}
              {gallery.length > 0 && (
                <Card className="p-6">
                  <h2 className="text-2xl font-bold text-foreground mb-4">Gallery</h2>
                  <div className="grid md:grid-cols-3 gap-4">
                    {gallery.map((item) => {
                      const galleryImageUrl = getImageUrl(item.image_url);
                      return (
                        <div key={item.id} className="relative h-48 rounded-lg overflow-hidden">
                          <img
                            src={galleryImageUrl}
                            alt={item.caption || `${project.title} gallery`}
                            className="w-full h-full object-cover hover:scale-105 transition-smooth"
                          />
                        </div>
                      );
                    })}
                  </div>
                </Card>
              )}

              {/* Updates */}
              {updates.length > 0 && (
                <Card className="p-6">
                  <h2 className="text-2xl font-bold text-foreground mb-4">Recent Updates</h2>
                  <div className="space-y-4">
                    {updates.map((update) => (
                      <div key={update.id} className="flex gap-4 pb-4 border-b border-border last:border-0">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-primary" />
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">
                            {formatDate(update.update_date)}
                          </p>
                          <h4 className="font-semibold text-foreground mb-1">{update.title}</h4>
                          <p className="text-foreground">{update.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Donation Card */}
              <Card className="p-6 sticky top-20">
                <Button size="lg" className="w-full mb-4" asChild>
                  <Link to="/donate">Donate Now</Link>
                </Button>

                <Button variant="outline" size="lg" className="w-full mb-6" onClick={handleShare}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Project
                </Button>

                <div className="pt-6 border-t border-border space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Status</span>
                    <span className="font-medium text-foreground capitalize">{project.status}</span>
                  </div>
                  {project.start_date && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Started</span>
                      <span className="font-medium text-foreground">{formatDate(project.start_date)}</span>
                    </div>
                  )}
                  {project.end_date && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">End Date</span>
                      <span className="font-medium text-foreground">{formatDate(project.end_date)}</span>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProjectDetail;
