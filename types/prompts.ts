// Type interfaces for prompt configurations

// Base prompt configuration interface
export interface BasePromptConfig<T> {
  text: string;
  responseFormat: T[];
  complete: string;
}

// Major Mentor specific types
export interface MajorOption {
  majorTitle: string;
  descriptionOfMajor: string;
  whyThisMajor: string;
}

export interface MajorMentorResponseFormat {
  [key: string]: MajorOption;
}

export type MajorMentorPromptConfig =
  BasePromptConfig<MajorMentorResponseFormat>;

// School Match specific types
export interface SchoolMatchOption {
  collegeName: string;
  descriptionOfCollege: string;
  whyThisCollege: string;
}

export interface SchoolMatchResponseFormat {
  [key: string]: SchoolMatchOption;
}

export type SchoolMatchPromptConfig =
  BasePromptConfig<SchoolMatchResponseFormat>;

// Story Strategist specific types
export interface StoryOption {
  title: string;
  summary: string;
}

export interface StoryStrategistResponseFormat {
  [key: string]: StoryOption;
}

export type StoryStrategistPromptConfig =
  BasePromptConfig<StoryStrategistResponseFormat>;

// Union type for all prompt configurations
export type PromptConfig =
  | MajorMentorPromptConfig
  | SchoolMatchPromptConfig
  | StoryStrategistPromptConfig;

// Utility type for extracting response format from prompt config
export type ExtractResponseFormat<T> =
  T extends BasePromptConfig<infer U> ? U : never;
