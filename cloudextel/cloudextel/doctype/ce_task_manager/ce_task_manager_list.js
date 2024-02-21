frappe.listview_settings['CE Task Manager'] = {
    
    add_fields: ['subject', 'lob','category','team','status','start_date','due_date','age'],
    hide_name_column: true,
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
        setTimeout(()=>{
            listview.data = listview.data.map(function(row) {
                console.log(row)
                    // Calculate age based on today's date and due date
                    var due_date = frappe.datetime.str_to_obj(row.due_date);
                    if(due_date)
                    {
                        var today = frappe.datetime.get_today();
                        var age = frappe.datetime.get_diff(today, due_date) / (60 * 60 * 24);
                        row.age = age;
    
                    }
                    return row
                 
            });
            listview.refresh();
        },4000)
    },
    before_refresh:(listview)=>{
        listview.data.forEach(function(row) {
            console.log(row)
                // Calculate age based on today's date and due date
                var due_date = frappe.datetime.str_to_obj(row.due_date);
                if(due_date)
                {
                    var today = frappe.datetime.get_today();
                    var age = frappe.datetime.get_diff(today, due_date) / (60 * 60 * 24);
                    row.age = age;

                }
             
        });
        listview.refresh();
        console.log(listview.data,"---")
    }
}
