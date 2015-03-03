# Dropdown.js

Finally a dropdown plugin that transforms select inputs in nice dropdowns and does not drive you crazy.

I've always wondered why the most famous plugins (Chosen and Selectize) are so huge and full of useless/pointless features?
What do you need from a dropdown plugin?

### Initialize it

Nice! I've found `<your_fav_plugin_here>` and I want to use it to style all my select inputs! But wha happens if I dinamically add a new element? I must init it manually.. Doh!

Dropdown.js get rid of this problem, in fact you just need to run the plugin **one time** and it will take care of every new input which matches your rules.

    // Init any existing .select element and then watch for new .select elements
    // added dinamically by some black magic casted by a evil wizard
    $(".select").dropdown({ "autoinit" : ".select" });

Now what happens? We want our dropdowns to act like a boss.. emh like a standard select input. If it's a single select you want first element, or the selected one, already selected.
We want even keyboard support, so if we press tab, it get opened and with tab you can select the options etc etc...

### Style it

What else? Maybe we want to be able to style our dropdown with our own classes so that we don't have to hack the plugin to make it looks good?

    $(".select").dropdown({ "dropdownClass": "my-dropdown", "optionClass": "my-option awesome" });

With this command we init every `.select` element (yes they are initialized always in the same way) and the `my-dropdown` class will be applied to the dropdown wrapper (ex: `<select>`) and `my-option awesome` will be applied to the options (ex: `<option>`).

### Please don't fill my DOM with thousand of DIVs!!!

Don't worry friend, this is the markup used by Dropdown.js:

    <div class="dropdownjs">
      <input type="text" readonly placeholder="This is a placeholder">
      <ul>
        <li value="foobar" tabindex="0">My foobar...</li>
        <li value="great" selected class="selected" tabindex="0">...is great!</li>
      </ul>
    </div>

### Callbacks

Psstt, ya need some callback?
**Dropdown.js** supports callbacks, they are called on each element initialized, here an example:

    $(".select").dropdown({ "callback": function($dropdown) {
      // $dropdown is the shiny new generated dropdown element!
      $dropdown.fadeIn("slow");
    });

### Dropdown position

Dropdowns are placed in the best position, if a select input is placed on bottom of the page, the dropdown will open above it.

### Dynamically added options

You may add a new option to the select tag and it will be automatically added to the dropdown.js

### Let users add options

Add `data-dynamic-opts=true` to the select tag to let users add or remove options.

### Browserify

This library is [UMD](https://github.com/umdjs/umd) compatible, so you can use it in this way:

```javascript
var jquery = require("jquery");
require("dropdown.js");

jquery.material.init();

jquery(document).ready(function() {
    $(".select").dropdown({"optionClass": "withripple"});
});
...
```
