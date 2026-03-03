import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Shield, Award, Landmark, DollarSign, Loader2, Copy, CheckCircle, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useToast } from "@/hooks/use-toast";
import { donationService } from "@/services/donation.service";

const BANK_DETAILS = {
  bankName: "Punjab National Bank (PNB)",
  branch: "Islam Nagar, Saharanpur, U.P. - 247451",
  accountName: "Vidhyalok Trust of Education",
  accountNumber: "1336002100002765",
  ifscCode: "PUNB0133600",
  accountType: "Current Account",
};

const donationAmounts = [
  { value: "500", label: "₹500", impact: "Provides school supplies for 2 children" },
  { value: "1000", label: "₹1,000", impact: "Feeds a family for a week" },
  { value: "2500", label: "₹2,500", impact: "Provides medical care for 5 people" },
  { value: "5000", label: "₹5,000", impact: "Builds a water well component" },
  { value: "custom", label: "Custom Amount", impact: "Your choice of impact" },
];

const Donate = () => {
  const navigate = useNavigate();
  const [selectedAmount, setSelectedAmount] = useState("1000");
  const [customAmount, setCustomAmount] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    pan: "",
    utr: "",
  });
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const { toast } = useToast();

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast({
      title: "Copied!",
      description: `${field} copied to clipboard`,
    });
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const finalAmount = selectedAmount === "custom" ? parseFloat(customAmount) : parseFloat(selectedAmount);

    if (!finalAmount || finalAmount < 1) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid donation amount",
        variant: "destructive",
      });
      return;
    }

    if (!formData.name || !formData.email || !formData.utr || !screenshot) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields, including UTR and screenshot.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const submissionData = new FormData();
      submissionData.append("amount", finalAmount.toString());
      submissionData.append("donor_name", formData.name);
      submissionData.append("donor_email", formData.email);
      submissionData.append("donation_type", "one-time");
      submissionData.append("payment_method", "bank-transfer");
      submissionData.append("utr_number", formData.utr);

      if (formData.phone) submissionData.append("donor_phone", formData.phone);
      if (formData.pan) submissionData.append("pan_number", formData.pan);
      if (screenshot) submissionData.append("payment_screenshot", screenshot);

      const response = await donationService.createDonation(submissionData);
      const responseData = response.data as any;
      const donation = responseData.donation;

      // Redirect to success page
      navigate(`/donation-success?amount=${finalAmount}&transaction_id=${donation.transaction_id}`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to process donation",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="py-20 gradient-warm">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <Heart className="w-16 h-16 text-accent-foreground mx-auto mb-6" />
            <h1 className="text-accent-foreground mb-6">Make a Difference Today</h1>
            <p className="text-xl text-accent-foreground/90 leading-relaxed">
              Your donation helps us create lasting change in communities around the world.
              Every contribution counts, no matter the size.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Donation Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Bank Details Card */}
            <Card className="p-8 border-2 border-primary/20 bg-primary/5">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-primary/10 p-3 rounded-xl">
                  <Building2 className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Bank Transfer Details</h2>
                  <p className="text-sm text-muted-foreground">Transfer your donation to the following account</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { label: "Bank Name", value: BANK_DETAILS.bankName, field: "Bank Name" },
                  { label: "Branch", value: BANK_DETAILS.branch, field: "Branch" },
                  { label: "Account Name", value: BANK_DETAILS.accountName, field: "Account Name" },
                  { label: "Account Number", value: BANK_DETAILS.accountNumber, field: "Account Number" },
                  { label: "IFSC Code", value: BANK_DETAILS.ifscCode, field: "IFSC Code" },
                  { label: "Account Type", value: BANK_DETAILS.accountType, field: "Account Type" },
                ].map((item) => (
                  <div
                    key={item.field}
                    className="flex items-center justify-between gap-2 bg-background rounded-lg p-3 border"
                  >
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground font-medium">{item.label}</p>
                      <p className="text-sm font-semibold text-foreground truncate">{item.value}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(item.value, item.field)}
                      className="shrink-0 p-1.5 rounded-md hover:bg-muted transition-colors"
                      title={`Copy ${item.label}`}
                    >
                      {copiedField === item.field ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  <strong>Note:</strong> After transferring, please fill in your details below so we can track your donation and send you a receipt.
                </p>
              </div>
            </Card>

            {/* Donation Form */}
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">Confirm Your Donation</h2>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Amount Selection */}
                <div>
                  <Label className="text-base font-semibold mb-3 block">Select Amount</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {donationAmounts.map((amount) => (
                      <button
                        key={amount.value}
                        type="button"
                        onClick={() => setSelectedAmount(amount.value)}
                        className={`p-4 border-2 rounded-lg transition-smooth text-left ${selectedAmount === amount.value
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                          }`}
                      >
                        <div className="font-bold text-lg text-foreground">{amount.label}</div>
                        <div className="text-xs text-muted-foreground mt-1">{amount.impact}</div>
                      </button>
                    ))}
                  </div>

                  {selectedAmount === "custom" && (
                    <div className="mt-4">
                      <Label htmlFor="custom-amount">Enter Custom Amount</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="custom-amount"
                          type="number"
                          placeholder="Enter amount"
                          className="pl-10"
                          value={customAmount}
                          onChange={(e) => setCustomAmount(e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Donor Information */}
                <div className="space-y-4">
                  <Label className="text-base font-semibold block">Your Information</Label>

                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
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
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="pan">PAN Number (for tax certificate)</Label>
                    <Input
                      id="pan"
                      type="text"
                      placeholder="ABCDE1234F"
                      maxLength={10}
                      value={formData.pan}
                      onChange={(e) => setFormData({ ...formData, pan: e.target.value.toUpperCase() })}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Required for tax deduction certificate
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="utr">Transaction ID / UTR *</Label>
                    <Input
                      id="utr"
                      type="text"
                      placeholder="e.g. 123456789012"
                      value={formData.utr}
                      onChange={(e) => setFormData({ ...formData, utr: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="screenshot">Upload Screenshot *</Label>
                    <Input
                      id="screenshot"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          setScreenshot(e.target.files[0]);
                        }
                      }}
                      required
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Please upload a clear screenshot of successful payment
                    </p>
                  </div>
                </div>

                {/* Submit Button */}
                <Button type="submit" size="lg" className="w-full" variant="cta" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Landmark className="w-5 h-5 mr-2" />
                      I've Transferred – Confirm Donation
                    </>
                  )}
                </Button>

                <div className="flex flex-col items-center gap-2 pt-4">
                  <p className="text-xs text-center text-muted-foreground">
                    Your donation will be verified by our team and you'll receive a confirmation email.
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Shield className="w-3.5 h-3.5" />
                    <span>Secure & 100% Transparent</span>
                  </div>
                </div>
              </form>
            </Card>
          </div>

          {/* Sidebar - Why Donate */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold text-foreground mb-4">Your Impact</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-foreground">100% Transparent</div>
                    <div className="text-sm text-muted-foreground">
                      See exactly where your money goes
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-secondary/10 p-2 rounded-lg">
                    <Award className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <div className="font-medium text-foreground">Tax Deductible</div>
                    <div className="text-sm text-muted-foreground">
                      Receive a tax receipt via email
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-accent/10 p-2 rounded-lg">
                    <Heart className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <div className="font-medium text-foreground">Direct Impact</div>
                    <div className="text-sm text-muted-foreground">
                      95% goes directly to programs
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 gradient-trust text-primary-foreground">
              <h3 className="text-xl font-bold mb-3">How It Works</h3>
              <ol className="space-y-3 text-sm">
                <li className="flex gap-2">
                  <span className="bg-white/20 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0">1</span>
                  <span>Copy the bank details above and transfer the amount</span>
                </li>
                <li className="flex gap-2">
                  <span className="bg-white/20 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0">2</span>
                  <span>Fill in your details and click "Confirm Donation"</span>
                </li>
                <li className="flex gap-2">
                  <span className="bg-white/20 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0">3</span>
                  <span>Our team will verify the transfer and send your receipt via email</span>
                </li>
              </ol>
              <p className="text-sm mt-4 opacity-90">
                Contact us at vidhyaloktrustofeducation@gmail.com for any queries.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donate;
