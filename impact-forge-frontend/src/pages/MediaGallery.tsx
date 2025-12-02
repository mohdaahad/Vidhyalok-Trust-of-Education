import { useState } from "react";
import { Camera, Video, Heart, Users, Globe, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const photoCategories = [
    { id: "all", label: "All Photos", icon: Camera },
    { id: "projects", label: "Projects", icon: Heart },
    { id: "events", label: "Events", icon: Users },
    { id: "community", label: "Community", icon: Globe },
    { id: "awards", label: "Awards", icon: Award },
];

const photos = [
    {
        id: 1,
        src: "/api/placeholder/400/300",
        alt: "Education project in Kenya",
        category: "projects",
        title: "New School Opening",
        description: "Students celebrating the opening of our new school in rural Kenya",
        date: "March 2024",
        location: "Kenya"
    },
    {
        id: 2,
        src: "/api/placeholder/400/300",
        alt: "Health camp volunteers",
        category: "events",
        title: "Community Health Fair",
        description: "Volunteers providing free health screenings to community members",
        date: "April 2024",
        location: "Central Community Center"
    },
    {
        id: 3,
        src: "/api/placeholder/400/300",
        alt: "Clean water well",
        category: "projects",
        title: "Water Well Installation",
        description: "Community members celebrating access to clean drinking water",
        date: "February 2024",
        location: "Tanzania"
    },
    {
        id: 4,
        src: "/api/placeholder/400/300",
        alt: "Volunteer recognition",
        category: "awards",
        title: "Volunteer Recognition Ceremony",
        description: "Honoring outstanding volunteers for their dedication and service",
        date: "December 2024",
        location: "Headquarters"
    },
    {
        id: 5,
        src: "/api/placeholder/400/300",
        alt: "Community gathering",
        category: "community",
        title: "Community Meeting",
        description: "Local leaders discussing project priorities and community needs",
        date: "January 2024",
        location: "Rural Village"
    },
    {
        id: 6,
        src: "/api/placeholder/400/300",
        alt: "Fundraising gala",
        category: "events",
        title: "Annual Charity Gala",
        description: "Elegant evening of dining and fundraising for our programs",
        date: "March 2024",
        location: "Grand Hotel Ballroom"
    }
];

const videos = [
    {
        id: 1,
        title: "Our Impact in 2024",
        description: "A comprehensive look at the lives we've touched and communities we've transformed",
        duration: "3:45",
        thumbnail: "/api/placeholder/400/225",
        category: "impact"
    },
    {
        id: 2,
        title: "Education for All - Project Documentary",
        description: "Follow the journey of students benefiting from our education programs",
        duration: "8:20",
        thumbnail: "/api/placeholder/400/225",
        category: "projects"
    },
    {
        id: 3,
        title: "Volunteer Stories",
        description: "Hear from our volunteers about their experiences and the impact they're making",
        duration: "5:15",
        thumbnail: "/api/placeholder/400/225",
        category: "volunteers"
    },
    {
        id: 4,
        title: "Clean Water Initiative",
        description: "See how we're bringing clean water to communities around the world",
        duration: "4:30",
        thumbnail: "/api/placeholder/400/225",
        category: "projects"
    }
];

const MediaGallery = () => {
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedPhoto, setSelectedPhoto] = useState<any>(null);

    const filteredPhotos = selectedCategory === "all"
        ? photos
        : photos.filter(photo => photo.category === selectedCategory);

    return (
        <div className="min-h-screen pt-16">
            {/* Hero Section */}
            <section className="py-20 gradient-hero">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center animate-fade-in">
                        <Camera className="w-16 h-16 text-primary-foreground mx-auto mb-6" />
                        <h1 className="text-primary-foreground mb-6">Photo & Video Gallery</h1>
                        <p className="text-xl text-primary-foreground/90 leading-relaxed">
                            See the impact of your support through photos and videos from our projects,
                            events, and community celebrations around the world.
                        </p>
                    </div>
                </div>
            </section>

            {/* Gallery Section */}
            <section className="py-20 bg-background">
                <div className="container mx-auto px-4">
                    <Tabs defaultValue="photos" className="w-full">
                        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12">
                            <TabsTrigger value="photos">Photos</TabsTrigger>
                            <TabsTrigger value="videos">Videos</TabsTrigger>
                        </TabsList>

                        <TabsContent value="photos" className="mt-0">
                            {/* Category Filter */}
                            <div className="flex flex-wrap justify-center gap-4 mb-12">
                                {photoCategories.map((category) => {
                                    const Icon = category.icon;
                                    return (
                                        <Button
                                            key={category.id}
                                            variant={selectedCategory === category.id ? "default" : "outline"}
                                            onClick={() => setSelectedCategory(category.id)}
                                            className="flex items-center gap-2"
                                        >
                                            <Icon className="w-4 h-4" />
                                            {category.label}
                                        </Button>
                                    );
                                })}
                            </div>

                            {/* Photo Grid */}
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {filteredPhotos.map((photo, index) => (
                                    <Card
                                        key={photo.id}
                                        className="overflow-hidden transition-smooth hover:shadow-lg hover:-translate-y-2 animate-fade-in-up"
                                        style={{ animationDelay: `${index * 0.1}s` }}
                                    >
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <div className="cursor-pointer">
                                                    <div className="aspect-video bg-muted relative overflow-hidden">
                                                        <img
                                                            src={photo.src}
                                                            alt={photo.alt}
                                                            className="w-full h-full object-cover transition-transform hover:scale-105"
                                                        />
                                                        <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                                                            <Camera className="w-8 h-8 text-white" />
                                                        </div>
                                                    </div>
                                                    <div className="p-6">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <Badge variant="secondary">{photo.category}</Badge>
                                                            <span className="text-sm text-muted-foreground">{photo.date}</span>
                                                        </div>
                                                        <h3 className="text-lg font-bold text-foreground mb-2">{photo.title}</h3>
                                                        <p className="text-muted-foreground text-sm mb-3">{photo.description}</p>
                                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                            <Globe className="w-4 h-4" />
                                                            <span>{photo.location}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-4xl">
                                                <div className="space-y-4">
                                                    <img
                                                        src={photo.src}
                                                        alt={photo.alt}
                                                        className="w-full h-auto rounded-lg"
                                                    />
                                                    <div>
                                                        <h3 className="text-2xl font-bold text-foreground mb-2">{photo.title}</h3>
                                                        <p className="text-muted-foreground mb-4">{photo.description}</p>
                                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                            <span>{photo.date}</span>
                                                            <span>•</span>
                                                            <span>{photo.location}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="videos" className="mt-0">
                            <div className="grid md:grid-cols-2 gap-8">
                                {videos.map((video, index) => (
                                    <Card
                                        key={video.id}
                                        className="overflow-hidden transition-smooth hover:shadow-lg hover:-translate-y-2 animate-fade-in-up"
                                        style={{ animationDelay: `${index * 0.1}s` }}
                                    >
                                        <div className="aspect-video bg-muted relative overflow-hidden">
                                            <img
                                                src={video.thumbnail}
                                                alt={video.title}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                                <Button size="lg" variant="secondary" className="rounded-full">
                                                    <Video className="w-6 h-6 mr-2" />
                                                    Play Video
                                                </Button>
                                            </div>
                                            <div className="absolute bottom-4 right-4 bg-black/70 text-white px-2 py-1 rounded text-sm">
                                                {video.duration}
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <div className="flex items-center justify-between mb-2">
                                                <Badge variant="outline">{video.category}</Badge>
                                                <span className="text-sm text-muted-foreground">{video.duration}</span>
                                            </div>
                                            <h3 className="text-lg font-bold text-foreground mb-2">{video.title}</h3>
                                            <p className="text-muted-foreground text-sm">{video.description}</p>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </section>

            {/* Impact Stories Section */}
            <section className="py-20 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-2xl font-bold text-foreground mb-6">Behind Every Photo, A Story</h2>
                        <p className="text-lg text-muted-foreground mb-8">
                            Each image in our gallery represents real people, real communities, and real change.
                            These photos capture moments of hope, joy, and transformation made possible by your support.
                        </p>
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="text-center">
                                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Heart className="w-8 h-8 text-primary" />
                                </div>
                                <h3 className="text-lg font-bold text-foreground mb-2">Real Impact</h3>
                                <p className="text-muted-foreground text-sm">
                                    Every photo shows the tangible difference your donations make in people's lives
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="bg-secondary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Users className="w-8 h-8 text-secondary" />
                                </div>
                                <h3 className="text-lg font-bold text-foreground mb-2">Community Stories</h3>
                                <p className="text-muted-foreground text-sm">
                                    Meet the people and communities whose lives have been transformed
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Globe className="w-8 h-8 text-accent" />
                                </div>
                                <h3 className="text-lg font-bold text-foreground mb-2">Global Reach</h3>
                                <p className="text-muted-foreground text-sm">
                                    See our work across different countries and cultures worldwide
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 gradient-trust">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-primary-foreground mb-6">Share Your Story</h2>
                        <p className="text-xl text-primary-foreground/90 mb-8 leading-relaxed">
                            Have photos or videos from our events or projects? We'd love to see them!
                            Share your experiences and help us tell our story.
                        </p>
                        <Button variant="hero" size="lg" asChild>
                            <a href="/contact">Share Your Media</a>
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default MediaGallery;


