/**
 * Spark dev seed — idempotent, tagged users only.
 * See prisma/seed/README.md for usage and demo credentials.
 *
 * DEV-ONLY: photo URLs use picsum.photos placeholders — not for production code paths.
 */
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const SEED_EMAIL_SUFFIX = '@spark-dev.seed';
const SEED_PHONE_PREFIX = '+199990';
const SEED_PASSWORD = 'SeedPass123!';
const SEED_TAG = 'spark-dev-seed';

// DEV-ONLY placeholder image base — never reference in production upload/serve paths.
const placeholderPhoto = (userKey, index = 0) =>
  `https://picsum.photos/seed/${SEED_TAG}-${userKey}-${index}/600/800`;

const SF = { lat: 37.7749, lon: -122.4194, city: 'San Francisco', country: 'US' };

/** Geo buckets relative to SF (default discovery radius ~50 mi) */
const GEO_BUCKETS = {
  near: [
    { ...SF, city: 'San Francisco' },
    { lat: 37.8044, lon: -122.2712, city: 'Oakland', country: 'US' },
    { lat: 37.3382, lon: -121.8863, city: 'San Jose', country: 'US' },
    { lat: 37.5485, lon: -122.3088, city: 'San Mateo', country: 'US' },
  ],
  edge: [
    { lat: 38.52, lon: -122.42, city: 'Santa Rosa', country: 'US' }, // ~52 mi north
    { lat: 37.0, lon: -122.0, city: 'Santa Cruz', country: 'US' },
  ],
  outside: [
    { lat: 38.5816, lon: -121.4944, city: 'Sacramento', country: 'US' },
    { lat: 34.0522, lon: -118.2437, city: 'Los Angeles', country: 'US' },
  ],
  far: [
    { lat: 40.7128, lon: -74.006, city: 'New York', country: 'US' },
    { lat: 51.5074, lon: -0.1278, city: 'London', country: 'UK' },
    { lat: 35.6762, lon: 139.6503, city: 'Tokyo', country: 'JP' },
    { lat: 30.2672, lon: -97.7431, city: 'Austin', country: 'US' },
    { lat: 47.6062, lon: -122.3321, city: 'Seattle', country: 'US' },
    { lat: 48.8566, lon: 2.3522, city: 'Paris', country: 'FR' },
    { lat: 52.52, lon: 13.405, city: 'Berlin', country: 'DE' },
    { lat: 19.076, lon: 72.8777, city: 'Mumbai', country: 'IN' },
  ],
};

const FIRST_NAMES = {
  female: ['Sophia', 'Emma', 'Olivia', 'Ava', 'Mia', 'Charlotte', 'Amelia', 'Harper', 'Elena', 'Priya', 'Yuki', 'Fatima', 'Ingrid', 'Camila'],
  male: ['Liam', 'Noah', 'Ethan', 'Lucas', 'Mason', 'Oliver', 'James', 'Arjun', 'Diego', 'Kenji', 'Omar', 'Henrik', 'Marco', 'Theo'],
  'non-binary': ['River', 'Alex', 'Jordan', 'Quinn', 'Sage', 'Rowan', 'Taylor', 'Casey', 'Avery', 'Reese'],
};

const INTERESTS_POOL = [
  'Hiking', 'Coffee', 'Photography', 'Yoga', 'Cooking', 'Travel', 'Music', 'Art', 'Running', 'Reading',
  'Wine', 'Surfing', 'Gaming', 'Dancing', 'Film', 'Tech', 'Volunteering', 'Climbing', 'Meditation', 'Food',
];

const EDUCATION = ['High School', 'Some College', 'BA Psychology', 'BS Computer Science', 'MBA', 'MFA Design', 'MD', 'PhD Physics', 'Trade School', 'Bootcamp'];
const OCCUPATIONS = ['Software Engineer', 'Nurse', 'Teacher', 'Designer', 'Chef', 'Photographer', 'Consultant', 'Student', 'Architect', 'Musician', 'Founder', 'Analyst'];
const LIFESTYLES = ['Active', 'Social drinker', 'Non-smoker', 'Early riser', 'Night owl', 'Plant-based', 'Dog parent', 'Cat parent', 'Minimalist', 'Homebody'];
const RELATIONSHIP_GOALS = ['Long-term', 'Short-term fun', 'New friends', 'Not sure yet', 'Marriage-minded'];

const PROMPTS = [
  { q: 'A perfect Sunday looks like…', a: 'Farmers market, long walk, and trying a new recipe.' },
  { q: 'My most controversial opinion is…', a: 'Pineapple absolutely belongs on pizza.' },
  { q: 'Green flag I look for…', a: 'They remember the small details you mention.' },
  { q: 'Best travel story…', a: 'Got lost in Lisbon and found the best pasteis stand.' },
];

function pick(arr, i) {
  return arr[i % arr.length];
}

function shuffleSlice(arr, count, offset = 0) {
  const out = [];
  for (let i = 0; i < count; i++) out.push(arr[(offset + i) % arr.length]);
  return out;
}

function pairIds(a, b) {
  return a < b ? [a, b] : [b, a];
}

function hoursAgo(h) {
  return new Date(Date.now() - h * 60 * 60 * 1000);
}

function daysAgo(d) {
  return new Date(Date.now() - d * 24 * 60 * 60 * 1000);
}

function seedEmail(key) {
  return `${key}${SEED_EMAIL_SUFFIX}`;
}

function seedPhone(index) {
  return `${SEED_PHONE_PREFIX}${String(index).padStart(6, '0')}`;
}

function buildBio({ completion, withPrompts, interests, city }) {
  if (completion <= 20) return null;
  const base = completion >= 50 ? `Based in ${city}. ` : '';
  const interestLine = completion >= 50 ? `Into ${interests.slice(0, 3).join(', ')}.` : '';
  if (!withPrompts || completion < 80) return `${base}${interestLine}`.trim() || null;
  const p = pick(PROMPTS, interests.length);
  return `${base}${interestLine}\n\n${p.q}\n${p.a}`.trim();
}

function profileFieldsForCompletion(completion, geo, gender, age, interests) {
  const base = {
    age,
    gender,
    preference: gender === 'male' ? 'female' : gender === 'female' ? 'male' : 'everyone',
    latitude: geo.lat,
    longitude: geo.lon,
    hometown: geo.city,
    currentCity: `${geo.city}, ${geo.country}`,
    interests,
    completionScore: completion,
    profileQualityScore: Math.min(100, completion + 5),
  };
  if (completion >= 50) {
    base.bio = buildBio({ completion, withPrompts: false, interests, city: geo.city });
    base.relationshipGoals = pick(RELATIONSHIP_GOALS, age);
  }
  if (completion >= 80) {
    base.bio = buildBio({ completion, withPrompts: true, interests, city: geo.city });
    base.education = pick(EDUCATION, age);
    base.occupation = pick(OCCUPATIONS, age + interests.length);
    base.lifestyle = pick(LIFESTYLES, age);
    base.company = completion >= 100 ? 'Spark Labs' : undefined;
    base.height = 155 + (age % 30);
    base.languages = geo.country === 'US' ? ['English'] : ['English', geo.country === 'JP' ? 'Japanese' : 'Spanish'];
  }
  if (completion >= 100) {
    base.languages = ['English', 'Spanish'];
  }
  return base;
}

/** Generate ~56 filler personas + demo anchor = ~57; scenario users added separately → ~65 total */
function generatePersonas() {
  const personas = [];
  const genders = ['female', 'female', 'male', 'male', 'non-binary'];
  const completions = [20, 20, 50, 50, 80, 80, 100, 100];
  const geoKeys = ['near', 'near', 'edge', 'outside', 'far'];
  let phoneIndex = 2;

  for (let i = 0; i < 56; i++) {
    const gender = genders[i % genders.length];
    const names = FIRST_NAMES[gender];
    const name = `${pick(names, i)} ${String.fromCharCode(65 + (i % 26))}`;
    const key = `user-${String(i + 1).padStart(2, '0')}`;
    const completion = completions[i % completions.length];
    const geoBucket = geoKeys[i % geoKeys.length];
    const geo = pick(GEO_BUCKETS[geoBucket], i);
    const age = 21 + (i % 25);
    const interests = shuffleSlice(INTERESTS_POOL, 3 + (i % 4), i);
    const photoCount = i % 7 === 0 ? 0 : i % 3 === 0 ? 1 : 2 + (i % 3);
    const verified = i % 5 !== 0;
    const premium = i % 6 === 0;
    const visibility = i % 9 === 0 ? 'hidden' : 'public';
    const incognito = i % 11 === 0;
    const activity = i % 3 === 0 ? 'online' : i % 3 === 1 ? 'recent' : 'offline';
    const withPrompts = completion >= 80 && i % 2 === 0;

    personas.push({
      key,
      phone: seedPhone(phoneIndex++),
      email: seedEmail(key),
      name,
      verified,
      premium,
      premiumLevel: premium ? (i % 12 === 0 ? 2 : 1) : 0,
      completion,
      photoCount,
      withPrompts,
      visibility,
      incognito,
      activity,
      geo,
      preferredGender: i % 4 === 0 ? 'everyone' : gender === 'male' ? 'female' : gender === 'female' ? 'male' : 'everyone',
      ...profileFieldsForCompletion(completion, geo, gender, age, interests),
    });
  }
  return personas;
}

const SCENARIO_PERSONAS = [
  // Likes demo (one-way toward demo)
  { key: 'like-demo-01', name: 'Elena R', gender: 'female', age: 28, geo: GEO_BUCKETS.near[0], completion: 100, photoCount: 3, verified: true, role: 'likes_demo' },
  { key: 'like-demo-02', name: 'Sarah K', gender: 'female', age: 26, geo: GEO_BUCKETS.near[1], completion: 80, photoCount: 2, verified: true, role: 'likes_demo' },
  { key: 'like-demo-03', name: 'Jessica M', gender: 'female', age: 29, geo: GEO_BUCKETS.edge[0], completion: 80, photoCount: 2, verified: true, role: 'likes_demo' },
  { key: 'like-demo-04', name: 'Nina P', gender: 'female', age: 27, geo: GEO_BUCKETS.near[2], completion: 100, photoCount: 4, verified: true, role: 'likes_demo' },
  { key: 'like-demo-05', name: 'Aria T', gender: 'non-binary', age: 25, geo: GEO_BUCKETS.near[3], completion: 80, photoCount: 1, verified: true, role: 'likes_demo' },
  // Demo liked them (one-way from demo)
  { key: 'demo-liked-01', name: 'Chris L', gender: 'male', age: 30, geo: GEO_BUCKETS.near[0], completion: 100, photoCount: 2, verified: true, role: 'demo_liked' },
  { key: 'demo-liked-02', name: 'Derek W', gender: 'male', age: 32, geo: GEO_BUCKETS.outside[0], completion: 50, photoCount: 1, verified: true, role: 'demo_liked' },
  { key: 'demo-liked-03', name: 'Sam H', gender: 'non-binary', age: 27, geo: GEO_BUCKETS.far[0], completion: 80, photoCount: 3, verified: false, role: 'demo_liked' },
  // Mutual matches
  { key: 'match-01', name: 'Maya S', gender: 'female', age: 26, geo: GEO_BUCKETS.near[0], completion: 100, photoCount: 3, verified: true, role: 'match_chat' },
  { key: 'match-02', name: 'Rachel B', gender: 'female', age: 24, geo: GEO_BUCKETS.near[1], completion: 80, photoCount: 2, verified: true, role: 'match_chat_unread' },
  { key: 'match-03', name: 'Tom V', gender: 'male', age: 31, geo: GEO_BUCKETS.edge[0], completion: 100, photoCount: 2, verified: true, role: 'match_chat' },
  { key: 'match-04', name: 'Leo F', gender: 'male', age: 29, geo: GEO_BUCKETS.near[2], completion: 80, photoCount: 1, verified: true, role: 'match_chat' },
  // Block / report
  { key: 'blocked-by-demo', name: 'Blake C', gender: 'male', age: 33, geo: GEO_BUCKETS.outside[1], completion: 50, photoCount: 1, verified: true, role: 'blocked_by_demo' },
  { key: 'blocks-demo', name: 'Vera N', gender: 'female', age: 34, geo: GEO_BUCKETS.far[1], completion: 80, photoCount: 2, verified: true, role: 'blocks_demo' },
  { key: 'reported-01', name: 'Rex D', gender: 'male', age: 36, geo: GEO_BUCKETS.far[2], completion: 20, photoCount: 0, verified: false, role: 'reported' },
  { key: 'reported-02', name: 'Luna G', gender: 'female', age: 22, geo: GEO_BUCKETS.far[3], completion: 50, photoCount: 1, verified: false, role: 'reported_by_demo' },
];

function expandScenarioPersona(raw, phoneIndex) {
  const interests = shuffleSlice(INTERESTS_POOL, 4, phoneIndex);
  return {
    phone: seedPhone(phoneIndex),
    email: seedEmail(raw.key),
    verified: raw.verified ?? true,
    premium: false,
    premiumLevel: 0,
    visibility: 'public',
    incognito: false,
    activity: 'recent',
    withPrompts: raw.completion >= 80,
    preferredGender: 'everyone',
    photoCount: raw.photoCount ?? 2,
    ...raw,
    ...profileFieldsForCompletion(raw.completion, raw.geo, raw.gender, raw.age, interests),
    interests,
    name: raw.name,
  };
}

const DEMO_PERSONA = {
  key: 'demo',
  phone: seedPhone(1),
  email: seedEmail('demo'),
  name: 'Alex Morgan',
  gender: 'male',
  age: 28,
  preference: 'female',
  verified: true,
  premium: true,
  premiumLevel: 2,
  completion: 100,
  photoCount: 4,
  withPrompts: true,
  visibility: 'public',
  incognito: false,
  activity: 'online',
  geo: GEO_BUCKETS.near[0],
  preferredGender: 'female',
  interests: ['Coffee', 'Hiking', 'Photography', 'Travel'],
  ...profileFieldsForCompletion(100, GEO_BUCKETS.near[0], 'male', 28, ['Coffee', 'Hiking', 'Photography', 'Travel']),
};

async function clearSeedData() {
  const seedUsers = await prisma.user.findMany({
    where: { email: { endsWith: SEED_EMAIL_SUFFIX } },
    select: { id: true },
  });
  const ids = seedUsers.map((u) => u.id);
  if (!ids.length) {
    console.log('No prior seed data to clear.');
    return;
  }

  console.log(`Clearing ${ids.length} seed users and related data…`);

  const matches = await prisma.match.findMany({
    where: { OR: [{ user1Id: { in: ids } }, { user2Id: { in: ids } }] },
    select: { id: true },
  });
  const matchIds = matches.map((m) => m.id);

  const conversations = await prisma.conversation.findMany({
    where: {
      OR: [
        { matchId: { in: matchIds } },
        { participants: { some: { userId: { in: ids } } } },
      ],
    },
    select: { id: true },
  });
  const convIds = conversations.map((c) => c.id);

  if (convIds.length) {
    const messages = await prisma.message.findMany({
      where: { conversationId: { in: convIds } },
      select: { id: true },
    });
    const msgIds = messages.map((m) => m.id);
    if (msgIds.length) {
      await prisma.messageStatus.deleteMany({ where: { messageId: { in: msgIds } } });
      await prisma.attachment.deleteMany({ where: { messageId: { in: msgIds } } });
      await prisma.message.deleteMany({ where: { id: { in: msgIds } } });
    }
    await prisma.conversationSummary.deleteMany({ where: { conversationId: { in: convIds } } });
    await prisma.participant.deleteMany({ where: { conversationId: { in: convIds } } });
    await prisma.conversation.deleteMany({ where: { id: { in: convIds } } });
  }

  if (matchIds.length) {
    await prisma.relationshipMemory.deleteMany({ where: { matchId: { in: matchIds } } });
    await prisma.matchMetadata.deleteMany({ where: { matchId: { in: matchIds } } });
    await prisma.match.deleteMany({ where: { id: { in: matchIds } } });
  }

  await prisma.relationship.deleteMany({
    where: { OR: [{ user1Id: { in: ids } }, { user2Id: { in: ids } }] },
  });
  await prisma.interactionHistory.deleteMany({
    where: { OR: [{ actorId: { in: ids } }, { targetId: { in: ids } }] },
  });
  await prisma.swipe.deleteMany({
    where: { OR: [{ swiperId: { in: ids } }, { targetId: { in: ids } }] },
  });
  await prisma.block.deleteMany({
    where: { OR: [{ blockerId: { in: ids } }, { blockedId: { in: ids } }] },
  });
  await prisma.mute.deleteMany({
    where: { OR: [{ muterId: { in: ids } }, { mutedId: { in: ids } }] },
  });
  await prisma.report.deleteMany({
    where: { OR: [{ reporterId: { in: ids } }, { reportedId: { in: ids } }] },
  });

  const subs = await prisma.subscription.findMany({
    where: { userId: { in: ids } },
    select: { id: true },
  });
  const subIds = subs.map((s) => s.id);
  if (subIds.length) {
    await prisma.entitlement.deleteMany({ where: { subscriptionId: { in: subIds } } });
    await prisma.purchase.deleteMany({ where: { subscriptionId: { in: subIds } } });
    await prisma.subscription.deleteMany({ where: { id: { in: subIds } } });
  }

  await prisma.reward.deleteMany({ where: { userId: { in: ids } } });
  await prisma.referral.deleteMany({
    where: { OR: [{ referrerId: { in: ids } }, { refereeId: { in: ids } }] },
  });
  await prisma.achievementProgress.deleteMany({ where: { userId: { in: ids } } });
  await prisma.reputation.deleteMany({ where: { userId: { in: ids } } });
  await prisma.riskAssessment.deleteMany({ where: { userId: { in: ids } } });
  await prisma.restriction.deleteMany({ where: { userId: { in: ids } } });
  await prisma.appeal.deleteMany({ where: { userId: { in: ids } } });
  await prisma.coupon.deleteMany({ where: { userId: { in: ids } } });
  await prisma.compatibilityProfile.deleteMany({
    where: { OR: [{ user1Id: { in: ids } }, { user2Id: { in: ids } }] },
  });
  await prisma.discoveryMetric.deleteMany({ where: { userId: { in: ids } } });
  await prisma.refreshToken.deleteMany({ where: { userId: { in: ids } } });

  await prisma.user.deleteMany({ where: { id: { in: ids } } });
  console.log('Seed data cleared.');
}

async function ensureGrowthCatalog() {
  const features = [
    { key: 'unlimited_swipes', name: 'Unlimited Swipes' },
    { key: 'read_receipts', name: 'Read Receipts' },
    { key: 'priority_discovery', name: 'Priority Discovery' },
    { key: 'incognito', name: 'Incognito Mode' },
    { key: 'see_who_liked_you', name: 'See Who Liked You' },
  ];
  for (const f of features) {
    await prisma.feature.upsert({
      where: { key: f.key },
      update: { name: f.name },
      create: f,
    });
  }

  let premium = await prisma.plan.findFirst({ where: { name: 'Spark Premium' } });
  if (!premium) {
    premium = await prisma.plan.create({
      data: { name: 'Spark Premium', level: 1, price: 19.99, currency: 'USD', interval: 'month' },
    });
  }
  let platinum = await prisma.plan.findFirst({ where: { name: 'Spark Platinum' } });
  if (!platinum) {
    platinum = await prisma.plan.create({
      data: { name: 'Spark Platinum', level: 2, price: 34.99, currency: 'USD', interval: 'month' },
    });
  }
  return { premium, platinum, features };
}

async function createSeedUser(persona, passwordHash, plans) {
  const lastLoginAt =
    persona.activity === 'online' ? new Date() :
    persona.activity === 'recent' ? hoursAgo(3) :
    daysAgo(45);

  const user = await prisma.user.create({
    data: {
      phone: persona.phone,
      email: persona.email,
      emailVerified: persona.verified,
      passwordHash,
      status: 'active',
      onboardingStep: persona.completion >= 80 ? 'complete' : persona.completion >= 50 ? 'photos' : 'profile',
      onboardingComplete: persona.completion >= 80,
      lastLoginAt,
    },
  });

  const profile = await prisma.profile.create({
    data: {
      userId: user.id,
      name: persona.name,
      age: persona.age,
      gender: persona.gender,
      preference: persona.preference ?? persona.preferredGender,
      bio: persona.bio ?? null,
      occupation: persona.occupation ?? null,
      education: persona.education ?? null,
      company: persona.company ?? null,
      height: persona.height ?? null,
      languages: persona.languages ?? [],
      interests: persona.interests ?? [],
      relationshipGoals: persona.relationshipGoals ?? null,
      lifestyle: persona.lifestyle ?? null,
      hometown: persona.hometown ?? persona.geo?.city ?? null,
      currentCity: persona.currentCity ?? null,
      latitude: persona.latitude ?? persona.geo?.lat ?? null,
      longitude: persona.longitude ?? persona.geo?.lon ?? null,
      elo: 1050 + (persona.age % 300),
      completionScore: persona.completion,
      profileQualityScore: persona.profileQualityScore ?? persona.completion,
    },
  });

  await prisma.preference.create({
    data: {
      userId: user.id,
      preferredGender: persona.preferredGender ?? 'everyone',
      minAge: 21,
      maxAge: 45,
      maxDistance: 50,
      relationshipType: persona.relationshipGoals ?? null,
      lifestylePreferences: persona.lifestyle ? [persona.lifestyle] : [],
      visibility: persona.visibility ?? 'public',
    },
  });

  await prisma.setting.create({
    data: {
      userId: user.id,
      showOnlineStatus: persona.incognito ? false : persona.activity !== 'offline',
      showDistance: !persona.incognito,
      showAge: true,
      incognitoMode: persona.incognito ?? false,
    },
  });

  if (persona.photoCount > 0) {
    for (let p = 0; p < persona.photoCount; p++) {
      const photo = await prisma.photo.create({
        data: {
          profileId: profile.id,
          url: placeholderPhoto(persona.key, p),
          key: `${SEED_TAG}/${persona.key}/${p}`,
          isPrimary: p === 0,
          order: p,
          mimeType: 'image/jpeg',
        },
      });
      if (p === 0 && persona.verified) {
        await prisma.photoVerification.create({
          data: {
            photoId: photo.id,
            status: 'approved',
            trustScore: 85 + (p % 10),
            providerName: 'seed',
          },
        });
      }
    }
  }

  if (persona.premium && plans) {
    const plan = persona.premiumLevel >= 2 ? plans.platinum : plans.premium;
    const periodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const sub = await prisma.subscription.create({
      data: {
        userId: user.id,
        planId: plan.id,
        status: 'active',
        provider: 'mock',
        providerSubscriptionId: `seed_sub_${persona.key}`,
        currentPeriodEnd: periodEnd,
      },
    });
    const featureKeys =
      persona.premiumLevel >= 2
        ? ['unlimited_swipes', 'read_receipts', 'priority_discovery', 'incognito', 'see_who_liked_you']
        : ['unlimited_swipes', 'read_receipts', 'see_who_liked_you'];
    for (const fk of featureKeys) {
      const feature = await prisma.feature.findUnique({ where: { key: fk } });
      if (feature) {
        await prisma.entitlement.create({
          data: { subscriptionId: sub.id, featureId: feature.id, active: true },
        });
      }
    }
  }

  return { user, profile };
}

async function createSwipe(swiperId, targetId, rating) {
  await prisma.swipe.upsert({
    where: { swiperId_targetId: { swiperId, targetId } },
    update: { rating },
    create: { swiperId, targetId, rating },
  });
}

async function createMatchWithChat(userAId, userBId, messages, { unreadForUserId = null } = {}) {
  const [user1Id, user2Id] = pairIds(userAId, userBId);
  const match = await prisma.match.create({
    data: { user1Id, user2Id },
  });

  await prisma.relationship.upsert({
    where: { user1Id_user2Id: { user1Id, user2Id } },
    update: { status: 'MATCHED' },
    create: { user1Id, user2Id, status: 'MATCHED' },
  });

  await createSwipe(userAId, userBId, 'like');
  await createSwipe(userBId, userAId, 'like');

  const conversation = await prisma.conversation.create({
    data: {
      matchId: match.id,
      participants: {
        create: [
          { userId: userAId, lastReadAt: unreadForUserId === userAId ? hoursAgo(24) : new Date() },
          { userId: userBId, lastReadAt: unreadForUserId === userBId ? hoursAgo(24) : new Date() },
        ],
      },
    },
    include: { participants: true },
  });

  let lastMessageId = null;
  for (const msg of messages) {
    const created = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        senderId: msg.senderId,
        type: 'TEXT',
        content: msg.text,
        createdAt: msg.at ?? new Date(),
      },
    });
    lastMessageId = created.id;

    const recipientId = msg.senderId === userAId ? userBId : userAId;
    const isUnread = unreadForUserId === recipientId;
    await prisma.messageStatus.create({
      data: {
        messageId: created.id,
        userId: recipientId,
        status: isUnread ? 'DELIVERED' : 'READ',
      },
    });
    await prisma.messageStatus.create({
      data: {
        messageId: created.id,
        userId: msg.senderId,
        status: 'READ',
      },
    });
  }

  if (lastMessageId) {
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { lastMessageId },
    });
  }

  return { match, conversation };
}

async function seedRelationships(userMap, demoId) {
  // One-way likes toward demo (likes-received)
  for (const key of ['like-demo-01', 'like-demo-02', 'like-demo-03', 'like-demo-04', 'like-demo-05']) {
    const likerId = userMap[key];
    await createSwipe(likerId, demoId, 'like');
    const [u1, u2] = pairIds(likerId, demoId);
    await prisma.relationship.upsert({
      where: { user1Id_user2Id: { user1Id: u1, user2Id: u2 } },
      update: { status: 'LIKED' },
      create: { user1Id: u1, user2Id: u2, status: 'LIKED' },
    });
  }

  // Demo liked them (no reciprocation)
  for (const key of ['demo-liked-01', 'demo-liked-02', 'demo-liked-03']) {
    const targetId = userMap[key];
    await createSwipe(demoId, targetId, 'like');
    const [u1, u2] = pairIds(demoId, targetId);
    await prisma.relationship.upsert({
      where: { user1Id_user2Id: { user1Id: u1, user2Id: u2 } },
      update: { status: 'LIKED' },
      create: { user1Id: u1, user2Id: u2, status: 'LIKED' },
    });
  }

  // Mutual matches + conversations
  await createMatchWithChat(demoId, userMap['match-01'], [
    { senderId: userMap['match-01'], text: 'Hey Alex! Loved your hiking photos.', at: hoursAgo(48) },
    { senderId: demoId, text: 'Thanks Maya! Want to try Land\'s End this weekend?', at: hoursAgo(47) },
    { senderId: userMap['match-01'], text: 'Absolutely — Saturday morning?', at: hoursAgo(46) },
  ]);

  await createMatchWithChat(demoId, userMap['match-02'], [
    { senderId: demoId, text: "Hi Rachel — how's your week going?", at: hoursAgo(5) },
    { senderId: userMap['match-02'], text: 'Pretty good! Just got back from a coffee crawl.', at: hoursAgo(4) },
    { senderId: userMap['match-02'], text: 'You should check out the new place on Valencia.', at: hoursAgo(2) },
  ], { unreadForUserId: demoId });

  await createMatchWithChat(demoId, userMap['match-03'], [
    { senderId: userMap['match-03'], text: 'That concert last night was incredible.', at: hoursAgo(72) },
    { senderId: demoId, text: 'Right? We should do a vinyl shop crawl next.', at: hoursAgo(70) },
  ]);

  await createMatchWithChat(demoId, userMap['match-04'], [
    { senderId: demoId, text: 'Leo! Still up for tennis Sunday?', at: hoursAgo(12) },
    { senderId: userMap['match-04'], text: 'Yes — 10am at Golden Gate Park?', at: hoursAgo(11) },
  ]);

  // Extra mutual match between fillers (no chat)
  const fillerA = userMap['user-10'];
  const fillerB = userMap['user-11'];
  const [u1, u2] = pairIds(fillerA, fillerB);
  await prisma.match.create({ data: { user1Id: u1, user2Id: u2 } });
  await createSwipe(fillerA, fillerB, 'like');
  await createSwipe(fillerB, fillerA, 'like');

  // Blocks
  await prisma.block.create({
    data: { blockerId: demoId, blockedId: userMap['blocked-by-demo'] },
  });
  await prisma.block.create({
    data: { blockerId: userMap['blocks-demo'], blockedId: demoId },
  });
  const [b1, b2] = pairIds(demoId, userMap['blocked-by-demo']);
  await prisma.relationship.upsert({
    where: { user1Id_user2Id: { user1Id: b1, user2Id: b2 } },
    update: { status: 'BLOCKED' },
    create: { user1Id: b1, user2Id: b2, status: 'BLOCKED' },
  });

  // Reports
  await prisma.report.create({
    data: {
      reporterId: userMap['reported-02'],
      reportedId: userMap['reported-01'],
      targetType: 'USER',
      targetId: userMap['reported-01'],
      reasonCategory: 'SPAM',
      customReason: 'Seed scenario: spammy messages',
      status: 'PENDING',
      evidenceUrls: [],
    },
  });
  await prisma.report.create({
    data: {
      reporterId: demoId,
      reportedId: userMap['reported-02'],
      targetType: 'USER',
      targetId: userMap['reported-02'],
      reasonCategory: 'HARASSMENT',
      customReason: 'Seed scenario: demo filed report',
      status: 'REVIEWING',
      evidenceUrls: [],
    },
  });
}

async function main() {
  console.log(`Spark seed (${SEED_TAG}) starting…`);
  await clearSeedData();
  const plans = await ensureGrowthCatalog();

  const passwordHash = await bcrypt.hash(SEED_PASSWORD, 10);
  const userMap = {};

  const allPersonas = [
    DEMO_PERSONA,
    ...SCENARIO_PERSONAS.map((s, i) => expandScenarioPersona(s, 100 + i)),
    ...generatePersonas(),
  ];

  console.log(`Creating ${allPersonas.length} seed users…`);
  for (const persona of allPersonas) {
    const { user } = await createSeedUser(persona, passwordHash, plans);
    userMap[persona.key] = user.id;
  }

  console.log('Seeding relationships, matches, and conversations…');
  await seedRelationships(userMap, userMap.demo);

  console.log(`
Seed complete.
  Users:    ${allPersonas.length}
  Tag:      email *${SEED_EMAIL_SUFFIX}, phone ${SEED_PHONE_PREFIX}*
  Demo:     demo@spark-dev.seed / ${SEED_PASSWORD}
  Photos:   picsum.photos placeholders (dev-only — see prisma/seed/README.md)
`);
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
