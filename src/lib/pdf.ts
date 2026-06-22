import QRCode from 'qrcode';
import { jsPDF } from 'jspdf';

export interface CertificateData {
  studentName: string;
  courseName: string;
  date: Date;
  uniqueId: string;
  verificationUrl: string;
}

export async function generateCertificatePDF(data: CertificateData): Promise<Buffer> {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Background gradient (simulated with rectangles)
  doc.setFillColor(10, 10, 10);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Cyan border
  doc.setDrawColor(6, 182, 212);
  doc.setLineWidth(2);
  doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

  // Inner border
  doc.setDrawColor(37, 99, 235);
  doc.setLineWidth(0.5);
  doc.rect(15, 15, pageWidth - 30, pageHeight - 30);

  // Logo/Title
  doc.setTextColor(6, 182, 212);
  doc.setFontSize(36);
  doc.setFont('helvetica', 'bold');
  doc.text('CyberUz Academy', pageWidth / 2, 40, { align: 'center' });

  doc.setTextColor(251, 191, 36);
  doc.setFontSize(14);
  doc.text('SERTIFIKAT', pageWidth / 2, 52, { align: 'center' });

  // Body text
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text('Ushbu sertifikat tasdiqlaydi ki:', pageWidth / 2, 80, { align: 'center' });

  // Student name
  doc.setTextColor(6, 182, 212);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text(data.studentName, pageWidth / 2, 100, { align: 'center' });

  // Course description
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text('quyidagi kursni muvaffaqiyatli tamomladi:', pageWidth / 2, 115, { align: 'center' });

  // Course name
  doc.setTextColor(251, 191, 36);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(data.courseName, pageWidth / 2, 135, { align: 'center' });

  // Date
  doc.setTextColor(200, 200, 200);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  const dateStr = data.date.toLocaleDateString('uz-UZ', { year: 'numeric', month: 'long', day: 'numeric' });
  doc.text(`Sana: ${dateStr}`, 40, pageHeight - 30);

  // Certificate ID
  doc.text(`ID: ${data.uniqueId}`, 40, pageHeight - 22);

  // Generate QR Code
  const qrCodeDataUrl = await QRCode.toDataURL(data.verificationUrl, {
    width: 200,
    margin: 1,
    color: { dark: '#06B6D4', light: '#0A0A0A' },
  });

  doc.addImage(qrCodeDataUrl, 'PNG', pageWidth - 60, pageHeight - 60, 40, 40);

  // Verification URL
  doc.setTextColor(6, 182, 212);
  doc.setFontSize(8);
  doc.text('Tasdiqlash uchun QR kodni skanerlang', pageWidth - 40, pageHeight - 14, { align: 'center' });

  // Signature line
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(0.3);
  doc.line(40, pageHeight - 50, 100, pageHeight - 50);
  doc.setTextColor(200, 200, 200);
  doc.setFontSize(9);
  doc.text('CyberUz Academy', 70, pageHeight - 45, { align: 'center' });

  return Buffer.from(doc.output('arraybuffer'));
}