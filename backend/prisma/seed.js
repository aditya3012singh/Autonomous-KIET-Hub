const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create Users
  const admin = await prisma.user.upsert({
    where: { email: 'admin@kiet.edu' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@kiet.edu',
      password: 'admin123', // ⚠️ Hash it in production
      role: 'ADMIN',
    },
  });

  const student = await prisma.user.upsert({
    where: { email: 'student@kiet.edu' },
    update: {},
    create: {
      name: 'Student',
      email: 'student@kiet.edu',
      password: 'student123',
      role: 'STUDENT',
    },
  });

  // Subjects
  const subject = await prisma.subject.create({
    data: {
      name: 'Digital Electronics',
      branch: 'ECE',
      semester: 2,
    },
  });

  // Note
  const note = await prisma.note.create({
    data: {
      title: 'K-Map Simplification Notes',
      branch: 'ECE',
      semester: 2,
      fileUrl: 'https://example.com/kmap.pdf',
      subjectId: subject.id,
      uploadedById: student.id,
      approvedById: admin.id,
    },
  });

  // Tip
  const tip = await prisma.tip.create({
    data: {
      title: 'Study Tip',
      content: 'Revise K-Map before the exam!',
      postedById: student.id,
      approvedById: admin.id,
      status: 'APPROVED',
    },
  });

  // File Upload
  await prisma.file.create({
    data: {
      url: 'https://example.com/syllabus.pdf',
      filename: 'syllabus.pdf',
      type: 'application/pdf',
      size: 204800,
      uploadedById: student.id,
    },
  });

  // Announcement
  await prisma.announcement.create({
    data: {
      title: 'Mid-Sem Exams',
      message: 'Mid-Sem exams start from 10th July. Prepare well!',
      postedById: admin.id,
    },
  });

  // Feedback
  await prisma.feedback.create({
    data: {
      content: 'This note was really helpful!',
      userId: student.id,
      noteId: note.id,
    },
  });

  console.log('✅ Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
