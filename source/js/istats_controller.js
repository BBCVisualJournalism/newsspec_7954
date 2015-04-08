define(['lib/news_special/bootstrap'], function (news) {

    news.pubsub.emit('istats', ['app-initiated', 'newsspec-nonuser', true]);

    news.pubsub.on('question:selected', function (question) {
        var questionNumber = question.find('.input__element').attr('id');
        news.pubsub.emit('istats', ['question-scrolled-to', 'newsspec-interaction', questionNumber]);
    });

    news.pubsub.on('input:changed', function (inputContainer) {
        var questionNumber = news.$(inputContainer).find('.input__element').attr('id');
        news.pubsub.emit('istats', ['question-value-changed', 'newsspec-interaction', questionNumber]);
    });

    news.pubsub.on('results:requested', function () {
        news.pubsub.emit('istats', ['results-view', 'newsspec-interaction']);
    });

    news.pubsub.on('questions:requested', function () {
        news.pubsub.emit('istats', ['questions-view', 'newsspec-interaction']);
    });

    news.pubsub.on('reset', function () {
        news.pubsub.emit('istats', ['calculator-reset', 'newsspec-interaction']);
    });

    // news.pubsub.on('istats', function (actionType, actionName, actionValue) {
    //     console.log('actionType: ' + actionType, 'actionName: ' + actionName, 'actionValue: ' + actionValue);
    // });

});