frappe.listview_settings['Task Manager'] = {
    hide_name_column: true,
    filters: [
        ['Task Manager','custom_task_owner', '=', frappe.session.user_name]
    ],
    // onload: function(listview) {
    //     // Get the current user
    //     var user = frappe.session.user;

    //     // Apply the filter condition
    //     listview.get_query = function(doc, cdt, cdn) {
    //         return {
    //             filters: [
    //                 {
    //                     fieldname: "custom_task_owner",
    //                     operator: "=",
    //                     value: user
    //                 }
    //             ]
    //         };
    //     };
    // }
};
