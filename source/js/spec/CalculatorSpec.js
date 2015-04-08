define(['lib/news_special/bootstrap', 'Calculator', 'spec/data/fixtureData'],  function (news, Calculator, fixtureData) {

    beforeEach(function () {
        news.$('body').append(fixtureData);
    });

    afterEach(function () {
        news.$('.main').remove();
    });

    describe('Calculator', function () {

        it('should be not be marked as initiated on page load', function () {
            var calculator = new Calculator();
            expect(calculator.initiated).toBeFalsy();
        });

        it('should be marked as initiated after calling init()', function () {
            var calculator = new Calculator();
            calculator.init();
            expect(calculator.initiated).toBeTruthy();
        });

        it('should load the questions view on init', function () {
            var theCalculator = new Calculator();
            t.listeningTo(theCalculator).theFunction('initInputsView').shouldBeTriggeredOn(function () {
                theCalculator.init();
            });
        });

        it('should trigger the right view on certain events', function () {
            var theCalculator = new Calculator();
            theCalculator.init();

            t.listeningTo(theCalculator).theFunction('initInputsView').shouldBeTriggeredOnPubsub('questions:requested');
            t.listeningTo(theCalculator).theFunction('initResultsView').shouldBeTriggeredOnPubsub('results:requested');
        });

        it('should only trigger iFrame scroll after interaction', function () {
            var theCalculator = new Calculator();

            spyOn(theCalculator, 'scrollToTopOfIframe');
            theCalculator.initInputsView();
            expect(theCalculator.scrollToTopOfIframe).not.toHaveBeenCalled();

            theCalculator.init();
            theCalculator.initInputsView();
            expect(theCalculator.scrollToTopOfIframe).toHaveBeenCalled();
        });

    });

    var TestHelper = function () {

        this.listeningTo = function (calculatorObject) {
            this.calculator = calculatorObject;
            return this;
        };

        this.theFunction = function (funcName) {
            this.funcName = funcName;
            return this;
        };

        this.shouldBeTriggeredOn = function (functionToTriggerFunction) {
            this.eventThatTriggersTheFunction = functionToTriggerFunction;
            this.doTheTest();
        };

        this.shouldBeTriggeredOnPubsub = function (pubsubEvent) {
            this.eventThatTriggersTheFunction = function () {
                news.pubsub.emit(pubsubEvent);
            };
            this.doTheTest();
        };

        this.doTheTest = function () {
            var theCalculator                 = this.calculator,
                eventThatTriggersTheFunction  = this.eventThatTriggersTheFunction,
                functionThatShouldBeTriggered = this.funcName;

            spyOn(theCalculator, functionThatShouldBeTriggered);
            eventThatTriggersTheFunction();
            expect(theCalculator[functionThatShouldBeTriggered]).toHaveBeenCalled();
        };

    };

    t = new TestHelper();

});