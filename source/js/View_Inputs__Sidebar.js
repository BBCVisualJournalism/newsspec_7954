define(['lib/news_special/bootstrap', 'custom_template_engine', 'questions_model', 'graph_component'], function (news, templateEngine, QuestionsModel, graph) {

    var ViewInputsSidebar = function () {

    };

    ViewInputsSidebar.prototype = {

        init: function () {
            this.subscribe();

            function onGraphDialClick(property) {
                var inputContainer = QuestionsModel.getContainerFromInput(news.$('.input__element[data-property="' + property + '"]'));
                
                // need to reset hash first, otherwise subsequent clicks of the attribute won't move the document
                window.location.hash = '';
                window.location.hash = inputContainer.attr('id');

                // need the setTimeout as something else in the app emits the question:selected
                // which would otherwise override which question the user wants to jump to
                setTimeout(function () {
                    news.pubsub.emit('question:selected', [inputContainer]);
                }, 100);
            }

            graph.init('.sidebar .graph', 'img/man_icon.png', onGraphDialClick);
        },

        subscribe: function () {
            var view = this;

            news.pubsub.on('input:changing', function (containerId) {
                graph.update();
                graph.highlight();
                news.pubsub.emit('question:selected', [news.$(containerId)]);
            });

            news.pubsub.on('question:selected', function (question) {
                view.updateSidebarHtml(question);
                graph.highlight();
                view.matchSidebarToQuestion(question);
            });

            news.pubsub.on('questions:requested', function () {
                var firstQuestion = news.$('.input__container').first();
                // may select 2nd question by default otherwise
                news.pubsub.emit('question:selected', [firstQuestion]);
            });

            function respondToScroll(scroll) {
                view.respondToScroll(scroll);
            }

            news.pubsub.on('window:scroll', respondToScroll);

            news.pubsub.on('results:requested', function () {
                news.pubsub.off('window:scroll', respondToScroll);
            });
        },

        matchSidebarToQuestion: function (question) {
            QuestionsModel.markQuestionAsSelected(question);
            this.repositionSidebar(QuestionsModel.questionScrollTop(question));
        },

        updateSidebarHtml: function (question) {
            var attribute      = question.find('.input__element').attr('data-description'),
                text           = question.find('.input__textsection').html(),
                sidebarHtml    = this.generateSidebarHtml(attribute, text),
                sidebarElement = news.$('.sidebar__question_feedback');

            if (sidebarElement.html() !== sidebarHtml) {
                sidebarElement
                    .css('opacity', 0)
                    .html(sidebarHtml)
                    .fadeTo('slow', 1);
            }
        },

        generateSidebarHtml: function (attribute, text) {
            var template = news.$('.template___header_and_paragraph').html() || '',
                sidebarHtml = templateEngine(template, {
                    header:     attribute,
                    paragraph:  text,
                    showHeader: true
                });

            return sidebarHtml;
        },

        respondToScroll: function (scroll) {
            var sidebarOffset                = this.getSidebarOffset(scroll),
                matchQuestionClosestToOffset = sidebarOffset + scroll.viewportHeight / 4,
                nearestQuestion              = QuestionsModel.getNearestQuestion(matchQuestionClosestToOffset);

            QuestionsModel.markQuestionAsSelected(nearestQuestion);
            this.repositionSidebar(QuestionsModel.questionScrollTop(nearestQuestion));
        },

        getSidebarOffset: function (scroll) {
            return scroll.parentScrollTop - scroll.iFrameOffset;
        },

        repositionSidebar: function (sidebarOffset) {
            news.$('.sidebar').css('top', sidebarOffset + 'px');
        }
    };

    return ViewInputsSidebar;
});