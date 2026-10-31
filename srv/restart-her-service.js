


import cds from '@sap/cds';

export default class RestartHERService extends cds.ApplicationService {

    async init() {

        // FEATURE 1: SKILLS DISCOVERY
        this.on('discoverSkills', async (req) => {

            const { candidateID } = req.data;

            const candidate = await SELECT.one
                .from('restarther.ReturningProfessionals')
                .where({ ID: candidateID });

            if (!candidate) {
                return req.error(404, 'Candidate profile not found.');
            }

            if (!candidate.consentToProcess) {
                return req.error(403, 'Candidate consent is required.');
            }

            const profileFields = [
                {
                    name: 'Previous Role',
                    value: candidate.previousRole
                },
                {
                    name: 'Responsibilities',
                    value: candidate.responsibilities
                },
                {
                    name: 'Career Goal',
                    value: candidate.careerGoal
                }
            ].filter(field => field.value);

            const text = profileFields
                .map(field => field.value)
                .join(' ')
                .toLowerCase();

            const skillRules = [
                {
                    skill: 'Team Coordination',
                    category: 'Management',
                    keywords: ['team', 'coordinate', 'manage']
                },
                {
                    skill: 'Communication',
                    category: 'Soft Skills',
                    keywords: ['communicate', 'customer', 'client']
                },
                {
                    skill: 'Data Analysis',
                    category: 'Technical',
                    keywords: ['data', 'analysis', 'report', 'excel']
                },
                {
                    skill: 'Project Management',
                    category: 'Management',
                    keywords: ['project', 'planning', 'schedule']
                },
                {
                    skill: 'Problem Solving',
                    category: 'Soft Skills',
                    keywords: ['problem', 'resolve', 'solution']
                }
            ];

            function findEvidence(keywords) {

                for (const field of profileFields) {

                    const sentences = field.value.split(/[,;\n.!?]+/);

                    for (const sentence of sentences) {

                        const phrase = sentence.trim();

                        const matchedKeyword = keywords.some(keyword =>
                            phrase.toLowerCase().includes(keyword)
                        );

                        if (matchedKeyword) {
                            return phrase;
                        }
                    }
                }

                return 'Matching information found in the candidate profile.';
            }

            const results = [];

            for (const rule of skillRules) {

                const matched = rule.keywords.some(keyword =>
                    text.includes(keyword)
                );

                if (matched) {

                    results.push({
                        skill: rule.skill,
                        category: rule.category,
                        evidence: findEvidence(rule.keywords)
                    });

                }
            }

            return results;
        });


        // FEATURE 2: CAREER RECOMMENDATIONS
        this.on('recommendCareers', async (req) => {

            const { candidateID } = req.data;

            const candidate = await SELECT.one
                .from('restarther.ReturningProfessionals')
                .where({ ID: candidateID });

            if (!candidate) {
                return req.error(404, 'Candidate profile not found.');
            }

            if (!candidate.consentToProcess) {
                return req.error(403, 'Candidate consent is required.');
            }

            const profileText = [
                candidate.previousRole,
                candidate.responsibilities,
                candidate.careerGoal
            ].filter(Boolean).join(' ').toLowerCase();

            const skillRules = [
                {
                    skill: 'Team Coordination',
                    keywords: ['team', 'coordinate', 'manage']
                },
                {
                    skill: 'Communication',
                    keywords: ['communicate', 'customer', 'client']
                },
                {
                    skill: 'Data Analysis',
                    keywords: ['data', 'analysis', 'report', 'excel']
                },
                {
                    skill: 'Project Management',
                    keywords: ['project', 'planning', 'schedule']
                },
                {
                    skill: 'Problem Solving',
                    keywords: ['problem', 'resolve', 'solution']
                }
            ];

            const candidateSkills = skillRules
                .filter(rule =>
                    rule.keywords.some(keyword =>
                        profileText.includes(keyword)
                    )
                )
                .map(rule => rule.skill);

            const careerRoles = [
                {
                    role: 'Business Operations Analyst',
                    requiredSkills: [
                        'Team Coordination',
                        'Communication',
                        'Data Analysis'
                    ],
                    goalKeywords: ['business', 'operations'],
                    skillGaps: [
                        'Advanced Excel',
                        'SQL',
                        'Business Analytics'
                    ]
                },
                {
                    role: 'Operations Coordinator',
                    requiredSkills: [
                        'Team Coordination',
                        'Communication'
                    ],
                    goalKeywords: ['operations', 'coordination'],
                    skillGaps: [
                        'Process Management',
                        'Project Planning'
                    ]
                },
                {
                    role: 'Project Coordinator',
                    requiredSkills: [
                        'Team Coordination',
                        'Communication',
                        'Project Management'
                    ],
                    goalKeywords: ['project', 'coordination'],
                    skillGaps: [
                        'Project Management',
                        'Agile Fundamentals'
                    ]
                }
            ];

            const recommendations = [];

            for (const career of careerRoles) {

                const matchingSkills = career.requiredSkills.filter(skill =>
                    candidateSkills.includes(skill)
                );

                const goalMatch = career.goalKeywords.some(keyword =>
                    (candidate.careerGoal || '')
                        .toLowerCase()
                        .includes(keyword)
                );

                if (goalMatch || matchingSkills.length >= 2) {

                    const explanation = goalMatch
                        ? `This role aligns with your career goal of ${candidate.careerGoal}. Your existing skills also provide a foundation for this career path.`
                        : `Your existing skills in ${matchingSkills.join(', ')} are relevant to this role.`;

                    recommendations.push({
                        role: career.role,
                        explanation: explanation,
                        matchingSkills: matchingSkills.join(', '),
                        skillGaps: career.skillGaps.join(', ')
                    });

                }
            }

            return recommendations;
        });


        // FEATURE 3: PERSONALIZED LEARNING PATHWAY
        this.on('learningPathway', async (req) => {

            const { candidateID } = req.data;

            // Find candidate profile
            const candidate = await SELECT.one
                .from('restarther.ReturningProfessionals')
                .where({ ID: candidateID });

            if (!candidate) {
                return req.error(404, 'Candidate profile not found.');
            }

            // Check consent
            if (!candidate.consentToProcess) {
                return req.error(403, 'Candidate consent is required.');
            }

            // Identify candidate's existing skills
            const profileText = [
                candidate.previousRole,
                candidate.responsibilities,
                candidate.careerGoal
            ].filter(Boolean).join(' ').toLowerCase();

            const skillRules = [
                {
                    skill: 'Team Coordination',
                    keywords: ['team', 'coordinate', 'manage']
                },
                {
                    skill: 'Communication',
                    keywords: ['communicate', 'customer', 'client']
                },
                {
                    skill: 'Data Analysis',
                    keywords: ['data', 'analysis', 'report', 'excel']
                },
                {
                    skill: 'Project Management',
                    keywords: ['project', 'planning', 'schedule']
                },
                {
                    skill: 'Problem Solving',
                    keywords: ['problem', 'resolve', 'solution']
                }
            ];

            const candidateSkills = skillRules
                .filter(rule =>
                    rule.keywords.some(keyword =>
                        profileText.includes(keyword)
                    )
                )
                .map(rule => rule.skill);

            // Career paths and their learning requirements
            const careerRoles = [
                {
                    role: 'Business Operations Analyst',
                    requiredSkills: [
                        'Team Coordination',
                        'Communication',
                        'Data Analysis'
                    ],
                    goalKeywords: ['business', 'operations'],
                    skillGaps: [
                        'Advanced Excel',
                        'SQL',
                        'Business Analytics'
                    ]
                },
                {
                    role: 'Operations Coordinator',
                    requiredSkills: [
                        'Team Coordination',
                        'Communication'
                    ],
                    goalKeywords: ['operations', 'coordination'],
                    skillGaps: [
                        'Process Management',
                        'Project Planning'
                    ]
                },
                {
                    role: 'Project Coordinator',
                    requiredSkills: [
                        'Team Coordination',
                        'Communication',
                        'Project Management'
                    ],
                    goalKeywords: ['project', 'coordination'],
                    skillGaps: [
                        'Project Management',
                        'Agile Fundamentals'
                    ]
                }
            ];

            // Select career paths relevant to the candidate
            const selectedCareers = careerRoles.filter(career => {

                const goalMatch = career.goalKeywords.some(keyword =>
                    (candidate.careerGoal || '')
                        .toLowerCase()
                        .includes(keyword)
                );

                const matchingSkills = career.requiredSkills.filter(skill =>
                    candidateSkills.includes(skill)
                );

                return goalMatch || matchingSkills.length >= 2;
            });

            // Learning content for identified skill gaps
            const learningModules = {

                'Advanced Excel': {
                    topic: 'Advanced Excel for Professionals',
                    description: 'Learn advanced formulas, pivot tables, charts and professional data reporting.',
                    duration: '2 weeks'
                },

                'SQL': {
                    topic: 'SQL and Database Fundamentals',
                    description: 'Understand databases, SELECT queries, filtering, sorting and joining tables.',
                    duration: '2 weeks'
                },

                'Business Analytics': {
                    topic: 'Introduction to Business Analytics',
                    description: 'Learn how to interpret business data, understand key performance indicators and support decisions.',
                    duration: '2 weeks'
                },

                'Process Management': {
                    topic: 'Business Process Management',
                    description: 'Understand business workflows, process mapping and ways to improve operational efficiency.',
                    duration: '1 week'
                },

                'Project Planning': {
                    topic: 'Project Planning and Coordination',
                    description: 'Learn to plan tasks, set milestones, manage timelines and coordinate project activities.',
                    duration: '1 week'
                },

                'Project Management': {
                    topic: 'Project Management Fundamentals',
                    description: 'Understand project scope, planning, resource allocation and project monitoring.',
                    duration: '2 weeks'
                },

                'Agile Fundamentals': {
                    topic: 'Agile and Scrum Fundamentals',
                    description: 'Learn Agile principles, Scrum roles, sprint planning and collaborative project delivery.',
                    duration: '1 week'
                }

            };

            // Build an ordered and personalized learning pathway
            const selectedGaps = [
                ...new Set(
                    selectedCareers.flatMap(career => career.skillGaps)
                )
            ];

            const learningRecommendations = selectedGaps
                .filter(skill => learningModules[skill])
                .map((skill, index) => ({
                    skill: skill,
                    topic: learningModules[skill].topic,
                    description: learningModules[skill].description,
                    sequence: index + 1,
                    estimatedDuration: learningModules[skill].duration
                }));

            if (learningRecommendations.length === 0) {
                return req.error(
                    404,
                    'No learning pathway could be generated. Please update the candidate profile or career goal.'
                );
            }

            return learningRecommendations;
        });


        await super.init();
    }
}



