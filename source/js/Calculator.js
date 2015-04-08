define(['lib/news_special/bootstrap', 'lib/news_special/share_tools/controller', 'calculator_model', 'view_inputs', 'view_results', 'custom_events'], function (news, shareTools, model, InputsView, ResultsView, CustomEvents) {

    var Calculator = function () {

    };

    Calculator.prototype = {

        initiated: false,

        init: function () {
            this.subscribe();
            this.initInputsView();
            this.initiated = true;
        },

        subscribe: function () {
            var self = this;

            news.pubsub.on('results:requested', function () {
                self.initResultsView();
            });

            news.pubsub.on('questions:requested', function () {
                self.initInputsView();
                self.scrollToTopOfIframe();
            });
        },

        initInputsView: function () {
            this.displayContainer('.inputs_container');
            InputsView.init();
        },

        initResultsView: function () {
            this.displayContainer('.results_container');
            ResultsView.init();
        },

        displayContainer: function (containerName) {
            news.$('.inputs_container, .results_container').hide();
            news.$(containerName).show();

            if (this.initiated) {
                this.scrollToTopOfIframe();
            }
        },

        scrollToTopOfIframe: function () {
            try {
                var iFrame = news.$(window.parent.document.getElementById('iframe_newsspec_7954'));
                if (iFrame.length > 0) {
                    window.parent.scrollTo(0, iFrame.offset().top);
                }
                CustomEvents.trigger('scroll');
            } catch (e) {
                // this will be caught on US proxy, means they won't be taken to the top of the results page
                // uk should still get this behaviour
                news.$.emit('scroll:top', []);
            }
        }
    };

    return Calculator;
});