import { jsPDF } from 'jspdf';

interface InvoiceData {
  orderId: string;
  customerName: string;
  email: string;
  phone: string;
  date: string;
  products: any[];
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
}

export const generateInvoice = (data: InvoiceData) => {
  const doc = new jsPDF();
  const brandPrimary = '#F97316';

  // Header
  doc.setFillColor(0, 0, 0);
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.text('SATYA COMPUTERS', 20, 25);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('PREMIUM HARDWARE ARCHITECTURE', 20, 32);
  
  doc.setTextColor(brandPrimary);
  doc.text('TAX INVOICE', 160, 25);

  // Business Details
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('FROM:', 20, 50);
  doc.setFont('helvetica', 'normal');
  doc.text('Satya Computers Systems', 20, 55);
  doc.text('Ameerpet Logistics Hub', 20, 59);
  doc.text('Hyderabad, TG 500038', 20, 63);
  doc.text('GSTIN: 36ABCDE1234F1Z5', 20, 67);

  // Customer Details
  doc.setFont('helvetica', 'bold');
  doc.text('BILL TO:', 120, 50);
  doc.setFont('helvetica', 'normal');
  doc.text(data.customerName, 120, 55);
  doc.text(data.email, 120, 59);
  doc.text(data.phone, 120, 63);

  // Order Info
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  doc.line(20, 75, 190, 75);
  
  doc.setFont('helvetica', 'bold');
  doc.text(`INVOICE NO: ${data.orderId}`, 20, 85);
  doc.text(`DATE: ${data.date}`, 120, 85);
  doc.text(`PAYMENT: ${data.paymentMethod} (${data.paymentStatus})`, 20, 90);

  // Table Header
  doc.setFillColor(240, 240, 240);
  doc.rect(20, 100, 170, 10, 'F');
  doc.setFont('helvetica', 'bold');
  doc.text('DESCRIPTION', 25, 106.5);
  doc.text('QTY', 120, 106.5);
  doc.text('UNIT PRICE', 140, 106.5);
  doc.text('TOTAL', 170, 106.5);

  // Table Body
  let y = 118;
  doc.setFont('helvetica', 'normal');
  data.products.forEach((item: any) => {
    doc.text(item.name || 'Enterprise Hardware', 25, y);
    doc.text(String(item.quantity || 1), 120, y);
    doc.text(`Rs.${(item.price || 0).toLocaleString()}`, 140, y);
    doc.text(`Rs.${((item.price || 0) * (item.quantity || 1)).toLocaleString()}`, 170, y);
    y += 10;
  });

  // Totals
  doc.line(20, y, 190, y);
  y += 15;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('GRAND TOTAL:', 120, y);
  doc.setTextColor(brandPrimary);
  doc.text(`INR ${data.totalAmount.toLocaleString()}/-`, 160, y);

  // Footer
  doc.setTextColor(150, 150, 150);
  doc.setFontSize(8);
  doc.text('This is a computer generated document. Systems verified by Q&A Lab.', 105, 280, { align: 'center' });

  doc.save(`Satya_Computers_Invoice_${data.orderId}.pdf`);
};
