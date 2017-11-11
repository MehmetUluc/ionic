
// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< All below services are used for coupon >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//========================================================================================================
//=============================== service to calculate line items total ==============================
ecommerce.service('lineItemTotalService', function () {
  return function (lineItems) {
    var total = 0;
    lineItems.some(function (value, index) {
     // console.log(value);
      var subtotal = parseFloat(value.total);
      total = total + subtotal;
    });

    return total;
  }
});
//========================================================================================================
//=============================== service to calculate line items total ==============================
ecommerce.service('checkOnSaleService', function () {
  return function (lineItems, coupon) {

    if (coupon.exclude_sale_items == 0 || coupon.exclude_sale_items == '')
      return false;

    var found = false;
    lineItems.some(function (value, index) {
      if (value.on_sale == true)
        found = true;
    });

    if (found == true && coupon.discount_type == 'fixed_cart')
      return true;
    else if (found == true && coupon.discount_type == 'percent')
      return true;
    else
      return false;

  }
});
//========================================================================================================
//=============================== service to calculate line items total ==============================
ecommerce.service('emailCheckService', function ($rootScope) {
  return function (emailList) {

    if (emailList.length == 0) return false;

    var found = false;
    emailList.some(function (value, index) {
      if (value == $rootScope.customerData.customers_email_address) {
        found = true;
        return true;
      }
    });
    return found;
  }
});
//========================================================================================================
//=============================== service to calculate line items total ==============================
ecommerce.service('checkCategoriesService', function () {
  return function (value, coupon) {

    if (coupon.product_categories.length == 0 && coupon.excluded_product_categories.length == 0)
      return true;

    var categoryId = value.categories_id;
    var found = 0;

    coupon.product_categories.some(function (y, index2) {
      /// console.log("product_categories x = " + x.id + " y=" + y);
      if (categoryId == y) { found++; }
    });

    if (coupon.product_categories.length == 0) {
      found++;
    }

    var found2 = 0;
    //for excluded categries
    coupon.excluded_product_categories.some(function (y, index2) {
      // console.log("excluded_product_categories x = " + x.id + " y=" + y);
      if (categoryId == y) { found2++; }
    });
    //  console.log('found ' + found + ' found2 ' + found2);

    if (found != 0 && found2 == 0)
      return true;
    else
      return false;
  }
});
//========================================================================================================
//=============================== service to calculate line items total ==============================
ecommerce.service('couponApplyOnProductService', function () {
  return function (value, coupon) {
    if (coupon.product_ids.length == 0 && coupon.exclude_product_ids.length == 0)
      return true;

    var id = value.products_id;
    var found = 0;
    //checking in allowed products
    coupon.product_ids.some(function (value, index) {
      //  console.log("id = " + id + "vid" + vId + " value =" + value);
      if (id == value) {
        found++;
        return true;
      }
    });
    if (coupon.product_ids.length == 0) {
      found++;
    }

    var found2 = 0;
    //checking in excluded products
    coupon.exclude_product_ids.some(function (value, index) {
      if (id == value) {
        found2++;
        return true;
      }
    });
    // console.log('found ' + found + ' found2 ' + found2);
    if (found != 0 && found2 == 0) {
      return true;
    }
    else
      return false;
  }
});
//========================================================================================================
//=============================== service to calculate line items total ==============================
ecommerce.service('checkAlreadyAppliedService', function () {
  return function (coupon, couponLines) {
    if (couponLines.length == 0) return false;
    var found = false;
    couponLines.some(function (value, index) {
      if (value.code == coupon.code)
        found = true;
    });
    return found;
  }
});
//========================================================================================================
//=============================== service to calculate line items total ==============================
ecommerce.service('checkUserUsageService', function ($rootScope) {
  return function (coupon) {
    if (coupon.used_by == '') return false;
    if (coupon.usage_limit == 0 && coupon.usage_limit_per_user == 0) return false;

    if (coupon.usage_limit == 0);
    else if (coupon.usage_count >= coupon.usage_limit) return true;
    //console.log($rootScope.customerData);
    var id = $rootScope.customerData.customers_email_address;

    if ($rootScope.customerData != null)
      var id2 = $rootScope.customerData.customers_id;

    var count = 0;
    coupon.used_by.some(function (value, index) {
      if (value == id || value == id2) count++;
    });
    if (count >= coupon.usage_limit_per_user)
      return true;
    else
      return false;
  }
});
//========================================================================================================
//=============================== service to check ==============================
ecommerce.service('checkNoItemInCartService', function () {
  return function (lineItems, coupon) {

    var productIds = coupon.product_ids;
    var ExProductIds = coupon.exclude_product_ids;
    var pCategory = coupon.product_categories;
    var ExPCategory = coupon.excluded_product_categories;

    if (productIds.length == 0 && ExProductIds.length == 0 && pCategory.length == 0 && ExPCategory.length == 0)
      return true;
    var pFound = 0;
    var ExPfound = 0;
    var result = false;
    //checking in products ids
    if (productIds.length != 0) {
      lineItems.some(function (x) {//upper loop
        var id = x.products_id; var vId = -1;
        if (x.variation_id != undefined) vId = x.variation_id;
        productIds.some(function (y) {//lower loop
          if (id == y || vId == y) { result = true; }
        });
      });
    } else { result = true; }

    //checking in excluded products ids
    if (ExProductIds.length != 0) {
      lineItems.some(function (x) {//upper loop
        var id = x.products_id; var vId = -1;
        if (x.variation_id != undefined) vId = x.variation_id;
        ExProductIds.some(function (y) {//lower loop
          if (id == y || vId == y) { result = false; }
        });
      });
    }
    var result2 = false;

    //checking in products categories
    if (pCategory.length != 0) {
      lineItems.some(function (w) {//upper loop
        w.categories.some(function (x) {//midddle loop
          pCategory.some(function (y) {//lower loop
            // console.log("x " + x.id + " y " + y);
            if (x.id == y) { result2 = true; }
          });
        });
      });
    } else { result2 = true; }


    if (ExPCategory.length != 0) {
      lineItems.some(function (w) {//upper loop
        w.categories.some(function (x) {//midddle loop
          ExPCategory.some(function (y) {//lower loop
            // console.log("x " + x.id + " y " + y);
            if (x.id == y) { result2 = false; }
          });
        });
      });
    }

    //console.log("result " + result + " result2 " + result2);
    if (result == true && result2 == true && coupon.discount_type != 'fixed_cart')
      return true;
    else if (result == true && result2 == true && coupon.discount_type != 'percent')
      return true;
    else if (result == true && result2 == false && coupon.discount_type == 'fixed_product')
      return true;
    else if (result == true && result2 == false && coupon.discount_type == 'percent_product')
      return true;
    else if (result == false && result2 == true && coupon.discount_type == 'percent_product')
      return true;
    else if (result == false && result2 == true && coupon.discount_type == 'fixed_product')
      return true;
    else
      return false;

  }
});
//========================================================================================================
//=============================== service to check the validity of coupon  ==============================
ecommerce.service('validateCouponService', function (lineItemTotalService, checkNoItemInCartService, checkUserUsageService, checkAlreadyAppliedService, checkOnSaleService, showAlertService, emailCheckService) {
  return function (coupon, lineItems, couponLines) {

    var expDate = new Date(coupon.expiry_date);
    var todayDate = new Date();
    //checking coupon expire or not
    if (expDate <= todayDate && coupon.expiry_date != null) {
      showAlertService("Sorry Coupon is Expired");
      return false;
    }
    // if cart amount is lower than the coupon minimum limit
    else if (lineItemTotalService(lineItems) <= coupon.minimum_amount) {

      showAlertService("Sorry your Cart total is low than coupon min limit!");
      return false;
    }
    // if cart amount is higher than the coupon minimum limit
    else if (lineItemTotalService(lineItems) >= coupon.maximum_amount && coupon.maximum_amount != 0) {
      showAlertService("Sorry your Cart total is Higher than coupon Max limit!");
      return false;
    }
    else if (emailCheckService(coupon.email_restrictions) == true) {
      showAlertService("Sorry, this coupon is not valid for this email address!");
      return false;
    }
    //============================================================== further checking
    else if (checkOnSaleService(lineItems, coupon) == true) {
      showAlertService("Sorry, this coupon is not valid for sale items.");
      return false;
    }
    else if (checkAlreadyAppliedService(coupon, couponLines) == true) {
      showAlertService("Coupon code already applied!");
      return false;
    }
    else if (couponLines != 0 && couponLines[0].individual_use == 1) {
      showAlertService('Sorry Individual Use Coupon is already applied any other coupon cannot be applied with it !');
      return false;
    }
    else if (checkUserUsageService(coupon) == true) {
      showAlertService('Coupon usage limit has been reached.');
      return false;
    }
    // else if (checkNoItemInCartService(lineItems, coupon) == false) {
    //   showAlertService('Sorry, this coupon is not applicable to your cart contents.');
    //   return false;
    // }
    else
      return true;
  }
});

//========================================================================================================
//=============================== service to calculate line items total ==============================
ecommerce.service('lineItemTotalService', function () {
  return function (lineItems) {
    var total = 0;
    lineItems.some(function (value, index) {
      var t = value.total;
      total = total + t;
    });
    return total;
  }
});
//========================================================================================================
//=============================== service to apply check coupon ==============================
ecommerce.service('applyCouponService', function (showAlertService, lineItemTotalService, checkCategoriesService, couponApplyOnProductService, $rootScope) {
  return function (coupon, lineItems) {
    var productLimit = coupon.limit_usage_to_x_items;
    if (productLimit == 0) productLimit = null;
    var product_qty_flag = 0;
    //fixed cart applying on line items
    if (coupon.discount_type == 'fixed_cart') {
      var cartTotal = parseFloat(lineItemTotalService(lineItems));
      var discount = parseFloat(coupon.amount / cartTotal);
      lineItems.some(function (value, index) {
        var result = value.total - parseFloat(discount * (value.total));
        if (result < 0) result = 0;
        value.total = result;
      });

      //console.log('fixed_cart'); //console.log(lineItems);
      return lineItems;

    }
    //percent cart applying on line items
    else if (coupon.discount_type == 'percent') {
      lineItems.some(function (value, index) {
        var amount = parseFloat(coupon.amount);
        var subtotal = parseFloat(value.subtotal);
        var total = parseFloat(value.total);
        var discount = (subtotal / 100) * amount;
        value.total = parseFloat(total - discount);
        if (value.total < 0) value.total = 0;
      });
     // console.log('percent'); console.log(lineItems);
      return lineItems;
    }
    //fixed product applying on specific line items
    else if (coupon.discount_type == 'fixed_product') {

      var amount = parseFloat(coupon.amount);
      lineItems.some(function (value, index) {
        if (couponApplyOnProductService(value, coupon) && checkCategoriesService(value, coupon)) {
          var quantity = value.customers_basket_quantity;
          var total = parseFloat(value.total);
          if (productLimit > 0) {
            for (var l = 1; l <= quantity; l++) {
              if (product_qty_flag < productLimit) {
                total = parseFloat(total - amount)
                product_qty_flag = product_qty_flag + 1;
              }
            }
            value.total = total;
          }
          else {
            value.total = parseFloat(total - (amount * quantity));

          }
          if (value.total < 0) { value.total = 0; }
        }
      });
     // console.log('fixed_product');
      return lineItems;
    }
    //percent product applying on specific line items
    else if (coupon.discount_type == 'percent_product') {
      var amount = parseFloat(coupon.amount);
      lineItems.some(function (value, index) {
        if (couponApplyOnProductService(value, coupon) && checkCategoriesService(value, coupon)) {
          var total = parseFloat(value.total);
          if (productLimit > 0) {
            for (var l = 1; l <= value.customers_basket_quantity; l++) {
              var discount = parseFloat((value.price / 100) * amount);
              if (product_qty_flag < productLimit) {
                total = parseFloat(total - discount)
                product_qty_flag = product_qty_flag + 1;
              }
            }
            value.total = total;
          } else {
            value.total = parseFloat(total - (total / 100) * amount);
          }

          if (value.total < 0) value.total = 0;
        }
      });

      //console.log('percent_product');
      return lineItems;
    }
    // else return lineItems;
  }
});