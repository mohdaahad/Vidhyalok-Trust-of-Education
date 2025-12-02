import { useState, useEffect, useRef } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  X,
  Calendar,
  Upload,
  Loader2,
  Clock,
  Image as ImageIcon,
  TrendingUp,
  MessageSquare,
  List,
  Users,
  Mail,
  Phone,
} from "lucide-react";
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
import {
  eventService,
  Event,
  EventAgenda,
  EventGallery,
  EventImpactMetric,
  EventTestimonial,
  EventRegistration,
} from "@/services/event.service";
import { getImageUrl } from "@/utils/imageUrl";

const ManageEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAgendaDialogOpen, setIsAgendaDialogOpen] = useState(false);
  const [isGalleryDialogOpen, setIsGalleryDialogOpen] = useState(false);
  const [isImpactMetricDialogOpen, setIsImpactMetricDialogOpen] = useState(false);
  const [isTestimonialDialogOpen, setIsTestimonialDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [eventAgenda, setEventAgenda] = useState<EventAgenda[]>([]);
  const [eventGallery, setEventGallery] = useState<EventGallery[]>([]);
  const [eventImpactMetrics, setEventImpactMetrics] = useState<EventImpactMetric[]>([]);
  const [eventTestimonials, setEventTestimonials] = useState<EventTestimonial[]>([]);
  const [eventRegistrations, setEventRegistrations] = useState<EventRegistration[]>([]);
  const { toast } = useToast();

  // Form states
  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",
    full_description: "",
    date: "",
    time: "",
    location: "",
    address: "",
    image_url: "",
    category: "",
    type: "",
    max_participants: "",
    capacity: "",
    status: "upcoming",
    impact: "",
  });

  const [agendaForm, setAgendaForm] = useState({
    time: "",
    activity: "",
    display_order: 0,
  });

  const [galleryForm, setGalleryForm] = useState({
    image_url: "",
    caption: "",
    display_order: 0,
  });

  const [impactMetricForm, setImpactMetricForm] = useState({
    label: "",
    value: "",
    icon_type: "",
    display_order: 0,
  });

  const [testimonialForm, setTestimonialForm] = useState({
    name: "",
    role: "",
    quote: "",
    display_order: 0,
  });

  // Upload states
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingGalleryImage, setUploadingGalleryImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [galleryImagePreview, setGalleryImagePreview] = useState<string | null>(null);
  const [eventImageFileName, setEventImageFileName] = useState<string>("");
  const [galleryImageFileName, setGalleryImageFileName] = useState<string>("");
  const [eventImageFile, setEventImageFile] = useState<File | null>(null);
  const [galleryImageFile, setGalleryImageFile] = useState<File | null>(null);

  // Delete dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteAgendaDialogOpen, setDeleteAgendaDialogOpen] = useState(false);
  const [deleteGalleryDialogOpen, setDeleteGalleryDialogOpen] = useState(false);
  const [deleteImpactMetricDialogOpen, setDeleteImpactMetricDialogOpen] = useState(false);
  const [deleteTestimonialDialogOpen, setDeleteTestimonialDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<number | null>(null);
  const [agendaToDelete, setAgendaToDelete] = useState<number | null>(null);
  const [galleryToDelete, setGalleryToDelete] = useState<number | null>(null);
  const [impactMetricToDelete, setImpactMetricToDelete] = useState<number | null>(null);
  const [testimonialToDelete, setTestimonialToDelete] = useState<number | null>(null);

  // File input refs
  const eventImageInputRef = useRef<HTMLInputElement>(null);
  const galleryImageInputRef = useRef<HTMLInputElement>(null);

  // Load events
  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setIsLoading(true);
      const response = await eventService.getEvents();
      setEvents(response.data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load events",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadEventDetails = async (eventId: number) => {
    try {
      const [eventRes, agendaRes, galleryRes, metricsRes, testimonialsRes] = await Promise.all([
        eventService.getEventById(eventId),
        eventService.getAgenda(eventId),
        eventService.getGallery(eventId),
        eventService.getImpactMetrics(eventId),
        eventService.getTestimonials(eventId),
      ]);

      // Extract registrations from event response
      const registrations = eventRes.data?.registrations || [];
      setEventRegistrations(registrations);

      setEventAgenda(agendaRes.data || []);
      setEventGallery(galleryRes.data || []);
      setEventImpactMetrics(metricsRes.data || []);
      setEventTestimonials(testimonialsRes.data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load event details",
        variant: "destructive",
      });
    }
  };

  const handleCreateEvent = async () => {
    try {
      setUploadingImage(true);

      const eventData: any = {
        title: eventForm.title,
        description: eventForm.description,
        full_description: eventForm.full_description,
        date: eventForm.date,
        time: eventForm.time,
        location: eventForm.location,
        address: eventForm.address,
        category: eventForm.category,
        status: eventForm.status,
      };

      if (eventForm.type) eventData.type = eventForm.type;
      if (eventForm.max_participants) eventData.max_participants = parseInt(eventForm.max_participants);
      if (eventForm.capacity) eventData.capacity = eventForm.capacity;
      if (eventForm.impact) eventData.impact = eventForm.impact;

      // If image file is selected, include it
      if (eventImageFile) {
        eventData.image = eventImageFile;
      }

      await eventService.createEvent(eventData);
      toast({
        title: "Success",
        description: "Event created successfully",
      });
      setIsDialogOpen(false);
      resetEventForm();
      loadEvents();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create event",
        variant: "destructive",
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleUpdateEvent = async () => {
    if (!editingEvent) return;

    try {
      setUploadingImage(true);

      const eventData: any = {
        title: eventForm.title,
        description: eventForm.description,
        full_description: eventForm.full_description,
        date: eventForm.date,
        time: eventForm.time,
        location: eventForm.location,
        address: eventForm.address,
        category: eventForm.category,
        status: eventForm.status,
      };

      if (eventForm.type) eventData.type = eventForm.type;
      if (eventForm.max_participants) eventData.max_participants = parseInt(eventForm.max_participants);
      if (eventForm.capacity) eventData.capacity = eventForm.capacity;
      if (eventForm.impact) eventData.impact = eventForm.impact;

      // If image file is selected, include it
      if (eventImageFile) {
        eventData.image = eventImageFile;
      }

      await eventService.updateEvent(editingEvent.id, eventData);
      toast({
        title: "Success",
        description: "Event updated successfully",
      });
    setIsDialogOpen(false);
    setEditingEvent(null);
      resetEventForm();
      loadEvents();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update event",
        variant: "destructive",
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDeleteClick = (id: number) => {
    setEventToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!eventToDelete) return;

    try {
      await eventService.deleteEvent(eventToDelete);
      toast({
        title: "Success",
        description: "Event deleted successfully",
      });
      setDeleteDialogOpen(false);
      setEventToDelete(null);
      loadEvents();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete event",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setEventForm({
      title: event.title,
      description: event.description,
      full_description: event.full_description || "",
      date: event.date ? new Date(event.date).toISOString().split("T")[0] : "",
      time: event.time || "",
      location: event.location,
      address: event.address || "",
      image_url: event.image_url || "",
      category: event.category,
      type: event.type || "",
      max_participants: event.max_participants?.toString() || "",
      capacity: event.capacity || "",
      status: event.status,
      impact: event.impact || "",
    });
    setImagePreview(event.image_url ? getImageUrl(event.image_url) : null);
    setEventImageFile(null);
    setEventImageFileName("");
    setIsDialogOpen(true);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, type: "event" | "gallery") => {
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

    if (type === "event") {
      setEventImageFile(file);
      setImagePreview(previewUrl);
      setEventImageFileName(file.name);
      setEventForm((prev) => ({ ...prev, image_url: "" }));
    } else {
      setGalleryImageFile(file);
      setGalleryImagePreview(previewUrl);
      setGalleryImageFileName(file.name);
      setGalleryForm((prev) => ({ ...prev, image_url: "" }));
    }
  };

  const resetEventForm = () => {
    setEventForm({
      title: "",
      description: "",
      full_description: "",
      date: "",
      time: "",
      location: "",
      address: "",
      image_url: "",
      category: "",
      type: "",
      max_participants: "",
      capacity: "",
      status: "upcoming",
      impact: "",
    });
    setImagePreview(null);
    setEventImageFileName("");
    setEventImageFile(null);
    if (eventImageInputRef.current) {
      eventImageInputRef.current.value = "";
    }
  };

  const openEventDetails = (event: Event) => {
    setSelectedEvent(event);
    // Reset registrations before loading
    setEventRegistrations([]);
    loadEventDetails(event.id);
  };

  // Agenda handlers
  const handleAddAgenda = async () => {
    if (!selectedEvent) return;

    try {
      await eventService.addAgenda(selectedEvent.id, agendaForm);
      toast({
        title: "Success",
        description: "Agenda item added successfully",
      });
      setIsAgendaDialogOpen(false);
      setAgendaForm({ time: "", activity: "", display_order: 0 });
      loadEventDetails(selectedEvent.id);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add agenda item",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAgendaClick = (agendaId: number) => {
    setAgendaToDelete(agendaId);
    setDeleteAgendaDialogOpen(true);
  };

  const handleDeleteAgenda = async () => {
    if (!selectedEvent || !agendaToDelete) return;

    try {
      await eventService.deleteAgenda(selectedEvent.id, agendaToDelete);
      toast({
        title: "Success",
        description: "Agenda item deleted successfully",
      });
      setDeleteAgendaDialogOpen(false);
      setAgendaToDelete(null);
      loadEventDetails(selectedEvent.id);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete agenda item",
        variant: "destructive",
      });
    }
  };

  // Gallery handlers
  const handleAddGalleryImage = async () => {
    if (!selectedEvent) return;

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

      await eventService.addGalleryImage(selectedEvent.id, galleryData);
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
      loadEventDetails(selectedEvent.id);
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
    if (!selectedEvent || !galleryToDelete) return;

    try {
      await eventService.deleteGalleryImage(selectedEvent.id, galleryToDelete);
      toast({
        title: "Success",
        description: "Gallery image deleted successfully",
      });
      setDeleteGalleryDialogOpen(false);
      setGalleryToDelete(null);
      loadEventDetails(selectedEvent.id);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete gallery image",
        variant: "destructive",
      });
    }
  };

  // Impact Metrics handlers
  const handleAddImpactMetric = async () => {
    if (!selectedEvent) return;

    try {
      await eventService.addImpactMetric(selectedEvent.id, impactMetricForm);
      toast({
        title: "Success",
        description: "Impact metric added successfully",
      });
      setIsImpactMetricDialogOpen(false);
      setImpactMetricForm({ label: "", value: "", icon_type: "", display_order: 0 });
      loadEventDetails(selectedEvent.id);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add impact metric",
        variant: "destructive",
      });
    }
  };

  const handleDeleteImpactMetricClick = (metricId: number) => {
    setImpactMetricToDelete(metricId);
    setDeleteImpactMetricDialogOpen(true);
  };

  const handleDeleteImpactMetric = async () => {
    if (!selectedEvent || !impactMetricToDelete) return;

    try {
      await eventService.deleteImpactMetric(selectedEvent.id, impactMetricToDelete);
      toast({
        title: "Success",
        description: "Impact metric deleted successfully",
      });
      setDeleteImpactMetricDialogOpen(false);
      setImpactMetricToDelete(null);
      loadEventDetails(selectedEvent.id);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete impact metric",
        variant: "destructive",
      });
    }
  };

  // Testimonials handlers
  const handleAddTestimonial = async () => {
    if (!selectedEvent) return;

    try {
      await eventService.addTestimonial(selectedEvent.id, testimonialForm);
      toast({
        title: "Success",
        description: "Testimonial added successfully",
      });
      setIsTestimonialDialogOpen(false);
      setTestimonialForm({ name: "", role: "", quote: "", display_order: 0 });
      loadEventDetails(selectedEvent.id);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add testimonial",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTestimonialClick = (testimonialId: number) => {
    setTestimonialToDelete(testimonialId);
    setDeleteTestimonialDialogOpen(true);
  };

  const handleDeleteTestimonial = async () => {
    if (!selectedEvent || !testimonialToDelete) return;

    try {
      await eventService.deleteTestimonial(selectedEvent.id, testimonialToDelete);
      toast({
        title: "Success",
        description: "Testimonial deleted successfully",
      });
      setDeleteTestimonialDialogOpen(false);
      setTestimonialToDelete(null);
      loadEventDetails(selectedEvent.id);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete testimonial",
        variant: "destructive",
      });
    }
  };

  const categoryOptions = [
    { value: "Fundraiser", label: "Fundraiser" },
    { value: "Community", label: "Community" },
    { value: "Education", label: "Education" },
    { value: "Conference", label: "Conference" },
    { value: "Workshop", label: "Workshop" },
    { value: "Other", label: "Other" },
  ];

  const typeOptions = [
    { value: "fundraiser", label: "Fundraiser" },
    { value: "volunteer", label: "Volunteer" },
    { value: "community", label: "Community" },
    { value: "conference", label: "Conference" },
  ];

  const statusOptions = [
    { value: "upcoming", label: "Upcoming" },
    { value: "ongoing", label: "Ongoing" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
  ];

  const iconTypeOptions = [
    { value: "Award", label: "Award" },
    { value: "Users", label: "Users" },
    { value: "TrendingUp", label: "Trending Up" },
    { value: "MapPin", label: "Map Pin" },
    { value: "Heart", label: "Heart" },
    { value: "DollarSign", label: "Dollar Sign" },
  ];

  const roleOptions = [
    { value: "Event Coordinator", label: "Event Coordinator" },
    { value: "Volunteer", label: "Volunteer" },
    { value: "Beneficiary", label: "Beneficiary" },
    { value: "Attendee", label: "Attendee" },
  ];

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Manage Events</h1>
          <p className="text-muted-foreground mt-2">Create and manage organization events</p>
        </div>
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              setEditingEvent(null);
              resetEventForm();
            }
          }}
        >
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingEvent(null);
                resetEventForm();
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Event
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto custom-scrollbar">
            <DialogHeader>
              <DialogTitle>{editingEvent ? "Edit Event" : "Create New Event"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="title">Event Title *</Label>
                <Input
                  id="title"
                  placeholder="Enter event title"
                  value={eventForm.title}
                  onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={eventForm.category}
                    onValueChange={(value) => setEventForm({ ...eventForm, category: value })}
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
                    value={eventForm.status}
                    onValueChange={(value) => setEventForm({ ...eventForm, status: value })}
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

              <div className="grid grid-cols-2 gap-4">
              <div>
                  <Label htmlFor="date">Event Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    value={eventForm.date}
                    onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                  />
              </div>
                <div>
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={eventForm.time}
                    onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  placeholder="Enter event location"
                  value={eventForm.location}
                  onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  placeholder="Enter full address"
                  value={eventForm.address}
                  onChange={(e) => setEventForm({ ...eventForm, address: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="image_url">Event Image</Label>
                <div className="space-y-2">
                  <input
                    type="file"
                    ref={eventImageInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, "event")}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => eventImageInputRef.current?.click()}
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
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => {
                            if (eventImageFile && imagePreview && imagePreview.startsWith("blob:")) {
                              URL.revokeObjectURL(imagePreview);
                            }
                            setImagePreview(null);
                            setEventForm((prev) => ({ ...prev, image_url: "" }));
                            setEventImageFileName("");
                            setEventImageFile(null);
                            if (eventImageInputRef.current) {
                              eventImageInputRef.current.value = "";
                            }
                          }}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      {eventImageFileName && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <span className="font-medium">File:</span>
                          <span className="truncate">{eventImageFileName}</span>
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  rows={3}
                  placeholder="Brief event description..."
                  value={eventForm.description}
                  onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="full_description">Full Description</Label>
                <Textarea
                  id="full_description"
                  rows={4}
                  placeholder="Detailed event description..."
                  value={eventForm.full_description}
                  onChange={(e) => setEventForm({ ...eventForm, full_description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Event Type</Label>
                  <Select
                    value={eventForm.type}
                    onValueChange={(value) => setEventForm({ ...eventForm, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {typeOptions.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="max_participants">Max Participants</Label>
                  <Input
                    id="max_participants"
                    type="number"
                    placeholder="0"
                    value={eventForm.max_participants}
                    onChange={(e) => setEventForm({ ...eventForm, max_participants: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  id="capacity"
                  placeholder="e.g., 200 people"
                  value={eventForm.capacity}
                  onChange={(e) => setEventForm({ ...eventForm, capacity: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="impact">Impact</Label>
                <Textarea
                  id="impact"
                  rows={3}
                  placeholder="Event impact description..."
                  value={eventForm.impact}
                  onChange={(e) => setEventForm({ ...eventForm, impact: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={editingEvent ? handleUpdateEvent : handleCreateEvent}>
                  {editingEvent ? "Update" : "Create"} Event
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Events List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          // Loading skeleton
          Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <Skeleton className="h-5 w-20" />
                <div className="flex gap-1">
                  <Skeleton className="h-9 w-9" />
                  <Skeleton className="h-9 w-9" />
                </div>
              </div>
              <Skeleton className="h-6 w-3/4 mb-3" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </Card>
          ))
        ) : events.length === 0 ? (
          <Card className="p-8 text-center col-span-full">
            <p className="text-muted-foreground">No events yet. Create your first event!</p>
          </Card>
        ) : (
          events.map((event) => (
          <Card key={event.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
                <Badge variant={event.status === "upcoming" ? "default" : "secondary"}>
                {event.status}
              </Badge>
              <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => openEventDetails(event)} title="View Details">
                    <Eye className="w-4 h-4" />
                  </Button>
                <Button variant="ghost" size="sm" onClick={() => handleEdit(event)}>
                  <Edit className="w-4 h-4" />
                </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(event.id)}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </div>

              {event.image_url && (
                <img
                  src={getImageUrl(event.image_url)}
                  alt={event.title}
                  className="w-full h-32 object-cover rounded-md mb-3"
                />
              )}

            <h3 className="text-lg font-bold text-foreground mb-3">{event.title}</h3>
            
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {new Date(event.date).toLocaleDateString()}
                  {event.time && ` at ${event.time}`}
              </div>
              <div className="flex items-center gap-2">
                <span>📍</span>
                {event.location}
              </div>
              <div className="flex items-center gap-2">
                <span>👥</span>
                  {event.registered_count || 0} registered
                  {event.max_participants && ` / ${event.max_participants} max`}
              </div>
                {event.category && (
                  <Badge variant="outline" className="mt-2">
                    {event.category}
                  </Badge>
                )}
            </div>
          </Card>
          ))
        )}
      </div>

      {/* Event Details Dialog */}
      {selectedEvent && (
        <Dialog
          open={!!selectedEvent}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedEvent(null);
              // Reset all event details when closing
              setEventRegistrations([]);
              setEventAgenda([]);
              setEventGallery([]);
              setEventImpactMetrics([]);
              setEventTestimonials([]);
            }
          }}
        >
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto custom-scrollbar">
            <DialogHeader>
              <DialogTitle>{selectedEvent.title}</DialogTitle>
            </DialogHeader>

            <Tabs defaultValue="agenda" className="mt-4">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="agenda">
                  <List className="w-4 h-4 mr-2" />
                  Agenda
                </TabsTrigger>
                <TabsTrigger value="gallery">
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Gallery
                </TabsTrigger>
                <TabsTrigger value="impact">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Impact
                </TabsTrigger>
                <TabsTrigger value="testimonials">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Testimonials
                </TabsTrigger>
                <TabsTrigger value="registrations">
                  <Users className="w-4 h-4 mr-2" />
                  Registrations ({eventRegistrations.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="agenda" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Event Agenda</h3>
                  <Dialog open={isAgendaDialogOpen} onOpenChange={setIsAgendaDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Agenda Item
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Agenda Item</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        <div>
                          <Label htmlFor="agenda_time">Time *</Label>
                          <Input
                            id="agenda_time"
                            placeholder="e.g., 9:00 AM"
                            value={agendaForm.time}
                            onChange={(e) => setAgendaForm({ ...agendaForm, time: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="agenda_activity">Activity *</Label>
                          <Input
                            id="agenda_activity"
                            placeholder="Activity description"
                            value={agendaForm.activity}
                            onChange={(e) => setAgendaForm({ ...agendaForm, activity: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="agenda_order">Display Order</Label>
                          <Input
                            id="agenda_order"
                            type="number"
                            value={agendaForm.display_order}
                            onChange={(e) =>
                              setAgendaForm({ ...agendaForm, display_order: parseInt(e.target.value) || 0 })
                            }
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setIsAgendaDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleAddAgenda}>Add Item</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="space-y-2">
                  {eventAgenda.length === 0 ? (
                    <Card className="p-8 text-center">
                      <p className="text-muted-foreground">No agenda items yet. Add the first item!</p>
                    </Card>
                  ) : (
                    eventAgenda.map((item) => (
                      <Card key={item.id} className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Clock className="w-4 h-4 text-muted-foreground" />
                              <span className="font-semibold text-foreground">{item.time}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">{item.activity}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteAgendaClick(item.id)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="gallery" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Event Gallery</h3>
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
                                      if (
                                        galleryImageFile &&
                                        galleryImagePreview &&
                                        galleryImagePreview.startsWith("blob:")
                                      ) {
                                        URL.revokeObjectURL(galleryImagePreview);
                                      }
                                      setGalleryImagePreview(null);
                                      setGalleryForm((prev) => ({ ...prev, image_url: "" }));
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
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="gallery_caption">Caption</Label>
                          <Input
                            id="gallery_caption"
                            placeholder="Image caption"
                            value={galleryForm.caption}
                            onChange={(e) => setGalleryForm({ ...galleryForm, caption: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="gallery_order">Display Order</Label>
                          <Input
                            id="gallery_order"
                            type="number"
                            value={galleryForm.display_order}
                            onChange={(e) =>
                              setGalleryForm({ ...galleryForm, display_order: parseInt(e.target.value) || 0 })
                            }
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setIsGalleryDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleAddGalleryImage}>Add Image</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {eventGallery.length === 0 ? (
                    <Card className="col-span-full p-8 text-center">
                      <p className="text-muted-foreground">No gallery images yet. Add the first image!</p>
                    </Card>
                  ) : (
                    eventGallery.map((item) => (
                      <div key={item.id} className="relative group">
                        <img
                          src={getImageUrl(item.image_url)}
                          alt={item.caption || "Event Gallery Image"}
                          className="w-full h-32 object-cover rounded-md border"
                        />
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleDeleteGalleryImageClick(item.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        {item.caption && (
                          <p className="text-xs text-muted-foreground mt-1 truncate">{item.caption}</p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="impact" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Impact Metrics</h3>
                  <Dialog open={isImpactMetricDialogOpen} onOpenChange={setIsImpactMetricDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Metric
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Impact Metric</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        <div>
                          <Label htmlFor="metric_label">Label *</Label>
                          <Input
                            id="metric_label"
                            placeholder="e.g., Participants"
                            value={impactMetricForm.label}
                            onChange={(e) => setImpactMetricForm({ ...impactMetricForm, label: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="metric_value">Value *</Label>
                          <Input
                            id="metric_value"
                            placeholder="e.g., 500"
                            value={impactMetricForm.value}
                            onChange={(e) => setImpactMetricForm({ ...impactMetricForm, value: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="metric_icon">Icon Type</Label>
                          <Select
                            value={impactMetricForm.icon_type}
                            onValueChange={(value) => setImpactMetricForm({ ...impactMetricForm, icon_type: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select icon" />
                            </SelectTrigger>
                            <SelectContent>
                              {iconTypeOptions.map((icon) => (
                                <SelectItem key={icon.value} value={icon.value}>
                                  {icon.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
      </div>
                        <div>
                          <Label htmlFor="metric_order">Display Order</Label>
                          <Input
                            id="metric_order"
                            type="number"
                            value={impactMetricForm.display_order}
                            onChange={(e) =>
                              setImpactMetricForm({
                                ...impactMetricForm,
                                display_order: parseInt(e.target.value) || 0,
                              })
                            }
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setIsImpactMetricDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleAddImpactMetric}>Add Metric</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {eventImpactMetrics.length === 0 ? (
                    <Card className="col-span-full p-8 text-center">
                      <p className="text-muted-foreground">No impact metrics yet. Add the first metric!</p>
                    </Card>
                  ) : (
                    eventImpactMetrics.map((metric) => (
                      <Card key={metric.id} className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-foreground">{metric.label}</p>
                            <p className="text-lg font-bold text-primary mt-1">{metric.value}</p>
                            {metric.icon_type && (
                              <Badge variant="outline" className="mt-2">
                                {metric.icon_type}
                              </Badge>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteImpactMetricClick(metric.id)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="testimonials" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Testimonials</h3>
                  <Dialog open={isTestimonialDialogOpen} onOpenChange={setIsTestimonialDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Testimonial
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Testimonial</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        <div>
                          <Label htmlFor="testimonial_name">Name *</Label>
                          <Input
                            id="testimonial_name"
                            placeholder="Person's name"
                            value={testimonialForm.name}
                            onChange={(e) => setTestimonialForm({ ...testimonialForm, name: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="testimonial_role">Role</Label>
                          <Select
                            value={testimonialForm.role}
                            onValueChange={(value) => setTestimonialForm({ ...testimonialForm, role: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              {roleOptions.map((role) => (
                                <SelectItem key={role.value} value={role.value}>
                                  {role.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="testimonial_quote">Quote *</Label>
                          <Textarea
                            id="testimonial_quote"
                            rows={4}
                            placeholder="Testimonial quote..."
                            value={testimonialForm.quote}
                            onChange={(e) => setTestimonialForm({ ...testimonialForm, quote: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="testimonial_order">Display Order</Label>
                          <Input
                            id="testimonial_order"
                            type="number"
                            value={testimonialForm.display_order}
                            onChange={(e) =>
                              setTestimonialForm({
                                ...testimonialForm,
                                display_order: parseInt(e.target.value) || 0,
                              })
                            }
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setIsTestimonialDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleAddTestimonial}>Add Testimonial</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="space-y-4">
                  {eventTestimonials.length === 0 ? (
                    <Card className="p-8 text-center">
                      <p className="text-muted-foreground">No testimonials yet. Add the first testimonial!</p>
                    </Card>
                  ) : (
                    eventTestimonials.map((testimonial) => (
                      <Card key={testimonial.id} className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <p className="font-semibold text-foreground">{testimonial.name}</p>
                              {testimonial.role && (
                                <Badge variant="outline" className="text-xs">
                                  {testimonial.role}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground italic">"{testimonial.quote}"</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteTestimonialClick(testimonial.id)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="registrations" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">
                    Event Registrations ({eventRegistrations.length})
                  </h3>
                </div>

                <div className="space-y-4">
                  {eventRegistrations.length === 0 ? (
                    <Card className="p-8 text-center">
                      <p className="text-muted-foreground">No registrations yet.</p>
                    </Card>
                  ) : (
                    <div className="space-y-3">
                      {eventRegistrations.map((registration) => (
                        <Card key={registration.id} className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="font-semibold text-foreground text-lg">
                                  {registration.participant_name}
                                </p>
                                <Badge
                                  variant={
                                    registration.status === "confirmed"
                                      ? "default"
                                      : registration.status === "cancelled"
                                      ? "destructive"
                                      : registration.status === "attended"
                                      ? "secondary"
                                      : "outline"
                                  }
                                >
                                  {registration.status}
                                </Badge>
                              </div>
                              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                  <Mail className="w-4 h-4" />
                                  {registration.participant_email}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Phone className="w-4 h-4" />
                                  {registration.participant_phone}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Users className="w-4 h-4" />
                                  {registration.number_of_guests} guest
                                  {registration.number_of_guests > 1 ? "s" : ""}
                                </div>
                                {registration.created_at && (
                                  <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    {new Date(registration.created_at).toLocaleDateString()}
                                  </div>
                                )}
                              </div>
                              {registration.special_requirements && (
                                <div className="mt-2">
                                  <p className="text-xs text-muted-foreground font-medium mb-1">
                                    Special Requirements:
                                  </p>
                                  <p className="text-sm text-foreground">{registration.special_requirements}</p>
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <Select
                                value={registration.status}
                                onValueChange={async (newStatus) => {
                                  if (!selectedEvent) return;
                                  try {
                                    await eventService.updateRegistrationStatus(
                                      selectedEvent.id,
                                      registration.id,
                                      newStatus as "pending" | "confirmed" | "cancelled" | "attended"
                                    );
                                    toast({
                                      title: "Success",
                                      description: "Registration status updated successfully",
                                    });
                                    // Reload event details to get updated registrations
                                    loadEventDetails(selectedEvent.id);
                                  } catch (error: any) {
                                    toast({
                                      title: "Error",
                                      description: error.message || "Failed to update registration status",
                                      variant: "destructive",
                                    });
                                  }
                                }}
                              >
                                <SelectTrigger className="w-[140px]">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="confirmed">Confirmed</SelectItem>
                                  <SelectItem value="cancelled">Cancelled</SelectItem>
                                  <SelectItem value="attended">Attended</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Event Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Event</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this event? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setEventToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Agenda Item Confirmation Dialog */}
      <AlertDialog open={deleteAgendaDialogOpen} onOpenChange={setDeleteAgendaDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Agenda Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this agenda item? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setAgendaToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAgenda}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
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
            <AlertDialogAction
              onClick={handleDeleteGalleryImage}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Impact Metric Confirmation Dialog */}
      <AlertDialog open={deleteImpactMetricDialogOpen} onOpenChange={setDeleteImpactMetricDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Impact Metric</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this impact metric? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setImpactMetricToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteImpactMetric}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Testimonial Confirmation Dialog */}
      <AlertDialog open={deleteTestimonialDialogOpen} onOpenChange={setDeleteTestimonialDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Testimonial</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this testimonial? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setTestimonialToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteTestimonial}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ManageEvents;


