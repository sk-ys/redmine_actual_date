$(function () {

  // --- search gantt bar ---
  var search_gantt_bar_ids = function() {
    var get_issue_id = function (str) {
      return str.split('-').pop()
    }

    var gantt_bar_issue_ids = [];
    $('#gantt_area div[id^="task-todo-issue-"]').each(
      function (index, element) {
        issue_id = get_issue_id($(element).attr('id'));
        gantt_bar_issue_ids.push(issue_id);
      });

    return gantt_bar_issue_ids
  }

  var gantt_bar_issue_ids = search_gantt_bar_ids();
  if (gantt_bar_issue_ids.length == 0) {
    return // abort if no object is found.
  }

  // --- config ---
  // px = (days) x zoom
  var zoom_org = Number($('#zoom').attr('value'));
  if (zoom_org === undefined || isNaN(zoom_org)) { // is not gantt?
    return
  }
  var zoom = Math.pow(2, zoom_org);

  var load_bar_config = function (key, default_value) {
    try {
      var value = ActualDates['bar_settings'][key];
    } catch (error) {
      var value = default_value;
    }
    return value;
  }

  // Note: original task bar = {height: 8px, border: 1px}
  var actual_bar_top = load_bar_config('top', 10) + 'px';
  var actual_bar_height = load_bar_config('height', 5) + 'px';
  var actual_bar_color = load_bar_config('color', '#ff9800');
  var actual_bar_opacity = load_bar_config('opacity', 0.6);

  var actual_bar_base = $('<div class="task_leaf_actual">&nbsp;</div>')
  actual_bar_base.css({
    position: 'absolute',
    backgroundColor: actual_bar_color,
    top: actual_bar_top,
    height: actual_bar_height,
    opacity: actual_bar_opacity,
  })

  // --- define functions ---
  var diff_date = function (start_date_str, end_date_str) {
    return (Date.parse(end_date_str) - Date.parse(start_date_str)) /
      24 / 60 / 60 / 1000;
  }

  var get_today_str = function () {
    var today = new Date();
    var month = today.getMonth() + 1;
    if (month < 10) {
      month = '0' + month;
    }
    var date = today.getDate();
    if (date < 10) {
      date = '0' + date;
    }
    return today.getFullYear() + '-' + month + '-' + date;
  }

  // --- add actual bar ---
  for (var i = 0; i < gantt_bar_issue_ids.length; i++) {
    var issue_id = gantt_bar_issue_ids[i];

    var actual_dates = ActualDates['actual_dates'][issue_id];
    if (actual_dates === undefined) {
      continue;
    }

    var start_date_original = ActualDates['original_dates'][issue_id]['start'];
    var start_date_actual = actual_dates['start'];
    var end_date_actual = actual_dates['end'];

    if (
      (start_date_actual === undefined || start_date_actual === '') &&
      (end_date_actual === undefined || end_date_actual === '')) {
      continue;
    }

    if (start_date_actual === undefined || start_date_actual === '') {
      start_date_actual = get_today_str();
    }

    if (end_date_actual === undefined || end_date_actual === '') {
      end_date_actual = get_today_str();
    }

    var width = diff_date(start_date_actual, end_date_actual);
    // ignore irregular cases
    if (isNaN(width) || width < 0) {
      continue;
    }
    width += 1 // days = difference date + 1

    try {
      var left = diff_date(start_date_original, start_date_actual);
    } catch (err) {
      continue;
    }

    // todo: if width is exceeded the gantt area

    // add actual bar element to div.tooltip
    var actual_bar = actual_bar_base.clone();
    actual_bar.css({
      left: left * zoom,
      width: width * zoom,
    })

    var parent_task_tooltip = $(
      '#gantt_area ' +
      'div.tooltip[data-collapse-expand="issue-' + issue_id + '"]' +
      ':first');
    parent_task_tooltip.prepend(actual_bar);

    // update tooltip's style
    parent_task_tooltip.children('span.tip').css({
      'margin-top': actual_bar_height
    });
  }
});