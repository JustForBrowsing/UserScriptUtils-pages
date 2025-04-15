// ==UserLibrary==
// @name            ErudaConsole
// @author          Me
// @version         0.1.0
// @description     Adds the eruda console.
// ==/UserLibrary=
// Dependencies: eruda, erudaCode, erudaMonitor, erudaTiming

console.log(`%cErudaConsole: loading...`, 'color:#4060FF;');

/* DEPENDANCIES:
    1) Imports (@requires)
        Include the following lines in the ==UserScript== block of your main User Script.
        The 'require' for UserScriptUtils.js MUST be LAST.
            
        // @require     https://cdn.jsdelivr.net/npm/eruda@3.4.1/eruda.min.js#sha256-bfOAXaBm8tuuqlR7TKg/pcfBDKi2ukNXsIl788w7mh8=
        // @require     https://cdn.jsdelivr.net/npm/eruda-code@2.2.0/eruda-code.min.js#sha256-QKv2Ow4Dvamh4teg/CpaSA0drpNKyqVUDv4bn0J8a78=
        // @require     https://cdn.jsdelivr.net/npm/eruda-monitor@1.1.1/eruda-monitor.min.js#sha256-7HNTeKKc32BEABLUmFkVDlDwYVIStEWenCnBfRSkaM4=
        // @require     https://cdn.jsdelivr.net/npm/eruda-timing@2.0.1/eruda-timing.min.js#sha256-PP95GJLgXsyqfEWOWl9d2DPDsoqUBl54vtczCjmS0Q0=
        // @require     https://raw.githubusercontent.com/JustForBrowsing/UserScriptUtils/refs/heads/main/UserScriptUtils.js
        
    2) Globals
        Declare all imports you plan to use as globals for ESLint 
        Add any addition names needed for your script.
        These should be included just AFTER the ==UserScript== block in your main User Script.
        
        // global AddEruda, USL
        // global eruda, erudaCode, erudaMonitor, erudaTiming

    3) Grants (FUTURE)
        Include the following lines in the ==UserScript== block of your main User Script.
        
        // @grant       GM_getValue
        // @grant       GM_setValue
        // @grant       GM_addStyle
*/

// I can't remember why I wanted/needed this...
// (I think it's some kind of 'fix' for iPad Safari):
document.addEventListener("touchstart", function() {}, false);

function RestoreWindowsConsole(_libId = "ErudaConsole") {
    try {
        const ogWindow = document.createElement('iframe');
        ogWindow.style.display = 'none';
        document.body.appendChild(ogWindow);
        if (window.console !== ogWindow?.contentWindow?.console &&
            ogWindow?.contentWindow?.console != null) {
            console.warn(`${_libId}:RestoreWindowsConsole: found an altered console:'...', repairing!`);
            if (ogWindow.contentWindow.console && 
                ogWindow.contentWindow.console.log) {
                window.console = ogWindow.contentWindow.console;
            }
            // NOTE: leave the iframe 'open' because it 'owns' the new console

        } else {
            // If we aren't loading it, then delete the unused iframe
            try {
                ogWindow?.parentNode?.removeChild(ogWindow);
            } catch (err) {
                console.warn(`${_libId}:RestoreWindowsConsole: Unable delete unused iframe, err: ${typeof err}: '${err.message}'.`);
            }
        }
    } catch(err) {
        console.error(`${_libId}:RestoreWindowsConsole: error while fixing altered console, err: ${typeof err}: '${err.message}'.`, err);
    }
}

function AddEruda(_libId = "ErudaConsole", options = {}) {
    const DefaultErudaPosition = { 
        x: 5,
        y: window.screen.height / 3,
    };
    
    options = options ?? {};
    options.fixConsole   = options?.fixConsole   ?? true;
    options.displaySize  = options?.displaySize  ?? 55;
    options.transparency = options?.transparency ?? 0.95;
    options.position     = options?.position     ?? DefaultErudaPosition;
 
    try {
        if (options?.fixConsole ?? true) {
             RestoreWindowsConsole(_libId);
        }
     
    } catch (err) {
        const errMsg = `${_libId}:AddEruda:Fixing Console: err: ${typeof err}: '${err.message}'.`;
        console.error(errMsg);
        alert(errMsg);
    }

    try {
        if (window.M3ERUDAINIT != null) {
            console.log(`${_libId}:AddEruda: Eruda Already Running, Jumping To (Re)Configuring Eruda`);
            return;
        
        } else {
            window.M3ERUDAINIT = 'creating';
            console.log(`${_libId}:AddEruda: Starting eruda console...`);
            eruda.init({
                   autoScale: true,
                useShadowDom: true,
                        tool: ['console', 'elements', 'info', 'sources',
                               'resources', 'network', 'settings'],
                    defaults: {
                        displaySize: options?.displaySize ?? 55,
                       transparency: options?.transparency ?? 0.95,
                    },
                    console: {
                        catchGlobalErr: true,
                           asyncRender: true,
                    },
                }
            );
            window.M3ERUDAINIT = 'created';
        }
     } catch (err) {
        const errMsg = `${_libId}:AddEruda:Creating Eruda: err: ${typeof err}: '${err.message}'.`;
        console.error(errMsg);
        alert(errMsg);
    }
 
    try {
        window.M3ERUDAINIT = 'configuring';
     
        const eConsole = eruda.get('console');
        eConsole.config.set('catchGlobalErr', true);
        eConsole.config.set('asyncRender',    true);
        eConsole.config.set('transparency',   options?.transparency ?? 0.95);
        eConsole.config.set('displaySize',    options?.displaySize ?? 55);
     
        eruda.position(options?.position ?? DefaultErudaPosition); // Set the button position
     
        window.M3ERUDAINIT = 'changingToErudaConsole';
        window.console = eConsole;
     
        window.M3ERUDAINIT = 'running';
     
    } catch (err) {
        const errMsg = `${_libId}:AddEruda:Configuring Eruda: err: ${typeof err}: '${err.message}'.`;
        console.error(errMsg);
        alert(errMsg);
     
    } finally {
        console.log(`${_libId}:AddEruda: ...Complete.`);
    }
}





















