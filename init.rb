require 'actual_dates/hooks'
Redmine::Plugin.register :redmine_actual_date do
  name 'Redmine Actual Date plugin'
  author 'sk-ys'
  description 'This is a plugin for Redmine'
  version '0.0.1'
  url 'https://github.com/sk-ys/redmine_actual_date'
  author_url 'https://github.com/sk-ys'

  # todo:
  # requires_redmine version_or_higher: '4.0.0'

  settings default: {
    actual_start_date: nil,
    actual_end_date: nil
  }, partial: 'settings/actual_dates/general'

  project_module :actual_dates do
    permission :view_actual_dates_bar, {}
  end
end
