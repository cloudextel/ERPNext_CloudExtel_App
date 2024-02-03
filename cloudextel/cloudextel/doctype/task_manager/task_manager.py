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
		if not self.task_owner:
			self.task_owner = frappe.session.user

		if not self.start_date:
			self.start_date = frappe.utils.today()

		if getdate(self.due_date) < getdate(today()):
			self.age = date_diff(getdate(today),getdate(self.due_date))
		else:
			self.age = 0	
		if self.assign_to:
			self.assignees = ",".join([i.user for i in self.assign_to])	

