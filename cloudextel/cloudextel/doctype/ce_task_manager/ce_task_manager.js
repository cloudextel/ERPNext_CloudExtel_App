frappe.ui.form.on('CE Task Manager', {
    setup: function(frm) {
       
    },
    onload: function(frm) {
        frm.trigger('check_page');
       
    },
	refresh: function(frm) {
        frm.trigger('check_page');
        // Attach custom script to the linked field nn 'parent_ce_task_manager'
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
    },
    due_date:(frm)=>{
        console.log(frm.doc.revised_due_date)
        if(!frm.doc.revised_due_date || frappe.datetime.str_to_obj(frm.doc.revised_due_date) < frappe.datetime.str_to_obj(frm.doc.due_date)){
            frm.set_value('revised_due_date',frm.doc.due_date)
            frm.refresh_field('revised_due_date')
        }
    },
    check_page:(frm)=>{
        frm.add_custom_button('Go To Tree View', () => {
            window.location.href = '/app/ce-task-manager/view/tree/';
        });
        
        if(!frm.doc.__islocal && frappe.session.user != 'Administrator')
        {
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
						window.history.back()
					},500)
                }
            }
        });
    }
    }
});
