frappe.listview_settings['CE Task Manager'] = {
    onload: function(listview) {
        listview.page.add_inner_button(
            `<i class="fa fa-calendar"></i> ${__('View My Task')}`,
            function() {
                window.open('/app/todo/view/calendar/default?allocated_to=' + frappe.session.user, '_blank');
            }
        );
        listview.page.add_inner_button(
            `<i class="fa fa-tree"></i> ${__('Add/View Task')}`,
            function() {
                window.open('/app/ce-task-manager/view/tree/');
            }
        );
    }
}
