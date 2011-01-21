/*
* langlet crossbrowser translation bookmarklet for text selections
* Copyright (c) 2011 Patrick Wied
* This code is licensed under the terms of the MIT LICENSE
* http://letmein.at/experiments/langlet/
*/

// TODO: dynamic tooltip positioning (left/right/top/bottom depending on cursor position)

(function(){
	var lL = (function(){
		// private variables
		var version = '0.1.1',
		status = false,
		backend = "http://letmein.at/experiments/langlet/backend/",
		cssReset = "padding:0;margin:0;",
		translateFrom = "en",
		translateTo = "fr",
		scriptExt = {},
		body = document.getElementsByTagName("body")[0],
		eventData = null,
		// private functions
		$ = function(id){ return document.getElementById(id); },
		getSelection = function(){
			  if(window.getSelection) { return window.getSelection(); }
			  else if(document.getSelection) { return document.getSelection(); }
			  else {
			    var selection = document.selection && document.selection.createRange();
			    if(selection.text) { return selection.text; }
			    return false;
			  }
			  return false;
		},
		selectionHandler = function(ev){
			// get the selected text
			var selection = getSelection();
			$('langlet_tooltip').style.display = "none";
			if(selection){
				selection = new String(selection).replace(/^\s+|\s+$/g,'');
				if(selection.length > 0){
					scriptExt = document.createElement("script");
					scriptExt.src = [backend, "?text=", selection, "&from=", translateFrom, "&to=", translateTo].join("");
					body.appendChild(scriptExt);
					// storing the event
					eventData = (document.all?{pageX: event.clientX + document.documentElement.scrollLeft, pageY: event.clientY + document.documentElement.scrollTop}:ev);
				}
		
			}
			
		},
		generateOverlay = function(){
			var node = document.createElement("div");
			node.id = "langlet_overlay";
			node.style.cssText = cssReset + "z-index:1000000;letter-spacing:0;position:fixed;bottom:0;width:275px;" + 
				"color:#444;font:12px/13px 'Helvetica Neue', Verdana, Arial, sans serif;background-color:#CCE6FF;" +
				"padding:15px;left:200px;border:2px solid #66B3FF;-moz-border-radius:10px;-webkit-border-radius:10px;border-radius:10px;";
			node.innerHTML = "<div style='" + cssReset + "float:right;cursor:pointer;' onclick='javascript:lL.cleanUp()'>(Close)</div><a href='http://letmein.at/experiments/langlet/' target='_blank'><h2 style='" + cssReset + "padding-bottom:10px;color:black;text-align:center;text-decoration:none;'>langlet "+version+"</h2></a>"+
				"<div style='" + cssReset + "'>Translate <select onchange='javascript:lL.setLanguage(\"from\", this.options[this.selectedIndex].value );'><option value='en'>English</option><option value='de'>German</option><option value='fr'>French</option><option value='es'>Spanish</option><option value='it'>Italian</option></select> into <select onchange='javascript:lL.setLanguage(\"to\", this.options[this.selectedIndex].value );'><option value='en'>English</option><option value='de'>German</option><option value='fr' selected>French</option><option value='es'>Spanish</option><option value='it'>Italian</option></select></div>" + 
				"<div id='langlet_status' style='" + cssReset + "cursor:pointer;margin-top:15px;padding:5px;border:1px solid black;background-color:#E0E0E0;' onclick='javascript:lL.toggleStatus();'><b>Enable Plugin</b></div>";
			return node;
		},
		generateTooltip = function(){
			var node = document.createElement("div");
			node.id = "langlet_tooltip";
			node.style.cssText = cssReset + "z-index:1000000;letter-spacing:0;position:absolute;display:none;" + 
				"color:#444;font:12px/13px 'Helvetica Neue', Verdana, Arial, sans serif;background-color:white;padding:10px;padding-top:5px;padding-bottom:5px;border:1px solid #444;-moz-border-radius:5px;-webkit-border-radius:5px;border-radius:5px;width:auto;";
			return node;
		}
		// public interface
		return {
			init: function(){
				// if langlet overlay doesnt exist
				if(!$('langlet_overlay')){
					// add the ui overlay
					var overlay = generateOverlay();
					body.appendChild(overlay);
					
					// add the tooltip
					var tooltip = generateTooltip();
					body.appendChild(tooltip);
				}
			},
			translatedText: function(text){
				// after the callback function was invoked -> remove the script
				body.removeChild(scriptExt);
				var tooltip = $('langlet_tooltip');
				tooltip.innerHTML = (text + " <br /><span style='font-size:10px;'>| Translation result powered by Google</span>");
				// tooltip positioning
				// TODO: dynamic positioning (left/right/top/bottom depending on cursor position)
				tooltip.style.top =  (eventData.pageY+8) + 'px';
				tooltip.style.left = (eventData.pageX+8) + 'px';
				tooltip.style.display = "block";
			},
			toggleStatus: function(){
				status = !status;
			
				if(status){
					// manipulate ui
					var s = $('langlet_status');
					s.innerHTML = "<b style='color:white;'>Disable Plugin</b>";
					s.style.backgroundColor = "#00CC33";
					// append handlers
					// IE
					window.attachEvent && document.attachEvent("onmouseup", selectionHandler);
					// others
					window.addEventListener && window.addEventListener("mouseup", selectionHandler , false);
					
					
				}else{
					// manipulate ui
					var s = $('langlet_status');
					s.innerHTML = "<b>Enable Plugin</b>";
					s.style.backgroundColor = "#E0E0E0";
					// remove handlers
					// IE
					window.detachEvent && document.detachEvent("onmouseup", selectionHandler);
					// others
					window.removeEventListener && window.removeEventListener("mouseup", selectionHandler , false);
				}
			},
			setLanguage: function(which, value){
				if(which == 'from')
					translateFrom = value;
				else
					translateTo = value;
			},
			cleanUp: function(){
				body.removeChild($('langlet_overlay'));
				body.removeChild($('langlet_tooltip'));
				if(status)
					// remove handlers
					// IE
					window.detachEvent && document.detachEvent("onmouseup", selectionHandler);
					// others
					window.removeEventListener && window.removeEventListener("mouseup", selectionHandler , false);
			}
		};
	})();
	
	if(!window.lL) window.lL = lL;

	lL.init();
})();