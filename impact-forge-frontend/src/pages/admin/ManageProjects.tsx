import { useState, useEffect, useRef } from "react";
import { Plus, Edit, Trash2, Eye, X, Image as ImageIcon, FileText, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { projectService, Project, ProjectUpdate, ProjectGallery } from "@/services/project.service";
import { getImageUrl } from "@/utils/imageUrl";

const ManageProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isGalleryDialogOpen, setIsGalleryDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectUpdates, setProjectUpdates] = useState<ProjectUpdate[]>([]);
  const [projectGallery, setProjectGallery] = useState<ProjectGallery[]>([]);
  const { toast } = useToast();

  // Form states
  const [projectForm, setProjectForm] = useState({
    title: "",
    description: "",
    full_description: "",
    category: "",
    location: "",
    target_amount: "",
    image_url: "",
    status: "draft",
    start_date: "",
    end_date: "",
    beneficiaries: "",
  });

  const [updateForm, setUpdateForm] = useState({
    title: "",
    content: "",
  });

  const [galleryForm, setGalleryForm] = useState({
    image_url: "",
    caption: "",
    display_order: 0,
  });

  // Upload states
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingGalleryImage, setUploadingGalleryImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [galleryImagePreview, setGalleryImagePreview] = useState<string | null>(null);
  const [projectImageFileName, setProjectImageFileName] = useState<string>("");
  const [galleryImageFileName, setGalleryImageFileName] = useState<string>("");
  const [projectImageFile, setProjectImageFile] = useState<File | null>(null);
  const [galleryImageFile, setGalleryImageFile] = useState<File | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteGalleryDialogOpen, setDeleteGalleryDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<number | null>(null);
  const [galleryToDelete, setGalleryToDelete] = useState<number | null>(null);

  // File input refs
  const projectImageInputRef = useRef<HTMLInputElement>(null);
  const galleryImageInputRef = useRef<HTMLInputElement>(null);

  // Load projects
  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setIsLoading(true);
      const response = await projectService.getProjects();
      setProjects(response.data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load projects",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadProjectDetails = async (projectId: number) => {
    try {
      const [projectRes, updatesRes, galleryRes] = await Promise.all([
        projectService.getProjectById(projectId),
        projectService.getUpdates(projectId),
        projectService.getGallery(projectId),
      ]);

      setProjectUpdates(updatesRes.data || []);
      setProjectGallery(galleryRes.data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load project details",
        variant: "destructive",
      });
    }
  };

  const handleCreateProject = async () => {
    try {
      setUploadingImage(true);

      const projectData: any = {
        title: projectForm.title,
        description: projectForm.description,
        full_description: projectForm.full_description,
        category: projectForm.category,
        location: projectForm.location,
        target_amount: parseFloat(projectForm.target_amount),
        status: projectForm.status,
      };

      // Add optional fields
      if (projectForm.start_date) projectData.start_date = projectForm.start_date;
      if (projectForm.end_date) projectData.end_date = projectForm.end_date;
      if (projectForm.beneficiaries) projectData.beneficiaries = projectForm.beneficiaries;

      // If image file is selected, include it; otherwise use image_url
      if (projectImageFile) {
        projectData.image = projectImageFile;
      } else if (projectForm.image_url) {
        projectData.image_url = projectForm.image_url;
      }

      await projectService.createProject(projectData);
      toast({
        title: "Success",
        description: "Project created successfully",
      });
      setIsDialogOpen(false);
      resetProjectForm();
      loadProjects();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create project",
        variant: "destructive",
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleUpdateProject = async () => {
    if (!editingProject) return;

    try {
      setUploadingImage(true);

      const projectData: any = {
        title: projectForm.title,
        description: projectForm.description,
        full_description: projectForm.full_description,
        category: projectForm.category,
        location: projectForm.location,
        target_amount: parseFloat(projectForm.target_amount),
        status: projectForm.status,
      };

      // Add optional fields
      if (projectForm.start_date) projectData.start_date = projectForm.start_date;
      if (projectForm.end_date) projectData.end_date = projectForm.end_date;
      if (projectForm.beneficiaries) projectData.beneficiaries = projectForm.beneficiaries;

      // If image file is selected, include it; otherwise use image_url if provided
      if (projectImageFile) {
        projectData.image = projectImageFile;
      } else if (projectForm.image_url) {
        projectData.image_url = projectForm.image_url;
      }

      await projectService.updateProject(editingProject.id, projectData);
      toast({
        title: "Success",
        description: "Project updated successfully",
      });
      setIsDialogOpen(false);
      setEditingProject(null);
      resetProjectForm();
      loadProjects();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update project",
        variant: "destructive",
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDeleteClick = (id: number) => {
    setProjectToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!projectToDelete) return;

    try {
      await projectService.deleteProject(projectToDelete);
      toast({
        title: "Success",
        description: "Project deleted successfully",
      });
      setDeleteDialogOpen(false);
      setProjectToDelete(null);
      loadProjects();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete project",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setProjectForm({
      title: project.title,
      description: project.description,
      full_description: project.full_description || "",
      category: project.category,
      location: project.location,
      target_amount: project.target_amount.toString(),
      image_url: project.image_url || "",
      status: project.status,
      start_date: project.start_date ? new Date(project.start_date).toISOString().split('T')[0] : "",
      end_date: project.end_date ? new Date(project.end_date).toISOString().split('T')[0] : "",
      beneficiaries: project.beneficiaries || "",
    });
    setImagePreview(project.image_url ? getImageUrl(project.image_url) : null);
    setProjectImageFile(null);
    setProjectImageFileName("");
    setIsDialogOpen(true);
  };

  const handleAddUpdate = async () => {
    if (!selectedProject) return;

    try {
      await projectService.addUpdate(selectedProject.id, updateForm);
      toast({
        title: "Success",
        description: "Project update added successfully",
      });
      setIsUpdateDialogOpen(false);
      setUpdateForm({ title: "", content: "" });
      loadProjectDetails(selectedProject.id);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add update",
        variant: "destructive",
      });
    }
  };

  const handleAddGalleryImage = async () => {
    if (!selectedProject) return;

    try {
      setUploadingGalleryImage(true);

      const galleryData: any = {
        caption: galleryForm.caption,
        display_order: galleryForm.display_order,
      };

      // If image file is selected, include it; otherwise use image_url
      if (galleryImageFile) {
        galleryData.image = galleryImageFile;
      } else if (galleryForm.image_url) {
        galleryData.image_url = galleryForm.image_url;
      } else {
        toast({
          title: "Error",
          description: "Please select an image file or provide an image URL",
          variant: "destructive",
        });
        return;
      }

      await projectService.addGalleryImage(selectedProject.id, galleryData);
      toast({
        title: "Success",
        description: "Gallery image added successfully",
      });
      setIsGalleryDialogOpen(false);
      setGalleryForm({ image_url: "", caption: "", display_order: 0 });
      setGalleryImagePreview(null);
      setGalleryImageFileName("");
      setGalleryImageFile(null);
      if (galleryImageInputRef.current) {
        galleryImageInputRef.current.value = "";
      }
      loadProjectDetails(selectedProject.id);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add gallery image",
        variant: "destructive",
      });
    } finally {
      setUploadingGalleryImage(false);
    }
  };

  const handleDeleteGalleryImageClick = (galleryId: number) => {
    setGalleryToDelete(galleryId);
    setDeleteGalleryDialogOpen(true);
  };

  const handleDeleteGalleryImage = async () => {
    if (!selectedProject || !galleryToDelete) return;

    try {
      await projectService.deleteGalleryImage(selectedProject.id, galleryToDelete);
      toast({
        title: "Success",
        description: "Gallery image deleted successfully",
      });
      setDeleteGalleryDialogOpen(false);
      setGalleryToDelete(null);
      loadProjectDetails(selectedProject.id);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete gallery image",
        variant: "destructive",
      });
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, type: "project" | "gallery") => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Image file size should not exceed 10MB.",
        variant: "destructive",
      });
      return;
    }

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);

    if (type === "project") {
      setProjectImageFile(file);
      setImagePreview(previewUrl);
      setProjectImageFileName(file.name);
      // Clear image_url if file is selected
      setProjectForm((prev) => ({ ...prev, image_url: "" }));
    } else {
      setGalleryImageFile(file);
      setGalleryImagePreview(previewUrl);
      setGalleryImageFileName(file.name);
      // Clear image_url if file is selected
      setGalleryForm((prev) => ({ ...prev, image_url: "" }));
    }
  };

  const resetProjectForm = () => {
    setProjectForm({
      title: "",
      description: "",
      full_description: "",
      category: "",
      location: "",
      target_amount: "",
      image_url: "",
      status: "draft",
      start_date: "",
      end_date: "",
      beneficiaries: "",
    });
    setImagePreview(null);
    setProjectImageFileName("");
    setProjectImageFile(null);
    if (projectImageInputRef.current) {
      projectImageInputRef.current.value = "";
    }
  };

  const openProjectDetails = (project: Project) => {
    setSelectedProject(project);
    loadProjectDetails(project.id);
  };

  const getProgress = (project: Project) => {
    if (!project.target_amount || project.target_amount === 0) return 0;
    return Math.min((project.raised_amount / project.target_amount) * 100, 100);
  };

  const categoryOptions = [
    { value: "education", label: "Education" },
    { value: "healthcare", label: "Healthcare" },
    { value: "water", label: "Water" },
    { value: "shelter", label: "Shelter" },
    { value: "environment", label: "Environment" },
    { value: "community", label: "Community" },
  ];

  const statusOptions = [
    { value: "draft", label: "Draft" },
    { value: "active", label: "Active" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
  ];

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Manage Projects</h1>
          <p className="text-muted-foreground mt-2">Create and manage your organization's projects</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setEditingProject(null);
            resetProjectForm();
          }
        }}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingProject(null);
              resetProjectForm();
            }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto custom-scrollbar">
            <DialogHeader>
              <DialogTitle>{editingProject ? "Edit Project" : "Create New Project"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="title">Project Title *</Label>
                <Input
                  id="title"
                  placeholder="Enter project title"
                  value={projectForm.title}
                  onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={projectForm.category}
                    onValueChange={(value) => setProjectForm({ ...projectForm, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={projectForm.status}
                    onValueChange={(value) => setProjectForm({ ...projectForm, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  placeholder="Enter project location"
                  value={projectForm.location}
                  onChange={(e) => setProjectForm({ ...projectForm, location: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="target_amount">Target Amount ($) *</Label>
                  <Input
                    id="target_amount"
                    type="number"
                    placeholder="0.00"
                    value={projectForm.target_amount}
                    onChange={(e) => setProjectForm({ ...projectForm, target_amount: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="image_url">Project Image</Label>
                  <div className="space-y-2">
                    <input
                      type="file"
                      ref={projectImageInputRef}
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileChange(e, "project")}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => projectImageInputRef.current?.click()}
                      disabled={uploadingImage}
                      className="w-full"
                    >
                      {uploadingImage ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Image
                        </>
                      )}
                    </Button>
                    {imagePreview && (
                      <div className="space-y-2">
                        <div className="relative w-full h-48 border rounded-lg overflow-hidden">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => {
                              // Revoke object URL if it was created from file
                              if (projectImageFile && imagePreview && imagePreview.startsWith("blob:")) {
                                URL.revokeObjectURL(imagePreview);
                              }
                              setImagePreview(null);
                              setProjectForm({ ...projectForm, image_url: "" });
                              setProjectImageFileName("");
                              setProjectImageFile(null);
                              if (projectImageInputRef.current) {
                                projectImageInputRef.current.value = "";
                              }
                            }}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        {projectImageFileName && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <span className="font-medium">File:</span>
                            <span className="truncate">{projectImageFileName}</span>
                          </p>
                        )}
                      </div>
                    )}
                    {projectForm.image_url && !imagePreview && (
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Image URL: {projectForm.image_url}</p>
                        {projectImageFileName && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <span className="font-medium">File:</span>
                            <span className="truncate">{projectImageFileName}</span>
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Short Description *</Label>
                <Textarea
                  id="description"
                  rows={3}
                  placeholder="Brief project description..."
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="full_description">Full Description</Label>
                <Textarea
                  id="full_description"
                  rows={4}
                  placeholder="Detailed project description..."
                  value={projectForm.full_description}
                  onChange={(e) => setProjectForm({ ...projectForm, full_description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={projectForm.start_date}
                    onChange={(e) => {
                      const startDate = e.target.value;
                      setProjectForm({ ...projectForm, start_date: startDate });
                      // If end date is before new start date, clear it
                      if (projectForm.end_date && startDate && projectForm.end_date < startDate) {
                        setProjectForm((prev) => ({ ...prev, end_date: "" }));
                      }
                    }}
                  />
                </div>
                <div>
                  <Label htmlFor="end_date">End Date</Label>
                  <Input
                    id="end_date"
                    type="date"
                    min={projectForm.start_date || new Date().toISOString().split('T')[0]}
                    value={projectForm.end_date}
                    onChange={(e) => setProjectForm({ ...projectForm, end_date: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="beneficiaries">Beneficiaries</Label>
                <Input
                  id="beneficiaries"
                  placeholder="e.g., 500 children, 200 families"
                  value={projectForm.beneficiaries}
                  onChange={(e) => setProjectForm({ ...projectForm, beneficiaries: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button onClick={editingProject ? handleUpdateProject : handleCreateProject}>
                  {editingProject ? "Update" : "Create"} Project
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Project Details Dialog */}
      {selectedProject && (
        <Dialog open={!!selectedProject} onOpenChange={(open) => !open && setSelectedProject(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedProject.title}</DialogTitle>
            </DialogHeader>

            <Tabs defaultValue="updates" className="mt-4">
              <TabsList>
                <TabsTrigger value="updates">
                  <FileText className="w-4 h-4 mr-2" />
                  Updates
                </TabsTrigger>
                <TabsTrigger value="gallery">
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Gallery
                </TabsTrigger>
              </TabsList>

              <TabsContent value="updates" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Project Updates</h3>
                  <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Update
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Project Update</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        <div>
                          <Label htmlFor="update_title">Title *</Label>
                          <Input
                            id="update_title"
                            placeholder="Update title"
                            value={updateForm.title}
                            onChange={(e) => setUpdateForm({ ...updateForm, title: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="update_content">Content *</Label>
                          <Textarea
                            id="update_content"
                            rows={6}
                            placeholder="Update content..."
                            value={updateForm.content}
                            onChange={(e) => setUpdateForm({ ...updateForm, content: e.target.value })}
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setIsUpdateDialogOpen(false)}>Cancel</Button>
                          <Button onClick={handleAddUpdate}>Add Update</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="space-y-4">
                  {projectUpdates.length === 0 ? (
                    <Card className="p-8 text-center">
                      <p className="text-muted-foreground">No updates yet. Add the first update!</p>
                    </Card>
                  ) : (
                    projectUpdates.map((update) => (
                      <Card key={update.id} className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground mb-2">{update.title}</h4>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{update.content}</p>
                            <p className="text-xs text-muted-foreground mt-2">
                              {new Date(update.update_date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="gallery" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Project Gallery</h3>
                  <Dialog open={isGalleryDialogOpen} onOpenChange={setIsGalleryDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Image
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Gallery Image</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        <div>
                          <Label htmlFor="gallery_image_url">Gallery Image *</Label>
                          <div className="space-y-2">
                            <input
                              type="file"
                              ref={galleryImageInputRef}
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleFileChange(e, "gallery")}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => galleryImageInputRef.current?.click()}
                              disabled={uploadingGalleryImage}
                              className="w-full"
                            >
                              {uploadingGalleryImage ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  Uploading...
                                </>
                              ) : (
                                <>
                                  <Upload className="w-4 h-4 mr-2" />
                                  Upload Image
                                </>
                              )}
                            </Button>
                            {galleryImagePreview && (
                              <div className="space-y-2">
                                <div className="relative w-full h-48 border rounded-lg overflow-hidden">
                                  <img
                                    src={galleryImagePreview}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                  />
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    className="absolute top-2 right-2"
                                    onClick={() => {
                                      // Revoke object URL if it was created from file
                                      if (galleryImageFile && galleryImagePreview && galleryImagePreview.startsWith("blob:")) {
                                        URL.revokeObjectURL(galleryImagePreview);
                                      }
                                      setGalleryImagePreview(null);
                                      setGalleryForm({ ...galleryForm, image_url: "" });
                                      setGalleryImageFileName("");
                                      setGalleryImageFile(null);
                                      if (galleryImageInputRef.current) {
                                        galleryImageInputRef.current.value = "";
                                      }
                                    }}
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </div>
                                {galleryImageFileName && (
                                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                                    <span className="font-medium">File:</span>
                                    <span className="truncate">{galleryImageFileName}</span>
                                  </p>
                                )}
                              </div>
                            )}
                            {galleryForm.image_url && !galleryImagePreview && (
                              <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">Image URL: {galleryForm.image_url}</p>
                                {galleryImageFileName && (
                                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                                    <span className="font-medium">File:</span>
                                    <span className="truncate">{galleryImageFileName}</span>
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="gallery_caption">Caption</Label>
                          <Input
                            id="gallery_caption"
                            placeholder="Image caption (optional)"
                            value={galleryForm.caption}
                            onChange={(e) => setGalleryForm({ ...galleryForm, caption: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="display_order">Display Order</Label>
                          <Input
                            id="display_order"
                            type="number"
                            placeholder="0"
                            value={galleryForm.display_order}
                            onChange={(e) => setGalleryForm({ ...galleryForm, display_order: parseInt(e.target.value) || 0 })}
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setIsGalleryDialogOpen(false)}>Cancel</Button>
                          <Button onClick={handleAddGalleryImage}>Add Image</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {projectGallery.length === 0 ? (
                    <Card className="p-8 text-center col-span-3">
                      <p className="text-muted-foreground">No gallery images yet. Add the first image!</p>
                    </Card>
                  ) : (
                    projectGallery.map((item) => (
                      <Card key={item.id} className="overflow-hidden">
                        <div className="relative aspect-video">
                          <img
                            src={getImageUrl(item.image_url)}
                            alt={item.caption || "Gallery image"}
                            className="w-full h-full object-cover"
                          />
                          <Button
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => handleDeleteGalleryImageClick(item.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        {item.caption && (
                          <div className="p-2">
                            <p className="text-xs text-muted-foreground">{item.caption}</p>
                          </div>
                        )}
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}

      {/* Projects List */}
      <div className="grid gap-6">
        {isLoading ? (
          // Loading skeleton
          Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-4" />
                  <Skeleton className="h-2 w-full mb-2" />
                  <div className="flex gap-6">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-9 w-9" />
                  <Skeleton className="h-9 w-9" />
                  <Skeleton className="h-9 w-9" />
                </div>
              </div>
            </Card>
          ))
        ) : projects.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No projects yet. Create your first project!</p>
          </Card>
        ) : (
          projects.map((project) => (
            <Card key={project.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-foreground">{project.title}</h3>
                    <Badge variant={project.status === "active" ? "default" : "secondary"}>
                      {project.status}
                    </Badge>
                    <Badge variant="outline">{project.category}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{project.description}</p>
                  <p className="text-xs text-muted-foreground mb-4">Location: {project.location}</p>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium text-foreground">{getProgress(project).toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary rounded-full h-2 transition-smooth"
                        style={{ width: `${getProgress(project)}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex gap-6 text-sm">
                    <div>
                      <span className="text-muted-foreground">Raised: </span>
                      <span className="font-bold text-primary">${project.raised_amount.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Goal: </span>
                      <span className="font-medium text-foreground">${project.target_amount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openProjectDetails(project)}
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleEdit(project)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDeleteClick(project.id)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Delete Project Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this project? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setProjectToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Gallery Image Confirmation Dialog */}
      <AlertDialog open={deleteGalleryDialogOpen} onOpenChange={setDeleteGalleryDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Gallery Image</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this image? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setGalleryToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteGalleryImage} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ManageProjects;
