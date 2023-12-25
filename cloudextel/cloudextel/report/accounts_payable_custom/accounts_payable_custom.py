# Copyright (c) 2023, samarth uapre and contributors
# For license information, please see license.txt

import frappe
from cloudextel.cloudextel.report.account_receivable_custom.account_receivable_custom import ReceivablePayableReport


def execute(filters=None):
	print(filters)
	args = {
		"account_type": "Payable",
		"naming_by": ["Buying Settings", "supp_master_name"],
	}
	return ReceivablePayableReport(filters).run(args)

def customcheck(filters=None,comp=None):
	if not filters:
		filters = {'report_date': '2023-12-01', 'ageing_based_on': 'Due Date', 'range1': 30, 'range2': 60, 'range3': 90, 'range4': 120, 'zone': [], 'ward': [], 'territory': [], 'temp_asset': [], 'telecom_region': [], 'telecom_circle': [], 'site_id': [], 'city': [], 'party': []}
	args = {
		"account_type": "Payable",
		"naming_by": ["Buying Settings", "supp_master_name"],
	}
	col,data,p,c,o,p =  ReceivablePayableReport(filters).run(args)
	t =0
	cnt = 0
	li = []
	comp =comp if comp else 'Excel Telesonic India Private Limited'
	for i in data:
		if i['company'] == comp:
			t +=float(i['outstanding'])
			li.append(str(i['voucher_no'])+"-"+ str(i['party']))
			cnt+=1

	print(len(data),p,t,cnt)
	from erpnext.accounts.report.accounts_receivable.accounts_receivable import ReceivablePayableReport as ReceiveP
	filters['company']=comp
	col1,da,p1,c1,o1,p1 = ReceiveP(filters).run(args)
	t1 =0
	li1 =[]
	for i in da:
			t1 +=float(i['outstanding'])
			li1.append(str(i['voucher_no'])+"-"+ str(i['party']))
	print(len(da),p1,t1,t == t1)
	s = [ i for i in li1 if i not in li]
	ps = [ i for i in li if i not in li1]
	print("LIIII",len(s),s,len(ps),ps)


