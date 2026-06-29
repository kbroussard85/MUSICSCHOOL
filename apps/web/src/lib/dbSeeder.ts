import prisma from './prisma';

export async function seedIfNeeded(studentId: string) {
  try {
    // 1. Seed Vault Items
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

    // 2. Seed Gear Items
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

    // 3. Seed Bulletin Notes
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

    // 4. Ensure Showcase info & Setlist songs for the student's cohort
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: { cohort: { include: { setlistSongs: true } } }
    });

    if (student && student.cohortId) {
      const cohort = student.cohort;
      if (cohort) {
        // Update Showcase details if not set
        if (!cohort.showcaseTheme || !cohort.showcaseVenue) {
          await prisma.bandCohort.update({
            where: { id: cohort.id },
            data: {
              showcaseTheme: "Summer Arena Rock Showcase",
              showcaseVenue: "The Filmore Auditorium",
              showcaseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
            }
          });
        }

        // Seed setlist songs if none exist
        if (cohort.setlistSongs.length === 0) {
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
    }
  } catch (err) {
    console.error("[dbSeeder Error]:", err);
  }
}
