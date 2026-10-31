



sap.ui.define(
    [
        "sap/m/MessageBox",
        "sap/m/Dialog",
        "sap/m/Button",
        "sap/m/VBox",
        "sap/m/Panel",
        "sap/m/Label",
        "sap/m/Text"
    ],
    function (
        MessageBox,
        Dialog,
        Button,
        VBox,
        Panel,
        Label,
        Text
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

                    // Arrange learning topics in sequence
                    learningItems.sort(function (a, b) {
                        return a.sequence - b.sequence;
                    });

                    // Create one card for every learning recommendation
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
            }

        };
    }
);




