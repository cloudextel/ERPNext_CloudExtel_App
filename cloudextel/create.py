import frappe

from frappe.contacts.address_and_contact import (
	delete_contact_and_address,
	load_address_and_contact,
)

def increment_last_two_digits(string):
    return string[:-2] + str(int(string[-2:]) + 1).zfill(2) if len(string) >= 2 and string[-2:].isdigit() else string

@frappe.whitelist()
def perform_task():
    return
    try:
        sqls = """
        SELECT DISTINCT p.name AS pname
        FROM `tabDocument Naming Rule` AS p
        INNER JOIN `tabDocument Naming Rule Condition` AS c  
        ON c.parent = p.name
        WHERE c.field = 'posting_month' 
        AND c.value = 1
        AND p.document_type = 'Sales Invoice'
        AND SUBSTRING(p.prefix, -4, 2) = '24' 
        AND p.disabled = 0
        """
        desp = frappe.db.sql(sqls, as_dict=1)
        print(desp)

        for row in desp:
            doc = frappe.get_doc('Document Naming Rule', row['pname'])
            new_doc = frappe.new_doc('Document Naming Rule')
            new_doc.conditions = doc.conditions
            new_doc.document_type = doc.document_type
            new_doc.priority = doc.priority
            new_doc.prefix_digits = doc.prefix_digits 
            new_doc.disabled = 1
            
            
            # Modify conditions
            for child in new_doc.conditions:
                if child.field == 'posting_month' and int(child.value) == 1:
                    child.value =  int(child.value)+1

            # Reset counter and increment prefix
            new_doc.counter = 0

            if doc.prefix:
                strig = doc.prefix
                new_doc.prefix = strig[:-2] + str(int(strig[-2:]) + 1).zfill(2) if len(strig) >= 2 and strig[-2:].isdigit() else strig  
            
            # Insert new document and commit changes
            new_doc.insert()
            frappe.db.commit()
    except Exception as e:
        print("Error:", e)



def check():
    do = frappe.get_doc('Supplier','VEN-101614')
    print(frappe.as_json(do))
    load_address_and_contact(do)            





    



