/**
 * Blockly Demos: Code
 *
 * Copyright 2012 Google Inc.
 * https://developers.google.com/blockly/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview JavaScript for Blockly's Code demo.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

/**
 * Create a namespace for the application.
 */
var Code = {};

/**
 * PORT and HOST in the backend
 */
const HOST = 'localhost';
const PORT = 3000;

/**
 * Lookup for names of supported languages.  Keys should be in ISO 639 format.
 */
Code.LANGUAGE_NAME = {
  'en': 'English',
  'fi': 'suomi',
  'sv': 'svenska',
};

/**
 * List of RTL languages.
 */
Code.LANGUAGE_RTL = ['ar', 'fa', 'he', 'lki'];

/**
 * Blockly's main workspace.
 * @type {Blockly.WorkspaceSvg}
 */
Code.workspace = null;

/**
 * Extracts a parameter from the URL.
 * If the parameter is absent default_value is returned.
 * @param {string} name The name of the parameter.
 * @param {string} defaultValue Value to return if parameter not found.
 * @return {string} The parameter value or the default value if not found.
 */
Code.getStringParamFromUrl = function(name, defaultValue) {
  var val = location.search.match(new RegExp('[?&]' + name + '=([^&]+)'));
  return val ? decodeURIComponent(val[1].replace(/\+/g, '%20')) : defaultValue;
};

/**
 * Get the language of this user from the URL.
 * @return {string} User's language.
 */
Code.getLang = function() {
  var lang = Code.getStringParamFromUrl('lang', '');
  if (Code.LANGUAGE_NAME[lang] === undefined) {
    // Default to Finnish.
    lang = 'fi';
  }
  return lang;
};

/**
 * Is the current language (Code.LANG) an RTL language?
 * @return {boolean} True if RTL, false if LTR.
 */
Code.isRtl = function() {
  return Code.LANGUAGE_RTL.indexOf(Code.LANG) != -1;
};

/**
 * Load blocks saved on App Engine Storage or in session/local storage.
 * @param {string} defaultXml Text representation of default blocks.
 */
Code.loadBlocks = function(defaultXml) {
  try {
    var loadOnce = window.sessionStorage.loadOnceBlocks;
  } catch(e) {
    // Firefox sometimes throws a SecurityError when accessing sessionStorage.
    // Restarting Firefox fixes this, so it looks like a bug.
    var loadOnce = null;
  }
  if ('BlocklyStorage' in window && window.location.hash.length > 1) {
    // An href with #key trigers an AJAX call to retrieve saved blocks.
    BlocklyStorage.retrieveXml(window.location.hash.substring(1));
  } else if (loadOnce) {
    // Language switching stores the blocks during the reload.
    delete window.sessionStorage.loadOnceBlocks;
    var xml = Blockly.Xml.textToDom(loadOnce);
    Blockly.Xml.domToWorkspace(xml, Code.workspace);
  } else if (defaultXml) {
    // Load the editor with default starting blocks.
    var xml = Blockly.Xml.textToDom(defaultXml);
    Blockly.Xml.domToWorkspace(xml, Code.workspace);
  } else if ('BlocklyStorage' in window) {
    // Restore saved blocks in a separate thread so that subsequent
    // initialization is not affected from a failed load.
    window.setTimeout(BlocklyStorage.restoreBlocks, 0);
  }
};

/**
 * Save the blocks and reload with a different language.
 */
Code.changeLanguage = function() {
  // Store the blocks for the duration of the reload.
  // MSIE 11 does not support sessionStorage on file:// URLs.
  console.log('--a--');
  if (window.sessionStorage) {
    var xml = Blockly.Xml.workspaceToDom(Code.workspace);
    var text = Blockly.Xml.domToText(xml);
    window.sessionStorage.loadOnceBlocks = text;
  }

  var languageMenu = document.getElementById('languageMenu');
  var newLang = encodeURIComponent(
      languageMenu.options[languageMenu.selectedIndex].value);
  var search = window.location.search;
  console.log(search);
  if (search.length <= 1) {
    search = '?lang=' + newLang;
  } else if (search.match(/[?&]lang=[^&]*/)) {
    search = search.replace(/([?&]lang=)[^&]*/, '$1' + newLang);
  } else {
    search = search.replace(/\?/, '?lang=' + newLang + '&');
  }
  
  window.location = window.location.protocol + '//' +
  window.location.host + window.location.pathname + search;
  console.log('--b--');
};

/**
 * Bind a function to a button's click event.
 * On touch enabled browsers, ontouchend is treated as equivalent to onclick.
 * @param {!Element|string} el Button element or ID thereof.
 * @param {!Function} func Event handler to bind.
 */
Code.bindClick = function(el, func) {
  if (typeof el == 'string') {
    el = document.getElementById(el);
  }
  el.addEventListener('click', func, true);
  el.addEventListener('touchend', func, true);
};

// oma - oli pakko tehdä, jotta anonyymit eventlistenerit poistuvat
Code.bindClickOnce = function(el, func) {
  if (typeof el == 'string') {
    el = document.getElementById(el);
  }
  el.addEventListener('click', func, { once: true });
  el.addEventListener('touchend', func, { once: true });
};

Code.bindChange = function(el, func) {
  if (typeof el == 'string') {
    el = document.getElementById(el);
  }
  el.addEventListener('change', func, true);
};

/**
 * Load the Prettify CSS and JavaScript.
 */
Code.importPrettify = function() {
  var script = document.createElement('script');
  // script.setAttribute('src', 'https://cdn.rawgit.com/google/code-prettify/master/loader/run_prettify.js');
  script.setAttribute('src', './prettify/run_prettify.js');
  document.head.appendChild(script);
};

/**
 * Compute the absolute coordinates and dimensions of an HTML element.
 * @param {!Element} element Element to match.
 * @return {!Object} Contains height, width, x, and y properties.
 * @private
 */
Code.getBBox_ = function(element) {
  var height = element.offsetHeight;
  var width = element.offsetWidth;
  var x = 0;
  var y = 0;
  do {
    x += element.offsetLeft;
    y += element.offsetTop;
    element = element.offsetParent;
  } while (element);
  return {
    height: height,
    width: width,
    x: x,
    y: y
  };
};

/**
 * User's language (e.g. "en").
 * @type {string}
 */
Code.LANG = Code.getLang();

/**
 * List of tab names.
 * @private
 */
// Code.TABS_ = ['blocks', 'javascript', 'php', 'python', 'dart', 'lua', 'xml'];
Code.TABS_ = ['blocks', 'javascript', 'xml'];

Code.selected = 'blocks';

/**
 * Switch the visible pane when a tab is clicked.
 * @param {string} clickedName Name of tab clicked.
 */
Code.tabClick = function(clickedName) {
  // If the XML tab was open, save and render the content.
  if (document.getElementById('tab_xml').className == 'tabon') {
    var xmlTextarea = document.getElementById('content_xml');
    var xmlText = xmlTextarea.value;
    var xmlDom = null;
    try {
      xmlDom = Blockly.Xml.textToDom(xmlText);
    } catch (e) {
      var q =
          window.confirm(MSG['badXml'].replace('%1', e));
      if (!q) {
        // Leave the user on the XML tab.
        return;
      }
    }
    if (xmlDom) {
      Code.workspace.clear();
      Blockly.Xml.domToWorkspace(xmlDom, Code.workspace);
    }
  }

  if (document.getElementById('tab_blocks').className == 'tabon') {
    Code.workspace.setVisible(false);
  }
  // Deselect all tabs and hide all panes.
  for (var i = 0; i < Code.TABS_.length; i++) {
    var name = Code.TABS_[i];
    document.getElementById('tab_' + name).className = 'taboff';
    document.getElementById('content_' + name).style.visibility = 'hidden';
  }

  // Select the active tab.
  Code.selected = clickedName;
  document.getElementById('tab_' + clickedName).className = 'tabon';
  // Show the selected pane.
  document.getElementById('content_' + clickedName).style.visibility =
      'visible';
  Code.renderContent();
  if (clickedName == 'blocks') {
    Code.workspace.setVisible(true);
  }
  Blockly.svgResize(Code.workspace);
};

/**
 * Populate the currently selected pane with content generated from the blocks.
 */
Code.renderContent = function() {
  var content = document.getElementById('content_' + Code.selected);
  // Initialize the pane.
  if (content.id == 'content_xml') {
    var xmlTextarea = document.getElementById('content_xml');
    var xmlDom = Blockly.Xml.workspaceToDom(Code.workspace);
    var xmlText = Blockly.Xml.domToPrettyText(xmlDom);
    xmlTextarea.value = xmlText;
    xmlTextarea.focus();
  } else if (content.id == 'content_javascript') {
    Code.attemptCodeGeneration(Blockly.JavaScript, 'js');
  } else if (content.id == 'content_python') {
    Code.attemptCodeGeneration(Blockly.Python, 'py');
  } else if (content.id == 'content_php') {
    Code.attemptCodeGeneration(Blockly.PHP, 'php');
  } else if (content.id == 'content_dart') {
    Code.attemptCodeGeneration(Blockly.Dart, 'dart');
  } else if (content.id == 'content_lua') {
    Code.attemptCodeGeneration(Blockly.Lua, 'lua');
  }
};

/**
 * Attempt to generate the code and display it in the UI, pretty printed.
 * @param generator {!Blockly.Generator} The generator to use.
 * @param prettyPrintType {string} The file type key for the pretty printer.
 */
Code.attemptCodeGeneration = function(generator, prettyPrintType) {
  var content = document.getElementById('content_' + Code.selected);
  content.textContent = '';
  if (Code.checkAllGeneratorFunctionsDefined(generator)) {
    var code = generator.workspaceToCode(Code.workspace);

    content.textContent = code;
    if (typeof PR.prettyPrintOne == 'function') {
      code = content.textContent;
      code = PR.prettyPrintOne(code, prettyPrintType);
      content.innerHTML = code;
    }
  }
};

/**
 * Check whether all blocks in use have generator functions.
 * @param generator {!Blockly.Generator} The generator to use.
 */
Code.checkAllGeneratorFunctionsDefined = function(generator) {
  var blocks = Code.workspace.getAllBlocks(false);
  var missingBlockGenerators = [];
  for (var i = 0; i < blocks.length; i++) {
    var blockType = blocks[i].type;
    if (!generator[blockType]) {
      if (missingBlockGenerators.indexOf(blockType) === -1) {
        missingBlockGenerators.push(blockType);
      }
    }
  }

  var valid = missingBlockGenerators.length == 0;
  if (!valid) {
    var msg = 'The generator code for the following blocks not specified for '
        + generator.name_ + ':\n - ' + missingBlockGenerators.join('\n - ');
    Blockly.alert(msg);  // Assuming synchronous. No callback.
  }
  return valid;
};

/**
 * Initialize Blockly.  Called on page load.
 */
Code.init = function() {
  Code.initLanguage();

  var rtl = Code.isRtl();
  var container = document.getElementById('content_area');
  var onresize = function(e) {
    var bBox = Code.getBBox_(container);
    for (var i = 0; i < Code.TABS_.length; i++) {
      var el = document.getElementById('content_' + Code.TABS_[i]);
      el.style.top = bBox.y + 'px';
      el.style.left = bBox.x + 'px';
      // Height and width need to be set, read back, then set again to
      // compensate for scrollbars.
      el.style.height = bBox.height + 'px';
      el.style.height = (2 * bBox.height - el.offsetHeight) + 'px';
      el.style.width = bBox.width + 'px';
      el.style.width = (2 * bBox.width - el.offsetWidth) + 'px';
    }
    // Make the 'Blocks' tab line up with the toolbox.
    if (Code.workspace && Code.workspace.toolbox_.width) {
      document.getElementById('tab_blocks').style.minWidth =
          (Code.workspace.toolbox_.width - 38) + 'px';
          // Account for the 19 pixel margin and on each side.
    }

    // OMA - estää sulkemasta palikkakategoriaa UI:ssa kun palikka otettu - checkbox UI:hin?
    // if (Code.workspace)
    //   Code.workspace.toolbox_.flyout_.autoClose = false;

  };
  window.addEventListener('resize', onresize, false);

  // The toolbox XML specifies each category name using Blockly's messaging
  // format (eg. `<category name="%{BKY_CATLOGIC}">`).
  // These message keys need to be defined in `Blockly.Msg` in order to
  // be decoded by the library. Therefore, we'll use the `MSG` dictionary that's
  // been defined for each language to import each category name message
  // into `Blockly.Msg`.
  // TODO: Clean up the message files so this is done explicitly instead of
  // through this for-loop.
  for (var messageKey in MSG) {
    if (messageKey.indexOf('cat') == 0) {
      Blockly.Msg[messageKey.toUpperCase()] = MSG[messageKey];
    }
  }

  // Construct the toolbox XML, replacing translated variable names.
  var toolboxText = document.getElementById('toolbox').outerHTML;
  toolboxText = toolboxText.replace(/(^|[^%]){(\w+)}/g,
      function(m, p1, p2) {return p1 + MSG[p2];});
  var toolboxXml = Blockly.Xml.textToDom(toolboxText);

  Code.workspace = Blockly.inject('content_blocks',
      {grid:
          {spacing: 25,
           length: 3,
           colour: '#ccc',
           snap: true},
       media: './google-blockly-9ab6273/media/',
       rtl: rtl,
       toolbox: toolboxXml,
       zoom:
           {controls: true,
            wheel: true}
      });

  // Add to reserved word list: Local variables in execution environment (runJS)
  // and the infinite loop detection function.
  Blockly.JavaScript.addReservedWords('code,timeouts,checkTimeout');

  Code.loadBlocks('');

  if ('BlocklyStorage' in window) {
    // Hook a save function onto unload.
    BlocklyStorage.backupOnUnload(Code.workspace);
  }

  Code.tabClick(Code.selected);

  Code.bindClick('trashButton',
      function() {Code.discard(); Code.renderContent();});
  Code.bindClick('runButton', Code.runJS);


// Omien nappien sidonta - button bindings
  Code.bindClick('saveButton', () => Code.saveXML(Code.ohjelmanID));
  Code.bindClick('latausLista', () => Code.lataaListaTallennetuista('lataus'));
  Code.bindClick('poistoLista', () => Code.lataaListaTallennetuista('poisto'));
  Code.bindClick('valikkoAuki', () => { document.getElementById("valikko").style.width = "100%"; });
  Code.bindClick('valikkoKiinni', () => { document.getElementById("valikko").style.width = "0%"; });
  Code.bindClick('stopButton', () => { socket.emit('stop'), Code.stopUserProgram() });
  // Code.bindClick('donetestinappi', () => { socket.emit('wait', { duration: 0 })});
  Code.bindClick('tietopainike', () => { document.getElementById("tietovalikko").style.width = "100%"; });
  Code.bindClick('tietovalikkokiinni', () => { document.getElementById("tietovalikko").style.width = "0%"; });
  
  Code.confirmLoad(0);

  // Disable the link button if page isn't backed by App Engine storage.
  var linkButton = document.getElementById('linkButton');
  if ('BlocklyStorage' in window) {
    BlocklyStorage['HTTPREQUEST_ERROR'] = MSG['httpRequestError'];
    BlocklyStorage['LINK_ALERT'] = MSG['linkAlert'];
    BlocklyStorage['HASH_ERROR'] = MSG['hashError'];
    BlocklyStorage['XML_ERROR'] = MSG['xmlError'];
    Code.bindClick(linkButton,
        function() {BlocklyStorage.link(Code.workspace);});
  } else if (linkButton) {
    linkButton.className = 'disabled';
  }

  for (var i = 0; i < Code.TABS_.length; i++) {
    var name = Code.TABS_[i];
    Code.bindClick('tab_' + name,
        function(name_) {return function() {Code.tabClick(name_);};}(name));
  }
  onresize();
  Blockly.svgResize(Code.workspace);

  // Lazy-load the syntax-highlighting.
  window.setTimeout(Code.importPrettify, 1);
};

/**
 * Initialize the page language.
 */
Code.initLanguage = function() {
  // Set the HTML's language and direction.
  var rtl = Code.isRtl();
  document.dir = rtl ? 'rtl' : 'ltr';
  document.head.parentElement.setAttribute('lang', Code.LANG);

  // Sort languages alphabetically.
  var languages = [];
  for (var lang in Code.LANGUAGE_NAME) {
    languages.push([Code.LANGUAGE_NAME[lang], lang]);
  }
  var comp = function(a, b) {
    // Sort based on first argument ('English', 'Русский', '简体字', etc).
    if (a[0] > b[0]) return 1;
    if (a[0] < b[0]) return -1;
    return 0;
  };
  languages.sort(comp);
  // Populate the language selection menu.
  var languageMenu = document.getElementById('languageMenu');
  languageMenu.options.length = 0;
  for (var i = 0; i < languages.length; i++) {
    var tuple = languages[i];
    var lang = tuple[tuple.length - 1];
    var option = new Option(tuple[0], lang);
    if (lang == Code.LANG) {
      option.selected = true;
    }
    languageMenu.options.add(option);
  }
  languageMenu.addEventListener('change', Code.changeLanguage, true);

  // Inject language strings.
  document.title += ' ' + MSG['title'];
  document.getElementById('title').textContent = MSG['title'];
  document.getElementById('tab_blocks').textContent = MSG['blocks'];

  document.getElementById('linkButton').title = MSG['linkTooltip'];
  document.getElementById('runButton').title = MSG['runTooltip'];
  document.getElementById('trashButton').title = MSG['trashTooltip'];

};


// ********** OMAT ALKAA **************************

const robottikomennot = [];
let ohjelma_suorituksessa = false;
// let tauko = false;
const socket = io();
// Code.PORT = 3000;
Code.ohjelmanNimiSamaKuinLadattaessa = true;
Code.onkoLadattu = false;
Code.onkoNimeäMuutettuLataamisenJälkeen = false;
Code.ohjelmanID = 0;


socket.on('connect', () => {
  console.log('connected to a server (socket.io)');
  socket.on('disconnect', () => {
    console.log('disconnected from the server (socket.io)');
  });
});

socket.on("done", msg => {
  console.log('Vastaanotettiin "done"');
  emittoiSeuraavaKomento();
});

socket.on("stop", msg => {
  console.log('Käsketty "stop"');
  robottikomennot.length = 0;
  emittoiSeuraavaKomento();
});


const emittoiSeuraavaKomento = () => {
  let socket_event_name = robottikomennot.shift();
  let socket_emit_object = robottikomennot.shift();
  
  if (!socket_event_name && !socket_emit_object) {
    socket.emit("finished");
    ohjelma_suorituksessa ? console.log('Ohjelman suoritus loppui!') : console.log('Ohjelma ei ole käynnissä.') ;
    Code.stopUserProgram();
  }
  else if (ohjelma_suorituksessa) {
    socket.emit(socket_event_name, socket_emit_object);
    console.log(socket_event_name, socket_emit_object);
  }


}


/**
 * Execute the user's code.
 * Just a quick and dirty eval.  Catch infinite loops.
 */
Code.runJS = function() {
  Blockly.JavaScript.INFINITE_LOOP_TRAP = '  checkTimeout();\n';
  var timeouts = 0;
  var checkTimeout = function() {
    if (timeouts++ > 1000000) {
      throw MSG['timeout'];
    }
  };
  var code = Blockly.JavaScript.workspaceToCode(Code.workspace);
  Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
  try {
    robottikomennot.length = 0;
    eval(code);
  } catch (e) {
    alert(MSG['badCode'].replace('%1', e));
  }
  
  ohjelma_suorituksessa = true;
  console.log("*** ohjelma käynnistetty ***");
  emittoiSeuraavaKomento();
  Code.runStopButtonSwitch();
};

Code.stopUserProgram = () => {
  ohjelma_suorituksessa = false;
  robottikomennot.length = 0;
  Code.runStopButtonSwitch();
}


Code.runStopButtonSwitch = () => {
  if (ohjelma_suorituksessa) {
    document.getElementById("runButton").classList.remove("primary");
    document.getElementById("runButton").disabled = true; 
    document.getElementById("stopButton").classList.add("stopbutton");
    document.getElementById("stopButton").disabled = false; 
  }
  else {
    document.getElementById("runButton").classList.add("primary");
    document.getElementById("runButton").disabled = false; 
    document.getElementById("stopButton").classList.remove("stopbutton");
    document.getElementById("stopButton").disabled = true; 
  }
}



// oma
Code.saveXML = id => {

  // if (false) {
  //   if (id === 0) {
  //     // ohjelma on uusi --> id = get uusi id + 1
  //     // id = 
  //   }

  //   const nnimi = document.getElementById('saveName').value;
  //   // console.log(Code.tarkistaTallennusNimi(nnimi));
  //   Code.tarkistaTallennusNimi(nnimi);
  //   console.log('-----');
  //   return;
  // }

  let nimi = document.getElementById('saveName').value;
  if (nimi.length < 1) {
    return;
  }

  let xmlDom = Blockly.Xml.workspaceToDom(Code.workspace);
  let xmlText = Blockly.Xml.domToPrettyText(xmlDom);
  let xml = xmlText;

  xml = xml.replace(/"/g, "'");
  xml = xml.replace(/\n/g, " ");

  nimi = nimi.replace(/"/g, "\\\"");
  nimi = nimi.replace(/\n/g, " ");

  let myBody = `{"nimi":"${nimi}", "xml":"${xml}"}`;

  document.getElementById("valikko").style.width = "0%";

  const userAction = async () => {
    const response = await fetch(`http://${HOST}:${PORT}/api/tallenna/${id}`, {
      method: 'POST',
      body: myBody, // string or object
      headers: {
        'Content-Type': 'application/json'
      }
    });
  
  }
  userAction()
};


// oma
Code.lataaListaTallennetuista = tyyppi => {

    const userAction = async () => {
    const response = await fetch(`http://${HOST}:${PORT}/api/ohjelmat/`);
    const ohjelmat = await response.json();
  
    let ohjelmalista = "";

    ohjelmat.sort( (a, b) => {return b["muokattu"] > a["muokattu"]} );

    for (let o of ohjelmat) {
      let options = {
        year: 'numeric', month: 'numeric', day: 'numeric',
        hour: 'numeric', minute: 'numeric', 
        timeZone: 'Europe/Helsinki'
      };
      const muokattu = new Date(o["muokattu"]).toLocaleDateString('fi-FI', options);
      ohjelmalista += `<a href="#" id="prog-id-${o.id}" name="${o.nimi}">${o.nimi}  &nbsp;&nbsp <span class="moddate">${muokattu}</span></a>`;
    }
    
    // tämä on latauksia varten
    if (tyyppi === 'lataus') {
      document.getElementById("latauslista").innerHTML = ohjelmalista.replaceAll('prog-id-', 'load-id-');
      for (let o of document.getElementById('latauslista').childNodes) {
        Code.bindClick(o.id, () => Code.confirmLoad(o.id.replace('load-id-', '')));
      }
      document.getElementById("lataus_valikko").style.width = "100%"; 
      Code.bindClickOnce('valikkoKiinni_2', () => { document.getElementById("lataus_valikko").style.width = "0%"; });
    }
    
    // tämä on poistoja varten
    if (tyyppi === 'poisto') {
      document.getElementById("poistolista").innerHTML = ohjelmalista.replaceAll('prog-id-', 'delete-id-');
      for (let o of document.getElementById('poistolista').childNodes) {
        Code.bindClick(o.id, () => Code.confirmDelete(o.id.replace('delete-id-', '')));
      }
      document.getElementById("poistovalikko").style.width = "100%"; 
      Code.bindClick('poistovalikkokiinni', () => { document.getElementById("poistovalikko").style.width = "0%"; });
    }
    
  }

  userAction();
}


Code.confirmLoad = id => {
  if (id > 0) {
    document.getElementById("lataus_varmistus").style.width = "100%";
    Code.bindClickOnce('lataus_varmistus_yes', () => { document.getElementById("lataus_varmistus").style.width = "0%"; Code.stopUserProgram(); Code.loadSavedProgram(id); });
    Code.bindClickOnce('lataus_varmistus_cancel', () => { document.getElementById("lataus_varmistus").style.width = "0%"; });
    Code.bindClickOnce('lataus_varmistus_close', () => { document.getElementById("lataus_varmistus").style.width = "0%"; });
  }
}

// oma - confirmLoad jälkeen
Code.loadSavedProgram = id => {
  if (id === 0) {
    console.log('Ladattavan ohjelman id === 0.'); 
    return;
  }
  const userAction = async () => {
    const response = await fetch(`http://${HOST}:${PORT}/api/ohjelmat/` + id);
    const program = await response.json();
    let xml = program.xml.replace(/'/g, '"');
    document.getElementById('saveName').value = program.nimi;
    Code.workspace.clear();
    Code.loadBlocks(xml);
    document.getElementById("lataus_varmistus").style.width = "0%";
    document.getElementById("lataus_valikko").style.width = "0%";
    document.getElementById("valikko").style.width = "0%";
    // workspace.updateToolbox();
  }
  userAction()
}

Code.confirmDelete = id => {
  document.getElementById("poistonimi").innerHTML = document.getElementById(`delete-id-${id}`).getAttribute('name');
  document.getElementById("poistovarmistus").style.width = "100%";
  Code.bindClickOnce('poistovarmistus_yes', () => { document.getElementById("poistovarmistus").style.width = "0%"; Code.deleteSavedProgram(id); });
  Code.bindClickOnce('poistovarmistus_cancel', () => { document.getElementById("poistovarmistus").style.width = "0%"; });
  Code.bindClickOnce('poistovarmistus_close', () => { document.getElementById("poistovarmistus").style.width = "0%"; });
}

// oma - confirmDelete jälkeen
Code.deleteSavedProgram = id => {
  if (id === 0) {
    console.log('Poistettavan ohjelman id === 0.');
    return;
  }
  const userAction = async () => {
    fetch(`http://${HOST}:${PORT}/api/poista/` + id, {
        method: 'DELETE'
      }
    );
    document.getElementById("poistovarmistus").style.width = "0%";
    document.getElementById(`delete-id-${id}`).style.display = "none";
  }
  userAction()
}


/**
 * Discard all blocks from the workspace.
 */
Code.discard = function() {
  var count = Code.workspace.getAllBlocks(false).length;
  if (count < 2 ||
      window.confirm(Blockly.Msg['DELETE_ALL_BLOCKS'].replace('%1', count))) {
    Code.workspace.clear();
    if (window.location.hash) {
      window.location.hash = '';
    }
  }
};

// Load the Code demo's language strings.
document.write('<script src="msg/' + Code.LANG + '.js"></script>\n');
// Load Blockly's language strings.
document.write('<script src="./google-blockly-9ab6273/msg/js/' + Code.LANG + '.js"></script>\n');

window.addEventListener('load', Code.init);



// *******************************************************

// callback kokeilua
const xyz = bool => {
  console.log(bool);
  // 1) tallennaoverlay freeze
  // 2) 
  document.getElementById("valikko").style.width = "50%";
}

// callback kokeilua
Code.checkNameExists = (name, callback) => {
  const userAction = async () => {
    const response = await fetch(`http://${HOST}:${PORT}/api/nimiolemassa/`, {
      method: 'POST',
      body: `{"name":"${name}"}`, // string or object
      headers: {
        'Content-Type': 'application/json'
      }
    });
    await response.json()
    .then(data => data.exists)
    .then (callback);

  }
  userAction();

}



Code.socketCallbackTest = nimi => {

  socket.emit('getCounter', nimi, function(error, counter) {
    console.log('Counter is', counter);
  });

  // socket.emit('tarkista_nimi', 'do you think so?', function (answer) {});
  // console.log(answer);
}
