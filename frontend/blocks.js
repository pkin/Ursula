
///// Uudet 2020-08-31 11.06:

Blockly.Blocks['relative_move'] = {
  init: function() {
    this.appendDummyInput()
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField("Liiku ")
      .appendField(new Blockly.FieldDropdown([
        ['eteenpäin', 'forward'],
        ['taaksepäin', 'backward']
      ]), 'move_direction')
      .appendField(" ");
    this.appendValueInput("move_angle")
      .setCheck("Number");
    this.appendDummyInput()
      .appendField("° kulmassa ");
    this.appendValueInput("move_distance")
      .setCheck("Number");
    this.appendDummyInput()
      .appendField("cm");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(212);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.JavaScript['relative_move'] = block => {
  const socket_event_name = "relative_move";
  const socket_emit_object = {
    move_direction: block.getFieldValue('move_direction'),
    move_angle: parseInt(eval(Blockly.JavaScript.valueToCode(block, 'move_angle', Blockly.JavaScript.ORDER_ATOMIC))),
    move_distance: parseInt(10 * eval(Blockly.JavaScript.valueToCode(block, 'move_distance', Blockly.JavaScript.ORDER_ATOMIC)))
  };
  return `robottikomennot.push("${socket_event_name}", ${JSON.stringify(socket_emit_object)});\n`;
};

Blockly.Blocks['turn'] = {
  init: function() {
    this.appendDummyInput()
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField("Käänny ")
      .appendField(new Blockly.FieldDropdown([
        ['oikealle', 'right'],
        ['vasemmalle', 'left']
      ]), 'turn_direction')
      .appendField(" ");
    this.appendValueInput("turn_angle")
      .setCheck("Number");
    this.appendDummyInput()
      .appendField("astetta");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(212);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.JavaScript['turn'] = block => {
  const socket_event_name = "turn";
  const socket_emit_object = {
    move_direction: block.getFieldValue('turn_direction'),
    move_angle: parseInt(eval(Blockly.JavaScript.valueToCode(block, 'turn_angle', Blockly.JavaScript.ORDER_ATOMIC)))
  };
  return `robottikomennot.push("${socket_event_name}", ${JSON.stringify(socket_emit_object)});\n`;
};

Blockly.Blocks['pick_up_color_ball'] = {
  init: function() {
    this.appendDummyInput()
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField("Poimi ")
      let field = new Blockly.FieldColour('#ff4040');
      field.setColours(
        ['#ff4040', '#40ff40', '#4040ff'],
        ['red', 'green', 'blue']);
        field.setColumns(3);
    this.appendDummyInput()
      .appendField(field, 'COLOUR')
      .appendField(' pallo ');
    this.appendDummyInput()
      .appendField(new Blockly.FieldDropdown([
        ['oikealla', 'right'],
        ['vasemmalla', 'left']
      ]), 'pick_ball_hand')
      .appendField(" kädellä ");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(212);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.JavaScript['pick_up_color_ball'] = block => {
  let ball_colour = "";
  switch (block.getFieldValue('COLOUR')) {
    case '#ff4040': ball_colour = "red"; break;
    case '#40ff40': ball_colour = "green"; break;
    case '#4040ff': ball_colour = "blue"; break;
  }
  const socket_event_name = "pick_up_color_ball";
  const socket_emit_object = {
    hand: block.getFieldValue('pick_ball_hand'),
    ball_color: ball_colour 
  };
  return `robottikomennot.push("${socket_event_name}", ${JSON.stringify(socket_emit_object)});\n`;
};

Blockly.Blocks['tts'] = {
  init: function() {
    this.appendValueInput('text')
      .setCheck(['String', 'Number'])
      .appendField("Puhu ")
      .appendField(new Blockly.FieldDropdown([
        ['suomeksi', 'fi'],
        ['ruotsiksi', 'se'],
        ['englanniksi', 'en']
      ]), 'language')
      .appendField(' ')
      .setAlign(Blockly.ALIGN_RIGHT);
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(212);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.JavaScript['tts'] = block => {
  const socket_event_name = "text";
  const socket_emit_object = {
    language: block.getFieldValue('language'),
    text: Blockly.JavaScript.valueToCode(block, 'text', Blockly.JavaScript.ORDER_NONE) || '\'\''
  };
  return `robottikomennot.push("${socket_event_name}", ${JSON.stringify(socket_emit_object)});\n`;
};

Blockly.Blocks['face'] = {
  init: function() {
    this.appendValueInput('duration')
      .setCheck('Number')
      .appendField("Näytä ")
      .appendField(new Blockly.FieldDropdown([
        ['iloinen', 'happy'],
        ['vihainen', 'angry'],
        ['surullinen', 'sad'],
        ['hämmentynyt', 'confused'],
        ['keskittynyt', 'focused']
      ]), 'expression')
      .appendField('ilme')
      .setAlign(Blockly.ALIGN_RIGHT);
    this.appendDummyInput()
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField("sekuntia");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(212);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.JavaScript['face'] = block => {
  const socket_event_name = "face";
  const socket_emit_object = {
    type: block.getFieldValue('expression'),
    duration: parseInt(1000 * eval(Blockly.JavaScript.valueToCode(block, 'duration', Blockly.JavaScript.ORDER_ATOMIC)))
  };
  return `robottikomennot.push("${socket_event_name}", ${JSON.stringify(socket_emit_object)});\n`;
};

Blockly.Blocks['emote'] = {
  init: function() {
    this.appendDummyInput()
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField("Do ")
      .appendField(new Blockly.FieldDropdown([
        ['dab', 'dab'],
        ['flosh', 'flosh'],
        ['best mates', 'best_mates'],
        ['facepalm', 'facepalm'],
        ['t-pose', 't-pose'],
        ['egypt', 'egypt'],
        ['dance', 'dance']
      ]), 'emote_type')
      .appendField("!")
      .setAlign(Blockly.ALIGN_RIGHT);
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(212);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.JavaScript['emote'] = block => {
  const socket_event_name = "emote";
  const socket_emit_object = {
    type: block.getFieldValue('emote_type')
  };
  return `robottikomennot.push("${socket_event_name}", ${JSON.stringify(socket_emit_object)});\n`;
};

Blockly.Blocks['open_hand'] = {
  init: function() {
    this.appendDummyInput()
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField("Avaa ")
      .appendField(new Blockly.FieldDropdown([
        ['oikea', 'right'],
        ['vasen', 'left']
      ]), 'side')
      .appendField(" koura (vai käsi?)")
      .setAlign(Blockly.ALIGN_RIGHT);
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(212);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.JavaScript['open_hand'] = block => {
  const socket_event_name = "open_hand";
  const socket_emit_object = {
    side: block.getFieldValue('side')
  };
  return `robottikomennot.push("${socket_event_name}", ${JSON.stringify(socket_emit_object)});\n`;
};

Blockly.Blocks['close_hand'] = {
  init: function() {
    this.appendDummyInput()
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField("Sulje ")
      .appendField(new Blockly.FieldDropdown([
        ['oikea', 'right'],
        ['vasen', 'left']
      ]), 'side')
      .appendField(" koura (vai käsi?)")
      .setAlign(Blockly.ALIGN_RIGHT);
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(212);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.JavaScript['close_hand'] = block => {
  const socket_event_name = "close_hand";
  const socket_emit_object = {
    side: block.getFieldValue('side')
  };
  return `robottikomennot.push("${socket_event_name}", ${JSON.stringify(socket_emit_object)});\n`;
};

Blockly.Blocks['pick_up_40mm_ball'] = {
  init: function() {
    this.appendDummyInput()
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField("Poimi ")
      .appendField(new Blockly.FieldDropdown([
        ['oikealla', 'right'],
        ['vasemmalla', 'left']
      ]), 'pick_ball_hand')
      .appendField(" kädellä pallo pisteestä");
    this.appendValueInput("x")
      .appendField(" x")
      .setCheck("Number");
    this.appendValueInput("y")
      .appendField(" y")
      .setCheck("Number");
    this.appendValueInput("z")
      .appendField(" z")
      .setCheck("Number");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(212);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.JavaScript['pick_up_40mm_ball'] = block => {
  const socket_event_name = "pick_up_40mm_ball";
  const socket_emit_object = {
    hand: block.getFieldValue('pick_ball_hand'),
    x: parseInt(eval(Blockly.JavaScript.valueToCode(block, 'x', Blockly.JavaScript.ORDER_ATOMIC))),
    y: parseInt(eval(Blockly.JavaScript.valueToCode(block, 'y', Blockly.JavaScript.ORDER_ATOMIC))),
    z: parseInt(eval(Blockly.JavaScript.valueToCode(block, 'z', Blockly.JavaScript.ORDER_ATOMIC)))
  };
  return `robottikomennot.push("${socket_event_name}", ${JSON.stringify(socket_emit_object)});\n`;
};

Blockly.Blocks['drop_off_40mm_ball'] = {
  init: function() {
    this.appendDummyInput()
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField("Laske ")
      .appendField(new Blockly.FieldDropdown([
        ['oikeasta', 'right'],
        ['vasemmasta', 'left']
      ]), 'drop_off_ball_hand')
      .appendField(" kädellä pallo pisteeseen");
    this.appendValueInput("x")
      .appendField(" x")
      .setCheck("Number");
    this.appendValueInput("y")
      .appendField(" y")
      .setCheck("Number");
    this.appendValueInput("z")
      .appendField(" z")
      .setCheck("Number");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(212);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.JavaScript['drop_off_40mm_ball'] = block => {
  const socket_event_name = "drop_off_40mm_ball";
  const socket_emit_object = {
    hand: block.getFieldValue('drop_off_ball_hand'),
    x: parseInt(eval(Blockly.JavaScript.valueToCode(block, 'x', Blockly.JavaScript.ORDER_ATOMIC))),
    y: parseInt(eval(Blockly.JavaScript.valueToCode(block, 'y', Blockly.JavaScript.ORDER_ATOMIC))),
    z: parseInt(eval(Blockly.JavaScript.valueToCode(block, 'z', Blockly.JavaScript.ORDER_ATOMIC))) 
  };
  return `robottikomennot.push("${socket_event_name}", ${JSON.stringify(socket_emit_object)});\n`;
};

Blockly.Blocks['wait'] = {
  init: function() {
    this.appendDummyInput()
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField("Odota");
    this.appendValueInput("duration")
      .setCheck("Number");
    this.appendDummyInput()
      .appendField("sekuntia");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(212);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.JavaScript['wait'] = block => {
  const socket_event_name = "wait";
  const socket_emit_object = {
    duration: parseInt(1000 * eval(Blockly.JavaScript.valueToCode(block, 'duration', Blockly.JavaScript.ORDER_NONE)))
  };
  // console.log(eval(Blockly.JavaScript.valueToCode(block, 'duration', Blockly.JavaScript.ORDER_NONE)));
  // console.log(eval(Number(Blockly.JavaScript.valueToCode(block, 'duration', Blockly.JavaScript.ORDER_NONE))));
  // console.log(Number(eval(Blockly.JavaScript.valueToCode(block, 'duration', Blockly.JavaScript.ORDER_NONE))));
  return `robottikomennot.push("${socket_event_name}", ${JSON.stringify(socket_emit_object)});\n`;
};








// TESTIKÄSKYT //

Blockly.FieldAngle.CLOCKWISE = true;
Blockly.FieldAngle.OFFSET = 90;
Blockly.FieldAngle.WRAP = (-180, 180);
// Blockly.FieldAngle.ROUND = 5;


Blockly.Blocks['tts2'] = {
  /**
   * Block for trimming spaces.
   * @this {Blockly.Block}
   */
  init: function() {
    var OPERATORS = [
      [Blockly.Msg['TEXT_TRIM_OPERATOR_BOTH'], 'BOTH'],
      [Blockly.Msg['TEXT_TRIM_OPERATOR_LEFT'], 'LEFT'],
      [Blockly.Msg['TEXT_TRIM_OPERATOR_RIGHT'], 'RIGHT']
    ];
    this.setHelpUrl(Blockly.Msg['TEXT_TRIM_HELPURL']);
    this.setStyle('text_blocks');
    this.appendValueInput('TEXT')
        .setCheck('String')
        .appendField(new Blockly.FieldDropdown(OPERATORS), 'MODE');
    this.setOutput(true, 'String');
    this.setTooltip(Blockly.Msg['TEXT_TRIM_TOOLTIP']);
  }
};


Blockly.Blocks['liiku_1'] = {
  init: function() {
    this.appendDummyInput()
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField("Liiku ")
      .appendField(new Blockly.FieldDropdown([
        ['eteenpäin', 'eteenpäin'],
        ['taaksepäin', 'taaksepäin']
      ]), 'liikkuminen_temp3')
      .appendField(" ");
    this.appendValueInput("määrä")
      .setCheck("Number");
    this.appendDummyInput()
      .appendField(" mm(?), kulma(?)");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(212);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.JavaScript['liiku_1'] = function(block) {
  const määrä = Blockly.JavaScript.valueToCode(block, 'määrä', Blockly.JavaScript.ORDER_ATOMIC);
  var dropdown_name = block.getFieldValue('NAME');
  console.log(määrä);
    // return 'var socket = io.connect('+ value_ip +'); \n';
  return ";";
};

Blockly.Blocks['käänny_1'] = {
  init: function() {
    this.appendDummyInput()
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField("Käänny ")
      .appendField(new Blockly.FieldDropdown([
        ['oikealle', 'oikea'],
        ['vasemmalle', 'vasen']
      ]), 'kääntyminen')
      .appendField(" ");
    this.appendValueInput("kulma")
      .setCheck("Number");
    this.appendDummyInput()
      .appendField(" astetta");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(212);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.JavaScript['käänny_1'] = function(block) {
  return ";";
};
Blockly.JavaScript['käänny_2'] = function(block) {
  return ";";
};

Blockly.Blocks['käänny_2'] = {
  
  init: function() {
    this.appendDummyInput()
      .appendField('Käänny ')
      .appendField(new Blockly.FieldAngle(0), 'KULMA');
    this.appendDummyInput()
      // .setAlign(Blockly.ALIGN_RIGHT)
      .appendField(" astetta");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(212);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

// Blockly.JavaScript['käänny_1'] = function(block) {
//   var value_ip = Blockly.JavaScript.valueToCode(block, 'ip', Blockly.JavaScript.ORDER_ATOMIC);
//   var dropdown_name = block.getFieldValue('NAME');
 
//   return 'var socket = io.connect('+ value_ip +'); \n';
// };

 
Blockly.Blocks['temp4'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('angle:')
        .appendField(new Blockly.FieldAngle(90), 'FIELDNAME');
  }
};

Blockly.JavaScript['temp4'] = function(block) {
  // var value_ip = Blockly.JavaScript.valueToCode(block, 'FIELDNAME', Blockly.JavaScript.ORDER_ATOMIC);
  var dropdown_name = block.getFieldValue('FIELDNAME');
  console.log(dropdown_name);
  return ";";
};



Blockly.Blocks['ttemp_print'] = {
    /**
     * Block for print statement.
     * @this {Blockly.Block}
     */
    init: function() {
      this.jsonInit({
        // "message0": Blockly.Msg['TEXT_PRINT_TITLE'],
        "message0": Blockly.Msg['höpöphpöhphöhphö %1'],
        "args0": [
          {
            "type": "input_value",
            "name": "TEXT"
          }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "style": "text_blocks",
        "tooltip": Blockly.Msg['TEXT_PRINT_TOOLTIP'],
        "helpUrl": Blockly.Msg['TEXT_PRINT_HELPURL']
      });
    }
  };

  Blockly.JavaScript['ttemp_print'] = function(block) {
    // Print statement.
    var msg = Blockly.JavaScript.valueToCode(block, 'TEXT',
        Blockly.JavaScript.ORDER_NONE) || '\'\'';
    return 'window.alert(' + msg + ');\n';
  };


//   ****

  Blockly.Blocks['temp1'] = {
    init: function() {
        this.jsonInit({
        
            "type": "liikkuminen",
            "message0": 'Liiku %1 cm %2 ',
            "args0": [
                {
                    "type": "input_value",
                    "name": "VALUE",
                    "check": "Number"
                },
                {
                    "type": "field_dropdown",
                    "name": "FIELDNAME",
                    "options": [
                      [ "oikealle", "LEFT" ],
                      [ "vasemmalle", "RIGHT" ]
                    ]
                  }
              
            ],
            // "output": "Number",
            "previousStatement": true,
            "colour": 210,
            "tooltip": "Returns number of letters in the provided text.",
            "helpUrl": "http://www.w3schools.com/jsref/jsref_length_string.asp"
        });
      }      
  };

  Blockly.JavaScript['temp1'] = function(block) {
    // Print statement.
    var msg = Blockly.JavaScript.valueToCode(block, 'TEXT',
        Blockly.JavaScript.ORDER_NONE) || '\'\'';
    return 'window.alert(' + msg + ');\n';
  };

  Blockly.Blocks['temp2'] = {
    init: function() {
        this.jsonInit({
        
            "type": "kääntyminen",
            "message0": 'Käännyt %1 astetta %2 ',
            "args0": [
                {
                    "type": "input_value",
                    "name": "VALUE",
                    "check": "Number"
                },
                {
                    "type": "field_dropdown",
                    "name": "FIELDNAME",
                    "options": [
                      [ "oikealle", "LEFT" ],
                      [ "vasemmalle", "RIGHT" ]
                    ]
                  }
              
            ],
            // "output": "Number",
            "previousStatement": true,
            "colour": 210,
            "tooltip": "Returns number of letters in the provided text.",
            "helpUrl": "http://www.w3schools.com/jsref/jsref_length_string.asp"
        });
      }      
  };

  Blockly.JavaScript['temp2'] = function(block) {
    // Print statement.
    var msg = Blockly.JavaScript.valueToCode(block, 'TEXT',
        Blockly.JavaScript.ORDER_NONE) || '\'\'';
    return 'window.alert(' + msg + ');\n';
  };

// ****




Blockly.Blocks['liiku_eteen_cm'] = {
    init: function() {
        this.setPreviousStatement(true, null);
        this.appendDummyInput()
          .setAlign(Blockly.ALIGN_RIGHT)
          .appendField("Liiku eteenpäin ")
          .appendField(new Blockly.FieldNumber(0, 0, 9999), "eteen_cm")
          .appendField(" cm");
        this.setInputsInline(false);
        this.setColour(195);
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



// ÄÄÄ



Blockly.Blocks['test_block_2'] = {
    init: function() {
      this.appendValueInput("teksti")
          .setCheck("String")
          .appendField("Testiteksti:");
      this.setInputsInline(false);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(230);
            this.setTooltip("");
    this.setHelpUrl("");
        }
  
  };
  
   
  
  //----------------------------------------------------------------------------------------------------------------------------------------------------------------
  
   
  
  Blockly.JavaScript['test_block_2'] = (block) => {
  
    let value_ip = Blockly.JavaScript.valueToCode(block, 'teksti', Blockly.JavaScript.ORDER_ATOMIC);
    let dropdown_name = block.getFieldValue('NAME');
    return 'io.connect('+ value_ip +'); \n';
    // return 'let socket = io.connect('+ value_ip +'); \n';
  };

/// ÖÖÖ



//----------------------------------------------------------------------------------------------------------------------------------------------------------------
 
Blockly.Blocks['send'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("Send")
          .appendField(new Blockly.FieldDropdown([["happy","happy"], ["angry","angry"], ["sad","sad"]]), "type");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(230);
  this.setTooltip("");
  this.setHelpUrl("");
    }
  };
   
  //----------------------------------------------------------------------------------------------------------------------------------------------------------------
   
  Blockly.Blocks['test_block'] = {
    init: function() {
      this.appendValueInput("ip")
          .setCheck("String")
          .appendField("Host ip:");
      this.setInputsInline(false);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(230);
  this.setTooltip("");
  this.setHelpUrl("");
    }
  };
   
  //----------------------------------------------------------------------------------------------------------------------------------------------------------------
   
  Blockly.JavaScript['test_block'] = function(block) {
    var value_ip = Blockly.JavaScript.valueToCode(block, 'ip', Blockly.JavaScript.ORDER_ATOMIC);
    var dropdown_name = block.getFieldValue('NAME');
   
    return 'var socket = io.connect('+ value_ip +'); \n';
  };
   
  //----------------------------------------------------------------------------------------------------------------------------------------------------------------
   
  Blockly.JavaScript['send'] = function(block) {
    var dropdown_type = block.getFieldValue('type');
    if (dropdown_type==="happy"){
           var code = 'socket.emit("face", { type: "happy", duration: 3000 }); \n';
    }
    if (dropdown_type==="angry"){
           var code = 'socket.emit("face", { type: "angry", duration: 3000 }); \n';
    }
    if (dropdown_type==="sad"){
           var code = 'socket.emit("face", { type: "sad", duration: 3000 }); \n';
    }
    return code;
  };
   
  //----------------------------------------------------------------------------------------------------------------------------------------------------------------


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
