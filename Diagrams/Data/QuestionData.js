var QD = function () {


};



QD.prototype = {

    fill: function (question, answer, questionType) {
      
        try {
            var QD = {
                Question: question,
                Answer: answer,
                QuestionType: questionType
            };


        } catch (e) {
            console.log(question + ' ' + e);
        }
        
        return QD;

    }
};