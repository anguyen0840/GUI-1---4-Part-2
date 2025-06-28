 /* 
File: script.js
GUI Assignment 4 - Part 1: Using jQuery Plugin UI with Dynamic Table
Anh Nguyen, UMass Lowell Computer Science, anh_nguyen9@student.uml.edu
Copyright (c) 2025 by Anh Nguyen. All rights reserved. May be freely copied or
excerpted for educational purposes with credit to the author.
updated by AN on June 27, 2021 at 12:15 PM 
*/

$(document).ready(function() {
    $("#tableTabs").tabs();

    function createSlider(inputId, sliderId) {
        $(sliderId).slider({
            min: -50,
            max: 50,
            value: parseInt($(inputId).val()) || 0,
            slide: function(event, ui) {
                $(inputId).val(ui.value);
                generateTable();
            }
        });

        $(inputId).on('input', function() {
            let val = parseInt($(this).val());
            if (!isNaN(val)) {
                $(sliderId).slider('value', val);
                generateTable();
            }
        });
    }

    // Set initial input values to work with sliders
    $('#startingR').val(1);
    $('#endingR').val(5);
    $('#startingC').val(1);
    $('#endingC').val(5);

    // Create sliders after setting input defaults
    createSlider("#startingR", "#sliderStartingR");
    createSlider("#endingR", "#sliderEndingR");
    createSlider("#startingC", "#sliderStartingC");
    createSlider("#endingC", "#sliderEndingC");

    // Corrected validation
    $("#tableGrid").validate({
        rules: {
            startingR: {
                required: true,
                number: true,
                range: [-50, 50]
            },
            endingR: {
                required: true,
                number: true,
                range: [-50, 50]
            },
            startingC: {
                required: true,
                number: true,
                range: [-50, 50]
            },
            endingC: {
                required: true,
                number: true,
                range: [-50, 50]
            }
        },
        messages: {
            startingR: {
                required: "Please enter a starting value for the row.",
                range: "Value must be between -50 and 50."
            },
            endingR: {
                required: "Please enter an ending value for the row.",
                range: "Value must be between -50 and 50."
            },
            startingC: {
                required: "Please enter a starting value for the column.",
                range: "Value must be between -50 and 50."
            },
            endingC: {
                required: "Please enter an ending value for the column.",
                range: "Value must be between -50 and 50."
            }
        },
        submitHandler: function(form) {
            generateTable(true);
            return false;
        }
    });

    function generateTable(createNewTab = false) {
        var startingR = parseInt($('#startingR').val());
        var endingR = parseInt($('#endingR').val());
        var startingC = parseInt($('#startingC').val());
        var endingC = parseInt($('#endingC').val());

        if (isNaN(startingR) || isNaN(endingR) || isNaN(startingC) || isNaN(endingC)) {
            $('#error').text("Please enter valid integers.");
            return;
        }

        $('#error').empty();

        if (startingR > endingR || startingC > endingC) {
            $('#error').text('Starting values must be less than or equal to ending values.');
            return;
        }

        let table = '<table><tr><th></th>';
        for (let i = startingR; i <= endingR; i++) {
            table += `<th>${i}</th>`;
        }
        table += '</tr>';

        for (let i = startingC; i <= endingC; i++) {
            table += `<tr><th>${i}</th>`;
            for (let j = startingR; j <= endingR; j++) {
                table += `<td>${i * j}</td>`;
            }
            table += '</tr>';
        }
        table += '</table>';

        if (createNewTab) {
            const tabTitle = `${startingR} to ${endingR}, ${startingC} to ${endingC}`;
            const tabId = 'tab-' + new Date().getTime();
            $('#tableTabs ul').append(`<li><input type="checkbox" class="tab-checkbox" data-tab-id="${tabId}"> <a href="#${tabId}">${tabTitle}</a> <span class="ui-icon ui-icon-close" role="presentation">Remove Tab</span></li>`);
            $('#tableTabs').append(`<div id="${tabId}">${table}</div>`);
            $('#tableTabs').tabs('refresh');
        } else {
            $('#multiplicationTable').html(table);
        }
    }

    $('#tableTabs').on('click', 'span.ui-icon-close', function() {
        const panelId = $(this).closest("li").remove().attr("aria-controls");
        $("#" + panelId).remove();
        $("#tableTabs").tabs('refresh');
    });

    $('#deleteTabsButton').on('click', function() {
        $('.tab-checkbox:checked').each(function() {
            const tabId = $(this).data('tab-id');
            $(`li a[href="#${tabId}"]`).closest("li").remove();
            $("#" + tabId).remove();
        });
        $("#tableTabs").tabs('refresh');
    });
});