import prisma from './prisma';
import { getBlindIndex, encryptText } from './encryption';

export async function seedIfNeeded(studentId: string, selectedHubCity = 'Thornton', studentName = 'Alex Broussard') {
  try {
    // 1. Seed Hubs
    let thorntonHub = await prisma.hub.findFirst({ where: { city: 'Thornton' } });
    if (!thorntonHub) {
      thorntonHub = await prisma.hub.create({
        data: { name: 'Thornton Studio Hub', city: 'Thornton', address: '1280 Civic Center Dr' }
      });
    }

    let westminsterHub = await prisma.hub.findFirst({ where: { city: 'Westminster' } });
    if (!westminsterHub) {
      westminsterHub = await prisma.hub.create({
        data: { name: 'Westminster Studio Hub', city: 'Westminster', address: '8800 Sheridan Blvd' }
      });
    }

    let broomfieldHub = await prisma.hub.findFirst({ where: { city: 'Broomfield' } });
    if (!broomfieldHub) {
      broomfieldHub = await prisma.hub.create({
        data: { name: 'Broomfield Studio Hub', city: 'Broomfield', address: '3000 E 1st Ave' }
      });
    }

    // 2. Seed Directors / Staff
    let director = await prisma.staff.findFirst({ where: { role: 'DIRECTOR' } });
    if (!director) {
      director = await prisma.staff.create({
        data: {
          userId: 'mock-director-auth',
          email: 'evelyn@nextstage.com',
          name: 'Evelyn Pierce',
          role: 'DIRECTOR',
          hourlyRate: 30.0,
          hubId: thorntonHub.id
        }
      });
    }

    let instructor = await prisma.staff.findFirst({ where: { role: 'INSTRUCTOR' } });
    if (!instructor) {
      instructor = await prisma.staff.create({
        data: {
          userId: 'mock-instructor-auth',
          email: 'marcus@nextstage.com',
          name: 'Marcus Vane',
          role: 'INSTRUCTOR',
          hourlyRate: 26.0,
          hubId: thorntonHub.id
        }
      });
    }

    // 3. Seed Cohorts for all 3 hubs (each needs Teen Rock, All Stars, Adult Jam)
    const hubs = [thorntonHub, westminsterHub, broomfieldHub];
    for (const h of hubs) {
      // Teen Rock
      let teenRock = await prisma.bandCohort.findFirst({
        where: { hubId: h.id, ageGroup: '13-17', name: `${h.city} Teen Rock` }
      });
      if (!teenRock) {
        await prisma.bandCohort.create({
          data: {
            name: `${h.city} Teen Rock`,
            ageGroup: '13-17',
            scheduleDay: 'Tuesday',
            scheduleSlot: '4:00 PM - 5:30 PM',
            hubId: h.id,
            directorId: director.id,
            showcaseTheme: `${h.city} Summer Rock Showcase`,
            showcaseVenue: `${h.city} Community Arena`
          }
        });
      }

      // All Stars
      let allStars = await prisma.bandCohort.findFirst({
        where: { hubId: h.id, ageGroup: '13-17', name: `${h.city} All Stars` }
      });
      if (!allStars) {
        await prisma.bandCohort.create({
          data: {
            name: `${h.city} All Stars`,
            ageGroup: '13-17',
            scheduleDay: 'Wednesday',
            scheduleSlot: '5:30 PM - 7:00 PM',
            hubId: h.id,
            directorId: director.id,
            showcaseTheme: `${h.city} Regional Festival Set`,
            showcaseVenue: 'Red Rocks Amphitheater'
          }
        });
      }

      // Adult Jam
      let adultJam = await prisma.bandCohort.findFirst({
        where: { hubId: h.id, ageGroup: '18+', name: `${h.city} Adult Jam` }
      });
      if (!adultJam) {
        await prisma.bandCohort.create({
          data: {
            name: `${h.city} Adult Jam`,
            ageGroup: '18+',
            scheduleDay: 'Wednesday',
            scheduleSlot: '7:00 PM - 8:30 PM',
            hubId: h.id,
            directorId: instructor.id,
            showcaseTheme: `${h.city} Late Night Jam Session`,
            showcaseVenue: `${h.city} Live Backline Studio`
          }
        });
      }
    }

    // 4. Seed Vault Items
    const vaultCount = await prisma.vaultItem.count();
    if (vaultCount === 0) {
      await prisma.vaultItem.createMany({
        data: [
          {
            title: "Livin' on a Prayer",
            artist: "Bon Jovi",
            type: "TAB",
            category: "all",
            url: "https://www.musicnotes.com/sheetmusic/mtd.asp?ppn=MN0104647",
            description: "Complete ensemble chart containing keyboard patch maps, drum dynamics, bass riffs, and lead guitar solos.",
            thumbnail: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=300&q=80"
          },
          {
            title: "Sweet Child O' Mine",
            artist: "Guns N' Roses",
            type: "TAB",
            category: "guitar",
            url: "https://www.musicnotes.com/sheetmusic/mtd.asp?ppn=MN0053782",
            description: "Detailed guitar tablature covering Slash's legendary opening riff, chorus rhythms, and full outro solo.",
            thumbnail: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=300&q=80"
          },
          {
            title: "Jump",
            artist: "Van Halen",
            type: "TAB",
            category: "synth/keys",
            url: "https://www.musicnotes.com/sheetmusic/mtd.asp?ppn=MN0063991",
            description: "Synth/Keys lead sheet with keyboard settings, synth drawbars, and chord voicings for the iconic OB-Xa theme.",
            thumbnail: "https://images.unsplash.com/photo-1552422535-c45813c61732?w=300&q=80"
          },
          {
            title: "Mastering the Pentatonic Scale",
            artist: "Marcus Vane",
            type: "VIDEO",
            category: "guitar",
            url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            description: "Coach Marcus walks through the 5 shapes of the pentatonic scale and demonstrates how to connect them for solos.",
            thumbnail: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&q=80"
          },
          {
            title: "Dynamic Drum Fills for Rock Ensembles",
            artist: "Cooper",
            type: "VIDEO",
            category: "drums",
            url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            description: "Learn how to execute clean rock fills while maintaining timing alignment with the metronome. Exercises included.",
            thumbnail: "https://images.unsplash.com/photo-1524230572899-a752b3835840?w=300&q=80"
          },
          {
            title: "Songwriting & Arrangement Masterclass",
            artist: "Evelyn Pierce",
            type: "MASTERCLASS",
            category: "all",
            url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            description: "Archived recording of Evelyn's Masterclass. Covers lyric structuring, hooks, chord progressions, and vocal delivery.",
            thumbnail: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=300&q=80"
          },
          {
            title: "Live Stage Performance & Visual Dynamics",
            artist: "Clara Sterling",
            type: "MASTERCLASS",
            category: "all",
            url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            description: "Archived recording. Clara explains cueing, stage positioning, microphone control, and connecting with live audiences.",
            thumbnail: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=300&q=80"
          }
        ]
      });
    }

    // 5. Seed Gear Items
    const gearCount = await prisma.gearItem.count();
    if (gearCount === 0) {
      await prisma.gearItem.createMany({
        data: [
          {
            name: "Hal Leonard Guitar Method Complete Edition",
            category: "books",
            price: 24.99,
            image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&q=80",
            description: "Perfect for students. Includes books 1, 2, and 3 with audio access instruction links.",
            stock: 15
          },
          {
            name: "Modern Method for Guitar - Vol 1",
            category: "books",
            price: 14.99,
            image: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=400&q=80",
            description: "Berklee College of Music foundational method. Focuses on reading, technique, and basic chords.",
            stock: 20
          },
          {
            name: "Gibson Les Paul Tribute (Satin Cherry)",
            category: "guitar",
            price: 1299.99,
            image: "https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=400&q=80",
            description: "Classic mahogany body, maple top, humbucker pickups. Made in USA. Includes premium gig bag.",
            stock: 3
          },
          {
            name: "Fender Player Stratocaster (Polar White)",
            category: "guitar",
            price: 849.99,
            image: "https://images.unsplash.com/photo-1525201548942-d8c8b097a300?w=400&q=80",
            description: "The classic rock tone. Alder body, maple neck, three single-coil pickups, synchronized tremolo.",
            stock: 5
          },
          {
            name: "Fender Player Precision Bass (Tidepool)",
            category: "bass",
            price: 899.99,
            image: "https://images.unsplash.com/photo-1485672483159-899510d71c4e?w=400&q=80",
            description: "Punchy, foundational low-end. Single split-coil pickup, master volume and tone, modern C neck.",
            stock: 4
          },
          {
            name: "Sterling by Music Man SUB StingRay",
            category: "bass",
            price: 349.99,
            image: "https://images.unsplash.com/photo-1485672483159-899510d71c4e?w=400&q=80",
            description: "Perfect student bass. Active preamp, humbucker pickup, low noise, and massive classic output.",
            stock: 6
          },
          {
            name: "Korg Minilogue XD Hybrid Synthesizer",
            category: "synth/keys",
            price: 649.99,
            image: "https://images.unsplash.com/photo-1612476595561-c852467389a9?w=400&q=80",
            description: "4-voice polyphonic hybrid synthesizer. Analog plus multi-engine digital oscillator, customizable effects.",
            stock: 2
          },
          {
            name: "Novation Launchkey 49 MK3",
            category: "synth/keys",
            price: 229.99,
            image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&q=80",
            description: "Premium MIDI controller keyboard with scale and chord modes, 16 velocity pads, and DAW integrations.",
            stock: 8
          },
          {
            name: "Yamaha Stage Custom Birch Shell Pack",
            category: "drums",
            price: 699.99,
            image: "https://images.unsplash.com/photo-1524230572899-a752b3835840?w=400&q=80",
            description: "100% birch shells. Complete 5-piece configuration. Crisp projection, great for rehearsals and stage.",
            stock: 2
          },
          {
            name: "Focusrite Scarlett 2i2 USB Interface",
            category: "audio production",
            price: 179.99,
            image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&q=80",
            description: "Dual preamps, Air mode, high-headroom instrument inputs. The standard interface for home recording.",
            stock: 10
          }
        ]
      });
    }

    // 6. Seed Bulletin Notes
    const bulletinCount = await prisma.bulletinNote.count();
    if (bulletinCount === 0) {
      await prisma.bulletinNote.createMany({
        data: [
          {
            authorName: "Marcus Vane",
            authorRole: "INSTRUCTOR",
            content: "Great job at the rehearsal last night, Teen Rock band! The drums and bass groove were locked in. Guitarists, make sure to work on the syncopated rhythm in the bridge of 'Sweet Child O' Mine' before our next slot."
          },
          {
            authorName: "Evelyn Pierce",
            authorRole: "DIRECTOR",
            content: "Welcome all new students! Remember that our next live showcase 'Summer Jams' is scheduled at the Filmore Auditorium. Setlists have been posted. Access your charts and get practicing!"
          },
          {
            authorName: "Alex Broussard",
            authorRole: "STUDENT",
            content: "Hey team! Anyone in the Adult Jam cohort interested in practicing after-hours on Thursday? I want to run through the 'Livin' on a Prayer' keyboard solo again."
          }
        ]
      });
    }

    // 7. Ensure Student details exist in the database (Self-healing mock login creation)
    let student = await prisma.student.findUnique({
      where: { id: studentId }
    });

    if (!student) {
      const email = studentId.includes('@') ? studentId : 'alex@broussard.com';
      const emailHash = getBlindIndex(email.toLowerCase());
      const emailEnc = encryptText(email.toLowerCase());
      const targetHub = await prisma.hub.findFirst({ where: { city: selectedHubCity } }) || thorntonHub;

      student = await prisma.student.create({
        data: {
          id: studentId,
          userId: `mock-auth0-${studentId}`,
          name: studentName,
          emailEncrypted: emailEnc,
          emailHash: emailHash,
          hubId: targetHub.id,
          cohortId: null, // Keep them UNASSIGNED initially so they see the Enrollment Wizard
          stripeCustomerId: `cus_${Math.random().toString(36).substring(2, 10)}`,
          subscriptionStatus: 'ACTIVE',
          instrument: 'Keyboard',
          age: 15
        }
      });
    }

    // 8. If they already have a cohort, seed setlist songs for it
    if (student.cohortId) {
      const cohort = await prisma.bandCohort.findUnique({
        where: { id: student.cohortId },
        include: { setlistSongs: true }
      });

      if (cohort && cohort.setlistSongs.length === 0) {
        await prisma.setlistSong.createMany({
          data: [
            {
              cohortId: cohort.id,
              title: "Livin' on a Prayer",
              artist: "Bon Jovi",
              progress: 80
            },
            {
              cohortId: cohort.id,
              title: "Sweet Child O' Mine",
              artist: "Guns N' Roses",
              progress: 60
            },
            {
              cohortId: cohort.id,
              title: "Jump",
              artist: "Van Halen",
              progress: 40
            }
          ]
        });
      }
    }
  } catch (err) {
    console.error("[dbSeeder Error]:", err);
  }
}
