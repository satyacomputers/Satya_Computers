'use client';

import { useCart } from '@/lib/CartContext';
import { FileText, Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function QuoteButton() {
  const { items, cartTotal } = useCart();
  const [generating, setGenerating] = useState(false);

  const generatePDF = async () => {
    if (items.length === 0) return;
    setGenerating(true);

    try {
      // Dynamically import jsPDF so it only loads when needed
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

      const margin = 20;
      const pageWidth = doc.internal.pageSize.getWidth();
      const today = new Date();
      const validUntil = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

      const formatDate = (d: Date) => d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

      // ── HEADER BAND ────────────────────────────────────────────
      doc.setFillColor(15, 23, 42); // #0F172A
      doc.rect(0, 0, pageWidth, 42, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(26);
      doc.text('SATYA COMPUTERS', margin, 20);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(150, 160, 180);
      doc.text('Authorized Hardware Reseller | Ameerpet, Hyderabad', margin, 28);
      doc.text('Ph: +91 83091 78589 | satyacomputers@gmail.com', margin, 34);

      // Quotation label (top right)
      doc.setTextColor(241, 90, 36); // brand orange
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.text('QUOTATION', pageWidth - margin, 18, { align: 'right' });
      doc.setFontSize(9);
      doc.setTextColor(150, 160, 180);
      const quoteNo = `Q-${Date.now().toString().slice(-8)}`;
      doc.text(`Ref: ${quoteNo}`, pageWidth - margin, 26, { align: 'right' });
      doc.text(`Date: ${formatDate(today)}`, pageWidth - margin, 32, { align: 'right' });
      doc.text(`Valid Till: ${formatDate(validUntil)}`, pageWidth - margin, 38, { align: 'right' });

      // ── DIVIDER + META ─────────────────────────────────────────
      doc.setDrawColor(241, 90, 36);
      doc.setLineWidth(0.8);
      doc.line(margin, 48, pageWidth - margin, 48);

      doc.setTextColor(100, 100, 100);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text('PREPARED FOR:', margin, 56);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text('Esteemed Client', margin, 62);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      doc.text('This is a proforma quotation. Prices valid for 7 days from the date of issue.', margin, 70);

      // ── ITEMS TABLE HEADER ─────────────────────────────────────
      let y = 82;
      doc.setFillColor(15, 23, 42);
      doc.rect(margin, y, pageWidth - margin * 2, 8, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.text('#', margin + 2, y + 5.5);
      doc.text('PRODUCT DESCRIPTION', margin + 12, y + 5.5);
      doc.text('QTY', pageWidth - margin - 52, y + 5.5, { align: 'right' });
      doc.text('UNIT PRICE', pageWidth - margin - 30, y + 5.5, { align: 'right' });
      doc.text('TOTAL', pageWidth - margin, y + 5.5, { align: 'right' });

      // ── ITEMS ──────────────────────────────────────────────────
      y += 10;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);

      items.forEach((item, idx) => {
        if (idx % 2 === 0) {
          doc.setFillColor(248, 249, 252);
          doc.rect(margin, y - 3, pageWidth - margin * 2, 9, 'F');
        }
        doc.setTextColor(15, 23, 42);
        doc.text(`${idx + 1}.`, margin + 2, y + 3);
        const nameLines = doc.splitTextToSize(item.name, 90);
        doc.text(nameLines[0], margin + 12, y + 3);
        doc.setTextColor(100, 100, 100);
        doc.text(`${item.quantity}`, pageWidth - margin - 52, y + 3, { align: 'right' });
        doc.text(`INR ${item.price.toLocaleString('en-IN')}`, pageWidth - margin - 30, y + 3, { align: 'right' });
        doc.setTextColor(241, 90, 36);
        doc.setFont('helvetica', 'bold');
        doc.text(`INR ${(item.price * item.quantity).toLocaleString('en-IN')}`, pageWidth - margin, y + 3, { align: 'right' });
        doc.setFont('helvetica', 'normal');
        y += 9;
      });

      // ── TOTALS SECTION ─────────────────────────────────────────
      y += 6;
      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.3);
      doc.line(pageWidth - margin - 70, y, pageWidth - margin, y);
      y += 6;

      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text('SUBTOTAL:', pageWidth - margin - 70, y);
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.text(`INR ${cartTotal.toLocaleString('en-IN')}`, pageWidth - margin, y, { align: 'right' });

      y += 7;
      doc.setFillColor(15, 23, 42);
      doc.rect(pageWidth - margin - 70, y - 5, 70, 12, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10.5);
      doc.text('GRAND TOTAL:', pageWidth - margin - 68, y + 3);
      doc.setTextColor(241, 90, 36);
      doc.setFontSize(12);
      doc.text(`INR ${cartTotal.toLocaleString('en-IN')}`, pageWidth - margin - 2, y + 3, { align: 'right' });

      // ── TERMS ─────────────────────────────────────────────────
      y += 20;
      doc.setDrawColor(241, 90, 36);
      doc.setLineWidth(0.4);
      doc.line(margin, y, pageWidth - margin, y);
      y += 8;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(15, 23, 42);
      doc.text('TERMS & CONDITIONS', margin, y);
      y += 6;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      const terms = [
        '1. This quotation is valid for 7 days from the issue date.',
        '2. Prices are subject to change without prior notice after expiry.',
        '3. GST & applicable taxes are charged as per prevailing government norms.',
        '4. Payment: 100% advance for orders above INR 50,000.',
        '5. Delivery: 2–5 business days (Pan India via Blue Dart logistics).',
        '6. All products are quality-tested before dispatch.',
        '7. Warranty: 6 months (Satya Computers in-house warranty).',
      ];
      terms.forEach(term => {
        doc.text(term, margin, y);
        y += 5;
      });

      // ── FOOTER ─────────────────────────────────────────────────
      const footerY = doc.internal.pageSize.getHeight() - 18;
      doc.setFillColor(15, 23, 42);
      doc.rect(0, footerY, pageWidth, 18, 'F');
      doc.setTextColor(150, 160, 180);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text('Satya Computers | Ameerpet, Hyderabad – 500016 | +91 83091 78589', pageWidth / 2, footerY + 7, { align: 'center' });
      doc.text('This is a computer-generated quotation and requires no signature.', pageWidth / 2, footerY + 13, { align: 'center' });

      doc.save(`Satya_Computers_Quote_${quoteNo}.pdf`);
    } catch (err) {
      console.error('PDF generation error:', err);
      alert('Failed to generate quote. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  if (items.length === 0) return null;

  return (
    <button
      onClick={generatePDF}
      disabled={generating}
      title="Download Official Quotation PDF"
      className="w-full flex items-center justify-center gap-3 py-3 border-2 border-black text-black font-heading text-sm tracking-widest uppercase hover:bg-black hover:text-white transition-all disabled:opacity-50 disabled:cursor-wait"
    >
      {generating ? (
        <><Loader2 size={16} className="animate-spin" /> GENERATING PDF...</>
      ) : (
        <><FileText size={16} /> DOWNLOAD OFFICIAL QUOTE</>
      )}
    </button>
  );
}
