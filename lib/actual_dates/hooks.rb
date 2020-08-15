module ActualDates
  class Hooks < Redmine::Hook::ViewListener
    def view_layouts_base_html_head(context={})
      actual_dates = get_actual_dates()
      if actual_dates.nil?
        return ''
      end

      original_dates = get_original_dates(issue_ids=actual_dates.keys)

      context[:actual_dates] = actual_dates
      context[:original_dates] = original_dates

      context[:hook_caller].send(:render, {
        partial: '/hooks/actual_dates/view_layouts_base_html_head',
        locals: context
      })
    end

    def get_actual_dates
      actual_start_date_cf_id =
        Setting.plugin_redmine_actual_date['actual_start_date'].to_f
      unless actual_start_date_cf_id > 0
        return nil
      end

      actual_end_date_cf_id =
        Setting.plugin_redmine_actual_date['actual_end_date'].to_f
      unless actual_end_date_cf_id > 0
        return nil
      end

      if actual_start_date_cf_id == actual_end_date_cf_id
        return nil
      end

      custom_values = CustomValue.where(
        custom_field_id: [actual_start_date_cf_id, actual_end_date_cf_id])

      allowed_project_ids = get_allowed_project_ids()

      actual_dates = {}
      custom_values.each do |cv|
        custom_field_id = cv['custom_field_id']
        issue_id = cv['customized_id']
        value = cv['value']

        unless allowed_project_ids.include?(get_project_id(issue_id))
          next
        end

        unless actual_dates.key?(issue_id)
          actual_dates[issue_id] = {}
        end

        if custom_field_id == actual_start_date_cf_id
          actual_dates[issue_id]['start'] = value
        else
          actual_dates[issue_id]['end'] = value
        end
      end

      return actual_dates
    end

    def get_original_dates(issue_ids)
      original_dates = {}

      issue_ids.each do |issue_id|
        issue = Issue.find(issue_id)
        original_dates[issue_id] = {
          start: issue.start_date.to_s,
          end: issue.due_date.to_s
        }
      end

      return original_dates
    end

    def get_allowed_project_ids
      projects = Project.visible
      # projects = User.current.memberships.collect(&:project).compact.uniq
      allowed_project_ids = []
      projects.each do |project|
        if User.current.allowed_to?(:view_actual_dates_bar, project)
          allowed_project_ids.push project.id
        end
      end

      return allowed_project_ids
    end

    def get_project_id(issue_id)
      return Issue.find(issue_id)&.project_id
    end

  end
end
