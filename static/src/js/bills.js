function openerp_fiscal_bills(instance, module){
    var QWeb = instance.web.qweb;
	var _t = instance.web._t;

    module.showButtons = instance.point_of_sale.ActionBarWidget.include({
        add_new_button: function(button_options){
                var button = new instance.point_of_sale.ActionButtonWidget(this,button_options); 

                if(!(button_options.name == 'validation')){
                    button.appendTo(this.$('.pos-actionbar-button-list'));
                    this.button_list.push(button);  
                    }
                return button;
        },
    });

	module.PaymentScreenWidgetInherit = module.PaymentScreenWidget.include({
        

        final_bill: function() {
            var self = this;
            var model = new instance.web.Model("posfiscal.fiscal_bills");
            model.call("final_method", {context: new instance.web.CompoundContext()}).then(function(result) {
               });
        },
       
        get_tax_name: function(){
            var currentOrder = this.pos.get('selectedOrder');
            var details = {};
            var fulldetails = [];
            var orderlines = currentOrder.get('orderLines').models;
            for (var i = 0; i < orderlines.length; i++) {            
            var ldetails = orderlines[i].get_tax_details();;
             }
             
            for(var id in ldetails){
                if(ldetails.hasOwnProperty(id)){
                    details[id] = (details[id] || 0) + ldetails[id];
                }
            }
            for(var id in details){
                if(details.hasOwnProperty(id)){
                    fulldetails.push(this.pos.taxes_by_id[id].name);
                }
            }

            return fulldetails;
        },

	    show: function(){  
	        var self = this;
            this._super();	

            var currentOrder = this.pos.get('selectedOrder');
            this.add_action_button({
                    label: _t('Validate'),
                    name: 'validate',
                    icon: '/pos_fiscal_bill/static/src/img/icons/png48/validate.png',
                    click: function(){
                        var counter = 0;
                        var price, quantity, productName, taxName, DDV;
                        var orderlines = currentOrder.get('orderLines').models;
                        var model = new instance.web.Model("posfiscal.fiscal_bills");
                        model.call("write_method_bill", {context: new instance.web.CompoundContext()}).then(function(result) {                       
                            });
                        for (var i = 0; i < orderlines.length; i++) { 
                            singlePrice = orderlines[i].get_unit_price();
                            quantity = orderlines[i].get_quantity_str_with_unit();
                            productName = orderlines[i].get_product().display_name;
                            taxName = self.get_tax_name();
                            var model = new instance.web.Model("posfiscal.fiscal_bills");
                            var t = {}
                            if (taxName == "DDV 18%") {
                                DDV = "А";
                            } else if (taxName == "DDV 5%") {
                                DDV = "Б";
                            } else {
                                DDV = "В";
                            
                            }
                                       
                            if (counter % 2 == 0) {
                            t = "`1" + productName + "\t" + DDV + singlePrice.toFixed(2) + "*" + quantity;                        
                            model.call("bill_method", [t], {context: new instance.web.CompoundContext()}).then(function(result) {                       
                            });           
                            } else {
                            t = " 1" + productName + "\t" + DDV + singlePrice.toFixed(2) + "*" + quantity;
                            model.call("bill_method", [t], {context: new instance.web.CompoundContext()}).then(function(result) {                       
                            });     
                                                                                                                                           
                           }
                           counter += 1;  
                           }                          
                     

                        setTimeout(function(){ 
                            model.call("end_bill_method", {context: new instance.web.CompoundContext()}).then(function(result) {                       
                            });
                           //window.open("key:","_self");
                        }, 3000);
                           self.validate_order();
                       
                                                                          
                },
        
            });              

	        this.add_action_button({
                label: _t('Cancel bill'),
                name: 'cancel',
                icon: '/pos_fiscal_bill/static/src/img/icons/png48/cancel.png',
                    
                click: function(options){

                        var counter = 0;
                        var price, quantity, productName, taxName, DDV;
                        var orderlines = currentOrder.get('orderLines').models;
                        var model = new instance.web.Model("posfiscal.fiscal_bills");
                        model.call("write_method_cancel", {context: new instance.web.CompoundContext()}).then(function(result) {                       
                            });
                        for (var i = 0; i < orderlines.length; i++) { 
                            price = orderlines[i].get_unit_price();
                            singlePrice = parseInt(price.toString().replace('-', ''));
                            quantity = orderlines[i].get_quantity_str_with_unit();
                            productName = orderlines[i].get_product().display_name;
                            taxName = self.get_tax_name();
                            var model = new instance.web.Model("posfiscal.fiscal_bills");

                            if (taxName == "DDV 18%") {
                                DDV = "А";
                            } else if (taxName == "DDV 5%") {
                                DDV = "Б";
                            } else {
                                DDV = "В";                    
                            }

                        if (counter % 2 == 0) {
                            t = "#1" + productName + "\t" + DDV + singlePrice.toFixed(2) + "*" + quantity;                        
                            model.call("bill_method", [t], {context: new instance.web.CompoundContext()}).then(function(result) {                       
                            });           
                            } else {
                            t = " 1" + productName + "\t" + DDV + singlePrice.toFixed(2) + "*" + quantity;
                            model.call("bill_method", [t], {context: new instance.web.CompoundContext()}).then(function(result) {                       
                            });     
                                                                                                                                           
                           }
                           counter += 1;   
                           }
                       
                           model.call("end_cancel_method", {context: new instance.web.CompoundContext()}).then(function(result) {                       
                            });
                            
                        setTimeout(function(){ 
                           self.validate_order();
                        }, 1000);
                       
                                                                          
                },
        
       
            });


            this.add_action_button({
                    label: _t('Final'),
                    name: 'final',
                    icon: '/pos_fiscal_bill/static/src/img/icons/png48/final2.png',
                    click: function(){
                        self.final_bill();                                            
                         },
            });              
	    },
    });
         
}


    