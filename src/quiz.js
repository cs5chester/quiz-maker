function quizWidget($, config) {
    var quizWidgetObject = {
        config: config,
        options: {
            getStartedButtonClass: 'quiz-widget__get-started-button',
            getStartedContainerClass: 'quiz-widget__get-started',
            getStartedText: 'Not sure which bed you need? Take our quick Sleep Selector quiz and well recommended the right bed for you.'
        },

        _init: function () {
            this._prepareWidget();
            this._initEvents();
        },

        _prepareWidget: function () {
            this._applyStyles();
            this._createGetStarted();
            this._createInfoPopups();
        },

        _applyStyles: function () {

        },

        _createInfoPopups: function () {
            var quizWrapper = $('.' + config.quizWrapper);
            var baseStyles = quizWrapper.find('link, style');

            var link = $("<link/>", {
                rel: "stylesheet",
                type: "text/css",
                href: config.styles,
            }).appendTo(quizWrapper);

            // baseStyles.remove();

            link.on('load', this._triggerQuizWrapperVisibility.bind(this));
        },

        _createGetStarted: function () {
            var quizTimeText = 'Quiz time: ' + config.quizTimeMinutes + 'minutes';
            var html = '<div class='+ this.options.getStartedContainerClass +'>' +
                            '<h3>Sleep Selector</h3>' +

                            '<div class="quiz-widget__quiz-time">' +
                                quizTimeText  +
                            '</div>' +

                            '<div class="quiz-widget__get-started-text">' +
                                this.options.getStartedText +
                            '</div>' +

                            '<button class='+ this.options.getStartedButtonClass +'>Get started</button>'
                       '</div>';

            $('.' + config.quizWrapper).prepend(html);
        },


        _initEvents: function () {
            var options = this.options

            $('.' + options.getStartedButtonClass).on('click', this._beginQuiz.bind(this))
        },

        _triggerQuizContainerVisibility: function (isVisible) {
            $('#' + config.quizParent).toggle(isVisible);
        },

        _triggerQuizWrapperVisibility: function (isVisible) {
            $('.' + config.quizWrapper).toggle(isVisible);
        },

        _triggerGetStartedVisibility: function (isVisible) {
            $('.' + this.options.getStartedContainerClass).toggle(isVisible);
        },

        _beginQuiz: function (e) {
            this._triggerQuizContainerVisibility(true);
            this._triggerGetStartedVisibility(false);
        }
    }

    quizWidgetObject._init();

    window.quizWidget = quizWidgetObject;
}

function startQuizWidget($) {
    var config = $('[data-quiz-config]').data('quizConfig');

    if (config) {
        qz.setKey(config.publicKey);

        qz.load({
            quiz: config.quizId,
            parent: config.quizParent,
            onLoad: function () {
                quizWidget($, config)
            }
        });
    }
}

(function () {

// Localize jQuery variable
    var jQuery;

    /******** Load jQuery if not present *********/

    if (window.jQuery === undefined || window.jQuery.fn.jquery !== '3.6.0') {
        var script_tag = document.createElement('script');
        script_tag.setAttribute("type", "text/javascript");
        script_tag.setAttribute("src",
            "https://code.jquery.com/jquery-3.6.0.min.js");
        if (script_tag.readyState) {
            script_tag.onreadystatechange = function () { // For old versions of IE
                if (this.readyState == 'complete' || this.readyState == 'loaded') {
                    scriptLoadHandler();
                }
            };
        } else { // Other browsers
            script_tag.onload = scriptLoadHandler;
        }
        // Try to find the head, otherwise default to the documentElement
        (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(script_tag);
    } else {
        // The jQuery version on the window is the one we want to use
        jQuery = window.jQuery;
        main();
    }

    /******** Called once jQuery has loaded ******/
    function scriptLoadHandler() {
        // Restore $ and window.jQuery to their previous values and store the
        // new jQuery in our local jQuery variable
        jQuery = window.jQuery.noConflict(true);
        // Call our main function
        main();
    }

    /******** main function ********/
    function main() {
        (function (i, s, o, g, r, a, m) {
            var ql = document.querySelectorAll("A[quiz],DIV[quiz],A[data-quiz],DIV[data-quiz]");

            if (ql) {
                if (ql.length) {
                    for (var k = 0; k < ql.length; k++) {
                        ql[k].id = "quiz-embed-" + k;
                        ql[k].href = "javascript:var i=document.getElementById('quiz-embed-" + k + "');try{qz.startQuiz(i)}catch(e){i.start=1;i.style.cursor='wait';i.style.opacity='0.5'};void(0);";
                    }
                }
            }
            i["QP"] = r;
            (i[r] =
                i[r] ||
                function () {
                    (i[r].q = i[r].q || []).push(arguments);
                }),
                (i[r].l = 1 * new Date());
            (a = s.createElement(o)), (m = s.getElementsByTagName(o)[0]);
            a.async = 1;
            a.src = g;

            if (a.readyState) {
                a.onreadystatechange = function () { // For old versions of IE
                    if (this.readyState == 'complete' || this.readyState == 'loaded') {
                        startQuizWidget(jQuery);
                    }
                };
            } else { // Other browsers
                a.onload = function () {
                    startQuizWidget(jQuery)
                };
            }

            m.parentNode.insertBefore(a, m);
        })(window, document, "script", "//take.quiz-maker.com/3012/CDN/quiz-embed-v1.js", "qp");
    }

})();