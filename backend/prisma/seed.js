import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing old data from database...');
  await prisma.message.deleteMany();
  await prisma.match.deleteMany();
  await prisma.swipe.deleteMany();
  await prisma.block.deleteMany();
  await prisma.photo.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();

  console.log('Seeding database with mock users and profiles...');

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('password123', salt);

  const mockUsers = [
    {
      phone: '+15550101',
      profile: {
        name: 'Sophia',
        age: 24,
        gender: 'female',
        preference: 'male',
        bio: 'Living in SF, love hiking and tech! Let\'s grab some matcha.',
        latitude: 37.7858,
        longitude: -122.4008,
        elo: 1200,
        photos: [
          { url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500', isPrimary: true }
        ]
      }
    },
    {
      phone: '+15550102',
      profile: {
        name: 'Liam',
        age: 27,
        gender: 'male',
        preference: 'female',
        bio: 'Foodie, developer, and casual runner. Exploring SF one coffee shop at a time.',
        latitude: 37.7599,
        longitude: -122.4368,
        elo: 1100,
        photos: [
          { url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500', isPrimary: true }
        ]
      }
    },
    {
      phone: '+15550103',
      profile: {
        name: 'Emma',
        age: 25,
        gender: 'female',
        preference: 'everyone',
        bio: 'Artist, traveler, and coffee enthusiast. Show me your favorite art gallery.',
        latitude: 37.8012,
        longitude: -122.4124,
        elo: 1250,
        photos: [
          { url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500', isPrimary: true }
        ]
      }
    },
    {
      phone: '+15550104',
      profile: {
        name: 'Ava',
        age: 23,
        gender: 'female',
        preference: 'male',
        bio: 'Let\'s go for an outdoor run! Always down for adventure.',
        latitude: 37.7214,
        longitude: -122.4794,
        elo: 1050,
        photos: [
          { url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500', isPrimary: true }
        ]
      }
    },
    {
      phone: '+15550105',
      profile: {
        name: 'Ethan',
        age: 25,
        gender: 'male',
        preference: 'female',
        bio: 'Musician, guitarist. Live music and late night conversations. SF based.',
        latitude: 37.7749,
        longitude: -122.4194,
        elo: 1150,
        photos: [
          { url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500', isPrimary: true }
        ]
      }
    },
    {
      phone: '+15550106',
      profile: {
        name: 'Olivia',
        age: 26,
        gender: 'female',
        preference: 'female',
        bio: 'Bookworm, yoga enthusiast, and nature lover. Looking for someone to explore hiking trails with.',
        latitude: 37.7658,
        longitude: -122.4408,
        elo: 1180,
        photos: [
          { url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500', isPrimary: true }
        ]
      }
    },
    {
      phone: '+15550107',
      profile: {
        name: 'Noah',
        age: 28,
        gender: 'male',
        preference: 'male',
        bio: 'Gym goer, cook, and pet parent. Looking for a partner in crime.',
        latitude: 37.7958,
        longitude: -122.3908,
        elo: 1210,
        photos: [
          { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500', isPrimary: true }
        ]
      }
    },
    {
      phone: '+15550108',
      profile: {
        name: 'Mia',
        age: 22,
        gender: 'female',
        preference: 'male',
        bio: 'Dancing is life. Looking for someone who can keep up with me!',
        latitude: 37.7314,
        longitude: -122.4694,
        elo: 1080,
        photos: [
          { url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500', isPrimary: true }
        ]
      }
    },
    {
      phone: '+15550109',
      profile: {
        name: 'Lucas',
        age: 29,
        gender: 'male',
        preference: 'everyone',
        bio: 'Entrepreneur, investor, traveler. Wine collector. Looking for genuine connections.',
        latitude: 37.7888,
        longitude: -122.4088,
        elo: 1300,
        photos: [
          { url: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?w=500', isPrimary: true }
        ]
      }
    },
    {
      phone: '+15550110',
      profile: {
        name: 'Isabella',
        age: 27,
        gender: 'female',
        preference: 'everyone',
        bio: 'Photographer. I capture moments. Let\'s make some memories.',
        latitude: 37.8024,
        longitude: -122.4224,
        elo: 1220,
        photos: [
          { url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500', isPrimary: true }
        ]
      }
    },
    {
      phone: '+15550111',
      profile: {
        name: 'Mason',
        age: 26,
        gender: 'male',
        preference: 'female',
        bio: 'Surfer, beach lover, outdoor person. Living my best life in the Bay Area.',
        latitude: 37.7114,
        longitude: -122.4894,
        elo: 1120,
        photos: [
          { url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=500', isPrimary: true }
        ]
      }
    },
    {
      phone: '+15550112',
      profile: {
        name: 'Charlotte',
        age: 25,
        gender: 'female',
        preference: 'male',
        bio: 'Fashion designer. Dog lover. Cozy evenings > loud clubs.',
        latitude: 37.7458,
        longitude: -122.4508,
        elo: 1190,
        photos: [
          { url: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=500', isPrimary: true }
        ]
      }
    }
  ];

  const createdUsers = {};

  for (const item of mockUsers) {
    const user = await prisma.user.create({
      data: {
        phone: item.phone,
        passwordHash
      }
    });

    createdUsers[item.profile.name] = user.id;

    const profile = await prisma.profile.create({
      data: {
        userId: user.id,
        name: item.profile.name,
        age: item.profile.age,
        gender: item.profile.gender,
        preference: item.profile.preference,
        bio: item.profile.bio,
        latitude: item.profile.latitude,
        longitude: item.profile.longitude,
        elo: item.profile.elo
      }
    });

    for (const photo of item.profile.photos) {
      await prisma.photo.create({
        data: {
          profileId: profile.id,
          url: photo.url,
          isPrimary: photo.isPrimary
        }
      });
    }
  }

  // Pre-seed some mutual swipes (Matches) and Message History
  console.log('Seeding matches and messages...');
  
  const createMatchAndMessages = async (userAName, userBName, messages) => {
    const userAId = createdUsers[userAName];
    const userBId = createdUsers[userBName];

    // Swipes
    await prisma.swipe.create({ data: { swiperId: userAId, targetId: userBId, rating: 'like' } });
    await prisma.swipe.create({ data: { swiperId: userBId, targetId: userAId, rating: 'like' } });

    // Match
    const match = await prisma.match.create({
      data: {
        user1Id: userAId,
        user2Id: userBId
      }
    });

    // Messages
    for (const msg of messages) {
      const senderId = msg.sender === userAName ? userAId : userBId;
      await prisma.message.create({
        data: {
          matchId: match.id,
          senderId,
          text: msg.text,
          createdAt: new Date(Date.now() - msg.offsetMinutes * 60000)
        }
      });
    }
  };

  // 1. Liam + Sophia Match
  await createMatchAndMessages('Liam', 'Sophia', [
    { sender: 'Liam', text: 'Hey Sophia, how is your week going?', offsetMinutes: 120 },
    { sender: 'Sophia', text: 'Hey Liam! Pretty good, just finished a hike. How about yours?', offsetMinutes: 110 },
    { sender: 'Liam', text: 'Nice! Which trail? I am just grabbing a coffee in Mission District.', offsetMinutes: 90 },
    { sender: 'Sophia', text: 'Land End Trail, it was beautiful today! Let\'s meet up for coffee sometime.', offsetMinutes: 85 }
  ]);

  // 2. Liam + Emma Match
  await createMatchAndMessages('Liam', 'Emma', [
    { sender: 'Emma', text: 'Hey Liam! I love your coffee recommendations.', offsetMinutes: 60 },
    { sender: 'Liam', text: 'Thanks Emma! There are so many good spots in SF. Have you been to Sightglass?', offsetMinutes: 45 },
    { sender: 'Emma', text: 'No, but let\'s go this weekend! I\'d love to chat art too.', offsetMinutes: 10 }
  ]);

  // 3. Liam + Isabella Match
  await createMatchAndMessages('Liam', 'Isabella', [
    { sender: 'Isabella', text: 'Hi! Let\'s do a photoshoot around SF.', offsetMinutes: 300 },
    { sender: 'Liam', text: 'I\'m down! Where should we start?', offsetMinutes: 280 }
  ]);

  // 4. Sophia + Ethan Match
  await createMatchAndMessages('Ethan', 'Sophia', [
    { sender: 'Ethan', text: 'Hey Sophia! Do you listen to any live jazz?', offsetMinutes: 180 },
    { sender: 'Sophia', text: 'Yes! Love going to SFJAZZ Center. Do you play?', offsetMinutes: 170 },
    { sender: 'Ethan', text: 'I play guitar in a local band! Let me know if you want tickets to our next gig.', offsetMinutes: 160 }
  ]);

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
