import frappe


def check_conditions(doc, method):
    old_doc = doc.get_doc_before_save()
    if old_doc and old_doc.get('status') == 'Working' and doc.get('status') in ['Close', 'Hold', 'Cancelled']:
        filters = {'parent_ce_task_manager': doc.name}
        if doc.get('status') == 'Close':
            filters['status'] = ['!=', 'Close']
        elif doc.get('status') == 'Hold':
            filters['status'] = ['not in', ['Close', 'Hold']]
        elif doc.get('status') == 'Cancelled':
            filters['status'] = ['not in', ['Close', 'Cancelled']]

        pending_tasks = frappe.get_all('CE Task Manager', filters=filters,
                                       fields=["name", "subject", "status"])

        if pending_tasks:
            msg = "Please fix the following pending tasks:<br>"
            for task in pending_tasks:
                msg += f"{task['subject']} (Status: {task['status']}): " \
                       f"{frappe.utils.get_link_to_form('CE Task Manager', task['name'])}<br>"
            frappe.throw(msg)
            # Rollback transaction
            frappe.db.rollback()
    elif old_doc and old_doc.get('status') == 'Open' and doc.get('status') in ['Close','Cancelled']:
        ""

    else:
        if doc.get('status') in ['Close','Cancelled']:
            ""
            
            