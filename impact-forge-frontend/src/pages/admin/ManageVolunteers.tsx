import { useState, useEffect } from "react";
import { Search, Mail, Phone, Award, Eye, Calendar, MapPin, Briefcase, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { volunteerService, Volunteer } from "@/services/volunteer.service";

const ManageVolunteers = () => {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadVolunteers();
  }, [statusFilter]);

  const loadVolunteers = async () => {
    try {
      setIsLoading(true);
      const status = statusFilter === "all" ? undefined : statusFilter;
      const response = await volunteerService.getVolunteers();
      let filteredData = response.data || [];
      
      // Filter by status if needed
      if (status) {
        filteredData = filteredData.filter((v) => v.status === status);
      }
      
      setVolunteers(filteredData);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load volunteers",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await volunteerService.updateStatus(id, newStatus);
      toast({
        title: "Success",
        description: "Volunteer status updated successfully",
      });
      loadVolunteers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update status",
        variant: "destructive",
      });
    }
  };

  const filteredVolunteers = volunteers.filter(
    (volunteer) =>
      `${volunteer.first_name} ${volunteer.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      volunteer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statusOptions = [
    { value: "all", label: "All" },
    { value: "pending", label: "Pending" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "rejected", label: "Rejected" },
  ];

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "default";
      case "pending":
        return "secondary";
      case "inactive":
        return "outline";
      case "rejected":
        return "destructive";
      default:
        return "outline";
    }
  };

  const stats = {
    total: volunteers.length,
    active: volunteers.filter((v) => v.status === "active").length,
    pending: volunteers.filter((v) => v.status === "pending").length,
    totalHours: volunteers.reduce((sum, v) => sum + (v.hours_completed || 0), 0),
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Manage Volunteers</h1>
        <p className="text-muted-foreground mt-2">View and manage all registered volunteers</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="text-2xl font-bold text-foreground mb-1">{stats.total}</div>
          <div className="text-sm text-muted-foreground">Total Volunteers</div>
        </Card>
        <Card className="p-6">
          <div className="text-2xl font-bold text-primary mb-1">{stats.active}</div>
          <div className="text-sm text-muted-foreground">Active Volunteers</div>
        </Card>
        <Card className="p-6">
          <div className="text-2xl font-bold text-secondary mb-1">{stats.pending}</div>
          <div className="text-sm text-muted-foreground">Pending</div>
        </Card>
        <Card className="p-6">
          <div className="text-2xl font-bold text-muted-foreground mb-1">{stats.totalHours}</div>
          <div className="text-sm text-muted-foreground">Total Hours</div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Table */}
      <Card>
        {isLoading ? (
          <div className="p-6 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : filteredVolunteers.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">No volunteers found.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Hours</TableHead>
                <TableHead>Projects</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVolunteers.map((volunteer) => (
                <TableRow key={volunteer.id}>
                  <TableCell className="font-medium">
                    {volunteer.first_name} {volunteer.last_name}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        {volunteer.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="w-4 h-4" />
                        {volunteer.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {volunteer.city}, {volunteer.country}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{volunteer.hours_completed || 0}h</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{volunteer.projects_joined || 0}</div>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={volunteer.status}
                      onValueChange={(value) => handleStatusChange(volunteer.id, value)}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.slice(1).map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedVolunteer(volunteer)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" title="Generate Certificate">
                        <Award className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* View Volunteer Dialog */}
      {selectedVolunteer && (
        <Dialog open={!!selectedVolunteer} onOpenChange={(open) => !open && setSelectedVolunteer(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
            <DialogHeader>
              <DialogTitle>
                {selectedVolunteer.first_name} {selectedVolunteer.last_name}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">First Name</p>
                  <p className="text-foreground">{selectedVolunteer.first_name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Last Name</p>
                  <p className="text-foreground">{selectedVolunteer.last_name}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Email</p>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <p className="text-foreground">{selectedVolunteer.email}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Phone</p>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <p className="text-foreground">{selectedVolunteer.phone}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">City</p>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <p className="text-foreground">{selectedVolunteer.city}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Country</p>
                  <p className="text-foreground">{selectedVolunteer.country}</p>
                </div>
              </div>
              {selectedVolunteer.address && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Address</p>
                  <p className="text-foreground">{selectedVolunteer.address}</p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Availability</p>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <Badge variant="outline">{selectedVolunteer.availability}</Badge>
                </div>
              </div>
              {selectedVolunteer.skills && selectedVolunteer.skills.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedVolunteer.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {selectedVolunteer.interests && selectedVolunteer.interests.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Interests</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedVolunteer.interests.map((interest, index) => (
                      <Badge key={index} variant="outline">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {selectedVolunteer.experience && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Experience</p>
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-foreground whitespace-pre-wrap">{selectedVolunteer.experience}</p>
                  </div>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Motivation</p>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-foreground whitespace-pre-wrap">{selectedVolunteer.motivation}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Status</p>
                  <Badge variant={getStatusBadgeVariant(selectedVolunteer.status)}>
                    {selectedVolunteer.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Hours Completed</p>
                  <p className="text-foreground font-semibold">{selectedVolunteer.hours_completed || 0}h</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Projects Joined</p>
                  <p className="text-foreground font-semibold">{selectedVolunteer.projects_joined || 0}</p>
                </div>
                {selectedVolunteer.created_at && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Registered</p>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      {new Date(selectedVolunteer.created_at).toLocaleDateString()}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ManageVolunteers;
