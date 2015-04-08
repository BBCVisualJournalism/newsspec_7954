define(['lib/news_special/bootstrap', 'lib/news_special/share_tools/controller', 'custom_template_engine', 'calculator_model', 'questions_model', 'graph_component', 'video_loader'], function (news, shareTools, templateEngine, CalculatorModel, QuestionsModel, graph, VideoLoader) {

    var ViewResults = function () {

    };

    ViewResults.prototype = {

        initiated: false,

        init: function () {
            CalculatorModel.updateResults(QuestionsModel.getInputs());
            this.subscribe();
            this.displayResults();
            this.initiated = true;
        },

        subscribe: function () {
            var self = this;
            news.pubsub.on('questions:requested', function () {
                self.clearView();
            });
        },

        displayResults: function () {
            this.displayTopSports();

            var topSportsJSON = CalculatorModel.getTopNItems(1),
                sports = this.getSportVocabsForJSON(topSportsJSON),
                topSport = sports[0];

            this.displayGraph(topSport);
            this.displayGetInspired(topSport);
            this.displayBottomSports();
            this.displayVideoSection(topSport);

            var shareMessage = topSport.name + ' ' + vocabs_scaffolding['share_message_part_1'] + ' ' + vocabs_scaffolding['share_message_part_2'];

            if (!this.initiated) {
                this.loadShareTools(shareMessage);
            } else {
                news.pubsub.emit('ns:share:message', [shareMessage]);
            }
        },

        displayTopSports: function () {
            var template = news.$('.template___results__list_container').html(),
                topSportsJSON = CalculatorModel.getTopNItems(3);

            var sports = this.getSportVocabsForJSON(topSportsJSON);

            var topSports = templateEngine(template, {
                    header:       vocabs_scaffolding['scaffold_results_top'],
                    first: {
                        sport:      sports[0].name,
                        identifier: sports[0].identifier,
                        feedback:   sports[0].feedback,
                        url:        sports[0].url,
                        linkText:   sports[0].linkText
                    },
                    second: {
                        sport:      sports[1].name,
                        identifier: sports[1].identifier,
                        url:        sports[1].url,
                        linkText:   sports[1].linkText
                    },
                    third: {
                        sport:      sports[2].name,
                        identifier: sports[2].identifier,
                        url:        sports[2].url,
                        linkText:   sports[2].linkText
                    }
                });

            news.$('.results__list_container').html(topSports);
        },

        displayGraph: function (topSport) {

            function onGraphDialClick(property) {
                var inputContainer = QuestionsModel.getContainerFromInput(news.$('.input__element[data-property="' + property + '"]'));
                news.pubsub.emit('question:selected', [inputContainer]);
            }

            graph.init('.results_container .results__graph', topSport.icon, onGraphDialClick);

            // want to highlight the input with the highest value
            var userInputs            = CalculatorModel.getUserInputs(),
                topInputProperty      = CalculatorModel.getHighestProperty(userInputs),
                correspondingQuestion = news.$('.input__element[data-property="' + topInputProperty + '"]'),
                questionContainer     = QuestionsModel.getContainerFromInput(correspondingQuestion);
            news.pubsub.emit('question:selected', [questionContainer]);

            graph.updateGraphStatusText(topInputProperty);
        },

        displayGetInspired: function (topSport) {
            var template = news.$('.template___results__get_inspired').html(),
                html     = templateEngine(template, {
                    header:            topSport.name,
                    topSport:          topSport,
                    didYouKnow:        vocabs_scaffolding['scaffold_results_did_you_know'],
                    commonwealthCta:   vocabs_scaffolding['scaffold_commonwealth_site_cta'],
                    commonwealthUrl:   vocabs_scaffolding['scaffold_commonwealth_site_url'],
                    commonwealthImage: vocabs_scaffolding['scaffold_commonwealth_site_image']
                });

            news.$('.results__get_inspired').html(html);
        },

        displayBottomSports: function () {
            var template = news.$('.template___results__bottom').html(),
                bottomSportsJSON = CalculatorModel.getBottomNItems(3);

            var sports = this.getSportVocabsForJSON(bottomSportsJSON);

            var bottomSports = templateEngine(template, {
                    header: vocabs_scaffolding['scaffold_results_bottom'],
                    sports: sports
                });

            news.$('.results__bottom').html(bottomSports);
        },

        displayVideoSection: function (topSport) {

            var html     = '',
                template = news.$('.template___results__video').html();

            if (topSport.video) {
                html = templateEngine(template, {
                    header:   topSport.video.title,
                    playlist: topSport.video.playlist
                });
            }

            news.$('.results__video').html(html);

            VideoLoader.loadVideos();
        },

        getSportVocabsForJSON: function (json) {
            for (var jsonElement in json) {
                json[jsonElement] = this.getSportVocabsForElement(json[jsonElement]);
            }
            return json;
        },

        getSportVocabsForElement: function (jsonElement) {
            return vocabs_sports[jsonElement['sport']];
        },

        clearView: function () {
            news.$('.results__video').html('');
        },

        loadShareTools: function (message) {
            shareTools.init('.results__share', {
                storyPageUrl: vocabs_scaffolding['share_url'],
                buttonText:   vocabs_scaffolding['scaffold_button_share'],
                header:       vocabs_scaffolding['share_header'],
                image:        vocabs_scaffolding['share_image'],
                message:      message,
                hashtag:      vocabs_scaffolding['share_hashtag'],
                template:     'dropdown'
            });
        }
    };

    return new ViewResults();
});