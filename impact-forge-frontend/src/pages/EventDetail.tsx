import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Calendar, Clock, Users, Mail, Phone, User, Award, TrendingUp, Camera, Quote, CheckCircle2, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { eventService, Event } from "@/services/event.service";
import { getImageUrl } from "@/utils/imageUrl";

const iconMap: Record<string, typeof Award> = {
  award: Award,
  users: Users,
  trending: TrendingUp,
  check: CheckCircle2,
  map: MapPin,
};

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    participant_name: "",
    participant_email: "",
    participant_phone: "",
    number_of_guests: 1,
    special_requirements: "",
  });

  useEffect(() => {
    if (id) {
      loadEvent();
    }
  }, [id]);

  const loadEvent = async () => {
    try {
      setIsLoading(true);
      const response = await eventService.getEventById(id!);
      setEvent(response.data);
    } catch (error: any) {
      console.error("Failed to load event:", error);
      if (error.response?.status === 404) {
        // Event not found
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id) return;

    try {
      setIsSubmitting(true);
      await eventService.registerForEvent(id, {
        participant_name: formData.participant_name,
        participant_email: formData.participant_email,
        participant_phone: formData.participant_phone,
        number_of_guests: formData.number_of_guests,
        special_requirements: formData.special_requirements || undefined,
      });

      toast({
        title: "Registration Successful!",
        description: "We've sent a confirmation email to your address.",
      });

      setFormData({
        participant_name: "",
        participant_email: "",
        participant_phone: "",
        number_of_guests: 1,
        special_requirements: "",
      });

      // Reload event to update registration count
      loadEvent();
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to register. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string, timeString?: string) => {
    if (timeString) return timeString;
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const handleShare = async () => {
    const url = window.location.href;
    const title = event?.title || "Event";
    const text = event?.description || "Check out this event";

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url,
        });
        toast({
          title: "Shared!",
          description: "Event shared successfully.",
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
          description: "Event link has been copied to clipboard.",
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
        <Skeleton className="h-[50vh] w-full mb-12" />
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
              <Skeleton className="h-8 w-3/4 mb-6" />
              <Skeleton className="h-10 w-full mb-4" />
              <Skeleton className="h-10 w-full mb-4" />
              <Skeleton className="h-10 w-full mb-4" />
              <Skeleton className="h-24 w-full mb-4" />
              <Skeleton className="h-12 w-full" />
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Event Not Found</h1>
          <p className="text-muted-foreground mb-6">The event you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/events">Back to Events</Link>
          </Button>
        </div>
      </div>
    );
  }

  const isPastEvent = event.status === "completed" || new Date(event.date) < new Date();
  const imageUrl = event.image_url ? getImageUrl(event.image_url) : undefined;
  const registrationPercentage = event.max_participants
    ? (event.registered_count / event.max_participants) * 100
    : 0;
  const isFull = event.max_participants && event.registered_count >= event.max_participants;

  return (
    <div className="min-h-screen pt-16">
      {/* Back Button */}
      <div className="container mx-auto px-4 py-6">
        <Button variant="ghost" asChild>
          <Link to="/events">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Events
          </Link>
        </Button>
      </div>

      {/* Hero Section */}
      <section className="relative h-[50vh] overflow-hidden">
        {imageUrl ? (
          <img src={imageUrl} alt={event.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 container mx-auto px-4 pb-12 z-10">
          <div className="flex items-center gap-3 mb-4">
            <Badge variant={isPastEvent ? "outline" : "default"} className="px-4 py-2">
              {event.category}
            </Badge>
            {isPastEvent && event.impact && (
              <Badge variant="secondary" className="px-4 py-2">
                {event.impact}
              </Badge>
            )}
          </div>
          <h1 className="text-foreground mb-4">{event.title}</h1>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          {isPastEvent ? (
            // Past Event Layout
            <div className="space-y-8">
              {/* Event Info */}
              <Card className="p-6">
                <h2 className="text-2xl font-bold text-foreground mb-6">Event Summary</h2>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <p className="text-sm text-muted-foreground">Date</p>
                      <p className="font-medium text-foreground">{formatDate(event.date)}</p>
                    </div>
                  </div>
                  {event.time && (
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-primary mt-1" />
                      <div>
                        <p className="text-sm text-muted-foreground">Time</p>
                        <p className="font-medium text-foreground">{event.time}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="font-medium text-foreground">{event.location}</p>
                      {event.address && (
                        <p className="text-sm text-muted-foreground">{event.address}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <p className="text-sm text-muted-foreground">Attendees</p>
                      <p className="font-medium text-foreground">
                        {event.attendees || event.registered_count || 0} people
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-border">
                  <h3 className="text-xl font-bold text-foreground mb-4">About This Event</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {event.full_description || event.description}
                  </p>
                </div>
              </Card>

              {/* Impact Metrics */}
              {event.impactMetrics && event.impactMetrics.length > 0 && (
                <Card className="p-6">
                  <h2 className="text-2xl font-bold text-foreground mb-6">Impact & Results</h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {event.impactMetrics.map((metric) => {
                      const Icon = metric.icon_type ? iconMap[metric.icon_type.toLowerCase()] || Award : Award;
                      return (
                        <div key={metric.id} className="text-center p-4 bg-muted/30 rounded-lg">
                          <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Icon className="w-6 h-6 text-primary" />
                          </div>
                          <div className="text-2xl font-bold text-foreground mb-1">{metric.value}</div>
                          <div className="text-sm text-muted-foreground">{metric.label}</div>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              )}

              {/* Gallery */}
              {event.gallery && event.gallery.length > 0 && (
                <Card className="p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <Camera className="w-6 h-6 text-primary" />
                    <h2 className="text-2xl font-bold text-foreground">Event Gallery</h2>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    {event.gallery.map((item) => {
                      const galleryImageUrl = getImageUrl(item.image_url);
                      return (
                        <div key={item.id} className="relative group">
                          <div className="aspect-video overflow-hidden rounded-lg">
                            <img
                              src={galleryImageUrl}
                              alt={item.caption || `Event photo`}
                              className="w-full h-full object-cover transition-transform group-hover:scale-105"
                            />
                          </div>
                          {item.caption && (
                            <p className="text-sm text-muted-foreground mt-2 text-center">{item.caption}</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </Card>
              )}

              {/* Testimonials */}
              {event.testimonials && event.testimonials.length > 0 && (
                <Card className="p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <Quote className="w-6 h-6 text-primary" />
                    <h2 className="text-2xl font-bold text-foreground">What People Said</h2>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    {event.testimonials.map((testimonial) => (
                      <div key={testimonial.id} className="p-6 bg-muted/30 rounded-lg">
                        <Quote className="w-8 h-8 text-primary mb-4 opacity-50" />
                        <p className="text-muted-foreground leading-relaxed mb-4 italic">
                          "{testimonial.quote}"
                        </p>
                        <div className="pt-4 border-t border-border">
                          <p className="font-semibold text-foreground">{testimonial.name}</p>
                          {testimonial.role && (
                            <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Share Button for Past Events */}
              <Card className="p-6">
                <Button variant="outline" size="lg" className="w-full" onClick={handleShare}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Event
                </Button>
              </Card>
            </div>
          ) : (
            // Upcoming Event Layout
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-8">
                {/* Event Info */}
                <Card className="p-6">
                  <h2 className="text-2xl font-bold text-foreground mb-6">Event Details</h2>

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-primary mt-1" />
                      <div>
                        <p className="text-sm text-muted-foreground">Date</p>
                        <p className="font-medium text-foreground">{formatDate(event.date)}</p>
                      </div>
                    </div>
                    {event.time && (
                      <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-primary mt-1" />
                        <div>
                          <p className="text-sm text-muted-foreground">Time</p>
                          <p className="font-medium text-foreground">{event.time}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-primary mt-1" />
                      <div>
                        <p className="text-sm text-muted-foreground">Location</p>
                        <p className="font-medium text-foreground">{event.location}</p>
                        {event.address && (
                          <p className="text-sm text-muted-foreground">{event.address}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-primary mt-1" />
                      <div>
                        <p className="text-sm text-muted-foreground">Capacity</p>
                        <p className="font-medium text-foreground">
                          {event.max_participants ? `${event.max_participants} attendees` : "Unlimited"}
                        </p>
                        {event.max_participants && (
                          <p className="text-sm text-muted-foreground">
                            {event.registered_count || 0} registered ({Math.round(registrationPercentage)}% full)
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-border">
                    <h3 className="text-xl font-bold text-foreground mb-4">About This Event</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {event.full_description || event.description}
                    </p>
                  </div>
                </Card>

                {/* Agenda */}
                {event.agenda && event.agenda.length > 0 && (
                  <Card className="p-6">
                    <h2 className="text-2xl font-bold text-foreground mb-6">Event Agenda</h2>
                    <div className="space-y-4">
                      {event.agenda.map((item) => (
                        <div key={item.id} className="flex gap-4 pb-4 border-b border-border last:border-0">
                          <div className="flex-shrink-0 w-24">
                            <span className="text-sm font-medium text-primary">{item.time}</span>
                          </div>
                          <div className="flex-1">
                            <p className="text-foreground">{item.activity}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
              </div>

              {/* Right Column - Registration Form */}
              <div>
                <Card className="p-6 sticky top-20">
                  <h3 className="text-xl font-bold text-foreground mb-6">Register for Event</h3>

                  <Button variant="outline" size="lg" className="w-full mb-6" onClick={handleShare}>
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Event
                  </Button>

                  {isFull ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">This event is full.</p>
                      <p className="text-sm text-muted-foreground">
                        Please check back later or contact us for waitlist options.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="name"
                            placeholder="John Doe"
                            value={formData.participant_name}
                            onChange={(e) => setFormData({ ...formData, participant_name: e.target.value })}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="john@example.com"
                            value={formData.participant_email}
                            onChange={(e) => setFormData({ ...formData, participant_email: e.target.value })}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="+1 (555) 123-4567"
                            value={formData.participant_phone}
                            onChange={(e) => setFormData({ ...formData, participant_phone: e.target.value })}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="guests">Number of Guests</Label>
                        <Input
                          id="guests"
                          type="number"
                          min="1"
                          max="5"
                          value={formData.number_of_guests}
                          onChange={(e) => setFormData({ ...formData, number_of_guests: parseInt(e.target.value) || 1 })}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="message">Special Requirements (Optional)</Label>
                        <Textarea
                          id="message"
                          placeholder="Dietary restrictions, accessibility needs, etc."
                          value={formData.special_requirements}
                          onChange={(e) => setFormData({ ...formData, special_requirements: e.target.value })}
                          rows={3}
                        />
                      </div>

                      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? "Registering..." : "Register Now"}
                      </Button>

                      <p className="text-xs text-muted-foreground text-center">
                        You'll receive a confirmation email after registration
                      </p>
                    </form>
                  )}
                </Card>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default EventDetail;
