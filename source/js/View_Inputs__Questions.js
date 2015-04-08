define(['lib/news_special/bootstrap', 'questions_model', 'custom_template_engine'], function (news, QuestionsModel, templateEngine) {

    var ViewInputsQuestions = function () {
    };

    ViewInputsQuestions.prototype = {

        init: function () {
            QuestionsModel.init();

            if (news.supports.inputType.range()) {
                this.progressivelyEnhance();
            } else {
                this.treatAllInputsAsNumberInputs();
            }
            this.loadAnswerFeedback();
            this.subscribe();
        },

        progressivelyEnhance: function () {
            var self = this;

            news.$('.inputs_container').addClass('inputs_container--range_supported');
            this.styleSliderElements();

            news.pubsub.on('input:changing', function (containerId) {
                self.updateSliderColor(containerId);
                self.killSloth(containerId);
            });
        },

        treatAllInputsAsNumberInputs: function () {
            news.$('.input__element').addClass('input__element--number');
        },

        subscribe: function () {
            var self = this;
            
            news.pubsub.on('input:changing', function (containerId) {
                news.$(containerId).addClass('input__container--answered');
                self.showAnswerFeedback(containerId);
                self.highlightQuestionAfterQuestion(news.$(containerId));
            });

            news.pubsub.on('question:selected', function (question) {
                self.highlightAllQuestionsUpToThisOne(question);
            });

            news.pubsub.on('reset', function () {
                self.resetCalculator();
                news.pubsub.emit('questions:requested');
            });
        },

        highlightAllQuestionsUpToThisOne: function (question) {

            news.$('.input__container--selected').addClass('input__container--answered').removeClass('input__container--selected');
            question.addClass('input__container--selected');

            news.$('.input__container').each(function () {

                if (question.attr('id') === news.$(this).attr('id')) {
                    return false;
                }

                news.$(this).addClass('input__container--answered');
            });
        },

        highlightQuestionAfterQuestion: function (question) {

            var currentQuestion,
                highlightNextQuestion = false;

            news.$('.input__container').each(function () {
                currentQuestion = news.$(this);

                if (highlightNextQuestion) {
                    currentQuestion.addClass('input__container--answered');
                    return false;
                }

                if (currentQuestion.attr('id') === question.attr('id')) {
                    highlightNextQuestion = true;
                }
            });
        },

        styleSliderElements: function () {
            var self = this,
                sliderID;
            news.$('.input__element[type="range"]').addClass('input__element--range').each(function () {
                sliderID = QuestionsModel.getContainerFromInput(news.$(this)).attr('id');
                self.updateSliderColor('#' + sliderID);
            });
        },

        // colors the slider either side of the "thumb" in the middle of the slider.
        // this can't be done in CSS.
        updateSliderColor: function (containerId) {
            var slider     = QuestionsModel.getInputFromContainer(news.$(containerId))[0],
                value      = (slider.value - slider.min) / (slider.max - slider.min),
                leftColor  = news.$('.slider_color--left').css('background-color'),
                rightColor = news.$('.slider_color--right').css('background-color');

            if (slider.type === 'range') {
                slider.style.backgroundImage = [
                    '-webkit-gradient(',
                    'linear, ',
                    'left top, ',
                    'right top, ',
                    'color-stop(' + value + ', ' + leftColor + '), ',
                    'color-stop(' + value + ', ' + rightColor + ')',
                    ')'
                ].join('');
            }
        },

        loadAnswerFeedback: function () {
            var self = this;
            news.$('.input__container').each(function () {
                self.showAnswerFeedback('#' + news.$(this).attr('id'));
            });
        },

        showAnswerFeedback: function (containerId) {

            var self           = this,
                inputElement   = QuestionsModel.getInputFromContainer(news.$(containerId)),
                userInputValue = QuestionsModel.getInputValue(inputElement),
                feedback       = QuestionsModel.getInputFeedback(inputElement),
                template       = news.$('.template___header_and_paragraph').html() || '',
                html           = templateEngine(template, {
                    header:     userInputValue,
                    paragraph:  feedback,
                    showHeader: news.supports.inputType.range()
                });

            news.$(containerId).find('.input__element__summary').html(html);
        },

        killSloth: function (containerId) {
            var inputElement = QuestionsModel.getInputFromContainer(news.$(containerId));

            if (containerId === '#input__container--12' && QuestionsModel.getInputValue(inputElement) >= 2) {
                var sloth = news.$(containerId + ' .input__icon--left');
                sloth.addClass('input__icon--killSloth');

                setTimeout(function () {
                    sloth.hide();
                }, 2500);
            }
        },

        resetCalculator: function () {
            var currentInput;
            news.$('.input__element').each(function () {
                currentInput = news.$(this);
                currentInput.val(currentInput.attr('data-default-value'));
            });
            news.$('.input__icon--killSloth').show().removeClass('input__icon--killSloth');
            news.$('.input__container--answered').removeClass('input__container--answered');
        }

    };

    return ViewInputsQuestions;
});