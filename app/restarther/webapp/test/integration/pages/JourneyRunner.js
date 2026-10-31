sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"restarther/restarther/test/integration/pages/ReturningProfessionalsList.gen",
	"restarther/restarther/test/integration/pages/ReturningProfessionalsObjectPage.gen"
], function (JourneyRunner, ReturningProfessionalsListGenerated, ReturningProfessionalsObjectPageGenerated) {
    'use strict';

    const runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('restarther/restarther') + '/test/flp.html#app-preview',
        pages: {
			onTheReturningProfessionalsListGenerated: ReturningProfessionalsListGenerated,
			onTheReturningProfessionalsObjectPageGenerated: ReturningProfessionalsObjectPageGenerated
        },
        async: true
    });

    return runner;
});

