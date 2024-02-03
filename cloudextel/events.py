import frappe

def apply_custom_filter_to_task_manager(user):
    print(user, frappe.session.user)
    if not user:
        user = frappe.session.user

    if user.lower() == 'administrator':
        return    

    # Construct the filter condition securely using frappe.db.escape()
    user_escaped = frappe.db.escape(user)

    # Corrected query with proper placeholders and structure
    query = """
        (`tabTask Manager`.task_owner = {user} OR {user} IN (`tabTask Manager`.assignees))
    """.format(user=user_escaped)

    return query
