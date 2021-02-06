var SG_Hooks = {
	showAdds : function(){		
		if( !SG_Hooks.documentLoaded ){
			throw "Softgames - start: Do not call start() before document is fully loaded. use window.onload to start your game!";
		}
		SG_Hooks.startCalled = true;
		showSpilgamesAdds();		
	}
};

SG_isInt = function(i){ return i === +i && i === (i|0); }
SG_isNothing = function(v){ return v==='' || v === null || typeof v == "undefined" }
SG_isFunction = function(f){ return typeof f == 'function'; }
SG_log = function(s){console.log(s);}
SG_load = function(){ SG_Hooks.documentLoaded = true; }

SG_check = function(){
	var failed = false;
	
	SG_log( "-------- Checking integration of Softgames-Hooks --------" );
	if( !SG_Hooks.getLanguagesCalled ){
		SG_log("SG_Hooks.getLanguage was not called. You have to call SG_Hooks.getLanguage(['en','es',...]); *after* window.onload.");
		failed = true;
	}
	
	if( !SG_Hooks.setOrientationHandlerCalled ){
		SG_log("SG_Hooks.setOrientationHandler was not called. You have to provide a game-function, that handles changes of orientation for the game.");
		failed = true;
	}

	if( !SG_Hooks.setResizeHandlerCalled ){
		SG_log("SG_Hooks.setResizeHandler was not called. You have to provide a game-function, that handles changes of window-size for the game.");
		failed = true;
	}
	
	if( !SG_Hooks.startCalled ){
		SG_log("SG_Hooks.start was not called. You have to call SG_Hooks.start(); when player starts the game.");
		failed = true;
	}
	
	if( !SG_Hooks.levelUpCalled && !SG_Hooks.gameOverCalled ){
		SG_log("You have to call SG_Hooks.levelUp or SG_Hooks.gameOver when player leveled up or game is over.");
		failed = true;
	}
	
	if( failed ){
		SG_log( "-------- Check FAILED --------" );
		return false;
	}
	else{
		SG_log( "-------- Check PASSED --------" );
		return true;
	}
}
if(window.attachEvent){ window.attachEvent("onload",SG_load); } else{ window.addEventListener("load",SG_load,true); }