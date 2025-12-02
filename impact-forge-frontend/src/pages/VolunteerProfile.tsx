import { useState } from "react";
import { User, Mail, Phone, MapPin, Download, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";

const VolunteerProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1 234 567 8900",
    city: "New York",
    country: "USA",
    interests: ["Education", "Healthcare"],
    hoursVolunteered: 45,
    projectsCompleted: 8,
  });
  const { toast } = useToast();

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    });
  };

  const generateCertificate = () => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    doc.setFontSize(30);
    doc.text("Certificate of Appreciation", 148, 60, { align: "center" });
    
    doc.setFontSize(16);
    doc.text("This is to certify that", 148, 80, { align: "center" });
    
    doc.setFontSize(24);
    doc.text(`${profile.firstName} ${profile.lastName}`, 148, 95, { align: "center" });
    
    doc.setFontSize(14);
    doc.text(`Has volunteered ${profile.hoursVolunteered} hours with Vidhyalok Trust of Education`, 148, 110, { align: "center" });
    doc.text(`Completing ${profile.projectsCompleted} projects`, 148, 120, { align: "center" });
    
    doc.setFontSize(12);
    doc.text(`Issued on: ${new Date().toLocaleDateString()}`, 148, 140, { align: "center" });

    doc.save(`volunteer-certificate-${profile.firstName}-${profile.lastName}.pdf`);
  };

  return (
    <div className="min-h-screen pt-16 bg-muted/30">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-foreground">Volunteer Profile</h1>
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                <Button onClick={handleSave}>Save Changes</Button>
              </div>
            )}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Stats Cards */}
            <Card className="p-6 text-center">
              <div className="text-4xl font-bold text-primary mb-2">{profile.hoursVolunteered}</div>
              <div className="text-sm text-muted-foreground">Hours Volunteered</div>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-4xl font-bold text-secondary mb-2">{profile.projectsCompleted}</div>
              <div className="text-sm text-muted-foreground">Projects Completed</div>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-4xl font-bold text-accent mb-2">{profile.interests.length}</div>
              <div className="text-sm text-muted-foreground">Areas of Interest</div>
            </Card>
          </div>

          {/* Profile Information */}
          <Card className="p-8 mt-6">
            <h2 className="text-xl font-bold text-foreground mb-6">Personal Information</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <Input
                    id="firstName"
                    value={profile.firstName}
                    disabled={!isEditing}
                    onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <Input
                    id="lastName"
                    value={profile.lastName}
                    disabled={!isEditing}
                    onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    disabled={!isEditing}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    value={profile.phone}
                    disabled={!isEditing}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <Input
                    id="city"
                    value={profile.city}
                    disabled={!isEditing}
                    onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <Input
                    id="country"
                    value={profile.country}
                    disabled={!isEditing}
                    onChange={(e) => setProfile({ ...profile, country: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Label className="mb-3 block">Areas of Interest</Label>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest) => (
                  <Badge key={interest} variant="secondary">
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>
          </Card>

          {/* Certificate Section */}
          <Card className="p-8 mt-6 text-center gradient-warm">
            <Award className="w-16 h-16 text-accent-foreground mx-auto mb-4" />
            <h3 className="text-xl font-bold text-accent-foreground mb-2">
              Download Your Certificate
            </h3>
            <p className="text-accent-foreground/90 mb-6">
              Celebrate your contribution with an official volunteer certificate
            </p>
            <Button onClick={generateCertificate} size="lg" variant="default">
              <Download className="w-5 h-5 mr-2" />
              Download Certificate
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VolunteerProfile;
