var Bio = function () {


};



Bio.prototype = {

    fill: function (person) {


        try {
            var bio = {
                DOB: person.BirthDate.yearDate() != 0 ? person.BirthDate.yearDate() : person.BaptismDate.yearDate(),
                BirthDate: person.BirthDate,
                BaptismDate: person.BaptismDate,
                DOD: person.DeathDate || '',
                DeathLocation: person.DeathPlace || '',
                Name: person.name.replace('/', '').replace('/', ''),
                OccupationDate: person.OccupationDate,
                OccupationPlace: person.OccupationPlace,
                Occupation :person.Occupation,

                BirthLocation: person.BaptismPlace == '' ? person.BaptismPlace : person.BirthPlace
            };

            var n = person.name.split("/");

            if (n.length == 3) {
                bio.FirstName = n[0];
                bio.Surname = n[1];
            }            
        } catch(e) {
            console.log(person + ' ' + e);
        } 

         

        return bio;

    }
};