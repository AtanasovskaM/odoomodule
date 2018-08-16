# odoomodule
Odoo module for extending Point of Sale

This module extends Point of Sale module by adding four buttons:
- 'Потврди' which prints the bill with all the selected products 
- 'Сторнирај' is for when a customer wants to return an item/products.
- 'Завршен' can be printed once a day, not more. It gives the all the earnings of the day.
- 'Извештај' shows a new interface where you can pick date from and date to, and on the button 'Печати' in the same interface
the bill machine will print a bill with info about all the earnings in that period.

With every click on the button, the module creates a file named PF500.IN which is in Fiskalna folder. It writes specific letters, numbers and
special characters. After that calls it an .exe file which is in the same folder as the .IN file and with that it gives 
command to the machine to know what kind of bill to print.

It has been tested on Google Chrome and Mozilla.
