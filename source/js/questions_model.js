define(['lib/news_special/bootstrap'], function (news) {

    var QuestionsModel = function () {
        this.inputs = {};
    };

    QuestionsModel.prototype = {

        init: function () {
            
            var self = this;

            this.inputs = this.getUserInputs();

            news.pubsub.on('input:changing', function (containerId) {
                self.inputs = self.getUserInputs();
            });
        },

        getInputsForGraph: function () {
            var inputsArray = [],
                input;

            for (input in this.inputs) {
                if (input !== 'age') {
                    inputsArray.push({
                        title:    this.convertPropertyToTitle(input),
                        property: input,
                        value:    this.inputs[input]
                    });
                }
            }

            return inputsArray;
        },

        convertPropertyToTitle: function (property) {
            return news.$('.input__element[data-property="' + property + '"]').attr('data-description');
        },

        getInputs: function () {
            return this.inputs;
        },

        getUserInputs: function () {
            var self = this,
                inputsAsJSON = {},
                inputElement,
                property,
                value;

            news.$('.input__container').each(function () {
                inputElement = self.getInputFromContainer(news.$(this));
                property     = inputElement.attr('data-property');
                value        = self.getInputValue(inputElement);

                inputsAsJSON[property] = value;
            });

            return inputsAsJSON;
        },

        getInputValue: function (inputElement) {
            
            var value = this.normaliseInputValue(inputElement),
                scaleReversed  = inputElement.attr('data-reverseScale') === 'true';
            
            if (scaleReversed) {
                value = 11 - value;
            }

            return value;
        },

        normaliseInputValue: function (inputElement) {
            var value      = inputElement.val(),
                defaultVal = inputElement.attr('data-default-value'),
                min        = inputElement.attr('min'),
                max        = inputElement.attr('max');

            if (!news.$.isNumeric(value)) {
                value = defaultVal;
            }

            value = parseInt(value, 10);
            min   = parseInt(min, 10);
            max   = parseInt(max, 10);

            if (value > max) {
                value = max;
            }
            else if (value < min) {
                value = min;
            }

            inputElement.val(value);

            return value;
        },

        getInputFeedback: function (inputElement) {
            var min       = inputElement.attr('min'),
                max       = inputElement.attr('max'),
                value     = this.getInputValue(inputElement),
                container = this.getContainerFromInput(inputElement),
                summary;

            if (value <= 2) {
                summary = container.find('.input__element__summary_text--lowest').html();
            }
            else if (value <= 4) {
                summary = container.find('.input__element__summary_text--low').html();
            }
            else if (value <= 6) {
                summary = container.find('.input__element__summary_text--middle').html();
            }
            else if (value <= 8) {
                summary = container.find('.input__element__summary_text--high').html();
            }
            else {
                summary = container.find('.input__element__summary_text--highest').html();
            }

            return summary;
        },

        getInputFromContainer: function (container) {
            return container.find('.input__element');
        },

        getContainerFromInput: function (inputElement) {
            return inputElement.parent();
        },

        markQuestionAsSelected: function (question) {
            if (!question.hasClass('input__container--selected')) {
                news.pubsub.emit('question:selected', [question]);
            }
        },

        getNearestQuestion: function (offsetToMatch) {
            var bestMatch = news.$('.input__element').first(),
                questionContainer,
                questionOffset;

            news.$('.input__element').each(function (i) {
                
                questionOffset = news.$(this).offset().top;

                // get first question that is "in view" according to the offset to match
                if (questionOffset > offsetToMatch) {
                    bestMatch = news.$(this);
                    return false;
                }
            });

            questionContainer = this.getContainerFromInput(bestMatch);
            return questionContainer;
        },

        questionScrollTop: function (question) {
            return question.offset().top;
        }
    };

    return new QuestionsModel();
});