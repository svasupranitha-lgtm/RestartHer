

namespace restarther;

using { cuid, managed } from '@sap/cds/common';

// Stores information about returning professionals
entity ReturningProfessionals : cuid, managed {

    firstName         : String(80);
    lastName          : String(80);

    previousRole      : String(120);
    yearsExperience   : Integer;
    careerBreakYears  : Integer;

    responsibilities  : LargeString;
    careerGoal        : String(200);

    consentToProcess  : Boolean default false;
}

// Stores skills recognized by RestartHER
entity Skills : cuid {

    name        : String(100);
    category    : String(40);
    description : LargeString;
}

// Connects candidates with their discovered skills
entity CandidateSkills : cuid, managed {

    candidate  : Association to ReturningProfessionals;
    skill      : Association to Skills;

    evidence   : LargeString;
    confidence : Decimal(5,2);
}

// Results returned by Skills Discovery
type SkillResult {
    skill    : String(100);
    category : String(40);
    evidence : LargeString;
}

// Results returned by Career Recommendation Agent
type CareerRecommendation {
    role            : String(120);
    explanation     : LargeString;
    matchingSkills  : LargeString;
    skillGaps       : LargeString;
}

// Results returned by Learning Pathway Agent
type LearningRecommendation {
    skill             : String(100);
    topic             : String(120);
    description       : LargeString;
    sequence          : Integer;
    estimatedDuration : String(40);
}



