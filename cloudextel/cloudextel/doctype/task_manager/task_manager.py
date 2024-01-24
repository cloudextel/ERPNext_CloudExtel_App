# Copyright (c) 2024, samarth uapre and contributors
# For license information, please see license.txt

import frappe
from frappe.utils.data import today, getdate,date_diff

from frappe.model.document import Document

class TaskManager(Document):
	# def on_update(self):
	# 	dirty_fields = self.get_dirty_fields()
	# 	if "comments" in dirty_fields:
	# 		frappe.msgprint("Trigger: Comment Added")

	def before_save(self):
		if getdate(self.due_date) < getdate(today()):
			self.age = date_diff(getdate(today),getdate(self.due_date))
		else:
			self.age = 0	

