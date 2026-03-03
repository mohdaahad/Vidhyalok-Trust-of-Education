import { CheckCircle, Download, Share2, Home, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate, useSearchParams } from "react-router-dom";
import jsPDF from "jspdf";

const DonationSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const amount = searchParams.get("amount") || "0";
  const transactionId = searchParams.get("transaction_id") || "TXN" + Date.now();

  const generateReceipt = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header - Professional blue bar
    doc.setFillColor(30, 58, 138); // Dark blue (matching brand)
    doc.rect(0, 0, pageWidth, 40, 'F');

    // Logo Text in White
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20); // Slightly smaller to prevent overlap
    doc.text("Vidhyalok Trust of Education", 15, 25);

    // Receipt Label
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("OFFICIAL DONATION RECEIPT", pageWidth - 15, 25, { align: "right" });

    // Reset Color and Font
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(11);

    // Border Box
    doc.setDrawColor(200, 200, 200);
    doc.rect(15, 50, pageWidth - 30, 100);

    // Donation Details Table-like layout
    doc.setFont("helvetica", "bold");
    doc.text("DONATION DETAILS", 20, 60);
    doc.line(20, 63, 60, 63);

    doc.setFont("helvetica", "normal");
    const labelX = 25;
    const valueX = 80;

    doc.text("Receipt Number:", labelX, 75);
    doc.setFont("helvetica", "bold");
    doc.text(transactionId, valueX, 75);

    doc.setFont("helvetica", "normal");
    doc.text("Donation Date:", labelX, 85);
    doc.text(new Date().toLocaleDateString(), valueX, 85);

    doc.text("Payment Method:", labelX, 95);
    doc.text("Bank Transfer / UPI", valueX, 95);

    doc.text("Status:", labelX, 105);
    doc.setTextColor(180, 83, 9); // Amber
    doc.text("Pending Verification", valueX, 105);
    doc.setTextColor(50, 50, 50);

    // Amount with background
    doc.setFillColor(243, 244, 246);
    doc.rect(20, 115, pageWidth - 40, 20, 'F');
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("TOTAL DONATION AMOUNT:", 30, 128);
    doc.setTextColor(30, 58, 138);
    doc.text(`INR ${parseFloat(amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, pageWidth - 80, 128);

    // Footer / Terms
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text("This receipt is subject to bank clearance and verification.", 20, 165);
    doc.text("Thank you for your generous contribution towards education and community welfare.", 20, 172);

    // Address Info
    doc.setFont("helvetica", "normal");
    doc.text("Registration No: Saharanpur/123/2025", pageWidth - 85, 200);
    doc.text("Email: vidhyaloktrustofeducation@gmail.com", 20, 200);

    // System Generated Note
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("This is a computer-generated receipt and does not require a physical signature.", pageWidth / 2, 250, { align: "center" });
    doc.text("Generated on " + new Date().toLocaleString(), pageWidth / 2, 255, { align: "center" });

    doc.save(`vidhyalok-receipt-${transactionId}.pdf`);
  };

  return (
    <div className="min-h-screen pt-16 bg-muted/30">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto">
          <Card className="p-8 text-center animate-fade-in">
            <div className="bg-secondary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-secondary" />
            </div>

            <h1 className="text-3xl font-bold text-foreground mb-4">
              Thank You for Your Support!
            </h1>

            <p className="text-lg text-muted-foreground mb-8">
              Your contribution of <span className="text-primary font-bold">₹{parseFloat(amount).toLocaleString('en-IN')}</span> will help us create a meaningful impact.
            </p>

            <div className="bg-muted/50 p-6 rounded-lg mb-8">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-left">
                  <div className="text-muted-foreground">Transaction ID</div>
                  <div className="font-medium text-foreground">{transactionId}</div>
                </div>
                <div className="text-left">
                  <div className="text-muted-foreground">Date</div>
                  <div className="font-medium text-foreground">{new Date().toLocaleDateString()}</div>
                </div>
                <div className="text-left">
                  <div className="text-muted-foreground">Amount</div>
                  <div className="font-medium text-foreground">₹{amount}</div>
                </div>
                <div className="text-left">
                  <div className="text-muted-foreground">Status</div>
                  <div className="font-medium text-amber-600 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    Pending Verification
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-8 text-left">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>What happens next?</strong> Our team will verify your bank transfer within 24-48 hours.
                You'll receive a confirmation email once the donation is verified.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <Button onClick={generateReceipt} variant="default">
                <Download className="w-4 h-4 mr-2" />
                Download Receipt
              </Button>
              <Button variant="outline" onClick={() => navigator.share?.({ title: "I donated to Vidhyalok Trust of Education!", text: `I just donated ₹${amount} to Vidhyalok Trust of Education!` })}>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>

            <Button variant="ghost" onClick={() => navigate("/")} className="mt-4">
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Card>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              A confirmation email has been sent to your email address. You'll receive a tax receipt once the transfer is verified.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationSuccess;
