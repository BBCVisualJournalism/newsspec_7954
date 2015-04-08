define(['lib/news_special/bootstrap', 'lib/news_special/share_tools/controller', 'calculator', 'istats_controller', 'custom_events'], function (news, shareTools, Calculator) {

    var initJS = function () {
        news.$('.main--nojs').hide();
        news.$('.main').addClass('main--js');
    };

    return {
        init: function () {
            var calculator = new Calculator();
            initJS();
            calculator.init();
        }
    };

});
