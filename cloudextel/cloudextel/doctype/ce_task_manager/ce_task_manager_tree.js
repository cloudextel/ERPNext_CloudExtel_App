frappe.provide("frappe.treeview_settings");

frappe.treeview_settings['CE Task Manager'] = {
	get_tree_nodes: "cloudextel.cloudextel.doctype.ce_task_manager.ce_task_manager.get_children",
	add_tree_node: "cloudextel.cloudextel.doctype.ce_task_manager.ce_task_manager.add_node",
	filters: [
		{
			fieldname: "task",
			fieldtype:"Link",
			options: "CE Task Manager",
			label: __("Task"),
			get_query: function() {
				var me = frappe.treeview_settings['CE Task Manager'];
				//var project = me.page.fields_dict.project.get_value();
				var args = [["CE Task Manager", 'is_group', '=', 1]];
				// if(project){
				// 	args.push(["Task", 'project', "=", project]);
				// }
				return {
					filters: args
				};
			}
		}
	],
	breadcrumb: "Projects",
	get_tree_root: false,
	root_label: "All Tasks",
	ignore_fields: ["parent_ce_task_manager"],
	onload: function(me) {
		frappe.treeview_settings['CE Task Manager'].page = {};
		$.extend(frappe.treeview_settings['CE Task Manager'].page, me.page);
		me.make_tree();
		me.page.add_inner_button(
            `<i class="fa fa-list"></i> ${__('View List')}`,
            function() {
                window.open('/app/ce-task-manager/view/list/');
            }
        );
	},
    fields:[{
        fieldtype:'Check', fieldname:'is_group', label:__('Is Group'),
		description: __('Further accounts can be made under Groups, but entries can be made against non-Groups')
    }],
	toolbar: [
		{
			label:__("Add Multiple"),
			condition: function(node) {
				return node.expandable;
			},
			click: function(node) {
				this.data = [];
				const dialog = new frappe.ui.Dialog({
					title: __("Add Multiple Tasks"),
					fields: [
						{
							fieldname: "multiple_tasks", fieldtype: "Table",
							in_place_edit: true, data: this.data,
							get_data: () => {
								return this.data;
							},
							fields: [{
								fieldtype:'Data',
								fieldname:"subject",
								in_list_view: 1,
								reqd: 1,
								label: __("Subject")
							}]
						},
					],
					primary_action: function() {
						dialog.hide();
						// return frappe.call({
						// 	method: "erpnext.projects.doctype.task.task.add_multiple_tasks",
						// 	args: {
						// 		data: dialog.get_values()["multiple_tasks"],
						// 		parent: node.data.value
						// 	},
						// 	callback: function() { }
						// });
                        console.log('heheee')
					},
					primary_action_label: __('Create')
				});
				dialog.show();
			}
		}
	],
	extend_toolbar: true
};
