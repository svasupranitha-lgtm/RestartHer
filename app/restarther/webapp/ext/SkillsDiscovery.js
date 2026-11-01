




sap.ui.define(
    [
        "sap/m/MessageBox",
        "sap/m/Dialog",
        "sap/m/Button",
        "sap/m/VBox",
        "sap/m/Panel",
        "sap/m/Label",
        "sap/m/Text",
        "sap/m/TextArea",
        "sap/m/ObjectStatus"
    ],
    function (
        MessageBox,
        Dialog,
        Button,
        VBox,
        Panel,
        Label,
        Text,
        TextArea,
        ObjectStatus
    ) {
        "use strict";

        return {

            // FEATURE 1: DISCOVER SKILLS
            onDiscoverSkills: async function (oBindingContext) {
                try {
                    if (!oBindingContext) {
                        MessageBox.error("Candidate profile not found.");
                        return;
                    }

                    const candidate = await oBindingContext.requestObject();
                    const candidateID = candidate.ID;

                    if (!candidateID) {
                        MessageBox.error("Candidate ID is missing.");
                        return;
                    }

                    const oModel = oBindingContext.getModel();

                    const oOperation = oModel.bindContext(
                        "/discoverSkills(...)"
                    );

                    oOperation.setParameter("candidateID", candidateID);

                    await oOperation.invoke();

                    const result = await oOperation.getBoundContext().requestObject();

                    const skills = Array.isArray(result)
                        ? result
                        : result.value || [];

                    if (skills.length === 0) {
                        MessageBox.information(
                            "No matching skills were identified."
                        );
                        return;
                    }

                    const message = skills.map(function (item) {
                        return item.skill +
                            " (" + item.category + ")\n" +
                            "Evidence: " + item.evidence;
                    }).join("\n\n");

                    MessageBox.information(message, {
                        title: "Skills Discovered"
                    });

                } catch (error) {
                    MessageBox.error(
                        error.message || "Unable to discover skills."
                    );
                }
            },


            // FEATURE 2: CAREER RECOMMENDATIONS
            onRecommendCareers: async function (oBindingContext) {
                try {
                    if (!oBindingContext) {
                        MessageBox.error("Candidate profile not found.");
                        return;
                    }

                    const candidate = await oBindingContext.requestObject();
                    const candidateID = candidate.ID;

                    if (!candidateID) {
                        MessageBox.error("Candidate ID is missing.");
                        return;
                    }

                    const oModel = oBindingContext.getModel();

                    const oOperation = oModel.bindContext(
                        "/recommendCareers(...)"
                    );

                    oOperation.setParameter("candidateID", candidateID);

                    await oOperation.invoke();

                    const result = await oOperation.getBoundContext().requestObject();

                    const careers = Array.isArray(result)
                        ? result
                        : result.value || [];

                    if (careers.length === 0) {
                        MessageBox.information(
                            "No suitable career paths were found."
                        );
                        return;
                    }

                    const careerCards = careers.map(function (item) {

                        const cardContent = new VBox({
                            width: "100%",
                            items: [

                                new Label({
                                    text: "Why this role suits you"
                                }),

                                new Text({
                                    text: item.explanation,
                                    wrapping: true
                                }),

                                new Label({
                                    text: "Matching Skills"
                                }),

                                new Text({
                                    text: item.matchingSkills || "Not identified",
                                    wrapping: true
                                }),

                                new Label({
                                    text: "Skills to Develop"
                                }),

                                new Text({
                                    text: item.skillGaps || "Not specified",
                                    wrapping: true
                                }),

                                new Button({
                                    text: "View Details",
                                    type: "Emphasized",

                                    press: function () {

                                        const details =
                                            "Career Role: " + item.role +
                                            "\n\nWhy this role suits you:\n" +
                                            item.explanation +
                                            "\n\nMatching Skills:\n" +
                                            item.matchingSkills +
                                            "\n\nSkills to Develop:\n" +
                                            item.skillGaps;

                                        MessageBox.information(details, {
                                            title: item.role
                                        });
                                    }
                                })
                            ]
                        });

                        return new Panel({
                            headerText: item.role,
                            width: "100%",
                            expandable: false,
                            content: [cardContent]
                        });
                    });

                    const careerContainer = new VBox({
                        width: "100%",
                        items: careerCards
                    });

                    const careerDialog = new Dialog({
                        title: "Your Career Recommendations",
                        contentWidth: "700px",
                        resizable: true,
                        draggable: true,
                        content: [careerContainer],

                        beginButton: new Button({
                            text: "Close",
                            press: function () {
                                careerDialog.close();
                            }
                        }),

                        afterClose: function () {
                            careerDialog.destroy();
                        }
                    });

                    careerDialog.open();

                } catch (error) {
                    MessageBox.error(
                        error.message || "Unable to recommend careers."
                    );
                }
            },


            // FEATURE 3: PERSONALIZED LEARNING PATHWAY
            onLearningPathway: async function (oBindingContext) {
                try {
                    if (!oBindingContext) {
                        MessageBox.error("Candidate profile not found.");
                        return;
                    }

                    const candidate = await oBindingContext.requestObject();
                    const candidateID = candidate.ID;

                    if (!candidateID) {
                        MessageBox.error("Candidate ID is missing.");
                        return;
                    }

                    const oModel = oBindingContext.getModel();

                    const oOperation = oModel.bindContext(
                        "/learningPathway(...)"
                    );

                    oOperation.setParameter("candidateID", candidateID);

                    await oOperation.invoke();

                    const result = await oOperation.getBoundContext().requestObject();

                    const learningItems = Array.isArray(result)
                        ? result
                        : result.value || [];

                    if (learningItems.length === 0) {
                        MessageBox.information(
                            "No learning pathway is available for this profile."
                        );
                        return;
                    }

                    learningItems.sort(function (a, b) {
                        return a.sequence - b.sequence;
                    });

                    const learningCards = learningItems.map(function (item) {

                        const cardContent = new VBox({
                            width: "100%",
                            items: [

                                new Label({
                                    text: "Skill to Develop"
                                }),

                                new Text({
                                    text: item.skill,
                                    wrapping: true
                                }),

                                new Label({
                                    text: "What You Will Learn"
                                }),

                                new Text({
                                    text: item.description,
                                    wrapping: true
                                }),

                                new Label({
                                    text: "Estimated Duration"
                                }),

                                new Text({
                                    text: item.estimatedDuration,
                                    wrapping: true
                                })

                            ]
                        });

                        return new Panel({
                            headerText: "Step " + item.sequence +
                                ": " + item.topic,
                            width: "100%",
                            expandable: false,
                            content: [cardContent]
                        });
                    });

                    const learningContainer = new VBox({
                        width: "100%",
                        items: learningCards
                    });

                    const learningDialog = new Dialog({
                        title: "Your Personalized Learning Pathway",
                        contentWidth: "700px",
                        resizable: true,
                        draggable: true,
                        content: [learningContainer],

                        beginButton: new Button({
                            text: "Close",
                            press: function () {
                                learningDialog.close();
                            }
                        }),

                        afterClose: function () {
                            learningDialog.destroy();
                        }
                    });

                    learningDialog.open();

                } catch (error) {
                    MessageBox.error(
                        error.message || "Unable to generate learning pathway."
                    );
                }
            },


            // FEATURE 4: BIAS AUDIT AGENT
            onAuditBias: async function (oBindingContext) {

                if (!oBindingContext) {
                    MessageBox.error("Candidate profile not found.");
                    return;
                }

                const candidate = await oBindingContext.requestObject();
                const candidateID = candidate.ID;

                if (!candidateID) {
                    MessageBox.error("Candidate ID is missing.");
                    return;
                }

                const jobDescriptionInput = new TextArea({
                    width: "100%",
                    rows: 10,
                    placeholder: "Paste the complete job description here..."
                });

                const inputContainer = new VBox({
                    width: "100%",
                    items: [
                        new Label({
                            text: "Job Description"
                        }),
                        jobDescriptionInput,
                        new Text({
                            text: "The audit checks for potentially restrictive experience requirements, career-break restrictions and exclusionary wording.",
                            wrapping: true
                        })
                    ]
                });

                const auditDialog = new Dialog({
                    title: "Bias Audit Agent",
                    contentWidth: "650px",
                    resizable: true,
                    draggable: true,
                    content: [inputContainer],

                    beginButton: new Button({
                        text: "Audit Job Description",
                        type: "Emphasized",

                        press: async function () {

                            const jobDescription =
                                jobDescriptionInput.getValue().trim();

                            if (!jobDescription) {
                                MessageBox.warning(
                                    "Please enter a job description first."
                                );
                                return;
                            }

                            try {
                                const oModel = oBindingContext.getModel();

                                const oOperation = oModel.bindContext(
                                    "/auditBias(...)"
                                );

                                oOperation.setParameter(
                                    "candidateID",
                                    candidateID
                                );

                                oOperation.setParameter(
                                    "jobDescription",
                                    jobDescription
                                );

                                await oOperation.invoke();

                                const result = await oOperation
                                    .getBoundContext()
                                    .requestObject();

                                const auditResults = Array.isArray(result)
                                    ? result
                                    : result.value || [];

                                auditDialog.close();

                                if (auditResults.length === 0) {
                                    MessageBox.information(
                                        "No audit results were returned."
                                    );
                                    return;
                                }

                                const resultCards = auditResults.map(
                                    function (item) {

                                        let state = "None";

                                        if (item.severity === "High") {
                                            state = "Error";
                                        } else if (item.severity === "Medium") {
                                            state = "Warning";
                                        } else if (item.severity === "Low") {
                                            state = "Success";
                                        }

                                        const cardContent = new VBox({
                                            width: "100%",
                                            items: [

                                                new Label({
                                                    text: "Severity"
                                                }),

                                                new ObjectStatus({
                                                    text: item.severity,
                                                    state: state
                                                }),

                                                new Label({
                                                    text: "Finding"
                                                }),

                                                new Text({
                                                    text: item.finding,
                                                    wrapping: true
                                                }),

                                                new Label({
                                                    text: "Why this matters"
                                                }),

                                                new Text({
                                                    text: item.explanation,
                                                    wrapping: true
                                                }),

                                                new Label({
                                                    text: "Suggested Improvement"
                                                }),

                                                new Text({
                                                    text: item.suggestion,
                                                    wrapping: true
                                                })

                                            ]
                                        });

                                        return new Panel({
                                            headerText: item.area,
                                            width: "100%",
                                            expandable: false,
                                            content: [cardContent]
                                        });
                                    }
                                );

                                const resultsContainer = new VBox({
                                    width: "100%",
                                    items: [
                                        new Text({
                                            text: "Potential bias indicators identified in the job description:",
                                            wrapping: true
                                        }),
                                        ...resultCards,
                                        new Text({
                                            text: "Note: These results are preliminary wording checks, not proof of discrimination. A human review is still important.",
                                            wrapping: true
                                        })
                                    ]
                                });

                                const resultsDialog = new Dialog({
                                    title: "Bias Audit Results",
                                    contentWidth: "700px",
                                    resizable: true,
                                    draggable: true,
                                    content: [resultsContainer],

                                    beginButton: new Button({
                                        text: "Close",
                                        press: function () {
                                            resultsDialog.close();
                                        }
                                    }),

                                    afterClose: function () {
                                        resultsDialog.destroy();
                                    }
                                });

                                resultsDialog.open();

                            } catch (error) {
                                MessageBox.error(
                                    error.message ||
                                    "Unable to complete the bias audit."
                                );
                            }
                        }
                    }),

                    endButton: new Button({
                        text: "Cancel",
                        press: function () {
                            auditDialog.close();
                        }
                    }),

                    afterClose: function () {
                        auditDialog.destroy();
                    }
                });

                auditDialog.open();
            },
              // FEATURE 5: MOCK INTERVIEW AGENT
            onStartMockInterview: async function (oBindingContext) {

                if (!oBindingContext) {
                    MessageBox.error("Candidate profile not found.");
                    return;
                }

                try {
                    const candidate = await oBindingContext.requestObject();
                    const candidateID = candidate.ID;

                    if (!candidateID) {
                        MessageBox.error("Candidate ID is missing.");
                        return;
                    }

                    const oModel = oBindingContext.getModel();

                    const roles = [
                        "Business Operations Analyst",
                        "Operations Coordinator",
                        "Project Coordinator"
                    ];

                    // Step 1: Candidate selects a career role
                    const roleButtons = roles.map(function (role) {
                        return new Button({
                            text: role,
                            width: "100%",
                            press: function () {
                                roleDialog.close();
                                startInterview(role);
                            }
                        });
                    });

                    const roleDialog = new Dialog({
                        title: "Mock Interview Agent",
                        contentWidth: "500px",
                        content: [
                            new VBox({
                                width: "100%",
                                items: [
                                    new Text({
                                        text: "Choose the career role you want to practise for:",
                                        wrapping: true
                                    }),
                                    ...roleButtons
                                ]
                            })
                        ],
                        endButton: new Button({
                            text: "Cancel",
                            press: function () {
                                roleDialog.close();
                            }
                        }),
                        afterClose: function () {
                            roleDialog.destroy();
                        }
                    });

                    roleDialog.open();

                    // Step 2: Generate interview questions
                    async function startInterview(role) {

                        try {
                            const oOperation = oModel.bindContext(
                                "/generateInterview(...)"
                            );

                            oOperation.setParameter("candidateID", candidateID);
                            oOperation.setParameter("role", role);

                            await oOperation.invoke();

                            const result = await oOperation
                                .getBoundContext()
                                .requestObject();

                            const questions = Array.isArray(result)
                                ? result
                                : result.value || [];

                            if (questions.length === 0) {
                                MessageBox.information(
                                    "No interview questions were generated."
                                );
                                return;
                            }

                            let currentIndex = 0;
                            let feedbackShown = false;

                            let answerInput;

                            const questionContainer = new VBox({
                                width: "100%"
                            });

                            const submitButton = new Button({
                                text: "Submit Answer",
                                type: "Emphasized"
                            });

                            const interviewDialog = new Dialog({
                                title: "Mock Interview - " + role,
                                contentWidth: "650px",
                                resizable: true,
                                draggable: true,
                                content: [questionContainer],

                                beginButton: submitButton,

                                endButton: new Button({
                                    text: "Close",
                                    press: function () {
                                        interviewDialog.close();
                                    }
                                }),

                                afterClose: function () {
                                    interviewDialog.destroy();
                                }
                            });

                            // Step 3: Display one question at a time
                            function showQuestion() {

                                feedbackShown = false;

                                const item = questions[currentIndex];

                                answerInput = new TextArea({
                                    width: "100%",
                                    rows: 6,
                                    placeholder: "Type your answer here..."
                                });

                                questionContainer.removeAllItems();

                                questionContainer.addItem(
                                    new Text({
                                        text: "Question " +
                                            (currentIndex + 1) +
                                            " of " + questions.length,
                                        wrapping: true
                                    })
                                );

                                questionContainer.addItem(
                                    new Label({
                                        text: "Question Type: " +
                                            item.questionType
                                    })
                                );

                                questionContainer.addItem(
                                    new Text({
                                        text: item.question,
                                        wrapping: true
                                    })
                                );

                                questionContainer.addItem(
                                    new Label({
                                        text: "Your Answer"
                                    })
                                );

                                questionContainer.addItem(answerInput);

                                submitButton.setText("Submit Answer");
                            }

                            // Step 4: Evaluate answer and show feedback
                            submitButton.attachPress(async function () {

                                if (!feedbackShown) {

                                    const answer = answerInput.getValue().trim();

                                    if (!answer) {
                                        MessageBox.warning(
                                            "Please enter your answer first."
                                        );
                                        return;
                                    }

                                    try {
                                        const item = questions[currentIndex];

                                        const evaluation = oModel.bindContext(
                                            "/evaluateInterviewAnswer(...)"
                                        );

                                        evaluation.setParameter(
                                            "candidateID",
                                            candidateID
                                        );

                                        evaluation.setParameter(
                                            "questionID",
                                            item.questionID
                                        );

                                        evaluation.setParameter(
                                            "role",
                                            item.role
                                        );

                                        evaluation.setParameter(
                                            "question",
                                            item.question
                                        );

                                        evaluation.setParameter(
                                            "candidateAnswer",
                                            answer
                                        );

                                        await evaluation.invoke();

                                        const result = await evaluation
                                            .getBoundContext()
                                            .requestObject();

                                        feedbackShown = true;

                                        questionContainer.removeAllItems();

                                        questionContainer.addItem(
                                            new ObjectStatus({
                                                text: "Total Score: " +
                                                    result.totalScore +
                                                    " / 30",
                                                state: "Success"
                                            })
                                        );

                                        questionContainer.addItem(
                                            new Label({
                                                text: "Relevance: " +
                                                    result.relevanceScore +
                                                    " / 10"
                                            })
                                        );

                                        questionContainer.addItem(
                                            new Label({
                                                text: "Clarity: " +
                                                    result.clarityScore +
                                                    " / 10"
                                            })
                                        );

                                        questionContainer.addItem(
                                            new Label({
                                                text: "Completeness: " +
                                                    result.completenessScore +
                                                    " / 10"
                                            })
                                        );

                                        questionContainer.addItem(
                                            new Label({
                                                text: "Feedback"
                                            })
                                        );

                                        questionContainer.addItem(
                                            new Text({
                                                text: result.feedback,
                                                wrapping: true
                                            })
                                        );

                                        questionContainer.addItem(
                                            new Label({
                                                text: "Improvement Tips"
                                            })
                                        );

                                        questionContainer.addItem(
                                            new Text({
                                                text: result.improvementTips,
                                                wrapping: true
                                            })
                                        );

                                        questionContainer.addItem(
                                            new Text({
                                                text: "Practice feedback only. This is not a hiring assessment.",
                                                wrapping: true
                                            })
                                        );

                                        submitButton.setText(
                                            currentIndex === questions.length - 1
                                                ? "Finish Interview"
                                                : "Next Question"
                                        );

                                    } catch (error) {
                                        MessageBox.error(
                                            error.message ||
                                            "Unable to evaluate your answer."
                                        );
                                    }

                                } else {

                                    if (currentIndex < questions.length - 1) {
                                        currentIndex++;
                                        showQuestion();
                                    } else {
                                        interviewDialog.close();

                                        MessageBox.success(
                                            "You have completed your mock interview!"
                                        );
                                    }
                                }
                            });

                            showQuestion();
                            interviewDialog.open();

                        } catch (error) {
                            MessageBox.error(
                                error.message ||
                                "Unable to generate interview questions."
                            );
                        }
                    }
                } catch (error) {
                    MessageBox.error(
                        error.message ||
                        "Unable to start the mock interview."
                    );
                }
            }

        };
    }
);





