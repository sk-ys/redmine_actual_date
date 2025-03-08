$(function () {
  // === common ===
  // --- configuration ---
  const ActualDates = JSON.parse($("#actual_dates_data").text());
  const actualStartDateCfId = ActualDates["cfId"]["start"];
  const actualEndDateCfId = ActualDates["cfId"]["end"];
  const labelDateInformation = ActualDates["labelDateInformation"];

  // === issue attribute ===
  // --- configuration ---
  const $targetIssueAttributes = $(
    "#content div.issue.details div.attributes>div.splitcontent:first"
  );
  const $splitcontentDateinfoStr =
    "" +
    '<div class="splitcontent">' +
    '<div class="splitcontentleft"></div>' +
    '<div class="splitcontentleft"></div>' +
    "</div>";

  const $splitcontent = $($splitcontentDateinfoStr);
  const $splitcontentleftLeft = $splitcontent.children(
    ".splitcontentleft:first"
  );
  const $splitcontentleftRight = $splitcontent.children(
    ".splitcontentleft:last"
  );

  $targetIssueAttributes.after($splitcontent);

  // --- move elements ---
  // start date
  $(
    "#content div.issue.details div.attributes div.attribute.start-date:first"
  ).appendTo($splitcontentleftLeft);

  // due date
  $(
    "#content div.issue.details div.attributes div.attribute.due-date:first"
  ).appendTo($splitcontentleftRight);

  // actual start date
  $(
    "#content div.issue.details div.attributes div.attribute.cf_" +
      actualStartDateCfId +
      ":first"
  ).appendTo($splitcontentleftLeft);

  // actual end date
  $(
    "#content div.issue.details div.attributes div.attribute.cf_" +
      actualEndDateCfId +
      ":first"
  ).appendTo($splitcontentleftRight);

  // estimated hours
  // $('#content div.attributes div.attribute.estimated-hours:first')
  //     .appendTo(splitcontentleft_left);

  // add hr
  var issue_attributes_content_last_text = $(
    "#content div.issue.details div.attributes>div.splitcontent:last"
  ).text();

  $splitcontent.before("<hr>");
  if (issue_attributes_content_last_text !== "") {
    $splitcontent.after("<hr>");
  }

  // === issue form ===
  // --- configuration ---
  const $targetIssueFormFieldset = $("#issue-form fieldset:first");

  const fieldsetDateInfoStr =
    '<fieldset class="tabular dateinfo">' +
    "<legend>" +
    labelDateInformation +
    "</legend>" +
    ' <div class="splitcontent">' +
    ' <div class="splitcontentleft">' +
    " </div>" +
    ' <div class="splitcontentright">' +
    " </div>" +
    " </div>" +
    "</fieldset>";

  function moveElements() {
    $("#issue-form fieldset.dateinfo").remove();

    // define fileldset and splitcontent
    const $fieldsetDateInfo = $(fieldsetDateInfoStr);
    const $splitcontentLeft = $fieldsetDateInfo
      .children("div.splitcontent")
      .children("div.splitcontentleft");
    const splitcontentrRight = $fieldsetDateInfo
      .children("div.splitcontent")
      .children("div.splitcontentright");

    // add new filedset
    $targetIssueFormFieldset.after($fieldsetDateInfo);

    // --- move elements ---
    // start date
    $("#start_date_area").appendTo($splitcontentLeft);

    // due date
    $("#due_date_area").appendTo(splitcontentrRight);

    // actual start date
    $(
      "#issue-form label[for=issue_custom_field_values_" +
        actualStartDateCfId +
        "]:first"
    )
      .parent()
      .appendTo($splitcontentLeft);

    // actual end date
    $(
      "#issue-form label[for=issue_custom_field_values_" +
        actualEndDateCfId +
        "]:first"
    )
      .parent()
      .appendTo(splitcontentrRight);

    // estimated hours
    // $('#issue-form label[for=issue_estimated_hours]:first').parent()
    //     .appendTo(splitcontentleft);
  }

  // initial invoke
  moveElements();

  // override original function
  var replaceIssueFormWithOrg = replaceIssueFormWith;
  replaceIssueFormWith = function (html) {
    replaceIssueFormWithOrg(html);
    moveElements();
  };
});
