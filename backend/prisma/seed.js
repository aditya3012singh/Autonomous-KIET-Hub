import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Create users
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'adminpass',
      role: 'ADMIN',
    },
  });

  const student = await prisma.user.create({
    data: {
      name: 'Student User',
      email: 'student@example.com',
      password: 'studentpass',
      role: 'STUDENT',
    },
  });

  // Create subject
  const subject = await prisma.subject.create({
    data: {
      name: 'Mathematics',
      branch: 'CSE',
      semester: 4,
    },
  });

  // Create note
  const note = await prisma.note.create({
    data: {
      title: 'Linear Algebra Notes',
      branch: 'CSE',
      semester: 4,
      fileUrl: 'http://example.com/la.pdf',
      subjectId: subject.id,
      uploadedById: student.id,
      approvedById: admin.id,
    },
  });

  // Create tip
  const tip = await prisma.tip.create({
    data: {
      title: 'Exam Prep',
      content: 'Start early and solve previous papers.',
      status: 'APPROVED',
      postedById: student.id,
      approvedById: admin.id,
    },
  });

  // Create file
  await prisma.file.create({
    data: {
      url: 'http://example.com/sample.pdf',
      filename: 'sample.pdf',
      type: 'pdf',
      size: 123456,
      uploadedById: student.id,
    },
  });

  // Create feedback
  await prisma.feedback.create({
    data: {
      content: 'This note is helpful!',
      userId: student.id,
      noteId: note.id,
    },
  });

  // Create announcement
  await prisma.announcement.create({
    data: {
      title: 'Welcome!',
      message: 'The platform is now live.',
      postedById: admin.id,
    },
  });

  // Create event
  await prisma.event.create({
    data: {
      title: 'Orientation Day',
      content: 'Join us for the orientation session.',
      eventDate: new Date('2025-07-01T10:00:00Z'),
    },
  });

  console.log('🌱 Seed data inserted!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
