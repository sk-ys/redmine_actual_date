$(function () {
    // === common ===
    // --- configuration ---
    var actual_start_date_cf_id = ActualDates['cf_id']['start'];
    var actual_end_date_cf_id = ActualDates['cf_id']['end'];
    var label_date_information = ActualDates['label_date_information'];


    // === issue attribute ===
    // --- configuration ---
    var target_issue_attributes =
        $('#content div.issue.details div.attributes>div.splitcontent:first');
    var splitcontent_dateinfo_str = '';
    splitcontent_dateinfo_str += '<div class="splitcontent">';
    splitcontent_dateinfo_str += '<div class="splitcontentleft"></div>';
    splitcontent_dateinfo_str += '<div class="splitcontentleft"></div>';
    splitcontent_dateinfo_str += '</div>';

    var splitcontent = $(splitcontent_dateinfo_str);
    var splitcontentleft_left = splitcontent.children('.splitcontentleft:first');
    var splitcontentleft_right = splitcontent.children('.splitcontentleft:last');

    target_issue_attributes.after(splitcontent);


    // --- move elements ---
    // start date
    $('#content div.issue.details div.attributes div.attribute.start-date:first')
        .appendTo(splitcontentleft_left);

    // due date
    $('#content div.issue.details div.attributes div.attribute.due-date:first')
        .appendTo(splitcontentleft_right);

    // actual start date
    $('#content div.issue.details div.attributes div.attribute.cf_' +
        actual_start_date_cf_id + ':first').appendTo(splitcontentleft_left);

    // actual end date
    $('#content div.issue.details div.attributes div.attribute.cf_' +
        actual_end_date_cf_id + ':first').appendTo(splitcontentleft_right);

    // estimated hours
    // $('#content div.attributes div.attribute.estimated-hours:first')
    //     .appendTo(splitcontentleft_left);

    // add hr
    var issue_attributes_content_last_text =
        $('#content div.issue.details div.attributes>div.splitcontent:last')
        .text();

    splitcontent.before('<hr>');
    if (issue_attributes_content_last_text !== '') {
        splitcontent.after('<hr>');
    }


    // === issue form ===
    // --- configuration ---
    var target_issue_form_fieldset = $('#issue-form fieldset:first');

    var fieldset_dateinfo_str = '';
    fieldset_dateinfo_str += '<fieldset class="tabular dateinfo">';
    fieldset_dateinfo_str += '<legend>' + label_date_information + '</legend>';
    fieldset_dateinfo_str += ' <div class="splitcontent">';
    fieldset_dateinfo_str += ' <div class="splitcontentleft">';
    fieldset_dateinfo_str += ' </div>';
    fieldset_dateinfo_str += ' <div class="splitcontentright">';
    fieldset_dateinfo_str += ' </div>';
    fieldset_dateinfo_str += ' </div>';
    fieldset_dateinfo_str += '</fieldset>';

    var move_elements = function () {
        $('#issue-form fieldset.dateinfo').remove();

        // define fileldset and splitcontent
        var fieldset_dateinfo = $(fieldset_dateinfo_str);
        var splitcontentleft = fieldset_dateinfo
            .children('div.splitcontent').children('div.splitcontentleft');
        var splitcontentright = fieldset_dateinfo
            .children('div.splitcontent').children('div.splitcontentright');

        // add new filedset
        target_issue_form_fieldset.after(fieldset_dateinfo);

        // --- move elements ---
        // start date
        $('#start_date_area').appendTo(splitcontentleft);

        // due date
        $('#due_date_area').appendTo(splitcontentright);

        // actual start date
        $('#issue-form label[for=issue_custom_field_values_' +
            actual_start_date_cf_id + ']:first').parent()
            .appendTo(splitcontentleft);

        // actual end date
        $('#issue-form label[for=issue_custom_field_values_' +
            actual_end_date_cf_id + ']:first').parent()
            .appendTo(splitcontentright);

        // estimated hours
        // $('#issue-form label[for=issue_estimated_hours]:first').parent()
        //     .appendTo(splitcontentleft);
    }

    // initial invoke
    move_elements();

    // override original function
    var _replaceIssueFormWith = replaceIssueFormWith;
    replaceIssueFormWith = function (html) {
        _replaceIssueFormWith(html);
        move_elements();
    };
});