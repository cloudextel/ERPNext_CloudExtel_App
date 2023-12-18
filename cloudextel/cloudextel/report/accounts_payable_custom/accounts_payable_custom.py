# Copyright (c) 2023, samarth uapre and contributors
# For license information, please see license.txt

import frappe
from cloudextel.cloudextel.report.account_receivable_custom.account_receivable_custom import ReceivablePayableReport


def execute(filters=None):
	args = {
		"account_type": "Payable",
		"naming_by": ["Buying Settings", "supp_master_name"],
	}
	return ReceivablePayableReport(filters).run(args)
