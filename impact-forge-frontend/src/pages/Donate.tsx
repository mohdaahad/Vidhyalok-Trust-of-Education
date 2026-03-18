import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Shield, Award, Landmark, DollarSign, Loader2, Copy, CheckCircle, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  { value: "500", label: "₹500", impact: "School supplies for 2 children" },
  { value: "1000", label: "₹1,000", impact: "Feeds a family for a week" },
  { value: "2500", label: "₹2,500", impact: "Medical care for 5 people" },
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
    toast({ title: "Copied!", description: `${field} copied to clipboard` });
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalAmount = selectedAmount === "custom" ? parseFloat(customAmount) : parseFloat(selectedAmount);

    if (!finalAmount || finalAmount < 1) {
      toast({ title: "Invalid Amount", description: "Please enter a valid donation amount", variant: "destructive" });
      return;
    }
    if (!formData.name || !formData.email || !formData.utr || !screenshot) {
      toast({ title: "Missing Information", description: "Please fill in all required fields, including UTR and screenshot.", variant: "destructive" });
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
      navigate(`/donation-success?amount=${finalAmount}&transaction_id=${donation.transaction_id}`);
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to process donation", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-16">

      {/* ── Hero ── */}
      <section className="py-10 md:py-20 gradient-warm">
        <div className="w-full max-w-3xl mx-auto px-4 text-center">
          <Heart className="w-10 h-10 md:w-16 md:h-16 text-accent-foreground mx-auto mb-3 md:mb-6" />
          <h1 className="text-accent-foreground mb-3 md:mb-5 text-2xl sm:text-4xl md:text-5xl">
            Make a Difference Today
          </h1>
          <p className="text-sm md:text-lg text-accent-foreground/90 leading-relaxed">
            Your donation helps us create lasting change in communities around the world.
            Every contribution counts, no matter the size.
          </p>
        </div>
      </section>

      {/* ── Main Content ── */}
      <div className="w-full max-w-7xl mx-auto px-4 py-8 md:py-14">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 items-start">

          {/* ── Left Column ── */}
          <div className="w-full lg:flex-1 min-w-0 space-y-5">

            {/* Bank Details */}
            <div className="rounded-xl border-2 border-primary/20 bg-primary/5 p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-primary/10 p-2 rounded-lg shrink-0">
                  <Building2 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-foreground">Bank Transfer Details</h2>
                  <p className="text-xs text-muted-foreground">Transfer your donation to the account below</p>
                </div>
              </div>

              <div className="space-y-2">
                {[
                  { label: "Bank Name", value: BANK_DETAILS.bankName },
                  { label: "Branch", value: BANK_DETAILS.branch },
                  { label: "Account Name", value: BANK_DETAILS.accountName },
                  { label: "Account Number", value: BANK_DETAILS.accountNumber },
                  { label: "IFSC Code", value: BANK_DETAILS.ifscCode },
                  { label: "Account Type", value: BANK_DETAILS.accountType },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center bg-white dark:bg-background rounded-lg border px-3 py-2.5 gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-0.5">{item.label}</p>
                      <p className="text-xs sm:text-sm font-semibold text-foreground break-all">{item.value}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(item.value, item.label)}
                      className="shrink-0 w-7 h-7 flex items-center justify-center rounded-md hover:bg-muted transition-colors"
                      title={`Copy ${item.label}`}
                    >
                      {copiedField === item.label
                        ? <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                        : <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                      }
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
                <p className="text-xs text-amber-800 dark:text-amber-200">
                  <strong>Note:</strong> After transferring, please fill in your details below so we can track your donation and send you a receipt.
                </p>
              </div>
            </div>

            {/* Confirm Donation Form */}
            <div className="rounded-xl border bg-card shadow-sm p-4 sm:p-6">
              <h2 className="text-base sm:text-xl font-bold text-foreground mb-4">Confirm Your Donation</h2>

              <form onSubmit={handleSubmit} className="space-y-5">

                {/* Amount */}
                <div>
                  <Label className="text-sm font-semibold mb-2 block">Select Amount</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {donationAmounts.map((amount) => (
                      <button
                        key={amount.value}
                        type="button"
                        onClick={() => setSelectedAmount(amount.value)}
                        className={`p-2.5 border-2 rounded-lg transition-smooth text-left ${
                          selectedAmount === amount.value
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="font-bold text-sm text-foreground">{amount.label}</div>
                        <div className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{amount.impact}</div>
                      </button>
                    ))}
                  </div>

                  {selectedAmount === "custom" && (
                    <div className="mt-3">
                      <Label htmlFor="custom-amount" className="text-sm">Enter Custom Amount (₹)</Label>
                      <div className="relative mt-1">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="custom-amount"
                          type="number"
                          placeholder="Enter amount"
                          className="pl-9"
                          value={customAmount}
                          onChange={(e) => setCustomAmount(e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Donor Information */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold block">Your Information</Label>

                  <div>
                    <Label htmlFor="name" className="text-sm">Full Name *</Label>
                    <Input id="name" required className="mt-1" value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-sm">Email Address *</Label>
                    <Input id="email" type="email" required className="mt-1" value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-sm">Phone Number</Label>
                    <Input id="phone" type="tel" className="mt-1" value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                  </div>

                  <div>
                    <Label htmlFor="pan" className="text-sm">PAN Number (for tax certificate)</Label>
                    <Input id="pan" type="text" placeholder="ABCDE1234F" maxLength={10} className="mt-1"
                      value={formData.pan}
                      onChange={(e) => setFormData({ ...formData, pan: e.target.value.toUpperCase() })} />
                    <p className="text-xs text-muted-foreground mt-1">Required for tax deduction certificate</p>
                  </div>

                  <div>
                    <Label htmlFor="utr" className="text-sm">Transaction ID / UTR *</Label>
                    <Input id="utr" type="text" placeholder="e.g. 123456789012" required className="mt-1"
                      value={formData.utr}
                      onChange={(e) => setFormData({ ...formData, utr: e.target.value })} />
                  </div>

                  <div>
                    <Label htmlFor="screenshot" className="text-sm">Upload Payment Screenshot *</Label>
                    <Input id="screenshot" type="file" accept="image/*" required className="mt-1"
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) setScreenshot(e.target.files[0]);
                      }} />
                    <p className="text-xs text-muted-foreground mt-1">Please upload a clear screenshot of successful payment</p>
                  </div>
                </div>

                {/* Submit */}
                <Button type="submit" size="lg" className="w-full" variant="cta" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Submitting...</>
                  ) : (
                    <><Landmark className="w-4 h-4 mr-2" /> Confirm Donation</>
                  )}
                </Button>

                <div className="flex flex-col items-center gap-1.5">
                  <p className="text-xs text-center text-muted-foreground">
                    Your donation will be verified by our team and you'll receive a confirmation email.
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Shield className="w-3 h-3" />
                    <span>Secure & 100% Transparent</span>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* ── Right Sidebar ── */}
          <div className="w-full lg:w-72 xl:w-80 space-y-4 lg:sticky lg:top-24 shrink-0">

            <div className="rounded-xl border bg-card shadow-sm p-4 sm:p-6">
              <h3 className="text-base font-bold text-foreground mb-4">Your Impact</h3>
              <div className="space-y-4">
                {[
                  { Icon: Shield, color: "primary", title: "100% Transparent", desc: "See exactly where your money goes" },
                  { Icon: Award, color: "secondary", title: "Tax Deductible", desc: "Receive a tax receipt via email" },
                  { Icon: Heart, color: "accent", title: "Direct Impact", desc: "95% goes directly to programs" },
                ].map(({ Icon, color, title, desc }) => (
                  <div key={title} className="flex items-start gap-3">
                    <div className={`bg-${color}/10 p-2 rounded-lg shrink-0`}>
                      <Icon className={`w-4 h-4 text-${color}`} />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground">{title}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl gradient-trust text-primary-foreground p-4 sm:p-6">
              <h3 className="text-base font-bold mb-3">How It Works</h3>
              <ol className="space-y-3 text-sm">
                {[
                  "Copy the bank details above and transfer the amount",
                  "Fill in your details and click \"Confirm Donation\"",
                  "Our team will verify the transfer and send your receipt via email",
                ].map((step, i) => (
                  <li key={i} className="flex gap-2 items-start">
                    <span className="bg-white/20 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{i + 1}</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
              <p className="text-xs mt-4 opacity-90 break-all">
                Contact: vidhyaloktrustofeducation@gmail.com
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Donate;
