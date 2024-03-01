# Copyright (c) 2024, samarth uapre and contributors
# For license information, please see license.txt

import frappe
import json
from frappe.utils.nestedset import NestedSet

class CETaskManager(NestedSet):
    def before_save(self):
        if self.lob:
            self.lobs = ",".join([i.get('lob') for i in self.lob])
        if self.team:
            self.teams = ",".join([i.get('team') for i in self.team])  

@frappe.whitelist()
def get_children(doctype, parent, task=None, is_root=False):

    filters = [["docstatus", "<", "2"],["status","!=","Close"]]
    Flag = False
    if task:
        filters.append(["parent_ce_task_manager", "=", task])
    elif parent and not is_root:
        # via expand child
        filters.append(["parent_ce_task_manager", "=", parent])
    else:
        filters.append(['ifnull(`parent_ce_task_manager`, "")', "=", ""]) 
        Flag = True
        print(filters,'fh')

    tasks = frappe.get_list(
        doctype,
        fields=["name as value", "subject as title", "is_group as expandable","age","_assign","creation","owner"],
        filters=filters,
        ignore_permissions=True,
        order_by="name"
    )
    if Flag:
        return permission_check(tasks)

    # return tasks
    return tasks	



def check_task_permission(task_id, user):
    try:
        task = frappe.db.sql("select * from  `tabCE Task Manager` where name = %(id)s", {'id':task_id},as_dict = 1)[0]
        # Check if the user is either assignee or creator of the task
        if task.get('_assign'):
            if user in task.get('_assign') or task.get('owner') == user:
                return True
        else:
            if task.get('owner') == user:
                return True

        return False
    
    except Exception as e:
        return False

def get_all_children(parent_task_id, user):
    all_children = []

    def get_children_recursive(task_id):
        children = frappe.get_list(
            "CE Task Manager",
            fields=["name"],
            filters={"parent_ce_task_manager": task_id, "docstatus": "< 2"},
        )

        for child in children:
            all_children.append(child.name)
            get_children_recursive(child.name)

    get_children_recursive(parent_task_id)

    permitted_tasks = []
    for child_id in all_children:
        if check_task_permission(child_id, user):
            permitted_tasks.append(child_id)

    return permitted_tasks


def permission_check(tasks):
    allowed_task = []
    user = frappe.session.user
    for task in tasks:
        task_id = task.get('value')
        print(task_id)
        if check_task_permission(task_id,user):
            allowed_task.append(task)
        else:
            permitted_task = get_all_children(task_id,user)
            if len(permitted_task):
                allowed_task.append(task)
    return allowed_task
     
     

@frappe.whitelist()
def add_multiple_tasks(data, parent):
    ce_success= []
    data = json.loads(data)
    new_doc = {"doctype": "CE Task Manager", "parent_ce_task_manager": parent if parent != "All Tasks" else ""}

    for d in data:
        if not d.get("subject"):
            continue
        new_doc["subject"] = d.get("subject")
        new_doc['lob'] =[{'lob':i} for i in d.get('lob')]
        new_doc["category"] = d.get("category")
        new_doc['team'] = [{'team':i} for i in d.get('team')]
        print(new_doc)
        new_task = frappe.get_doc(new_doc)
        new_task.insert()
        ce_success.append(new_task.name)

    return ce_success    


import werkzeug  # Import the werkzeug modulev

@frappe.whitelist()
def add_node():
    from frappe.desk.treeview import make_tree_args
    print(frappe.form_dict)
    # Ensure that form_dict is converted to a dictionary
    args = frappe.form_dict
    if isinstance(args, werkzeug.local.LocalProxy):
        # Access the underlying data of the LocalProxy object
        args = args._get_current_object()
    args.update({"name_field": "subject"})
    

    # Convert form_dict to a dictionary using eval
    # args = args.get('data')
    print(type(args))
    args = make_tree_args(**args)
    args['lob'] =eval(args.get('lob'))
    args['team'] = eval(args.get('team'))

    if args.get("parent_ce_task_manager") == "All Tasks":
        args["parent_ce_task_manager"] = None
        args["is_root"] = True
    print(args,type(args))
    frappe.get_doc(args).insert()






def get_tree_data(table_name):
    # Assuming you have a table with lft and rgt columns
    # Replace 'table_name' with the actual table name
    query = """
        SELECT *
        FROM `{table}`
        ORDER BY lft
    """.format(table=table_name)

    # Fetch the data from the database
    tree_data = frappe.db.sql(query, as_dict=True)

    # Process the tree structure
    processed_tree = process_tree(tree_data)

    return processed_tree

def process_tree(tree_data):
    # Initialize an empty dictionary to store the processed tree
    processed_tree = {}
    indexes = {i['name']:i for i in tree_data}
    # Iterate through each node in the tree data
    for node in tree_data:
        # Retrieve node ID and parent ID
        node_id = node.get('name')
        parent_id = node.get('parent_ce_task_manager')

        # Add the node to the processed tree
        processed_tree[node_id] = {
            'name': node.get('name'),
			'subject':node.get('subject'),
            'parent': parent_id,
			'data':node,
			'status':node.get('status')
            # Add other attributes as needed
        }

        # Check if the parent ID exists and add the child to its parent
        if parent_id:
            if parent_id not in processed_tree:
                parent_data = indexes[parent_id]
                processed_tree[parent_id] = {
                    'name': parent_id,
                    'children': [node_id], 
                    'data':parent_data,
                    'status':parent_data.get('status')         
                }
            else:
                processed_tree[parent_id].setdefault('children', []).append(node_id)

    # Return the processed tree
    return processed_tree

@frappe.whitelist()
def prints():
	h = 'tabCE Task Manager'
	tree_data = get_tree_data(h)
	return tree_data

@frappe.whitelist()
def is_assigned_or_created_by_user(doc_type, doc_name, user):
    # Custom logic to check if the user is assigned to or created the CE Task Manager document
    # You need to implement this based on your requirements
    # Example logic:
    value = frappe.db.exists(doc_type, {'name': doc_name, 'owner': user}) or \
            frappe.db.exists(doc_type, {'name': doc_name, '_assign': ['like', f'%{user}%']})
    return value if value else False
