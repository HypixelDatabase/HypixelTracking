var notificationBar;

$(document).ready(function() {

  var giftShowing = false;
  $(document).on('click', '.btn-gift', function() {
    if (!giftShowing) {
      $(".btn-gift").html('Gift this package <i class="fa fa-chevron-up" aria-hidden="true"></i>');
      $(".gift-fields").slideDown("fast", function() {
        giftShowing = true;
      });
    } else {
      $(".btn-gift").html('Gift this package <i class="fa fa-chevron-down" aria-hidden="true"></i>');
      $(".gift-fields").slideUp("fast", function() {
        giftShowing = false;
      });
    }
  });

  $(".mc-skin").minecraftSkin({
    scale: 2
  });
  $(".mc-head").minecraftSkin({
    draw: 'head',
    scale: 2
  });

  $('.gateway-submit').click(function() {
    $('#checkout-gateway').val(this.name)
  });

  $('.checkout-braintree').click(function() {
    $('.braintree-details').removeClass("hidden");
  });

  $(".tooltip-help").tooltip();

  $("img[data-src]").jail();

  $(".gifting").on("click", "input[type=checkbox]", function() {
    name = $(this).attr('id');
    if ($(this).is(":checked")) {
      $("#ign_" + name).removeClass("hide").removeClass("hidden").attr("required", "required");
    } else {
      $("#ign_" + name).addClass("hide").addClass("hidden").removeAttr("required");
    }
  });

  $(".gifting").on("change", "input", function() {
    document.cookie = "buycraft_gifting=" + $(".gifting").find("input").serialize();
  });

  stored = unserialize(getCookie("buycraft_gifting"));

  for (i in stored) {
    field = jQuery(".gifting").find("[name='" + i + "']");
    if (field.attr("type") == "checkbox") {
      if (stored[i] == "1") {
        field.eq(0).checked = true;
        field.attr("checked", true);
        field.click();
        field.eq(0).checked = true;
        field.attr("checked", true);
      }
    } else {
      field.val(stored[i]);
    }

    field.change();
  }

  if (!jQuery(".checkout form").hasClass("gateway")) {
    jQuery(".checkout").on("submit", "form", function() {
      jQuery(this).find("#gifting").remove();
      jQuery(this).append("<input type='hidden' id='gifting' name='gifting' value='" + $(".gifting").find("input").serialize() + "' />");
    });
  }

  var stateTimer = null;

  $("select[name=address_country]").change(function() {
    if (stateTimer != null) {
      clearTimeout(stateTimer);
    }
    stateTimer = setTimeout(function() {
      $.ajax({
        type: 'POST',
        url: "/ajax/states",
        data: {
          country: $("select[name=address_country]").val()
        },
        dataType: "json",
        cache: false,
        success: function(data) {
          $("input[name=address_state]").attr("id", "stateinput");

          if (data.length > 0) {
            $("#stateinput").hide();
            $("#stateinput").removeAttr("name");
            $("#stateselect").remove();

            var stateoptions = '';

            for (var i = 0; i < data.length; i++) {
              stateoptions += '<option value="' + data[i]['id'] + '">' + data[i]['name'] + '</option>';
            }

            $("#stateinput").parent().append('<select name="address_state" id="stateselect"><option value="">Choose One...</option>' + stateoptions + '</select>');
          } else {
            $("#stateselect").remove();
            $("#stateinput").show();
            $("#stateinput").attr("name", "address_state");
          }
        }
      });
    }, 500);
  });

  var taxTimer = null;

  $(document.body).on("change", "select[name=address_country], select[name=address_state]", function() {
    if (taxTimer != null) {
      clearTimeout(taxTimer);
    }
    taxTimer = setTimeout(function() {
      $.ajax({
        type: 'POST',
        url: "/ajax/checktax",
        data: {
          country: $("select[name=address_country]").val(),
          state: $("select[name=address_state]").val()
        },
        dataType: "json",
        cache: false,
        success: function(data) {
          $(".checkout .tax").hide().html("");

          if (data.applies) {
            $(".checkout .tax").show().html("<div class='page-header'><h4>" + data.name + "</h4></div><p>Because you reside in " + data.region + " you will be charged an additional " + data.percentage + "% " + data.name + " on your order.</p>");
          }
        }
      });
    }, 500);
  });
});

function submitCheckoutForm(form) {
  braintreeValue = $('.checkout-braintree').attr('name');

  if ($('#checkout-gateway').val() == braintreeValue) {
    braintreeinstance.requestPaymentMethod(function(err, payload) {
      if (err) {
        console.log('Error', err);
        notification.show("danger", "We could not validate your payment method. Please select a new payment method and try again.");
        return;
      }

      // Add the nonce to the form and submit
      document.querySelector('#nonce').value = payload.nonce;
      return processForm(form);
    });
  } else {
    return processForm(form);
  }

  return false;

}

function processForm(form) {


  $.ajax({
    type: 'POST',
    url: form.attr("action"),
    data: form.serialize() + "&" + $(".gifting").find("input").serialize(),
    dataType: "json",
    success: function(json) {
      if (json.type == "error") {
        if (json.success_url == "redirect") {
          window.top.location.replace("/checkout/basket");
        } else {
          showNotification("error", json.message);
        }

        if (typeof reRenderWidgets != "undefined" && json.success_url == "rerender") {
          reRenderWidgets();
        }
      } else if (json.type == "success") {
        if (json.gateway == "googlewallet") {
          google.payments.inapp.buy({
            jwt: json.data,
            success: function() {
              window.top.location.replace("/checkout/complete");
            },
            failure: function(result) {
              error = result.response.errorType;

              if (error != 'PURCHASE_CANCELED' && error != 'PURCHASE_CANCELLED') {
                showNotification("error", "Your transaction could not be completed. (Error: " + error + ")");
              }
            }
          });
        } else if (json.gateway == "stripe") {
          stripeData = json.data;

          stripeData.token = function(stripeResponse) {
            $.ajax({
              type: 'POST',
              url: "/checkout/stripe",
              data: {
                token: stripeResponse.id
              },
              dataType: "json",
              success: function(response) {
                if (response.complete) {
                  window.top.location.replace("/checkout/complete");
                } else {
                  showNotification("error", response.reason);
                }
              }
            });
          };

          StripeCheckout.open(stripeData);
        } else if (json.gateway == "cashu") {
          var cashuForm = $('<form id="mapform" action="https://www.cashu.com/cgi-bin/pcashu.cgi" method="post"></form>');

          for (var key in json.data) {
            if (json.data.hasOwnProperty(key)) {
              cashuForm.append('<input type="hidden" name="' + key + '" value="' + json.data[key] + '" />');
            }
          }

          $('body').append(cashuForm);

          cashuForm.submit();
        } else if (json.gateway == "xsolla") {
          $('body').append(json.data.html);
        } else {
          window.top.location.replace(json.data);
        }
      }
    },
    error: function(data) {
      showNotification("error", "We could not send you to the payment gateway - please refresh the page and try again.");
    }
  });

  return false;
}

function showModal(url) {
  $.ajax({
    url: url,
    success: function(data) {
      $('#popupModal').html(data);
      $('#popupModal').modal("show");

      $(".datepicker").datepicker({
        dateFormat: "dd-mm-yy"
      });
    },
    async: true
  });

  return false;
}

function showNotification(type, message) {
  clearTimeout(notificationBar);

  $("html, body").animate({
    scrollTop: $("body").offset().top - 100
  }, "fast");

  $('#popupModal').modal('hide');

  $("#notification-bar").removeClass();
  $("#notification-bar").addClass(type);
  $('#notification-bar').slideDown(200);
  $('#notification-bar').html(message);

  notificationBar = setTimeout(function() {
    $('#notification-bar').slideUp();
  }, 7500);
}

function hideNotificationBar() {
  clearTimeout(notificationBar);

  $('#notification-bar').slideUp();
}

function unserialize(serializedString) {
  var str = decodeURI(serializedString);
  var pairs = str.split('&');
  var obj = {},
    p, idx;
  for (var i = 0, n = pairs.length; i < n; i++) {
    p = pairs[i].split('=');
    idx = p[0];
    if (obj[idx] === undefined) {
      obj[idx] = unescape(p[1]).replace(/\+/g, ' ');
    } else {
      if (typeof obj[idx] == "string") {
        obj[idx] = [obj[idx]];
      }
      obj[idx].push(unescape(p[1]).replace(/\+/g, ' '));
    }
  }
  return obj;
};


function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}