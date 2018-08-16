# -*- coding: utf-8 -*-
##############################################################################
#
#    OpenERP, Open Source Management Solution
#    Copyright (C) 2004-2010 Tiny SPRL (<http://tiny.be>).
#
#    This program is free software: you can redistribute it and/or modify
#    it under the terms of the GNU Affero General Public License as
#    published by the Free Software Foundation, either version 3 of the
#    License, or (at your option) any later version.
#
#    This program is distributed in the hope that it will be useful,
#    but WITHOUT ANY WARRANTY; without even the implied warranty of
#    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#    GNU Affero General Public License for more details.
#
#    You should have received a copy of the GNU Affero General Public License
#    along with this program.  If not, see <http://www.gnu.org/licenses/>.
#
##############################################################################
# import os, sys, subprocess
import logging, subprocess, time, os.path
from openerp import api, models
from openerp.osv import fields, osv
from openerp.tools.translate import _

_logger = logging.getLogger(__name__)


class pos_config(osv.osv):
    _inherit = 'pos.config'
    _columns = {
        'iface_reportbill': fields.boolean('Report Bill', help='Enables Report Bill in the Point of Sale'),
    }
    _defaults = {
        'iface_reportbill': False,
    }

class fiscal_bills(models.Model):
    _name = "posfiscal.fiscal_bills"
    
    path = "C:\Fiskalna\Fiscal32.exe"
    m = "C:\Fiskalna\PF500.IN"
    @api.model
    def report_method(self, t):

    	if os.path.isfile(self.path):
            file = open(self.m, "w+")
            file.write(t) #report
            file.close()   
    	    time.sleep(5)
    	    p=subprocess.call([self.path, self.m])  
        return 
    
    @api.model
    def write_method_cancel(self):
    	if os.path.isfile(self.path):
    	    file = open(self.m, "w+")
    	    file.write(' U1,0000,1\n')
    	return

    @api.model
    def write_method_bill(self):
    	if os.path.isfile(self.path):
    	    file = open(self.m, "w+")
    	    file.write(' 01,0000,1\n')
    	return	

    @api.model
    def bill_method(self, t):
        file = open(self.m, "a") #zapisuvaj vo file
        file.write(t + '\n')
        return 

    @api.model
    def end_cancel_method(self): 	 
    	file = open(self.m, "a") 
    	file.write('$5\n')
    	file.write('%' + 'V' + '\n')
    	file.close()	
    	time.sleep(5)
    	p=subprocess.call([self.path, self.m])  
    	return   

    @api.model
    def end_bill_method(self):
    	file = open(self.m, "a")
    	file.write('$5\n')
    	file.write('%' + '8' + '\n')
    	file.close()
    	time.sleep(5)
    	p=subprocess.call([self.path, self.m])  
    	return	  

    @api.model
    def final_method(self):
    	if os.path.isfile(self.path):
            file = open(self.m, "w+")
            file.write(' E') #krajno
            file.close()
            time.sleep(5)
            p=subprocess.call([self.path, self.m])  
        return 

  




