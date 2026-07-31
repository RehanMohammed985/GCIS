export type VisaTrack = "h4" | "f1";

export type GradeLevel = "high-school" | "college";

export type OpportunityType =
  | "research"
  | "volunteer"
  | "open-source"
  | "competition"
  | "certification"
  | "internship"
  | "job"
  | "fellowship";

export const FIELDS = [
  "computer-science",
  "data-science",
  "engineering",
  "biology",
  "chemistry",
  "physics",
  "math",
  "medicine",
  "business",
  "finance",
  "economics",
  "psychology",
  "environmental-science",
  "design",
  "writing",
  "law",
  "education",
] as const;

export type Field = (typeof FIELDS)[number];

export type Opportunity = {
  id: string;
  title: string;
  org: string;
  type: OpportunityType;
  visaTrack: VisaTrack;
  paid: boolean;
  remote: boolean;
  location: string;
  description: string;
  fields: Field[];
  commitment: string;
  deadline: string;
  url: string;
  /** Why this is safe for H4, or the sponsorship reality for F1. */
  eligibility: string;
  gradeLevel: GradeLevel;
  sponsorsVisa?: boolean;
  capExempt?: boolean;
  /** Set by the daily refresh job; absent on hand-curated seeds. */
  sourcedAt?: string;
};

export type Profile = {
  track: VisaTrack;
  /** College students pick a major; high schoolers pick interests. */
  fields: Field[];
  /** Free-text goal used only for display, never for matching. */
  goal?: string;
  remoteOnly: boolean;
  createdAt: string;
};

export type ScoredOpportunity = Opportunity & {
  score: number;
  reasons: string[];
};

export type Guidance = {
  id: string;
  title: string;
  summary: string;
  details: string[];
  url: string;
  track: VisaTrack;
};

export const FIELD_LABELS: Record<Field, string> = {
  "computer-science": "Computer Science",
  "data-science": "Data Science",
  engineering: "Engineering",
  biology: "Biology",
  chemistry: "Chemistry",
  physics: "Physics",
  math: "Mathematics",
  medicine: "Medicine & Health",
  business: "Business",
  finance: "Finance",
  economics: "Economics",
  psychology: "Psychology",
  "environmental-science": "Environmental Science",
  design: "Design",
  writing: "Writing",
  law: "Law",
  education: "Education",
};

export const TYPE_LABELS: Record<OpportunityType, string> = {
  research: "Research",
  volunteer: "Volunteer",
  "open-source": "Open Source",
  competition: "Competition",
  certification: "Certification",
  internship: "Internship",
  job: "Job",
  fellowship: "Fellowship",
};
