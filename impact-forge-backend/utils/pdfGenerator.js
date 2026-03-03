import { jsPDF } from "jspdf";

/**
 * Generate Donation Receipt PDF
 * @param {Object} donation - Donation object
 * @returns {Buffer} - PDF Buffer
 */
export const generateDonationReceiptBuffer = (donation) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Header - Professional blue bar
  doc.setFillColor(30, 58, 138); // Dark blue
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  // Logo Text in White
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
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
  
  // Donation Details
  doc.setFont("helvetica", "bold");
  doc.text("DONATION DETAILS", 20, 60);
  doc.line(20, 63, 60, 63);
  
  doc.setFont("helvetica", "normal");
  const labelX = 25;
  const valueX = 80;
  
  doc.text("Receipt Number:", labelX, 75);
  doc.setFont("helvetica", "bold");
  doc.text(donation.transaction_id, valueX, 75);
  
  doc.setFont("helvetica", "normal");
  doc.text("Donation Date:", labelX, 85);
  doc.text(new Date(donation.created_at).toLocaleDateString(), valueX, 85);
  
  doc.text("Payment Method:", labelX, 95);
  doc.text(donation.payment_method || "Bank Transfer / UPI", valueX, 95);
  
  doc.text("Status:", labelX, 105);
  if (donation.status === 'completed') {
    doc.setTextColor(22, 163, 74); // Green
    doc.text("Completed / Verified", valueX, 105);
  } else {
    doc.setTextColor(180, 83, 9); // Amber
    doc.text("Pending Verification", valueX, 105);
  }
  doc.setTextColor(50, 50, 50);
  
  // Amount with background
  doc.setFillColor(243, 244, 246);
  doc.rect(20, 115, pageWidth - 40, 20, 'F');
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("TOTAL DONATION AMOUNT:", 30, 128);
  doc.setTextColor(30, 58, 138);
  doc.text(`INR ${parseFloat(donation.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, pageWidth - 80, 128);
  
  // Terms
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(10);
  doc.setFont("helvetica", "italic");
  doc.text("This receipt is subject to bank clearance and verification.", 20, 165);
  doc.text("Thank you for your generous contribution towards education and community welfare.", 20, 172);
  
  // Registration Info
  doc.setFont("helvetica", "normal");
  doc.text("Registration No: Saharanpur/123/2025", pageWidth - 15, 200, { align: "right" });
  doc.text("Email: vidhyaloktrustofeducation@gmail.com", 20, 200);
  
  // System Generated Note
  doc.setTextColor(150, 150, 150);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("This is a computer-generated receipt and does not require a physical signature.", pageWidth / 2, 250, { align: "center" });
  doc.text("Generated on " + new Date().toLocaleString(), pageWidth / 2, 255, { align: "center" });
  
  const buffer = doc.output("arraybuffer");
  return Buffer.from(buffer);
};
