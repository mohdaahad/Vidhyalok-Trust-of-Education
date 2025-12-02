import { CheckCircle, Download, Share2, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate, useSearchParams } from "react-router-dom";
import jsPDF from "jspdf";

const DonationSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const amount = searchParams.get("amount") || "50";
  const transactionId = "TXN" + Date.now();

  const generateReceipt = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Vidhyalok Trust of Education - Donation Receipt", 20, 20);
    doc.setFontSize(12);
    doc.text(`Transaction ID: ${transactionId}`, 20, 40);
    doc.text(`Amount: $${amount}`, 20, 50);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 60);
    doc.text("Thank you for your generous donation!", 20, 80);
    doc.text("This is a tax-deductible receipt.", 20, 90);
    doc.save(`donation-receipt-${transactionId}.pdf`);
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
              Thank You for Your Donation!
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8">
              Your generous contribution of <span className="text-primary font-bold">${amount}</span> will help us make a real difference.
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
                  <div className="font-medium text-foreground">${amount}</div>
                </div>
                <div className="text-left">
                  <div className="text-muted-foreground">Status</div>
                  <div className="font-medium text-secondary">Successful</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <Button onClick={generateReceipt} variant="default">
                <Download className="w-4 h-4 mr-2" />
                Download Receipt
              </Button>
              <Button variant="outline" onClick={() => navigator.share?.({ title: "I donated to Vidhyalok Trust of Education!", text: `I just donated $${amount} to Vidhyalok Trust of Education!` })}>
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
              A confirmation email with your tax receipt has been sent to your email address.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationSuccess;
