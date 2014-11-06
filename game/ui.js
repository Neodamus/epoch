function UI() {
    $('#epoch-ui').css(

        {
            backgroundImage: 'url(' + EOE.images.getResult('ui').src + ')',
            backgroundSize: '100%'
        }
    );
    /*var addimg = $('#ui-image')
    addimg.attr('src', ;
    addimg.attr('position', 'absolute');
    addimg.attr('height', '100%');
    addimg.attr('width', '100%');*/

}


// width and height are incoming values to size to
UI.prototype.resize = function(width, height) {
    var name = $('#unit-name');
    name.css('font-size', name.height() - 2);
}


// set ui to show unit
UI.prototype.setUnit = function(unit) {

    var ui = $('#epoch-ui');

    ui.empty();
    ui.append('<div id="unit-name" style="padding-top: 2px; margin-left: 30%; top:0; width: 60%; height: 1.7%; color: white;text-align: center; font-size: 1em;"></div>');
    var name = $('#unit-name');
    name.css('font-size', name.height() - 2);
    $('#unit-name').html(unit.name);


    ui.append('<div id="unit-image-holder" style="height:8.3%;width:100%;"></div>');
    $('#unit-image-holder').prepend('<img id="unit-image" style="height: 100%; width: auto; display: block; margin-left: 49%;"/>');

    var image = EOE.images.getResult(unit.type).src;
    var unitimg =  $('#unit-image');
    unitimg.attr('src', image);
    unitimg.attr('height', '82px');
    unitimg.attr('width', '70px');



    ui.append('<div id="unit-primary-stats" style="width: 100%; height: 120px;"/>');
    var stats = $('#unit-primary-stats');
    stats.append('<div id="stats-healthbar-total" style="margin-left: 20%; width:80%; height: 8px; background-color: gray;">' +
        '<div id="stats-healthbar-current" style="background-color: darkred;width: 50%; height:100%;"/>' +
        '</div>');
    stats.append('<div id="primary-stats" style="position:absolute; width:145px; display: inline-block; right: 0; left: 32%; auto;padding-top: 10px;"/>');
    var primary = $('#primary-stats');
    primary.append('<div id="stats-health" style="display:inline-block; width:70px;height:25px; background-color: black;"/>');

    var image = EOE.images.getResult('heart-icon').src;
    var temp =  $('#stats-health'); temp.append('<img id="health-icon" style="position: relative;float: left; "/>');
    temp.append('<p style="color: white; display: block; position:relative; width: 30px; float: left;margin: 0; text-align: center; height: 25px; font-size: 10px;">120 / 120</p>');
    var addimg = $('#health-icon');
    addimg.attr('src', image);
    addimg.attr('position', 'absolute');
    addimg.attr('height', '100%');
    addimg.attr('width', 'auto');

    var tool = function () {

        var text = 'Unit Health. (current / total)';
        var define = 'The amount of damage the unit can withstand.';
        tp.layout.basic(text, define);
    };

    tp.add(temp, {width: 250}, tool);

    primary.append('<div id="stats-movement" style="display:inline-block;width:70px;height:25px; background-color: black; "/>');

    var image = EOE.images.getResult('boots-icon').src;
    var temp =  $('#stats-movement'); temp.append('<img id="boots-icon" style="position: relative;float: left; "/>');
    temp.append('<p style="color: white; display: block; position:relative; width: 30px; float: left;margin: 0; text-align: center; height: 25px; font-size: 12px;">12 / 12</p>');
    var addimg = $('#boots-icon');
    addimg.attr('src', image);
    addimg.attr('position', 'absolute');
    addimg.attr('height', '100%');
    addimg.attr('width', 'auto');

    var tool = function () {

        var text = 'Unit Movement. (current / total)';
        var define = 'The distance a unit can travel in hexagons.';
        tp.layout.basic(text, define);
    };
    tp.add(temp, {width: 280}, tool);

    primary.append('<div id="stats-blocks" style="display:inline-block;width:70px;height:25px; background-color: black;"/>');

    var image = EOE.images.getResult('shield-icon').src;
    var temp =  $('#stats-blocks'); temp.append('<img id="shield-icon" style="position: relative;float: left; "/>');
    temp.append('<p style="color: white; display: block; position:relative; width: 30px; float: left;margin: 0; text-align: center; height: 25px; font-size: 15px;">3 / 3</p>');
    var addimg = $('#shield-icon');
    addimg.attr('src', image);
    addimg.attr('position', 'absolute');
    addimg.attr('height', '100%');
    addimg.attr('width', 'auto');

    var tool = function () {

        var text = 'Unit Blocks. (current / total)';
        var define = 'The number of times a unit can defend an oncoming attacks.';
        tp.layout.basic(text, define);
    };
    tp.add(temp, {width: 250}, tool);

    primary.append('<div id="stats-armor" style="display:inline-block;width:70px;height:25px; background-color: black;"/>');

    var image = EOE.images.getResult('defense-icon').src;
    var temp =  $('#stats-armor'); temp.append('<img id="defense-icon" style="position: relative;float: left; "/>');
    temp.append('<p style="color: white; display: block; position:relative; width: 30px; float: right;margin: 0; text-align: center; height: 25px; font-size: 22px;">4</p>');
    var addimg = $('#defense-icon');
    addimg.attr('src', image);
    addimg.attr('position', 'absolute');
    addimg.attr('height', '100%');
    addimg.attr('width', 'auto');

    var tool = function () {

        var text = 'Unit Defense.';
        var define = 'The amount of damage reduced when a unit blocks an attack.';
        tp.layout.basic(text, define);
    };
    tp.add(temp, {width: 250}, tool);

    primary.append('<div id="stats-attacks" style="display:inline-block;width:70px;height:25px; background-color: black;"/>');

    var image = EOE.images.getResult('sword-icon').src;
    var temp =  $('#stats-attacks'); temp.append('<img id="sword-icon" style="position: relative;float: left; "/>');
    temp.append('<p style="color: white; display: block; position:relative; width: 30px; float: left;margin: 0; text-align: center; height: 25px; font-size: 15px;">3 / 3</p>');
    var addimg = $('#sword-icon');
    addimg.attr('src', image);
    addimg.attr('position', 'absolute');
    addimg.attr('height', '100%');
    addimg.attr('width', 'auto');

    var tool = function () {

        var text = 'Unit Attacks. (current / total)';
        var define = 'The number of times a unit can attack or use abilities.';
        tp.layout.basic(text, define);
    };
    tp.add(temp, {width: 250}, tool);

    primary.append('<div id="stats-damage" style="display:inline-block;width:70px;height:25px; background-color: black;"/>');

    var image = EOE.images.getResult('damage-icon').src;
    var temp =  $('#stats-damage'); temp.append('<img id="damage-icon" style="position: relative;float: left; "/>');
    temp.append('<p style="color: white; display: block; position:relative; width: 30px; float: right;margin: 0; text-align: center; height: 25px; font-size: 22px;">8</p>');
    var addimg = $('#damage-icon');
    addimg.attr('src', image);
    addimg.attr('position', 'absolute');
    addimg.attr('height', '100%');
    addimg.attr('width', 'auto');

    var tool = function () {

        var text = 'Unit Damage.';
        var define = 'The amount of damage a unit can deal to a target. (before defense reduction is accounted for)';
        tp.layout.basic(text, define);
    };
    tp.add(temp, {width: 250}, tool);


    ui.append('<div id="unit-secondary-stats" style="border: 1px solid gray; width: 100%; height: 100px;"/>');
    var stats2 = $('#unit-secondary-stats');


    ui.append('<div id="unit-ability1" style="float: left;border: 1px solid gray; width: 49%; height: 10%"/>');
    ui.append('<div id="unit-ability2" style="float: left;border: 1px solid gray; width: 49%; height: 10%;"/>');
    ui.append('<div id="unit-ability3" style="float: left;border: 1px solid gray; width: 49%; height: 10%;"/>');
    ui.append('<div id="unit-ability4" style="float: left;border: 1px solid gray; width: 49%; height: 10%;"/>');


	console.log(unit);
}

function tooltip() {

    $('#wrapper').append("<div class='block' id='tooltip'></div>");
    this.tooltips = [];
    this.layout = this.createLayouts(); //returns object array

}

tooltip.prototype.createLayouts = function() {

    var layouts = [];
    layouts['main'] = function(title, summary, cooldown, cooldownImage, lore) {

        var layStart = "<div id='standard-tooltip'>";
        var setTitle = title != "" ? "<div class='cOH'>" + "<p style='text-decoration: underline;text-align: center;font: 17px Georgia'>" + title + "</p>" + "</div>" : "";
        var setSummary =  summary != "" ? "<p style=''>" + summary + "</p>" : "";
        var setCooldown =  cooldown != "" ? "<div style='color: Gold; height: 15px;'>" + "Cooldown: " + cooldown + "<span id='cooldownImageHolder'></span>" + "</div>" : "";
        var loreNote = lore != "" ? "<div style='color: white; font: 10px Arial; padding-top: 20px;'>" + lore + "</div>" : "";
        var layEnd = "</div>";
        var total = layStart + setTitle +  setSummary  + setCooldown  + loreNote + layEnd;
        $('#tooltip').append(total);

        $('#standard-tooltip').css({
            paddingLeft: '20px', paddingRight: '20px', paddingBottom: '7px', position: 'relative'

        });
        $('#cooldownImageHolder').prepend('<img id="cooldownImage"/>');
        var cdimg =  $('#cooldownImage');
        cdimg.attr('src', cooldownImage);
        cdimg.attr('height', '13px');
        cdimg.attr('width', '13px');
    };
    layouts['basic'] = function(summary, definition) {

        var layStart = "<div id='standard-tooltip'>";

        var setSummary =  summary != "" ? "<p style=''>" + summary + "</p>" : "";

        var setDefinition = definition != "" ? '<p style="">' + definition + '</p>' : "";

        var layEnd = "</div>";

        var total = layStart + setSummary + setDefinition + layEnd;

        $('#tooltip').append(total);

        $('#standard-tooltip').css({
            paddingLeft: '20px', paddingRight: '20px', paddingBottom: '0px', position: 'relative'

        });
        $('#cooldownImageHolder').prepend('<img id="cooldownImage"/>');
    };


    /*layouts['ability'] = function(unitAbilityTooltip) { // function() { return abilities['fireball'].getStats; }

        var layStart = "<div id='standard-tooltip'>";
        var setTitle = title != "" ? "<div class='cOH'>" + "<p style='text-decoration: underline;text-align: center;font: 17px Georgia'>" + title + "</p>" + "</div>" : "";
        var setSummary =  summary != "" ? "<p style=''>" + summary + "</p>" : "";
        var setCooldown =  cooldown != "" ? "<div style='color: Gold; height: 15px;'>" + "Cooldown: " + cooldown + "<span id='cooldownImageHolder'></span>" + "</div>" : "";
        var loreNote = lore != "" ? "<div style='color: white; font: 10px Arial; padding-top: 20px;'>" + lore + "</div>" : "";
        var layEnd = "</div>";
        var total = layStart + setTitle +  setSummary  + setCooldown  + loreNote + layEnd;
        $('#tooltip').append(total);

        $('#standard-tooltip').css({
            paddingLeft: '20px', paddingRight: '20px', paddingBottom: '7px', position: 'relative'

        });
        $('#cooldownImageHolder').prepend('<img id="cooldownImage"/>');
        var cdimg =  $('#cooldownImage');
        cdimg.attr('src', cooldownImage);
        cdimg.attr('height', '13px');
        cdimg.attr('width', '13px');
    };*/

    return layouts;
};

var tp = new tooltip(); //temporary global variable for testing purposes

function presetlay() { //temporary for testing

    var dummyText = 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.';
    var dummyLore = 'A pair of tough-skinned boots that change to meet the demand of the wearer.';
    tp.layout.main('Main layout Title(Treads)', dummyText, '50', 'images/borderyellow.png', dummyLore);
} //temporary for testing purposes

tooltip.prototype.add = function (target, edit, layout) {

    //issues: events like mouseenter and mouseleave stack. temp fix is unbinding all of them.
    target.unbind('mouseenter mouseleave');

    var object = {

        follow: true,
        width: 280,
        height : 'auto',
        wordwrap : 'normal',
        boundary: $('#wrapper')[0],
        backgroundcolor: 'rgba(40, 40, 40, 0.95)',
        border: '1px solid rgba(80,80,80,1)'
    };

    if (edit != undefined) { deepCopy(edit, object); }


    var enter = function(event) {

        var th = $(this);
        var tt = $('#tooltip');

        tt.removeAttr('style');
        tt.css({
            position: 'fixed',
            backgroundColor: 'rgba(20,20,20,0.95)',
            color: 'white', wordBreak: 'break-all', zIndex: '500'
        });

        tt.empty(); //reset the layout to nothing

        layout(); //apply the layout parameter that is stored for this specific tooltip (layouts also contain stats)

        tt.css({ //apply the css parameter+defaults

            display: 'none',
            visibility: 'visible',
            top: object.top,
            bottom: object.bottom,
            right: object.right,
            left: object.left,

            width: object.width,
            height: object.height,

            padding: object.padding,
            wordBreak: object.wordwrap,

            backgroundColor: object.backgroundcolor,
            border: object.border

        });

        if (object.follow == true) { //positioning of tooltips based on mouse

            var boundaries = object.boundary.getBoundingClientRect();
            th.mousemove(function(event) {
                var py = 'top';
                var px = 'middle';

                if (th.offset().top - (tt.height()) - 8 < boundaries.top) {
                    py = 'bottom';
                    if (th.offset().bottom  + 8 > boundaries.bottom) {
                    py = 'middle';
                    }
                }
                if (th.offset().left + (tt.width() / 2)  > boundaries.right) {

                    px = 'left';

                }
                if (th.offset().left - (tt.width() / 2)  < boundaries.left) {
                    px = 'right';
                }

                if (py == 'top') { tt.css({ top: th.offset().top - (tt.height() + 8) }); }
                if (py == 'bottom') { tt.css({ top: th.offset().top + th.height() + 8 }); }

                if (px == 'middle') {  tt.css({ left: th.offset().left - (tt.width() / 2) }); }
                if (px == 'left') {  tt.css({ left: th.offset().left - (tt.width())  }); }
                if (px == 'right') {  tt.css({ left: th.offset().left  }); }

            });
        }

        //how long it takes for tooltip to become visible

        tt.fadeIn(400); //fadeout is loacated in 'mouseleave' event
    };

    var addthis = target; //unnecessary
    this.tooltips.push(addthis); //probably unnecessary

    addthis.mouseenter(enter);
    addthis.mouseleave(

        function() {

            var tt = $('#tooltip');
            target.unbind('mousemove'); //unbinding mouse move of event (i'm not sure if keeping it on is a bad thing)
            tt.fadeOut(0); //how long it takes to fade away
            tt.stop( true, true ).fadeIn(); //making sure fade in's don't stack... animation problems
            tt.css({ visibility: 'hidden'}); //hiding instantly (remove if you want fadeout time
        }
    );
};

/*HELPER FUNCTION*/
function deepCopy(src, dest) { //this is for putting properties of one object into another, while keeping defaults
    var name,
        value,
        isArray,
        toString = Object.prototype.toString;

    // If no `dest`, create one
    if (!dest) {
        isArray = toString.call(src) === "[object Array]";
        if (isArray) {
            dest = [];
            dest.length = src.length;
        }
        else { // You could have lots of checks here for other types of objects
            dest = {};
        }
    }

    // Loop through the props
    for (name in src) {
        // If you don't want to copy inherited properties, add a `hasOwnProperty` check here
        // In our case, we only do that for arrays, but it depends on your needs
        if (!isArray || src.hasOwnProperty(name)) {
            value = src[name];
            if (typeof value === "object") {
                // Recurse
                value = deepCopy(value);
            }
            dest[name] = value;
        }
    }

    return dest;
}
