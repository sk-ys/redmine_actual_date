$(function () {
    // === common ===
    // --- configuration ---
    var actual_start_date_cf_id = ActualDates['cf_id']['start'];
    var actual_end_date_cf_id = ActualDates['cf_id']['end'];

    var move_elements = function () {
        // === issue attribute ===
        // --- configuration ---
        var target_issue_attributes =
            $('#attributes>div.splitcontent:first');
        var splitcontent_dateinfo_str = '';
        splitcontent_dateinfo_str += '<div class="splitcontent">';
        splitcontent_dateinfo_str += '<div class="splitcontentleft"></div>';
        splitcontent_dateinfo_str += '<div class="splitcontentright"></div>';
        splitcontent_dateinfo_str += '</div>';

        var splitcontent = $(splitcontent_dateinfo_str);
        var splitcontentleft_left = splitcontent.children('.splitcontentleft:first');
        var splitcontentleft_right = splitcontent.children('.splitcontentright:first');
        splitcontent.css('margin', '1em 0')

        target_issue_attributes.after(splitcontent);


        // --- move elements ---
        // start date
        $('#start_date_area').appendTo(splitcontentleft_left);

        // due date
        $('#due_date_area').appendTo(splitcontentleft_right);

        // actual start date
        $('#issue_custom_field_values_' + actual_start_date_cf_id).parent()
            .appendTo(splitcontentleft_left);

        // actual end date
        $('#issue_custom_field_values_' + actual_end_date_cf_id).parent()
            .appendTo(splitcontentleft_right);

        // estimated hours
        // $('#content div.attributes div.attribute.estimated-hours:first')
        //     .appendTo(splitcontentleft_left);
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