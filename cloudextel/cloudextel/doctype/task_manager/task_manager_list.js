frappe.listview_settings['Task Manager'] = {
    hide_name_column: true,
    hide_name_filter:true,
    onload: function(listview) {
        function hideAssignedToField() {
            const deleteButton = document.getElementById('deleteButton');
            
            if (deleteButton)deleteButton.style.display = 'none';

            var assignedToFilter = document.querySelector('a[data-fieldname="assigned_to"]');
            if (assignedToFilter) {
                assignedToFilter.style.display = 'none';
            }
            var editFiltersElement = document.querySelector('.add-list-group-by');
            if (editFiltersElement) {
               // editFiltersElement.style.display = 'none';
            }
            var editTagsElement = document.querySelector('.list-tags');
            if (editTagsElement) {
                editTagsElement.style.display = 'none';
            }
        }

        // Initially hide the "Assigned To" field
        hideAssignedToField();


        var userEmail = frappe.session.user;

        // Add custom button to sidebar
        listview.page.add_sidebar_item(__('Assign to Me'), function() {
            // Define the route with filter when the button is clicked
            frappe.set_route('List', 'Task Manager', { 'assignees': ['like', '%' + userEmail + '%'] });
        });
    },
    // onload: function(listview) {

    //     listview.page.add_inner_button(__('Created By Me'), function() {
    //         applyFilters('created-by-me', 'task_owner', frappe.session.user);
    //     });
    //     listview.page.add_inner_button(__('Assigned To Me'), function() {
    //         applyFilters('assigned-to-me', 'assignees', frappe.session.user);
    //     });
    // }
};


// (document.addEventListener('DOMContentLoaded', function() {
//     // Add event listener for "Created By Me" checkbox
//     document.getElementById("created-by-me").addEventListener("change", function() {
//         applyFilters('created-by-me', 'task_owner', frappe.session.user);
//     });

//     // Add event listener for "Assigned To Me" checkbox
//     document.getElementById("assigned-to-me").addEventListener("change", function() {
//         applyFilters('assigned-to-me', 'assignees', frappe.session.user);
//     });
// }))()


// Function to apply filters based on checkbox values
// function applyFilters(checkboxId, fieldname, value) {
//     // Get the checkbox value
//   //  var checked = document.getElementById(checkboxId).checked;

//     // Apply the filter based on the checkbox value
//     var filters = [];
//     if (true) {
//         if(fieldname  == 'assignees')
//         {
//             filters.push(['assignees', 'like', '%' + value + '%']);
//         }else{
//             filters.push([fieldname, '=', value]);
//         }
        
//     }
//     console.log(filters)
//     // Apply the filters to the list view
//     frappe.route_options = { 'filters': filters };
//     frappe.set_route('List', 'Task Manager');
// }


$(document).on('change','.list-group-by-fields', function() {
    var assignedToFilter = document.querySelector('a[data-fieldname="assigned_to"]');
    if (assignedToFilter) {
        assignedToFilter.style.display = 'none';
    }
    console.log('heheh')
});

function applyCustomFilter() {
    // Add your custom filter logic here
    console.log('Custom filter applied');
}