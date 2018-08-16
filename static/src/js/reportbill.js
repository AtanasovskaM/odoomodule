function openerp_fiscal_reportbill(instance, module){
    var QWeb = instance.web.qweb;
	var _t = instance.web._t;


    module.ReportBillScreenWidget = module.ScreenWidget.extend({
        template: 'ReportBillScreenWidget',
        show_leftpane:   true,
        back_screen: 'products',


        remove: function(){
            document.getElementById("from").value = ''
            document.getElementById("to").value = ''
            },

        back: function() {
            this.remove();
            this.pos_widget.screen_selector.set_current_screen(this.back_screen);
            },  
        

        show: function(){

            this._super();
            var self = this;    


            
            this.add_action_button({
                    label: _t('Back'),
                    icon: '/pos_fiscal_bill/static/src/img/icons/png48/go-previous.png',
                    click: function(){  
                        self.back();
                    },
                });
            
            //dodavanje na polinja za datum  
            document.getElementById("from").value = ''
            document.getElementById("to").value = ''
            
            $("#from").datepicker({
                inline: true,
                showOtherMonths: true,
                dateFormat:"dd-mm-yy",
            });
         
            
            $("#to").datepicker({
                inline: true,
                showOtherMonths: true,
                dateFormat:"dd-mm-yy",
            }); 


            this.add_action_button({
                    label: _t('Print'),
                    name: 'report',
                    icon: '/pos_fiscal_bill/static/src/img/icons/png48/report1.png',
                    click: function(){
                        var fromDate = $("#from").val();
                        var fromFormat = fromDate.substr(0, 2) + fromDate.substr(3, 2) + fromDate.substr(8,2);                  
                        var toDate = $("#to").val();                      
                        var toFormat = toDate.substr(0, 2) + toDate.substr(3, 2) + toDate.substr(8,2);
                        var t = "%O" + fromFormat + "," + toFormat;
                        var model = new instance.web.Model("posfiscal.fiscal_bills");
                        model.call("report_method", [t], {context: new instance.web.CompoundContext()}).then(function(result) {                       
                        });
                       
                        
                    },
            });         

        }
                
    });

    module.PosWidget.include({
        build_widgets: function(){
            var self = this;
            this._super();

            if(this.pos.config.iface_reportbill){
                this.reportbill_screen = new module.ReportBillScreenWidget(this,{});
                this.reportbill_screen.appendTo(this.$('.screens'));
                this.screen_selector.add_screen('reportbill',this.reportbill_screen);

                var reportbill = $(QWeb.render('ReportBillButton'));

                reportbill.click(function(){
                    
                      self.pos_widget.screen_selector.set_current_screen('reportbill');
                    
                })
                
                reportbill.appendTo(this.$('.control-buttons'));
                this.$('.control-buttons').removeClass('oe_hidden');
            }
        },
    });
}
