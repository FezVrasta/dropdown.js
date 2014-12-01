/* globals jQuery, window, document */

(function($) {

  var methods = {
    options : {
      "optionClass": "",
      "dropdownClass": "",
      "autoinit": false,
      "callback": false
    },
    init: function(options) {

      // Apply user options if user has defined some
      if (options) {
        options = $.extend(methods.options, options);
      } else {
        options = methods.options;
      }

      function initElement($select) {
        // Don't do anything if this is not a select or if this select was already initialized
        if ($select.data("dropdownjs") || !$select.is("select")) {
          return;
        }

        // Is it a multi select?
        var multi = $select.attr("multiple");

        // Create the dropdown wrapper
        var $dropdown = $("<div></div>");
        $dropdown.addClass("dropdownjs").addClass(options.dropdownStyle);
        $dropdown.data("select", $select);

        // Create the fake input used as "select" element and cache it as $input
        var $input = $("<input type=text readonly>");
        if ($.material) { $input.data("mdproc", true); }
        // Append it to the dropdown wrapper
        $dropdown.append($input);

        // Create the UL that will be used as dropdown and cache it AS $ul
        var $ul = $("<ul></ul>");

        // Append it to the dropdown
        $dropdown.append($ul);

        // Transfer the placeholder attribute
        $input.attr("placeholder", $select.attr("placeholder"));

        // Loop trough options and transfer them to the dropdown menu
        $select.find("option").each(function() {
          // Cache $(this)
          var $this = $(this);

          // Create the option
          var $option = $("<li></li>");

          // Style the option
          $option.addClass(options.optionStyle);

          // If the option has some text then transfer it
          if ($this.text()) {
            $option.text($this.text());
          }
          // Otherwise set the empty label and set it as an empty option
          else {
            $option.html("&nbsp;");
          }
          // Set the value of the option
          $option.attr("value", $this.val());

          // Ss it selected?
          if ($this.attr("selected")) {
            $option.attr("selected", true);
          }

          // Append option to our dropdown
          $ul.append($option);
        });

        // Cache the dropdown options
        var selectOptions = $dropdown.find("li");

        // If is a single select, selected the first one or the last with selected attribute
        if (!multi) {
          var $selected;
          if ($ul.find("[selected]").length) {
            $selected = $ul.find("[selected]").last();
          }
          else {
            $selected = $ul.find("li").first();
          }
          methods._select($dropdown, $selected);
        } else {
          methods._select($dropdown, $ul.find("[selected]"));
        }

        // Transfer the classes of the select to the input dropdown
        $input.addClass($select[0].className);

        // Hide the old and ugly select
        $select.hide().attr("data-dropdownjs", true);

        // Bring to life our awesome dropdownjs
        $select.after($dropdown);

        // Call the callback
        if (options.callback) {
          options.callback($dropdown);
        }

        //---------------------------------------//
        // DROPDOWN EVENTS                       //
        //---------------------------------------//

        // On click, set the clicked one as selected
        selectOptions.on("click", function(e) {
          methods._select($dropdown, $(this));
        });
        selectOptions.on("keydown", function(e) {
          if (e.which === 27) {
            $(".dropdownjs > ul > li").each(function() { $(this).attr("tabindex", -1); });
            return $input.removeClass("focus").blur();
          }
          if (e.which === 32) {
            methods._select($dropdown, $(this));
            return false;
          }
        });

        selectOptions.on("focus", function() {
          if ($select.is(":disabled")) {
            return;
          }
          $input.addClass("focus");
        });

        // Used to make the dropdown menu more dropdown-ish
        $input.on("click focus", function(e) {
          e.stopPropagation();
          if ($select.is(":disabled")) {
            return;
          }
          $(".dropdownjs > ul > li").each(function() { $(this).attr("tabindex", -1); });
          $(".dropdownjs > input").not($(this)).removeClass("focus").blur();

          selectOptions.each(function() { $(this).attr("tabindex", 0); });

          // Set height of the dropdown
          var coords = {
            top: $(this).offset().top - $(document).scrollTop(),
            left: $(this).offset().left - $(document).scrollLeft(),
            bottom: $(window).height() - ($(this).offset().top - $(document).scrollTop()),
            right: $(window).width() - ($(this).offset().left - $(document).scrollLeft())
          };

          var height = coords.bottom;

          // Decide if place the dropdown below or above the input
          if (height < 200 && coords.top > coords.bottom) {
            height = coords.top;
            $ul.attr("placement", "top-left");
          } else {
            $ul.attr("placement", "bottom-left");
          }

          $(this).next("ul").css("max-height", height - 20);
          $(this).addClass("focus");
        });
        $(document).on("click", function() {
          $(".dropdownjs > ul > li").each(function() { $(this).attr("tabindex", -1); });
          $input.removeClass("focus");
        });
      }

      if (options.autoinit) {
        $(document).on("DOMNodeInserted", function(e) {
          var $this = $(e.target);
          if ($this.is("select") && $this.is(options.autoinit)) {
            initElement($this);
          }
        });
      }

      // Loop trough elements
      $(this).each(function() {
        initElement($(this));
      });
    },
    select: function(target) {
      var $target = $(this).find("[value=\"" + target + "\"]");
      methods._select($(this), $target);
    },
    _select: function($dropdown, $target) {
      // Get dropdown's elements
      var $select = $dropdown.data("select"),
          $input  = $dropdown.find("input");

      // Is it a multi select?
      var multi = $select.attr("multiple");

      // Cache the dropdown options
      var selectOptions = $dropdown.find("li");

      // Behavior for multiple select
      if (multi) {
        // Toggle option state
        $target.toggleClass("selected");
        // Toggle selection of the clicked option in native select
        var $selected = $select.find("[value=\"" + $target.attr("value") + "\"]");
        if ($selected.attr("selected")) {
          $selected.attr("selected", true);
        } else {
          $selected.attr("selected", false);
        }
        // Add or remove the value from the input
        var text = [];
        selectOptions.each(function() {
          if ($(this).hasClass("selected")) {
            text.push($(this).text());
          }
        });
        $input.val(text.join(", "));
      }

      // Behavior for single select
      if (!multi) {
        // Unselect options except the one that will be selected
        selectOptions.not($target).removeClass("selected");
        // Select the selected option
        $target.addClass("selected");
        // Set the value to the native select
        $select.val($target.attr("value"));
        // Set the value to the input
        $input.val($target.text());
      }

      // This is used only if Material Design for Bootstrap is selected
      if ($.material) {
        if ($input.val().trim()) {
          $select.removeClass("empty");
        } else {
          $select.addClass("empty");
        }
      }

    }
  };

  $.fn.dropdown = function(params) {
    if (methods[params]) {
      return methods[params].apply(this, Array.prototype.slice.call(arguments,1));
    } else if (typeof params === "object" | !params) {
      return methods.init.apply(this, arguments);
    } else {
      $.error("Method " + params + " does not exists on jQuery.dropdown");
    }
  };

})(jQuery);
