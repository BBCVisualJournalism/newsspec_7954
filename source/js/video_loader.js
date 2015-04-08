define(['lib/news_special/bootstrap', 'bump-3'], function (news, bump) {

    var VideoLoader = function () {
        this.emp = {};
    };

    VideoLoader.prototype = {

        loadVideos: function () {
            var self = this;

            news.$('.media__playlist').each(function () {
                self.loadVideo(news.$(this));
            });
        },

        loadVideo: function (video) {

            var playlist     = video.attr('data-playlist'),
                poster       = video.attr('data-holding-image') || '',
                uniqueKey    = 'ns-player--' + new Date().getTime();

            video.append('<div id="' + uniqueKey + '" class="ns_media_content"></div>');
            this.emp = {
                elm: news.$('#' + uniqueKey),
                player: bump('#' + uniqueKey).player({
                    product : 'news',
                    playerProfile: playlist,
                    responsive: true,
                    autoplay: false,
                    overrideHoldingImage: poster
                })
            };

            this.emp.player.load(playlist);
        },

        removeVideos: function () {
            news.$('.ns_media_content').remove();
        }

    };

    return new VideoLoader();

});