export function Bio() {}

Bio.prototype = {

    fill: function (person) {

        if (person.BaptismPlace == undefined) person.BaptismPlace = '';
        if (person.BirthPlace == undefined) person.BirthPlace = '';
        if (person.BirthDate == undefined) person.BirthDate = '';
        if (person.BaptismDate == undefined) person.BaptismDate = '';
        if (person.name == undefined) person.name = '';

        var RecordLink = null;

        try {
            RecordLink = {
                PersonId : person.id,
                DOB: person.BirthDate.yearDate() != 0 ? person.BirthDate.yearDate() : person.BaptismDate.yearDate(),
                BirthDate: person.BirthDate,
                BaptismDate: person.BaptismDate,
                DOD: person.DeathDate || '',
                DeathLocation: person.DeathPlace || '',
                Name: person.name.replace('/', '').replace('/', ''),
                OccupationDate: person.OccupationDate || '',
                OccupationPlace: person.OccupationPlace || '',
                Occupation: person.Occupation || '',
                FirstName :'',
                Surname: '',
                BirthLocation: person.BaptismPlace == '' ? person.BaptismPlace : person.BirthPlace
            };

            var n = person.name.split("/");

            if (n.length == 3) {
                RecordLink.FirstName = n[0];
                RecordLink.Surname = n[1];


            }
        } catch(e) {
            console.log(person + ' ' + e);
        }



        return RecordLink;

    },

    fillQuestionData: function (info, question, answer, questionType) {

        var RecordLink = null;

        try {
            RecordLink = {
                DOB:1700,
                BirthDate: '',
                BaptismDate: '',
                DOD: '',
                DeathLocation: '',
                Name: info,
                OccupationDate: '',
                OccupationPlace: '',
                Occupation: '',
                FirstName: '',
                Surname: '',
                BirthLocation: '',
                Question: question,
                Answer: answer,
                QuestionType: questionType
            };



        } catch (e) {
            console.log(person + ' ' + e);
        }



        return RecordLink;

    }
};

exports.Bio = Bio;
