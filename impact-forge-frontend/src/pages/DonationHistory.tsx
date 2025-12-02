import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Download, Calendar, DollarSign, Loader2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { donationService, Donation } from "@/services/donation.service";
import { authService } from "@/services/auth.service";

const DonationHistory = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    if (!authService.isAuthenticated()) {
      toast({
        title: "Authentication Required",
        description: "Please login to view your donation history",
        variant: "destructive",
      });
      navigate("/login", { replace: true });
      return;
    }

    loadDonations();
  }, [navigate, toast]);

  const loadDonations = async () => {
    try {
      setIsLoading(true);
      const response = await donationService.getMyDonations();
      setDonations(response.data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load donation history",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateReceipt = async (donationId: number) => {
    try {
      const response = await donationService.generateReceipt(donationId);

      // If response is a blob (PDF), download it
      if (response instanceof Blob) {
        const url = window.URL.createObjectURL(response);
        const link = document.createElement("a");
        link.href = url;
        link.download = `donation-receipt-${donationId}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        toast({
          title: "Success",
          description: "Receipt downloaded successfully",
        });
      } else {
        toast({
          title: "Info",
          description: response.message || "Receipt generation is being implemented",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate receipt",
        variant: "destructive",
      });
    }
  };

  const handleGenerateTaxCertificate = async (donationId: number) => {
    try {
      const response = await donationService.generateTaxCertificate(donationId);

      // If response is a blob (PDF), download it
      if (response instanceof Blob) {
        const url = window.URL.createObjectURL(response);
        const link = document.createElement("a");
        link.href = url;
        link.download = `tax-certificate-${donationId}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        toast({
          title: "Success",
          description: "Tax certificate downloaded successfully",
        });
      } else {
        toast({
          title: "Info",
          description: response.message || "Tax certificate generation is being implemented",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate tax certificate",
        variant: "destructive",
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "default";
      case "pending":
        return "secondary";
      case "failed":
        return "destructive";
      case "refunded":
        return "outline";
      default:
        return "outline";
    }
  };

  const totalDonated = donations
    .filter((d) => d.status === "completed")
    .reduce((sum, d) => sum + parseFloat(d.amount.toString()), 0);

  return (
    <div className="min-h-screen pt-16">
      <section className="py-20 gradient-trust">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <DollarSign className="w-16 h-16 text-primary-foreground mx-auto mb-6" />
            <h1 className="text-primary-foreground mb-6">Your Donation History</h1>
            <p className="text-xl text-primary-foreground/90">
              Thank you for your continued support. You've donated <span className="font-bold">{formatCurrency(totalDonated)}</span> total.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-foreground">All Donations</h2>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="p-6">
                  <Skeleton className="h-20 w-full" />
                </Card>
              ))}
            </div>
          ) : donations.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground mb-4">No donations found.</p>
              <Button onClick={() => navigate("/donate")} variant="default">
                Make Your First Donation
              </Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {donations.map((donation) => (
                <Card key={donation.id} className="p-6 transition-smooth hover:shadow-lg">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-foreground">
                          {donation.project ? donation.project.title : "General Donation"}
                        </h3>
                        <Badge variant={getStatusBadgeVariant(donation.status)}>
                          {donation.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(donation.created_at)}
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          {formatCurrency(parseFloat(donation.amount.toString()))}
                        </div>
                        {donation.donation_type && (
                          <Badge variant="outline" className="text-xs">
                            {donation.donation_type}
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Transaction ID: {donation.transaction_id}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {donation.status === "completed" && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleGenerateReceipt(donation.id)}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Receipt
                          </Button>
                          {donation.pan_number && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleGenerateTaxCertificate(donation.id)}
                              title="Generate Tax Certificate"
                            >
                              <FileText className="w-4 h-4 mr-2" />
                              Tax Cert
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonationHistory;
