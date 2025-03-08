$(function () {
  // === common ===
  // --- configuration ---
  const ActualDates = JSON.parse($("#actual_dates_data").text());
  const actualStartDateCfId = ActualDates["cfId"]["start"];
  const actualEndDateCfId = ActualDates["cfId"]["end"];

  function moveElements() {
    // === issue attribute ===
    // --- configuration ---
    const $targetIssueAttributes = $("#attributes>div.splitcontent:first");
    const splitcontentDateinfoStr =
      '<div class="splitcontent">' +
      '<div class="splitcontentleft"></div>' +
      '<div class="splitcontentright"></div>' +
      "</div>";

    const $splitcontent = $(splitcontentDateinfoStr);
    const $splitcontentleftLeft = $splitcontent.children(
      ".splitcontentleft:first"
    );
    const $splitcontentleftRight = $splitcontent.children(
      ".splitcontentright:first"
    );
    $splitcontent.css("margin", "1em 0");

    $targetIssueAttributes.after($splitcontent);

    // --- move elements ---
    // start date
    $("#start_date_area").appendTo($splitcontentleftLeft);

    // due date
    $("#due_date_area").appendTo($splitcontentleftRight);

    // actual start date
    $("#issue_custom_field_values_" + actualStartDateCfId)
      .parent()
      .appendTo($splitcontentleftLeft);

    // actual end date
    $("#issue_custom_field_values_" + actualEndDateCfId)
      .parent()
      .appendTo($splitcontentleftRight);

    // estimated hours
    // $('#content div.attributes div.attribute.estimated-hours:first')
    //     .appendTo(splitcontentleft_left);
  }

  // initial invoke
  moveElements();

  // override original function
  const replaceIssueFormWithOrg = replaceIssueFormWith;
  replaceIssueFormWith = function (html) {
    replaceIssueFormWithOrg(html);
    moveElements();
  };
});
