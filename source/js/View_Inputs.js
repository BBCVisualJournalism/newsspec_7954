define(['lib/news_special/bootstrap', 'view_inputs__questions', 'view_inputs__sidebar'], function (news, ViewInputsQuestions, ViewInputsSidebar) {

    var ViewInputs = function () {
    };

    ViewInputs.prototype = {

        init: function () {
            if (!this.initiated) {
                this.questions = new ViewInputsQuestions();
                this.sidebar   = new ViewInputsSidebar();
                this.initiated = true;
            }
            this.questions.init();
            this.sidebar.init();
            news.pubsub.emit('question:selected', [news.$('.input__container').first()]);

            // iphone fix - stop iphones from being able to press "Go" to submit the form (which just refreshes the page)
            news.$('.inputs_container').on('submit', function () {
                return false;
            });
        },

        initiated: false
    };

    return new ViewInputs();
});