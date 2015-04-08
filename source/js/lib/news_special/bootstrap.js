define([
    'jquery-1.9',
    'lib/news_special/iframemanager__frame',
    'lib/news_special/imager',
    'lib/news_special/imager_image_sizes',
    'pubsub'
], function ($, iframemanager__frame, Imager, imageSizes) {

    // responsive iframe
    iframemanager__frame.init();

    // responsive images
    var imager = new Imager({
        availableWidths: imageSizes,
        regex: /(\/news\/.*img\/)\d+(\/.*)$/i
    });
    $.on('resize_images', function () {
        imager.resize_images();
    });
    $.on('init_images', function () {
        imager.change_divs_to_imgs();
    });

    return {
        $: $,
        pubsub: $,
        setStaticIframeHeight: function (newStaticHeight) {
            iframemanager__frame.setStaticHeight(newStaticHeight);
        },
        hostPageSetup: function (callback) {
            iframemanager__frame.setHostPageInitialization(callback);
        },
        supports: {
            mouse: function () {
                // assume if not touch device, this IS mouse-capable.
                // all other ways of detecting mouse support (e.g. window.onmousemove = func() { supported=true }) do NOT work!
                // http://stackoverflow.com/a/6447935
                return !('ontouchstart' in document.documentElement);
            },
            svg: function () {
                // http://stackoverflow.com/questions/654112/how-do-you-detect-support-for-vml-or-svg-in-a-browser
                return document.implementation.hasFeature('http://www.w3.org/TR/SVG11/feature#BasicStructure', '1.1');
            },
            inputType: {
                range: function () {
                    var i = document.createElement('input');
                    i.setAttribute('type', 'range');
                    return i.type !== 'text';
                }
            }
        }
    };

});