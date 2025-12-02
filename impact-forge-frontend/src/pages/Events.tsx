import { useState, useEffect } from "react";
import { Calendar, MapPin, Users, Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { eventService, Event } from "@/services/event.service";
import { getImageUrl } from "@/utils/imageUrl";

const Events = () => {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setIsLoading(true);
      const response = await eventService.getEvents();
      const allEvents = response.data || [];

      // Separate upcoming and past events
      const now = new Date();
      const upcoming = allEvents.filter((event) => {
        const eventDate = new Date(event.date);
        return eventDate >= now && event.status === "upcoming";
      });
      const past = allEvents.filter((event) => {
        const eventDate = new Date(event.date);
        return eventDate < now || event.status === "completed";
      });

      setUpcomingEvents(upcoming);
      setPastEvents(past);
    } catch (error) {
      console.error("Failed to load events:", error);
      setUpcomingEvents([]);
      setPastEvents([]);
    } finally {
      setIsLoading(false);
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

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="py-20 gradient-hero">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <Calendar className="w-16 h-16 text-primary-foreground mx-auto mb-6" />
            <h1 className="text-primary-foreground mb-6">Events & Activities</h1>
            <p className="text-xl text-primary-foreground/90 leading-relaxed">
              Join us at our upcoming events or learn about the impact we've made together.
              Every event is an opportunity to connect and create change.
            </p>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12">
              <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
              <TabsTrigger value="past">Past Events</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="mt-0">
              {isLoading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="overflow-hidden">
                      <Skeleton className="h-48 w-full" />
                      <div className="p-6">
                        <Skeleton className="h-6 w-3/4 mb-3" />
                        <Skeleton className="h-4 w-full mb-4" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                    </Card>
                  ))}
                </div>
              ) : upcomingEvents.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No upcoming events at the moment.</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {upcomingEvents.map((event, index) => {
                    const imageUrl = event.image_url ? getImageUrl(event.image_url) : undefined;
                    const isLimited = event.max_participants && event.registered_count >= event.max_participants * 0.9;

                    return (
                      <Card
                        key={event.id}
                        className="overflow-hidden transition-smooth hover:shadow-lg hover:-translate-y-2 animate-fade-in-up"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        {imageUrl && (
                          <div className="relative h-48 overflow-hidden">
                            <img
                              src={imageUrl}
                              alt={event.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <Badge variant="secondary">{event.category}</Badge>
                            <Badge variant={isLimited ? "destructive" : "default"}>
                              {isLimited ? "Limited Spots" : "Open Registration"}
                            </Badge>
                          </div>

                          <h3 className="text-xl font-bold text-foreground mb-3">{event.title}</h3>
                          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{event.description}</p>

                          <div className="space-y-2 mb-6">
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="w-4 h-4 text-primary" />
                              <span className="text-muted-foreground">{formatDate(event.date)}</span>
                            </div>
                            {event.time && (
                              <div className="flex items-center gap-2 text-sm">
                                <Clock className="w-4 h-4 text-primary" />
                                <span className="text-muted-foreground">{event.time}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-2 text-sm">
                              <MapPin className="w-4 h-4 text-primary" />
                              <span className="text-muted-foreground">{event.location}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Users className="w-4 h-4 text-primary" />
                              <span className="text-muted-foreground">
                                {event.registered_count || 0} registered
                                {event.max_participants && ` / ${event.max_participants} max`}
                              </span>
                            </div>
                          </div>

                          <Button variant="default" className="w-full group" asChild>
                            <Link to={`/events/${event.id}`}>
                              Register Now
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

            <TabsContent value="past" className="mt-0">
              {isLoading ? (
                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                  {[1, 2].map((i) => (
                    <Card key={i} className="p-6">
                      <Skeleton className="h-6 w-3/4 mb-3" />
                      <Skeleton className="h-4 w-full mb-4" />
                      <Skeleton className="h-10 w-full" />
                    </Card>
                  ))}
                </div>
              ) : pastEvents.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No past events available.</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                  {pastEvents.map((event, index) => {
                    const imageUrl = event.image_url ? getImageUrl(event.image_url) : undefined;

                    return (
                      <Card
                        key={event.id}
                        className="p-6 transition-smooth hover:shadow-lg animate-fade-in-up"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        {imageUrl && (
                          <div className="relative h-48 overflow-hidden rounded-lg mb-4">
                            <img
                              src={imageUrl}
                              alt={event.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex items-start justify-between mb-4">
                          <Badge variant="outline">{event.category}</Badge>
                          {event.impact && (
                            <div className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-sm font-medium">
                              {event.impact}
                            </div>
                          )}
                        </div>

                        <h3 className="text-xl font-bold text-foreground mb-3">{event.title}</h3>
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{event.description}</p>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span className="text-muted-foreground">{formatDate(event.date)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <span className="text-muted-foreground">{event.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Users className="w-4 h-4 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              {event.attendees || event.registered_count || 0} attendees
                            </span>
                          </div>
                        </div>

                        <Button variant="outline" className="w-full" asChild>
                          <Link to={`/events/${event.id}`}>View Event Details</Link>
                        </Button>
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
      <section className="py-20 gradient-trust">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-primary-foreground mb-6">Want to Host an Event?</h2>
            <p className="text-xl text-primary-foreground/90 mb-8 leading-relaxed">
              Partner with us to organize fundraising events, community activities, or awareness campaigns.
              Let's work together to amplify our impact.
            </p>
            <Button variant="hero" size="lg" asChild>
              <Link to="/contact">Get in Touch</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Events;
