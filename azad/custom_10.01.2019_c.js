$(document).ready(function(){

    //Cookies.set('wa_cart', {}, { expires: 7 });
    removeSessionData('wa_cart');


    var remote_url = 'https://nsw-records.webmascot.com.au';
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

            var id = product_container.data('id');
            var identifier = product_container.data('identifier');
            var identifier_title = product_container.data('identifier_title');
            var product_group_id = product_container.data('product_group_id');
            var category_id = product_container.data('product_group_category_id');
            var category_title = product_container.data('product_group_category_title');
            var product_id = product_container.data('product_id');
            var product_title = product_container.data('product_title');
            var product_price = product_container.data('product_price');
            var product_quantity = product_container.find('.js_quantity').val();

            var newAddedItem =  [
                {
                    id: id,
                    identifier: identifier,
                    title: identifier_title,
                    product_groups: [
                        {
                            id: product_group_id,
                            category_id: category_id,
                            title: category_title,
                            products: [
                                {
                                    id: product_id,
                                    title: product_title,
                                    price: product_price,
                                    quantity: product_quantity
                                }
                            ]
                        },

                    ]
                }
            ];

            addNewItemToCart(newAddedItem);

        });
    }

    function addNewItemToCart(item_data) {
        //removeSessionData('wa_cart');
        var wa_cart = getSessionData('wa_cart');
        /*var newAddedItem =  [
            {
                id: id,
                identifier: identifier,
                title: identifier_title,
                product_groups: [
                    {
                        id: product_group_id,
                        category_id: category_id,
                        title: category_title,
                        products: [
                            {
                                id: product_id,
                                title: product_title,
                                price: product_price,
                                quantity: product_quantity
                            }
                        ]
                    },

                ]
            }
        ];*/

        if(wa_cart){
            console.log('found');
            var is_identifier_exist = false;
            var is_category_exist = false;
            var is_product_exist = false;

            $.each(wa_cart, function (identifier_index, identifier_data) { //identifier block
                console.log('identifier_data', identifier_data);
                if(identifier_data.identifier == item_data[0].identifier ){
                    is_identifier_exist = true;
                    is_category_exist = false;
                    $.each(identifier_data.product_groups, function (product_group_index, product_group_data) { //product_group block
                        console.log('product_groups', product_group_data);

                        if(product_group_data.id == item_data[0].product_groups[0].id ){
                            is_category_exist = true;
                            is_product_exist = false;

                            $.each(product_group_data.products, function (products_index, products_data) { //products block
                                console.log('products', products_data);
                                if(products_data.id == item_data[0].product_groups[0].products[0].id ){
                                    is_product_exist = true;
                                    wa_cart[identifier_index].product_groups[product_group_index].products[products_index] = item_data[0].product_groups[0].products[0];
                                }
                            });

                            if(!is_product_exist){ //add new product
                                wa_cart[identifier_index].product_groups[product_group_index].products.push(item_data[0].product_groups[0].products[0]);
                            }
                        }
                    });

                    if(!is_category_exist){  //add new category data to cart
                        wa_cart[identifier_index].product_groups.push(item_data[0].product_groups[0]);
                    }
                }
            });

            if(!is_identifier_exist){ //add new identifier data to cart
                wa_cart.push(item_data[0]);
            }

            setSessionData('wa_cart', wa_cart);
        }else{
            console.log('not found');
            setSessionData('wa_cart', item_data);
        }

        removeNullProductFromCart();
        console.log('final cart',getSessionData('wa_cart'));

    }

    function productRemove(){
        $(".js_product_remove").on('click', function(e){
            e.preventDefault();
            var product_container = $(this).parents('.js_product');
            product_container.find('.js_product_add_td').removeClass('added');
            product_container.find('.js_product_add').text('+ Add');
            product_container.find('.js_product_add').text('+ Add');
            product_container.find('.js_product_remove').hide();

            var input_field = $('#input_'+$(this).closest('tr').attr('id'));
            if(parseInt(input_field.val()) > 0){
                input_field.val(0);
            }

            /***********/
            var product_container = $(this).parents('.js_product');
            var id = product_container.data('id');
            var identifier = product_container.data('identifier');
            var identifier_title = product_container.data('identifier_title');
            var product_group_id = product_container.data('product_group_id');
            var category_id = product_container.data('product_group_category_id');
            var category_title = product_container.data('product_group_category_title');
            var product_id = product_container.data('product_id');
            var product_title = product_container.data('product_title');
            var product_price = product_container.data('product_price');
            var product_quantity = product_container.find('.js_quantity').val();

            var removeItem =  [
                {
                    id: id,
                    identifier: identifier,
                    title: identifier_title,
                    product_groups: [
                        {
                            id: product_group_id,
                            category_id: category_id,
                            title: category_title,
                            products: [
                                {
                                    id: product_id,
                                    title: product_title,
                                    price: product_price,
                                    quantity: product_quantity
                                }
                            ]
                        },

                    ]
                }
            ];

            removeItemFromCart(removeItem);
        });
    }

    function removeItemFromCart(item_data) {
        //removeSessionData('wa_cart');
        var wa_cart = getSessionData('wa_cart');
        if(wa_cart){
            console.log('found');
            var is_identifier_exist = false;
            var is_category_exist = false;
            var is_product_exist = false;

            $.each(wa_cart, function (identifier_index, identifier_data) { //identifier block
                console.log('identifier_data', identifier_data);
                if(identifier_data.identifier == item_data[0].identifier ){
                    is_identifier_exist = true;
                    is_category_exist = false;
                    $.each(identifier_data.product_groups, function (product_group_index, product_group_data) { //product_group block
                        console.log('product_groups', product_group_data);

                        if(product_group_data.id == item_data[0].product_groups[0].id ){
                            is_category_exist = true;
                            is_product_exist = false;

                            $.each(product_group_data.products, function (products_index, products_data) { //products block
                                console.log('products', products_data);
                                if(products_data.id == item_data[0].product_groups[0].products[0].id ){
                                    is_product_exist = true;
                                    wa_cart[identifier_index].product_groups[product_group_index].products.splice(products_index, 1);
                                }
                            });

                        }
                    });

                }
            });

            setSessionData('wa_cart', wa_cart);
        }

        removeNullProductFromCart();
        console.log('final cart',getSessionData('wa_cart'));
    }

    function removeNullProductFromCart() {
        var wa_cart = getSessionData('wa_cart');
        if (wa_cart) {
            $.each(wa_cart, function (identifier_index, identifier_data) { //identifier block
                $.each(identifier_data.product_groups, function (product_group_index, product_group_data) { //product_group block
                    if(product_group_data.products.length == 0){
                        wa_cart[identifier_index].product_groups.splice(product_group_index, 1);
                    }
                });
            });

            $.each(wa_cart, function (identifier_index, identifier_data) { //identifier block
                if(identifier_data.product_groups.length == 0){
                    wa_cart.splice(identifier_index, 1);
                }
            });

            setSessionData('wa_cart', wa_cart);
        }
    }

    function incItem(){
        $(".increase_item_qty").on('click', function(e) {
            e.preventDefault();
            var input_field = $('#input_'+$(this).closest('tr').attr('id'));
            input_field.val( parseInt(input_field.val()) +1 );
        });
    }

    function decItem(){
        $(".decrease_item_qty").on('click', function(e) {
            e.preventDefault();
            var input_field = $('#input_'+$(this).closest('tr').attr('id'));
            if(parseInt(input_field.val()) > 0){
                input_field.val( parseInt(input_field.val()) -1 );
            }
        });
    }

    function eventAfterPopupLoad(){
        productGroupTitleEvent();
        productAdd();
        productRemove();
        incItem();
        decItem();

        $(".js_popup_close").on('click', function(e){
            e.preventDefault();
            $(".wa_js_cart_popup_content").html('');
        });
    }

    /****Start main operation****/
    //$("body").on('click', ".wa_js_buy", function(){
    //removeSessionData('wa_cart');

    removeSessionData('current_item');
    $.ajax({
        type: "GET",
        url: remote_url + "/api/category/1",
        //dataType: "jsonp",
        //jsonpCallback: "localJsonpCallback",
        success: function(response) {
            console.log('remote_response',response);
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
                    popupHtml +=' <a class="card-link js_product_group_title" data-toggle="collapse" href="#Reading" >'+product_group.title+' <span class="js_added_product_counter" id="selected_group_item_'+product_group.id+'">(3 Items Added)</span></a>';                                popupHtml +='<div id="Reading" class="collapse show" data-parent="#accordion">';
                    popupHtml +='<div class="popup-card-body">';

                    popupHtml +='<table class="table table-borderless">';
                    popupHtml += '<thead>' +
                        '<tr>' +
                        '<th>Item</th>' +
                        '<th class="text-center">QTY</th>' +
                        '<th class="text-center">Price</th>' +
                        '<th class="text-center">Action</th>' +
                        '<th class="text-right"></th>' +
                        '</tr>' +
                        '</thead>';
                    popupHtml +='<tbody>';

                    products.forEach(product=>{
                        var tr_id = data.id+'_'+product_group.id+'_'+product.id;
                        var input_id = 'input_'+data.id+'_'+product_group.id+'_'+product.id;

                        popupHtml +='<tr class="js_product" id="'+tr_id+'"' +
                            'data-id="'+data.id+'" ' +
                            'data-identifier="'+data.identifier+'"' +
                            'data-identifier_title="'+data.title+'"' +
                            'data-category_id="'+data.id+'"' +
                            'data-product_group_id="'+product_group.id+'" ' +
                            'data-product_group_category_id="'+product_group.category_id+'" ' +
                            'data-product_group_category_title="'+product_group.title+'" ' +
                            'data-product_id="'+product.id+'"' +
                            'data-product_title="'+product.title+'"' +
                            'data-product_price="'+product.price+'"' +
                            '>' +

                            '<td>'+product.title+'</td>' +
                            '<td class="text-center">' +
                            // '<div>' +
                            '<div class="value-button decrease_item_qty" id="decrease">-</div>' +
                            '<input type="text" class="js_quantity" id="'+input_id+'" value="1" readonly/>' +
                            '<div class="value-button increase_item_qty" id="increase">+</div>' +
                            // '</div>' +
                            '</td>';
                        popupHtml +='<td class="text-center">$'+product.price+'</td>';
                        popupHtml +='<td class="text-center js_product_add_td">' +
                            '<a href="javascript:void(0)" class="js_product_add">+ Add</a>' +
                            '</td>';
                        popupHtml +='<td class="text-right">';
                        //popupHtml +='<img class="js_product_remove" style="display:none" src="'+remote_url_src+'/img/cross.png" alt="">';
                        popupHtml +='<a href="javascript:void(0)" class="js_product_remove" style="display:none">x</a>';
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
                popupHtml +='<button type="button" class="btn btn-continue">Continue Shopping</button>' +
                    '<button type="button" class="btn btn-brand">Place order</button>';
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
    /****End main operation****/


});