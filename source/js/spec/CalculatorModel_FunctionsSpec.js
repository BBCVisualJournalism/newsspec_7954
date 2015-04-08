define(['lib/news_special/bootstrap', 'CalculatorModel'],  function (news, calculator) {

    describe('Calculator function - clean()', function () {

        it('should cast certain properties to int', function () {

            var dirtyObject = {
                    'sport':          'The Specials Team Coding Triathlon',
                    'aggression_low': -17,
                    'aggression_high': 3.4,
                    'body_awareness_low': 4,
                    'body_awareness_high': 3.45,
                    'communication_low': 0.35,
                    'communication_high': '7',
                    'focus_low': ' 4',
                    'focus_high': '3 ',
                    'trust_low': '21',
                    'trust_high': '     4',
                    'pain_tolerance_low': 0,
                    'pain_tolerance_high': '0',
                    'height_low': '0.1',
                    'height_high': '-3.1',
                    'body_fat_low': 3,
                    'body_fat_high': 3,
                    'power_low': 3,
                    'power_high': 3,
                    'endurance_low': 3,
                    'endurance_high': 3,
                    'coordination_low': 3,
                    'coordination_high': 3,
                    'agility_low': 3,
                    'agility_high': 3,
                    'age_low': 3,
                    'age_high': 3
                },
                expectedCleanedObject = {
                    'sport':          'The Specials Team Coding Triathlon',
                    'aggression_low': -17,
                    'aggression_high': 3,
                    'body_awareness_low': 4,
                    'body_awareness_high': 3,
                    'communication_low': 0,
                    'communication_high': 7,
                    'focus_low': 4,
                    'focus_high': 3,
                    'trust_low': 21,
                    'trust_high': 4,
                    'pain_tolerance_low': 0,
                    'pain_tolerance_high': 0,
                    'height_low': 0,
                    'height_high': -3,
                    'body_fat_low': 3,
                    'body_fat_high': 3,
                    'power_low': 3,
                    'power_high': 3,
                    'endurance_low': 3,
                    'endurance_high': 3,
                    'coordination_low': 3,
                    'coordination_high': 3,
                    'agility_low': 3,
                    'agility_high': 3,
                    'age_low': 3,
                    'age_high': 3
                },
                actualCleanedObject = calculator.clean(dirtyObject);
            
            expect(actualCleanedObject).toEqual(expectedCleanedObject);
        });
    });

    describe('Calculator function - cleanProperty()', function () {

        it('should cast the param to int', function () {
            
            t.inputting('3').intoFunction(calculator.cleanProperty).shouldOutput(3);
            t.inputting(' 4').intoFunction(calculator.cleanProperty).shouldOutput(4);
            t.inputting('7   ').intoFunction(calculator.cleanProperty).shouldOutput(7);
        });

    });

    var CustomTests = function () {

        this.inputting = function (input) {
            this.input = input;
            return this;
        };

        this.intoFunction = function (func) {
            func = func || function () {};
            this.output = func(this.input);
            return this;
        };

        this.shouldOutput = function (expectedOutput) {
            expect(this.output).toEqual(expectedOutput);
        };
    };

    var t = new CustomTests();
});