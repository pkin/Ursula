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
 * PORT of backend -- huom: jotain vielä kovakoodattu
 */
const PORT = 3000;

/**
 * Lookup for names of supported languages.  Keys should be in ISO 639 format.
 */
Code.LANGUAGE_NAME = {
  // 'ar': 'العربية',
  // 'be-tarask': 'Taraškievica',
  // 'br': 'Brezhoneg',
  // 'ca': 'Català',
  // 'cs': 'Česky',
  // 'da': 'Dansk',
  // 'de': 'Deutsch',
  // 'el': 'Ελληνικά',
  'en': 'English',
  // 'es': 'Español',
  // 'et': 'Eesti',
  // 'fa': 'فارسی',
  'fi': 'Finnish',
  // 'fr': 'Français',
  // 'he': 'עברית',
  // 'hrx': 'Hunsrik',
  // 'hu': 'Magyar',
  // 'ia': 'Interlingua',
  // 'is': 'Íslenska',
  // 'it': 'Italiano',
  // 'ja': '日本語',
  // 'kab': 'Kabyle',
  // 'ko': '한국어',
  // 'mk': 'Македонски',
  // 'ms': 'Bahasa Melayu',
  // 'nb': 'Norsk Bokmål',
  // 'nl': 'Nederlands, Vlaams',
  // 'oc': 'Lenga d\'òc',
  // 'pl': 'Polski',
  // 'pms': 'Piemontèis',
  // 'pt-br': 'Português Brasileiro',
  // 'ro': 'Română',
  // 'ru': 'Русский',
  // 'sc': 'Sardu',
  // 'sk': 'Slovenčina',
  // 'sr': 'Српски',
  'sv': 'Svenska',
  // 'ta': 'தமிழ்',
  // 'th': 'ภาษาไทย',
  // 'tlh': 'tlhIngan Hol',
  // 'tr': 'Türkçe',
  // 'uk': 'Українська',
  // 'vi': 'Tiếng Việt',
  // 'zh-hans': '简体中文',
  // 'zh-hant': '正體中文'
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

// oma
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
    if (Code.workspace)
      Code.workspace.toolbox_.flyout_.autoClose = false;

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


// Omien nappien sidonta
  Code.bindClick('saveButton', Code.saveXML);
  Code.bindClick('testLista', Code.lataaListaTallennetuista);
  // Code.bindClick('loadButton', Code.loadXML);
  // Code.bindClick('saves', Code.loadSaves);
  // Code.bindChange('saves', Code.selectSave);
  Code.bindClick('valikkoAuki', () => { document.getElementById("valikko").style.width = "100%"; });
  Code.bindClick('valikkoKiinni', () => { document.getElementById("valikko").style.width = "0%"; });
  Code.bindClick('valikkoKiinni_2', () => { document.getElementById("lataus_valikko").style.width = "0%"; });
  // Code.bindClick('closeLoadOverlay', () => { document.getElementById('overlay').hidden = true });
  Code.lataaListaTallennetuista();


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

let robottikomennot = [];
let ohjelma_suorituksessa = false;
let tauko = false;

const socket = io();

socket.on('robottikomento', msg => {
  if (msg == 'komento_valmis' && ohjelma_suorituksessa && !tauko)
    emittoiSeuraavaKomento();
    console.log(ohjelma_suorituksessa);
});

const emittoiSeuraavaKomento = () => {
  if (!ohjelma_suorituksessa && tauko)
    return;
  let seuraava = robottikomennot.shift();
  if (seuraava === undefined) {
    socket.emit('robottikomento', 'loppu');
    ohjelma_suorituksessa = false;
    console.log('ohjelma loppu');
  }
  else {
    socket.emit('robottikomento', seuraava);
    console.log(seuraava);
  }
}


// Code.näytäTallennetutOhjelmat = () => {
  
//   Code.lataaListaTallennetuista();


//   // console.log(ohjelmaluettelo);

//   // document.getElementById("ohjelmalista").innerHTML = '<a href="#">dickbutt2</a>';

  
  
//   // document.getElementById("lista_ohjelmista").value = lista_ohjelmista;
// }

{
// const emittoiTauko = () => {
//   socket.emit('robottikomento', 'tauko');
//   console.log('ohjelman suorituksessa tauko');
// }

// const emittoiStop = () => {  // ei pelkästää emittoi
//   socket.emit('robottikomento', 'stop');
//   console.log('ohjelma ajo lopetettu');
// }



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
    // console.log(code);
    eval(code);
  } catch (e) {
    alert(MSG['badCode'].replace('%1', e));
  }
  
  ohjelma_suorituksessa = true;
  let i = 1;
  console.log('---------------------------------------------------------------------');
  console.log("ohjelma käynnistetty");
  

  // tauhka 1
};









Code.PORT = 3000;

Code.ohjelmanNimiSamaKuinLadattaessa = true;
Code.onkoLadattu = false;
Code.onkoNimeäMuutettuLataamisenJälkeen = false;


// tarkista onko ohjelman nimi jo tallennettu palvelimen tallennukset-hakemistoon
Code.tarkistaTallennusNimi = nimi => {
  const userAction = async () => {
    const response = await fetch(`http://localhost:${PORT}/api/saveXML3/${id}`, {
      method: 'POST',
      body: myBody, // string or object
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
  userAction()
  return false;
}


// *** tästä tästä

// oma
Code.saveXML = function() {

  var xmlDom = Blockly.Xml.workspaceToDom(Code.workspace);
  var xmlText = Blockly.Xml.domToPrettyText(xmlDom);
  let xml = xmlText;
  let nimi = document.getElementById('saveName').value;

  xml = xml.replace(/"/g, "'");
  xml = xml.replace(/\n/g, " ");

  nimi = nimi.replace(/"/g, "\\\"");
  nimi = nimi.replace(/\n/g, " ");

  // const id = new Date(Date.now()).toISOString();
  const id = 123;
  console.log(id);
  // return;
    
  
  // let myBody = '{"xml":\"' + xml + '\"}'

  let myBody = `{"nimi":"${nimi}", "xml":"${xml}"}`;
  // let myBody = '{"nimi:"' + nimi + '", "xml":\"' + xml + '\"}'

  const userAction = async () => {
    // const response = await fetch('http://localhost:/api/saveXML3/' + id, {
    // const response = await fetch('http://localhost:' + PORT + '/api/saveXML3/' + id, {
    const response = await fetch(`http://localhost:${PORT}/api/saveXML3/${id}`, {
      method: 'POST',
      body: myBody, // string or object
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  userAction()

};


}

// oma
Code.lataaListaTallennetuista = () => {

   const userAction = async () => {
    const response = await fetch('http://localhost:3000/api/ohjelmat/');
    const ohjelmat = await response.json();
  
    let ohjelmalista = "";

    ohjelmat.sort( (a, b) => {return b["muokattu"] > a["muokattu"]} );


    for (let o of ohjelmat) {
      let options = {
        year: 'numeric', month: 'numeric', day: 'numeric',
        hour: 'numeric', minute: 'numeric', 
        timeZone: 'Europe/Helsinki'
      };
        // const muokattu = o["muokattu"].replace("T", " ");
        const muokattu = new Date(o["muokattu"]).toLocaleDateString('fi-FI', options);
        // ohjelmalista += '<a href="#">' + o["nimi"] + '</a>';
        ohjelmalista += `<a href="#">${o["nimi"]} - ${muokattu}</a>`;
    }

    document.getElementById("ohjelmalista").innerHTML = ohjelmalista;
    document.getElementById("lataus_valikko").style.width = "100%"; 

    // Code.workspace.clear();
    // Code.loadBlocks(xml);
  }

  userAction();
}



// oma
Code.loadXML = function() {

  const id = document.getElementById('saveName').value

  const userAction = async () => {
    const response = await fetch('http://localhost:3000/api/saveXML2/' + id);
    const xml = await response.text();
    Code.workspace.clear();
    Code.loadBlocks(xml);
  }

  userAction()

};

// oma
Code.loadSaves = () => {

  const userAction = async () => {
    const response = await fetch('http://localhost:3000/api/saveXML3/');
    const list = await response.text();
    document.getElementById('saves').innerHTML = '<option disabled selected value></option>' + list;
  }
  userAction()
}

Code.selectSave = () => {
  let e = document.getElementById('saves');
  document.getElementById('saveName').value = e.options[e.selectedIndex].value;

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




// ***** VANHAA TAUHKAA - luultavasti ei tarvita ******


  // tauhka 1

    // *** ei käytössä, koska siirryimme socket.io:hon
    // try {
    //   // Code.robotCommandLoop(); // uusi koe
    //   // Code.sendRobotCommandsToBackend(); // vanha
    //   // Code.socketTest(); // yhteyskoe
    //   // robottikomennot = [];
    // } catch (e) {
    //   alert(MSG['badCode'].replace('%1', e));
    // }



  // tauhka 2
    // const userAction = async () => {
    //   const response = await fetch('http://localhost:3000/api/testFlag/');
    //   const robot_command = await response.text();
    //   console.log(robot_command);
    // }
    // userAction()


// Code.sendRobotCommandsToBackend = () => {

  //   console.log(robottikomennot);
    
  //   let myBody = '{"komennot": "' + robottikomennot + '"}';
  //   console.log(myBody);
  
  //   const userAction = async () => {
  //     const response = await fetch('http://localhost:' + PORT + '/api/postRobotCommands/', {
  //       method: 'POST',
  //       body: myBody, // string or object
  //       headers: {
  //         'Content-Type': 'application/json'
  //       }
  //     });
  //   }
  
  //   userAction();
    
      // }




// Code.socket.on("flag", (data) => {
//   socket.emit('robot_command', robottikomennot.shift());
// });


// Code.robotCommandLoop = () => {

//   while (robottikomennot.length > 0) {

//     socket.on("flag", (data) => {
//       socket.emit('robot_command', robottikomennot.shift());
//     });
  
//   }
// }

// Code.robotCommandLoop = () => {

//   let can_continue = false;

//   while (robottikomennot.length > 0) {

//     socket.on("flag", (data) => {
//       can_continue = true; 
//     });
  
//     socket.emit('robot_command', robottikomennot.shift());
  
//   }

// }

// yhteyskoe
// Code.socketTest = () => {
//   socket.emit('robot_command', "robokomento tässä hei");
// }





// const runTestCommand = () => {

//   if (robottikomennot.length > 0) {

//     document.getElementById("testiemittori").hidden = false;
//   } else {
//     console.log("ohjelma loppu");    
//     document.getElementById("testiemittori").hidden = true;

//   }
// }


// // oma
// Code.testFlag = () => {

//   fetch('http://localhost:3000/api/testFlag/');

//   // tauhka 2
// }

