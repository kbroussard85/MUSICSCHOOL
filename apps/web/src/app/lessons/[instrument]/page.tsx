'use client';

import React from 'react';
import Link from 'next/link';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';

// Define program details with custom copy and available teachers per instrument
const instrumentData: Record<string, {
  title: string;
  tagline: string;
  description: string;
  curriculum: string[];
  skills: string[];
  instructor: {
    name: string;
    role: string;
    bio: string;
    image: string;
    skills: string[];
  };
}> = {
  guitar: {
    title: 'Guitar Program',
    tagline: 'From bedroom practice to main-stage riffs and solos.',
    description: 'Learn guitar in a dynamic performance environment. We combine standard chord vocabulary, sweep picking, modal scale theory, and fretboard geography with rehearsals in real bands, preparing you to perform live on stage.',
    curriculum: [
      'Basic Chord Forms & Pentatonic Scales',
      'Advanced Shredding & Improvisation Workshops',
      'Stage Setup, Pedalboards & Tone Dialing',
      'Rhythm chemistry and locking in with a bassist'
    ],
    skills: ['Acoustic', 'Electric', 'Lead Riffing', 'Improvisation', 'Music Theory'],
    instructor: {
      name: 'Prof. Marcus Vane',
      role: 'Lead Guitar Instructor & Ensemble Coach',
      bio: "Marcus has spent over 15 years touring globally with prominent alternative rock outfits and holds a Master's in Music Performance from the Berklee College of Music. He specializes in improvisation, guitar mechanics, and stage chemistry.",
      image: '🎸',
      skills: ['Touring Artist', 'Berklee Alum', 'Stage Presence Master']
    }
  },
  bass: {
    title: 'Bass Guitar Program',
    tagline: 'Define the groove, hold the pocket, lock the rhythm.',
    description: 'Master the core driving force of any rock, pop, or funk band. Our bass program focuses on locking in with the drummer, reading charts, slap-and-pop dynamics, and structural rhythm theory.',
    curriculum: [
      'Fretboard pocket control and timing exercises',
      'Slap, pop, and fingerstyle performance dynamics',
      'Basslines construction and chord progression tracking',
      'Amps, preamps, and live sound mix adjustments'
    ],
    skills: ['Electric Bass', 'Slap & Pop', 'Pocket Playing', 'Groove Mechanics', 'Rhythm Sync'],
    instructor: {
      name: 'Prof. Liam Sterling',
      role: 'Bass Guitar Specialist & Rhythm Coach',
      bio: 'Liam is a seasoned session bassist and grooves coach who has worked with multiple Billboard-charting pop-rock acts. He focuses on pocket playing, slap techniques, and locking in with the drum kit.',
      image: '🎻',
      skills: ['Session Player', 'Billboard Producer', 'Groove Theorist']
    }
  },
  keys: {
    title: 'Piano & Keyboards Program',
    tagline: 'Classic keys foundations meet modern synth performance.',
    description: 'Unlock classical key techniques alongside modern electronic synth design. You will study classical hand posture, chord inversions, sheet music reading, patch programming, and multi-keyboard live setup setups.',
    curriculum: [
      'Classical hand mechanics and scale exercises',
      'Synthesizer configurations and patch programming',
      'Live arrangement voicing and backing pads',
      'Dynamic range control and live stage mixing'
    ],
    skills: ['Grand Piano', 'Synthesizers', 'MIDI Controls', 'Arrangement', 'Sight Reading'],
    instructor: {
      name: 'Dr. Evelyn Pierce',
      role: 'Head of Piano Studies & Synthesizer Director',
      bio: 'Evelyn is an award-winning classical pianist and chamber musician. She earned her Doctorate of Musical Arts from Juilliard and directs our classical foundations, keyboard sync configurations, and performance coaching.',
      image: '🎹',
      skills: ['Juilliard DMA', 'Chamber Artist', 'Patch Designer']
    }
  },
  drums: {
    title: 'Drums & Percussion Program',
    tagline: 'The heartbeat of the band. Command the stage rhythm.',
    description: 'Build robust rhythmic timing, stick mechanics, syncopation, and double-kick speed. Our drum program prepares you to drive live rehearsals and stay locked in with bass guitarists under spotlights.',
    curriculum: [
      'Drum rudiments and hand-foot independence',
      'Rhythmic timing, tempo mapping, and groove styles',
      'Showcase setlist fills and stage cues',
      'Drum hardware tuning and monitor setup'
    ],
    skills: ['Drum Kit', 'Rhythm Section Control', 'Double Bass', 'Rudiments', 'Metronome Sync'],
    instructor: {
      name: 'Prof. Cooper Vance',
      role: 'Rhythm Section Coach & Percussion Head',
      bio: 'Cooper is a session drummer and percussion director who has recorded with top pop and rock artists. He specializes in groove alignment, timekeeping, and coaching performance bands to lock into sync during rehearsals.',
      image: '🥁',
      skills: ['Session Drummer', 'Percussion Arranger', 'Metronome King']
    }
  },
  vocals: {
    title: 'Vocal Performance Program',
    tagline: 'Find your voice, master breathing, command the crowd.',
    description: 'Sing with control, power, and stage presence. We cover vocal warm-ups, breath support, pitch accuracy, blending registers, vocal health, and microphone techniques for high-energy live shows.',
    curriculum: [
      'Breathing support and diaphragm control',
      'Vocal health maintenance and warm-ups',
      'Pitch accuracy and harmony arrangements',
      'Live stage performance and crowd engagement'
    ],
    skills: ['Solo Vocals', 'Harmony Singing', 'Microphone Technique', 'Stage Projection', 'Health Warmups'],
    instructor: {
      name: 'Sarah Jenkins',
      role: 'Vocal Health Expert & Stage Presence Director',
      bio: 'Sarah is a vocal coach and performance artist specializing in vocal control, register blending, and high-energy stage projection. She helps singers maintain vocal health while delivering powerful live stage shows.',
      image: '🎤',
      skills: ['Opera Trained', 'Live Performer', 'Vocal Therapist']
    }
  },
  brass: {
    title: 'Brass & Horns Program',
    tagline: 'Punchy brass lines, solo hooks, and big band dynamics.',
    description: 'Discover the power of horn sections in modern bands. Learn trumpet, trombone, saxophone, and arrangement. We cover breath support, horn articulation, scale dynamics, and playing in tight horn sections.',
    curriculum: [
      'Breath support, volume control, and tone projection',
      'Articulation, scales, and fast key fingerings',
      'Horn arrangements and backing tracks',
      'Live stage horn dynamics and microphone alignment'
    ],
    skills: ['Saxophone', 'Trumpet', 'Trombone', 'Horn Sections', 'Brass Articulation'],
    instructor: {
      name: 'Dr. Julian Vance',
      role: 'Jazz & Brass Ensemble Conductor',
      bio: 'Julian has arranged brass charts for big bands and holds a Doctorate in Wind Instrumentation. He teaches trumpet, trombone, saxophone, and ensemble horn arrangements.',
      image: '🎺',
      skills: ['Ensemble Arranger', 'Doctorate of Wind', 'Jazz Master']
    }
  }
};

export default function LessonDetailPage({ params }: { params: { instrument: string } }) {
  const instrument = params.instrument?.toLowerCase() || 'guitar';
  const data = instrumentData[instrument] || instrumentData.guitar;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased flex flex-col">
      <Header />

      {/* Hero Header Section */}
      <section className="bg-[#0b0813] text-white py-16 px-6 relative overflow-hidden">
        {/* Subtle background stage lights image overlay */}
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `url('/stage_lights.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div className="max-w-7xl mx-auto relative z-10">
          <Link href="/" className="text-xs font-bold text-cyan-400 hover:text-cyan-300 uppercase tracking-widest flex items-center gap-1.5 mb-6 w-fit">
            <i className="fa-solid fa-arrow-left"></i> Back to Main
          </Link>
          <div className="max-w-3xl">
            <span className="text-[10px] font-black uppercase tracking-widest text-pink-500 bg-pink-500/10 border border-pink-500/25 px-3 py-1 rounded-full w-fit block mb-4">
              Lessons Directory
            </span>
            <h1 className="text-4xl md:text-5xl font-heading font-black uppercase tracking-wider mb-4">
              Our <span className="bg-gradient-to-r from-pink-500 via-purple-400 to-cyan-400 bg-clip-text text-transparent">{data.title}</span>
            </h1>
            <p className="text-sm md:text-base text-slate-300 font-medium uppercase tracking-wide leading-relaxed">
              {data.tagline}
            </p>
          </div>
        </div>
      </section>

      {/* Main Grid Content */}
      <main className="max-w-7xl mx-auto px-6 py-12 flex-1 w-full grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Description & Syllabus */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-8">
            <h2 className="text-xl font-heading font-black text-slate-900 uppercase tracking-wide mb-4">
              Program Overview
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed font-semibold">
              {data.description}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {data.skills.map((skill) => (
                <span key={skill} className="text-[9px] font-bold text-cyan-600 bg-cyan-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-8">
            <h2 className="text-xl font-heading font-black text-slate-900 uppercase tracking-wide mb-4">
              Curriculum Checklist
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold text-slate-600">
              {data.curriculum.map((item, idx) => (
                <div key={idx} className="flex gap-2 items-start">
                  <span className="text-pink-500 mt-0.5"><i className="fa-solid fa-circle-check"></i></span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Instructor Profile & CTA */}
        <div className="space-y-8">
          {/* Instructor Showcase */}
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 relative overflow-hidden">
            <div className="text-center pb-6 border-b border-slate-100">
              <div className="w-20 h-20 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-4xl mx-auto mb-4">
                {data.instructor.image}
              </div>
              <h3 className="font-heading text-lg font-black text-slate-900 uppercase tracking-wide leading-tight">
                {data.instructor.name}
              </h3>
              <p className="text-[10px] font-bold text-pink-600 uppercase tracking-widest mt-1">
                {data.instructor.role}
              </p>
            </div>

            <div className="py-6 space-y-4">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Instructor Bio</span>
              <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                {data.instructor.bio}
              </p>

              <div className="flex flex-wrap gap-1.5 pt-2">
                {data.instructor.skills.map((s) => (
                  <span key={s} className="text-[8px] font-black text-pink-600 bg-pink-50 px-2 py-0.5 rounded uppercase tracking-wider">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Pricing/Booking CTAs */}
          <div className="bg-[#0b0813] text-white p-6 rounded-xl relative overflow-hidden shadow-lg shadow-pink-500/5">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-300 mb-2">Claim Your Spot</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-6 font-semibold">
              Ready to learn {instrument}? Join a local rehearsal band cohort or book private 1-on-1 coaching.
            </p>
            <div className="space-y-3">
              <Link 
                href="/signup" 
                className="block w-full py-3 text-center bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-xs font-black uppercase tracking-widest rounded-lg hover:opacity-95 transition-opacity"
              >
                Start Free Trial
              </Link>
              <Link 
                href="/pricing" 
                className="block w-full py-3 text-center bg-slate-900 border border-slate-700 text-xs font-black uppercase tracking-widest rounded-lg hover:bg-slate-800 transition-colors"
              >
                Compare Pricing Tiers
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
