define(['lib/news_special/bootstrap', 'CalculatorModel', 'spec/data/testData'],  function (news, calculator, testData) {

    var inputValues,
        expectedOutput,
        actualOutput;

    describe('Calculator delivering sports in order of appropriateness', function () {

        it('should give me cycling (medium) when I put in specific input values', function () {

            var inputValues = {
                    'age':            30,
                    'aggression':     7,
                    'body_awareness': 6,
                    'communication':  3,
                    'focus':          8,
                    'pain_tolerance': 8,
                    'trust':          4,
                    'height':         5,
                    'body_fat':       3,
                    'power':          5,
                    'endurance':      7,
                    'coordination':   3,
                    'agility':        1
                },
                expected = {
                    'sport': 'cycling_medium',
                    'score': 0                  // perfect inputs should give zero score
                };

            actualOutput = returnTopItems(inputValues, 1);
            expect(actualOutput[0].sport).toEqual(expected.sport);
            expect(actualOutput[0].score).toEqual(expected.score);
        });

        it('should factor in age properly', function () {

            var minAge = 20,
                maxAge = 25;

            // these should all be zero
            expect(calculator.factorInAge(23, minAge, maxAge)).toEqual(0);
            expect(calculator.factorInAge(20, minAge, maxAge)).toEqual(0);
            expect(calculator.factorInAge(25, minAge, maxAge)).toEqual(0);
            expect(calculator.factorInAge(26, minAge, maxAge)).toEqual(0);
            expect(calculator.factorInAge(16, minAge, maxAge)).toEqual(0);

            // these should add to your score
            expect(calculator.factorInAge(30, minAge, maxAge)).toEqual(1);
            expect(calculator.factorInAge(15, minAge, maxAge)).toEqual(1);
            expect(calculator.factorInAge(40, minAge, maxAge)).toEqual(3);
            expect(calculator.factorInAge(44, minAge, maxAge)).toEqual(3);
            expect(calculator.factorInAge(45, minAge, maxAge)).toEqual(4);
        });

        it('should have the same scores as the test data', function () {

            loopThroughTestData(function (inputs, outputs) {
                expectedOutput = getResultsScoreAscending(outputs);
                actualOutput = returnTopItems(inputs, expectedOutput.length);

                expect(actualOutput[0].sport).toEqual(expectedOutput[0].sport);
                expect(actualOutput[0].score).toEqual(expectedOutput[0].score);
            });
            
        });

        it('should deliver scores in ascending order. 0 is good, high is bad.', function () {
            var firstItem = actualOutput[0],
                lastItem  = actualOutput[actualOutput.length - 1];
            
            expect(firstItem.score).toBeLessThan(lastItem.score);
        });
    });

    describe('Calculator delivering sports in order of inappropriateness', function () {

        it('should have the same scores as the test data', function () {
            
            loopThroughTestData(function (inputs, outputs) {
                expectedOutput = getResultsScoreDescending(outputs);
                
                actualOutput = (function () {
                    calculator.generateResults(inputs);
                    return calculator.getBottomNItems(expectedOutput.length);
                }());

                expect(actualOutput.sport).toEqual(expectedOutput.sport);
            });

        });

        it('should deliver scores in descending order. 0 is good, high is bad.', function () {
            var firstItem = actualOutput[0],
                lastItem  = actualOutput[actualOutput.length - 1];
            
            expect(firstItem.score).toBeGreaterThan(lastItem.score);
        });
    });

    function returnTopItems(inputs, length) {
        calculator.generateResults(inputs);
        return calculator.getTopNItems(length);
    }

    function loopThroughTestData(callback) {
        var inputs, outputs;

        for (var testDataTitle in testData) {
            inputs  = getCategoryRatingsFromTestDataTitle(testDataTitle);
            outputs = testData[testDataTitle];
            callback(inputs, outputs);
        }
    }

    function getCategoryRatingsFromTestDataTitle(testDataTitle) {
        var inputValues = testDataTitle.split('');
        
        inputValues = {
            'age':            cleanInt('' + inputValues[0] + inputValues[1]),
            'aggression':     cleanInt(inputValues[2]),
            'body_awareness': cleanInt(inputValues[3]),
            'communication':  cleanInt(inputValues[4]),
            'focus':          cleanInt(inputValues[5]),
            'pain_tolerance': cleanInt(inputValues[6]),
            'trust':          cleanInt(inputValues[7]),
            'height':         cleanInt(inputValues[8]),
            'body_fat':       cleanInt(inputValues[9]),
            'power':          cleanInt(inputValues[10]),
            'endurance':      cleanInt(inputValues[11]),
            'coordination':   cleanInt(inputValues[12]),
            'agility':        cleanInt(inputValues[13])
        };

        return inputValues;
    }

    function getResultsScoreAscending(rawJSON) {
        var unsortedResults = getUnsortedResults(rawJSON);
        return unsortedResults.sort(calculator.orderByScoreAscending);
    }

    function getResultsScoreDescending(rawJSON) {
        var unsortedResults = getUnsortedResults(rawJSON);
        return unsortedResults.sort(calculator.orderByScoreDescending);
    }

    function getUnsortedResults(rawJSON) {
        var unsortedResults = [];

        for (var num in rawJSON) {
            unsortedResults.push({
                'sport': rawJSON[num].sport,
                'score': cleanInt(rawJSON[num].score)
            });
        }

        unsortedResults.sort(calculator.orderByScoreAscending);

        return unsortedResults;
    }

    function cleanInt(input) {
        return parseInt(input, 10);
    }
});