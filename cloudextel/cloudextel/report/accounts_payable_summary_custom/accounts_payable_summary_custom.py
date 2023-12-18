# Copyright (c) 2023, samarth uapre and contributors
# For license information, please see license.txt

import frappe
from cloudextel.cloudextel.report.account_receivable_summary_custom.account_receivable_summary_custom import (AccountsReceivableSummary)

def execute(filters=None):
	args = {
		"account_type": "Payable",
		"naming_by": ["Buying Settings", "supp_master_name"],
	}
	return AccountsReceivableSummary(filters).run(args)

