import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

// Common API Response Types
export interface ErrorResponse {
  success: false;
  error: string;
  details: string;
}

export interface BaseSuccessResponse {
  success: true;
  message: string;
}

// Database Record Types
export interface MajorMentorRecord {
  id: number;
  output_group: string;
  favorite_subject: string;
  factor_one: string;
  factor_two: string;
  factor_three: string;
  factor_one_importance: number;
  factor_two_importance: number;
  factor_three_importance: number;
  major_title: string;
  description_of_major: string;
  why_this_major: string;
  starred: boolean;
  created_at: string;
}

export interface SchoolMatchRecord {
  id: number;
  output_group: string;
  location: string;
  location_requirements: string;
  future_plans: string;
  ideal_campus_experience: string;
  unweighted_gpa: string;
  college_name: string;
  description_of_college: string;
  why_this_college: string;
  starred: boolean;
  created_at: string;
}

export interface StoryStrategistRecord {
  id: number;
  output_group: string;
  feelMostLikeYourself: string;
  hardship: string;
  never_get_bored: string;
  family_background: string;
  proud_achievement: string;
  known_in_10_years: string;
  what_sets_you_apart: string;
  post_college_plans: string;
  title: string;
  summary: string;
  starred: boolean;
  created_at: string;
}

// Request Types
export interface MajorMentorRequest {
  userId: string;
  userInputs: {
    favoriteSubject: string;
    factors: {
      factor1: { value: string; importance: number };
      factor2: { value: string; importance: number };
      factor3: { value: string; importance: number };
    };
    postCollegePlans: string;
  };
  generationResponse: string;
  starredStates?: { [key: number]: boolean };
}

export interface SchoolMatchRequest {
  userId: string;
  userInputs: {
    location: string;
    locationRequirements: string;
    futurePlans: string;
    idealCampusExperience: string;
    unweightedGPA: string;
  };
  generationResponse: string;
  starredStates?: { [key: number]: boolean };
}

export interface StoryStrategistRequest {
  userId: string;
  userInputs: {
    feelMostLikeYourself: string;
    hardship: string;
    neverGetBored: string;
    familyBackground: string;
    proudAchievement: string;
    knownIn10Years: string;
    whatSetsYouApart: string;
    postCollegePlans?: string;
  };
  generationResponse: string;
  starredStates?: { [key: number]: boolean };
}

// Response Types
export interface MajorMentorResponse extends BaseSuccessResponse {
  data: MajorMentorRecord[];
  count: number;
}

export interface SchoolMatchResponse extends BaseSuccessResponse {
  data: SchoolMatchRecord[];
  count: number;
}

export interface StoryStrategistResponse extends BaseSuccessResponse {
  data: StoryStrategistRecord[];
  count: number;
}

// Option Types for Parsed Responses
export interface MajorOption {
  majorTitle: string;
  descriptionOfMajor: string;
  whyThisMajor: string;
  starred?: boolean;
}

export interface SchoolMatchOption {
  collegeName: string;
  descriptionOfCollege: string;
  whyThisCollege: string;
}

export interface StoryOption {
  title: string;
  summary: string;
}

// Special Response Types
export interface StarredItem {
  type: "school_match" | "major_mentor" | "story_strategist";
  id: number;
  title: string;
  description: string;
  why_recommendation: string;
  created_at: string;
}

export interface AllStarredResponse extends BaseSuccessResponse {
  data: StarredItem[];
  count: number;
  breakdown: {
    school_matches: number;
    major_mentors: number;
    story_strategists: number;
  };
}

export interface SessionHistoryItem {
  output_group: string;
  table_name: string;
  display_name: string;
  display_title: string;
  display_description: string;
  created_at: string;
}

export interface SessionHistoryResponse extends BaseSuccessResponse {
  data: SessionHistoryItem[];
  count: number;
}

// Re-export database types for convenience
export type {
  NeonConnection,
  QueryParams,
  QueryResult,
  TransactionQuery,
  DatabaseError,
  DatabaseRow,
  BaseRecord,
  DatabaseOperationResult,
  QueryOptions,
  TransactionOptions,
  ConnectionStatus,
  DatabaseOperation,
  HealthCheck,
} from "./database";
