(function() {
    var $;
    $ = this.jQuery || window.jQuery;
    win = $(window), body = $('body'), doc = $(document);

    $.fn.hc_accordion = function() {
        var acd = $(this);
        acd.find('ul>li').each(function(index, el) {
            if ($(el).find('ul li').length > 0) $(el).prepend('<button type="button" class="acd-drop"></button>');
        });
        acd.on('click', '.acd-drop', function(e) {
            e.preventDefault();
            var ul = $(this).nextAll("ul");
            if (ul.is(":hidden") === true) {
                ul.parent('li').parent('ul').children('li').children('ul').slideUp(180);
                ul.parent('li').parent('ul').children('li').children('.acd-drop').removeClass("active");
                $(this).addClass("active");
                ul.slideDown(180);
            } else {
                $(this).removeClass("active");
                ul.slideUp(180);
            }
        });
    }

    $.fn.hc_menu = function(options) {
        var settings = $.extend({
                open: '.open-mnav',
            }, options),
            this_ = $(this);
        var m_nav = $('<div class="m-nav"><button class="m-nav-close">&times;</button><div class="nav-ct"></div></div>');
        body.append(m_nav);

        m_nav.find('.m-nav-close').click(function(e) {
            e.preventDefault();
            mnav_close();
        });

        m_nav.find('.nav-ct').append(this_.children().clone());

        var mnav_open = function() {
            m_nav.addClass('active');
            body.append('<div class="m-nav-over"></div>').css('overflow', 'hidden');
        }
        var mnav_close = function() {
            m_nav.removeClass('active');
            body.children('.m-nav-over').remove();
            body.css('overflow', '');
        }

        doc.on('click', settings.open, function(e) {
            e.preventDefault();
            if (win.width() <= 991) mnav_open();
        }).on('click', '.m-nav-over', function(e) {
            e.preventDefault();
            mnav_close();
        });

        m_nav.hc_accordion();
    }

    $.fn.hc_countdown = function(options) {
        var settings = $.extend({
                date: new Date().getTime() + 1000 * 60 * 60 * 24,
            }, options),
            this_ = $(this);

        var countDownDate = new Date(settings.date).getTime();

        var count = setInterval(function() {
            var now = new Date().getTime();
            var distance = countDownDate - now;
            var days = Math.floor(distance / (1000 * 60 * 60 * 24));
            var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((distance % (1000 * 60)) / 1000);
            this_.html('<div class="item"><span>' + days + '</span> ngày</div>' +
                '<div class="item"><span>' + hours + '</span> giờ</div>' +
                '<div class="item"><span>' + minutes + '</span> phút </div>' +
                '<div class="item"><span>' + seconds + '</span> giây </div>'
            );
            if (distance < 0) {
                clearInterval(count);
            }
        }, 1000);
    }

    $.fn.hc_upload = function(options) {
        var settings = $.extend({
                multiple: false,
                result: '.hc-upload-pane',
            }, options),
            this_ = $(this);

        var input_name = this_.attr('name');
        this_.removeAttr('name');

        this_.change(function(e) {
            if ($(settings.result).length > 0) {
                var files = event.target.files;
                if (settings.multiple) {
                    for (var i = 0, files_len = files.length; i < files_len; i++) {
                        var path = URL.createObjectURL(files[i]);
                        var name = files[i].name;
                        var size = Math.round(files[i].size / 1024 / 1024 * 100) / 100;
                        var type = files[i].type.slice(files[i].type.indexOf('/') + 1);

                        var img = $('<img src="' + path + '">');
                        var input = $('<input type="hidden" name="' + input_name + '[]"' +
                            '" value="' + path +
                            '" data-name="' + name +
                            '" data-size="' + size +
                            '" data-type="' + type +
                            '" data-path="' + path +
                            '">');
                        var elm = $('<div class="hc-upload"><button type="button" class="hc-del smooth">&times;</button></div>').append(img).append(input);
                        $(settings.result).append(elm);
                    }
                } else {
                    var path = URL.createObjectURL(files[0]);
                    var img = $('<img src="' + path + '">');
                    var elm = $('<div class="hc-upload"><button type="button" class="hc-del smooth">&times;</button></div>').append(img);
                    $(settings.result).html(elm);
                }
            }
        });

        body.on('click', '.hc-upload .hc-del', function(e) {
            e.preventDefault();
            this_.val('');
            $(this).closest('.hc-upload').remove();
        });
    }

}).call(this);


jQuery(function($) {
    var win = $(window),
        body = $('body'),
        doc = $(document);

    var FU = {
        get_Ytid: function(url) {
            var rx = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
            if (url) var arr = url.match(rx);
            if (arr) return arr[1];
        },
        get_currency: function(str) {
            if (str) return str.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        },
        animate: function(elems) {
            var animEndEv = 'webkitAnimationEnd animationend';
            elems.each(function() {
                var $this = $(this),
                    $animationType = $this.data('animation');
                $this.addClass($animationType).one(animEndEv, function() {
                    $this.removeClass($animationType);
                });
            });
        },
    };

    var UI = {
        mMenu: function() {

        },
        header: function() {
            var elm = $('header'),
                h = elm.innerHeight(),
                offset = 200,
                mOffset = 0;
            var fixed = function() {
                elm.addClass('fixed');
                body.css('margin-top', h);
            }
            var unfixed = function() {
                elm.removeClass('fixed');
                body.css('margin-top', '');
            }
            var Mfixed = function() {
                elm.addClass('m-fixed');
                body.css('margin-top', h);
            }
            var unMfixed = function() {
                elm.removeClass('m-fixed');
                body.css('margin-top', '');
            }
            if (win.width() > 991) {
                win.scrollTop() > offset ? fixed() : unfixed();
            } else {
                win.scrollTop() > mOffset ? Mfixed() : unMfixed();
            }
            win.scroll(function(e) {
                if (win.width() > 991) {
                    win.scrollTop() > offset ? fixed() : unfixed();
                } else {
                    win.scrollTop() > mOffset ? Mfixed() : unMfixed();
                }
            });
        },
        backTop: function() {
            var back_top = $('.back-to-top'),
                offset = 800;

            back_top.click(function() {
                $("html, body").animate({ scrollTop: 0 }, 800);
                return false;
            });

            if (win.scrollTop() > offset) {
                back_top.fadeIn(200);
            }

            win.scroll(function() {
                if (win.scrollTop() > offset) back_top.fadeIn(200);
                else back_top.fadeOut(200);
            });
        },
        slider: function() {
            /*$('.slider-cas').slick({
                nextArrow: '<img src="images/next.png" class="next" alt="Next">',
                prevArrow: '<img src="images/prev.png" class="prev" alt="Prev">',
            })
            FU.animate($(".slider-cas .slick-current [data-animation ^= 'animated']"));
            $('.slider-cas').on('beforeChange', function(event, slick, currentSlide, nextSlide){
                if(currentSlide!=nextSlide){
                    var aniElm = $(this).find('.slick-slide').find("[data-animation ^= 'animated']");
                    FU.animate(aniElm);
                }
            });*/

            /*$('.pro-cas').slick({
                slidesToShow: 4,
                slidesToScroll: 1,
                nextArrow: '<i class="cas-arrow smooth next"></i>',
                prevArrow: '<i class="cas-arrow smooth prev"></i>',
                dots: true,
                autoplay: true,
                swipeToSlide: true,
                autoplaySpeed: 4000,
                responsive: [
                {
                    breakpoint: 1199,
                    settings: {
                        slidesToShow: 3,
                    }
                },
                {
                    breakpoint: 991,
                    settings: {
                        slidesToShow: 3,
                    }
                },
                {
                    breakpoint: 700,
                    settings: {
                        slidesToShow: 2,
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 1,
                    }
                }
                ],
            })*/

            /*$('.pro-cas').owlCarousel({
                loop: true,
                margin: 30,
                responsiveClass:true,
                nav: true,
                smartSpeed: 800,
                navText: ["<span class='smooth arrow-cas prev'></span>", "<span class='smooth arrow-cas next'></span>"],
                responsive:{
                    992:{
                        items: 3,
                    },
                    768:{
                        items: 2,
                    },
                    0:{
                        items: 1,
                    }
                }
            })*/
            $('.cas-dictionary').owlCarousel({
                loop: true,
                responsiveClass: true,
                nav: false,
                dots: false,
                smartSpeed: 1000,
                margin: 50,
                autoplay: true,
                /*slideBy: 4,*/
                autoplayTimeout: 5000,
                navClass: ["sl-arrow prev", "sl-arrow next"],
                navText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"],
                responsive: {
                    1700: {
                        items: 2,
                        margin: 265,
                    },
                    1199: {
                        items: 2,
                        margin: 150,
                    },
                    767: {
                        items: 2,
                    },
                    0: {
                        items: 1,
                    }
                },
            });
            $('.cas-menu').owlCarousel({
                loop: true,
                responsiveClass: true,
                nav: false,
                dots: false,
                smartSpeed: 1000,
                margin: 50,
                autoplay: true,
                /*slideBy: 4,*/
                autoplayTimeout: 5000,
                navClass: ["sl-arrow prev", "sl-arrow next"],
                navText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"],
                responsive: {
                    1199: {
                        items: 4,
                    },
                    991: {
                        items: 3,
                    },
                    479: {
                        items: 2,
                    },
                    0: {
                        items: 1,
                    }
                },
            });
        },
        input_number: function() {
            doc.on('keydown', '.numberic', function(event) {
                if (!(!event.shiftKey &&
                        !(event.keyCode < 48 || event.keyCode > 57) ||
                        !(event.keyCode < 96 || event.keyCode > 105) ||
                        event.keyCode == 46 ||
                        event.keyCode == 8 ||
                        event.keyCode == 190 ||
                        event.keyCode == 9 ||
                        event.keyCode == 116 ||
                        (event.keyCode >= 35 && event.keyCode <= 39)
                    )) {
                    event.preventDefault();
                }
            });
            doc.on('click', '.i-number .up', function(e) {
                e.preventDefault();
                var input = $(this).parents('.i-number').children('input');
                var max = Number(input.attr('max')),
                    val = Number(input.val());
                if (!isNaN(val)) {
                    if (!isNaN(max) && input.attr('max').trim() != '') {
                        if (val >= max) {
                            return false;
                        }
                    }
                    input.val(val + 1);
                    input.trigger('number.up');
                }
            });
            doc.on('click', '.i-number .down', function(e) {
                e.preventDefault();
                var input = $(this).parents('.i-number').children('input');
                var min = Number(input.attr('min')),
                    val = Number(input.val());
                if (!isNaN(val)) {
                    if (!isNaN(min) && input.attr('max').trim() != '') {
                        if (val <= min) {
                            return false;
                        }
                    }
                    input.val(val - 1);
                    input.trigger('number.down');
                }
            });
        },
        yt_play: function() {
            doc.on('click', '.yt-box .play', function(e) {
                var id = FU.get_Ytid($(this).closest('.yt-box').attr('data-url'));
                $(this).closest('.yt-box iframe').remove();
                $(this).closest('.yt-box').append('<iframe src="https://www.youtube.com/embed/' + id + '?rel=0&amp;autoplay=1&amp;showinfo=0" frameborder="0" allowfullscreen></iframe>');
            });
        },
        psy: function() {
            var btn = '.psy-btn',
                sec = $('.psy-section'),
                pane = '.psy-pane';
            doc.on('click', btn, function(e) {
                e.preventDefault();
                $(this).closest(pane).find(btn).removeClass('active');
                $(this).addClass('active');
                $("html, body").animate({ scrollTop: $($(this).attr('href')).offset().top - 40 }, 600);
            });

            var section_act = function() {
                sec.each(function(index, el) {
                    if (win.scrollTop() + (win.height() / 2) >= $(el).offset().top) {
                        var id = $(el).attr('id');
                        $(pane).find(btn).removeClass('active');
                        $(pane).find(btn + '[href="#' + id + '"]').addClass('active');
                    }
                });
            }
            section_act();
            win.scroll(function() {
                section_act();
            });
        },
        toggle: function() {
            var ani = 100;
            $('[data-show]').each(function(index, el) {
                var ct = $($(el).attr('data-show'));
                $(el).click(function(e) {
                    e.preventDefault();
                    ct.fadeToggle(ani);
                });
            });
            win.click(function(e) {
                $('[data-show]').each(function(index, el) {
                    var ct = $($(el).attr('data-show'));
                    if (ct.has(e.target).length == 0 && !ct.is(e.target) && $(el).has(e.target).length == 0 && !$(el).is(e.target)) {
                        ct.fadeOut(ani);
                    }
                });
            });
        },
        uiCounterup: function() {
            var item = $('.hc-couter'),
                flag = true;
            if (item.length > 0) {
                run(item);
                win.scroll(function() {
                    if (flag == true) {
                        run(item);
                    }
                });

                function run(item) {
                    if (win.scrollTop() + 70 < item.offset().top && item.offset().top + item.innerHeight() < win.scrollTop() + win.height()) {
                        count(item);
                        flag = false;
                    }
                }

                function count(item) {
                    item.each(function() {
                        var this_ = $(this);
                        var num = Number(this_.text().replace(".", ""));
                        var incre = num / 80;

                        function start(counter) {
                            if (counter <= num) {
                                setTimeout(function() {
                                    this_.text(FU.get_currency(Math.ceil(counter)));
                                    counter = counter + incre;
                                    start(counter);
                                }, 20);
                            } else {
                                this_.text(FU.get_currency(num));
                            }
                        }
                        start(0);
                    });
                }
            }
        },
        ready: function() {
            //UI.mMenu();
            //UI.header();
            UI.slider();
            UI.backTop();
            // UI.toggle();
            //UI.input_number();
            //UI.uiCounterup();
            // UI.yt_play();
            // UI.psy();
        },
    }


    UI.ready();


    /*custom here*/
    WOW.prototype.addBox = function(element) {
        this.boxes.push(element);
    };

    var wow = new WOW({
        mobile: false
    });
    wow.init();
    if ($(window).width() > 991) {
        $('.wow').on('scrollSpy:exit', function() {
            $(this).css({
                'visibility': 'hidden',
                'animation-name': 'none'
            }).removeClass('animated');
            wow.addBox(this);
        }).scrollSpy();
    }

    
    if(win.width()>1024){
        $('#fullpage').fullpage({
            anchors: ['home', 'WhoamI?', 'Experience','Project'],
            navigation: true,
            navigationPosition: 'right',
            navigationTooltips: ['Home', 'Who am I?', 'Experience','Project'],
            responsiveWidth: 1024,
            scrollingSpeed: 1200,
            /*scrollBar: true,*/
            /*scrollOverflow: true,*/
            /*afterRender: function(index, nextIndex, direction) {
                var el = $('.para');
                el.paroller({
                    factor: 0.5,
                    type: 'background',
                    direction: 'vertical'
                });
            },
            afterResize: function() {
                var el = $('.para');
                el.paroller({
                    factor: 0.5,
                    type: 'background',
                    direction: 'vertical'
                });
            }*/
        });
    }
    if(win.width()<1024){
        win.scroll(function() {
            if (win.scrollTop() > 0) $('.header-home').addClass('scroll');
            else $('.header-home').removeClass('scroll toggle-menu');
        });
    }

})
