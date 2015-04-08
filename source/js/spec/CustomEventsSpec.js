define(['lib/news_special/bootstrap', 'CustomEvents'],  function (news, CustomEvents) {

    beforeEach(function () {
        news.$('body').append('<div class="main"><input class="input__element" /> <button class="button button--results">Results</button></div>');
    });

    afterEach(function () {
        news.$('.main').remove();
    });

    describe('custom events', function () {

        it('should fire event when input is changed', function () {
            the.customEvent('input:changed').shouldBeFiredOn(function () {
                news.$('.input__element').trigger('change');
            });
        });

        it('should fire event when results are requested', function () {
            the.customEvent('results:requested').shouldBeFiredOn(function () {
                news.$('.button--results').click();
            });
        });

        it('should fire event when scrolling', function () {
            the.customEvent('window:scroll').shouldBeFiredOn(function () {
                news.$(window.parent).scroll();
            }, 30);
        });

        it('should fire event on resize', function () {
            the.customEvent('window:resize').shouldBeFiredOn(function () {
                news.$(window).resize();
            }, 100);
        });
    });

    describe('public api of the CustomEvents module', function () {

        it('should be able to trigger the events manually', function () {

            the.customEvent('window:resize').shouldBeFiredOn(function () {
                CustomEvents.trigger('resize');
            });

            the.customEvent('window:scroll').shouldBeFiredOn(function () {
                CustomEvents.trigger('scroll');
            });

        });

    });

    var CustomEventTester = function () {

        this.customEvent = function (eventToListenFor) {
            this.eventToListenFor = eventToListenFor;
            return this;
        };

        this.shouldBeFiredOn = function (actionToTriggerEvent, timeout) {
            var defaultTimeout = 10,
                eventWasFired  = false;

            timeout = timeout || defaultTimeout;

            news.pubsub.on(this.eventToListenFor, function () {
                eventWasFired = true;
            });

            actionToTriggerEvent();

            waitsFor(function () {
                return eventWasFired;
            }, 'the event to have fired', timeout);
        };

    };

    var the = new CustomEventTester();

});