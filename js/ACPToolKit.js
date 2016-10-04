var ACPToolKit = (function () {
    // ACPToolKit depends on DataStorage. Must be loaded after DataStorage.js.
    var module = {};

    module.setCurrentParticipantId = function (pid) {
        DataStorage.setItem('pid', pid);
    }

    module.getCurrentParticipantId = function () {
        var pid = DataStorage.getItem('pid');
        if (!pid) {
            alert('Current participant not set!');
            pid = prompt('Enter current participant ID:').toString();
            this.setCurrentParticipantId(pid);
        }
        return pid;
    }

    module.clearAllData = function () {
        ['pid', 'pretest', 'trials', 'posttest'].forEach(function (key) {
            DataStorage.removeItem(key);
        });
    }

    module.downloadFormData = function (formResponses, type) {
        var headers = [];
        var data = [];
        var pid = ACPToolKit.getCurrentParticipantId();
        formResponses.unshift({ name: 'pid', value: pid });
        formResponses.forEach(function (item) {
            headers.push(item.name);
            data.push(item.value);
        });
        arrayToCSV([headers, data], 'acp-' + pid + '-' + type);
    }

    module.downloadTrialResults = function (data) {
        var pid = ACPToolKit.getCurrentParticipantId();
        arrayToCSV(data, 'acp-' + pid + '-trials');
    }

    function arrayToCSV (twoDiArray, fileName) {
        //  http://stackoverflow.com/questions/17836273/export-javascript-data
        //  -to-csv-file-without-server-interaction
        var csvRows = [];
        for (var i = 0; i < twoDiArray.length; ++i) {
            for (var j = 0; j < twoDiArray[i].length; ++j) {
                twoDiArray[i][j] = '\"' + twoDiArray[i][j] + '\"';
            }
            csvRows.push(twoDiArray[i].join(','));
        }

        var csvString = csvRows.join('\r\n');
        var $a = $('<a></a>', {
                href: 'data:attachment/csv;charset=utf-8,' + escape(csvString),
                target: '_blank',
                download: fileName + '.csv'
            });

        $('body').append($a[0]);
        $a.get(0).click();
        $a.remove();
    }

    $(function () {
        // Populate interface with current participant's ID
        var $pidEl = $('.js-pid');
        if ($pidEl.length > 0) {
           $pidEl.text(module.getCurrentParticipantId());
        }
    });

    if ((window.location.pathname.indexOf('experiment') > -1)||(window.location.pathname.indexOf('practiceTrial') > -1)) {
        var wm = new WindowManager('autocompaste-display');
        var currentTrialOptions = null;
        var startTime = null;

        module.presentTrial = function (options) {
            
            startTime = new Date().getTime();
            currentTrialOptions = options;

            var data_file = options.data_file;
            var stimuli = options.stimuli;

            $('.js-expt-technique').text(options.technique);
            $('.js-expt-granularity').text(options.granularity);
            $('.js-expt-stimuli').text(options.stimuli);
            $('.js-expt-continuity').text(options.continuity);

            // Clean up DOM
            wm.destroyAllWindows();
            $('#autocompaste-completion').remove();
            $('#autocompaste-measure-num-wrapped-lines').remove();
            $('#autocompaste-measure-get-single-line-height').remove();
            $('#autocompaste-measure-text-length-in-pixels').remove();
            $('#autocompaste-completion').remove();

            switch (options.technique) {
                case 'TRADITIONAL':
                    var engine = null;
                    break;
                case 'AUTOCOMPASTE':
                    var engine = new AutoComPaste.Engine();
                    break;
                default:
                    var engine = null;
                    console.error("Provided technique " + options.technique + " does not exist!")
                    break;
            }

            var iface = new AutoComPaste.Interface(wm, engine, data_file);
            
            // Highlight the relevant text.
            // hard-coded for separate texts
            if (stimuli === "number of atoms") {
                var stimuli1 = "number of";
                var stimuli2 = "atoms";
                iface.addEventListener('loaded', function () {
                var lines_to_highlight_1 = stimuli1.split("\n\n");
                var lines_to_highlight_2 = stimuli2.split("\n\n");

                var windows = wm.getWindowList();
                for (var i = 0; i < windows.length; i++) {
                    if (windows[i] == 'text_editor') {
                        continue;
                    }

                    var win = wm.getWindowContent(windows[i]);
                    var content = $(win).find('pre').html();
                    lines_to_highlight_1.map (function (value, index, array) {

                        content = content.replace (value,
                        "<span class=\"highlighted\">" + value + "</span>");
                    });
                    lines_to_highlight_2.map (function (value, index, array) {

                        content = content.replace (value,
                        "<span class=\"highlighted\">" + value + "</span>");
                    });

                  $(win).find('pre').empty().append(content);
                }
                });   
            }
            if (stimuli === "What is an amplifier?") {
                var stimuli1 = "What is";
                var stimuli2 = "an amplifier?";
                iface.addEventListener('loaded', function () {
                    var lines_to_highlight_1 = stimuli1.split("\n\n");
                    var lines_to_highlight_2 = stimuli2.split("\n\n");

                    var windows = wm.getWindowList();
                    for (var i = 0; i < windows.length; i++) {
                        if (windows[i] == 'text_editor') {
                            continue;
                        }

                        var win = wm.getWindowContent(windows[i]);
                        var content = $(win).find('pre').html();
                        lines_to_highlight_1.map (function (value, index, array) {

                            content = content.replace (value,
                            "<span class=\"highlighted\">" + value + "</span>");
                        });
                        lines_to_highlight_2.map (function (value, index, array) {

                            content = content.replace (value,
                            "<span class=\"highlighted\">" + value + "</span>");
                        });

                      $(win).find('pre').empty().append(content);
                    }
                });   
            }
            if (stimuli === "articles cannot easily be combined with other parts of speech.") {
                var stimuli1 = "articles";
                var stimuli2 = "cannot easily be combined with other parts of speech.";
                iface.addEventListener('loaded', function () {
                var lines_to_highlight_1 = stimuli1.split("\n\n");
                var lines_to_highlight_2 = stimuli2.split("\n\n");

                var windows = wm.getWindowList();
                for (var i = 0; i < windows.length; i++) {
                    if (windows[i] == 'text_editor') {
                        continue;
                    }

                    var win = wm.getWindowContent(windows[i]);
                    var content = $(win).find('pre').html();
                    lines_to_highlight_1.map (function (value, index, array) {

                        content = content.replace (value,
                        "<span class=\"highlighted\">" + value + "</span>");
                    });
                    lines_to_highlight_2.map (function (value, index, array) {

                        content = content.replace (value,
                        "<span class=\"highlighted\">" + value + "</span>");
                    });

                  $(win).find('pre').empty().append(content);
                }
                });   
            }
            if (stimuli === "A method of biasing a BJT is supplied to the base by means of a resistor.") {
                var stimuli1 = "A method of biasing a BJT";
                var stimuli2 = "is supplied to the base by means of a resistor.";
                iface.addEventListener('loaded', function () {
                var lines_to_highlight_1 = stimuli1.split("\n\n");
                var lines_to_highlight_2 = stimuli2.split("\n\n");

                var windows = wm.getWindowList();
                for (var i = 0; i < windows.length; i++) {
                    if (windows[i] == 'text_editor') {
                        continue;
                    }

                    var win = wm.getWindowContent(windows[i]);
                    var content = $(win).find('pre').html();
                    lines_to_highlight_1.map (function (value, index, array) {

                        content = content.replace (value,
                        "<span class=\"highlighted\">" + value + "</span>");
                    });
                    lines_to_highlight_2.map (function (value, index, array) {

                        content = content.replace (value,
                        "<span class=\"highlighted\">" + value + "</span>");
                    });

                  $(win).find('pre').empty().append(content);
                }
                });   
            }
            if (stimuli === "What is avionics? What is barrier potential?") {
                var stimuli1 = "What is avionics?";
                var stimuli2 = "What is barrier potential?";
                iface.addEventListener('loaded', function () {
                var lines_to_highlight_1 = stimuli1.split("\n\n");
                var lines_to_highlight_2 = stimuli2.split("\n\n");

                var windows = wm.getWindowList();
                for (var i = 0; i < windows.length; i++) {
                    if (windows[i] == 'text_editor') {
                        continue;
                    }

                    var win = wm.getWindowContent(windows[i]);
                    var content = $(win).find('pre').html();
                    lines_to_highlight_1.map (function (value, index, array) {

                        content = content.replace (value,
                        "<span class=\"highlighted\">" + value + "</span>");
                    });
                    lines_to_highlight_2.map (function (value, index, array) {

                        content = content.replace (value,
                        "<span class=\"highlighted\">" + value + "</span>");
                    });

                  $(win).find('pre').empty().append(content);
                }
                });   
            }
            if (stimuli === "A value of voltage or current where the area of the wave above the value equals the area of the wave below the value. Aviation electronics.") {
                var stimuli1 = "Aviation electronics.";
                var stimuli2 = "A value of voltage or current where the area of the wave above the value equals the area of the wave below the value.";
                iface.addEventListener('loaded', function () {
                var lines_to_highlight_1 = stimuli1.split("\n\n");
                var lines_to_highlight_2 = stimuli2.split("\n\n");

                var windows = wm.getWindowList();
                for (var i = 0; i < windows.length; i++) {
                    if (windows[i] == 'text_editor') {
                        continue;
                    }

                    var win = wm.getWindowContent(windows[i]);
                    var content = $(win).find('pre').html();
                    lines_to_highlight_1.map (function (value, index, array) {

                        content = content.replace (value,
                        "<span class=\"highlighted\">" + value + "</span>");
                    });
                    lines_to_highlight_2.map (function (value, index, array) {

                        content = content.replace (value,
                        "<span class=\"highlighted\">" + value + "</span>");
                    });

                  $(win).find('pre').empty().append(content);
                }
                });   
            }
            if (stimuli === "Traditionally in English, an article is usually considered to be a type of adjective. It is also possible for articles to be part of another part of speech category such as a determiner, an English part of speech category that combines articles and demonstratives (such as 'this' and 'that').") {
                var stimuli1 = "Traditionally in English, an article is usually considered to be a type of adjective.";
                var stimuli2 = "It is also possible for articles to be part of another part of speech category such as a determiner, an English part of speech category that combines articles and demonstratives (such as 'this' and 'that').";
                iface.addEventListener('loaded', function () {
                var lines_to_highlight_1 = stimuli1.split("\n\n");
                var lines_to_highlight_2 = stimuli2.split("\n\n");

                var windows = wm.getWindowList();
                for (var i = 0; i < windows.length; i++) {
                    if (windows[i] == 'text_editor') {
                        continue;
                    }

                    var win = wm.getWindowContent(windows[i]);
                    var content = $(win).find('pre').html();
                    lines_to_highlight_1.map (function (value, index, array) {

                        content = content.replace (value,
                        "<span class=\"highlighted\">" + value + "</span>");
                    });
                    lines_to_highlight_2.map (function (value, index, array) {

                        content = content.replace (value,
                        "<span class=\"highlighted\">" + value + "</span>");
                    });

                  $(win).find('pre').empty().append(content);
                }
                });   
            }
            if (stimuli === "In languages that employ articles, every common noun, with some exceptions, is expressed with a certain definiteness, just as many languages express every noun with a certain grammatical number. This obligatory nature of articles makes them among the most common words in many languages - in English, for example, the most frequent word is the.") {
                var stimuli1 = "In languages that employ articles, every common noun, with some exceptions, is expressed with a certain definiteness, just as many languages express every noun with a certain grammatical number.";
                var stimuli2 = "This obligatory nature of articles makes them among the most common words in many languages - in English, for example, the most frequent word is the.";
                iface.addEventListener('loaded', function () {
                var lines_to_highlight_1 = stimuli1.split("\n\n");
                var lines_to_highlight_2 = stimuli2.split("\n\n");

                var windows = wm.getWindowList();
                for (var i = 0; i < windows.length; i++) {
                    if (windows[i] == 'text_editor') {
                        continue;
                    }

                    var win = wm.getWindowContent(windows[i]);
                    var content = $(win).find('pre').html();
                    lines_to_highlight_1.map (function (value, index, array) {

                        content = content.replace (value,
                        "<span class=\"highlighted\">" + value + "</span>");
                    });
                    lines_to_highlight_2.map (function (value, index, array) {

                        content = content.replace (value,
                        "<span class=\"highlighted\">" + value + "</span>");
                    });

                  $(win).find('pre').empty().append(content);
                }
                });   
            }
            if (stimuli === "a type of languages") {
                var stimuli1 = "a type of";
                var stimuli2 = "languages";
                iface.addEventListener('loaded', function () {
                var lines_to_highlight_1 = stimuli1.split("\n\n");
                var lines_to_highlight_2 = stimuli2.split("\n\n");

                var windows = wm.getWindowList();
                for (var i = 0; i < windows.length; i++) {
                    if (windows[i] == 'text_editor') {
                        continue;
                    }

                    var win = wm.getWindowContent(windows[i]);
                    var content = $(win).find('pre').html();
                    lines_to_highlight_1.map (function (value, index, array) {

                        content = content.replace (value,
                        "<span class=\"highlighted\">" + value + "</span>");
                    });
                    lines_to_highlight_2.map (function (value, index, array) {

                        content = content.replace (value,
                        "<span class=\"highlighted\">" + value + "</span>");
                    });

                  $(win).find('pre').empty().append(content);
                }
                });   
            }
          
            if (stimuli === "falls back and repeats") {
                var stimuli1 = "falls back";
                var stimuli2 = "and";
                var stimuli3 = "repeats";
                iface.addEventListener('loaded', function () {
                    var lines_to_highlight_1 = stimuli1.split("\n\n");
                    var lines_to_highlight_2 = stimuli2.split("\n\n");
                    var lines_to_highlight_3 = stimuli3.split("\n\n");

                    var windows = wm.getWindowList();
                    for (var i = 0; i < windows.length; i++) {
                        if (windows[i] == 'text_editor') {
                            continue;
                        }

                        var win = wm.getWindowContent(windows[i]);
                        var content = $(win).find('pre').html();
                        lines_to_highlight_1.map (function (value, index, array) {

                            content = content.replace (value,
                            "<span class=\"highlighted\">" + value + "</span>");
                        });
                        lines_to_highlight_2.map (function (value, index, array) {

                            content = content.replace (value,
                            "<span class=\"highlighted\">" + value + "</span>");
                        });
                        lines_to_highlight_3.map (function (value, index, array) {

                            content = content.replace (value,
                            "<span class=\"highlighted\">" + value + "</span>");
                        });

                  $(win).find('pre').empty().append(content);
                }
                });   
            }
            if (stimuli === "all possible AC output voltage") {
                var stimuli1 = "all possible";
                var stimuli2 = "AC output voltage";
                iface.addEventListener('loaded', function () {
                    var lines_to_highlight_1 = stimuli1.split("\n\n");
                    var lines_to_highlight_2 = stimuli2.split("\n\n");

                    var windows = wm.getWindowList();
                    for (var i = 0; i < windows.length; i++) {
                        if (windows[i] == 'text_editor') {
                            continue;
                        }

                        var win = wm.getWindowContent(windows[i]);
                        var content = $(win).find('pre').html();
                        lines_to_highlight_1.map (function (value, index, array) {
                            content = content.replace (value,
                            "<span class=\"highlighted\">" + value + "</span>");
                        });
                        lines_to_highlight_2.map (function (value, index, array) {
                            content = content.replace (value,
                            "<span class=\"highlighted\">" + value + "</span>");
                        });

                      $(win).find('pre').empty().append(content);
                    }
                });   
            }
            if (stimuli === "A filter in addition to reactive components to pass or reject selected frequencies") {
                var stimuli1 = "A filter";
                var stimuli2 = "in addition to reactive components to pass or reject selected frequencies";
                iface.addEventListener('loaded', function () {
                    var lines_to_highlight_1 = stimuli1.split("\n\n");
                    var lines_to_highlight_2 = stimuli2.split("\n\n");

                    var windows = wm.getWindowList();
                    for (var i = 0; i < windows.length; i++) {
                        if (windows[i] == 'text_editor') {
                            continue;
                        }

                        var win = wm.getWindowContent(windows[i]);
                        var content = $(win).find('pre').html();
                        lines_to_highlight_1.map (function (value, index, array) {

                            content = content.replace (value,
                            "<span class=\"highlighted\">" + value + "</span>");
                        });
                        lines_to_highlight_2.map (function (value, index, array) {

                            content = content.replace (value,
                            "<span class=\"highlighted\">" + value + "</span>");
                        });

                      $(win).find('pre').empty().append(content);
                    }
                });   
            }
            if (stimuli === "articles cannot easily be combined with other parts of speech") {
                var stimuli1 = "articles";
                var stimuli2 = "cannot easily be combined with other parts of speech";
                iface.addEventListener('loaded', function () {
                    var lines_to_highlight_1 = stimuli1.split("\n\n");
                    var lines_to_highlight_2 = stimuli2.split("\n\n");

                    var windows = wm.getWindowList();
                    for (var i = 0; i < windows.length; i++) {
                        if (windows[i] == 'text_editor') {
                            continue;
                        }

                        var win = wm.getWindowContent(windows[i]);
                        var content = $(win).find('pre').html();
                        lines_to_highlight_1.map (function (value, index, array) {

                            content = content.replace (value,
                            "<span class=\"highlighted\">" + value + "</span>");
                        });
                        lines_to_highlight_2.map (function (value, index, array) {

                            content = content.replace (value,
                            "<span class=\"highlighted\">" + value + "</span>");
                        });

                      $(win).find('pre').empty().append(content);
                    }
                });   
            }
            if (stimuli === "Equipment that passes an AC signal while blocking a DC voltage.") {
                var stimuli1 = "Equipment";
                var stimuli2 = "that passes an AC signal while blocking a DC voltage.";
                iface.addEventListener('loaded', function () {
                    var lines_to_highlight_1 = stimuli1.split("\n\n");
                    var lines_to_highlight_2 = stimuli2.split("\n\n");

                    var windows = wm.getWindowList();
                    for (var i = 0; i < windows.length; i++) {
                        if (windows[i] == 'text_editor') {
                            continue;
                        }

                        var win = wm.getWindowContent(windows[i]);
                        var content = $(win).find('pre').html();
                        lines_to_highlight_1.map (function (value, index, array) {

                            content = content.replace (value,
                            "<span class=\"highlighted\">" + value + "</span>");
                        });
                        lines_to_highlight_2.map (function (value, index, array) {

                            content = content.replace (value,
                            "<span class=\"highlighted\">" + value + "</span>");
                        });

                      $(win).find('pre').empty().append(content);
                    }
                });   
            }
            if (stimuli === "Power supply that changes the amplitude of a signal between input and output.") {
                var stimuli1 = "Power supply";
                var stimuli2 = "that changes the amplitude of a signal between input and output.";
                iface.addEventListener('loaded', function () {
                    var lines_to_highlight_1 = stimuli1.split("\n\n");
                    var lines_to_highlight_2 = stimuli2.split("\n\n");

                    var windows = wm.getWindowList();
                    for (var i = 0; i < windows.length; i++) {
                        if (windows[i] == 'text_editor') {
                            continue;
                        }

                        var win = wm.getWindowContent(windows[i]);
                        var content = $(win).find('pre').html();
                        lines_to_highlight_1.map (function (value, index, array) {

                            content = content.replace (value,
                            "<span class=\"highlighted\">" + value + "</span>");
                        });
                        lines_to_highlight_2.map (function (value, index, array) {

                            content = content.replace (value,
                            "<span class=\"highlighted\">" + value + "</span>");
                        });

                      $(win).find('pre').empty().append(content);
                    }
                });   
            }
            if (stimuli === "The region of BJT operation in which the polarity alternates.") {
                var stimuli1 = "The region of BJT operation";
                var stimuli2 = "in which the polarity alternates.";
                iface.addEventListener('loaded', function () {
                    var lines_to_highlight_1 = stimuli1.split("\n\n");
                    var lines_to_highlight_2 = stimuli2.split("\n\n");

                    var windows = wm.getWindowList();
                    for (var i = 0; i < windows.length; i++) {
                        if (windows[i] == 'text_editor') {
                            continue;
                        }

                        var win = wm.getWindowContent(windows[i]);
                        var content = $(win).find('pre').html();
                        lines_to_highlight_1.map (function (value, index, array) {

                            content = content.replace (value,
                            "<span class=\"highlighted\">" + value + "</span>");
                        });
                        lines_to_highlight_2.map (function (value, index, array) {

                            content = content.replace (value,
                            "<span class=\"highlighted\">" + value + "</span>");
                        });

                      $(win).find('pre').empty().append(content);
                    }
                });   
            }
            if (stimuli === "What is AC coupling? Device used to transform mechanical energy into AC electrical power.") {
                var stimuli1 = "What is AC coupling?";
                var stimuli2 = "Device used to transform mechanical energy into AC electrical power.";
                iface.addEventListener('loaded', function () {
                    var lines_to_highlight_1 = stimuli1.split("\n\n");
                    var lines_to_highlight_2 = stimuli2.split("\n\n");

                    var windows = wm.getWindowList();
                    for (var i = 0; i < windows.length; i++) {
                        if (windows[i] == 'text_editor') {
                            continue;
                        }

                        var win = wm.getWindowContent(windows[i]);
                        var content = $(win).find('pre').html();
                        lines_to_highlight_1.map (function (value, index, array) {

                            content = content.replace (value,
                            "<span class=\"highlighted\">" + value + "</span>");
                        });
                        lines_to_highlight_2.map (function (value, index, array) {

                            content = content.replace (value,
                            "<span class=\"highlighted\">" + value + "</span>");
                        });

                      $(win).find('pre').empty().append(content);
                    }
                });   
            }
            if (stimuli === "What is band-pass filter? Frequencies above and below the pass band are heavily attenuated.") {
                var stimuli1 = "What is band-pass filter?";
                var stimuli2 = "Frequencies above and below the pass band are heavily attenuated.";
                iface.addEventListener('loaded', function () {
                    var lines_to_highlight_1 = stimuli1.split("\n\n");
                    var lines_to_highlight_2 = stimuli2.split("\n\n");

                    var windows = wm.getWindowList();
                    for (var i = 0; i < windows.length; i++) {
                        if (windows[i] == 'text_editor') {
                            continue;
                        }

                        var win = wm.getWindowContent(windows[i]);
                        var content = $(win).find('pre').html();
                        lines_to_highlight_1.map (function (value, index, array) {

                            content = content.replace (value,
                            "<span class=\"highlighted\">" + value + "</span>");
                        });
                        lines_to_highlight_2.map (function (value, index, array) {

                            content = content.replace (value,
                            "<span class=\"highlighted\">" + value + "</span>");
                        });

                      $(win).find('pre').empty().append(content);
                    }
                });   
            }
            if (stimuli === "What is barrier potential? A number system having only two symbols, 0 and 1. A base 2 number system.") {
                var stimuli1 = "What is barrier potential?";
                var stimuli2 = "A number system having only two symbols, 0 and 1. A base 2 number system.";
                iface.addEventListener('loaded', function () {
                    var lines_to_highlight_1 = stimuli1.split("\n\n");
                    var lines_to_highlight_2 = stimuli2.split("\n\n");

                    var windows = wm.getWindowList();
                    for (var i = 0; i < windows.length; i++) {
                        if (windows[i] == 'text_editor') {
                            continue;
                        }

                        var win = wm.getWindowContent(windows[i]);
                        var content = $(win).find('pre').html();
                        lines_to_highlight_1.map (function (value, index, array) {

                            content = content.replace (value,
                            "<span class=\"highlighted\">" + value + "</span>");
                        });
                        lines_to_highlight_2.map (function (value, index, array) {

                            content = content.replace (value,
                            "<span class=\"highlighted\">" + value + "</span>");
                        });

                      $(win).find('pre').empty().append(content);
                    }
                });   
            }
            if (stimuli === "A DC system") {
                var stimuli1 = "A DC";
                var stimuli2 = "system";
                iface.addEventListener('loaded', function () {
                    var lines_to_highlight_1 = stimuli1.split("\n\n");
                    var lines_to_highlight_2 = stimuli2.split("\n\n");

                    var windows = wm.getWindowList();
                    for (var i = 0; i < windows.length; i++) {
                        if (windows[i] == 'text_editor') {
                            continue;
                        }

                        var win = wm.getWindowContent(windows[i]);
                        var content = $(win).find('pre').html();
                        lines_to_highlight_1.map (function (value, index, array) {

                            content = content.replace (value,
                            "<span class=\"highlighted\">" + value + "</span>");
                        });
                        lines_to_highlight_2.map (function (value, index, array) {

                            content = content.replace (value,
                            "<span class=\"highlighted\">" + value + "</span>");
                        });

                      $(win).find('pre').empty().append(content);
                    }
                });   
            }
            if (stimuli === "natural difference of BJT") {
                var stimuli1 = "natural difference of";
                var stimuli2 = "BJT";
                iface.addEventListener('loaded', function () {
                    var lines_to_highlight_1 = stimuli1.split("\n\n");
                    var lines_to_highlight_2 = stimuli2.split("\n\n");

                    var windows = wm.getWindowList();
                    for (var i = 0; i < windows.length; i++) {
                        if (windows[i] == 'text_editor') {
                            continue;
                        }

                        var win = wm.getWindowContent(windows[i]);
                        var content = $(win).find('pre').html();
                        lines_to_highlight_1.map (function (value, index, array) {

                            content = content.replace (value,
                            "<span class=\"highlighted\">" + value + "</span>");
                        });
                        lines_to_highlight_2.map (function (value, index, array) {

                            content = content.replace (value,
                            "<span class=\"highlighted\">" + value + "</span>");
                        });

                      $(win).find('pre').empty().append(content);
                    }
                });   
            }
            if (stimuli === "battery or power") {
                var stimuli1 = "battery";
                var stimuli2 = "or power";
                iface.addEventListener('loaded', function () {
                    var lines_to_highlight_1 = stimuli1.split("\n\n");
                    var lines_to_highlight_2 = stimuli2.split("\n\n");

                    var windows = wm.getWindowList();
                    for (var i = 0; i < windows.length; i++) {
                        if (windows[i] == 'text_editor') {
                            continue;
                        }

                        var win = wm.getWindowContent(windows[i]);
                        var content = $(win).find('pre').html();
                        lines_to_highlight_1.map (function (value, index, array) {

                            content = content.replace (value,
                            "<span class=\"highlighted\">" + value + "</span>");
                        });
                        lines_to_highlight_2.map (function (value, index, array) {

                            content = content.replace (value,
                            "<span class=\"highlighted\">" + value + "</span>");
                        });

                      $(win).find('pre').empty().append(content);
                    }
                });   
            }
            if (stimuli === "Name for ammeter") {
                var stimuli1 = "Name for";
                var stimuli2 = "ammeter";
                iface.addEventListener('loaded', function () {
                    var lines_to_highlight_1 = stimuli1.split("\n\n");
                    var lines_to_highlight_2 = stimuli2.split("\n\n");

                    var windows = wm.getWindowList();
                    for (var i = 0; i < windows.length; i++) {
                        if (windows[i] == 'text_editor') {
                            continue;
                        }

                        var win = wm.getWindowContent(windows[i]);
                        var content = $(win).find('pre').html();
                        lines_to_highlight_1.map (function (value, index, array) {

                            content = content.replace (value,
                            "<span class=\"highlighted\">" + value + "</span>");
                        });
                        lines_to_highlight_2.map (function (value, index, array) {

                            content = content.replace (value,
                            "<span class=\"highlighted\">" + value + "</span>");
                        });

                      $(win).find('pre').empty().append(content);
                    }
                });   
            }
            if (stimuli === "A circuit or terminal of a device.") {
                var stimuli1 = "A circuit";
                var stimuli2 = "or terminal of a device.";
                iface.addEventListener('loaded', function () {
                    var lines_to_highlight_1 = stimuli1.split("\n\n");
                    var lines_to_highlight_2 = stimuli2.split("\n\n");

                    var windows = wm.getWindowList();
                    for (var i = 0; i < windows.length; i++) {
                        if (windows[i] == 'text_editor') {
                            continue;
                        }

                        var win = wm.getWindowContent(windows[i]);
                        var content = $(win).find('pre').html();
                        lines_to_highlight_1.map (function (value, index, array) {

                            content = content.replace (value,
                            "<span class=\"highlighted\">" + value + "</span>");
                        });
                        lines_to_highlight_2.map (function (value, index, array) {

                            content = content.replace (value,
                            "<span class=\"highlighted\">" + value + "</span>");
                        });

                      $(win).find('pre').empty().append(content);
                    }
                });   
            }
            if (stimuli === "Power attained in an AC circuit and current which reach their peak at different times.") {
                var stimuli1 = "Power attained in an AC circuit";
                var stimuli2 = "and current which reach their peak at different times.";
                iface.addEventListener('loaded', function () {
                    var lines_to_highlight_1 = stimuli1.split("\n\n");
                    var lines_to_highlight_2 = stimuli2.split("\n\n");

                    var windows = wm.getWindowList();
                    for (var i = 0; i < windows.length; i++) {
                        if (windows[i] == 'text_editor') {
                            continue;
                        }

                        var win = wm.getWindowContent(windows[i]);
                        var content = $(win).find('pre').html();
                        lines_to_highlight_1.map (function (value, index, array) {

                            content = content.replace (value,
                            "<span class=\"highlighted\">" + value + "</span>");
                        });
                        lines_to_highlight_2.map (function (value, index, array) {

                            content = content.replace (value,
                            "<span class=\"highlighted\">" + value + "</span>");
                        });

                      $(win).find('pre').empty().append(content);
                    }
                });   
            }
            if (stimuli === "An oscillator that can be heard by the human ear.") {
                var stimuli1 = "An oscillator that";
                var stimuli2 = "can be heard by the human ear.";
                iface.addEventListener('loaded', function () {
                    var lines_to_highlight_1 = stimuli1.split("\n\n");
                    var lines_to_highlight_2 = stimuli2.split("\n\n");

                    var windows = wm.getWindowList();
                    for (var i = 0; i < windows.length; i++) {
                        if (windows[i] == 'text_editor') {
                            continue;
                        }

                        var win = wm.getWindowContent(windows[i]);
                        var content = $(win).find('pre').html();
                        lines_to_highlight_1.map (function (value, index, array) {

                            content = content.replace (value,
                            "<span class=\"highlighted\">" + value + "</span>");
                        });
                        lines_to_highlight_2.map (function (value, index, array) {

                            content = content.replace (value,
                            "<span class=\"highlighted\">" + value + "</span>");
                        });

                      $(win).find('pre').empty().append(content);
                    }
                });   
            }
            if (stimuli === "Every noun must be corresponding to its definiteness, and the lack of an article (considered a zero article) itself specifies a certain definiteness.") {
                var stimuli1 = "Every noun must be";
                var stimuli2 = "corresponding to its definiteness, and the lack of an article (considered a zero article) itself specifies a certain definiteness.";
                iface.addEventListener('loaded', function () {
                    var lines_to_highlight_1 = stimuli1.split("\n\n");
                    var lines_to_highlight_2 = stimuli2.split("\n\n");

                    var windows = wm.getWindowList();
                    for (var i = 0; i < windows.length; i++) {
                        if (windows[i] == 'text_editor') {
                            continue;
                        }

                        var win = wm.getWindowContent(windows[i]);
                        var content = $(win).find('pre').html();
                        lines_to_highlight_1.map (function (value, index, array) {

                            content = content.replace (value,
                            "<span class=\"highlighted\">" + value + "</span>");
                        });
                        lines_to_highlight_2.map (function (value, index, array) {

                            content = content.replace (value,
                            "<span class=\"highlighted\">" + value + "</span>");
                        });

                      $(win).find('pre').empty().append(content);
                    }
                });   
            }
            if (stimuli === "What is bistable multivibrator? This is in contrast to other adjectives and determiners, which are typically optional.") {
                var stimuli1 = "What is bistable multivibrator?";
                var stimuli2 = "This is in contrast to other adjectives and determiners, which are typically optional.";
                iface.addEventListener('loaded', function () {
                    var lines_to_highlight_1 = stimuli1.split("\n\n");
                    var lines_to_highlight_2 = stimuli2.split("\n\n");

                    var windows = wm.getWindowList();
                    for (var i = 0; i < windows.length; i++) {
                        if (windows[i] == 'text_editor') {
                            continue;
                        }

                        var win = wm.getWindowContent(windows[i]);
                        var content = $(win).find('pre').html();
                        lines_to_highlight_1.map (function (value, index, array) {

                            content = content.replace (value,
                            "<span class=\"highlighted\">" + value + "</span>");
                        });
                        lines_to_highlight_2.map (function (value, index, array) {

                            content = content.replace (value,
                            "<span class=\"highlighted\">" + value + "</span>");
                        });

                      $(win).find('pre').empty().append(content);
                    }
                });   
            }
            if (stimuli === "What is battery? Also called a latch.") {
                var stimuli1 = "What is battery?";
                var stimuli2 = "Also called a latch.";
                iface.addEventListener('loaded', function () {
                    var lines_to_highlight_1 = stimuli1.split("\n\n");
                    var lines_to_highlight_2 = stimuli2.split("\n\n");

                    var windows = wm.getWindowList();
                    for (var i = 0; i < windows.length; i++) {
                        if (windows[i] == 'text_editor') {
                            continue;
                        }

                        var win = wm.getWindowContent(windows[i]);
                        var content = $(win).find('pre').html();
                        lines_to_highlight_1.map (function (value, index, array) {

                            content = content.replace (value,
                            "<span class=\"highlighted\">" + value + "</span>");
                        });
                        lines_to_highlight_2.map (function (value, index, array) {

                            content = content.replace (value,
                            "<span class=\"highlighted\">" + value + "</span>");
                        });

                      $(win).find('pre').empty().append(content);
                    }
                });   
            }
            if (stimuli === "What is bistable multivibrator? An external signal is required to change the output from one state to the other.") {
                var stimuli1 = "What is bistable multivibrator?";
                var stimuli2 = "An external signal is required to change the output from one state to the other.";
                iface.addEventListener('loaded', function () {
                    var lines_to_highlight_1 = stimuli1.split("\n\n");
                    var lines_to_highlight_2 = stimuli2.split("\n\n");

                    var windows = wm.getWindowList();
                    for (var i = 0; i < windows.length; i++) {
                        if (windows[i] == 'text_editor') {
                            continue;
                        }

                        var win = wm.getWindowContent(windows[i]);
                        var content = $(win).find('pre').html();
                        lines_to_highlight_1.map (function (value, index, array) {

                            content = content.replace (value,
                            "<span class=\"highlighted\">" + value + "</span>");
                        });
                        lines_to_highlight_2.map (function (value, index, array) {

                            content = content.replace (value,
                            "<span class=\"highlighted\">" + value + "</span>");
                        });

                      $(win).find('pre').empty().append(content);
                    }
                });   
            }
            if (stimuli === "Width of the band of frequencies between the half power points. This obligatory nature of articles makes them among the most common words in many languages - in English, for example, the most frequent word is the.") {
                var stimuli1 = "Width of the band of frequencies between the half power points.";
                var stimuli2 = "This obligatory nature of articles makes them among the most common words in many languages - in English, for example, the most frequent word is the.";
                iface.addEventListener('loaded', function () {
                    var lines_to_highlight_1 = stimuli1.split("\n\n");
                    var lines_to_highlight_2 = stimuli2.split("\n\n");

                    var windows = wm.getWindowList();
                    for (var i = 0; i < windows.length; i++) {
                        if (windows[i] == 'text_editor') {
                            continue;
                        }

                        var win = wm.getWindowContent(windows[i]);
                        var content = $(win).find('pre').html();
                        lines_to_highlight_1.map (function (value, index, array) {

                            content = content.replace (value,
                            "<span class=\"highlighted\">" + value + "</span>");
                        });
                        lines_to_highlight_2.map (function (value, index, array) {

                            content = content.replace (value,
                            "<span class=\"highlighted\">" + value + "</span>");
                        });

                      $(win).find('pre').empty().append(content);
                    }
                });   
            }
            if (stimuli === "three stable states") {
                var stimuli1 = "three";
                var stimuli2 = "stable states";
                iface.addEventListener('loaded', function () {
                    var lines_to_highlight_1 = stimuli1.split("\n\n");
                    var lines_to_highlight_2 = stimuli2.split("\n\n");

                    var windows = wm.getWindowList();
                    for (var i = 0; i < windows.length; i++) {
                        if (windows[i] == 'text_editor') {
                            continue;
                        }

                        var win = wm.getWindowContent(windows[i]);
                        var content = $(win).find('pre').html();
                        lines_to_highlight_1.map (function (value, index, array) {

                            content = content.replace (value,
                            "<span class=\"highlighted\">" + value + "</span>");
                        });
                        lines_to_highlight_2.map (function (value, index, array) {

                            content = content.replace (value,
                            "<span class=\"highlighted\">" + value + "</span>");
                        });

                      $(win).find('pre').empty().append(content);
                    }
                });   
            }
            if (stimuli === "optional adjectives and determiners") {
                var stimuli1 = "optional";
                var stimuli2 = "adjectives and determiners";
                iface.addEventListener('loaded', function () {
                    var lines_to_highlight_1 = stimuli1.split("\n\n");
                    var lines_to_highlight_2 = stimuli2.split("\n\n");

                    var windows = wm.getWindowList();
                    for (var i = 0; i < windows.length; i++) {
                        if (windows[i] == 'text_editor') {
                            continue;
                        }

                        var win = wm.getWindowContent(windows[i]);
                        var content = $(win).find('pre').html();
                        lines_to_highlight_1.map (function (value, index, array) {

                            content = content.replace (value,
                            "<span class=\"highlighted\">" + value + "</span>");
                        });
                        lines_to_highlight_2.map (function (value, index, array) {

                            content = content.replace (value,
                            "<span class=\"highlighted\">" + value + "</span>");
                        });

                      $(win).find('pre').empty().append(content);
                    }
                });   
            }
            if (stimuli === "having two symbols") {
                var stimuli1 = "having";
                var stimuli2 = "two symbols";
                iface.addEventListener('loaded', function () {
                    var lines_to_highlight_1 = stimuli1.split("\n\n");
                    var lines_to_highlight_2 = stimuli2.split("\n\n");

                    var windows = wm.getWindowList();
                    for (var i = 0; i < windows.length; i++) {
                        if (windows[i] == 'text_editor') {
                            continue;
                        }

                        var win = wm.getWindowContent(windows[i]);
                        var content = $(win).find('pre').html();
                        lines_to_highlight_1.map (function (value, index, array) {

                            content = content.replace (value,
                            "<span class=\"highlighted\">" + value + "</span>");
                        });
                        lines_to_highlight_2.map (function (value, index, array) {

                            content = content.replace (value,
                            "<span class=\"highlighted\">" + value + "</span>");
                        });

                      $(win).find('pre').empty().append(content);
                    }
                });   
            }
            if (stimuli === "tuned circuit to pass a band of frequencies") {
                var stimuli1 = "tuned circuit";
                var stimuli2 = "to pass a band of frequencies";
                iface.addEventListener('loaded', function () {
                    var lines_to_highlight_1 = stimuli1.split("\n\n");
                    var lines_to_highlight_2 = stimuli2.split("\n\n");

                    var windows = wm.getWindowList();
                    for (var i = 0; i < windows.length; i++) {
                        if (windows[i] == 'text_editor') {
                            continue;
                        }

                        var win = wm.getWindowContent(windows[i]);
                        var content = $(win).find('pre').html();
                        lines_to_highlight_1.map (function (value, index, array) {

                            content = content.replace (value,
                            "<span class=\"highlighted\">" + value + "</span>");
                        });
                        lines_to_highlight_2.map (function (value, index, array) {

                            content = content.replace (value,
                            "<span class=\"highlighted\">" + value + "</span>");
                        });

                      $(win).find('pre').empty().append(content);
                    }
                });     
            }
            if (stimuli === "What is AC generator? What is barrier potential?") {
                var stimuli1 = "What is AC generator?";
                var stimuli2 = "What is barrier potential?";
                iface.addEventListener('loaded', function () {
                    var lines_to_highlight_1 = stimuli1.split("\n\n");
                    var lines_to_highlight_2 = stimuli2.split("\n\n");

                    var windows = wm.getWindowList();
                    for (var i = 0; i < windows.length; i++) {
                        if (windows[i] == 'text_editor') {
                            continue;
                        }

                        var win = wm.getWindowContent(windows[i]);
                        var content = $(win).find('pre').html();
                        lines_to_highlight_1.map (function (value, index, array) {

                            content = content.replace (value,
                            "<span class=\"highlighted\">" + value + "</span>");
                        });
                        lines_to_highlight_2.map (function (value, index, array) {

                            content = content.replace (value,
                            "<span class=\"highlighted\">" + value + "</span>");
                        });

                      $(win).find('pre').empty().append(content);
                    }
                });     
            }
            
            iface.addEventListener('loaded', function () {
                var lines_to_highlight = stimuli.split("\n\n");

                var windows = wm.getWindowList();
                for (var i = 0; i < windows.length; i++) {
                    if (windows[i] == 'text_editor') {
                        continue;
                    }

                    var win = wm.getWindowContent(windows[i]);
                    var content = $(win).find('pre').html();
                    lines_to_highlight.map (function (value, index, array) {

                        content = content.replace (value,
                        "<span class=\"highlighted\">" + value + "</span>");
                    });

                  $(win).find('pre').empty().append(content);
                }
            });
        }

        module.getCurrentTrialState = function () {
            if (!currentTrialOptions) {
                console.error('There is no trial running right now!');
                return {};
            }
            var endTime = new Date().getTime();
            currentTrialOptions.start_time = startTime;
            currentTrialOptions.end_time = endTime;
            currentTrialOptions.duration = endTime - startTime;
            currentTrialOptions.user_response = $.trim($('.autocompaste-textarea').val());
            return currentTrialOptions;
        }
    }

    return module;
})();
