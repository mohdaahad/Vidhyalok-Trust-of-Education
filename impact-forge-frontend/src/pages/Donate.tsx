import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Shield, Award, CreditCard, DollarSign, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { donationService } from "@/services/donation.service";
import logo from "@/assets/logo.png";

declare global {
  interface Window {
    Razorpay: any;
  }
}

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
    anonymous: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

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

    if (!formData.name || !formData.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // Create donation
      const donationData: any = {
        amount: finalAmount,
        donor_name: formData.name,
        donor_email: formData.email,
        donation_type: "one-time",
      };

      if (formData.phone) donationData.donor_phone = formData.phone;
      if (formData.pan) donationData.pan_number = formData.pan;
      if (formData.anonymous) donationData.is_anonymous = true;

      const response = await donationService.createDonation(donationData);

      const responseData = response.data as any;
      const donation = responseData.donation;
      const order = responseData.order;

      if (!order || !window.Razorpay) {
        toast({
          title: "Payment Error",
          description: "Payment gateway is not available. Please try again later.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Initialize Razorpay checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Vidhyalok Trust of Education",
        description: `Donation of ₹${finalAmount}`,
        order_id: order.id,
        image: logo,
        handler: async function (response: any) {
          try {
            // Verify payment
            await donationService.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            // Redirect to success page
            navigate(`/donation-success?amount=${finalAmount}&transaction_id=${donation.transaction_id}`);
          } catch (error: any) {
            toast({
              title: "Payment Verification Failed",
              description: error.message || "Failed to verify payment",
              variant: "destructive",
            });
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone || "",
        },
        theme: {
          color: "#1e40af", // Primary blue color
        },
        modal: {
          ondismiss: function () {
            setIsSubmitting(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", function (response: any) {
        toast({
          title: "Payment Failed",
          description: response.error.description || "Payment could not be processed",
          variant: "destructive",
        });
        setIsSubmitting(false);
      });

      razorpay.open();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to process donation",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  const amount = selectedAmount === "custom" ? customAmount : selectedAmount;

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
          <div className="lg:col-span-2">
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">Choose Your Impact</h2>

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

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="anonymous"
                      checked={formData.anonymous}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, anonymous: checked as boolean })
                      }
                    />
                    <Label htmlFor="anonymous" className="cursor-pointer text-sm">
                      Make this donation anonymous
                    </Label>
                  </div>
                </div>

                {/* Submit Button */}
                <Button type="submit" size="lg" className="w-full" variant="cta" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5 mr-2" />
                      Proceed to Payment
                    </>
                  )}
                </Button>

                <div className="flex flex-col items-center gap-2 pt-4">
                  <p className="text-xs text-center text-muted-foreground">
                    Your donation is secure and encrypted.
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Powered by</span>
                    <a
                      href="https://razorpay.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block"
                    >
                      <img
                        src="https://razorpay.com/assets/razorpay-logo.svg"
                        alt="Razorpay"
                        className="h-6 w-auto opacity-70 hover:opacity-100 transition-opacity"
                        onError={(e) => {
                          // Fallback to text if image fails to load
                          e.currentTarget.style.display = "none";
                          const parent = e.currentTarget.parentElement;
                          if (parent && !parent.querySelector(".razorpay-text-fallback")) {
                            const text = document.createElement("span");
                            text.className = "razorpay-text-fallback text-xs font-semibold text-muted-foreground";
                            text.textContent = "Razorpay";
                            parent.appendChild(text);
                          }
                        }}
                      />
                    </a>
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
              <h3 className="text-xl font-bold mb-3">Other Ways to Give</h3>
              <ul className="space-y-2 text-sm">
                <li>• Bank Transfer</li>
                <li>• Cryptocurrency</li>
                <li>• Stock Donations</li>
                <li>• Corporate Matching</li>
                <li>• Legacy Giving</li>
              </ul>
              <p className="text-sm mt-4 opacity-90">
                Contact us at donate@vidhyaloktrust.org for more information.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donate;
