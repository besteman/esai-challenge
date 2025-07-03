DROP TABLE IF EXISTS school_match_maker;
DROP TABLE IF EXISTS major_mentor;
DROP TABLE IF EXISTS story_strategist;

CREATE TABLE IF NOT EXISTS school_match_maker(
  id SERIAL PRIMARY KEY,
  output_group UUID NOT NULL,
  location TEXT NOT NULL,
  location_requirements TEXT NOT NULL,
  future_plans TEXT NOT NULL,
  ideal_campus_experience TEXT NOT NULL,
  unweighted_gpa TEXT NOT NULL,
  college_name TEXT NOT NULL,
  description_of_college TEXT NOT NULL,
  why_this_college TEXT NOT NULL,
  starred BOOLEAN DEFAULT FALSE,
  user_id TEXT NOT NULL,
  created_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS major_mentor(
  id SERIAL PRIMARY KEY,
  output_group UUID NOT NULL,
  favorite_subject TEXT NOT NULL,
  factor_one TEXT NOT NULL,
  factor_two TEXT NOT NULL,
  factor_three TEXT NOT NULL,
  factor_one_importance INT NOT NULL,
  factor_two_importance INT NOT NULL,
  factor_three_importance INT NOT NULL,
  major_title TEXT NOT NULL,
  description_of_major TEXT NOT NULL,
  why_this_major TEXT NOT NULL,
  starred BOOLEAN DEFAULT FALSE,
  user_id TEXT NOT NULL,
  created_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS story_strategist(
  id SERIAL PRIMARY KEY,
  output_group UUID NOT NULL,
  feelMostLikeYourself TEXT NOT NULL,
  hardship TEXT NOT NULL,
  never_get_bored TEXT NOT NULL,
  family_background TEXT NOT NULL,
  proud_achievement TEXT NOT NULL,
  known_in_10_years TEXT NOT NULL,
  what_sets_you_apart TEXT NOT NULL,
  post_college_plans TEXT NOT NULL,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  starred BOOLEAN DEFAULT FALSE,
  user_id TEXT NOT NULL,
  created_at TIMESTAMP
);
