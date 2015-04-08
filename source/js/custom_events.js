define(['lib/news_special/bootstrap'], function (news) {

    var CustomEvents = function () {
        this.init();
    };

    CustomEvents.prototype = {
        
        init: function () {
            this.defineInputEvents();
            this.defineWindowResizeEvent();
            this.defineWindowScrollEvent();
        },

        defineInputEvents: function () {

            news.$(document).on('input', '.input__element--range', function () {
                news.pubsub.emit('input:changing', ['#' + news.$(this).parent().attr('id')]);
            });

            // specifically for IE10
            news.$(document).on('change', '.input__element--range', function () {
                news.pubsub.emit('input:changing', ['#' + news.$(this).parent().attr('id')]);
            });

            news.$(document).on('change', '.input__element--number', function () {
                news.pubsub.emit('input:changing', ['#' + news.$(this).parent().attr('id')]);
            });

            news.$(document).on('change', '.input__element', function () {
                news.pubsub.emit('input:changed', ['#' + news.$(this).parent().attr('id')]);
            });

            news.$(document).on('click', '.button--results', function (event) {
                event.preventDefault();
                news.pubsub.emit('results:requested');
                return false;
            });

            news.$(document).on('click', '.button--return', function (event) {
                event.preventDefault();
                news.pubsub.emit('questions:requested');
                return false;
            });

            news.$(document).on('click', '.button--reset', function (event) {
                event.preventDefault();
                news.pubsub.emit('reset');
                return false;
            });
        },

        defineWindowResizeEvent: function () {
            var self = this;
            news.$(window).on('resize', function () {
                delay(self.fireResizeEvent, 100);
            });
        },

        defineWindowScrollEvent: function () {
            var self = this;
            // news.$(window.parent).on('scroll', function () {
            //     delay(self.fireScrollEvent, 30);
            // });
        },

        fireResizeEvent: function () {
            news.pubsub.emit('window:resize', [news.$(window).width()]);
        },

        fireScrollEvent: function () {
            // var parentScrollTop = news.$(window.parent, window.parent.document).scrollTop(),
            //     iFrameElement   = window.parent.document.getElementById('iframe_newsspec_7954'),
            //     iFrameOffset    = news.$(iFrameElement).offset() || {},
            //     iFrameHeight    = news.$('.main').outerHeight(),
            //     viewportHeight  = news.$(window.parent).height();


            // iFrameOffset = iFrameOffset.top || 0;

            // news.pubsub.emit('window:scroll', [{
            //     parentScrollTop: parentScrollTop,
            //     iFrameOffset:    iFrameOffset,
            //     iFrameHeight:    iFrameHeight,
            //     viewportHeight:  viewportHeight
            // }]);
        },

        // optional API: CustomEvents.trigger('resize')
        // useful for initiating application
        trigger: function (evt) {
            if (evt === 'resize') {
                this.fireResizeEvent();
            }
            else if (evt === 'scroll') {
                this.fireScrollEvent();
            }
        }

    };

    // fire event a set time after the main window event
    // Credit: http://stackoverflow.com/a/2854467
    var delay = (function () {
        var timer = 0;
        return function (callback, ms) {
            clearTimeout(timer);
            timer = setTimeout(callback, ms);
        };
    })();

    return new CustomEvents();
});