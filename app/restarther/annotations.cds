using RestartHERService as service from '../../srv/restart-her-service';
annotate service.ReturningProfessionals with @(
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Label : 'firstName',
                Value : firstName,
            },
            {
                $Type : 'UI.DataField',
                Label : 'lastName',
                Value : lastName,
            },
            {
                $Type : 'UI.DataField',
                Label : 'previousRole',
                Value : previousRole,
            },
            {
                $Type : 'UI.DataField',
                Label : 'yearsExperience',
                Value : yearsExperience,
            },
            {
                $Type : 'UI.DataField',
                Label : 'careerBreakYears',
                Value : careerBreakYears,
            },
            {
                $Type : 'UI.DataField',
                Label : 'responsibilities',
                Value : responsibilities,
            },
            {
                $Type : 'UI.DataField',
                Label : 'careerGoal',
                Value : careerGoal,
            },
            {
                $Type : 'UI.DataField',
                Label : 'consentToProcess',
                Value : consentToProcess,
            },
        ],
    },
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'GeneratedFacet1',
            Label : 'General Information',
            Target : '@UI.FieldGroup#GeneratedGroup',
        },
    ],
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Label : 'firstName',
            Value : firstName,
        },
        {
            $Type : 'UI.DataField',
            Label : 'lastName',
            Value : lastName,
        },
        {
            $Type : 'UI.DataField',
            Label : 'previousRole',
            Value : previousRole,
        },
        {
            $Type : 'UI.DataField',
            Label : 'yearsExperience',
            Value : yearsExperience,
        },
        {
            $Type : 'UI.DataField',
            Label : 'careerBreakYears',
            Value : careerBreakYears,
        },
    ],
);

