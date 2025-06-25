import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 10);
  const studentPassword = await bcrypt.hash('student123', 10);

  // Create Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@kiet.edu' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@kiet.edu',
      password: adminPassword,
      role: 'STUDENT',
    },
  });

  // Create Student
  const student = await prisma.user.upsert({
    where: { email: 'student@kiet.edu' },
    update: {},
    create: {
      name: 'Student One',
      email: 'student@kiet.edu',
      password: studentPassword,
      role: 'STUDENT',
    },
  });

  // Create Subjects (skip duplicates to avoid constraint error)
  await prisma.subject.createMany({
    data: [
      { name: 'Digital Logic', branch: 'Computer Science', semester: 1 },
      { name: 'Physics', branch: 'Electronics', semester: 1 },
    ],
    skipDuplicates: true,
  });

  const digitalLogic = await prisma.subject.findFirst({
    where: { name: 'Digital Logic' },
  });

  // Create Notes
  if (digitalLogic) {
    await prisma.note.createMany({
      data: [
        {
          title: 'Boolean Algebra Basics',
          fileUrl: 'https://example.com/boolean.pdf',
          semester: 1,
          branch: 'Computer Science',
          subjectId: digitalLogic.id,
          uploadedById: student.id,
          approvedById: admin.id,
        },
        {
          title: 'Logic Gate Truth Tables',
          fileUrl: 'https://example.com/gates.pdf',
          semester: 1,
          branch: 'Computer Science',
          subjectId: digitalLogic.id,
          uploadedById: student.id,
        },
      ],
    });
  }

  // Create Tips
  await prisma.tip.createMany({
    data: [
      {
        title: 'Use Flashcards',
        content: 'Review key terms daily using flashcards.',
        status: 'APPROVED',
        postedById: student.id,
        approvedById: admin.id,
      },
      {
        title: 'Group Study',
        content: 'Discussing topics with friends helps memory.',
        status: 'PENDING',
        postedById: student.id,
      },
    ],
  });

  // Create Events
  await prisma.event.createMany({
    data: [
      {
        title: 'Hackathon 2025',
        content: 'Join the hackathon and build something amazing in 24 hours. Food and swags provided!',
        eventDate: new Date('2025-08-10'),
        createdAt: new Date(),
      },
      {
        title: 'Workshop: Git & GitHub',
        content: 'This workshop will teach you Git commands and how to collaborate using GitHub.',
        eventDate: new Date('2025-07-15'),
        createdAt: new Date(),
      },
    ],
    skipDuplicates: true,
  });

  // Create Announcements
  await prisma.announcement.createMany({
    data: [
      {
        title: 'Mid Sem Exams Schedule',
        message: 'Exams will be held from Aug 20 to Aug 30.',
        postedById: admin.id,
      },
      {
        title: 'Library Hours Update',
        message: 'Library now open from 8AM to 10PM daily.',
        postedById: admin.id,
      },
    ],
  });

  console.log('✅ Database seeding completed.');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
