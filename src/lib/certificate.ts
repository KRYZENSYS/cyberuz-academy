import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import { prisma } from './prisma';
import { generateUniqueId } from './jwt';
import { uploadToCloudinary } from './cloudinary';

interface CertificateData {
  userId: string;
  courseId: string;
  studentName: string;
  courseName: string;
}

export async function generateCertificate(data: CertificateData) {
  const { userId, courseId, studentName, courseName } = data;

  const uniqueId = generateUniqueId('CU-CERT');
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify/${uniqueId}`;

  // Generate QR code
  const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl, {
    color: { dark: '#06B6D4', light: '#0A0A0A' },
    width: 200,
  });

  // Generate PDF
  const pdfBuffer = await new Promise<Buffer>((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      layout: 'landscape',
      margin: 0,
    });

    const chunks: Buffer[] = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    // Background
    doc.rect(0, 0, doc.page.width, doc.page.height).fill('#0A0A0A');

    // Border decoration
    doc.lineWidth(3).strokeColor('#06B6D4')
      .rect(30, 30, doc.page.width - 60, doc.page.height - 60)
      .stroke();

    doc.lineWidth(1).strokeColor('#2563EB')
      .rect(45, 45, doc.page.width - 90, doc.page.height - 90)
      .stroke();

    // Header
    doc.fillColor('#06B6D4').fontSize(40).font('Helvetica-Bold')
      .text('🛡️ CyberUz Academy', 0, 80, { align: 'center' });

    doc.fillColor('#FBBF24').fontSize(24).font('Helvetica')
      .text('SERTIFIKAT', 0, 140, { align: 'center' });

    // Subtitle
    doc.fillColor('#FFFFFF').fontSize(14)
      .text('Ushbu sertifikat quyidagi shaxsga taqdim etiladi:', 0, 200, { align: 'center' });

    // Student name
    doc.fillColor('#06B6D4').fontSize(36).font('Helvetica-Bold')
      .text(studentName, 0, 240, { align: 'center' });

    // Course
    doc.fillColor('#FFFFFF').fontSize(14)
      .text('quyidagi kursni muvaffaqiyatli tamomlaganligi uchun:', 0, 310, { align: 'center' });

    doc.fillColor('#FBBF24').fontSize(28).font('Helvetica-Bold')
      .text(courseName, 0, 340, { align: 'center' });

    // Footer info
    const date = new Date().toLocaleDateString('uz-UZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    doc.fillColor('#FFFFFF').fontSize(12)
      .text(`Berilgan sana: ${date}`, 80, 480)
      .text(`Sertifikat ID: ${uniqueId}`, 80, 500);

    // QR code
    doc.image(qrCodeDataUrl, doc.page.width - 200, 460, { width: 120, height: 120 });

    doc.fillColor('#FFFFFF').fontSize(10)
      .text('Tekshirish uchun QR kodni skanerlang', doc.page.width - 200, 590, { width: 120, align: 'center' });

    // Signature line
    doc.strokeColor('#06B6D4').lineWidth(1)
      .moveTo(80, 540).lineTo(280, 540).stroke();
    doc.fillColor('#FFFFFF').fontSize(10)
      .text('Imzo', 150, 545);

    doc.end();
  });

  // Upload PDF to Cloudinary
  let pdfUrl: string | null = null;
  try {
    pdfUrl = await uploadToCloudinary(pdfBuffer, `certificates/${uniqueId}.pdf`, 'auto');
  } catch (e) {
    console.error('PDF upload failed:', e);
  }

  // Save to database
  const certificate = await prisma.certificate.create({
    data: {
      userId,
      courseId,
      uniqueId,
      studentName,
      courseName,
      pdfUrl: pdfUrl || undefined,
      qrCode: qrCodeDataUrl,
      verificationUrl,
      issuedAt: new Date(),
    },
  });

  return certificate;
}

export async function verifyCertificate(uniqueId: string) {
  const cert = await prisma.certificate.findUnique({
    where: { uniqueId },
    include: {
      user: { select: { fullName: true, username: true } },
      course: { select: { title: true, slug: true } },
    },
  });

  if (!cert) return { valid: false, reason: 'Sertifikat topilmadi' };
  if (cert.status === 'REVOKED') return { valid: false, reason: 'Sertifikat bekor qilingan' };

  return {
    valid: true,
    certificate: {
      uniqueId: cert.uniqueId,
      studentName: cert.studentName,
      courseName: cert.courseName,
      issuedAt: cert.issuedAt,
      verificationUrl: cert.verificationUrl,
    },
  };
}
