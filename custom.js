jQuery(document).ready(function(){

    //Cookies.set('wa_cart', {}, { expires: 7 });

    var remote_url = 'http://nsw-records.com';
    var remote_url_src = remote_url + '/primo_src';

    function setSessionData($key, $data, $expire = 7){
        Cookies.set($key, $data, { expires: $expire });
    }    
    function getSessionData($key){
        var data = Cookies.getJSON($key);
        return data;
    }
    function removeSessionData($key){
        Cookies.remove($key);
    }    

    


    //$("body").on('click', ".wa_js_buy", function(){
        
        removeSessionData('current_item');
        
        $.ajax({
            type: "GET",
            url: remote_url + "/api/category/NRS-15051-1-15",            
            //dataType: "jsonp",
            //jsonpCallback: "localJsonpCallback",
            success: function(response) {
                console.log(response);                
                if(response){
                    var data = response.data;                        
                    setSessionData('current_item', data);
                    var product_groups = data.product_groups;
                    var popupHtml = '<div class="popup-accordion" id="accordion">';
                        popupHtml +='<a href="" class="close js_popup_close"><img src="'+remote_url_src+'/img/cross.png" alt=""> </a>';
                        popupHtml +='<div class="popup-body">';
                        
                        var product_group_counter = 0;
                        product_groups.forEach(product_group => {                                            
                            var products = product_group.products;
                            product_group_counter++;
                            var open_class = '';
                            if(product_group_counter ==1){
                                open_class = 'open';
                            }

                            popupHtml +=' <div class="card-item js_product_group_container '+open_class+'">';
                                popupHtml +=' <a class="card-link js_product_group_title" data-toggle="collapse" href="#Reading">'+product_group.title+' <span class="js_added_product_counter">(3 Items Added)</span></a>';
                                popupHtml +='<div id="Reading" class="collapse show" data-parent="#accordion">';
                                    popupHtml +='<div class="popup-card-body">';

                                        popupHtml +='<table class="table table-borderless">';
                                        popupHtml +='<thead><tr><th>Item</th><th class="text-center">QTY</th><th class="text-center">Price</th><th class="text-center">Action</th><th class="text-right"></th></tr></thead>';
                                        popupHtml +='<tbody>';  

                                        products.forEach(product=>{
                                            popupHtml +='<tr class="js_product" data-category_id="'+data.id+'" data-product_group_id="'+product_group.id+'" data-product_id="'+product.id+'"><td>'+product.title+'</td><td class="text-center"><form><div class="value-button" id="decrease">-</div><input type="number" class="js_quantity" id="number" value="1"/><div class="value-button" id="increase">+</div></form></td>';
                                            popupHtml +='<td class="text-center">$'+product.price+'</td>';
                                            popupHtml +='<td class="text-center js_product_add_td"><a href="javascript:void(0)" class="js_product_add">+ Add</a></td>';
                                            popupHtml +='<td class="text-right">';
                                                popupHtml +='<img class="js_product_remove" style="display:none" src="'+remote_url_src+'/img/cross.png" alt="">';
                                            popupHtml +='</td></tr>';
                                        });

                                        popupHtml +='</tbody>';                                    
                                        popupHtml +='</table>';

                                    popupHtml +='</div>';
                                popupHtml +='</div>';
                            popupHtml +='</div>';

                        });

                        popupHtml +='</div>';
                        popupHtml +='<div class="popup-footer text-center">';
                            popupHtml +='<button type="button" class="btn btn-continue">Continue Shopping</button><button type="button" class="btn btn-brand">Place order</button>';
                        popupHtml +='</div>';
                        
                    popupHtml +='</div>';
                    
                    $(".wa_js_cart_popup_content").html(popupHtml);
                    $(".wa_js_cart_popup_content").show();

                    eventAfterPopupLoad();
                }
            },
            error: function() {
                console.log("Not Found");
            }
        });      
   //});

   function eventAfterPopupLoad(){
        productGroupTitleEvent();
        productAdd();
        productRemove();  
        
        $(".js_popup_close").on('click', function(e){
            e.preventDefault();
            $(".wa_js_cart_popup_content").html('');
        });
   }
  
   function productGroupTitleEvent(){
        $(".js_product_group_title").on('click', function(e){
            e.preventDefault();
            $(".js_product_group_container").removeClass('open');
            $(this).parent().addClass('open');
        });
   }

   function productAdd(){
        $(".js_product_add").on('click', function(e){
            e.preventDefault();        
            var product_container = $(this).parents('.js_product');
            product_container.find('.js_product_add_td').addClass('added');
            $(this).text('Added');           
            product_container.find('.js_product_remove').show();

            var product_quantity = product_container.find('.js_quantity').val();
            var category_id = product_container.data('category_id');
            var product_group_id = product_container.data('product_group_id');
            var product_id = product_container.data('product_id');

            var current_item = getSessionData('current_item');
            //console.log(current_item);

            var wa_cart = getSessionData('wa_cart');

            if(wa_cart){

                var cart_items = [];
                wa_cart.forEach(cart_category => {

                    if(cart_category.id == category_id){
                        
                        var product_group_in_cart = false;
                        cart_category.product_groups.forEach(cart_product_group => {
                            var prepare_product_groups = cart_category.product_groups;

                            //Product group in a cart
                            if(cart_product_group.id == product_group_id){
                                product_group_in_cart = true;
                                current_item.product_groups.forEach(current_product_group => {
                                    if(current_product_group.id == product_group_id){
                                        var prepare_products = cart_product_group.products;
                                        current_product_group.products.forEach(current_product => {
                                            if(current_product.id == product_id){
                                                var product = {
                                                    id : current_product.id,
                                                    title : current_product.title,
                                                    price : current_product.price,
                                                    quantity: product_quantity
                                                };
                                                prepare_products.push(product);                                                
                                            }
                                        });                                           
                                        prepare_product_groups.products = prepare_products;                                        
                                    }
                                });
                                cart_category.product_groups = prepare_product_groups;
                            }
                        });

                        if(!product_group_in_cart){

                            var prepare_product_groups = cart_category.product_groups;

                            current_item.product_groups.forEach(current_product_group => {
                                if(current_product_group.id == product_group_id){
                                    var prepare_products = [];
                                    var product_group_item = [];
                                    //product_group_item.products = [];
                                    current_product_group.products.forEach(current_product => {
                                        if(current_product.id == product_id){
                                            var product = {
                                                id : current_product.id,
                                                title : current_product.title,
                                                price : current_product.price,
                                                quantity: product_quantity
                                            };
                                            prepare_products.push(product);                                                
                                        }
                                    });      
                                    product_group_item.id = current_product_group.id;
                                    product_group_item.title = current_product_group.title;                                     
                                    product_group_item.products = prepare_products;
                                    prepare_product_groups.push(product_group_item);                                     
                                }
                            });
                                                    
                            cart_category.product_groups = prepare_product_groups;
                        }
                    }

                    cart_items.push(cart_category);
                    setSessionData('wa_cart', cart_items);
                });

            }else{                
                var cart_items = [];
                var prepare_cart_item = {};
                prepare_cart_item.product_groups = [];
                prepare_cart_item.id = current_item.id;
                prepare_cart_item.title = current_item.title;

                var prepare_product_groups = {};    
                current_item.product_groups.forEach(current_product_group => {

                    if(current_product_group.id == product_group_id){
                        var prepare_products = [];
                        current_product_group.products.forEach(current_product => {
                            if(current_product.id == product_id){
                                var product = {
                                    id : current_product.id,
                                    title : current_product.title,
                                    price : current_product.price,
                                    quantity: product_quantity
                                };
                                prepare_products.push(product);
                            }
                        });   
                        prepare_product_groups.id = current_product_group.id;
                        prepare_product_groups.title = current_product_group.title;
                        prepare_product_groups.products = prepare_products;
                    }
                });

                prepare_cart_item.product_groups.push(prepare_product_groups);

                cart_items.push(prepare_cart_item);
                setSessionData('wa_cart', cart_items);
                console.log(prepare_cart_item);                                        
            }  
            
            var wa_cart = getSessionData('wa_cart');
            console.log('wa_cart');   
            console.log(wa_cart);  
           

            // current_item.product_groups.forEach(product_group => {
            //     //console.log(product_group);
            //     product_group.products.forEach(product=>{                    
            //         if(product.id == product_id){
            //             //console.log(current_item);
                        
            //             var wa_cart = getSessionData('wa_cart');
            //             //var new_cart = {};
            //             if(wa_cart){

            //                 var category_in_cart = false;
            //                 wa_cart.forEach(cart_category => {
            //                     new_cart.push(cart_category);
            //                     //console.log(cart_category);
            //                     if(cart_category.id == category_id){
            //                         category_in_cart = true;
            //                         var product_group_in_cart = false;
            //                         // Category In cart
            //                         cart_category.product_groups.forEach(cart_product_group => {
            //                             if(cart_product_group.id == product_group_id){
            //                                 // Product Group in cart
            //                                 product_group_in_cart = true;
                                                                    
            //                                 //cart_items = wa_cart;

            //                                 prepare_products = cart_product_group.products;
            //                                 var products = {
            //                                     id : product.id,
            //                                     title : product.title,
            //                                     price : product.price
            //                                 };
            //                                 prepare_products.push(products);

            //                                 cart_product_group.products = prepare_products;

            //                                 setSessionData('wa_cart', cart_items);   
            //                             }
            //                         });       
                                    
            //                          // Category in cart but Product Group not in cart
            //                         if(!product_group_in_cart){
            //                             cart_items = wa_cart;
            //                             prepare_product_groups = {};                                                                        
            //                             prepare_product_groups.id = product_group.id;
            //                             prepare_product_groups.title = product_group.title;
                                        
            //                             var products = {
            //                                 id : product.id,
            //                                 title : product.title,
            //                                 price : product.price
            //                             };

            //                             prepare_product_groups.products = products;
            //                             cart_items.product_groups = prepare_product_groups;

            //                             setSessionData('wa_cart', cart_items);   
            //                         }
            //                     }
            //                 });

            //                 // Category not in cart
            //                 if(!category_in_cart){
            //                     cart_items = wa_cart;
            //                     var prepare_cart_item = {};
            //                     prepare_cart_item.product_groups = {};
                                
            //                     prepare_cart_item.id = current_item.id;
            //                     prepare_cart_item.title = current_item.title;
    
            //                     prepare_cart_item.product_groups.id = product_group.id;
            //                     prepare_cart_item.product_groups.title = product_group.title;
                                
            //                     var products = {
            //                         id : product.id,
            //                         title : product.title,
            //                         price : product.price
            //                     };
            //                     prepare_cart_item.product_groups.products = products;
    
            //                     cart_items.push(prepare_cart_item);
            //                     setSessionData('wa_cart', cart_items);
            //                 }

            //             }else{
            //                 // Cart is empty
            //                 cart_items = [];
            //                 var prepare_cart_item = {};
            //                 prepare_cart_item.product_groups = {};
                            
            //                 prepare_cart_item.id = current_item.id;
            //                 prepare_cart_item.title = current_item.title;

            //                 prepare_cart_item.product_groups.id = product_group.id;
            //                 prepare_cart_item.product_groups.title = product_group.title;
                            
            //                 var products = {
            //                     id : product.id,
            //                     title : product.title,
            //                     price : product.price
            //                 };
            //                 prepare_cart_item.product_groups.products = products;

            //                 cart_items.push(prepare_cart_item);
            //                 setSessionData('wa_cart', cart_items);

            //                 console.log(prepare_cart_item);                
            //             }
            //         }
            //     });
            // });

             

        });
   }

   function productRemove(){
        $(".js_product_remove").on('click', function(e){
            e.preventDefault();     
            var product_container = $(this).parents('.js_product');   
            product_container.find('.js_product_add_td').removeClass('added');            
            product_container.find('.js_product_add').text('+ Add');
            product_container.find('.js_product_add').text('+ Add');
            product_container.find('.js_product_remove').hide();
        });
   }

});