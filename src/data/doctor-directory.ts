import type { CareModule, CareCategory } from "../types/care";

export interface DoctorProfile {
  id: string;
  name: string;
  role: string;
  module: CareModule;
  category: CareCategory;
  specialty: string;
  reviews: number;
  patients: number;
  experienceYears: number;
  about: string;
  location: string;
  charges: {
    home: string;
    clinic: string;
    online: string;
  };
  availability: string;
  avatar: string;
}

export const doctorDirectory: DoctorProfile[] = [
  {
    id: "callistus",
    name: "Dr O.O. Olusanya",
    role: "Consultant Psychiatrist",
    module: "mental",
    category: "doctor",
    specialty: "Health Psychologist",
    reviews: 12,
    patients: 1,
    experienceYears: 8,
    about:
      "Showing empathy, good listener, easy going person, passionate and skilful about whole-person mental wellness.",
    location: "Anchor Hospital, Port Harcourt/Aba near Eleme Junction, Eleme",
    charges: {
      home: "NGN 40,000 / visit",
      clinic: "NGN 20,000 / visit",
      online: "Free",
    },
    availability: "MON-FRI | 10:00am - 7:00pm",
    avatar: "/care-provider.png",
  },
  {
    id: "fidelia",
    name: "Dr Fidelia Amir",
    role: "Psychologist",
    module: "mental",
    category: "psychologist",
    specialty: "Health Psychologist",
    reviews: 22,
    patients: 3,
    experienceYears: 6,
    about:
      "Licensed psychologist helping young adults navigate anxiety, burnout and life transitions.",
    location: "MindHaven Virtual Care",
    charges: {
      home: "NGN 35,000 / visit",
      clinic: "NGN 25,000 / visit",
      online: "NGN 15,000 / session",
    },
    availability: "TUE-SUN | 09:00am - 5:00pm",
    avatar: "/care-provider.png",
  },
  {
    id: "kemi",
    name: "Dr Kemi Balogun",
    role: "Neuropsychologist",
    module: "mental",
    category: "psychologist",
    specialty: "Neuropsychologist",
    reviews: 16,
    patients: 4,
    experienceYears: 7,
    about:
      "Cognitive behavioral specialist supporting busy professionals through burnout recovery.",
    location: "MindHaven Virtual Care",
    charges: {
      home: "NGN 35,000 / visit",
      clinic: "NGN 22,000 / visit",
      online: "NGN 15,000 / session",
    },
    availability: "MON-FRI | 08:00am - 6:00pm",
    avatar: "/care-provider.png",
  },
  {
    id: "ibrahim",
    name: "Dr Ibrahim Musa",
    role: "Behavioral Therapist",
    module: "mental",
    category: "psychologist",
    specialty: "Adolescent Psychologist",
    reviews: 11,
    patients: 6,
    experienceYears: 5,
    about:
      "Therapist focused on adolescent mental health, blending talk therapy with mindfulness.",
    location: "Katsina Specialist Clinic",
    charges: {
      home: "NGN 28,000 / visit",
      clinic: "NGN 18,000 / visit",
      online: "NGN 12,000 / session",
    },
    availability: "WED-SUN | 10:00am - 7:00pm",
    avatar: "/care-provider.png",
  },
  {
    id: "morenike",
    name: "Dr Morenike Adebisi",
    role: "Family Psychologist",
    module: "mental",
    category: "psychologist",
    specialty: "Counseling Psychologist",
    reviews: 24,
    patients: 8,
    experienceYears: 10,
    about:
      "Works with couples and young parents to build emotionally healthy homes with deep counseling support.",
    location: "Harmony Wellness Hub, Ibadan",
    charges: {
      home: "NGN 40,000 / visit",
      clinic: "NGN 25,000 / visit",
      online: "NGN 18,000 / session",
    },
    availability: "MON-SAT | 09:00am - 5:00pm",
    avatar: "/care-provider.png",
  },
  {
    id: "janet",
    name: "Dr Janet Jennifer",
    role: "Addiction Psychologist",
    module: "mental",
    category: "psychologist",
    specialty: "Addiction Psychologist",
    reviews: 7,
    patients: 5,
    experienceYears: 9,
    about:
      "Helps individuals rebuild routines while recovering from substance dependency and burnout.",
    location: "Cedar Wellness Centre, Lekki Phase 1",
    charges: {
      home: "NGN 30,000 / visit",
      clinic: "NGN 18,000 / visit",
      online: "NGN 10,000 / session",
    },
    availability: "MON-SAT | 08:00am - 4:00pm",
    avatar: "/care-provider.png",
  },
  {
    id: "amina",
    name: "Dr Amina Okoro",
    role: "Neuro-rehabilitation Physician",
    module: "hospital",
    category: "doctor",
    specialty: "Neuropsychologist",
    reviews: 18,
    patients: 2,
    experienceYears: 11,
    about:
      "Leads recovery programmes for patients with traumatic brain injuries, supporting cognition and daily function.",
    location: "Unity Teaching Hospital, Abuja",
    charges: {
      home: "NGN 45,000 / visit",
      clinic: "NGN 25,000 / visit",
      online: "NGN 12,000 / session",
    },
    availability: "24/7 On-call",
    avatar: "/care-provider.png",
  },
  {
    id: "chioma",
    name: "Dr Chioma Ife",
    role: "Addiction Recovery Specialist",
    module: "hospital",
    category: "doctor",
    specialty: "Addiction Psychologist",
    reviews: 6,
    patients: 4,
    experienceYears: 5,
    about:
      "Guides clients through substance-use recovery with coordinated medical and counselling support.",
    location: "Rehab Suites, Enugu",
    charges: {
      home: "NGN 32,000 / visit",
      clinic: "NGN 18,000 / visit",
      online: "NGN 8,000 / session",
    },
    availability: "TUE-SAT | 09:00am - 6:00pm",
    avatar: "/care-provider.png",
  },
  {
    id: "ngozi",
    name: "Dr Ngozi Nwosu",
    role: "Consultant Gynaecologist",
    module: "mental",
    category: "doctor",
    specialty: "Counseling Psychologist",
    reviews: 19,
    patients: 9,
    experienceYears: 12,
    about:
      "Focuses on women’s emotional wellbeing through fertility, pregnancy, and postpartum journeys.",
    location: "Covenant Women Centre, Ikeja",
    charges: {
      home: "NGN 45,000 / visit",
      clinic: "NGN 28,000 / visit",
      online: "NGN 18,000 / session",
    },
    availability: "MON-FRI | 08:30am - 6:00pm",
    avatar: "/care-provider.png",
  },
  {
    id: "sola",
    name: "Dr Sola Adebayo",
    role: "Paediatrician",
    module: "mental",
    category: "doctor",
    specialty: "Adolescent Psychologist",
    reviews: 14,
    patients: 7,
    experienceYears: 9,
    about:
      "Cares for teens navigating anxiety, mood changes, and behavioural shifts with a playful approach.",
    location: "Little Oaks Children’s Clinic, Surulere",
    charges: {
      home: "NGN 38,000 / visit",
      clinic: "NGN 20,000 / visit",
      online: "NGN 12,500 / session",
    },
    availability: "TUE-SAT | 09:00am - 4:00pm",
    avatar: "/care-provider.png",
  },
  {
    id: "farida",
    name: "Dr Farida Hassan",
    role: "Behavioural Optometrist",
    module: "mental",
    category: "doctor",
    specialty: "Health Psychologist",
    reviews: 9,
    patients: 4,
    experienceYears: 6,
    about:
      "Eye-care expert helping remote workers manage screen strain, sleep routines, and stress resilience.",
    location: "VisionCare Suites, Kaduna",
    charges: {
      home: "NGN 30,000 / visit",
      clinic: "NGN 17,000 / visit",
      online: "NGN 9,500 / session",
    },
    availability: "MON-SAT | 10:00am - 6:00pm",
    avatar: "/care-provider.png",
  },
  {
    id: "emeka",
    name: "Dr Emeka Nnaji",
    role: "Dental Surgeon",
    module: "mental",
    category: "doctor",
    specialty: "Any",
    reviews: 21,
    patients: 10,
    experienceYears: 13,
    about:
      "Known for gentle dental procedures and preventative oral-health education.",
    location: "PearlSmiles Dental, Enugu",
    charges: {
      home: "NGN 50,000 / visit",
      clinic: "NGN 30,000 / visit",
      online: "NGN 15,000 / session",
    },
    availability: "MON-FRI | 09:00am - 5:00pm",
    avatar: "/care-provider.png",
  },
    {
    id: "farida",
    name: "Dr Farida Hassan",
    role: "Behavioural Optometrist",
    module: "mental",
    category: "doctor",
    specialty: "Neuropsychologist",
    reviews: 9,
    patients: 4,
    experienceYears: 6,
    about:
      "Eye-care expert helping remote workers manage screen strain, sleep routines, and stress resilience.",
    location: "VisionCare Suites, Kaduna",
    charges: {
      home: "NGN 30,000 / visit",
      clinic: "NGN 17,000 / visit",
      online: "NGN 9,500 / session",
    },
    availability: "MON-SAT | 10:00am - 6:00pm",
    avatar: "/care-provider.png",
  },
  {
    id: "emeka",
    name: "Dr Emeka Nnaji",
    role: "Dental Surgeon",
    module: "mental",
    category: "doctor",
    specialty: "Addiction Psychologist",
    reviews: 21,
    patients: 10,
    experienceYears: 13,
    about:
      "Known for gentle dental procedures and preventative oral-health education.",
    location: "PearlSmiles Dental, Enugu",
    charges: {
      home: "NGN 50,000 / visit",
      clinic: "NGN 30,000 / visit",
      online: "NGN 15,000 / session",
    },
    availability: "MON-FRI | 09:00am - 5:00pm",
    avatar: "/care-provider.png",
  },
];

export const doctorSpecialties = [
  "Any",
  "Neuropsychologist",
  "Adolescent Psychologist",
  "Addiction Psychologist",
  "Health Psychologist",
  "Counseling Psychologist",
];
