import { useState } from "react";
import { Users, Heart, Globe, Award, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { volunteerService, RegisterVolunteerData } from "@/services/volunteer.service";

const benefits = [
  {
    icon: Heart,
    title: "Make an Impact",
    description: "Directly contribute to meaningful projects that change lives",
  },
  {
    icon: Users,
    title: "Build Community",
    description: "Connect with like-minded people passionate about making a difference",
  },
  {
    icon: Award,
    title: "Gain Experience",
    description: "Develop new skills and enhance your resume with volunteer work",
  },
  {
    icon: Globe,
    title: "Global Network",
    description: "Join a worldwide community of changemakers",
  },
];

const opportunities = [
  {
    title: "Field Volunteer",
    description: "Work directly with communities on various projects",
    commitment: "Flexible hours",
  },
  {
    title: "Remote Support",
    description: "Provide administrative, design, or technical assistance",
    commitment: "5-10 hours/week",
  },
  {
    title: "Event Coordinator",
    description: "Help organize fundraising events and community activities",
    commitment: "Project-based",
  },
  {
    title: "Mentor",
    description: "Guide youth and provide educational support",
    commitment: "2-4 hours/week",
  },
];

const Volunteer = () => {
  const [formData, setFormData] = useState<RegisterVolunteerData>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    interests: [],
    availability: "flexible",
    experience: "",
    motivation: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.motivation.trim()) {
      toast({
        title: "Error",
        description: "Please tell us why you want to volunteer with us.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await volunteerService.register(formData);
      toast({
        title: "Application Submitted! 🎉",
        description: "Thank you for your interest! We'll contact you within 5 business days.",
      });
      // Reset form
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        country: "",
        interests: [],
        availability: "flexible",
        experience: "",
        motivation: "",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleInterest = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests?.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...(prev.interests || []), interest],
    }));
  };

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="py-20 gradient-trust">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <Users className="w-16 h-16 text-primary-foreground mx-auto mb-6" />
            <h1 className="text-primary-foreground mb-6">Become a Volunteer</h1>
            <p className="text-xl text-primary-foreground/90 leading-relaxed">
              Join our community of passionate volunteers making a real difference. Your time,
              skills, and dedication can transform lives.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-foreground mb-12 text-center">Why Volunteer With Us?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card
                  key={index}
                  className="p-6 text-center transition-smooth hover:shadow-lg hover:-translate-y-2 animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground text-sm">{benefit.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Opportunities Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-foreground mb-12 text-center">Volunteer Opportunities</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
            {opportunities.map((opp, index) => (
              <Card
                key={index}
                className="p-6 transition-smooth hover:shadow-lg animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-secondary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-2">{opp.title}</h3>
                    <p className="text-muted-foreground text-sm mb-3">{opp.description}</p>
                    <div className="text-xs text-primary font-medium">
                      Commitment: {opp.commitment}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">Volunteer Application</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Personal Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        required
                        value={formData.first_name}
                        onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        required
                        value={formData.last_name}
                        onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        required
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="country">Country *</Label>
                      <Input
                        id="country"
                        required
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Volunteer Preferences */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Volunteer Preferences</h3>
                  
                  <div>
                    <Label className="mb-3 block">Areas of Interest *</Label>
                    <div className="grid md:grid-cols-2 gap-3">
                      {["Education", "Healthcare", "Environment", "Community Development", "Event Support", "Remote Work"].map((interest) => (
                        <div key={interest} className="flex items-center space-x-2">
                          <Checkbox
                            id={interest}
                            checked={formData.interests?.includes(interest) || false}
                            onCheckedChange={() => toggleInterest(interest)}
                          />
                          <Label htmlFor={interest} className="cursor-pointer font-normal">
                            {interest}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="availability">Availability *</Label>
                    <Select
                      value={formData.availability}
                      onValueChange={(value: "weekdays" | "weekends" | "flexible" | "remote") =>
                        setFormData({ ...formData, availability: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your availability" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekdays">Weekdays</SelectItem>
                        <SelectItem value="weekends">Weekends</SelectItem>
                        <SelectItem value="flexible">Flexible</SelectItem>
                        <SelectItem value="remote">Remote Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="experience">Relevant Experience</Label>
                    <Textarea
                      id="experience"
                      rows={4}
                      placeholder="Tell us about any relevant volunteer or professional experience..."
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="motivation">Why do you want to volunteer with us? *</Label>
                    <Textarea
                      id="motivation"
                      rows={4}
                      required
                      placeholder="Share your motivation and what you hope to achieve..."
                      value={formData.motivation}
                      onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
                    />
                  </div>
                </div>

                <Button type="submit" size="lg" className="w-full" variant="cta" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Volunteer;
