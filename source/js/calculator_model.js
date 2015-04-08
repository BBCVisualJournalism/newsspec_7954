define(['lib/news_special/bootstrap', 'data/data'], function (news, data) {

    var CalculatorModel = function () {
        this.results = [];
    };

    CalculatorModel.prototype = {

        updateResults: function (inputs) {
            this.generateResults(inputs);
        },

        generateResults: function (inputs) {
            var CalculatorModel = this,
                unsortedResults = [];

            news.$.each(data, function (key, object) {
                unsortedResults.push(CalculatorModel.calculateResult(inputs, CalculatorModel.clean(object)));
            });

            this.results = unsortedResults;
        },

        clean: function (obj) {

            var propertiesToClean = [
                    'aggression_low',
                    'aggression_high',
                    'body_awareness_low',
                    'body_awareness_high',
                    'communication_low',
                    'communication_high',
                    'focus_low',
                    'focus_high',
                    'trust_low',
                    'trust_high',
                    'pain_tolerance_low',
                    'pain_tolerance_high',
                    'height_low',
                    'height_high',
                    'body_fat_low',
                    'body_fat_high',
                    'power_low',
                    'power_high',
                    'endurance_low',
                    'endurance_high',
                    'coordination_low',
                    'coordination_high',
                    'agility_low',
                    'agility_high',
                    'age_low',
                    'age_high'
                ],
                index = propertiesToClean.length,
                property;

            while (index-- > 0) {
                property = propertiesToClean[index];
                obj[property] = this.cleanProperty(obj[property]);
            }

            return obj;
        },

        cleanProperty: function (property) {
            return parseInt(property, 10);
        },

        calculateResult: function (inputs, object) {

            var score = this.factorInAge(inputs['age'], object['age_low'], object['age_high']);

            var properties = [
                'aggression',
                'body_awareness',
                'communication',
                'focus',
                'pain_tolerance',
                'trust',
                'height',
                'body_fat',
                'power',
                'endurance',
                'coordination',
                'agility'
            ];

            for (var i = 0; i < properties.length; i++) {
                var property = properties[i];
                score += this.calculateProperty(inputs[property], object[property + '_low'], object[property + '_high']);
            }

            return {
                'sport': object.sport,
                'score': score,
                'user': inputs,
                'ideal': object
            };
        },

        // Every 5 years away from the ideal age range, add 1 point.
        // Up to 50 years way from the ideal age range gives the maximum +10 points.
        factorInAge: function (age, min, max) {
            var factorInAge = Math.sqrt(this.calculateProperty(age, min, max));
            factorInAge = Math.floor(factorInAge / 5);
            factorInAge = factorInAge > 10 ? 10 : factorInAge;
            return factorInAge;
        },

        calculateProperty: function (actual, min, max) {
            var score;

            if (actual > max) {
                score = actual - max;
            }
            else if (actual < min) {
                score = min - actual;
            }
            else {
                score = 0;
            }

            score = Math.pow(score, 2);

            return score;
        },

        getUserInputs: function () {
            return this.results[0].user;
        },

        getHighestProperty: function (inputs) {
            var highestProperty = {
                    property: 'n/a',
                    value: -1
                },
                property,
                value;
            for (property in inputs) {
                value = inputs[property];
                if (property !== 'age' && value > highestProperty.value) {
                    highestProperty = {
                        property: property,
                        value:    value
                    };
                }
            }
            return highestProperty.property;
        },

        orderByScoreDescending: function (obj1, obj2) {
            return (obj2.score - obj1.score);
        },

        orderByScoreAscending: function (obj1, obj2) {
            return (obj1.score - obj2.score);
        },

        getTopNItems: function (numberOfResultsToDisplay) {
            this.results.sort(this.orderByScoreAscending);
            return this.getNItems(numberOfResultsToDisplay);
        },

        getBottomNItems: function (numberOfResultsToDisplay) {
            this.results.sort(this.orderByScoreDescending);
            return this.getNItems(numberOfResultsToDisplay);
        },

        getNItems: function (numberOfResultsToDisplay) {
            var shortlist = [];

            for (var i = 0; i < numberOfResultsToDisplay; i++) {
                shortlist.push(this.results[i]);
            }

            return shortlist;
        }
    };

    return new CalculatorModel();
});