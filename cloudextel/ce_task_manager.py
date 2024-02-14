import frappe
from frappe.utils.data import getdate,today



workflow_conditions = {
    'Open':['Working','Cancelled'],
    'Working':['Close','Hold','Cancelled'],
    'Close':[],
    'Hold':['Open'],
    'Cancelled':['Open']
}



def add_comment(doc_type,doc_name,comment_text,c_type=None):
    # Create a new comment
    comment = frappe.get_doc({
        'doctype': 'Comment',
        'comment_type': 'Comment',
        'reference_doctype': doc_type,
        'reference_name': doc_name,
        'content': comment_text,
        'comment_by': frappe.session.user,
        'comment_type': c_type or 'Comment'
    })

    # Save the comment
    comment.insert()


def generate_comment_text(old,new):
    return "Status of Task is Changed From <b>{}</b>  to <b>{}</b>".format(old,new)


def validate_states(old,new):
    _next_valid_states = workflow_conditions[old]
    if new not in _next_valid_states:
        frappe.throw("""Changing Status From <b>{old}</b> to <b>{new}</b> is not Allowed!
                      <br> next valid State for {old} is <b> {state}</b>""".format(old=old,new=new,state=",".join(_next_valid_states)))


def check_conditions(doc, method):
    old_doc = doc.get_doc_before_save()

    if old_doc and  old_doc.get('status') != doc.get('status'):
        validate_states(old_doc.get('status'),doc.get('status'))

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

    if old_doc and old_doc.get('status') != doc.get('status'):
        comment_text =  generate_comment_text(old_doc.get('status'),doc.get('status'))   
        add_comment(doc_type='CE Task Manager',doc_name=doc.name,comment_text=comment_text,c_type='Workflow')
        if doc.get('status') =='Working':
            doc.actual_start_date = getdate(today())
        elif doc.get('status') == 'Close':
            doc.actual_end_date = getdate(today())                 
            