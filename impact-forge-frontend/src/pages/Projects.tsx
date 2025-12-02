import { useState, useEffect } from "react";
import { GraduationCap, Heart, Droplets, Home, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { projectService, Project } from "@/services/project.service";
import { getImageUrl } from "@/utils/imageUrl";

const categories = [
  { id: "all", label: "All Projects", icon: null },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "healthcare", label: "Healthcare", icon: Heart },
  { id: "water", label: "Clean Water", icon: Droplets },
  { id: "shelter", label: "Shelter", icon: Home },
];

const Projects = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setIsLoading(true);
      const response = await projectService.getProjects();
      setProjects(response.data || []);
    } catch (error) {
      console.error("Failed to load projects:", error);
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProjects =
    selectedCategory === "all"
      ? projects.filter((p) => p.status === "active")
      : projects.filter((p) => p.category.toLowerCase() === selectedCategory && p.status === "active");


  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="py-20 gradient-hero">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <h1 className="text-primary-foreground mb-6">Our Projects</h1>
            <p className="text-xl text-primary-foreground/90 leading-relaxed">
              Explore our impactful initiatives creating positive change in communities worldwide.
              Every project is designed for sustainability and community empowerment.
            </p>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          {/* Category Tabs */}
          <Tabs defaultValue="all" className="mb-12" onValueChange={setSelectedCategory}>
            <TabsList className="grid w-full max-w-3xl mx-auto grid-cols-2 md:grid-cols-5 mb-12">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <TabsTrigger key={cat.id} value={cat.id} className="flex items-center gap-2">
                    {Icon && <Icon className="w-4 h-4" />}
                    <span className="hidden sm:inline">{cat.label}</span>
                    <span className="sm:hidden">{cat.label.split(" ")[0]}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            <TabsContent value={selectedCategory} className="mt-0">
              {isLoading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Card key={i} className="overflow-hidden">
                      <Skeleton className="h-56 w-full" />
                      <div className="p-6">
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-full mb-4" />
                        <Skeleton className="h-2 w-full mb-4" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                    </Card>
                  ))}
                </div>
              ) : filteredProjects.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No projects found in this category.</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredProjects.map((project, index) => {
                    const imageUrl = project.image_url ? getImageUrl(project.image_url) : undefined;
                    const categoryInfo = categories.find((c) => c.id === project.category.toLowerCase());

                    return (
                      <Card
                        key={project.id}
                        className="overflow-hidden transition-smooth hover:shadow-lg hover:-translate-y-2 animate-fade-in-up"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        {/* Image */}
                        <div className="relative h-56 overflow-hidden bg-muted">
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={project.title}
                              className="w-full h-full object-cover transition-smooth hover:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              {categoryInfo?.icon && (
                                <categoryInfo.icon className="w-16 h-16 text-muted-foreground" />
                              )}
                            </div>
                          )}
                          <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1.5 rounded-full text-sm font-medium">
                            {categoryInfo?.label || project.category}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                          <h3 className="text-xl font-bold text-foreground mb-2">{project.title}</h3>
                          <p className="text-muted-foreground mb-4 text-sm line-clamp-2">{project.description}</p>

                          {/* Meta Info */}
                          <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                            <span>📍 {project.location}</span>
                            {project.beneficiaries && <span>👥 {project.beneficiaries}</span>}
                          </div>


                          {/* CTA */}
                          <Button variant="default" className="w-full group" asChild>
                            <Link to={`/projects/${project.id}`}>
                              Learn More
                              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                          </Button>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-warm">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-accent-foreground mb-6">Want to Start Your Own Project?</h2>
            <p className="text-xl text-accent-foreground/90 mb-8 leading-relaxed">
              Have an idea for a community project? We'd love to hear from you and explore how
              we can work together to make it happen.
            </p>
            <Button variant="hero" size="lg" asChild>
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Projects;
