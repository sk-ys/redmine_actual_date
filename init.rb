require File.expand_path('../lib/actual_dates/hooks', __FILE__)
Redmine::Plugin.register :redmine_actual_date do
  name 'Redmine Actual Date plugin'
  author 'sk-ys'
  description 'This plugin displays a bar of actual dates on the Gantt chart'
  version '0.0.7'
  url 'https://github.com/sk-ys/redmine_actual_date'
  author_url 'https://github.com/sk-ys'

  # todo:
  # requires_redmine version_or_higher: '4.0.0'

  settings default: {
    actual_start_date: nil,
    actual_end_date: nil,
    actual_bar_top: 10,
    actual_bar_height: 5,
    actual_bar_color: '#ff9800',
    actual_bar_opacity: 0.6,
    rearrange_date_information_on_issue: false,
  }, partial: 'settings/actual_dates/general'

  project_module :actual_dates do
    permission :view_actual_dates_bar, {}
  end
end
