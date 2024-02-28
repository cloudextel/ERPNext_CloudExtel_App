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
                window.location.href = '/app/ce-task-manager/view/list/';
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
							in_place_edit: true,
							data: [],
							get_data: function() {
								// Get the data from the table rows
								return this.data.map(row => ({
									subject: row.subject,
									lob: Array.isArray(row.lob) ? row.lob.join(", ") : row.lob, // Join multiselect values into a string
									team: Array.isArray(row.team) ? row.team.join(", ") : row.team, // Join multiselect values into a string
									category: row.category
								}))},
							fields: [{
								fieldtype:'Data',
								fieldname:"subject",
								in_list_view: 1,
								reqd: 1,
								label: __("Subject")
							},
							{
								fieldtype:'MultiSelectList',
								fieldname:"lob",
								in_list_view: 1,
								reqd:1,
								label: __("LOB"),
								options:'CE LOB',
								get_data: function(txt) {
									return frappe.db.get_link_options('CE LOB', txt);
								},
								change: function(value, row_idx, fieldname) {
                                    // Set the selected value to the table data
									console.log(this,this.data)
                                   this.doc['lob'] = this.values
                                }
							},
							{
								fieldtype:'MultiSelectList',
								fieldname:"team",
								in_list_view: 1,
								reqd: 1,
								label: __("Team"),
								options:'CE Team',
								get_data: function(txt) {
									return frappe.db.get_link_options('CE Team', txt);
								},
								change: function(value) {
                                    // Set the selected value to the table data
									console.log(this.values)
                                    this.doc['team'] = this.values
                                }
							},
							{
								fieldtype:'Link',
								fieldname:"category",
								in_list_view: 1,
								reqd: 1,
								label: __("Category"),
								options:'CE Category'
							},
							
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
	extend_toolbar: true,
	get_label: function(node) {
        let label = node.label;
        if (node.label != 'All Tasks') {
			let creationDate = new Date(node.data.creation);
			let options = {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                hour12: true // Enable AM/PM
            };
            let formattedCreationDate = creationDate.toLocaleDateString('en-GB', options);
			_assign_to = JSON.parse(node.data._assign || "[]")
			if(_assign_to){
				_assign_to = _assign_to.map((u)=>frappe.user_info(u))
			}
			console.log(_assign_to)

            let d_label = "<b>Created By : </b>" + node.data.owner + "<br> " + "<b> Created On :</b>" + formattedCreationDate + "<br> <b>Task Assignees: </b>" + (_assign_to ? _assign_to.map(u => u.fullname).join(",") : [])
            // Set title attribute with HTML content for hover tooltip
            node.$tree_link.attr({
                'title': d_label,
                'data-toggle': 'tooltip',
				'data-placement':"top",
                'data-html': 'true',
				'type':'button'
            });

			label = node.title + " (" + node.label + ")" + '<b> Age : ' + node.data.age + '</b>';
            // Initialize Bootstrap tooltip with customized options
            $('[data-toggle="tooltip"]').tooltip({
                template: '<div class="tooltip custom-tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
                trigger: 'hover'
            });

				// label += `<div class="label-extra-info" style="display: inline-block; margin-left: 10px; float:right">
            //                 <div style="display: inline-block;">${_assign_to ? _assign_to.map((d) => d.fullname).join(", ") : ""}</div>
            //             </div>`;
        }
        return label;
    }
};