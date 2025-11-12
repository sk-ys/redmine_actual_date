$(function () {
  const ActualDates = JSON.parse($("#actual_dates_data").text());
  const actualStartDateCfId = ActualDates["cfId"]["start"];
  const actualEndDateCfId = ActualDates["cfId"]["end"];
  const labelDateInformation = ActualDates["labelDateInformation"];
  const isNewForm = ["controller-issues", "action-new"].every((c) =>
    $("body").hasClass(c)
  );
  const isEditable = $("#update").length !== 0;

  function generateSplitcontentTemplate() {
    const $splitcontentLeft = $("<div>").addClass("splitcontentleft");
    const $splitcontentRight = $("<div>").addClass("splitcontentright");
    const $splitcontent = $("<div>")
      .addClass("splitcontent")
      .append($splitcontentLeft)
      .append($splitcontentRight);

    return { $splitcontent, $splitcontentLeft, $splitcontentRight };
  }

  function generateFieldSetTemplate(legend) {
    const { $splitcontent, $splitcontentLeft, $splitcontentRight } =
      generateSplitcontentTemplate();
    const $fieldset = $("<fieldset>")
      .addClass("tabular dateinfo")
      .append($("<legend>").text(legend))
      .append($splitcontent);
    return { $fieldset, $splitcontentLeft, $splitcontentRight };
  }

  function reorganizeIssueView() {
    const $issueAttributes = $("#content div.issue.details div.attributes");
    const $insertTarget = $issueAttributes.find("div.splitcontent:first");
    const {
      $splitcontent: $dateInfoSplitcontent,
      $splitcontentLeft,
      $splitcontentRight,
    } = generateSplitcontentTemplate();

    // Define view elements to move
    const $actualStartDateField = $issueAttributes.find(
      "div.attribute.cf_" + actualStartDateCfId
    );
    const $actualEndDateField = $issueAttributes.find(
      "div.attribute.cf_" + actualEndDateCfId
    );

    // Move elements
    $splitcontentLeft
      .append($issueAttributes.find("div.attribute.start-date"))
      .append($actualStartDateField);
    $splitcontentRight
      .append($issueAttributes.find("div.attribute.due-date"))
      .append($actualEndDateField);

    // Insert new splitcontent to the issue attributes
    $insertTarget.after($dateInfoSplitcontent);

    // Add hr
    if ($dateInfoSplitcontent.prev()[0].nodeName !== "HR") {
      $dateInfoSplitcontent.before("<hr>");
    }
    if (
      $dateInfoSplitcontent.next()[0].nodeName !== "HR" &&
      $dateInfoSplitcontent.nextAll(".splitcontent").length > 0
    ) {
      $dateInfoSplitcontent.after("<hr>");
    }
  }

  function reorganizeIssueForm() {
    const $issueForm = $("#issue-form");
    const $insertTarget = $issueForm.find("fieldset:first");

    // Generate fieldset and splitcontent
    const {
      $fieldset: $fieldsetDateInfo,
      $splitcontentLeft,
      $splitcontentRight,
    } = generateFieldSetTemplate(labelDateInformation);

    // Define form elements to move
    const $actualStartDateForm = $issueForm
      .find("label[for=issue_custom_field_values_" + actualStartDateCfId + "]")
      .parent();

    const $actualEndDateForm = $issueForm
      .find("label[for=issue_custom_field_values_" + actualEndDateCfId + "]")
      .parent();

    // Move elements
    $splitcontentLeft
      .append($("#start_date_area"))
      .append($actualStartDateForm);
    $splitcontentRight.append($("#due_date_area")).append($actualEndDateForm);

    // Remove old dateinfo fieldset if exists
    $("#issue-form fieldset.dateinfo").remove();

    // Append new filedset to the form
    $insertTarget.after($fieldsetDateInfo);
  }

  function reorganizeIssueFormForNewForm() {
    const $issueForm = $("#issue-form");
    const $insertTarget = $issueForm.find("#attributes>div.splitcontent:first");
    const {
      $splitcontent: $dateInfoSplitcontent,
      $splitcontentLeft,
      $splitcontentRight,
    } = generateSplitcontentTemplate();
    $dateInfoSplitcontent.addClass("dateinfo");

    // Define form elements to move
    const $actualStartDateForm = $issueForm
      .find("label[for=issue_custom_field_values_" + actualStartDateCfId + "]")
      .parent();

    const $actualEndDateForm = $issueForm
      .find("label[for=issue_custom_field_values_" + actualEndDateCfId + "]")
      .parent();

    // Move elements
    $splitcontentLeft
      .append($("#start_date_area"))
      .append($actualStartDateForm);
    $splitcontentRight.append($("#due_date_area")).append($actualEndDateForm);

    // Remove old dateinfo splitcontent if exists
    $("#issue-form .splitcontent.dateinfo").remove();

    if ($dateInfoSplitcontent.find("input").length === 0) {
      return; // No inputs to show, skip adding the section
    }

    // Append new content to the form
    $insertTarget.after($dateInfoSplitcontent);

    // Add hr
    if ($dateInfoSplitcontent.prev()[0].nodeName !== "HR") {
      $dateInfoSplitcontent.before("<hr>");
    }
  }

  /**
   * Set up form change detection.
   * This method's purpose is to detect when the issue view is replaced by
   * other plugins like Redmine RT.
   */
  function setupFormChangeDetection() {
    const targetNode = $("div.issue.details").parent()[0];

    if (targetNode) {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === "childList") {
            mutation.addedNodes.forEach((node) => {
              if (
                node.nodeType === Node.ELEMENT_NODE &&
                $(node).is("div.issue.details")
              ) {
                reorganizeIssueView();
              }
            });
          }
        });
      });

      observer.observe(targetNode, {
        childList: true,
        subtree: true,
        attributes: false,
      });
    }
  }

  function initialize() {
    if (!isNewForm) {
      // Initial invoke
      reorganizeIssueView();

      // Initialize form change detection
      setupFormChangeDetection();
    }

    if (isNewForm || isEditable) {
      if (isNewForm) {
        // Replace reorganizeIssueForm with the new form version
        reorganizeIssueForm = reorganizeIssueFormForNewForm;
      }

      // Initial invoke
      reorganizeIssueForm();

      // Override the original function
      var replaceIssueFormWithOrg = replaceIssueFormWith;
      replaceIssueFormWith = function (html) {
        $("#issue-form .dateinfo").empty(); // Clear existing content to avoid duplication
        replaceIssueFormWithOrg(html);
        reorganizeIssueForm();
      };
    }
  }

  initialize();
});
