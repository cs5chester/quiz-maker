function quizWidget($) {
    var config = $('[data-quiz-config]').data('quizConfig');

    var quizWidgetObject = {
        options: {
            getStartedButtonClass: 'quiz-widget__get-started-button',
            getStartedContainerClass: 'quiz-widget__get-started',
            getStartedText: 'Not sure which bed you need? Take our quick Sleep Selector quiz and well recommended the right bed for you.',
            quizTabs: '#quiz-tabs',
            questionTitle: '.qp_qi',
            questionPicture: '.qp_pic',
            learnMoreClass: 'quiz-widget__learn-more',
            quizResults: '#quiz-results',
            quizContainer: '.quiz-container',
            quizWrapper: '.quiz-widget__wrapper',
            progressBarWrapperClass: 'quiz-widget__progress-bar-wrapper',
            progressBar: '.quiz-widget__progress-bar',
            progressLine: '.quiz-widget__progress-line',
            progressBarItems: '.quiz-widget__progress-bar-item',
        },

        _loadQuiz: function () {
            var self = this;

            qz.setKey(config.publicKey);

            qz.load({
                quiz: config.quizId,
                parent: config.quizParent,
                onCreate: function () {
                    self._init();
                }
            });
        },

        _create: function () {
            var publicKey = config.publicKey;

            if (publicKey && config.quizParent && config.quizId) {
                this._loadQuiz();

                quiz.addCB('afterResults', function () {
                    this._processLeads();
                    if (this.quizTime) {
                        clearTimeout(this.quizTime);

                        this.quizTime = null;
                    }

                    $(this.options.quizContainer).toggleClass('results', this._isResultsStep())
                    this._triggerProgressBarVisibility(false);
                    this._removeBaseStyles();
                }.bind(this));

                quiz.addCB('Next', function (question) {
                    this._updateProgressBar(question.frompage + 1)
                }.bind(this));

                quiz.addCB('Back', function (question) {
                    this._updateProgressBar(question.frompage - 1)
                }.bind(this));
            }
        },

        _processLeads: function () {
            var leads = $('#quiz-ntabs');

            if (leads.length) {
                this._replacePlaceholders();
                this._replaceButtons();
            }
        },

        _replacePlaceholders: function () {
            var placeholders = [
                {old: 'Enter number here', new: 'Phone number'},
                {old: 'Email', new: 'Email address'}
            ]

            for (var i in placeholders) {
                var placeholder = placeholders[i];
                var el = $('input[placeholder="' + placeholder.old + '"]');

                el.length && el.attr('placeholder', placeholder.new)
            }
        },

        _replaceButtons: function () {
            $('#quiz-end input').val('Submit')
            $('#quiz-skip input').val('No thanks, show me my results')
        },

        _updateProgressBar: function (index) {
            var tabs = this._getTabs();
            var currentIndex = index || +(tabs.siblings('.sel').attr('tid'));
            var progressBarItems = $(this.options.progressBarItems);
            var activeClass = 'active';
            var percents = (currentIndex / tabs.length) * 100

            $(this.options.progressLine).css({
                width: percents + '%'
            })

            progressBarItems.removeClass(activeClass);

            var activeItem = progressBarItems.eq(currentIndex - 1);
            var offset = activeItem.offset();
            activeItem.addClass(activeClass);

            offset && $(this.options.progressBar).stop().animate({scrollLeft: offset.left - 20}, 500);
        },

        _isResultsStep: function () {
            return $(this.options.quizResults).length > 0;
        },

        _init: function () {
            this._prepareWidget();
            this._initEvents();
        },


        _prepareWidget: function () {
            this._applyStyles();

            if (this._isQuizInProgress()) {
                this._beginQuiz();
            } else {
                this._createGetStarted();
                this._updateQuestionsHtml();
            }
        },

        _isQuizInProgress: function () {
            var quizIdShort = config.quizId.substring(1);
            var hash = window.location.hash;

            return hash.indexOf(quizIdShort) !== -1
        },

        _applyStyles: function () {
            var link = $("<link/>", {
                rel: "stylesheet",
                type: "text/css",
                href: config.styles,
            });

            this._removeBaseStyles();

            link.on('load', function () {
                this._triggerQuizWrapperVisibility(true);
            }.bind(this));

            link.appendTo(this._getWrapper());
        },

        _removeBaseStyles: function () {
            var baseStyles = this._getParent().find('link');

            baseStyles.remove();
            $('.qp_quiz').attr('style', '')
        },

        _getParent: function () {
            return $('#' + config.quizParent);
        },

        _getWrapper: function () {
            return $('.' + config.quizWrapper);
        },

        _getTabs: function () {
            return $(this.options.quizTabs + '>div');
        },

        _updateQuestionsHtml: function () {
            var quizTabs = this._getTabs();
            var options = this.options;

            var progressBarHtml = $(
                '<div style="display: none" class="' + options.progressBarWrapperClass + '">' +
                '<div class="quiz-widget__progress-line-wrapper">' +
                '<div class="quiz-widget__progress-line"></div>' +
                '</div>' +
                '<div class="quiz-widget__progress-bar">' +
                '</div>' +
                '</div>'
            );

            $.each(quizTabs, function (i, tab) {
                var $tab = $(tab);
                var questionTitle = $tab.find(options.questionTitle);
                var questionIndexOfTotal = $('<div class="quiz-widget__question-index-of-total-text">' + 'Question ' + (i + 1) + ' of ' + quizTabs.length + '</div>');
                var dataTag = questionTitle.find('code');
                var learnMoreTitle = dataTag.data('title');
                var learnMoreText = dataTag.data('text');
                var progressBarItemText = dataTag.data('progressbar');
                var learnMorePicture = $tab.find(options.questionPicture);
                var learnMorePictureBackground = learnMorePicture.css('background-image');
                var learnMoreOpen = $('<button class="quiz-widget__learn-more-open"></button>');
                var learnMoreClose = $('<button class="quiz-widget__learn-more-close"></button>');
                var holderClass = 'quiz-widget__learn-more-holder';

                var learnMoreHtml = $(
                    '<div style="display: none" class=' + this.options.learnMoreClass + '>' +
                    '<div class="' + holderClass + '">' +
                    '<div class="quiz-widget__learn-more-column quiz-widget__learn-more-column--info">' +
                    '<h3>' + learnMoreTitle + '</h3>' +
                    '<div class="quiz-widget__learn-more-text">' + learnMoreText + '</div>' +
                    '</div>' +

                    '<div class="quiz-widget__learn-more-column quiz-widget__learn-more-column--image">' +
                    '<div class="quiz-widget__learn-more-image"></div>' +
                    '</div>' +
                    '</div>' +
                    '</div>'
                );

                learnMorePicture.remove();

                learnMoreHtml.find('.' + holderClass).append(learnMoreClose);
                questionTitle.find('>div:first-child').append(learnMoreOpen);
                questionIndexOfTotal.insertBefore(questionTitle);
                $tab.append(learnMoreHtml);
                progressBarItemText && progressBarHtml.find('.quiz-widget__progress-bar').append('<div class="quiz-widget__progress-bar-item">' + progressBarItemText + '</div>')
                $('.quiz-widget__learn-more-image').css('background-image', learnMorePictureBackground);

                learnMoreClose.on('click', function () {
                    this._triggerLearnMoreVisibility(false);
                }.bind(this))

                learnMoreOpen.on('click', function () {
                    this._triggerLearnMoreVisibility(true);
                }.bind(this));
            }.bind(this))

            $('.' + options.progressBarWrapperClass).remove();
            $(options.quizWrapper).prepend(progressBarHtml);
        },

        _createGetStarted: function () {
            var quizTimeText = 'Quiz time: ' + config.quizTimeMinutes + ' minutes';
            var html = '<div class=' + this.options.getStartedContainerClass + '>' +
                '<h3>Sleep Selector</h3>' +

                '<div class="quiz-widget__quiz-time">' +
                quizTimeText +
                '</div>' +

                '<div class="quiz-widget__get-started-text">' +
                this.options.getStartedText +
                '</div>' +

                '<button class=' + this.options.getStartedButtonClass + '>Get started</button>'
            '</div>';
            $('.' + this.options.getStartedContainerClass).remove();
            $('.' + config.quizWrapper).prepend(html);
        },


        _initEvents: function () {
            var options = this.options

            $('.' + options.getStartedButtonClass).on('click', function () {
                this._beginQuiz();
                this._setQuizTime();
            }.bind(this))

            $(document).off('click', '.quiz-lc #quiz-next');

            $(document).on('click', '.quiz-lc #quiz-next', function (e) {
                setTimeout(function () {
                    quiz.saveQ('E');
                }, 500)
            }.bind(this));

            $(document).one('click', '.quiz-lc #quiz-back', function () {
                window.location.hash = '';
                this._reloadQuiz();
            }.bind(this))

            $(document).on('click', '.quiz-widget__warranty-button', function (e) {
                var target = $(e.target);
                var isNext = target.hasClass('next');
                var holder = target.siblings('.quiz-widget__warranty-holder');
                var activeItem = holder.find('.active');
                var nextActive = activeItem[isNext ? 'next' : 'prev']();

                if (nextActive.length > 0) {
                    activeItem.removeClass('active');
                    nextActive.addClass('active');
                }
            });
        },

        _reloadQuiz: function () {
            this._triggerQuizContainerVisibility(false);
            this._triggerProgressBarVisibility(false);
            this._getParent().html('');
            this._loadQuiz();
        },

        _setQuizTime: function () {
            var minutes = config.quizTimeMinutes || 2
            var timeout = +minutes * 60000;

            this.quizTime = setTimeout(function () {
                this._reloadQuiz();
            }.bind(this), timeout)
        },

        _triggerQuizContainerVisibility: function (isVisible) {
            this._getParent().toggle(isVisible);
        },

        _triggerQuizWrapperVisibility: function (isVisible) {
            $('.' + config.quizWrapper).toggle(isVisible);
        },

        _triggerLearnMoreVisibility: function (isVisible) {
            $('body').toggleClass('quiz-body-overflowed', isVisible);
            $('.' + this.options.learnMoreClass).toggle(isVisible);
        },

        _triggerGetStartedVisibility: function (isVisible) {
            $('.' + this.options.getStartedContainerClass).toggle(isVisible);
        },

        _triggerProgressBarVisibility: function (isVisible) {
            $('.' + this.options.progressBarWrapperClass).toggle(isVisible);
        },

        _beginQuiz: function () {
            this._triggerQuizContainerVisibility(true);
            this._triggerProgressBarVisibility(true);
            this._triggerGetStartedVisibility(false);
            this._updateProgressBar();
        }
    }

    config && quizWidgetObject._create();

    window.quizWidget = quizWidgetObject;
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
                        quizWidget(jQuery);
                    }
                };
            } else { // Other browsers
                a.onload = function () {
                    quizWidget(jQuery)
                };
            }

            m.parentNode.insertBefore(a, m);
        })(window, document, "script", "//take.quiz-maker.com/3012/CDN/quiz-embed-v1.js", "qp");
    }

})();