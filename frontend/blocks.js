// **   2020-01-24  ** screenshots

// Blockly.Blocks['robot_start'] = {
//     init: function() {
//       this.appendDummyInput()
//           .setAlign(Blockly.ALIGN_RIGHT)
//           .appendField("Robotti, aloitetaan.")
//         //   .appendField(new Blockly.FieldNumber(0, 0, 255), "kaanny_oik")
//         //   .appendField("s");
//       this.setInputsInline(false);
//       this.setColour(120);
//       this.setPreviousStatement(false, null);
//       this.setNextStatement(true, null);
//    this.setTooltip("");
//    this.setHelpUrl("");
//     }
// };

Blockly.Blocks['liiku_eteen_cm'] = {
    init: function() {
      this.appendDummyInput()
          .setAlign(Blockly.ALIGN_RIGHT)
          .appendField("Liiku eteenpäin ")
          .appendField(new Blockly.FieldNumber(0, 0, 9999), "eteen_cm")
          .appendField(" cm");
      this.setInputsInline(false);
      this.setColour(195);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
   this.setTooltip("");
   this.setHelpUrl("");
    }
};

Blockly.Blocks['liiku_taakse_cm'] = {
    init: function() {
      this.appendDummyInput()
          .setAlign(Blockly.ALIGN_RIGHT)
          .appendField("Liiku taaksepäin ")
          .appendField(new Blockly.FieldNumber(0, 0, 9999), "taakse_cm")
          .appendField(" cm");
      this.setInputsInline(false);
      this.setColour(195);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
   this.setTooltip("");
   this.setHelpUrl("");
    }
};

Blockly.Blocks['kaanny_vasemmalle_astetta'] = {
    init: function() {
      this.appendDummyInput()
          .setAlign(Blockly.ALIGN_RIGHT)
          .appendField("Käänny vasemmalle ")
          .appendField(new Blockly.FieldNumber(0, 0, 999), "vasen_aste")
          .appendField(" astetta");
      this.setInputsInline(false);
      this.setColour(195);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
   this.setTooltip("");
   this.setHelpUrl("");
    }
};

Blockly.Blocks['kaanny_oikealle_astetta'] = {
    init: function() {
      this.appendDummyInput()
          .setAlign(Blockly.ALIGN_RIGHT)
          .appendField("Käänny oikealle ")
          .appendField(new Blockly.FieldNumber(0, 0, 999), "oikea_aste")
          .appendField(" astetta");
      this.setInputsInline(false);
      this.setColour(195);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
   this.setTooltip("");
   this.setHelpUrl("");
    }
};

Blockly.Blocks['odota_sekuntia'] = {
    init: function() {
      this.appendDummyInput()
          .setAlign(Blockly.ALIGN_RIGHT)
          .appendField("Odota ")
          .appendField(new Blockly.FieldNumber(0, 0, 999), "odota_s")
          .appendField(" s");
      this.setInputsInline(false);
      this.setColour(195);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
   this.setTooltip("");
   this.setHelpUrl("");
    }
};

Blockly.Blocks['poimi_pallo'] = {
    init: function() {
      this.appendDummyInput()
          .setAlign(Blockly.ALIGN_RIGHT)
          .appendField("Poimi ")
          .appendField(new Blockly.FieldDropdown([
              ['oikea  pallo', 'oikea'],
              ['vasen  pallo', 'vasen']
          ]), 'pallon_poiminta')
          .appendField(" (väri?)");
      this.setInputsInline(false);
      this.setColour(195);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
   this.setTooltip("");
   this.setHelpUrl("");
    }
};

Blockly.Blocks['avaa_koura'] = {
    init: function() {
      this.appendDummyInput()
          .setAlign(Blockly.ALIGN_RIGHT)
          .appendField("Avaa ")
          .appendField(new Blockly.FieldDropdown([
              ['oikea  koura', 'oikea'],
              ['vasen  koura', 'vasen']
          ]), 'kouran_avaus');
      this.setInputsInline(false);
      this.setColour(195);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
   this.setTooltip("");
   this.setHelpUrl("");
    }
};

Blockly.Blocks['liikuta_kasi_eteen'] = {
    init: function() {
      this.appendDummyInput()
          .setAlign(Blockly.ALIGN_RIGHT)
          .appendField("Liikuta ")
          .appendField(new Blockly.FieldDropdown([
              ['oikea  käsi eteen', 'oikea'],
              ['vasen  käsi eteen', 'vasen']
          ]), 'kasi_eteen');
      this.setInputsInline(false);
      this.setColour(195);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
   this.setTooltip("");
   this.setHelpUrl("");
    }
};

Blockly.Blocks['liikuta_kasi_ylos'] = {
    init: function() {
      this.appendDummyInput()
          .setAlign(Blockly.ALIGN_RIGHT)
          .appendField("Liikuta ")
          .appendField(new Blockly.FieldDropdown([
              ['oikea  käsi ylös', 'oikea'],
              ['vasen  käsi ylös', 'vasen']
          ]), 'kasi_ylos');
      this.setInputsInline(false);
      this.setColour(195);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
   this.setTooltip("");
   this.setHelpUrl("");
    }
};


// Pudota pallo pisteeseen         (oikea / vasen + a / b / c) (ennalta määrättyjä pisteitä robotin rungossa ja/tai ilmassa)
// Tartu palloon pisteessä            (oikea / vasen + a / b / c) (ennalta määrättyjä pisteitä robotin rungossa ja/tai ilmassa)
// käsi ylös               (oikea / vasen)
// käsi alas                (oikea / vasen)
// käsi sivulle           (oikea / vasen)
// vilkuta  (oikea / vasen)

Blockly.JavaScript['liikuta_kasi_ylos'] = function(block) {
    return "robottikomennot.push('kasiylos:" + block.getFieldValue('kasi_ylos') + "');";
};

Blockly.JavaScript['liikuta_kasi_eteen'] = function(block) {
    return "robottikomennot.push('kasieteen:" + block.getFieldValue('kasi_eteen') + "');";
};

Blockly.JavaScript['avaa_koura'] = function(block) {
    return "robottikomennot.push('kouranavaus:" + block.getFieldValue('kouran_avaus') + "');";
};

Blockly.JavaScript['poimi_pallo'] = function(block) {
    return "robottikomennot.push('pallonpoiminta:" + block.getFieldValue('pallon_poiminta') + "');";
};

Blockly.JavaScript['odota_sekuntia'] = function(block) {
    return "robottikomennot.push('odota:" + block.getFieldValue('odota_s') + "');";
};

Blockly.JavaScript['liiku_eteen_cm'] = function(block) {
    return "robottikomennot.push('eteenpäin:" + block.getFieldValue('eteen_cm') + "');";
};

Blockly.JavaScript['liiku_taakse_cm'] = function(block) {
    return "robottikomennot.push('taaksepäin:" + block.getFieldValue('taakse_cm') + "');";
};

Blockly.JavaScript['kaanny_vasemmalle_astetta'] = function(block) {
    return "robottikomennot.push('vasemmalle:" + block.getFieldValue('vasen_aste') + "');";
};

Blockly.JavaScript['kaanny_oikealle_astetta'] = function(block) {
    return "robottikomennot.push('oikealle:" + block.getFieldValue('oikea_aste') + "');";
};

// Blockly.JavaScript['robot_run'] = function(block) {
//     return "for (const c of robottikomennot) window.alert(c);     /* sendkäsky */    robottikomennot = [];";
// };
  
// Blockly.JavaScript.text_print=function(a){return"window.alert("+(Blockly.JavaScript.valueToCode(a,"TEXT",Blockly.JavaScript.ORDER_NONE)||"''")+");\n"};
  
  

// Blockly.Blocks['move_fw_until_blocked'] = {
//     init: function() {
//       this.appendDummyInput()
//           .setAlign(Blockly.ALIGN_RIGHT)
//           .appendField("Move forward until blocked ")
//       this.setInputsInline(false);
//       this.setColour(195);
//       this.setPreviousStatement(true, null);
//       this.setNextStatement(true, null);
//    this.setTooltip("");
//    this.setHelpUrl("");
//     }
// };

// Blockly.Blocks['move_bw_secs'] = {
//     init: function() {
//       this.appendDummyInput()
//           .setAlign(Blockly.ALIGN_RIGHT)
//           .appendField("Move backward ")
//           .appendField(new Blockly.FieldNumber(0, 0, 255), "bw_s")
//           .appendField("s");
//       this.setInputsInline(false);
//       this.setColour(195);
//       this.setPreviousStatement(true, null);
//       this.setNextStatement(true, null);
//    this.setTooltip("");
//    this.setHelpUrl("");
//     }
// };

// Blockly.Blocks['move_bw_until_blocked'] = {
//     init: function() {
//       this.appendDummyInput()
//           .setAlign(Blockly.ALIGN_RIGHT)
//           .appendField("Move backward until blocked")
//       this.setInputsInline(false);
//       this.setColour(195);
//       this.setPreviousStatement(true, null);
//       this.setNextStatement(true, null);
//    this.setTooltip("");
//    this.setHelpUrl("");
//     }
// };

// Blockly.Blocks['turn_left_secs'] = {
//     init: function() {
//       this.appendDummyInput()
//           .setAlign(Blockly.ALIGN_RIGHT)
//           .appendField("Turn left ")
//           .appendField(new Blockly.FieldNumber(0, 0, 255), "left_s")
//           .appendField("s");
//       this.setInputsInline(false);
//       this.setColour(195);
//       this.setPreviousStatement(true, null);
//       this.setNextStatement(true, null);
//    this.setTooltip("");
//    this.setHelpUrl("");
//     }
// };

// Blockly.Blocks['turn_right_secs'] = {
//     init: function() {
//       this.appendDummyInput()
//           .setAlign(Blockly.ALIGN_RIGHT)
//           .appendField("Turn right ")
//           .appendField(new Blockly.FieldNumber(0, 0, 255), "right_s")
//           .appendField("s");
//       this.setInputsInline(false);
//       this.setColour(195);
//       this.setPreviousStatement(true, null);
//       this.setNextStatement(true, null);
//    this.setTooltip("");
//    this.setHelpUrl("");
//     }
// };

// Blockly.Blocks['show_light_secs'] = {
//     init: function() {
//       this.appendDummyInput()
//           .setAlign(Blockly.ALIGN_RIGHT)
//           .appendField("Show light ")
//           .appendField(new Blockly.FieldNumber(0, 0, 255), "light")
//           .appendField("s");
//       this.setInputsInline(false);
//       this.setColour(195);
//       this.setPreviousStatement(true, null);
//       this.setNextStatement(true, null);
//    this.setTooltip("");
//    this.setHelpUrl("");
//     }
// };



// Blockly.Blocks['robot_run'] = {
//     init: function() {
//       this.appendDummyInput()
//           .setAlign(Blockly.ALIGN_RIGHT)
//           .appendField("Robotti, aja!")
//         //   .appendField(new Blockly.FieldNumber(0, 0, 255), "kaanny_oik")
//         //   .appendField("s");
//       this.setInputsInline(false);
//       this.setColour(120);
//       this.setPreviousStatement(true, null);
//       this.setNextStatement(false, null);
//    this.setTooltip("");
//    this.setHelpUrl("");
//     }
// };
