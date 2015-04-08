/*jshint loopfunc: true */
define(['lib/news_special/bootstrap', 'custom_template_engine', 'questions_model'], function (news, templateEngine, QuestionsModel) {

    var Graph = function (model) {
        this.model = model;
        this.subscribe();
    };

    Graph.prototype = {

        subscribe: function () {
            var graph = this;

            news.pubsub.on('window:resize', function () {
                if (graph.initiated) {
                    graph.resizeGraph();
                }
            });

            news.pubsub.on('graph:highlighted', function (property, title) {
                graph.updateGraphStatusText(property);
            });

            news.pubsub.on('graph:clicked', function (property, title) {
                graph.callbackOnSegmentClick(property);
                graph.updateGraphStatusText(property);
            });
        },

        updateGraphStatusText: function (property) {
            var title = QuestionsModel.convertPropertyToTitle(property),
                val   = QuestionsModel.getInputValue(news.$('.input__element[data-property="' + property + '"]'));
            news.$('.graph__status').html(title + ' (' + val + ')');
        },

        graphIsAnSVG: false,

        graphInitiated: false,

        initiated: false,

        init: function (insertInThisElement, graphCentralIcon, callbackOnSegmentClick) {

            if (!this.initiated) {
                this.createGraph(insertInThisElement, graphCentralIcon, callbackOnSegmentClick);
                this.initiated = true;
            } else {
                this.updateGraph(insertInThisElement, graphCentralIcon, callbackOnSegmentClick);
            }

            if (news.supports.mouse()) {
                this.listenForHover(insertInThisElement);
            }
        },

        listenForHover: function (insertInThisElement) {

            var self = this;

            news.$(insertInThisElement).on('mousemove', function (e) {
                self.moveTooltip(e);
            });
            news.$(insertInThisElement).on('mouseout', function (e) {
                self.hideTooltip(e);
            });

            news.$('.graph__status').addClass('graph__status--tooltip_view');
        },

        moveTooltip: function (e) {

            var tooltip = news.$('.graph__status--tooltip_view'),
                cursorOffset = 10,
                displayTooltipToRightOfCursor = true,
                graphSize,
                tooltipX,
                tooltipY;

            if (this.graphIsAnSVG) {

                graphSize = news.$('.graph__dial').width();

                if (graphSize / 2 < e.offsetX) {
                    displayTooltipToRightOfCursor = false;
                }

                tooltipY = (e.offsetY + cursorOffset);
                tooltipX = (e.offsetX + cursorOffset);

                if (!displayTooltipToRightOfCursor) {
                    tooltipX = tooltipX - tooltip.width();
                }

                tooltip
                    .show()
                    .css('left', tooltipX + 'px')
                    .css('top',  tooltipY + 'px');
            }
        },

        hideTooltip: function (e) {
            if (this.graphIsAnSVG) {
                news.$('.graph__status--tooltip_view').hide();
            }
        },

        createGraph: function (insertInThisElement, graphCentralIcon, callbackOnSegmentClick) {
            var self = this;
            this.graphContainer         = insertInThisElement;
            this.graphCentralIcon       = graphCentralIcon;
            this.callbackOnSegmentClick = callbackOnSegmentClick || function () {};

            if (news.supports.svg()) {
                var callbackOnDialRendered = function () {
                    // the graph IS an SVG, but Jasmine can't pull in d3
                    // so we need to return false for the jasmine tests.
                    // This is in a callback because pulling in d3 is asynchronous.
                    self.graphIsAnSVG = (self.d3 !== undefined);
                    self.updateGraphStatusText('height');
                };

                this.renderDial(callbackOnDialRendered);
            } else {
                this.renderBarchart();
            }

            this.updateAndHighlightAfterThisManyMilliseconds(500, function () {
                self.graphInitiated = true;
            });
        },

        updateGraph: function (insertInThisElement, graphCentralIcon, callbackOnSegmentClick) {
            this.callbackOnSegmentClick = callbackOnSegmentClick || function () {};

            if (insertInThisElement !== this.graphContainer) {
                this.moveGraph(insertInThisElement);
            }
            if (graphCentralIcon !== this.graphCentralIcon) {
                this.replaceIcon(graphCentralIcon);
            }
            this.resizeGraph();
        },

        renderDial: function (callback) {

            var self = this;

            require(['./js/lib/vendors/d3/d3.v3.min'], function (d3) {

                // cache d3 so we can use it later
                self.d3 = d3;
                
                var data = self.model.getInputsForGraph(),
                    dial = self.createDialSVG(data);

                var arc =
                        d3.svg.arc()
                            .outerRadius(0)
                            .innerRadius(0),
                    pie =
                        d3.layout.pie()
                            .value(function (d) { return d.value; });

                var arcs = dial.selectAll('g.slice')
                    .data(pie)
                    .enter()
                    .append('svg:g')
                    .attr('class', 'graph__slice')
                    .attr('data-property', function (d) {
                        return d.data.property;
                    })
                    .attr('data-title', function (d) {
                        return d.data.title;
                    })
                    // mouse AND touch behaviour
                    .on('click', function (d) {
                        news.pubsub.emit('graph:clicked', [d.data.property, d.data.title]);
                    });

                // mouse only behaviour
                if (news.supports.mouse()) {
                    arcs.on('mouseover', function (d) {
                            news.pubsub.emit('graph:highlighted', [d.data.property, d.data.title]);
                            d3.selectAll('.graph__slice--selected').classed('graph__slice--selected', false);
                            d3.select(this).classed('graph__slice--selected', true);
                        })
                        .on('mouseout', function (d) {
                            d3.select(this).classed('graph__slice--selected', false);
                            self.highlight();
                        });
                }

                // create the grey dial background
                arcs.append('svg:path')
                    .attr('d', arc)
                    .attr('class', 'graph__dial__background');

                // create the green dials that grow as the user answers the questions
                arcs.append('svg:path')
                    .attr('d', arc)
                    .attr('class', 'graph__slice-path');

                self.resizeDial();
                callback();
            });
        },

        createDialSVG: function (data) {
            var graphContainer = this.d3.select(this.graphContainer),
                dial;

            graphContainer.append('div')
                .attr('class', 'graph__status');

            if (news.supports.mouse()) {
                graphContainer.select('.graph__status')
                    .classed('graph__status--tooltip_view', true);
            }

            dial = graphContainer
                .append('svg:svg')
                .data([data])
                .attr('class', 'graph__dial');

            dial.append('svg:image')
                .attr('xlink:href', this.graphCentralIcon);

            dial = dial.append('svg:g'); // make a group to hold our dial graph

            return dial;
        },

        resizeDial: function () {
            var size = this.getGraphContainerSize(),
                radius = size / 2,
                svg;

            svg = this.d3.select('svg')
                .attr('width', size)
                .attr('height', size);

            svg.select('image')
                .attr('x',      (165 / this.maximumGraphSize) * size)
                .attr('y',      (165 / this.maximumGraphSize) * size)
                .attr('width',  (70  / this.maximumGraphSize) * size)
                .attr('height', (70  / this.maximumGraphSize) * size);

            svg.select('g')
                .attr('transform', 'translate(' + radius + ',' + radius + ')');

            this.updateAndHighlightAfterThisManyMilliseconds(100);
        },

        // anything bigger than this looks silly (and stretches the icon)
        maximumGraphSize: 400,

        getGraphContainerSize: function () {
            var size = news.$(this.graphContainer).width();

            if (size > this.maximumGraphSize) {
                size = this.maximumGraphSize;
            }

            return size;
        },

        updateAndHighlightAfterThisManyMilliseconds: function (milliseconds, callback) {
            var self = this;

            callback = callback || function () {};

            setTimeout(function () {
                self.update();
                self.highlight();
                callback();
            }, milliseconds);
        },

        updateDial: function (data) {

            var d3               = this.d3,
                slices           = d3.selectAll('.graph__slice-path'),
                backgroundSlices = d3.selectAll('.graph__dial__background'),
                size             = this.getGraphContainerSize(),
                radius           = size / 2,
                centralIconSize  = (60 / this.maximumGraphSize) * size;

            function startAngle(d, i) {
                return 2 * (Math.PI / data.length) * (i);
            }

            function endAngle(d, i) {
                var properEndAngle = 2 * (Math.PI / data.length) * (i + 1),
                    endAngleWithPixelGap = properEndAngle - 0.025;

                return endAngleWithPixelGap;
            }

            var pie =
                    d3.layout.pie()
                        .value(function (d) { return d.value; }),
                backgroundArc =
                    d3.svg.arc()
                        .outerRadius(radius)
                        .innerRadius(centralIconSize)
                        .startAngle(startAngle)
                        .endAngle(endAngle),
                arc =
                    d3.svg.arc()
                        .outerRadius(function (d) {
                            var maxHeight = radius - centralIconSize,
                                distanceFromTop = maxHeight - (d.value * (maxHeight / 10)),
                                height = maxHeight - distanceFromTop + centralIconSize;
                            return height;
                        })
                        .innerRadius(centralIconSize)
                        .startAngle(startAngle)
                        .endAngle(endAngle);

            if (this.graphInitiated) {
                backgroundSlices
                    .transition()
                    .duration(750)
                    .attr('d', backgroundArc);

                slices
                    .data(pie(data))
                    .transition()
                    .duration(750)
                    .attr('d', arc);
            } else {

                // this is the first time we're loading the graph, and don't want
                // the weird 'init' animation - disable animation until graph has rendered.
                backgroundSlices
                    .attr('d', backgroundArc);

                slices
                    .data(pie(data))
                    .attr('d', arc);
            }
        },

        renderBarchart: function () {
            var template = news.$('.template___graph--svgfallback').html() || '',
                barChart = templateEngine(template, {
                    inputs: this.makeGraphStartAtZero()
                });

            news.$(this.graphContainer).html(barChart);
        },

        makeGraphStartAtZero: function () {
            var actualInputs = this.model.getInputsForGraph(),
                forcedToZero = this.setInputsToZero(actualInputs);
            return forcedToZero;
        },

        setInputsToZero: function (inputs) {
            for (var i = 0; i < inputs.length; i++) {
                inputs[i].value = 0;
            }
            return inputs;
        },

        update: function () {
            if (this.graphIsAnSVG) {
                this.updateDial(this.model.getInputsForGraph());
            } else {
                var inputs = this.model.getInputs(),
                    property, value;

                for (property in inputs) {
                    width = (inputs[property] * 10) + '%';
                    news.$('.graph__bar_input--' + property).css('width', width);
                }
            }
        },

        highlight: function () {
            var self = this,
                propertyToHighlight;

            news.$('.input__container--answered .input__element').each(function () {
                propertyToHighlight = news.$(this).attr('data-property');
                self.highlightGraphSegment(propertyToHighlight);
            });
            news.$('.input__container--selected .input__element').each(function () {
                propertyToHighlight = news.$(this).attr('data-property');
                self.highlightGraphSegment(propertyToHighlight);
            });
        },

        highlightGraphSegment: function (propertyToHighlight) {
            if (this.graphIsAnSVG) {

                this.d3.selectAll('.graph__slice--selected').classed('graph__slice--selected', false);

                this.d3.select('.graph__slice[data-property=' + propertyToHighlight + ']')
                    .classed('graph__slice--seen', true)
                    .classed('graph__slice--selected', true);

            } else {
                news.$('.graph__bar_input--' + propertyToHighlight).addClass('graph__bar_input--seen');
            }
        },

        resizeGraph: function () {
            if (this.graphIsAnSVG) {
                this.resizeDial();
            }
        },

        moveGraph: function (newGraphContainer) {

            var newLocation = news.$(newGraphContainer),
                graph;

            if (this.graphIsAnSVG) {
                graph       = news.$(this.graphContainer).find('.graph__dial');
                graphStatus = news.$(this.graphContainer).find('.graph__status');
            } else {
                graph = news.$(this.graphContainer).find('.graph__barchart');
                graphStatus = '';
            }

            newLocation.append(graphStatus);
            newLocation.append(graph);
            this.graphContainer = newGraphContainer;
        },

        replaceIcon: function (graphCentralIcon) {

            if (this.graphIsAnSVG) {

                this.d3.select(this.graphContainer)
                    .select('.graph__dial')
                    .select('image')
                    .attr('xlink:href', graphCentralIcon);

                this.graphCentralIcon = graphCentralIcon;
            }
        }

    };

    return new Graph(QuestionsModel);

});