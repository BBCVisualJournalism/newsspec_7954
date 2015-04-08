define(['lib/news_special/bootstrap', 'spec/data/fixtureData', 'View_Inputs__Questions'],  function (news, fixtureData, ViewInputsQuestions) {

    var questionsView;

    // force range to be supported so we get the progressively enhanced behaviour
    ViewInputsQuestions.rangeTypeIsSupported = function () { return true; };

    beforeEach(function () {
        news.$('body').append(fixtureData);
        questionsView = new ViewInputsQuestions();
        questionsView.init();
    });

    afterEach(function () {
        news.$('.main').remove();
    });

    describe('Questions view', function () {

        it('should load feedback text as the user answers the questions', function () {
            
            var firstInputElement = news.$('.input__container .input__element').first(),
                getFeedbackText = function () {
                    return firstInputElement.parent().find('.input__element__summary .paragraph').html();
                },
                feedbackTextBefore = getFeedbackText(),
                feedbackTextAfter;

            expect(feedbackTextBefore.length).toBeGreaterThan(5);

            firstInputElement.val('7');
            firstInputElement.change(); // fire onchange event
            
            feedbackTextAfter = getFeedbackText();
            expect(feedbackTextAfter).not.toEqual(feedbackTextBefore);
        });

        it('should set all input values to zero when calculator is reset', function () {

            var firstInputElement = news.$('.input__container .input__element').first(),
                defaultValue = firstInputElement.attr('data-default-value');

            expect(firstInputElement.val()).toEqual(defaultValue);

            firstInputElement.val('4');
            expect(firstInputElement.val()).toEqual('4');

            news.pubsub.emit('reset');
            expect(firstInputElement.val()).toEqual(defaultValue);
        });
    });


});