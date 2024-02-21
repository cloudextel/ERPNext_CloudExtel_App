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
        fieldtype:'Check', fieldname:'is_group', label:__('Is Parent'),
		description: __('Further Task can be made under Parent, but entries can be made against non-Parent')
    }],
	toolbar: [
		
		
		{
			label:__("Add Multiple"),
			condition: function(node) {
				return node.expandable;
			},
			click: function(node) {
				let me = this
				console.log(me)
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
							},
							{
								fieldtype:'Link',
								fieldname:"lob",
								in_list_view: 1,
								reqd: 1,
								label: __("LOB"),
								options:'CE LOB'
							},
							{
								fieldtype:'Link',
								fieldname:"category",
								in_list_view: 1,
								reqd: 1,
								label: __("Category"),
								options:'CE Category'
							},
							{
								fieldtype:'Link',
								fieldname:"team",
								in_list_view: 1,
								reqd: 1,
								label: __("Team"),
								options:'CE Team'
							}
						]
						},
					],
					primary_action: function() {
						dialog.hide();
						console.log(dialog.get_values())
						return frappe.call({
							method: "cloudextel.cloudextel.doctype.ce_task_manager.ce_task_manager.add_multiple_tasks",
							args: {
								data: dialog.get_values()["multiple_tasks"],
								parent: node.data.value
							},
							callback: function() { 
								// frappe.treeview_settings['CE Task Manager'].get_tree_nodes(node);
								var rebuildButton = document.querySelector('[data-label="Refresh"]');
								// Trigger click event if the button is found
								if (rebuildButton) {
									rebuildButton.click();
								} else {
									console.log("Button not found");
								}
							}
						});
					},
					primary_action_label: __('Create')
				});
				dialog.show();
			}
		}
	],
	extend_toolbar: true
};
