

using { restarther } from '../db/schema';

service RestartHERService {

    entity ReturningProfessionals
        as projection on restarther.ReturningProfessionals;

    entity Skills
        as projection on restarther.Skills;

    entity CandidateSkills
        as projection on restarther.CandidateSkills;

    action discoverSkills(
        candidateID : UUID
    ) returns many restarther.SkillResult;

    action recommendCareers(
        candidateID : UUID
    ) returns many restarther.CareerRecommendation;

    action learningPathway(
        candidateID : UUID
    ) returns many restarther.LearningRecommendation;

}

