$(function () {
  if (!/issues\/gantt(|\/)$/.test(location.pathname)) return;

  // --- search gantt bar ---
  function searchGanttBarIds() {
    const ganttBarIssueIds = [];
    $("#gantt_area div.task.label").each(function (_, element) {
      var tag = $(element).data("collapse-expand");
      if (tag.split("-")[0] == "issue") {
        issueId = tag.split("-").pop();
        ganttBarIssueIds.push(issueId);
      }
    });
    return ganttBarIssueIds;
  }

  const ganttBarIssueIds = searchGanttBarIds();
  if (ganttBarIssueIds.length == 0) {
    return; // abort if no object is found.
  }

  function setupActualDates() {
    // --- config ---
    // px = (days) x zoom
    const zoomOrg = Number($("#zoom").attr("value"));
    if (zoomOrg === undefined || isNaN(zoomOrg)) {
      // is not gantt?
      return;
    }
    const zoom = Math.pow(2, zoomOrg);

    const ganttDateFrom = ActualDates["ganttDateFrom"];
    const ganttDateTo = ActualDates["ganttDateTo"];

    const actualBarBaseStyle = {
      top: 10,
      height: 5,
      color: "#ff9800",
      opacity: 0.6,
    };

    // Note: original task bar = {height: 8px, border: 1px}
    const actualBarStyle = {
      ...actualBarBaseStyle,
      ...ActualDates["barSettings"],
    };

    // convert string to number
    Object.entries(actualBarStyle).forEach(([k, v]) => {
      const numberValue = Number(v);
      if (!isNaN(numberValue)) actualBarStyle[k] = numberValue;
    });

    // --- define helper functions ---
    function diffDate(startDateStr, endDateStr) {
      return (
        (Date.parse(endDateStr) - Date.parse(startDateStr)) /
        24 /
        60 /
        60 /
        1000
      );
    }

    function getTodayStr() {
      var today = new Date();
      var month = today.getMonth() + 1;
      if (month < 10) {
        month = "0" + month;
      }
      var date = today.getDate();
      if (date < 10) {
        date = "0" + date;
      }
      return today.getFullYear() + "-" + month + "-" + date;
    }

    // --- add actual bar ---
    for (let i = 0; i < ganttBarIssueIds.length; i++) {
      const issueId = ganttBarIssueIds[i];

      const actualDates = ActualDates["actualDates"][issueId];
      if (actualDates === undefined) {
        continue;
      }

      const startDateOriginal = ActualDates["originalDates"][issueId]["start"];
      let startDateActual = actualDates["start"];
      let endDateActual = actualDates["end"];

      if (
        (startDateActual === undefined || startDateActual === "") &&
        (endDateActual === undefined || endDateActual === "")
      ) {
        continue;
      }

      if (startDateActual === undefined || startDateActual === "") {
        startDateActual = getTodayStr();
      }

      if (endDateActual === undefined || endDateActual === "") {
        endDateActual = getTodayStr();
      }

      if (Date.parse(startDateActual) > Date.parse(ganttDateTo)) {
        continue;
      }

      // bar width settings
      let startDateActualDisplay = startDateActual;
      if (Date.parse(startDateActual) < Date.parse(ganttDateFrom)) {
        startDateActualDisplay = ganttDateFrom;
      }

      let endDateActualDisplay = endDateActual;
      if (Date.parse(endDateActual) > Date.parse(ganttDateTo)) {
        endDateActualDisplay = ganttDateTo;
      }

      let width = diffDate(startDateActualDisplay, endDateActualDisplay);
      // ignore irregular cases
      if (isNaN(width) || width < 0) {
        continue;
      }
      width += 1; // days = difference date + 1

      // bar left settings
      const offsetDateOriginal = diffDate(ganttDateFrom, startDateOriginal);
      const offsetDateActual = diffDate(ganttDateFrom, startDateActual);
      if (offsetDateActual < 0) {
        var left = 0;
      } else {
        var left = offsetDateActual;
      }
      if (offsetDateOriginal > 0) {
        left -= offsetDateOriginal;
      }

      // add actual bar element to div.tooltip
      const $actualBarBase = $("<div/>")
        .addClass("task_leaf_actual")
        .css({
          position: "absolute",
          top: actualBarStyle.top,
          left: left * zoom,
          paddingBottom: 2,
        });

      const $actualBar = $("<div/>");
      $actualBar
        .css({
          height: actualBarStyle.height,
          width: width * zoom,
          backgroundColor: actualBarStyle.color,
          opacity: actualBarStyle.opacity,
        })
        .appendTo($actualBarBase);

      let $parentTaskTooltip = $(
        "#gantt_area " +
          'div.tooltip[data-collapse-expand="issue-' +
          issueId +
          '"]' +
          ":first"
      );

      // if element is not found then create a new element
      // TODO: tooltip is not visible
      if ($parentTaskTooltip.length == 0) {
        const $taskLabel = $(
          "#gantt_area " +
            'div.task.label[data-collapse-expand="issue-' +
            issueId +
            '"]' +
            ":first"
        );
        $parentTaskTooltip = $("<div />")
          .css({
            top: $taskLabel.css("top"),
            left: 0,
            position: "absolute",
          })
          .attr("data-collapse-expand", $taskLabel.data("collapse-expand"))
          .attr("data-number-of-rows", $taskLabel.data("number-of-rows"));
        $parentTaskTooltip.insertAfter($taskLabel);
      }
      $parentTaskTooltip.prepend($actualBarBase);

      // update tooltip's style
      $parentTaskTooltip.children("span.tip").css({
        "margin-top":
          2 +
          actualBarStyle.top +
          actualBarStyle.height -
          $parentTaskTooltip.height(),
      });
    }
  }
  setupActualDates();

  new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length > 0) {
        setupActualDates();
      }
    });
  }).observe($("table.gantt-table")[0], { childList: true });

  const ganttEntryClickOriginal = ganttEntryClick;
  ganttEntryClick = function (e) {
    ganttEntryClickOriginal(e);
    $("#gantt_area .task_leaf_actual").each(function () {
      const $elm = $(this);
      const issueIdTag = $elm.parent().data("collapse-expand");
      if (
        $(
          "#gantt_area div.task.label[data-collapse-expand=" +
            issueIdTag +
            "]:first"
        ).is(":visible")
      ) {
        $elm.show();
      } else {
        $elm.hide();
      }
    });
  };
});
