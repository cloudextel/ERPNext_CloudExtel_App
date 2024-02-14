frappe.ui.form.on('CE Task Manager', {
    onload: function(frm) {
        frappe.call({
            method: 'cloudextel.cloudextel.doctype.ce_task_manager.ce_task_manager.is_assigned_or_created_by_user',
            args: {
                doc_type: frm.doctype,
                doc_name: frm.docname,
                user: frappe.session.user
            },
            callback: function(response) {
                if (!response.message) {
                    // User does not have permission, so disable all form controls
                    frm.set_read_only();

                    // Display an alert message
					
                    frappe.msgprint({
                        message: __('You do not have permission to access this document. <b>' + frm.docname +'</b>'),
                        indicator: 'red',
						callback: function() {
                            // Redirect to the list page of CE Task Manager after closing the alert
                            frappe.set_route('List', 'CE Task Manager');
                        }
                    });
					setTimeout(()=>{
						window.location.href = '/app/ce-task-manager/view/list';
					},500)
                }
            }
        });

    },
	refresh: function(frm) {
        // Attach custom script to the linked field 'parent_ce_task_manager'
        frm.fields_dict['parent_ce_task_manager'].$input.on('click', function() {
           if(frm.doc.parent_ce_task_manager){
			frappe.call({
				method: 'cloudextel.cloudextel.doctype.ce_task_manager.ce_task_manager.is_assigned_or_created_by_user',
				args: {
					doc_type: frm.doctype,
					doc_name: frm.doc.parent_ce_task_manager,
					user: frappe.session.user
				},
				callback: function(response) {
					if (!response.message) {
						// User does not have permission, so disable all form controls
						frm.set_read_only();
						frappe.throw('You Dont Have Permission to View the Doc <b>'+frm.doc.parent_ce_task_manager +'</b>')

					}
				}
			})}
     
        });
    }
});
