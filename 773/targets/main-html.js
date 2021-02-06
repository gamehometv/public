(function () { "use strict";
var $hxClasses = {},$estr = function() { return js_Boot.__string_rec(this,''); };
function $extend(from, fields) {
	function Inherit() {} Inherit.prototype = from; var proto = new Inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var EReg = function(r,opt) {
	opt = opt.split("u").join("");
	this.r = new RegExp(r,opt);
};
$hxClasses["EReg"] = EReg;
EReg.__name__ = ["EReg"];
EReg.prototype = {
	match: function(s) {
		if(this.r.global) this.r.lastIndex = 0;
		this.r.m = this.r.exec(s);
		this.r.s = s;
		return this.r.m != null;
	}
	,matched: function(n) {
		if(this.r.m != null && n >= 0 && n < this.r.m.length) return this.r.m[n]; else throw "EReg::matched";
	}
	,matchedPos: function() {
		if(this.r.m == null) throw "No string matched";
		return { pos : this.r.m.index, len : this.r.m[0].length};
	}
	,split: function(s) {
		var d = "#__delim__#";
		return s.replace(this.r,d).split(d);
	}
	,__class__: EReg
};
var G = function() { };
$hxClasses["G"] = G;
G.__name__ = ["G"];
G.saveHiScore = function(score) {
	if(score > G.HI_SCORE) G.HI_SCORE = score; else return;
	yzi_YZI.saveData("hi_score",G.HI_SCORE);
};
G.loadHiScore = function() {
	var d = yzi_YZI.loadData("hi_score");
	if(d > 0) G.HI_SCORE = d; else G.HI_SCORE = 0;
};
var flambe_math_Point = function(x,y) {
	if(y == null) y = 0;
	if(x == null) x = 0;
	this.x = x;
	this.y = y;
};
$hxClasses["flambe.math.Point"] = flambe_math_Point;
flambe_math_Point.__name__ = ["flambe","math","Point"];
flambe_math_Point.prototype = {
	toString: function() {
		return "(" + this.x + "," + this.y + ")";
	}
	,__class__: flambe_math_Point
};
var Grid = function(rootRef,width,height) {
	Grid.ref = this;
	this.rootRef = rootRef;
	this.width = width;
	this.height = height;
	Grid.offsetX = Std["int"]((yzi_YZI.width - width * (Grid.pieceWidth + Grid.gap)) / 2 + Grid.pieceWidth / 2);
	var _g = [];
	var _g2 = 0;
	var _g1 = this.height;
	while(_g2 < _g1) {
		var y = _g2++;
		_g.push((function($this) {
			var $r;
			var _g3 = [];
			{
				var _g5 = 0;
				var _g4 = $this.width;
				while(_g5 < _g4) {
					var x = _g5++;
					_g3.push(null);
				}
			}
			$r = _g3;
			return $r;
		}(this)));
	}
	this.grid = _g;
	Piece.canMakeAction = true;
};
$hxClasses["Grid"] = Grid;
Grid.__name__ = ["Grid"];
Grid.prototype = {
	addRandPiece: function(x,y) {
		return new Piece(x,y,Std.random(Grid.pieceTypes));
	}
	,addBonusPieceAt: function(type,j) {
		var p = new Piece(j,0,Grid.pieceTypes + type);
		this.grid[0][j] = p;
		return p;
	}
	,addRandRows: function(height) {
		var i = this.grid.length - 1;
		var h = i - height;
		while(i > h) {
			var _g1 = 0;
			var _g = this.grid[i].length;
			while(_g1 < _g) {
				var j = _g1++;
				this.grid[i][j] = this.addRandPiece(j,i);
			}
			i--;
		}
	}
	,getPiecesOfType: function(t) {
		var piecesOfType = [];
		var _g1 = 0;
		var _g = this.grid.length;
		while(_g1 < _g) {
			var i = _g1++;
			var _g3 = 0;
			var _g2 = this.grid[i].length;
			while(_g3 < _g2) {
				var j = _g3++;
				if(this.grid[i][j] != null) {
					if(this.grid[i][j].type == t) piecesOfType.push(this.grid[i][j]);
				}
			}
		}
		return piecesOfType;
	}
	,pushPiecesUp: function() {
		var p = this.getPiecesAtTop();
		if(p.length > 0) {
			var _g1 = 0;
			var _g = p.length;
			while(_g1 < _g) {
				var i = _g1++;
				if(p[i].type > Grid.pieceTypes - 1) {
				} else return false;
			}
		}
		var _g11 = 0;
		var _g2 = this.grid.length;
		while(_g11 < _g2) {
			var i1 = _g11++;
			var _g3 = 0;
			var _g21 = this.grid[i1].length;
			while(_g3 < _g21) {
				var j = _g3++;
				if(this.grid[i1][j] != null) {
					if(i1 != 0) {
						this.grid[i1 - 1][j] = this.grid[i1][j];
						this.grid[i1 - 1][j].gridY = i1 - 1;
						this.grid[i1 - 1][j].tweenOnPushUp();
						this.grid[i1][j] = null;
					} else if(this.grid[i1][j].type > Grid.pieceTypes - 1) {
						this.grid[i1][j].tweenOnBonusDeath();
						this.grid[i1][j] = null;
					}
				}
			}
		}
		this.getPiecesAtTop();
		return true;
	}
	,getPiecesAtTop: function() {
		var y = [];
		var _g1 = 0;
		var _g = this.grid[0].length;
		while(_g1 < _g) {
			var j = _g1++;
			if(this.grid[0][j] != null) {
				y.push(this.grid[0][j]);
				this.grid[0][j].tweenOnTop();
			}
		}
		return y;
	}
	,coordsInGrid: function(x,y) {
		return x >= 0 && y >= 0 && x < this.width && y < this.height;
	}
	,getPiece: function(x,y) {
		if(this.coordsInGrid(x,y) && this.grid[y][x] != null) return this.grid[y][x]; else return null;
	}
	,neighbourOf: function(piece,direction) {
		var targetCoords = piece.relativeCoordinates(direction,1);
		var piece1 = this.getPiece(Std["int"](targetCoords.x),Std["int"](targetCoords.y));
		return piece1;
	}
	,neighboursOf: function(piece) {
		var result = [];
		var _g1 = 0;
		var _g = Grid.dirs.length;
		while(_g1 < _g) {
			var i = _g1++;
			result.push(this.neighbourOf(piece,Grid.dirs[i]));
		}
		return result;
	}
	,getDeepMatches: function(minMatch) {
		if(minMatch == null) minMatch = 2;
		var checked = [];
		var matches = [];
		var _g1 = 0;
		var _g = this.grid.length;
		while(_g1 < _g) {
			var l = _g1++;
			var pieces = this.grid[l];
			var _g3 = 0;
			var _g2 = pieces.length;
			while(_g3 < _g2) {
				var i = _g3++;
				var piece = pieces[i];
				if(piece != null && Lambda.indexOf(checked,piece) == -1) {
					var match = piece.deepMatchingNeighbours();
					var _g5 = 0;
					var _g4 = match.length;
					while(_g5 < _g4) {
						var j = _g5++;
						checked.push(match[j]);
					}
					if(match.length >= minMatch) {
						if(piece != null) {
							var _g51 = 0;
							var _g41 = match.length;
							while(_g51 < _g41) {
								var m = _g51++;
								matches.push(match[m]);
							}
						}
					}
				}
			}
		}
		return matches;
	}
	,applyGravityDown: function() {
		var i = this.grid.length - 1;
		var piecesOnGrav = [];
		while(i > 0) {
			var row = this.grid[i];
			var _g1 = 0;
			var _g = row.length;
			while(_g1 < _g) {
				var j = _g1++;
				var piece = row[j];
				if(piece == null) {
					var aY = i;
					while(aY > 0) {
						aY--;
						if(this.grid[aY][j] != null) {
							this.grid[i][j] = this.grid[aY][j];
							this.grid[i][j].gridY = i;
							piecesOnGrav.push(this.grid[i][j]);
							this.grid[aY][j] = null;
							aY = 0;
						}
					}
				}
			}
			i--;
		}
		return piecesOnGrav;
	}
	,slideToLeft: function() {
		var bottomRow = this.grid[this.grid.length - 1];
		var j = bottomRow.length - 1;
		var n = 0;
		var piecesOnSlide = [];
		var _g1 = 0;
		var _g = bottomRow.length;
		while(_g1 < _g) {
			var j1 = _g1++;
			var piece = bottomRow[j1];
			if(piece == null && j1 != bottomRow.length - 1) {
				n++;
				if(bottomRow[j1 + 1] != null) {
					var sj = j1 + 1;
					var p = bottomRow[sj];
					while(p != null) {
						var _g3 = 0;
						var _g2 = this.grid.length;
						while(_g3 < _g2) {
							var i = _g3++;
							if(this.grid[i][sj] != null) {
								this.grid[i][sj - n] = this.grid[i][sj];
								this.grid[i][sj - n].gridX = sj - n;
								piecesOnSlide.push(this.grid[i][sj - n]);
								this.grid[i][sj] = null;
							}
						}
						sj++;
						p = bottomRow[sj];
					}
					n = 0;
				}
			}
		}
		return piecesOnSlide;
	}
	,clear: function() {
		var _g1 = 0;
		var _g = this.grid.length;
		while(_g1 < _g) {
			var i = _g1++;
			var _g3 = 0;
			var _g2 = this.grid[i].length;
			while(_g3 < _g2) {
				var j = _g3++;
				if(this.grid[i][j] != null) this.grid[i][j].tweenOnGameOver();
				this.grid[i][j] = null;
			}
		}
	}
	,clear2: function() {
		var _g1 = 0;
		var _g = this.grid.length;
		while(_g1 < _g) {
			var i = _g1++;
			var _g3 = 0;
			var _g2 = this.grid[i].length;
			while(_g3 < _g2) {
				var j = _g3++;
				if(this.grid[i][j] != null) this.grid[i][j].tweenOnLevelEnd();
				this.grid[i][j] = null;
			}
		}
	}
	,__class__: Grid
};
var Piece = function(gridX,gridY,type) {
	this.gridX = gridX;
	this.gridY = gridY;
	this.type = type;
	this.init();
};
$hxClasses["Piece"] = Piece;
Piece.__name__ = ["Piece"];
Piece.prototype = {
	init: function() {
		var _g = this;
		Piece.canMakeAction = true;
		this.pieceEnt = yzi_YZI.addImageSprite(Grid.ref.rootRef,this.getX(),this.initY(),"bl" + this.type).owner;
		this.pieceEnt.add(new flambe_script_Script());
		((function($this) {
			var $r;
			var component = $this.pieceEnt.getComponent("Disposer_4");
			$r = component;
			return $r;
		}(this))).connect1(((function($this) {
			var $r;
			var component1 = $this.pieceEnt.getComponent("Sprite_2");
			$r = component1;
			return $r;
		}(this))).get_pointerUp(),$bind(this,this.onPointerUp));
		if(Piece.actionSequence == null) {
			Piece.actionSequence = new flambe_script_Sequence();
			Piece.actionSequence.add(new flambe_script_CallFunction(function() {
				Piece.canMakeAction = false;
				var p = Grid.ref.applyGravityDown();
				var _g1 = 0;
				var _g2 = p.length;
				while(_g1 < _g2) {
					var i = _g1++;
					p[i].tweenOnGravityDown();
				}
			}));
			Piece.actionSequence.add(new flambe_script_Delay(0.1));
			Piece.actionSequence.add(new flambe_script_CallFunction(function() {
				var p1 = Grid.ref.slideToLeft();
				var _g11 = 0;
				var _g3 = p1.length;
				while(_g11 < _g3) {
					var i1 = _g11++;
					p1[i1].tweenOnSlideLeft();
				}
				_g.showBonusInfo();
			}));
			Piece.actionSequence.add(new flambe_script_CallFunction(function() {
				((function($this) {
					var $r;
					var component2 = Grid.ref.rootRef.getComponent("GameSceneComp_9");
					$r = component2;
					return $r;
				}(this))).checkForMatches();
			}));
			Piece.actionSequence.add(new flambe_script_CallFunction(function() {
				Piece.canMakeAction = true;
			}));
		}
		this.tweenOnInit();
		this.showBonusInfo();
	}
	,onPointerUp: function(_) {
		if(!Piece.canMakeAction) return;
		if(this.type > Grid.pieceTypes - 1) {
			this.activateBonus3(this.type - Grid.pieceTypes);
			return;
		}
		var deepMatches = this.deepMatchingNeighbours();
		if(deepMatches.length > 0) {
			yzi_Sfx.playSfx("pop_sfx");
			var _g1 = 0;
			var _g = deepMatches.length;
			while(_g1 < _g) {
				var i = _g1++;
				this.tweenOnRemove(deepMatches[i]);
			}
			this.updateGrid(deepMatches);
			if(deepMatches.length > Grid.minMatchForBonus - 1) this.addBonus(yzi_YZI.rand(Grid.pieceTypes));
		} else this.tweenShake();
	}
	,updateGrid: function(pieces,fromBonus) {
		if(fromBonus == null) fromBonus = false;
		var combo = pieces.length;
		var score = combo * combo * combo * 10 - combo * 10;
		if(fromBonus) score = combo * combo * 10;
		((function($this) {
			var $r;
			var component = Grid.ref.rootRef.getComponent("GameSceneComp_9");
			$r = component;
			return $r;
		}(this))).updateScore(score);
		var scoreLabel = yzi_YZI.addLabel(Grid.ref.rootRef,this.getX(),this.getY(),"+" + score,1,1,true,"font5");
		var end = function() {
			scoreLabel.dispose();
		};
		yzi_Tweener.tween(scoreLabel,0.5,{ y : scoreLabel.y.get__() - 45},0,end,flambe_animation_Ease.cubeOut);
		((function($this) {
			var $r;
			var component1 = Grid.ref.rootRef.getComponent("Script_5");
			$r = component1;
			return $r;
		}(this))).run(Piece.actionSequence);
	}
	,addBonus: function(type) {
		var _g = this;
		((function($this) {
			var $r;
			var component = Grid.ref.rootRef.getComponent("Script_5");
			$r = component;
			return $r;
		}(this))).run(new flambe_script_Sequence([new flambe_script_Delay(0.1),new flambe_script_CallFunction(function() {
			Grid.ref.addBonusPieceAt(type,_g.gridX);
			((function($this) {
				var $r;
				var component1 = Grid.ref.rootRef.getComponent("Script_5");
				$r = component1;
				return $r;
			}(this))).run(Piece.actionSequence);
		})]));
	}
	,activateBonus3: function(t) {
		var pof = Grid.ref.getPiecesOfType(t);
		if(pof.length == 0) {
			this.tweenShake();
			return;
		}
		var _g1 = 0;
		var _g = pof.length;
		while(_g1 < _g) {
			var i = _g1++;
			this.tweenOnRemove(pof[i]);
		}
		this.tweenOnRemove(this);
		yzi_Sfx.playSfx("bonus_sfx",0.6);
		((function($this) {
			var $r;
			var component = Grid.ref.rootRef.getComponent("Script_5");
			$r = component;
			return $r;
		}(this))).run(new flambe_script_Shake(10,0,0.5));
		this.updateGrid(pof,true);
	}
	,showBonusInfo: function() {
		var matches = [];
		var firstPieces = [];
		var _g1 = 0;
		var _g = Grid.ref.grid.length;
		while(_g1 < _g) {
			var i = _g1++;
			var _g3 = 0;
			var _g2 = Grid.ref.grid[i].length;
			while(_g3 < _g2) {
				var j = _g3++;
				if(Grid.ref.grid[i][j] != null) {
					Grid.ref.grid[i][j].pieceEnt.disposeChildren();
					var dmns = Grid.ref.grid[i][j].deepMatchingNeighbours();
					if(dmns.length > Grid.minMatchForBonus - 1) {
						if(Lambda.indexOf(matches,Grid.ref.grid[i][j]) == -1) {
							firstPieces.push(Grid.ref.grid[i][j]);
							var _g5 = 0;
							var _g4 = dmns.length;
							while(_g5 < _g4) {
								var n = _g5++;
								matches.push(dmns[n]);
							}
						}
					}
				}
			}
		}
		var _g11 = 0;
		var _g6 = firstPieces.length;
		while(_g11 < _g6) {
			var i1 = _g11++;
			yzi_YZI.addImageSprite(firstPieces[i1].pieceEnt,Std["int"](Grid.pieceWidth / 2) + 5,Std["int"](Grid.pieceHeight / 2),"bonus_marker");
		}
	}
	,getX: function() {
		return this.gridX * (Grid.pieceWidth + Grid.gap) + Std["int"](Grid.gap / 2) + Grid.offsetX;
	}
	,getY: function() {
		return this.gridY * (Grid.pieceHeight + Grid.gap) + Std["int"](Grid.gap / 2) + Grid.offsetY;
	}
	,initY: function() {
		if(this.type < Grid.pieceTypes) return this.getY() + yzi_YZI.height + Std["int"](Grid.pieceHeight / 2) - Grid.offsetY; else return -100;
	}
	,tweenOnInit: function() {
		((function($this) {
			var $r;
			var component = $this.pieceEnt.getComponent("Sprite_2");
			$r = component;
			return $r;
		}(this))).y.animateTo(this.getY(),0.4,flambe_animation_Ease.bounceIn);
	}
	,tweenOnRemove: function(piece) {
		this.removeJitterBehavior();
		Grid.ref.grid[piece.gridY][piece.gridX] = null;
		var end = function() {
			piece.pieceEnt.dispose();
		};
		((function($this) {
			var $r;
			var component = piece.pieceEnt.getComponent("Sprite_2");
			$r = component;
			return $r;
		}(this))).setAlpha(0.7);
		yzi_Tweener.tween((function($this) {
			var $r;
			var component1 = piece.pieceEnt.getComponent("Sprite_2");
			$r = component1;
			return $r;
		}(this)),0.4,{ alpha : 0.5, scaleX : 0, scaleY : 0},0,end,flambe_animation_Ease.backIn);
	}
	,tweenOnBonusDeath: function() {
		var _g = this;
		this.removeJitterBehavior();
		((function($this) {
			var $r;
			var component = $this.pieceEnt.getComponent("Sprite_2");
			$r = component;
			return $r;
		}(this))).setAlpha(0.7);
		((function($this) {
			var $r;
			var component1 = $this.pieceEnt.getComponent("Sprite_2");
			$r = component1;
			return $r;
		}(this))).y.animateTo(yzi_YZI.height + 100,1,flambe_animation_Ease.backIn);
		var end = function() {
			_g.pieceEnt.dispose();
		};
		yzi_Tweener.tween((function($this) {
			var $r;
			var component2 = $this.pieceEnt.getComponent("Sprite_2");
			$r = component2;
			return $r;
		}(this)),3,{ rotation : 720},0,end,flambe_animation_Ease.backIn);
	}
	,tweenOnLevelEnd: function() {
		Piece.canMakeAction = false;
	}
	,tweenOnGameOver: function() {
		var _g = this;
		this.removeJitterBehavior();
		Piece.canMakeAction = false;
		var end = function() {
			((function($this) {
				var $r;
				var component = _g.pieceEnt.getComponent("Sprite_2");
				$r = component;
				return $r;
			}(this))).y.animateTo(yzi_YZI.height + 100,1,flambe_animation_Ease.backIn);
			((function($this) {
				var $r;
				var component1 = _g.pieceEnt.getComponent("Sprite_2");
				$r = component1;
				return $r;
			}(this))).rotation.animateTo(720 * yzi_YZI.randSign(),3,flambe_animation_Ease.quadIn);
		};
		yzi_Tweener.tween((function($this) {
			var $r;
			var component2 = $this.pieceEnt.getComponent("Sprite_2");
			$r = component2;
			return $r;
		}(this)),0.4,{ y : this.getY() - 20},0,end,flambe_animation_Ease.backIn);
	}
	,tweenOnTop: function() {
		var _g = this;
		if(this.type > Grid.pieceTypes - 1) return;
		((function($this) {
			var $r;
			var component = $this.pieceEnt.getComponent("Script_5");
			$r = component;
			return $r;
		}(this))).run(new flambe_script_Sequence([new flambe_script_Delay(0.6),new flambe_script_CallFunction(function() {
			((function($this) {
				var $r;
				var component1 = _g.pieceEnt.getComponent("Sprite_2");
				$r = component1;
				return $r;
			}(this))).x.set_behavior(new flambe_animation_Jitter(_g.getX(),2));
			((function($this) {
				var $r;
				var component2 = _g.pieceEnt.getComponent("Sprite_2");
				$r = component2;
				return $r;
			}(this))).y.set_behavior(new flambe_animation_Jitter(_g.getY(),2));
			if(Grid.ref.rootRef.firstChild.firstChild == null) {
				var a = 0.2;
				var flash = yzi_YZI.addFillSprite(Grid.ref.rootRef.firstChild,0,0,16711680,yzi_YZI.width,yzi_YZI.height,a,false);
				var flashFx = function() {
					if(flash.alpha.get__() == a) flash.alpha.set__(0); else flash.alpha.set__(a);
				};
				yzi_YZI.addDelay(flash.owner,0.2,flashFx,true);
			}
		})]));
	}
	,removeJitterBehavior: function() {
		((function($this) {
			var $r;
			var component = $this.pieceEnt.getComponent("Script_5");
			$r = component;
			return $r;
		}(this))).stopAll();
		((function($this) {
			var $r;
			var component1 = $this.pieceEnt.getComponent("Sprite_2");
			$r = component1;
			return $r;
		}(this))).x.set_behavior(null);
		((function($this) {
			var $r;
			var component2 = $this.pieceEnt.getComponent("Sprite_2");
			$r = component2;
			return $r;
		}(this))).y.set_behavior(null);
		if(Grid.ref.getPiecesAtTop().length == 0 && Grid.ref.rootRef.firstChild.firstChild != null) Grid.ref.rootRef.firstChild.disposeChildren();
	}
	,tweenOnSlideLeft: function() {
		var _g = this;
		Piece.canMakeAction = false;
		((function($this) {
			var $r;
			var component = $this.pieceEnt.getComponent("Sprite_2");
			$r = component;
			return $r;
		}(this))).x.animateTo(this.getX(),0.4,flambe_animation_Ease.backInOut);
		var end = function() {
			yzi_Tweener.tween((function($this) {
				var $r;
				var component1 = _g.pieceEnt.getComponent("Sprite_2");
				$r = component1;
				return $r;
			}(this)),0.15,{ rotation : 0, scaleX : 1},0,null,flambe_animation_Ease.backOut);
		};
		yzi_Tweener.tween((function($this) {
			var $r;
			var component2 = $this.pieceEnt.getComponent("Sprite_2");
			$r = component2;
			return $r;
		}(this)),0.1,{ rotation : 10, scaleX : 0.7},0.1,end,flambe_animation_Ease.backIn);
	}
	,tweenOnPushUp: function() {
		Piece.canMakeAction = false;
		var end = function() {
			Piece.canMakeAction = true;
		};
		yzi_Tweener.tween((function($this) {
			var $r;
			var component = $this.pieceEnt.getComponent("Sprite_2");
			$r = component;
			return $r;
		}(this)),0.4,{ y : this.getY()},0,end,flambe_animation_Ease.backIn);
	}
	,tweenOnGravityDown: function() {
		var _g = this;
		this.removeJitterBehavior();
		((function($this) {
			var $r;
			var component = $this.pieceEnt.getComponent("Sprite_2");
			$r = component;
			return $r;
		}(this))).y.animateTo(this.getY(),0.4,flambe_animation_Ease.backIn);
		var end = function() {
			yzi_Tweener.tween((function($this) {
				var $r;
				var component1 = _g.pieceEnt.getComponent("Sprite_2");
				$r = component1;
				return $r;
			}(this)),0.25,{ scaleX : 1, scaleY : 1},0,null,flambe_animation_Ease.backInOut);
		};
		yzi_Tweener.tween((function($this) {
			var $r;
			var component2 = $this.pieceEnt.getComponent("Sprite_2");
			$r = component2;
			return $r;
		}(this)),0.15,{ scaleX : 1.2, scaleY : 0.7},0.1,end,flambe_animation_Ease.bounceInOut);
	}
	,tweenShake: function() {
		yzi_Sfx.playSfx("no_match_sfx",0.5);
		((function($this) {
			var $r;
			var component = $this.pieceEnt.getComponent("Sprite_2");
			$r = component;
			return $r;
		}(this))).x.set__(this.getX());
		((function($this) {
			var $r;
			var component1 = $this.pieceEnt.getComponent("Sprite_2");
			$r = component1;
			return $r;
		}(this))).y.set__(this.getY());
		((function($this) {
			var $r;
			var component2 = $this.pieceEnt.getComponent("Script_5");
			$r = component2;
			return $r;
		}(this))).run(new flambe_script_Shake(10,0,0.3));
	}
	,relativeCoordinates: function(direction,distance) {
		return new flambe_math_Point(this.gridX + distance * direction.x,this.gridY + distance * direction.y);
	}
	,neighbours: function() {
		return Grid.ref.neighboursOf(this);
	}
	,matchingNeighbours: function() {
		var matches = [];
		var neighbours = this.neighbours();
		var neighbour;
		var _g1 = 0;
		var _g = neighbours.length;
		while(_g1 < _g) {
			var i = _g1++;
			neighbour = neighbours[i];
			if(neighbour != null && neighbour.type == this.type && this.type < Grid.pieceTypes) matches.push(neighbour);
		}
		return matches;
	}
	,deepMatchingNeighbours: function() {
		var deepMatches = [];
		var deepMatchingNeighboursH;
		var deepMatchingNeighboursH1 = null;
		deepMatchingNeighboursH1 = function(piece) {
			var matchingNeighbours = piece.matchingNeighbours();
			var _g1 = 0;
			var _g = matchingNeighbours.length;
			while(_g1 < _g) {
				var i = _g1++;
				var matchingNeighbour = matchingNeighbours[i];
				if(Lambda.indexOf(deepMatches,matchingNeighbour) == -1) {
					deepMatches.push(matchingNeighbour);
					deepMatchingNeighboursH1(matchingNeighbour);
				}
			}
		};
		deepMatchingNeighboursH = deepMatchingNeighboursH1;
		deepMatchingNeighboursH(this);
		return deepMatches;
	}
	,__class__: Piece
};
var HxOverrides = function() { };
$hxClasses["HxOverrides"] = HxOverrides;
HxOverrides.__name__ = ["HxOverrides"];
HxOverrides.dateStr = function(date) {
	var m = date.getMonth() + 1;
	var d = date.getDate();
	var h = date.getHours();
	var mi = date.getMinutes();
	var s = date.getSeconds();
	return date.getFullYear() + "-" + (m < 10?"0" + m:"" + m) + "-" + (d < 10?"0" + d:"" + d) + " " + (h < 10?"0" + h:"" + h) + ":" + (mi < 10?"0" + mi:"" + mi) + ":" + (s < 10?"0" + s:"" + s);
};
HxOverrides.strDate = function(s) {
	var _g = s.length;
	switch(_g) {
	case 8:
		var k = s.split(":");
		var d = new Date();
		d.setTime(0);
		d.setUTCHours(k[0]);
		d.setUTCMinutes(k[1]);
		d.setUTCSeconds(k[2]);
		return d;
	case 10:
		var k1 = s.split("-");
		return new Date(k1[0],k1[1] - 1,k1[2],0,0,0);
	case 19:
		var k2 = s.split(" ");
		var y = k2[0].split("-");
		var t = k2[1].split(":");
		return new Date(y[0],y[1] - 1,y[2],t[0],t[1],t[2]);
	default:
		throw "Invalid date format : " + s;
	}
};
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
};
HxOverrides.substr = function(s,pos,len) {
	if(pos != null && pos != 0 && len != null && len < 0) return "";
	if(len == null) len = s.length;
	if(pos < 0) {
		pos = s.length + pos;
		if(pos < 0) pos = 0;
	} else if(len < 0) len = s.length + len - pos;
	return s.substr(pos,len);
};
HxOverrides.remove = function(a,obj) {
	var i = a.indexOf(obj);
	if(i == -1) return false;
	a.splice(i,1);
	return true;
};
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
};
var Lambda = function() { };
$hxClasses["Lambda"] = Lambda;
Lambda.__name__ = ["Lambda"];
Lambda.array = function(it) {
	var a = new Array();
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var i = $it0.next();
		a.push(i);
	}
	return a;
};
Lambda.count = function(it,pred) {
	var n = 0;
	if(pred == null) {
		var $it0 = $iterator(it)();
		while( $it0.hasNext() ) {
			var _ = $it0.next();
			n++;
		}
	} else {
		var $it1 = $iterator(it)();
		while( $it1.hasNext() ) {
			var x = $it1.next();
			if(pred(x)) n++;
		}
	}
	return n;
};
Lambda.indexOf = function(it,v) {
	var i = 0;
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var v2 = $it0.next();
		if(v == v2) return i;
		i++;
	}
	return -1;
};
var List = function() {
	this.length = 0;
};
$hxClasses["List"] = List;
List.__name__ = ["List"];
List.prototype = {
	add: function(item) {
		var x = [item];
		if(this.h == null) this.h = x; else this.q[1] = x;
		this.q = x;
		this.length++;
	}
	,iterator: function() {
		return { h : this.h, hasNext : function() {
			return this.h != null;
		}, next : function() {
			if(this.h == null) return null;
			var x = this.h[0];
			this.h = this.h[1];
			return x;
		}};
	}
	,__class__: List
};
var Main = function() { };
$hxClasses["Main"] = Main;
Main.__name__ = ["Main"];
Main.main = function() {
	flambe_System.init();
	yzi_YZI.systemBgColor = 6993414;
	new yzi_YZI(640,960).init.connect(Main.onInit).once();
};
Main.onInit = function() {
	G.loadHiScore();
	yzi_YZI.buttonClickSfx = "button_click_sfx";
	yzi_YZI.initFlipbooks([["bl_anim",2,5,0.33,176,71]]);
	yzi_YZI.goToScene(new scenes_MainScene().root);
};
var IMap = function() { };
$hxClasses["IMap"] = IMap;
IMap.__name__ = ["IMap"];
Math.__name__ = ["Math"];
var Reflect = function() { };
$hxClasses["Reflect"] = Reflect;
Reflect.__name__ = ["Reflect"];
Reflect.hasField = function(o,field) {
	return Object.prototype.hasOwnProperty.call(o,field);
};
Reflect.field = function(o,field) {
	try {
		return o[field];
	} catch( e ) {
		return null;
	}
};
Reflect.setField = function(o,field,value) {
	o[field] = value;
};
Reflect.getProperty = function(o,field) {
	var tmp;
	if(o == null) return null; else if(o.__properties__ && (tmp = o.__properties__["get_" + field])) return o[tmp](); else return o[field];
};
Reflect.callMethod = function(o,func,args) {
	return func.apply(o,args);
};
Reflect.fields = function(o) {
	var a = [];
	if(o != null) {
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		for( var f in o ) {
		if(f != "__id__" && f != "hx__closures__" && hasOwnProperty.call(o,f)) a.push(f);
		}
	}
	return a;
};
Reflect.isFunction = function(f) {
	return typeof(f) == "function" && !(js_Boot.isClass(f) || js_Boot.isEnum(f));
};
Reflect.deleteField = function(o,field) {
	if(!Reflect.hasField(o,field)) return false;
	delete(o[field]);
	return true;
};
var Std = function() { };
$hxClasses["Std"] = Std;
Std.__name__ = ["Std"];
Std["is"] = function(v,t) {
	return js_Boot.__instanceof(v,t);
};
Std.instance = function(value,c) {
	if((value instanceof c)) return value; else return null;
};
Std.string = function(s) {
	return js_Boot.__string_rec(s,"");
};
Std["int"] = function(x) {
	return x | 0;
};
Std.parseInt = function(x) {
	var v = parseInt(x,10);
	if(v == 0 && (HxOverrides.cca(x,1) == 120 || HxOverrides.cca(x,1) == 88)) v = parseInt(x);
	if(isNaN(v)) return null;
	return v;
};
Std.parseFloat = function(x) {
	return parseFloat(x);
};
Std.random = function(x) {
	if(x <= 0) return 0; else return Math.floor(Math.random() * x);
};
var StringBuf = function() {
	this.b = "";
};
$hxClasses["StringBuf"] = StringBuf;
StringBuf.__name__ = ["StringBuf"];
StringBuf.prototype = {
	add: function(x) {
		this.b += Std.string(x);
	}
	,toString: function() {
		return this.b;
	}
	,__class__: StringBuf
};
var StringTools = function() { };
$hxClasses["StringTools"] = StringTools;
StringTools.__name__ = ["StringTools"];
StringTools.urlEncode = function(s) {
	return encodeURIComponent(s);
};
StringTools.urlDecode = function(s) {
	return decodeURIComponent(s.split("+").join(" "));
};
StringTools.startsWith = function(s,start) {
	return s.length >= start.length && HxOverrides.substr(s,0,start.length) == start;
};
StringTools.replace = function(s,sub,by) {
	return s.split(sub).join(by);
};
StringTools.fastCodeAt = function(s,index) {
	return s.charCodeAt(index);
};
StringTools.isEof = function(c) {
	return c != c;
};
var ValueType = $hxClasses["ValueType"] = { __ename__ : ["ValueType"], __constructs__ : ["TNull","TInt","TFloat","TBool","TObject","TFunction","TClass","TEnum","TUnknown"] };
ValueType.TNull = ["TNull",0];
ValueType.TNull.toString = $estr;
ValueType.TNull.__enum__ = ValueType;
ValueType.TInt = ["TInt",1];
ValueType.TInt.toString = $estr;
ValueType.TInt.__enum__ = ValueType;
ValueType.TFloat = ["TFloat",2];
ValueType.TFloat.toString = $estr;
ValueType.TFloat.__enum__ = ValueType;
ValueType.TBool = ["TBool",3];
ValueType.TBool.toString = $estr;
ValueType.TBool.__enum__ = ValueType;
ValueType.TObject = ["TObject",4];
ValueType.TObject.toString = $estr;
ValueType.TObject.__enum__ = ValueType;
ValueType.TFunction = ["TFunction",5];
ValueType.TFunction.toString = $estr;
ValueType.TFunction.__enum__ = ValueType;
ValueType.TClass = function(c) { var $x = ["TClass",6,c]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; };
ValueType.TEnum = function(e) { var $x = ["TEnum",7,e]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; };
ValueType.TUnknown = ["TUnknown",8];
ValueType.TUnknown.toString = $estr;
ValueType.TUnknown.__enum__ = ValueType;
var Type = function() { };
$hxClasses["Type"] = Type;
Type.__name__ = ["Type"];
Type.getClass = function(o) {
	if(o == null) return null;
	return js_Boot.getClass(o);
};
Type.getClassName = function(c) {
	var a = c.__name__;
	return a.join(".");
};
Type.getEnumName = function(e) {
	var a = e.__ename__;
	return a.join(".");
};
Type.resolveClass = function(name) {
	var cl = $hxClasses[name];
	if(cl == null || !js_Boot.isClass(cl)) return null;
	return cl;
};
Type.resolveEnum = function(name) {
	var e = $hxClasses[name];
	if(e == null || !js_Boot.isEnum(e)) return null;
	return e;
};
Type.createEmptyInstance = function(cl) {
	function empty() {}; empty.prototype = cl.prototype;
	return new empty();
};
Type.createEnum = function(e,constr,params) {
	var f = Reflect.field(e,constr);
	if(f == null) throw "No such constructor " + constr;
	if(Reflect.isFunction(f)) {
		if(params == null) throw "Constructor " + constr + " need parameters";
		return Reflect.callMethod(e,f,params);
	}
	if(params != null && params.length != 0) throw "Constructor " + constr + " does not need parameters";
	return f;
};
Type.getEnumConstructs = function(e) {
	var a = e.__constructs__;
	return a.slice();
};
Type["typeof"] = function(v) {
	var _g = typeof(v);
	switch(_g) {
	case "boolean":
		return ValueType.TBool;
	case "string":
		return ValueType.TClass(String);
	case "number":
		if(Math.ceil(v) == v % 2147483648.0) return ValueType.TInt;
		return ValueType.TFloat;
	case "object":
		if(v == null) return ValueType.TNull;
		var e = v.__enum__;
		if(e != null) return ValueType.TEnum(e);
		var c = js_Boot.getClass(v);
		if(c != null) return ValueType.TClass(c);
		return ValueType.TObject;
	case "function":
		if(js_Boot.isClass(v) || js_Boot.isEnum(v)) return ValueType.TObject;
		return ValueType.TFunction;
	case "undefined":
		return ValueType.TNull;
	default:
		return ValueType.TUnknown;
	}
};
Type.enumIndex = function(e) {
	return e[1];
};
var flambe_util_Disposable = function() { };
$hxClasses["flambe.util.Disposable"] = flambe_util_Disposable;
flambe_util_Disposable.__name__ = ["flambe","util","Disposable"];
flambe_util_Disposable.prototype = {
	__class__: flambe_util_Disposable
};
var flambe_Component = function() {
	this._flags = 0;
	this.next = null;
	this.owner = null;
};
$hxClasses["flambe.Component"] = flambe_Component;
flambe_Component.__name__ = ["flambe","Component"];
flambe_Component.__interfaces__ = [flambe_util_Disposable];
flambe_Component.prototype = {
	onAdded: function() {
	}
	,onRemoved: function() {
	}
	,onStart: function() {
	}
	,onStop: function() {
	}
	,onUpdate: function(dt) {
	}
	,dispose: function() {
		if(this.owner != null) this.owner.remove(this);
	}
	,get_name: function() {
		return null;
	}
	,__class__: flambe_Component
	,__properties__: {get_name:"get_name"}
};
var flambe_Disposer = function() {
	flambe_Component.call(this);
	this._disposables = [];
};
$hxClasses["flambe.Disposer"] = flambe_Disposer;
flambe_Disposer.__name__ = ["flambe","Disposer"];
flambe_Disposer.__super__ = flambe_Component;
flambe_Disposer.prototype = $extend(flambe_Component.prototype,{
	get_name: function() {
		return "Disposer_4";
	}
	,add: function(disposable) {
		this._disposables.push(disposable);
		return this;
	}
	,connect0: function(signal,listener) {
		this.add(signal.connect(listener));
		return this;
	}
	,connect1: function(signal,listener) {
		this.add(signal.connect(listener));
		return this;
	}
	,onRemoved: function() {
		this.freeDisposables();
	}
	,dispose: function() {
		flambe_Component.prototype.dispose.call(this);
		this.freeDisposables();
	}
	,freeDisposables: function() {
		var snapshot = this._disposables;
		this._disposables = [];
		var _g = 0;
		while(_g < snapshot.length) {
			var disposable = snapshot[_g];
			++_g;
			disposable.dispose();
		}
	}
	,__class__: flambe_Disposer
});
var flambe_Entity = function() {
	this.firstComponent = null;
	this.next = null;
	this.firstChild = null;
	this.parent = null;
	this._compMap = { };
};
$hxClasses["flambe.Entity"] = flambe_Entity;
flambe_Entity.__name__ = ["flambe","Entity"];
flambe_Entity.__interfaces__ = [flambe_util_Disposable];
flambe_Entity.prototype = {
	add: function(component) {
		if(component.owner != null) component.owner.remove(component);
		var name = component.get_name();
		var prev = this.getComponent(name);
		if(prev != null) this.remove(prev);
		this._compMap[name] = component;
		var tail = null;
		var p = this.firstComponent;
		while(p != null) {
			tail = p;
			p = p.next;
		}
		if(tail != null) tail.next = component; else this.firstComponent = component;
		component.owner = this;
		component.next = null;
		component.onAdded();
		return this;
	}
	,remove: function(component) {
		var prev = null;
		var p = this.firstComponent;
		while(p != null) {
			var next = p.next;
			if(p == component) {
				if(prev == null) this.firstComponent = next; else {
					prev.owner = this;
					prev.next = next;
				}
				delete(this._compMap[p.get_name()]);
				if(flambe_util_BitSets.contains(p._flags,1)) {
					p.onStop();
					p._flags = flambe_util_BitSets.remove(p._flags,1);
				}
				p.onRemoved();
				p.owner = null;
				p.next = null;
				return true;
			}
			prev = p;
			p = next;
		}
		return false;
	}
	,getComponent: function(name) {
		return this._compMap[name];
	}
	,addChild: function(entity,append) {
		if(append == null) append = true;
		if(entity.parent != null) entity.parent.removeChild(entity);
		entity.parent = this;
		if(append) {
			var tail = null;
			var p = this.firstChild;
			while(p != null) {
				tail = p;
				p = p.next;
			}
			if(tail != null) tail.next = entity; else this.firstChild = entity;
		} else {
			entity.next = this.firstChild;
			this.firstChild = entity;
		}
		return this;
	}
	,removeChild: function(entity) {
		var prev = null;
		var p = this.firstChild;
		while(p != null) {
			var next = p.next;
			if(p == entity) {
				if(prev == null) this.firstChild = next; else prev.next = next;
				p.parent = null;
				p.next = null;
				return;
			}
			prev = p;
			p = next;
		}
	}
	,disposeChildren: function() {
		while(this.firstChild != null) this.firstChild.dispose();
	}
	,dispose: function() {
		if(this.parent != null) this.parent.removeChild(this);
		while(this.firstComponent != null) this.firstComponent.dispose();
		this.disposeChildren();
	}
	,toString: function() {
		return this.toStringImpl("");
	}
	,toStringImpl: function(indent) {
		var output = "";
		var p = this.firstComponent;
		while(p != null) {
			output += p.get_name();
			if(p.next != null) output += ", ";
			p = p.next;
		}
		output += "\n";
		var u2514 = String.fromCharCode(9492);
		var u241c = String.fromCharCode(9500);
		var u2500 = String.fromCharCode(9472);
		var u2502 = String.fromCharCode(9474);
		var p1 = this.firstChild;
		while(p1 != null) {
			var last = p1.next == null;
			output += indent + (last?u2514:u241c) + u2500 + u2500 + " ";
			output += p1.toStringImpl(indent + (last?" ":u2502) + "   ");
			p1 = p1.next;
		}
		return output;
	}
	,__class__: flambe_Entity
};
var flambe_util_PackageLog = function() { };
$hxClasses["flambe.util.PackageLog"] = flambe_util_PackageLog;
flambe_util_PackageLog.__name__ = ["flambe","util","PackageLog"];
var flambe_platform_Platform = function() { };
$hxClasses["flambe.platform.Platform"] = flambe_platform_Platform;
flambe_platform_Platform.__name__ = ["flambe","platform","Platform"];
flambe_platform_Platform.prototype = {
	__class__: flambe_platform_Platform
};
var flambe_platform_html_HtmlPlatform = function() {
};
$hxClasses["flambe.platform.html.HtmlPlatform"] = flambe_platform_html_HtmlPlatform;
flambe_platform_html_HtmlPlatform.__name__ = ["flambe","platform","html","HtmlPlatform"];
flambe_platform_html_HtmlPlatform.__interfaces__ = [flambe_platform_Platform];
flambe_platform_html_HtmlPlatform.prototype = {
	init: function() {
		var _g = this;
		flambe_platform_html_HtmlUtil.fixAndroidMath();
		var canvas = null;
		try {
			canvas = js_Browser.get_window().flambe.canvas;
		} catch( error ) {
		}
		flambe_util_Assert.that(canvas != null,"Could not find a Flambe canvas! Are you embedding with flambe.js?");
		canvas.setAttribute("tabindex","0");
		canvas.style.outlineStyle = "none";
		canvas.style.webkitTapHighlightColor = "transparent";
		canvas.setAttribute("moz-opaque","true");
		this._stage = new flambe_platform_html_HtmlStage(canvas);
		this._pointer = new flambe_platform_BasicPointer();
		this._mouse = new flambe_platform_html_HtmlMouse(this._pointer,canvas);
		this._renderer = this.createRenderer(canvas);
		this.mainLoop = new flambe_platform_MainLoop();
		this.musicPlaying = false;
		this._canvas = canvas;
		this._container = canvas.parentElement;
		this._container.style.overflow = "hidden";
		this._container.style.position = "relative";
		this._container.style.msTouchAction = "none";
		var lastTouchTime = 0;
		var onMouse = function(event) {
			if(event.timeStamp - lastTouchTime < 1000) return;
			var bounds = canvas.getBoundingClientRect();
			var x = _g.getX(event,bounds);
			var y = _g.getY(event,bounds);
			var _g1 = event.type;
			switch(_g1) {
			case "mousedown":
				if(event.target == canvas) {
					event.preventDefault();
					_g._mouse.submitDown(x,y,event.button);
					canvas.focus();
				}
				break;
			case "mousemove":
				_g._mouse.submitMove(x,y);
				break;
			case "mouseup":
				_g._mouse.submitUp(x,y,event.button);
				break;
			case "mousewheel":case "DOMMouseScroll":
				var velocity;
				if(event.type == "mousewheel") velocity = event.wheelDelta / 40; else velocity = -event.detail;
				if(_g._mouse.submitScroll(x,y,velocity)) event.preventDefault();
				break;
			}
		};
		js_Browser.get_window().addEventListener("mousedown",onMouse,false);
		js_Browser.get_window().addEventListener("mousemove",onMouse,false);
		js_Browser.get_window().addEventListener("mouseup",onMouse,false);
		canvas.addEventListener("mousewheel",onMouse,false);
		canvas.addEventListener("DOMMouseScroll",onMouse,false);
		canvas.addEventListener("contextmenu",function(event1) {
			event1.preventDefault();
		},false);
		var standardTouch = typeof(js_Browser.get_window().ontouchstart) != "undefined";
		var msTouch = 'msMaxTouchPoints' in window.navigator && (window.navigator.msMaxTouchPoints > 1);
		if(standardTouch || msTouch) {
			var basicTouch = new flambe_platform_BasicTouch(this._pointer,standardTouch?4:js_Browser.get_navigator().msMaxTouchPoints);
			this._touch = basicTouch;
			var onTouch = function(event2) {
				var changedTouches;
				if(standardTouch) changedTouches = event2.changedTouches; else changedTouches = [event2];
				var bounds1 = event2.target.getBoundingClientRect();
				lastTouchTime = event2.timeStamp;
				var _g2 = event2.type;
				switch(_g2) {
				case "touchstart":case "MSPointerDown":case "pointerdown":
					event2.preventDefault();
					if(flambe_platform_html_HtmlUtil.SHOULD_HIDE_MOBILE_BROWSER) flambe_platform_html_HtmlUtil.hideMobileBrowser();
					var _g11 = 0;
					while(_g11 < changedTouches.length) {
						var touch = changedTouches[_g11];
						++_g11;
						var x1 = _g.getX(touch,bounds1);
						var y1 = _g.getY(touch,bounds1);
						var id = Std["int"](standardTouch?touch.identifier:touch.pointerId);
						basicTouch.submitDown(id,x1,y1);
					}
					break;
				case "touchmove":case "MSPointerMove":case "pointermove":
					event2.preventDefault();
					var _g12 = 0;
					while(_g12 < changedTouches.length) {
						var touch1 = changedTouches[_g12];
						++_g12;
						var x2 = _g.getX(touch1,bounds1);
						var y2 = _g.getY(touch1,bounds1);
						var id1 = Std["int"](standardTouch?touch1.identifier:touch1.pointerId);
						basicTouch.submitMove(id1,x2,y2);
					}
					break;
				case "touchend":case "touchcancel":case "MSPointerUp":case "pointerup":
					var _g13 = 0;
					while(_g13 < changedTouches.length) {
						var touch2 = changedTouches[_g13];
						++_g13;
						var x3 = _g.getX(touch2,bounds1);
						var y3 = _g.getY(touch2,bounds1);
						var id2 = Std["int"](standardTouch?touch2.identifier:touch2.pointerId);
						basicTouch.submitUp(id2,x3,y3);
					}
					break;
				}
			};
			if(standardTouch) {
				canvas.addEventListener("touchstart",onTouch,false);
				canvas.addEventListener("touchmove",onTouch,false);
				canvas.addEventListener("touchend",onTouch,false);
				canvas.addEventListener("touchcancel",onTouch,false);
			} else {
				canvas.addEventListener("MSPointerDown",onTouch,false);
				canvas.addEventListener("MSPointerMove",onTouch,false);
				canvas.addEventListener("MSPointerUp",onTouch,false);
			}
		} else this._touch = new flambe_platform_DummyTouch();
		var oldErrorHandler = js_Browser.get_window().onerror;
		js_Browser.get_window().onerror = function(message,url,line) {
			flambe_System.uncaughtError.emit(message);
			if(oldErrorHandler != null) return oldErrorHandler(message,url,line); else return false;
		};
		var hiddenApi = flambe_platform_html_HtmlUtil.loadExtension("hidden",js_Browser.get_document());
		if(hiddenApi.value != null) {
			var onVisibilityChanged = function(_) {
				flambe_System.hidden.set__(Reflect.field(js_Browser.get_document(),hiddenApi.field));
			};
			onVisibilityChanged(null);
			js_Browser.get_document().addEventListener(hiddenApi.prefix + "visibilitychange",onVisibilityChanged,false);
		} else {
			var onPageTransitionChange = function(event3) {
				flambe_System.hidden.set__(event3.type == "pagehide");
			};
			js_Browser.get_window().addEventListener("pageshow",onPageTransitionChange,false);
			js_Browser.get_window().addEventListener("pagehide",onPageTransitionChange,false);
		}
		flambe_System.hidden.get_changed().connect(function(hidden,_1) {
			if(!hidden) _g._skipFrame = true;
		});
		this._skipFrame = false;
		this._lastUpdate = flambe_platform_html_HtmlUtil.now();
		var requestAnimationFrame = flambe_platform_html_HtmlUtil.loadExtension("requestAnimationFrame").value;
		if(requestAnimationFrame != null) {
			var performance = js_Browser.get_window().performance;
			var hasPerfNow = performance != null && flambe_platform_html_HtmlUtil.polyfill("now",performance);
			if(hasPerfNow) this._lastUpdate = performance.now(); else flambe_Log.warn("No monotonic timer support, falling back to the system date");
			var updateFrame = null;
			updateFrame = function(now) {
				_g.update(hasPerfNow?performance.now():now);
				requestAnimationFrame(updateFrame,canvas);
			};
			requestAnimationFrame(updateFrame,canvas);
		} else {
			flambe_Log.warn("No requestAnimationFrame support, falling back to setInterval");
			js_Browser.get_window().setInterval(function() {
				_g.update(flambe_platform_html_HtmlUtil.now());
			},16);
		}
		new flambe_platform_DebugLogic(this);
		if(flambe_platform_html_HtmlCatapultClient.canUse()) this._catapult = new flambe_platform_html_HtmlCatapultClient(); else this._catapult = null;
		flambe_Log.info("Initialized HTML platform",["renderer",this._renderer.get_type()]);
	}
	,loadAssetPack: function(manifest) {
		return new flambe_platform_html_HtmlAssetPackLoader(this,manifest).promise;
	}
	,getStage: function() {
		return this._stage;
	}
	,getStorage: function() {
		if(this._storage == null) {
			var localStorage = js_Browser.getLocalStorage();
			if(localStorage != null) this._storage = new flambe_platform_html_HtmlStorage(localStorage); else {
				flambe_Log.warn("localStorage is unavailable, falling back to unpersisted storage");
				this._storage = new flambe_platform_DummyStorage();
			}
		}
		return this._storage;
	}
	,createLogHandler: function(tag) {
		if(flambe_platform_html_HtmlLogHandler.isSupported()) return new flambe_platform_html_HtmlLogHandler(tag);
		return null;
	}
	,getCatapultClient: function() {
		return this._catapult;
	}
	,update: function(now) {
		var dt = (now - this._lastUpdate) / 1000;
		this._lastUpdate = now;
		if(flambe_System.hidden.get__()) return;
		if(this._skipFrame) {
			this._skipFrame = false;
			return;
		}
		this.mainLoop.update(dt);
		this.mainLoop.render(this._renderer);
	}
	,getPointer: function() {
		return this._pointer;
	}
	,getMouse: function() {
		return this._mouse;
	}
	,getKeyboard: function() {
		var _g1 = this;
		if(this._keyboard == null) {
			this._keyboard = new flambe_platform_BasicKeyboard();
			var onKey = function(event) {
				var _g = event.type;
				switch(_g) {
				case "keydown":
					if(_g1._keyboard.submitDown(event.keyCode)) event.preventDefault();
					break;
				case "keyup":
					_g1._keyboard.submitUp(event.keyCode);
					break;
				}
			};
			this._canvas.addEventListener("keydown",onKey,false);
			this._canvas.addEventListener("keyup",onKey,false);
		}
		return this._keyboard;
	}
	,getExternal: function() {
		if(this._external == null) this._external = new flambe_platform_html_HtmlExternal();
		return this._external;
	}
	,getRenderer: function() {
		return this._renderer;
	}
	,getX: function(event,bounds) {
		return (event.clientX - bounds.left) * this._stage.get_width() / bounds.width;
	}
	,getY: function(event,bounds) {
		return (event.clientY - bounds.top) * this._stage.get_height() / bounds.height;
	}
	,createRenderer: function(canvas) {
		return new flambe_platform_html_CanvasRenderer(canvas);
		flambe_Log.error("No renderer available!");
		return null;
	}
	,__class__: flambe_platform_html_HtmlPlatform
};
var flambe_util_Value = function(value,listener) {
	this._value = value;
	if(listener != null) this._changed = new flambe_util_Signal2(listener); else this._changed = null;
};
$hxClasses["flambe.util.Value"] = flambe_util_Value;
flambe_util_Value.__name__ = ["flambe","util","Value"];
flambe_util_Value.prototype = {
	watch: function(listener) {
		listener(this._value,this._value);
		return this.get_changed().connect(listener);
	}
	,get__: function() {
		return this._value;
	}
	,set__: function(newValue) {
		var oldValue = this._value;
		if(newValue != oldValue) {
			this._value = newValue;
			if(this._changed != null) this._changed.emit(newValue,oldValue);
		}
		return newValue;
	}
	,get_changed: function() {
		if(this._changed == null) this._changed = new flambe_util_Signal2();
		return this._changed;
	}
	,toString: function() {
		return "" + Std.string(this._value);
	}
	,__class__: flambe_util_Value
	,__properties__: {get_changed:"get_changed",set__:"set__",get__:"get__"}
};
var flambe_util_SignalConnection = function(signal,listener) {
	this._next = null;
	this._signal = signal;
	this._listener = listener;
	this.stayInList = true;
};
$hxClasses["flambe.util.SignalConnection"] = flambe_util_SignalConnection;
flambe_util_SignalConnection.__name__ = ["flambe","util","SignalConnection"];
flambe_util_SignalConnection.__interfaces__ = [flambe_util_Disposable];
flambe_util_SignalConnection.prototype = {
	once: function() {
		this.stayInList = false;
		return this;
	}
	,dispose: function() {
		if(this._signal != null) {
			this._signal.disconnect(this);
			this._signal = null;
		}
	}
	,__class__: flambe_util_SignalConnection
};
var flambe_util_SignalBase = function(listener) {
	if(listener != null) this._head = new flambe_util_SignalConnection(this,listener); else this._head = null;
	this._deferredTasks = null;
};
$hxClasses["flambe.util.SignalBase"] = flambe_util_SignalBase;
flambe_util_SignalBase.__name__ = ["flambe","util","SignalBase"];
flambe_util_SignalBase.prototype = {
	hasListeners: function() {
		return this._head != null;
	}
	,connectImpl: function(listener,prioritize) {
		var _g = this;
		var conn = new flambe_util_SignalConnection(this,listener);
		if(this.dispatching()) this.defer(function() {
			_g.listAdd(conn,prioritize);
		}); else this.listAdd(conn,prioritize);
		return conn;
	}
	,disconnect: function(conn) {
		var _g = this;
		if(this.dispatching()) this.defer(function() {
			_g.listRemove(conn);
		}); else this.listRemove(conn);
	}
	,defer: function(fn) {
		var tail = null;
		var p = this._deferredTasks;
		while(p != null) {
			tail = p;
			p = p.next;
		}
		var task = new flambe_util__$SignalBase_Task(fn);
		if(tail != null) tail.next = task; else this._deferredTasks = task;
	}
	,willEmit: function() {
		flambe_util_Assert.that(!this.dispatching());
		var snapshot = this._head;
		this._head = flambe_util_SignalBase.DISPATCHING_SENTINEL;
		return snapshot;
	}
	,didEmit: function(head) {
		this._head = head;
		var snapshot = this._deferredTasks;
		this._deferredTasks = null;
		while(snapshot != null) {
			snapshot.fn();
			snapshot = snapshot.next;
		}
	}
	,listAdd: function(conn,prioritize) {
		if(prioritize) {
			conn._next = this._head;
			this._head = conn;
		} else {
			var tail = null;
			var p = this._head;
			while(p != null) {
				tail = p;
				p = p._next;
			}
			if(tail != null) tail._next = conn; else this._head = conn;
		}
	}
	,listRemove: function(conn) {
		var prev = null;
		var p = this._head;
		while(p != null) {
			if(p == conn) {
				var next = p._next;
				if(prev == null) this._head = next; else prev._next = next;
				return;
			}
			prev = p;
			p = p._next;
		}
	}
	,dispatching: function() {
		return this._head == flambe_util_SignalBase.DISPATCHING_SENTINEL;
	}
	,__class__: flambe_util_SignalBase
};
var flambe_util_Signal2 = function(listener) {
	flambe_util_SignalBase.call(this,listener);
};
$hxClasses["flambe.util.Signal2"] = flambe_util_Signal2;
flambe_util_Signal2.__name__ = ["flambe","util","Signal2"];
flambe_util_Signal2.__super__ = flambe_util_SignalBase;
flambe_util_Signal2.prototype = $extend(flambe_util_SignalBase.prototype,{
	connect: function(listener,prioritize) {
		if(prioritize == null) prioritize = false;
		return this.connectImpl(listener,prioritize);
	}
	,emit: function(arg1,arg2) {
		var _g = this;
		if(this.dispatching()) this.defer(function() {
			_g.emitImpl(arg1,arg2);
		}); else this.emitImpl(arg1,arg2);
	}
	,emitImpl: function(arg1,arg2) {
		var head = this.willEmit();
		var p = head;
		while(p != null) {
			p._listener(arg1,arg2);
			if(!p.stayInList) p.dispose();
			p = p._next;
		}
		this.didEmit(head);
	}
	,__class__: flambe_util_Signal2
});
var flambe_util_Signal1 = function(listener) {
	flambe_util_SignalBase.call(this,listener);
};
$hxClasses["flambe.util.Signal1"] = flambe_util_Signal1;
flambe_util_Signal1.__name__ = ["flambe","util","Signal1"];
flambe_util_Signal1.__super__ = flambe_util_SignalBase;
flambe_util_Signal1.prototype = $extend(flambe_util_SignalBase.prototype,{
	connect: function(listener,prioritize) {
		if(prioritize == null) prioritize = false;
		return this.connectImpl(listener,prioritize);
	}
	,emit: function(arg1) {
		var _g = this;
		if(this.dispatching()) this.defer(function() {
			_g.emitImpl(arg1);
		}); else this.emitImpl(arg1);
	}
	,emitImpl: function(arg1) {
		var head = this.willEmit();
		var p = head;
		while(p != null) {
			p._listener(arg1);
			if(!p.stayInList) p.dispose();
			p = p._next;
		}
		this.didEmit(head);
	}
	,__class__: flambe_util_Signal1
});
var flambe_animation_AnimatedFloat = function(value,listener) {
	this._behavior = null;
	flambe_util_Value.call(this,value,listener);
};
$hxClasses["flambe.animation.AnimatedFloat"] = flambe_animation_AnimatedFloat;
flambe_animation_AnimatedFloat.__name__ = ["flambe","animation","AnimatedFloat"];
flambe_animation_AnimatedFloat.__super__ = flambe_util_Value;
flambe_animation_AnimatedFloat.prototype = $extend(flambe_util_Value.prototype,{
	set__: function(value) {
		this._behavior = null;
		return flambe_util_Value.prototype.set__.call(this,value);
	}
	,update: function(dt) {
		if(this._behavior != null) {
			flambe_util_Value.prototype.set__.call(this,this._behavior.update(dt));
			if(this._behavior.isComplete()) this._behavior = null;
		}
	}
	,animateTo: function(to,seconds,easing) {
		this.set_behavior(new flambe_animation_Tween(this._value,to,seconds,easing));
	}
	,set_behavior: function(behavior) {
		this._behavior = behavior;
		this.update(0);
		return behavior;
	}
	,get_behavior: function() {
		return this._behavior;
	}
	,__class__: flambe_animation_AnimatedFloat
	,__properties__: $extend(flambe_util_Value.prototype.__properties__,{get_behavior:"get_behavior",set_behavior:"set_behavior"})
});
var flambe_System = function() { };
$hxClasses["flambe.System"] = flambe_System;
flambe_System.__name__ = ["flambe","System"];
flambe_System.__properties__ = {get_external:"get_external",get_mouse:"get_mouse",get_pointer:"get_pointer",get_storage:"get_storage",get_stage:"get_stage"}
flambe_System.init = function() {
	if(!flambe_System._calledInit) {
		flambe_System._platform.init();
		flambe_System._calledInit = true;
	}
};
flambe_System.loadAssetPack = function(manifest) {
	flambe_System.assertCalledInit();
	return flambe_System._platform.loadAssetPack(manifest);
};
flambe_System.createLogger = function(tag) {
	return new flambe_util_Logger(flambe_System._platform.createLogHandler(tag));
};
flambe_System.get_stage = function() {
	flambe_System.assertCalledInit();
	return flambe_System._platform.getStage();
};
flambe_System.get_storage = function() {
	flambe_System.assertCalledInit();
	return flambe_System._platform.getStorage();
};
flambe_System.get_pointer = function() {
	flambe_System.assertCalledInit();
	return flambe_System._platform.getPointer();
};
flambe_System.get_mouse = function() {
	flambe_System.assertCalledInit();
	return flambe_System._platform.getMouse();
};
flambe_System.get_external = function() {
	flambe_System.assertCalledInit();
	return flambe_System._platform.getExternal();
};
flambe_System.assertCalledInit = function() {
	flambe_util_Assert.that(flambe_System._calledInit,"You must call System.init() first");
};
var flambe_util_Logger = function(handler) {
	this._handler = handler;
};
$hxClasses["flambe.util.Logger"] = flambe_util_Logger;
flambe_util_Logger.__name__ = ["flambe","util","Logger"];
flambe_util_Logger.prototype = {
	info: function(text,fields) {
		this.log(flambe_util_LogLevel.Info,text,fields);
	}
	,warn: function(text,fields) {
		this.log(flambe_util_LogLevel.Warn,text,fields);
	}
	,error: function(text,fields) {
		this.log(flambe_util_LogLevel.Error,text,fields);
	}
	,log: function(level,text,fields) {
		if(this._handler == null) return;
		if(text == null) text = "";
		if(fields != null) text = flambe_util_Strings.withFields(text,fields);
		this._handler.log(level,text);
	}
	,__class__: flambe_util_Logger
};
var flambe_Log = function() { };
$hxClasses["flambe.Log"] = flambe_Log;
flambe_Log.__name__ = ["flambe","Log"];
flambe_Log.info = function(text,args) {
	flambe_Log.logger.info(text,args);
};
flambe_Log.warn = function(text,args) {
	flambe_Log.logger.warn(text,args);
};
flambe_Log.error = function(text,args) {
	flambe_Log.logger.error(text,args);
};
flambe_Log.__super__ = flambe_util_PackageLog;
flambe_Log.prototype = $extend(flambe_util_PackageLog.prototype,{
	__class__: flambe_Log
});
var flambe_SpeedAdjuster = function() {
	this._realDt = 0;
};
$hxClasses["flambe.SpeedAdjuster"] = flambe_SpeedAdjuster;
flambe_SpeedAdjuster.__name__ = ["flambe","SpeedAdjuster"];
flambe_SpeedAdjuster.__super__ = flambe_Component;
flambe_SpeedAdjuster.prototype = $extend(flambe_Component.prototype,{
	get_name: function() {
		return "SpeedAdjuster_8";
	}
	,onUpdate: function(dt) {
		if(this._realDt > 0) {
			dt = this._realDt;
			this._realDt = 0;
		}
		this.scale.update(dt);
	}
	,__class__: flambe_SpeedAdjuster
});
var flambe_animation_Behavior = function() { };
$hxClasses["flambe.animation.Behavior"] = flambe_animation_Behavior;
flambe_animation_Behavior.__name__ = ["flambe","animation","Behavior"];
flambe_animation_Behavior.prototype = {
	__class__: flambe_animation_Behavior
};
var flambe_animation_Ease = function() { };
$hxClasses["flambe.animation.Ease"] = flambe_animation_Ease;
flambe_animation_Ease.__name__ = ["flambe","animation","Ease"];
flambe_animation_Ease.linear = function(t) {
	return t;
};
flambe_animation_Ease.quadIn = function(t) {
	return t * t;
};
flambe_animation_Ease.quadOut = function(t) {
	return t * (2 - t);
};
flambe_animation_Ease.cubeOut = function(t) {
	return 1 + --t * t * t;
};
flambe_animation_Ease.bounceIn = function(t) {
	t = 1 - t;
	if(t < 0.36363636363636365) return 1 - 7.5625 * t * t;
	if(t < 0.72727272727272729) return 1 - (7.5625 * (t - 0.54545454545454541) * (t - 0.54545454545454541) + .75);
	if(t < 0.90909090909090906) return 1 - (7.5625 * (t - 0.81818181818181823) * (t - 0.81818181818181823) + .9375);
	return 1 - (7.5625 * (t - 0.95454545454545459) * (t - 0.95454545454545459) + .984375);
};
flambe_animation_Ease.bounceOut = function(t) {
	if(t < 0.36363636363636365) return 7.5625 * t * t;
	if(t < 0.72727272727272729) return 7.5625 * (t - 0.54545454545454541) * (t - 0.54545454545454541) + .75;
	if(t < 0.90909090909090906) return 7.5625 * (t - 0.81818181818181823) * (t - 0.81818181818181823) + .9375;
	return 7.5625 * (t - 0.95454545454545459) * (t - 0.95454545454545459) + .984375;
};
flambe_animation_Ease.bounceInOut = function(t) {
	if(t < .5) {
		t = 1 - t * 2;
		if(t < 0.36363636363636365) return (1 - 7.5625 * t * t) / 2;
		if(t < 0.72727272727272729) return (1 - (7.5625 * (t - 0.54545454545454541) * (t - 0.54545454545454541) + .75)) / 2;
		if(t < 0.90909090909090906) return (1 - (7.5625 * (t - 0.81818181818181823) * (t - 0.81818181818181823) + .9375)) / 2;
		return (1 - (7.5625 * (t - 0.95454545454545459) * (t - 0.95454545454545459) + .984375)) / 2;
	}
	t = t * 2 - 1;
	if(t < 0.36363636363636365) return 7.5625 * t * t / 2 + .5;
	if(t < 0.72727272727272729) return (7.5625 * (t - 0.54545454545454541) * (t - 0.54545454545454541) + .75) / 2 + .5;
	if(t < 0.90909090909090906) return (7.5625 * (t - 0.81818181818181823) * (t - 0.81818181818181823) + .9375) / 2 + .5;
	return (7.5625 * (t - 0.95454545454545459) * (t - 0.95454545454545459) + .984375) / 2 + .5;
};
flambe_animation_Ease.backIn = function(t) {
	return t * t * (2.70158 * t - 1.70158);
};
flambe_animation_Ease.backOut = function(t) {
	return 1 - --t * t * (-2.70158 * t - 1.70158);
};
flambe_animation_Ease.backInOut = function(t) {
	t *= 2;
	if(t < 1) return t * t * (2.70158 * t - 1.70158) / 2;
	t -= 2;
	return (1 - t * t * (-2.70158 * t - 1.70158)) / 2 + .5;
};
var flambe_animation_Jitter = function(base,strength) {
	this.base = base;
	this.strength = strength;
};
$hxClasses["flambe.animation.Jitter"] = flambe_animation_Jitter;
flambe_animation_Jitter.__name__ = ["flambe","animation","Jitter"];
flambe_animation_Jitter.__interfaces__ = [flambe_animation_Behavior];
flambe_animation_Jitter.prototype = {
	update: function(dt) {
		return this.base + 2 * Math.random() * this.strength - this.strength;
	}
	,isComplete: function() {
		return false;
	}
	,__class__: flambe_animation_Jitter
};
var flambe_animation_Tween = function(from,to,seconds,easing) {
	this._from = from;
	this._to = to;
	this._duration = seconds;
	this.elapsed = 0;
	if(easing != null) this._easing = easing; else this._easing = flambe_animation_Ease.linear;
};
$hxClasses["flambe.animation.Tween"] = flambe_animation_Tween;
flambe_animation_Tween.__name__ = ["flambe","animation","Tween"];
flambe_animation_Tween.__interfaces__ = [flambe_animation_Behavior];
flambe_animation_Tween.prototype = {
	update: function(dt) {
		this.elapsed += dt;
		if(this.elapsed >= this._duration) return this._to; else return this._from + (this._to - this._from) * this._easing(this.elapsed / this._duration);
	}
	,isComplete: function() {
		return this.elapsed >= this._duration;
	}
	,__class__: flambe_animation_Tween
};
var flambe_asset_Asset = function() { };
$hxClasses["flambe.asset.Asset"] = flambe_asset_Asset;
flambe_asset_Asset.__name__ = ["flambe","asset","Asset"];
flambe_asset_Asset.__interfaces__ = [flambe_util_Disposable];
flambe_asset_Asset.prototype = {
	__class__: flambe_asset_Asset
};
var flambe_asset_AssetFormat = $hxClasses["flambe.asset.AssetFormat"] = { __ename__ : ["flambe","asset","AssetFormat"], __constructs__ : ["WEBP","JXR","PNG","JPG","GIF","DDS","PVR","PKM","MP3","M4A","OPUS","OGG","WAV","Data"] };
flambe_asset_AssetFormat.WEBP = ["WEBP",0];
flambe_asset_AssetFormat.WEBP.toString = $estr;
flambe_asset_AssetFormat.WEBP.__enum__ = flambe_asset_AssetFormat;
flambe_asset_AssetFormat.JXR = ["JXR",1];
flambe_asset_AssetFormat.JXR.toString = $estr;
flambe_asset_AssetFormat.JXR.__enum__ = flambe_asset_AssetFormat;
flambe_asset_AssetFormat.PNG = ["PNG",2];
flambe_asset_AssetFormat.PNG.toString = $estr;
flambe_asset_AssetFormat.PNG.__enum__ = flambe_asset_AssetFormat;
flambe_asset_AssetFormat.JPG = ["JPG",3];
flambe_asset_AssetFormat.JPG.toString = $estr;
flambe_asset_AssetFormat.JPG.__enum__ = flambe_asset_AssetFormat;
flambe_asset_AssetFormat.GIF = ["GIF",4];
flambe_asset_AssetFormat.GIF.toString = $estr;
flambe_asset_AssetFormat.GIF.__enum__ = flambe_asset_AssetFormat;
flambe_asset_AssetFormat.DDS = ["DDS",5];
flambe_asset_AssetFormat.DDS.toString = $estr;
flambe_asset_AssetFormat.DDS.__enum__ = flambe_asset_AssetFormat;
flambe_asset_AssetFormat.PVR = ["PVR",6];
flambe_asset_AssetFormat.PVR.toString = $estr;
flambe_asset_AssetFormat.PVR.__enum__ = flambe_asset_AssetFormat;
flambe_asset_AssetFormat.PKM = ["PKM",7];
flambe_asset_AssetFormat.PKM.toString = $estr;
flambe_asset_AssetFormat.PKM.__enum__ = flambe_asset_AssetFormat;
flambe_asset_AssetFormat.MP3 = ["MP3",8];
flambe_asset_AssetFormat.MP3.toString = $estr;
flambe_asset_AssetFormat.MP3.__enum__ = flambe_asset_AssetFormat;
flambe_asset_AssetFormat.M4A = ["M4A",9];
flambe_asset_AssetFormat.M4A.toString = $estr;
flambe_asset_AssetFormat.M4A.__enum__ = flambe_asset_AssetFormat;
flambe_asset_AssetFormat.OPUS = ["OPUS",10];
flambe_asset_AssetFormat.OPUS.toString = $estr;
flambe_asset_AssetFormat.OPUS.__enum__ = flambe_asset_AssetFormat;
flambe_asset_AssetFormat.OGG = ["OGG",11];
flambe_asset_AssetFormat.OGG.toString = $estr;
flambe_asset_AssetFormat.OGG.__enum__ = flambe_asset_AssetFormat;
flambe_asset_AssetFormat.WAV = ["WAV",12];
flambe_asset_AssetFormat.WAV.toString = $estr;
flambe_asset_AssetFormat.WAV.__enum__ = flambe_asset_AssetFormat;
flambe_asset_AssetFormat.Data = ["Data",13];
flambe_asset_AssetFormat.Data.toString = $estr;
flambe_asset_AssetFormat.Data.__enum__ = flambe_asset_AssetFormat;
var flambe_asset_AssetEntry = function(name,url,format,bytes) {
	this.name = name;
	this.url = url;
	this.format = format;
	this.bytes = bytes;
};
$hxClasses["flambe.asset.AssetEntry"] = flambe_asset_AssetEntry;
flambe_asset_AssetEntry.__name__ = ["flambe","asset","AssetEntry"];
flambe_asset_AssetEntry.prototype = {
	__class__: flambe_asset_AssetEntry
};
var flambe_asset_AssetPack = function() { };
$hxClasses["flambe.asset.AssetPack"] = flambe_asset_AssetPack;
flambe_asset_AssetPack.__name__ = ["flambe","asset","AssetPack"];
flambe_asset_AssetPack.__interfaces__ = [flambe_util_Disposable];
flambe_asset_AssetPack.prototype = {
	__class__: flambe_asset_AssetPack
};
var flambe_asset_File = function() { };
$hxClasses["flambe.asset.File"] = flambe_asset_File;
flambe_asset_File.__name__ = ["flambe","asset","File"];
flambe_asset_File.__interfaces__ = [flambe_asset_Asset];
flambe_asset_File.prototype = {
	__class__: flambe_asset_File
};
var js_Browser = function() { };
$hxClasses["js.Browser"] = js_Browser;
js_Browser.__name__ = ["js","Browser"];
js_Browser.__properties__ = {get_navigator:"get_navigator",get_location:"get_location",get_document:"get_document",get_window:"get_window"}
js_Browser.get_window = function() {
	return window;
};
js_Browser.get_document = function() {
	return window.document;
};
js_Browser.get_location = function() {
	return window.location;
};
js_Browser.get_navigator = function() {
	return window.navigator;
};
js_Browser.getLocalStorage = function() {
	try {
		var s = js_Browser.get_window().localStorage;
		s.getItem("");
		return s;
	} catch( e ) {
		return null;
	}
};
var flambe_asset_Manifest = function() {
	this._remoteBase = null;
	this._localBase = null;
	this._entries = [];
};
$hxClasses["flambe.asset.Manifest"] = flambe_asset_Manifest;
flambe_asset_Manifest.__name__ = ["flambe","asset","Manifest"];
flambe_asset_Manifest.fromAssets = function(packName,required) {
	if(required == null) required = true;
	var packData = Reflect.field(haxe_rtti_Meta.getType(flambe_asset_Manifest).assets[0],packName);
	if(packData == null) {
		if(required) throw flambe_util_Strings.withFields("Missing asset pack",["name",packName]);
		return null;
	}
	var manifest = new flambe_asset_Manifest();
	manifest.set_localBase("assets");
	var _g = 0;
	while(_g < packData.length) {
		var asset = packData[_g];
		++_g;
		var name = asset.name;
		var path = packName + "/" + name + "?v=" + Std.string(asset.md5);
		var format = flambe_asset_Manifest.inferFormat(name);
		if(format != flambe_asset_AssetFormat.Data) name = flambe_util_Strings.removeFileExtension(name);
		manifest.add(name,path,asset.bytes,format);
	}
	return manifest;
};
flambe_asset_Manifest.inferFormat = function(url) {
	var extension = flambe_util_Strings.getUrlExtension(url);
	if(extension != null) {
		var _g = extension.toLowerCase();
		switch(_g) {
		case "gif":
			return flambe_asset_AssetFormat.GIF;
		case "jpg":case "jpeg":
			return flambe_asset_AssetFormat.JPG;
		case "jxr":case "wdp":
			return flambe_asset_AssetFormat.JXR;
		case "png":
			return flambe_asset_AssetFormat.PNG;
		case "webp":
			return flambe_asset_AssetFormat.WEBP;
		case "dds":
			return flambe_asset_AssetFormat.DDS;
		case "pvr":
			return flambe_asset_AssetFormat.PVR;
		case "pkm":
			return flambe_asset_AssetFormat.PKM;
		case "m4a":
			return flambe_asset_AssetFormat.M4A;
		case "mp3":
			return flambe_asset_AssetFormat.MP3;
		case "ogg":
			return flambe_asset_AssetFormat.OGG;
		case "opus":
			return flambe_asset_AssetFormat.OPUS;
		case "wav":
			return flambe_asset_AssetFormat.WAV;
		}
	} else flambe_Log.warn("No file extension for asset, it will be loaded as data",["url",url]);
	return flambe_asset_AssetFormat.Data;
};
flambe_asset_Manifest.prototype = {
	add: function(name,url,bytes,format) {
		if(bytes == null) bytes = 0;
		if(format == null) format = flambe_asset_Manifest.inferFormat(url);
		var entry = new flambe_asset_AssetEntry(name,url,format,bytes);
		this._entries.push(entry);
		return entry;
	}
	,iterator: function() {
		return HxOverrides.iter(this._entries);
	}
	,getFullURL: function(entry) {
		var basePath;
		if(this.get_remoteBase() != null && flambe_asset_Manifest._supportsCrossOrigin) basePath = this.get_remoteBase(); else basePath = this.get_localBase();
		if(basePath != null) return flambe_util_Strings.joinPath(basePath,entry.url); else return entry.url;
	}
	,get_localBase: function() {
		return this._localBase;
	}
	,set_localBase: function(localBase) {
		if(localBase != null) flambe_util_Assert.that(!StringTools.startsWith(localBase,"http://") && !StringTools.startsWith(localBase,"https://"),"localBase must be a path on the same domain, NOT starting with http(s)://");
		return this._localBase = localBase;
	}
	,get_remoteBase: function() {
		return this._remoteBase;
	}
	,__class__: flambe_asset_Manifest
	,__properties__: {get_remoteBase:"get_remoteBase",set_localBase:"set_localBase",get_localBase:"get_localBase"}
};
var flambe_display_BlendMode = $hxClasses["flambe.display.BlendMode"] = { __ename__ : ["flambe","display","BlendMode"], __constructs__ : ["Normal","Add","Multiply","Screen","Mask","Copy"] };
flambe_display_BlendMode.Normal = ["Normal",0];
flambe_display_BlendMode.Normal.toString = $estr;
flambe_display_BlendMode.Normal.__enum__ = flambe_display_BlendMode;
flambe_display_BlendMode.Add = ["Add",1];
flambe_display_BlendMode.Add.toString = $estr;
flambe_display_BlendMode.Add.__enum__ = flambe_display_BlendMode;
flambe_display_BlendMode.Multiply = ["Multiply",2];
flambe_display_BlendMode.Multiply.toString = $estr;
flambe_display_BlendMode.Multiply.__enum__ = flambe_display_BlendMode;
flambe_display_BlendMode.Screen = ["Screen",3];
flambe_display_BlendMode.Screen.toString = $estr;
flambe_display_BlendMode.Screen.__enum__ = flambe_display_BlendMode;
flambe_display_BlendMode.Mask = ["Mask",4];
flambe_display_BlendMode.Mask.toString = $estr;
flambe_display_BlendMode.Mask.__enum__ = flambe_display_BlendMode;
flambe_display_BlendMode.Copy = ["Copy",5];
flambe_display_BlendMode.Copy.toString = $estr;
flambe_display_BlendMode.Copy.__enum__ = flambe_display_BlendMode;
var flambe_display_Sprite = function() {
	this.scissor = null;
	this.blendMode = null;
	var _g = this;
	flambe_Component.call(this);
	this._flags = flambe_util_BitSets.add(this._flags,2 | 4 | 16 | 32);
	this._localMatrix = new flambe_math_Matrix();
	var dirtyMatrix = function(_,_1) {
		_g._flags = flambe_util_BitSets.add(_g._flags,8 | 16);
	};
	this.x = new flambe_animation_AnimatedFloat(0,dirtyMatrix);
	this.y = new flambe_animation_AnimatedFloat(0,dirtyMatrix);
	this.rotation = new flambe_animation_AnimatedFloat(0,dirtyMatrix);
	this.scaleX = new flambe_animation_AnimatedFloat(1,dirtyMatrix);
	this.scaleY = new flambe_animation_AnimatedFloat(1,dirtyMatrix);
	this.anchorX = new flambe_animation_AnimatedFloat(0,dirtyMatrix);
	this.anchorY = new flambe_animation_AnimatedFloat(0,dirtyMatrix);
	this.alpha = new flambe_animation_AnimatedFloat(1);
};
$hxClasses["flambe.display.Sprite"] = flambe_display_Sprite;
flambe_display_Sprite.__name__ = ["flambe","display","Sprite"];
flambe_display_Sprite.hitTest = function(entity,x,y) {
	var sprite;
	var component = entity.getComponent("Sprite_2");
	sprite = component;
	if(sprite != null) {
		if(!flambe_util_BitSets.containsAll(sprite._flags,2 | 4)) return null;
		if(sprite.getLocalMatrix().inverseTransform(x,y,flambe_display_Sprite._scratchPoint)) {
			x = flambe_display_Sprite._scratchPoint.x;
			y = flambe_display_Sprite._scratchPoint.y;
		}
		var scissor = sprite.scissor;
		if(scissor != null && !scissor.contains(x,y)) return null;
	}
	var result = flambe_display_Sprite.hitTestBackwards(entity.firstChild,x,y);
	if(result != null) return result;
	if(sprite != null && sprite.containsLocal(x,y)) return sprite; else return null;
};
flambe_display_Sprite.render = function(entity,g) {
	var sprite;
	var component = entity.getComponent("Sprite_2");
	sprite = component;
	if(sprite != null) {
		var alpha = sprite.alpha.get__();
		if(!sprite.get_visible() || alpha <= 0) return;
		g.save();
		if(alpha < 1) g.multiplyAlpha(alpha);
		if(sprite.blendMode != null) g.setBlendMode(sprite.blendMode);
		var matrix = sprite.getLocalMatrix();
		var m02 = matrix.m02;
		var m12 = matrix.m12;
		if(sprite.get_pixelSnapping()) {
			m02 = Math.round(m02);
			m12 = Math.round(m12);
		}
		g.transform(matrix.m00,matrix.m10,matrix.m01,matrix.m11,m02,m12);
		var scissor = sprite.scissor;
		if(scissor != null) g.applyScissor(scissor.x,scissor.y,scissor.width,scissor.height);
		sprite.draw(g);
	}
	var director;
	var component1 = entity.getComponent("Director_7");
	director = component1;
	if(director != null) {
		var scenes = director.occludedScenes;
		var _g = 0;
		while(_g < scenes.length) {
			var scene = scenes[_g];
			++_g;
			flambe_display_Sprite.render(scene,g);
		}
	}
	var p = entity.firstChild;
	while(p != null) {
		var next = p.next;
		flambe_display_Sprite.render(p,g);
		p = next;
	}
	if(sprite != null) g.restore();
};
flambe_display_Sprite.hitTestBackwards = function(entity,x,y) {
	if(entity != null) {
		var result = flambe_display_Sprite.hitTestBackwards(entity.next,x,y);
		if(result != null) return result; else return flambe_display_Sprite.hitTest(entity,x,y);
	}
	return null;
};
flambe_display_Sprite.__super__ = flambe_Component;
flambe_display_Sprite.prototype = $extend(flambe_Component.prototype,{
	get_name: function() {
		return "Sprite_2";
	}
	,getNaturalWidth: function() {
		return 0;
	}
	,getNaturalHeight: function() {
		return 0;
	}
	,containsLocal: function(localX,localY) {
		return localX >= 0 && localX < this.getNaturalWidth() && localY >= 0 && localY < this.getNaturalHeight();
	}
	,getLocalMatrix: function() {
		if(flambe_util_BitSets.contains(this._flags,8)) {
			this._flags = flambe_util_BitSets.remove(this._flags,8);
			this._localMatrix.compose(this.x.get__(),this.y.get__(),this.scaleX.get__(),this.scaleY.get__(),flambe_math_FMath.toRadians(this.rotation.get__()));
			this._localMatrix.translate(-this.anchorX.get__(),-this.anchorY.get__());
		}
		return this._localMatrix;
	}
	,setAnchor: function(x,y) {
		this.anchorX.set__(x);
		this.anchorY.set__(y);
		return this;
	}
	,centerAnchor: function() {
		this.anchorX.set__(this.getNaturalWidth() / 2);
		this.anchorY.set__(this.getNaturalHeight() / 2);
		return this;
	}
	,setXY: function(x,y) {
		this.x.set__(x);
		this.y.set__(y);
		return this;
	}
	,setAlpha: function(alpha) {
		this.alpha.set__(alpha);
		return this;
	}
	,setScale: function(scale) {
		this.scaleX.set__(scale);
		this.scaleY.set__(scale);
		return this;
	}
	,setScaleXY: function(scaleX,scaleY) {
		this.scaleX.set__(scaleX);
		this.scaleY.set__(scaleY);
		return this;
	}
	,disablePointer: function() {
		this.set_pointerEnabled(false);
		return this;
	}
	,onAdded: function() {
		if(flambe_util_BitSets.contains(this._flags,64)) this.connectHover();
	}
	,onRemoved: function() {
		if(this._hoverConnection != null) {
			this._hoverConnection.dispose();
			this._hoverConnection = null;
		}
	}
	,onUpdate: function(dt) {
		this.x.update(dt);
		this.y.update(dt);
		this.rotation.update(dt);
		this.scaleX.update(dt);
		this.scaleY.update(dt);
		this.alpha.update(dt);
		this.anchorX.update(dt);
		this.anchorY.update(dt);
	}
	,draw: function(g) {
	}
	,getParentSprite: function() {
		if(this.owner == null) return null;
		var entity = this.owner.parent;
		while(entity != null) {
			var sprite;
			var component = entity.getComponent("Sprite_2");
			sprite = component;
			if(sprite != null) return sprite;
			entity = entity.parent;
		}
		return null;
	}
	,get_pointerDown: function() {
		if(this._pointerDown == null) this._pointerDown = new flambe_util_Signal1();
		return this._pointerDown;
	}
	,get_pointerMove: function() {
		if(this._pointerMove == null) this._pointerMove = new flambe_util_Signal1();
		return this._pointerMove;
	}
	,get_pointerUp: function() {
		if(this._pointerUp == null) this._pointerUp = new flambe_util_Signal1();
		return this._pointerUp;
	}
	,get_pointerIn: function() {
		if(this._pointerIn == null) this._pointerIn = new flambe_util_Signal1();
		return this._pointerIn;
	}
	,get_pointerOut: function() {
		if(this._pointerOut == null) this._pointerOut = new flambe_util_Signal1();
		return this._pointerOut;
	}
	,connectHover: function() {
		var _g = this;
		if(this._hoverConnection != null) return;
		this._hoverConnection = flambe_System.get_pointer().move.connect(function(event) {
			var hit = event.hit;
			while(hit != null) {
				if(hit == _g) return;
				hit = hit.getParentSprite();
			}
			if(_g._pointerOut != null && flambe_util_BitSets.contains(_g._flags,64)) _g._pointerOut.emit(event);
			_g._flags = flambe_util_BitSets.remove(_g._flags,64);
			_g._hoverConnection.dispose();
			_g._hoverConnection = null;
		});
	}
	,get_visible: function() {
		return flambe_util_BitSets.contains(this._flags,2);
	}
	,set_visible: function(visible) {
		this._flags = flambe_util_BitSets.set(this._flags,2,visible);
		return visible;
	}
	,set_pointerEnabled: function(pointerEnabled) {
		this._flags = flambe_util_BitSets.set(this._flags,4,pointerEnabled);
		return pointerEnabled;
	}
	,get_pixelSnapping: function() {
		return flambe_util_BitSets.contains(this._flags,32);
	}
	,onPointerDown: function(event) {
		this.onHover(event);
		if(this._pointerDown != null) this._pointerDown.emit(event);
	}
	,onPointerMove: function(event) {
		this.onHover(event);
		if(this._pointerMove != null) this._pointerMove.emit(event);
	}
	,onHover: function(event) {
		if(flambe_util_BitSets.contains(this._flags,64)) return;
		this._flags = flambe_util_BitSets.add(this._flags,64);
		if(this._pointerIn != null || this._pointerOut != null) {
			if(this._pointerIn != null) this._pointerIn.emit(event);
			this.connectHover();
		}
	}
	,onPointerUp: function(event) {
		{
			var _g = event.source;
			switch(Type.enumIndex(_g)) {
			case 1:
				var point = _g[2];
				if(this._pointerOut != null && flambe_util_BitSets.contains(this._flags,64)) this._pointerOut.emit(event);
				this._flags = flambe_util_BitSets.remove(this._flags,64);
				if(this._hoverConnection != null) {
					this._hoverConnection.dispose();
					this._hoverConnection = null;
				}
				break;
			default:
			}
		}
		if(this._pointerUp != null) this._pointerUp.emit(event);
	}
	,__class__: flambe_display_Sprite
	,__properties__: $extend(flambe_Component.prototype.__properties__,{get_pixelSnapping:"get_pixelSnapping",set_pointerEnabled:"set_pointerEnabled",set_visible:"set_visible",get_visible:"get_visible",get_pointerOut:"get_pointerOut",get_pointerIn:"get_pointerIn",get_pointerUp:"get_pointerUp",get_pointerMove:"get_pointerMove",get_pointerDown:"get_pointerDown"})
});
var flambe_display_FillSprite = function(color,width,height) {
	flambe_display_Sprite.call(this);
	this.color = color;
	this.width = new flambe_animation_AnimatedFloat(width);
	this.height = new flambe_animation_AnimatedFloat(height);
};
$hxClasses["flambe.display.FillSprite"] = flambe_display_FillSprite;
flambe_display_FillSprite.__name__ = ["flambe","display","FillSprite"];
flambe_display_FillSprite.__super__ = flambe_display_Sprite;
flambe_display_FillSprite.prototype = $extend(flambe_display_Sprite.prototype,{
	draw: function(g) {
		g.fillRect(this.color,0,0,this.width.get__(),this.height.get__());
	}
	,getNaturalWidth: function() {
		return this.width.get__();
	}
	,getNaturalHeight: function() {
		return this.height.get__();
	}
	,setSize: function(width,height) {
		this.width.set__(width);
		this.height.set__(height);
		return this;
	}
	,onUpdate: function(dt) {
		flambe_display_Sprite.prototype.onUpdate.call(this,dt);
		this.width.update(dt);
		this.height.update(dt);
	}
	,__class__: flambe_display_FillSprite
});
var flambe_display_Glyph = function(charCode) {
	this._kernings = null;
	this.xAdvance = 0;
	this.yOffset = 0;
	this.xOffset = 0;
	this.page = null;
	this.height = 0;
	this.width = 0;
	this.y = 0;
	this.x = 0;
	this.charCode = charCode;
};
$hxClasses["flambe.display.Glyph"] = flambe_display_Glyph;
flambe_display_Glyph.__name__ = ["flambe","display","Glyph"];
flambe_display_Glyph.prototype = {
	draw: function(g,destX,destY) {
		if(this.width > 0) g.drawSubTexture(this.page,destX + this.xOffset,destY + this.yOffset,this.x,this.y,this.width,this.height);
	}
	,getKerning: function(nextCharCode) {
		if(this._kernings != null) return Std["int"](this._kernings.get(nextCharCode)); else return 0;
	}
	,setKerning: function(nextCharCode,amount) {
		if(this._kernings == null) this._kernings = new haxe_ds_IntMap();
		this._kernings.set(nextCharCode,amount);
	}
	,__class__: flambe_display_Glyph
};
var flambe_display_Font = function(pack,name) {
	this.name = name;
	this._pack = pack;
	this._file = pack.getFile(name + ".fnt");
	this.reload();
	this._lastReloadCount = this._file.get_reloadCount().get__();
};
$hxClasses["flambe.display.Font"] = flambe_display_Font;
flambe_display_Font.__name__ = ["flambe","display","Font"];
flambe_display_Font.prototype = {
	layoutText: function(text,align,wrapWidth,letterSpacing,lineSpacing) {
		if(lineSpacing == null) lineSpacing = 0;
		if(letterSpacing == null) letterSpacing = 0;
		if(wrapWidth == null) wrapWidth = 0;
		if(align == null) align = flambe_display_TextAlign.Left;
		return new flambe_display_TextLayout(this,text,align,wrapWidth,letterSpacing,lineSpacing);
	}
	,getGlyph: function(charCode) {
		return this._glyphs.get(charCode);
	}
	,checkReload: function() {
		var reloadCount = this._file.get_reloadCount().get__();
		if(this._lastReloadCount != reloadCount) {
			this._lastReloadCount = reloadCount;
			this.reload();
		}
		return reloadCount;
	}
	,reload: function() {
		this._glyphs = new haxe_ds_IntMap();
		this._glyphs.set(flambe_display_Font.NEWLINE.charCode,flambe_display_Font.NEWLINE);
		var parser = new flambe_display__$Font_ConfigParser(this._file.toString());
		var pages = new haxe_ds_IntMap();
		var idx = this.name.lastIndexOf("/");
		var basePath;
		if(idx >= 0) basePath = HxOverrides.substr(this.name,0,idx + 1); else basePath = "";
		var $it0 = parser.keywords();
		while( $it0.hasNext() ) {
			var keyword = $it0.next();
			switch(keyword) {
			case "info":
				var $it1 = parser.pairs();
				while( $it1.hasNext() ) {
					var pair = $it1.next();
					var _g = pair.key;
					switch(_g) {
					case "size":
						this.size = pair.getInt();
						break;
					}
				}
				break;
			case "common":
				var $it2 = parser.pairs();
				while( $it2.hasNext() ) {
					var pair1 = $it2.next();
					var _g1 = pair1.key;
					switch(_g1) {
					case "lineHeight":
						this.lineHeight = pair1.getInt();
						break;
					}
				}
				break;
			case "page":
				var pageId = 0;
				var file = null;
				var $it3 = parser.pairs();
				while( $it3.hasNext() ) {
					var pair2 = $it3.next();
					var _g2 = pair2.key;
					switch(_g2) {
					case "id":
						pageId = pair2.getInt();
						break;
					case "file":
						file = pair2.getString();
						break;
					}
				}
				var value = this._pack.getTexture(basePath + flambe_util_Strings.removeFileExtension(file));
				pages.set(pageId,value);
				break;
			case "char":
				var glyph = null;
				var $it4 = parser.pairs();
				while( $it4.hasNext() ) {
					var pair3 = $it4.next();
					var _g3 = pair3.key;
					switch(_g3) {
					case "id":
						glyph = new flambe_display_Glyph(pair3.getInt());
						break;
					case "x":
						glyph.x = pair3.getInt();
						break;
					case "y":
						glyph.y = pair3.getInt();
						break;
					case "width":
						glyph.width = pair3.getInt();
						break;
					case "height":
						glyph.height = pair3.getInt();
						break;
					case "page":
						var key = pair3.getInt();
						glyph.page = pages.get(key);
						break;
					case "xoffset":
						glyph.xOffset = pair3.getInt();
						break;
					case "yoffset":
						glyph.yOffset = pair3.getInt();
						break;
					case "xadvance":
						glyph.xAdvance = pair3.getInt();
						break;
					}
				}
				this._glyphs.set(glyph.charCode,glyph);
				break;
			case "kerning":
				var first = null;
				var second = 0;
				var amount = 0;
				var $it5 = parser.pairs();
				while( $it5.hasNext() ) {
					var pair4 = $it5.next();
					var _g4 = pair4.key;
					switch(_g4) {
					case "first":
						var key1 = pair4.getInt();
						first = this._glyphs.get(key1);
						break;
					case "second":
						second = pair4.getInt();
						break;
					case "amount":
						amount = pair4.getInt();
						break;
					}
				}
				if(first != null && amount != 0) first.setKerning(second,amount);
				break;
			}
		}
	}
	,__class__: flambe_display_Font
};
var flambe_display_TextAlign = $hxClasses["flambe.display.TextAlign"] = { __ename__ : ["flambe","display","TextAlign"], __constructs__ : ["Left","Center","Right"] };
flambe_display_TextAlign.Left = ["Left",0];
flambe_display_TextAlign.Left.toString = $estr;
flambe_display_TextAlign.Left.__enum__ = flambe_display_TextAlign;
flambe_display_TextAlign.Center = ["Center",1];
flambe_display_TextAlign.Center.toString = $estr;
flambe_display_TextAlign.Center.__enum__ = flambe_display_TextAlign;
flambe_display_TextAlign.Right = ["Right",2];
flambe_display_TextAlign.Right.toString = $estr;
flambe_display_TextAlign.Right.__enum__ = flambe_display_TextAlign;
var flambe_display_TextLayout = function(font,text,align,wrapWidth,letterSpacing,lineSpacing) {
	this.lines = 0;
	var _g = this;
	this._font = font;
	this._glyphs = [];
	this._offsets = [];
	this._lineOffset = Math.round(font.lineHeight + lineSpacing);
	this.bounds = new flambe_math_Rectangle();
	var lineWidths = [];
	var ll = text.length;
	var _g1 = 0;
	while(_g1 < ll) {
		var ii = _g1++;
		var charCode = StringTools.fastCodeAt(text,ii);
		var glyph = font.getGlyph(charCode);
		if(glyph != null) this._glyphs.push(glyph); else flambe_Log.warn("Requested a missing character from font",["font",font.name,"charCode",charCode]);
	}
	var lastSpaceIdx = -1;
	var lineWidth = 0.0;
	var lineHeight = 0.0;
	var newline = font.getGlyph(10);
	var addLine = function() {
		_g.bounds.width = flambe_math_FMath.max(_g.bounds.width,lineWidth);
		_g.bounds.height += lineHeight;
		lineWidths[_g.lines] = lineWidth;
		lineWidth = 0;
		lineHeight = 0;
		++_g.lines;
	};
	var ii1 = 0;
	while(ii1 < this._glyphs.length) {
		var glyph1 = this._glyphs[ii1];
		this._offsets[ii1] = Math.round(lineWidth);
		var wordWrap = wrapWidth > 0 && lineWidth + glyph1.width > wrapWidth;
		if(wordWrap || glyph1 == newline) {
			if(wordWrap) {
				if(lastSpaceIdx >= 0) {
					this._glyphs[lastSpaceIdx] = newline;
					lineWidth = this._offsets[lastSpaceIdx];
					ii1 = lastSpaceIdx;
				} else this._glyphs.splice(ii1,0,newline);
			}
			lastSpaceIdx = -1;
			lineHeight = this._lineOffset;
			addLine();
		} else {
			if(glyph1.charCode == 32) lastSpaceIdx = ii1;
			lineWidth += glyph1.xAdvance + letterSpacing;
			lineHeight = flambe_math_FMath.max(lineHeight,glyph1.height + glyph1.yOffset);
			if(ii1 + 1 < this._glyphs.length) {
				var nextGlyph = this._glyphs[ii1 + 1];
				lineWidth += glyph1.getKerning(nextGlyph.charCode);
			}
		}
		++ii1;
	}
	addLine();
	var lineY = 0.0;
	var alignOffset = flambe_display_TextLayout.getAlignOffset(align,lineWidths[0],wrapWidth);
	var top = 1.79769313486231e+308;
	var bottom = -1.79769313486231e+308;
	var line = 0;
	var ii2 = 0;
	var ll1 = this._glyphs.length;
	while(ii2 < ll1) {
		var glyph2 = this._glyphs[ii2];
		if(glyph2.charCode == 10) {
			lineY += this._lineOffset;
			++line;
			alignOffset = flambe_display_TextLayout.getAlignOffset(align,lineWidths[line],wrapWidth);
		}
		this._offsets[ii2] += alignOffset;
		var glyphY = lineY + glyph2.yOffset;
		top = flambe_math_FMath.min(top,glyphY);
		bottom = flambe_math_FMath.max(bottom,glyphY + glyph2.height);
		++ii2;
	}
	this.bounds.x = flambe_display_TextLayout.getAlignOffset(align,this.bounds.width,wrapWidth);
	this.bounds.y = top;
	this.bounds.height = bottom - top;
};
$hxClasses["flambe.display.TextLayout"] = flambe_display_TextLayout;
flambe_display_TextLayout.__name__ = ["flambe","display","TextLayout"];
flambe_display_TextLayout.getAlignOffset = function(align,lineWidth,totalWidth) {
	switch(Type.enumIndex(align)) {
	case 0:
		return 0;
	case 2:
		return totalWidth - lineWidth;
	case 1:
		return Math.round((totalWidth - lineWidth) / 2);
	}
};
flambe_display_TextLayout.prototype = {
	draw: function(g) {
		var y = 0.0;
		var ii = 0;
		var ll = this._glyphs.length;
		while(ii < ll) {
			var glyph = this._glyphs[ii];
			if(glyph.charCode == 10) y += this._lineOffset; else {
				var x = this._offsets[ii];
				glyph.draw(g,x,y);
			}
			++ii;
		}
	}
	,__class__: flambe_display_TextLayout
};
var flambe_display__$Font_ConfigParser = function(config) {
	this._configText = config;
	this._keywordPattern = new EReg("([A-Za-z]+)(.*)","");
	this._pairPattern = new EReg("([A-Za-z]+)=(\"[^\"]*\"|[^\\s]+)","");
};
$hxClasses["flambe.display._Font.ConfigParser"] = flambe_display__$Font_ConfigParser;
flambe_display__$Font_ConfigParser.__name__ = ["flambe","display","_Font","ConfigParser"];
flambe_display__$Font_ConfigParser.advance = function(text,expr) {
	var m = expr.matchedPos();
	return HxOverrides.substr(text,m.pos + m.len,text.length);
};
flambe_display__$Font_ConfigParser.prototype = {
	keywords: function() {
		var _g = this;
		var text = this._configText;
		return { next : function() {
			text = flambe_display__$Font_ConfigParser.advance(text,_g._keywordPattern);
			_g._pairText = _g._keywordPattern.matched(2);
			return _g._keywordPattern.matched(1);
		}, hasNext : function() {
			return _g._keywordPattern.match(text);
		}};
	}
	,pairs: function() {
		var _g = this;
		var text = this._pairText;
		return { next : function() {
			text = flambe_display__$Font_ConfigParser.advance(text,_g._pairPattern);
			return new flambe_display__$Font_ConfigPair(_g._pairPattern.matched(1),_g._pairPattern.matched(2));
		}, hasNext : function() {
			return _g._pairPattern.match(text);
		}};
	}
	,__class__: flambe_display__$Font_ConfigParser
};
var flambe_display__$Font_ConfigPair = function(key,value) {
	this.key = key;
	this._value = value;
};
$hxClasses["flambe.display._Font.ConfigPair"] = flambe_display__$Font_ConfigPair;
flambe_display__$Font_ConfigPair.__name__ = ["flambe","display","_Font","ConfigPair"];
flambe_display__$Font_ConfigPair.prototype = {
	getInt: function() {
		return Std.parseInt(this._value);
	}
	,getString: function() {
		if(StringTools.fastCodeAt(this._value,0) != 34) return null;
		return HxOverrides.substr(this._value,1,this._value.length - 2);
	}
	,__class__: flambe_display__$Font_ConfigPair
};
var flambe_display_Graphics = function() { };
$hxClasses["flambe.display.Graphics"] = flambe_display_Graphics;
flambe_display_Graphics.__name__ = ["flambe","display","Graphics"];
flambe_display_Graphics.prototype = {
	__class__: flambe_display_Graphics
};
var flambe_display_ImageSprite = function(texture) {
	flambe_display_Sprite.call(this);
	this.texture = texture;
};
$hxClasses["flambe.display.ImageSprite"] = flambe_display_ImageSprite;
flambe_display_ImageSprite.__name__ = ["flambe","display","ImageSprite"];
flambe_display_ImageSprite.__super__ = flambe_display_Sprite;
flambe_display_ImageSprite.prototype = $extend(flambe_display_Sprite.prototype,{
	draw: function(g) {
		if(this.texture != null) g.drawTexture(this.texture,0,0);
	}
	,getNaturalWidth: function() {
		if(this.texture != null) return this.texture.get_width(); else return 0;
	}
	,getNaturalHeight: function() {
		if(this.texture != null) return this.texture.get_height(); else return 0;
	}
	,__class__: flambe_display_ImageSprite
});
var flambe_display_Orientation = $hxClasses["flambe.display.Orientation"] = { __ename__ : ["flambe","display","Orientation"], __constructs__ : ["Portrait","Landscape"] };
flambe_display_Orientation.Portrait = ["Portrait",0];
flambe_display_Orientation.Portrait.toString = $estr;
flambe_display_Orientation.Portrait.__enum__ = flambe_display_Orientation;
flambe_display_Orientation.Landscape = ["Landscape",1];
flambe_display_Orientation.Landscape.toString = $estr;
flambe_display_Orientation.Landscape.__enum__ = flambe_display_Orientation;
var flambe_display_Texture = function() { };
$hxClasses["flambe.display.Texture"] = flambe_display_Texture;
flambe_display_Texture.__name__ = ["flambe","display","Texture"];
flambe_display_Texture.__interfaces__ = [flambe_asset_Asset];
flambe_display_Texture.prototype = {
	__class__: flambe_display_Texture
};
var flambe_display_SubTexture = function() { };
$hxClasses["flambe.display.SubTexture"] = flambe_display_SubTexture;
flambe_display_SubTexture.__name__ = ["flambe","display","SubTexture"];
flambe_display_SubTexture.__interfaces__ = [flambe_display_Texture];
var flambe_display_TextSprite = function(font,text) {
	if(text == null) text = "";
	this._lastReloadCount = -1;
	this._layout = null;
	var _g = this;
	flambe_display_Sprite.call(this);
	this._font = font;
	this._text = text;
	this._align = flambe_display_TextAlign.Left;
	this._flags = flambe_util_BitSets.add(this._flags,128);
	var dirtyText = function(_,_1) {
		_g._flags = flambe_util_BitSets.add(_g._flags,128);
	};
	this.wrapWidth = new flambe_animation_AnimatedFloat(0,dirtyText);
	this.letterSpacing = new flambe_animation_AnimatedFloat(0,dirtyText);
	this.lineSpacing = new flambe_animation_AnimatedFloat(0,dirtyText);
};
$hxClasses["flambe.display.TextSprite"] = flambe_display_TextSprite;
flambe_display_TextSprite.__name__ = ["flambe","display","TextSprite"];
flambe_display_TextSprite.__super__ = flambe_display_Sprite;
flambe_display_TextSprite.prototype = $extend(flambe_display_Sprite.prototype,{
	draw: function(g) {
		this.updateLayout();
		this._layout.draw(g);
	}
	,getNaturalWidth: function() {
		this.updateLayout();
		if(this.wrapWidth.get__() > 0) return this.wrapWidth.get__(); else return this._layout.bounds.width;
	}
	,getNaturalHeight: function() {
		this.updateLayout();
		var paddedHeight = this._layout.lines * (this._font.lineHeight + this.lineSpacing.get__());
		var boundsHeight = this._layout.bounds.height;
		return flambe_math_FMath.max(paddedHeight,boundsHeight);
	}
	,containsLocal: function(localX,localY) {
		this.updateLayout();
		return this._layout.bounds.contains(localX,localY);
	}
	,setAlign: function(align) {
		this.set_align(align);
		return this;
	}
	,set_text: function(text) {
		if(text != this._text) {
			this._text = text;
			this._flags = flambe_util_BitSets.add(this._flags,128);
		}
		return text;
	}
	,get_font: function() {
		return this._font;
	}
	,set_align: function(align) {
		if(align != this._align) {
			this._align = align;
			this._flags = flambe_util_BitSets.add(this._flags,128);
		}
		return align;
	}
	,updateLayout: function() {
		var reloadCount = this._font.checkReload();
		if(reloadCount != this._lastReloadCount) {
			this._lastReloadCount = reloadCount;
			this._flags = flambe_util_BitSets.add(this._flags,128);
		}
		if(flambe_util_BitSets.contains(this._flags,128)) {
			this._flags = flambe_util_BitSets.remove(this._flags,128);
			this._layout = this.get_font().layoutText(this._text,this._align,this.wrapWidth.get__(),this.letterSpacing.get__(),this.lineSpacing.get__());
		}
	}
	,onUpdate: function(dt) {
		flambe_display_Sprite.prototype.onUpdate.call(this,dt);
		this.wrapWidth.update(dt);
		this.letterSpacing.update(dt);
		this.lineSpacing.update(dt);
	}
	,__class__: flambe_display_TextSprite
	,__properties__: $extend(flambe_display_Sprite.prototype.__properties__,{set_align:"set_align",get_font:"get_font",set_text:"set_text"})
});
var flambe_input_Key = $hxClasses["flambe.input.Key"] = { __ename__ : ["flambe","input","Key"], __constructs__ : ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","Number0","Number1","Number2","Number3","Number4","Number5","Number6","Number7","Number8","Number9","Numpad0","Numpad1","Numpad2","Numpad3","Numpad4","Numpad5","Numpad6","Numpad7","Numpad8","Numpad9","NumpadAdd","NumpadDecimal","NumpadDivide","NumpadEnter","NumpadMultiply","NumpadSubtract","F1","F2","F3","F4","F5","F6","F7","F8","F9","F10","F11","F12","F13","F14","F15","Left","Up","Right","Down","Alt","Backquote","Backslash","Backspace","CapsLock","Comma","Command","Control","Delete","End","Enter","Equals","Escape","Home","Insert","LeftBracket","Minus","PageDown","PageUp","Period","Quote","RightBracket","Semicolon","Shift","Slash","Space","Tab","Menu","Search","Unknown"] };
flambe_input_Key.A = ["A",0];
flambe_input_Key.A.toString = $estr;
flambe_input_Key.A.__enum__ = flambe_input_Key;
flambe_input_Key.B = ["B",1];
flambe_input_Key.B.toString = $estr;
flambe_input_Key.B.__enum__ = flambe_input_Key;
flambe_input_Key.C = ["C",2];
flambe_input_Key.C.toString = $estr;
flambe_input_Key.C.__enum__ = flambe_input_Key;
flambe_input_Key.D = ["D",3];
flambe_input_Key.D.toString = $estr;
flambe_input_Key.D.__enum__ = flambe_input_Key;
flambe_input_Key.E = ["E",4];
flambe_input_Key.E.toString = $estr;
flambe_input_Key.E.__enum__ = flambe_input_Key;
flambe_input_Key.F = ["F",5];
flambe_input_Key.F.toString = $estr;
flambe_input_Key.F.__enum__ = flambe_input_Key;
flambe_input_Key.G = ["G",6];
flambe_input_Key.G.toString = $estr;
flambe_input_Key.G.__enum__ = flambe_input_Key;
flambe_input_Key.H = ["H",7];
flambe_input_Key.H.toString = $estr;
flambe_input_Key.H.__enum__ = flambe_input_Key;
flambe_input_Key.I = ["I",8];
flambe_input_Key.I.toString = $estr;
flambe_input_Key.I.__enum__ = flambe_input_Key;
flambe_input_Key.J = ["J",9];
flambe_input_Key.J.toString = $estr;
flambe_input_Key.J.__enum__ = flambe_input_Key;
flambe_input_Key.K = ["K",10];
flambe_input_Key.K.toString = $estr;
flambe_input_Key.K.__enum__ = flambe_input_Key;
flambe_input_Key.L = ["L",11];
flambe_input_Key.L.toString = $estr;
flambe_input_Key.L.__enum__ = flambe_input_Key;
flambe_input_Key.M = ["M",12];
flambe_input_Key.M.toString = $estr;
flambe_input_Key.M.__enum__ = flambe_input_Key;
flambe_input_Key.N = ["N",13];
flambe_input_Key.N.toString = $estr;
flambe_input_Key.N.__enum__ = flambe_input_Key;
flambe_input_Key.O = ["O",14];
flambe_input_Key.O.toString = $estr;
flambe_input_Key.O.__enum__ = flambe_input_Key;
flambe_input_Key.P = ["P",15];
flambe_input_Key.P.toString = $estr;
flambe_input_Key.P.__enum__ = flambe_input_Key;
flambe_input_Key.Q = ["Q",16];
flambe_input_Key.Q.toString = $estr;
flambe_input_Key.Q.__enum__ = flambe_input_Key;
flambe_input_Key.R = ["R",17];
flambe_input_Key.R.toString = $estr;
flambe_input_Key.R.__enum__ = flambe_input_Key;
flambe_input_Key.S = ["S",18];
flambe_input_Key.S.toString = $estr;
flambe_input_Key.S.__enum__ = flambe_input_Key;
flambe_input_Key.T = ["T",19];
flambe_input_Key.T.toString = $estr;
flambe_input_Key.T.__enum__ = flambe_input_Key;
flambe_input_Key.U = ["U",20];
flambe_input_Key.U.toString = $estr;
flambe_input_Key.U.__enum__ = flambe_input_Key;
flambe_input_Key.V = ["V",21];
flambe_input_Key.V.toString = $estr;
flambe_input_Key.V.__enum__ = flambe_input_Key;
flambe_input_Key.W = ["W",22];
flambe_input_Key.W.toString = $estr;
flambe_input_Key.W.__enum__ = flambe_input_Key;
flambe_input_Key.X = ["X",23];
flambe_input_Key.X.toString = $estr;
flambe_input_Key.X.__enum__ = flambe_input_Key;
flambe_input_Key.Y = ["Y",24];
flambe_input_Key.Y.toString = $estr;
flambe_input_Key.Y.__enum__ = flambe_input_Key;
flambe_input_Key.Z = ["Z",25];
flambe_input_Key.Z.toString = $estr;
flambe_input_Key.Z.__enum__ = flambe_input_Key;
flambe_input_Key.Number0 = ["Number0",26];
flambe_input_Key.Number0.toString = $estr;
flambe_input_Key.Number0.__enum__ = flambe_input_Key;
flambe_input_Key.Number1 = ["Number1",27];
flambe_input_Key.Number1.toString = $estr;
flambe_input_Key.Number1.__enum__ = flambe_input_Key;
flambe_input_Key.Number2 = ["Number2",28];
flambe_input_Key.Number2.toString = $estr;
flambe_input_Key.Number2.__enum__ = flambe_input_Key;
flambe_input_Key.Number3 = ["Number3",29];
flambe_input_Key.Number3.toString = $estr;
flambe_input_Key.Number3.__enum__ = flambe_input_Key;
flambe_input_Key.Number4 = ["Number4",30];
flambe_input_Key.Number4.toString = $estr;
flambe_input_Key.Number4.__enum__ = flambe_input_Key;
flambe_input_Key.Number5 = ["Number5",31];
flambe_input_Key.Number5.toString = $estr;
flambe_input_Key.Number5.__enum__ = flambe_input_Key;
flambe_input_Key.Number6 = ["Number6",32];
flambe_input_Key.Number6.toString = $estr;
flambe_input_Key.Number6.__enum__ = flambe_input_Key;
flambe_input_Key.Number7 = ["Number7",33];
flambe_input_Key.Number7.toString = $estr;
flambe_input_Key.Number7.__enum__ = flambe_input_Key;
flambe_input_Key.Number8 = ["Number8",34];
flambe_input_Key.Number8.toString = $estr;
flambe_input_Key.Number8.__enum__ = flambe_input_Key;
flambe_input_Key.Number9 = ["Number9",35];
flambe_input_Key.Number9.toString = $estr;
flambe_input_Key.Number9.__enum__ = flambe_input_Key;
flambe_input_Key.Numpad0 = ["Numpad0",36];
flambe_input_Key.Numpad0.toString = $estr;
flambe_input_Key.Numpad0.__enum__ = flambe_input_Key;
flambe_input_Key.Numpad1 = ["Numpad1",37];
flambe_input_Key.Numpad1.toString = $estr;
flambe_input_Key.Numpad1.__enum__ = flambe_input_Key;
flambe_input_Key.Numpad2 = ["Numpad2",38];
flambe_input_Key.Numpad2.toString = $estr;
flambe_input_Key.Numpad2.__enum__ = flambe_input_Key;
flambe_input_Key.Numpad3 = ["Numpad3",39];
flambe_input_Key.Numpad3.toString = $estr;
flambe_input_Key.Numpad3.__enum__ = flambe_input_Key;
flambe_input_Key.Numpad4 = ["Numpad4",40];
flambe_input_Key.Numpad4.toString = $estr;
flambe_input_Key.Numpad4.__enum__ = flambe_input_Key;
flambe_input_Key.Numpad5 = ["Numpad5",41];
flambe_input_Key.Numpad5.toString = $estr;
flambe_input_Key.Numpad5.__enum__ = flambe_input_Key;
flambe_input_Key.Numpad6 = ["Numpad6",42];
flambe_input_Key.Numpad6.toString = $estr;
flambe_input_Key.Numpad6.__enum__ = flambe_input_Key;
flambe_input_Key.Numpad7 = ["Numpad7",43];
flambe_input_Key.Numpad7.toString = $estr;
flambe_input_Key.Numpad7.__enum__ = flambe_input_Key;
flambe_input_Key.Numpad8 = ["Numpad8",44];
flambe_input_Key.Numpad8.toString = $estr;
flambe_input_Key.Numpad8.__enum__ = flambe_input_Key;
flambe_input_Key.Numpad9 = ["Numpad9",45];
flambe_input_Key.Numpad9.toString = $estr;
flambe_input_Key.Numpad9.__enum__ = flambe_input_Key;
flambe_input_Key.NumpadAdd = ["NumpadAdd",46];
flambe_input_Key.NumpadAdd.toString = $estr;
flambe_input_Key.NumpadAdd.__enum__ = flambe_input_Key;
flambe_input_Key.NumpadDecimal = ["NumpadDecimal",47];
flambe_input_Key.NumpadDecimal.toString = $estr;
flambe_input_Key.NumpadDecimal.__enum__ = flambe_input_Key;
flambe_input_Key.NumpadDivide = ["NumpadDivide",48];
flambe_input_Key.NumpadDivide.toString = $estr;
flambe_input_Key.NumpadDivide.__enum__ = flambe_input_Key;
flambe_input_Key.NumpadEnter = ["NumpadEnter",49];
flambe_input_Key.NumpadEnter.toString = $estr;
flambe_input_Key.NumpadEnter.__enum__ = flambe_input_Key;
flambe_input_Key.NumpadMultiply = ["NumpadMultiply",50];
flambe_input_Key.NumpadMultiply.toString = $estr;
flambe_input_Key.NumpadMultiply.__enum__ = flambe_input_Key;
flambe_input_Key.NumpadSubtract = ["NumpadSubtract",51];
flambe_input_Key.NumpadSubtract.toString = $estr;
flambe_input_Key.NumpadSubtract.__enum__ = flambe_input_Key;
flambe_input_Key.F1 = ["F1",52];
flambe_input_Key.F1.toString = $estr;
flambe_input_Key.F1.__enum__ = flambe_input_Key;
flambe_input_Key.F2 = ["F2",53];
flambe_input_Key.F2.toString = $estr;
flambe_input_Key.F2.__enum__ = flambe_input_Key;
flambe_input_Key.F3 = ["F3",54];
flambe_input_Key.F3.toString = $estr;
flambe_input_Key.F3.__enum__ = flambe_input_Key;
flambe_input_Key.F4 = ["F4",55];
flambe_input_Key.F4.toString = $estr;
flambe_input_Key.F4.__enum__ = flambe_input_Key;
flambe_input_Key.F5 = ["F5",56];
flambe_input_Key.F5.toString = $estr;
flambe_input_Key.F5.__enum__ = flambe_input_Key;
flambe_input_Key.F6 = ["F6",57];
flambe_input_Key.F6.toString = $estr;
flambe_input_Key.F6.__enum__ = flambe_input_Key;
flambe_input_Key.F7 = ["F7",58];
flambe_input_Key.F7.toString = $estr;
flambe_input_Key.F7.__enum__ = flambe_input_Key;
flambe_input_Key.F8 = ["F8",59];
flambe_input_Key.F8.toString = $estr;
flambe_input_Key.F8.__enum__ = flambe_input_Key;
flambe_input_Key.F9 = ["F9",60];
flambe_input_Key.F9.toString = $estr;
flambe_input_Key.F9.__enum__ = flambe_input_Key;
flambe_input_Key.F10 = ["F10",61];
flambe_input_Key.F10.toString = $estr;
flambe_input_Key.F10.__enum__ = flambe_input_Key;
flambe_input_Key.F11 = ["F11",62];
flambe_input_Key.F11.toString = $estr;
flambe_input_Key.F11.__enum__ = flambe_input_Key;
flambe_input_Key.F12 = ["F12",63];
flambe_input_Key.F12.toString = $estr;
flambe_input_Key.F12.__enum__ = flambe_input_Key;
flambe_input_Key.F13 = ["F13",64];
flambe_input_Key.F13.toString = $estr;
flambe_input_Key.F13.__enum__ = flambe_input_Key;
flambe_input_Key.F14 = ["F14",65];
flambe_input_Key.F14.toString = $estr;
flambe_input_Key.F14.__enum__ = flambe_input_Key;
flambe_input_Key.F15 = ["F15",66];
flambe_input_Key.F15.toString = $estr;
flambe_input_Key.F15.__enum__ = flambe_input_Key;
flambe_input_Key.Left = ["Left",67];
flambe_input_Key.Left.toString = $estr;
flambe_input_Key.Left.__enum__ = flambe_input_Key;
flambe_input_Key.Up = ["Up",68];
flambe_input_Key.Up.toString = $estr;
flambe_input_Key.Up.__enum__ = flambe_input_Key;
flambe_input_Key.Right = ["Right",69];
flambe_input_Key.Right.toString = $estr;
flambe_input_Key.Right.__enum__ = flambe_input_Key;
flambe_input_Key.Down = ["Down",70];
flambe_input_Key.Down.toString = $estr;
flambe_input_Key.Down.__enum__ = flambe_input_Key;
flambe_input_Key.Alt = ["Alt",71];
flambe_input_Key.Alt.toString = $estr;
flambe_input_Key.Alt.__enum__ = flambe_input_Key;
flambe_input_Key.Backquote = ["Backquote",72];
flambe_input_Key.Backquote.toString = $estr;
flambe_input_Key.Backquote.__enum__ = flambe_input_Key;
flambe_input_Key.Backslash = ["Backslash",73];
flambe_input_Key.Backslash.toString = $estr;
flambe_input_Key.Backslash.__enum__ = flambe_input_Key;
flambe_input_Key.Backspace = ["Backspace",74];
flambe_input_Key.Backspace.toString = $estr;
flambe_input_Key.Backspace.__enum__ = flambe_input_Key;
flambe_input_Key.CapsLock = ["CapsLock",75];
flambe_input_Key.CapsLock.toString = $estr;
flambe_input_Key.CapsLock.__enum__ = flambe_input_Key;
flambe_input_Key.Comma = ["Comma",76];
flambe_input_Key.Comma.toString = $estr;
flambe_input_Key.Comma.__enum__ = flambe_input_Key;
flambe_input_Key.Command = ["Command",77];
flambe_input_Key.Command.toString = $estr;
flambe_input_Key.Command.__enum__ = flambe_input_Key;
flambe_input_Key.Control = ["Control",78];
flambe_input_Key.Control.toString = $estr;
flambe_input_Key.Control.__enum__ = flambe_input_Key;
flambe_input_Key.Delete = ["Delete",79];
flambe_input_Key.Delete.toString = $estr;
flambe_input_Key.Delete.__enum__ = flambe_input_Key;
flambe_input_Key.End = ["End",80];
flambe_input_Key.End.toString = $estr;
flambe_input_Key.End.__enum__ = flambe_input_Key;
flambe_input_Key.Enter = ["Enter",81];
flambe_input_Key.Enter.toString = $estr;
flambe_input_Key.Enter.__enum__ = flambe_input_Key;
flambe_input_Key.Equals = ["Equals",82];
flambe_input_Key.Equals.toString = $estr;
flambe_input_Key.Equals.__enum__ = flambe_input_Key;
flambe_input_Key.Escape = ["Escape",83];
flambe_input_Key.Escape.toString = $estr;
flambe_input_Key.Escape.__enum__ = flambe_input_Key;
flambe_input_Key.Home = ["Home",84];
flambe_input_Key.Home.toString = $estr;
flambe_input_Key.Home.__enum__ = flambe_input_Key;
flambe_input_Key.Insert = ["Insert",85];
flambe_input_Key.Insert.toString = $estr;
flambe_input_Key.Insert.__enum__ = flambe_input_Key;
flambe_input_Key.LeftBracket = ["LeftBracket",86];
flambe_input_Key.LeftBracket.toString = $estr;
flambe_input_Key.LeftBracket.__enum__ = flambe_input_Key;
flambe_input_Key.Minus = ["Minus",87];
flambe_input_Key.Minus.toString = $estr;
flambe_input_Key.Minus.__enum__ = flambe_input_Key;
flambe_input_Key.PageDown = ["PageDown",88];
flambe_input_Key.PageDown.toString = $estr;
flambe_input_Key.PageDown.__enum__ = flambe_input_Key;
flambe_input_Key.PageUp = ["PageUp",89];
flambe_input_Key.PageUp.toString = $estr;
flambe_input_Key.PageUp.__enum__ = flambe_input_Key;
flambe_input_Key.Period = ["Period",90];
flambe_input_Key.Period.toString = $estr;
flambe_input_Key.Period.__enum__ = flambe_input_Key;
flambe_input_Key.Quote = ["Quote",91];
flambe_input_Key.Quote.toString = $estr;
flambe_input_Key.Quote.__enum__ = flambe_input_Key;
flambe_input_Key.RightBracket = ["RightBracket",92];
flambe_input_Key.RightBracket.toString = $estr;
flambe_input_Key.RightBracket.__enum__ = flambe_input_Key;
flambe_input_Key.Semicolon = ["Semicolon",93];
flambe_input_Key.Semicolon.toString = $estr;
flambe_input_Key.Semicolon.__enum__ = flambe_input_Key;
flambe_input_Key.Shift = ["Shift",94];
flambe_input_Key.Shift.toString = $estr;
flambe_input_Key.Shift.__enum__ = flambe_input_Key;
flambe_input_Key.Slash = ["Slash",95];
flambe_input_Key.Slash.toString = $estr;
flambe_input_Key.Slash.__enum__ = flambe_input_Key;
flambe_input_Key.Space = ["Space",96];
flambe_input_Key.Space.toString = $estr;
flambe_input_Key.Space.__enum__ = flambe_input_Key;
flambe_input_Key.Tab = ["Tab",97];
flambe_input_Key.Tab.toString = $estr;
flambe_input_Key.Tab.__enum__ = flambe_input_Key;
flambe_input_Key.Menu = ["Menu",98];
flambe_input_Key.Menu.toString = $estr;
flambe_input_Key.Menu.__enum__ = flambe_input_Key;
flambe_input_Key.Search = ["Search",99];
flambe_input_Key.Search.toString = $estr;
flambe_input_Key.Search.__enum__ = flambe_input_Key;
flambe_input_Key.Unknown = function(keyCode) { var $x = ["Unknown",100,keyCode]; $x.__enum__ = flambe_input_Key; $x.toString = $estr; return $x; };
var flambe_input_KeyboardEvent = function() {
	this.init(0,null);
};
$hxClasses["flambe.input.KeyboardEvent"] = flambe_input_KeyboardEvent;
flambe_input_KeyboardEvent.__name__ = ["flambe","input","KeyboardEvent"];
flambe_input_KeyboardEvent.prototype = {
	init: function(id,key) {
		this.id = id;
		this.key = key;
	}
	,__class__: flambe_input_KeyboardEvent
};
var flambe_input_MouseButton = $hxClasses["flambe.input.MouseButton"] = { __ename__ : ["flambe","input","MouseButton"], __constructs__ : ["Left","Middle","Right","Unknown"] };
flambe_input_MouseButton.Left = ["Left",0];
flambe_input_MouseButton.Left.toString = $estr;
flambe_input_MouseButton.Left.__enum__ = flambe_input_MouseButton;
flambe_input_MouseButton.Middle = ["Middle",1];
flambe_input_MouseButton.Middle.toString = $estr;
flambe_input_MouseButton.Middle.__enum__ = flambe_input_MouseButton;
flambe_input_MouseButton.Right = ["Right",2];
flambe_input_MouseButton.Right.toString = $estr;
flambe_input_MouseButton.Right.__enum__ = flambe_input_MouseButton;
flambe_input_MouseButton.Unknown = function(buttonCode) { var $x = ["Unknown",3,buttonCode]; $x.__enum__ = flambe_input_MouseButton; $x.toString = $estr; return $x; };
var flambe_input_MouseCursor = $hxClasses["flambe.input.MouseCursor"] = { __ename__ : ["flambe","input","MouseCursor"], __constructs__ : ["Default","Button","None"] };
flambe_input_MouseCursor.Default = ["Default",0];
flambe_input_MouseCursor.Default.toString = $estr;
flambe_input_MouseCursor.Default.__enum__ = flambe_input_MouseCursor;
flambe_input_MouseCursor.Button = ["Button",1];
flambe_input_MouseCursor.Button.toString = $estr;
flambe_input_MouseCursor.Button.__enum__ = flambe_input_MouseCursor;
flambe_input_MouseCursor.None = ["None",2];
flambe_input_MouseCursor.None.toString = $estr;
flambe_input_MouseCursor.None.__enum__ = flambe_input_MouseCursor;
var flambe_input_MouseEvent = function() {
	this.init(0,0,0,null);
};
$hxClasses["flambe.input.MouseEvent"] = flambe_input_MouseEvent;
flambe_input_MouseEvent.__name__ = ["flambe","input","MouseEvent"];
flambe_input_MouseEvent.prototype = {
	init: function(id,viewX,viewY,button) {
		this.id = id;
		this.viewX = viewX;
		this.viewY = viewY;
		this.button = button;
	}
	,__class__: flambe_input_MouseEvent
};
var flambe_input_EventSource = $hxClasses["flambe.input.EventSource"] = { __ename__ : ["flambe","input","EventSource"], __constructs__ : ["Mouse","Touch"] };
flambe_input_EventSource.Mouse = function(event) { var $x = ["Mouse",0,event]; $x.__enum__ = flambe_input_EventSource; $x.toString = $estr; return $x; };
flambe_input_EventSource.Touch = function(point) { var $x = ["Touch",1,point]; $x.__enum__ = flambe_input_EventSource; $x.toString = $estr; return $x; };
var flambe_input_PointerEvent = function() {
	this.init(0,0,0,null,null);
};
$hxClasses["flambe.input.PointerEvent"] = flambe_input_PointerEvent;
flambe_input_PointerEvent.__name__ = ["flambe","input","PointerEvent"];
flambe_input_PointerEvent.prototype = {
	init: function(id,viewX,viewY,hit,source) {
		this.id = id;
		this.viewX = viewX;
		this.viewY = viewY;
		this.hit = hit;
		this.source = source;
		this._stopped = false;
	}
	,__class__: flambe_input_PointerEvent
};
var flambe_input_TouchPoint = function(id) {
	this.id = id;
	this._source = flambe_input_EventSource.Touch(this);
};
$hxClasses["flambe.input.TouchPoint"] = flambe_input_TouchPoint;
flambe_input_TouchPoint.__name__ = ["flambe","input","TouchPoint"];
flambe_input_TouchPoint.prototype = {
	init: function(viewX,viewY) {
		this.viewX = viewX;
		this.viewY = viewY;
	}
	,__class__: flambe_input_TouchPoint
};
var flambe_math_FMath = function() { };
$hxClasses["flambe.math.FMath"] = flambe_math_FMath;
flambe_math_FMath.__name__ = ["flambe","math","FMath"];
flambe_math_FMath.toRadians = function(degrees) {
	return degrees * 3.141592653589793 / 180;
};
flambe_math_FMath.max = function(a,b) {
	if(a > b) return a; else return b;
};
flambe_math_FMath.min = function(a,b) {
	if(a < b) return a; else return b;
};
var flambe_math_Matrix = function() {
	this.identity();
};
$hxClasses["flambe.math.Matrix"] = flambe_math_Matrix;
flambe_math_Matrix.__name__ = ["flambe","math","Matrix"];
flambe_math_Matrix.prototype = {
	set: function(m00,m10,m01,m11,m02,m12) {
		this.m00 = m00;
		this.m01 = m01;
		this.m02 = m02;
		this.m10 = m10;
		this.m11 = m11;
		this.m12 = m12;
	}
	,identity: function() {
		this.set(1,0,0,1,0,0);
	}
	,compose: function(x,y,scaleX,scaleY,rotation) {
		var sin = Math.sin(rotation);
		var cos = Math.cos(rotation);
		this.set(cos * scaleX,sin * scaleX,-sin * scaleY,cos * scaleY,x,y);
	}
	,translate: function(x,y) {
		this.m02 += this.m00 * x + this.m01 * y;
		this.m12 += this.m11 * y + this.m10 * x;
	}
	,determinant: function() {
		return this.m00 * this.m11 - this.m01 * this.m10;
	}
	,inverseTransform: function(x,y,result) {
		var det = this.determinant();
		if(det == 0) return false;
		x -= this.m02;
		y -= this.m12;
		result.x = (x * this.m11 - y * this.m01) / det;
		result.y = (y * this.m00 - x * this.m10) / det;
		return true;
	}
	,toString: function() {
		return this.m00 + " " + this.m01 + " " + this.m02 + " \\ " + this.m10 + " " + this.m11 + " " + this.m12;
	}
	,__class__: flambe_math_Matrix
};
var flambe_math_Rectangle = function(x,y,width,height) {
	if(height == null) height = 0;
	if(width == null) width = 0;
	if(y == null) y = 0;
	if(x == null) x = 0;
	this.set(x,y,width,height);
};
$hxClasses["flambe.math.Rectangle"] = flambe_math_Rectangle;
flambe_math_Rectangle.__name__ = ["flambe","math","Rectangle"];
flambe_math_Rectangle.prototype = {
	set: function(x,y,width,height) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}
	,contains: function(x,y) {
		x -= this.x;
		if(this.width >= 0) {
			if(x < 0 || x > this.width) return false;
		} else if(x > 0 || x < this.width) return false;
		y -= this.y;
		if(this.height >= 0) {
			if(y < 0 || y > this.height) return false;
		} else if(y > 0 || y < this.height) return false;
		return true;
	}
	,toString: function() {
		return "(" + this.x + "," + this.y + " " + this.width + "x" + this.height + ")";
	}
	,__class__: flambe_math_Rectangle
};
var flambe_platform_BasicAsset = function() {
	this._reloadCount = null;
	this._disposed = false;
};
$hxClasses["flambe.platform.BasicAsset"] = flambe_platform_BasicAsset;
flambe_platform_BasicAsset.__name__ = ["flambe","platform","BasicAsset"];
flambe_platform_BasicAsset.__interfaces__ = [flambe_asset_Asset];
flambe_platform_BasicAsset.prototype = {
	assertNotDisposed: function() {
		flambe_util_Assert.that(!this._disposed,"Asset cannot be used after being disposed");
	}
	,reload: function(asset) {
		this.dispose();
		this._disposed = false;
		this.copyFrom(asset);
		var _g = this.get_reloadCount();
		_g.set__(_g.get__() + 1);
	}
	,dispose: function() {
		if(!this._disposed) {
			this._disposed = true;
			this.onDisposed();
		}
	}
	,copyFrom: function(asset) {
		flambe_util_Assert.fail();
	}
	,onDisposed: function() {
		flambe_util_Assert.fail();
	}
	,get_reloadCount: function() {
		if(this._reloadCount == null) this._reloadCount = new flambe_util_Value(0);
		return this._reloadCount;
	}
	,__class__: flambe_platform_BasicAsset
	,__properties__: {get_reloadCount:"get_reloadCount"}
};
var flambe_platform_BasicAssetPackLoader = function(platform,manifest) {
	var _g = this;
	this.manifest = manifest;
	this._platform = platform;
	this.promise = new flambe_util_Promise();
	this._bytesLoaded = new haxe_ds_StringMap();
	this._pack = new flambe_platform__$BasicAssetPackLoader_BasicAssetPack(manifest,this);
	var entries = Lambda.array(manifest);
	if(entries.length == 0) this.handleSuccess(); else {
		var groups = new haxe_ds_StringMap();
		var _g1 = 0;
		while(_g1 < entries.length) {
			var entry = entries[_g1];
			++_g1;
			var group = groups.get(entry.name);
			if(group == null) {
				group = [];
				groups.set(entry.name,group);
			}
			group.push(entry);
		}
		this._assetsRemaining = Lambda.count(groups);
		var $it0 = groups.iterator();
		while( $it0.hasNext() ) {
			var group1 = $it0.next();
			var group2 = [group1];
			this.pickBestEntry(group2[0],(function(group2) {
				return function(bestEntry) {
					if(bestEntry != null) {
						var url = manifest.getFullURL(bestEntry);
						try {
							_g.loadEntry(url,bestEntry);
						} catch( error ) {
							_g.handleError(bestEntry,"Unexpected error: " + Std.string(error));
						}
						var _g11 = _g.promise;
						_g11.set_total(_g11.get_total() + bestEntry.bytes);
					} else {
						var badEntry = group2[0][0];
						if(flambe_platform_BasicAssetPackLoader.isAudio(badEntry.format)) {
							flambe_Log.warn("Could not find a supported audio format to load",["name",badEntry.name]);
							_g.handleLoad(badEntry,flambe_platform_DummySound.getInstance());
						} else _g.handleError(badEntry,"Could not find a supported format to load");
					}
				};
			})(group2));
		}
	}
	var catapult = this._platform.getCatapultClient();
	if(catapult != null) catapult.add(this);
};
$hxClasses["flambe.platform.BasicAssetPackLoader"] = flambe_platform_BasicAssetPackLoader;
flambe_platform_BasicAssetPackLoader.__name__ = ["flambe","platform","BasicAssetPackLoader"];
flambe_platform_BasicAssetPackLoader.removeUrlParams = function(url) {
	var query = url.indexOf("?");
	if(query > 0) return HxOverrides.substr(url,0,query); else return url;
};
flambe_platform_BasicAssetPackLoader.isAudio = function(format) {
	switch(Type.enumIndex(format)) {
	case 8:case 9:case 10:case 11:case 12:
		return true;
	default:
		return false;
	}
};
flambe_platform_BasicAssetPackLoader.prototype = {
	reload: function(url) {
		var _g = this;
		var baseUrl = flambe_platform_BasicAssetPackLoader.removeUrlParams(url);
		var foundEntry = null;
		var $it0 = this.manifest.iterator();
		while( $it0.hasNext() ) {
			var entry = $it0.next();
			if(baseUrl == flambe_platform_BasicAssetPackLoader.removeUrlParams(entry.url)) {
				foundEntry = entry;
				break;
			}
		}
		if(foundEntry != null) this.getAssetFormats(function(formats) {
			if(formats.indexOf(foundEntry.format) >= 0) {
				var entry1 = new flambe_asset_AssetEntry(foundEntry.name,url,foundEntry.format,0);
				_g.loadEntry(_g.manifest.getFullURL(entry1),entry1);
			}
		});
	}
	,onDisposed: function() {
		var catapult = this._platform.getCatapultClient();
		if(catapult != null) catapult.remove(this);
	}
	,pickBestEntry: function(entries,fn) {
		var onFormatsAvailable = function(formats) {
			var _g = 0;
			while(_g < formats.length) {
				var format = formats[_g];
				++_g;
				var _g1 = 0;
				while(_g1 < entries.length) {
					var entry = entries[_g1];
					++_g1;
					if(entry.format == format) {
						fn(entry);
						return;
					}
				}
			}
			fn(null);
		};
		this.getAssetFormats(onFormatsAvailable);
	}
	,loadEntry: function(url,entry) {
		flambe_util_Assert.fail();
	}
	,getAssetFormats: function(fn) {
		flambe_util_Assert.fail();
	}
	,handleLoad: function(entry,asset) {
		if(this._pack.disposed) return;
		this.handleProgress(entry,entry.bytes);
		var map;
		var _g = entry.format;
		switch(Type.enumIndex(_g)) {
		case 0:case 1:case 2:case 3:case 4:case 5:case 6:case 7:
			map = this._pack.textures;
			break;
		case 8:case 9:case 10:case 11:case 12:
			map = this._pack.sounds;
			break;
		case 13:
			map = this._pack.files;
			break;
		}
		var oldAsset = map.get(entry.name);
		if(oldAsset != null) {
			flambe_Log.info("Reloaded asset",["url",entry.url]);
			oldAsset.reload(asset);
		} else {
			map.set(entry.name,asset);
			this._assetsRemaining -= 1;
			if(this._assetsRemaining == 0) this.handleSuccess();
		}
	}
	,handleProgress: function(entry,bytesLoaded) {
		this._bytesLoaded.set(entry.name,bytesLoaded);
		var bytesTotal = 0;
		var $it0 = this._bytesLoaded.iterator();
		while( $it0.hasNext() ) {
			var bytes = $it0.next();
			bytesTotal += bytes;
		}
		this.promise.set_progress(bytesTotal);
	}
	,handleSuccess: function() {
		this.promise.set_result(this._pack);
	}
	,handleError: function(entry,message) {
		flambe_Log.warn("Error loading asset pack",["error",message,"url",entry.url]);
		this.promise.error.emit(flambe_util_Strings.withFields(message,["url",entry.url]));
	}
	,handleTextureError: function(entry) {
		this.handleError(entry,"Failed to create texture. Is the GPU context unavailable?");
	}
	,__class__: flambe_platform_BasicAssetPackLoader
};
var flambe_platform__$BasicAssetPackLoader_BasicAssetPack = function(manifest,loader) {
	this.disposed = false;
	this._manifest = manifest;
	this.loader = loader;
	this.textures = new haxe_ds_StringMap();
	this.sounds = new haxe_ds_StringMap();
	this.files = new haxe_ds_StringMap();
};
$hxClasses["flambe.platform._BasicAssetPackLoader.BasicAssetPack"] = flambe_platform__$BasicAssetPackLoader_BasicAssetPack;
flambe_platform__$BasicAssetPackLoader_BasicAssetPack.__name__ = ["flambe","platform","_BasicAssetPackLoader","BasicAssetPack"];
flambe_platform__$BasicAssetPackLoader_BasicAssetPack.__interfaces__ = [flambe_asset_AssetPack];
flambe_platform__$BasicAssetPackLoader_BasicAssetPack.warnOnExtension = function(path) {
	var ext = flambe_util_Strings.getFileExtension(path);
	if(ext != null && ext.length == 3) flambe_Log.warn("Requested asset \"" + path + "\" should not have a file extension," + " did you mean \"" + flambe_util_Strings.removeFileExtension(path) + "\"?");
};
flambe_platform__$BasicAssetPackLoader_BasicAssetPack.prototype = {
	getTexture: function(name,required) {
		if(required == null) required = true;
		this.assertNotDisposed();
		flambe_platform__$BasicAssetPackLoader_BasicAssetPack.warnOnExtension(name);
		var texture = this.textures.get(name);
		if(texture == null && required) throw flambe_util_Strings.withFields("Missing texture",["name",name]);
		return texture;
	}
	,getSound: function(name,required) {
		if(required == null) required = true;
		this.assertNotDisposed();
		flambe_platform__$BasicAssetPackLoader_BasicAssetPack.warnOnExtension(name);
		var sound = this.sounds.get(name);
		if(sound == null && required) throw flambe_util_Strings.withFields("Missing sound",["name",name]);
		return sound;
	}
	,getFile: function(name,required) {
		if(required == null) required = true;
		this.assertNotDisposed();
		var file = this.files.get(name);
		if(file == null && required) throw flambe_util_Strings.withFields("Missing file",["name",name]);
		return file;
	}
	,dispose: function() {
		if(!this.disposed) {
			this.disposed = true;
			var $it0 = this.textures.iterator();
			while( $it0.hasNext() ) {
				var texture = $it0.next();
				texture.dispose();
			}
			this.textures = null;
			var $it1 = this.sounds.iterator();
			while( $it1.hasNext() ) {
				var sound = $it1.next();
				sound.dispose();
			}
			this.sounds = null;
			var $it2 = this.files.iterator();
			while( $it2.hasNext() ) {
				var file = $it2.next();
				file.dispose();
			}
			this.files = null;
			this.loader.onDisposed();
		}
	}
	,assertNotDisposed: function() {
		flambe_util_Assert.that(!this.disposed,"AssetPack cannot be used after being disposed");
	}
	,__class__: flambe_platform__$BasicAssetPackLoader_BasicAssetPack
};
var flambe_platform_BasicFile = function(content) {
	flambe_platform_BasicAsset.call(this);
	this._content = content;
};
$hxClasses["flambe.platform.BasicFile"] = flambe_platform_BasicFile;
flambe_platform_BasicFile.__name__ = ["flambe","platform","BasicFile"];
flambe_platform_BasicFile.__interfaces__ = [flambe_asset_File];
flambe_platform_BasicFile.__super__ = flambe_platform_BasicAsset;
flambe_platform_BasicFile.prototype = $extend(flambe_platform_BasicAsset.prototype,{
	toString: function() {
		this.assertNotDisposed();
		return this._content;
	}
	,copyFrom: function(that) {
		this._content = that._content;
	}
	,onDisposed: function() {
		this._content = null;
	}
	,__class__: flambe_platform_BasicFile
});
var flambe_subsystem_KeyboardSystem = function() { };
$hxClasses["flambe.subsystem.KeyboardSystem"] = flambe_subsystem_KeyboardSystem;
flambe_subsystem_KeyboardSystem.__name__ = ["flambe","subsystem","KeyboardSystem"];
flambe_subsystem_KeyboardSystem.prototype = {
	__class__: flambe_subsystem_KeyboardSystem
};
var flambe_platform_BasicKeyboard = function() {
	this.down = new flambe_util_Signal1();
	this.up = new flambe_util_Signal1();
	this.backButton = new flambe_util_Signal0();
	this._keyStates = new haxe_ds_IntMap();
};
$hxClasses["flambe.platform.BasicKeyboard"] = flambe_platform_BasicKeyboard;
flambe_platform_BasicKeyboard.__name__ = ["flambe","platform","BasicKeyboard"];
flambe_platform_BasicKeyboard.__interfaces__ = [flambe_subsystem_KeyboardSystem];
flambe_platform_BasicKeyboard.prototype = {
	isDown: function(key) {
		return this.isCodeDown(flambe_platform_KeyCodes.toKeyCode(key));
	}
	,isCodeDown: function(keyCode) {
		return this._keyStates.exists(keyCode);
	}
	,submitDown: function(keyCode) {
		if(keyCode == 16777238) {
			if(this.backButton.hasListeners()) {
				this.backButton.emit();
				return true;
			}
			return false;
		}
		if(!this.isCodeDown(keyCode)) {
			this._keyStates.set(keyCode,true);
			flambe_platform_BasicKeyboard._sharedEvent.init(flambe_platform_BasicKeyboard._sharedEvent.id + 1,flambe_platform_KeyCodes.toKey(keyCode));
			this.down.emit(flambe_platform_BasicKeyboard._sharedEvent);
		}
		return true;
	}
	,submitUp: function(keyCode) {
		if(this.isCodeDown(keyCode)) {
			this._keyStates.remove(keyCode);
			flambe_platform_BasicKeyboard._sharedEvent.init(flambe_platform_BasicKeyboard._sharedEvent.id + 1,flambe_platform_KeyCodes.toKey(keyCode));
			this.up.emit(flambe_platform_BasicKeyboard._sharedEvent);
		}
	}
	,__class__: flambe_platform_BasicKeyboard
};
var flambe_subsystem_MouseSystem = function() { };
$hxClasses["flambe.subsystem.MouseSystem"] = flambe_subsystem_MouseSystem;
flambe_subsystem_MouseSystem.__name__ = ["flambe","subsystem","MouseSystem"];
flambe_subsystem_MouseSystem.prototype = {
	__class__: flambe_subsystem_MouseSystem
};
var flambe_platform_BasicMouse = function(pointer) {
	this._pointer = pointer;
	this._source = flambe_input_EventSource.Mouse(flambe_platform_BasicMouse._sharedEvent);
	this.down = new flambe_util_Signal1();
	this.move = new flambe_util_Signal1();
	this.up = new flambe_util_Signal1();
	this.scroll = new flambe_util_Signal1();
	this._x = 0;
	this._y = 0;
	this._cursor = flambe_input_MouseCursor.Default;
	this._buttonStates = new haxe_ds_IntMap();
};
$hxClasses["flambe.platform.BasicMouse"] = flambe_platform_BasicMouse;
flambe_platform_BasicMouse.__name__ = ["flambe","platform","BasicMouse"];
flambe_platform_BasicMouse.__interfaces__ = [flambe_subsystem_MouseSystem];
flambe_platform_BasicMouse.prototype = {
	set_cursor: function(cursor) {
		return this._cursor = cursor;
	}
	,submitDown: function(viewX,viewY,buttonCode) {
		if(!this.isCodeDown(buttonCode)) {
			this._buttonStates.set(buttonCode,true);
			this.prepare(viewX,viewY,flambe_platform_MouseCodes.toButton(buttonCode));
			this._pointer.submitDown(viewX,viewY,this._source);
			this.down.emit(flambe_platform_BasicMouse._sharedEvent);
		}
	}
	,submitMove: function(viewX,viewY) {
		this.prepare(viewX,viewY,null);
		this._pointer.submitMove(viewX,viewY,this._source);
		this.move.emit(flambe_platform_BasicMouse._sharedEvent);
	}
	,submitUp: function(viewX,viewY,buttonCode) {
		if(this.isCodeDown(buttonCode)) {
			this._buttonStates.remove(buttonCode);
			this.prepare(viewX,viewY,flambe_platform_MouseCodes.toButton(buttonCode));
			this._pointer.submitUp(viewX,viewY,this._source);
			this.up.emit(flambe_platform_BasicMouse._sharedEvent);
		}
	}
	,submitScroll: function(viewX,viewY,velocity) {
		this._x = viewX;
		this._y = viewY;
		if(!this.scroll.hasListeners()) return false;
		this.scroll.emit(velocity);
		return true;
	}
	,isCodeDown: function(buttonCode) {
		return this._buttonStates.exists(buttonCode);
	}
	,prepare: function(viewX,viewY,button) {
		this._x = viewX;
		this._y = viewY;
		flambe_platform_BasicMouse._sharedEvent.init(flambe_platform_BasicMouse._sharedEvent.id + 1,viewX,viewY,button);
	}
	,__class__: flambe_platform_BasicMouse
	,__properties__: {set_cursor:"set_cursor"}
};
var flambe_subsystem_PointerSystem = function() { };
$hxClasses["flambe.subsystem.PointerSystem"] = flambe_subsystem_PointerSystem;
flambe_subsystem_PointerSystem.__name__ = ["flambe","subsystem","PointerSystem"];
flambe_subsystem_PointerSystem.prototype = {
	__class__: flambe_subsystem_PointerSystem
};
var flambe_platform_BasicPointer = function(x,y,isDown) {
	if(isDown == null) isDown = false;
	if(y == null) y = 0;
	if(x == null) x = 0;
	this.down = new flambe_util_Signal1();
	this.move = new flambe_util_Signal1();
	this.up = new flambe_util_Signal1();
	this._x = x;
	this._y = y;
	this._isDown = isDown;
};
$hxClasses["flambe.platform.BasicPointer"] = flambe_platform_BasicPointer;
flambe_platform_BasicPointer.__name__ = ["flambe","platform","BasicPointer"];
flambe_platform_BasicPointer.__interfaces__ = [flambe_subsystem_PointerSystem];
flambe_platform_BasicPointer.prototype = {
	submitDown: function(viewX,viewY,source) {
		if(this._isDown) return;
		this.submitMove(viewX,viewY,source);
		this._isDown = true;
		var chain = [];
		var hit = flambe_display_Sprite.hitTest(flambe_System.root,viewX,viewY);
		if(hit != null) {
			var entity = hit.owner;
			do {
				var sprite;
				var component = entity.getComponent("Sprite_2");
				sprite = component;
				if(sprite != null) chain.push(sprite);
				entity = entity.parent;
			} while(entity != null);
		}
		this.prepare(viewX,viewY,hit,source);
		var _g = 0;
		while(_g < chain.length) {
			var sprite1 = chain[_g];
			++_g;
			sprite1.onPointerDown(flambe_platform_BasicPointer._sharedEvent);
			if(flambe_platform_BasicPointer._sharedEvent._stopped) return;
		}
		this.down.emit(flambe_platform_BasicPointer._sharedEvent);
	}
	,submitMove: function(viewX,viewY,source) {
		if(viewX == this._x && viewY == this._y) return;
		var chain = [];
		var hit = flambe_display_Sprite.hitTest(flambe_System.root,viewX,viewY);
		if(hit != null) {
			var entity = hit.owner;
			do {
				var sprite;
				var component = entity.getComponent("Sprite_2");
				sprite = component;
				if(sprite != null) chain.push(sprite);
				entity = entity.parent;
			} while(entity != null);
		}
		this.prepare(viewX,viewY,hit,source);
		var _g = 0;
		while(_g < chain.length) {
			var sprite1 = chain[_g];
			++_g;
			sprite1.onPointerMove(flambe_platform_BasicPointer._sharedEvent);
			if(flambe_platform_BasicPointer._sharedEvent._stopped) return;
		}
		this.move.emit(flambe_platform_BasicPointer._sharedEvent);
	}
	,submitUp: function(viewX,viewY,source) {
		if(!this._isDown) return;
		this.submitMove(viewX,viewY,source);
		this._isDown = false;
		var chain = [];
		var hit = flambe_display_Sprite.hitTest(flambe_System.root,viewX,viewY);
		if(hit != null) {
			var entity = hit.owner;
			do {
				var sprite;
				var component = entity.getComponent("Sprite_2");
				sprite = component;
				if(sprite != null) chain.push(sprite);
				entity = entity.parent;
			} while(entity != null);
		}
		this.prepare(viewX,viewY,hit,source);
		var _g = 0;
		while(_g < chain.length) {
			var sprite1 = chain[_g];
			++_g;
			sprite1.onPointerUp(flambe_platform_BasicPointer._sharedEvent);
			if(flambe_platform_BasicPointer._sharedEvent._stopped) return;
		}
		this.up.emit(flambe_platform_BasicPointer._sharedEvent);
	}
	,prepare: function(viewX,viewY,hit,source) {
		this._x = viewX;
		this._y = viewY;
		flambe_platform_BasicPointer._sharedEvent.init(flambe_platform_BasicPointer._sharedEvent.id + 1,viewX,viewY,hit,source);
	}
	,__class__: flambe_platform_BasicPointer
};
var flambe_platform_BasicTexture = function(root,width,height) {
	this._y = 0;
	this._x = 0;
	this._parent = null;
	this.rootY = 0;
	this.rootX = 0;
	flambe_platform_BasicAsset.call(this);
	this.root = root;
	this._width = width;
	this._height = height;
};
$hxClasses["flambe.platform.BasicTexture"] = flambe_platform_BasicTexture;
flambe_platform_BasicTexture.__name__ = ["flambe","platform","BasicTexture"];
flambe_platform_BasicTexture.__interfaces__ = [flambe_display_SubTexture];
flambe_platform_BasicTexture.__super__ = flambe_platform_BasicAsset;
flambe_platform_BasicTexture.prototype = $extend(flambe_platform_BasicAsset.prototype,{
	subTexture: function(x,y,width,height) {
		var sub = this.root.createTexture(width,height);
		sub._parent = this;
		sub._x = x;
		sub._y = y;
		sub.rootX = this.rootX + x;
		sub.rootY = this.rootY + y;
		return sub;
	}
	,split: function(tilesWide,tilesHigh) {
		if(tilesHigh == null) tilesHigh = 1;
		var tiles = [];
		var tileWidth = Std["int"](this._width / tilesWide);
		var tileHeight = Std["int"](this._height / tilesHigh);
		var _g = 0;
		while(_g < tilesHigh) {
			var y = _g++;
			var _g1 = 0;
			while(_g1 < tilesWide) {
				var x = _g1++;
				tiles.push(this.subTexture(x * tileWidth,y * tileHeight,tileWidth,tileHeight));
			}
		}
		return tiles;
	}
	,copyFrom: function(that) {
		this.root._disposed = false;
		this.root.copyFrom(that.root);
		this._width = that._width;
		this._height = that._height;
		flambe_util_Assert.that(this.rootX == that.rootX && this.rootY == that.rootY && this._x == that._x && this._y == that._y);
	}
	,onDisposed: function() {
		if(this._parent == null) this.root.dispose();
	}
	,get_reloadCount: function() {
		return this.root.get_reloadCount();
	}
	,get_width: function() {
		return this._width;
	}
	,get_height: function() {
		return this._height;
	}
	,__class__: flambe_platform_BasicTexture
	,__properties__: $extend(flambe_platform_BasicAsset.prototype.__properties__,{get_height:"get_height",get_width:"get_width"})
});
var flambe_subsystem_TouchSystem = function() { };
$hxClasses["flambe.subsystem.TouchSystem"] = flambe_subsystem_TouchSystem;
flambe_subsystem_TouchSystem.__name__ = ["flambe","subsystem","TouchSystem"];
var flambe_platform_BasicTouch = function(pointer,maxPoints) {
	if(maxPoints == null) maxPoints = 4;
	this._pointer = pointer;
	this._maxPoints = maxPoints;
	this._pointMap = new haxe_ds_IntMap();
	this._points = [];
	this.down = new flambe_util_Signal1();
	this.move = new flambe_util_Signal1();
	this.up = new flambe_util_Signal1();
};
$hxClasses["flambe.platform.BasicTouch"] = flambe_platform_BasicTouch;
flambe_platform_BasicTouch.__name__ = ["flambe","platform","BasicTouch"];
flambe_platform_BasicTouch.__interfaces__ = [flambe_subsystem_TouchSystem];
flambe_platform_BasicTouch.prototype = {
	submitDown: function(id,viewX,viewY) {
		if(!this._pointMap.exists(id)) {
			var point = new flambe_input_TouchPoint(id);
			point.init(viewX,viewY);
			this._pointMap.set(id,point);
			this._points.push(point);
			if(this._pointerTouch == null) {
				this._pointerTouch = point;
				this._pointer.submitDown(viewX,viewY,point._source);
			}
			this.down.emit(point);
		}
	}
	,submitMove: function(id,viewX,viewY) {
		var point = this._pointMap.get(id);
		if(point != null) {
			point.init(viewX,viewY);
			if(this._pointerTouch == point) this._pointer.submitMove(viewX,viewY,point._source);
			this.move.emit(point);
		}
	}
	,submitUp: function(id,viewX,viewY) {
		var point = this._pointMap.get(id);
		if(point != null) {
			point.init(viewX,viewY);
			this._pointMap.remove(id);
			HxOverrides.remove(this._points,point);
			if(this._pointerTouch == point) {
				this._pointerTouch = null;
				this._pointer.submitUp(viewX,viewY,point._source);
			}
			this.up.emit(point);
		}
	}
	,__class__: flambe_platform_BasicTouch
};
var flambe_platform_CatapultClient = function() {
	this._loaders = [];
};
$hxClasses["flambe.platform.CatapultClient"] = flambe_platform_CatapultClient;
flambe_platform_CatapultClient.__name__ = ["flambe","platform","CatapultClient"];
flambe_platform_CatapultClient.prototype = {
	add: function(loader) {
		if(loader.manifest.get_localBase() == "assets") this._loaders.push(loader);
	}
	,remove: function(loader) {
		HxOverrides.remove(this._loaders,loader);
	}
	,onError: function(cause) {
		flambe_Log.warn("Unable to connect to Catapult",["cause",cause]);
	}
	,onMessage: function(message) {
		var message1 = JSON.parse(message);
		var _g = message1.type;
		switch(_g) {
		case "file_changed":
			var url = message1.name + "?v=" + message1.md5;
			url = StringTools.replace(url,"\\","/");
			var _g1 = 0;
			var _g2 = this._loaders;
			while(_g1 < _g2.length) {
				var loader = _g2[_g1];
				++_g1;
				loader.reload(url);
			}
			break;
		case "restart":
			this.onRestart();
			break;
		}
	}
	,onRestart: function() {
		flambe_util_Assert.fail();
	}
	,__class__: flambe_platform_CatapultClient
};
var flambe_platform_DebugLogic = function(platform) {
	var _g = this;
	this._platform = platform;
	platform.getKeyboard().down.connect(function(event) {
		if(event.key == flambe_input_Key.O && platform.getKeyboard().isDown(flambe_input_Key.Control)) {
			if(_g.toggleOverdrawGraphics()) flambe_Log.info("Enabled overdraw visualizer, press Ctrl-O again to disable");
		}
	});
};
$hxClasses["flambe.platform.DebugLogic"] = flambe_platform_DebugLogic;
flambe_platform_DebugLogic.__name__ = ["flambe","platform","DebugLogic"];
flambe_platform_DebugLogic.prototype = {
	toggleOverdrawGraphics: function() {
		var renderer = this._platform.getRenderer();
		if(this._savedGraphics != null) {
			renderer.graphics = this._savedGraphics;
			this._savedGraphics = null;
		} else if(renderer.graphics != null) {
			this._savedGraphics = renderer.graphics;
			renderer.graphics = new flambe_platform_OverdrawGraphics(this._savedGraphics);
			return true;
		}
		return false;
	}
	,__class__: flambe_platform_DebugLogic
};
var flambe_sound_Sound = function() { };
$hxClasses["flambe.sound.Sound"] = flambe_sound_Sound;
flambe_sound_Sound.__name__ = ["flambe","sound","Sound"];
flambe_sound_Sound.__interfaces__ = [flambe_asset_Asset];
flambe_sound_Sound.prototype = {
	__class__: flambe_sound_Sound
};
var flambe_platform_DummySound = function() {
	flambe_platform_BasicAsset.call(this);
	this._playback = new flambe_platform_DummyPlayback(this);
};
$hxClasses["flambe.platform.DummySound"] = flambe_platform_DummySound;
flambe_platform_DummySound.__name__ = ["flambe","platform","DummySound"];
flambe_platform_DummySound.__interfaces__ = [flambe_sound_Sound];
flambe_platform_DummySound.getInstance = function() {
	if(flambe_platform_DummySound._instance == null) flambe_platform_DummySound._instance = new flambe_platform_DummySound();
	return flambe_platform_DummySound._instance;
};
flambe_platform_DummySound.__super__ = flambe_platform_BasicAsset;
flambe_platform_DummySound.prototype = $extend(flambe_platform_BasicAsset.prototype,{
	play: function(volume) {
		if(volume == null) volume = 1.0;
		return this._playback;
	}
	,loop: function(volume) {
		if(volume == null) volume = 1.0;
		return this._playback;
	}
	,copyFrom: function(asset) {
	}
	,onDisposed: function() {
	}
	,__class__: flambe_platform_DummySound
});
var flambe_sound_Playback = function() { };
$hxClasses["flambe.sound.Playback"] = flambe_sound_Playback;
flambe_sound_Playback.__name__ = ["flambe","sound","Playback"];
flambe_sound_Playback.__interfaces__ = [flambe_util_Disposable];
flambe_sound_Playback.prototype = {
	__class__: flambe_sound_Playback
};
var flambe_platform_DummyPlayback = function(sound) {
	this._sound = sound;
	this.volume = new flambe_animation_AnimatedFloat(0);
	this._complete = new flambe_util_Value(true);
};
$hxClasses["flambe.platform.DummyPlayback"] = flambe_platform_DummyPlayback;
flambe_platform_DummyPlayback.__name__ = ["flambe","platform","DummyPlayback"];
flambe_platform_DummyPlayback.__interfaces__ = [flambe_sound_Playback];
flambe_platform_DummyPlayback.prototype = {
	get_sound: function() {
		return this._sound;
	}
	,set_paused: function(paused) {
		return true;
	}
	,dispose: function() {
	}
	,__class__: flambe_platform_DummyPlayback
	,__properties__: {get_sound:"get_sound",set_paused:"set_paused"}
};
var flambe_subsystem_StorageSystem = function() { };
$hxClasses["flambe.subsystem.StorageSystem"] = flambe_subsystem_StorageSystem;
flambe_subsystem_StorageSystem.__name__ = ["flambe","subsystem","StorageSystem"];
flambe_subsystem_StorageSystem.prototype = {
	__class__: flambe_subsystem_StorageSystem
};
var flambe_platform_DummyStorage = function() {
	this.clear();
};
$hxClasses["flambe.platform.DummyStorage"] = flambe_platform_DummyStorage;
flambe_platform_DummyStorage.__name__ = ["flambe","platform","DummyStorage"];
flambe_platform_DummyStorage.__interfaces__ = [flambe_subsystem_StorageSystem];
flambe_platform_DummyStorage.prototype = {
	set: function(key,value) {
		var value1 = value;
		this._hash.set(key,value1);
		return true;
	}
	,get: function(key,defaultValue) {
		if(this._hash.exists(key)) return this._hash.get(key); else return defaultValue;
	}
	,clear: function() {
		this._hash = new haxe_ds_StringMap();
	}
	,__class__: flambe_platform_DummyStorage
};
var flambe_platform_DummyTouch = function() {
	this.down = new flambe_util_Signal1();
	this.move = new flambe_util_Signal1();
	this.up = new flambe_util_Signal1();
};
$hxClasses["flambe.platform.DummyTouch"] = flambe_platform_DummyTouch;
flambe_platform_DummyTouch.__name__ = ["flambe","platform","DummyTouch"];
flambe_platform_DummyTouch.__interfaces__ = [flambe_subsystem_TouchSystem];
flambe_platform_DummyTouch.prototype = {
	__class__: flambe_platform_DummyTouch
};
var flambe_platform_EventGroup = function() {
	this._entries = [];
};
$hxClasses["flambe.platform.EventGroup"] = flambe_platform_EventGroup;
flambe_platform_EventGroup.__name__ = ["flambe","platform","EventGroup"];
flambe_platform_EventGroup.__interfaces__ = [flambe_util_Disposable];
flambe_platform_EventGroup.prototype = {
	addListener: function(dispatcher,type,listener) {
		dispatcher.addEventListener(type,listener,false);
		this._entries.push(new flambe_platform__$EventGroup_Entry(dispatcher,type,listener));
	}
	,addDisposingListener: function(dispatcher,type,listener) {
		var _g = this;
		this.addListener(dispatcher,type,function(event) {
			_g.dispose();
			listener(event);
		});
	}
	,dispose: function() {
		var _g = 0;
		var _g1 = this._entries;
		while(_g < _g1.length) {
			var entry = _g1[_g];
			++_g;
			entry.dispatcher.removeEventListener(entry.type,entry.listener,false);
		}
		this._entries = [];
	}
	,__class__: flambe_platform_EventGroup
};
var flambe_platform__$EventGroup_Entry = function(dispatcher,type,listener) {
	this.dispatcher = dispatcher;
	this.type = type;
	this.listener = listener;
};
$hxClasses["flambe.platform._EventGroup.Entry"] = flambe_platform__$EventGroup_Entry;
flambe_platform__$EventGroup_Entry.__name__ = ["flambe","platform","_EventGroup","Entry"];
flambe_platform__$EventGroup_Entry.prototype = {
	__class__: flambe_platform__$EventGroup_Entry
};
var flambe_platform_InternalGraphics = function() { };
$hxClasses["flambe.platform.InternalGraphics"] = flambe_platform_InternalGraphics;
flambe_platform_InternalGraphics.__name__ = ["flambe","platform","InternalGraphics"];
flambe_platform_InternalGraphics.__interfaces__ = [flambe_display_Graphics];
flambe_platform_InternalGraphics.prototype = {
	__class__: flambe_platform_InternalGraphics
};
var flambe_subsystem_RendererSystem = function() { };
$hxClasses["flambe.subsystem.RendererSystem"] = flambe_subsystem_RendererSystem;
flambe_subsystem_RendererSystem.__name__ = ["flambe","subsystem","RendererSystem"];
flambe_subsystem_RendererSystem.prototype = {
	__class__: flambe_subsystem_RendererSystem
};
var flambe_platform_InternalRenderer = function() { };
$hxClasses["flambe.platform.InternalRenderer"] = flambe_platform_InternalRenderer;
flambe_platform_InternalRenderer.__name__ = ["flambe","platform","InternalRenderer"];
flambe_platform_InternalRenderer.__interfaces__ = [flambe_subsystem_RendererSystem];
flambe_platform_InternalRenderer.prototype = {
	__class__: flambe_platform_InternalRenderer
};
var flambe_platform_KeyCodes = function() { };
$hxClasses["flambe.platform.KeyCodes"] = flambe_platform_KeyCodes;
flambe_platform_KeyCodes.__name__ = ["flambe","platform","KeyCodes"];
flambe_platform_KeyCodes.toKey = function(keyCode) {
	switch(keyCode) {
	case 65:
		return flambe_input_Key.A;
	case 66:
		return flambe_input_Key.B;
	case 67:
		return flambe_input_Key.C;
	case 68:
		return flambe_input_Key.D;
	case 69:
		return flambe_input_Key.E;
	case 70:
		return flambe_input_Key.F;
	case 71:
		return flambe_input_Key.G;
	case 72:
		return flambe_input_Key.H;
	case 73:
		return flambe_input_Key.I;
	case 74:
		return flambe_input_Key.J;
	case 75:
		return flambe_input_Key.K;
	case 76:
		return flambe_input_Key.L;
	case 77:
		return flambe_input_Key.M;
	case 78:
		return flambe_input_Key.N;
	case 79:
		return flambe_input_Key.O;
	case 80:
		return flambe_input_Key.P;
	case 81:
		return flambe_input_Key.Q;
	case 82:
		return flambe_input_Key.R;
	case 83:
		return flambe_input_Key.S;
	case 84:
		return flambe_input_Key.T;
	case 85:
		return flambe_input_Key.U;
	case 86:
		return flambe_input_Key.V;
	case 87:
		return flambe_input_Key.W;
	case 88:
		return flambe_input_Key.X;
	case 89:
		return flambe_input_Key.Y;
	case 90:
		return flambe_input_Key.Z;
	case 48:
		return flambe_input_Key.Number0;
	case 49:
		return flambe_input_Key.Number1;
	case 50:
		return flambe_input_Key.Number2;
	case 51:
		return flambe_input_Key.Number3;
	case 52:
		return flambe_input_Key.Number4;
	case 53:
		return flambe_input_Key.Number5;
	case 54:
		return flambe_input_Key.Number6;
	case 55:
		return flambe_input_Key.Number7;
	case 56:
		return flambe_input_Key.Number8;
	case 57:
		return flambe_input_Key.Number9;
	case 96:
		return flambe_input_Key.Numpad0;
	case 97:
		return flambe_input_Key.Numpad1;
	case 98:
		return flambe_input_Key.Numpad2;
	case 99:
		return flambe_input_Key.Numpad3;
	case 100:
		return flambe_input_Key.Numpad4;
	case 101:
		return flambe_input_Key.Numpad5;
	case 102:
		return flambe_input_Key.Numpad6;
	case 103:
		return flambe_input_Key.Numpad7;
	case 104:
		return flambe_input_Key.Numpad8;
	case 105:
		return flambe_input_Key.Numpad9;
	case 107:
		return flambe_input_Key.NumpadAdd;
	case 110:
		return flambe_input_Key.NumpadDecimal;
	case 111:
		return flambe_input_Key.NumpadDivide;
	case 108:
		return flambe_input_Key.NumpadEnter;
	case 106:
		return flambe_input_Key.NumpadMultiply;
	case 109:
		return flambe_input_Key.NumpadSubtract;
	case 112:
		return flambe_input_Key.F1;
	case 113:
		return flambe_input_Key.F2;
	case 114:
		return flambe_input_Key.F3;
	case 115:
		return flambe_input_Key.F4;
	case 116:
		return flambe_input_Key.F5;
	case 117:
		return flambe_input_Key.F6;
	case 118:
		return flambe_input_Key.F7;
	case 119:
		return flambe_input_Key.F8;
	case 120:
		return flambe_input_Key.F9;
	case 121:
		return flambe_input_Key.F10;
	case 122:
		return flambe_input_Key.F11;
	case 123:
		return flambe_input_Key.F12;
	case 37:
		return flambe_input_Key.Left;
	case 38:
		return flambe_input_Key.Up;
	case 39:
		return flambe_input_Key.Right;
	case 40:
		return flambe_input_Key.Down;
	case 18:
		return flambe_input_Key.Alt;
	case 192:
		return flambe_input_Key.Backquote;
	case 220:
		return flambe_input_Key.Backslash;
	case 8:
		return flambe_input_Key.Backspace;
	case 20:
		return flambe_input_Key.CapsLock;
	case 188:
		return flambe_input_Key.Comma;
	case 15:
		return flambe_input_Key.Command;
	case 17:
		return flambe_input_Key.Control;
	case 46:
		return flambe_input_Key.Delete;
	case 35:
		return flambe_input_Key.End;
	case 13:
		return flambe_input_Key.Enter;
	case 187:
		return flambe_input_Key.Equals;
	case 27:
		return flambe_input_Key.Escape;
	case 36:
		return flambe_input_Key.Home;
	case 45:
		return flambe_input_Key.Insert;
	case 219:
		return flambe_input_Key.LeftBracket;
	case 189:
		return flambe_input_Key.Minus;
	case 34:
		return flambe_input_Key.PageDown;
	case 33:
		return flambe_input_Key.PageUp;
	case 190:
		return flambe_input_Key.Period;
	case 222:
		return flambe_input_Key.Quote;
	case 221:
		return flambe_input_Key.RightBracket;
	case 186:
		return flambe_input_Key.Semicolon;
	case 16:
		return flambe_input_Key.Shift;
	case 191:
		return flambe_input_Key.Slash;
	case 32:
		return flambe_input_Key.Space;
	case 9:
		return flambe_input_Key.Tab;
	case 16777234:
		return flambe_input_Key.Menu;
	case 16777247:
		return flambe_input_Key.Search;
	}
	return flambe_input_Key.Unknown(keyCode);
};
flambe_platform_KeyCodes.toKeyCode = function(key) {
	switch(Type.enumIndex(key)) {
	case 0:
		return 65;
	case 1:
		return 66;
	case 2:
		return 67;
	case 3:
		return 68;
	case 4:
		return 69;
	case 5:
		return 70;
	case 6:
		return 71;
	case 7:
		return 72;
	case 8:
		return 73;
	case 9:
		return 74;
	case 10:
		return 75;
	case 11:
		return 76;
	case 12:
		return 77;
	case 13:
		return 78;
	case 14:
		return 79;
	case 15:
		return 80;
	case 16:
		return 81;
	case 17:
		return 82;
	case 18:
		return 83;
	case 19:
		return 84;
	case 20:
		return 85;
	case 21:
		return 86;
	case 22:
		return 87;
	case 23:
		return 88;
	case 24:
		return 89;
	case 25:
		return 90;
	case 26:
		return 48;
	case 27:
		return 49;
	case 28:
		return 50;
	case 29:
		return 51;
	case 30:
		return 52;
	case 31:
		return 53;
	case 32:
		return 54;
	case 33:
		return 55;
	case 34:
		return 56;
	case 35:
		return 57;
	case 36:
		return 96;
	case 37:
		return 97;
	case 38:
		return 98;
	case 39:
		return 99;
	case 40:
		return 100;
	case 41:
		return 101;
	case 42:
		return 102;
	case 43:
		return 103;
	case 44:
		return 104;
	case 45:
		return 105;
	case 46:
		return 107;
	case 47:
		return 110;
	case 48:
		return 111;
	case 49:
		return 108;
	case 50:
		return 106;
	case 51:
		return 109;
	case 52:
		return 112;
	case 53:
		return 113;
	case 54:
		return 114;
	case 55:
		return 115;
	case 56:
		return 116;
	case 57:
		return 117;
	case 58:
		return 118;
	case 59:
		return 119;
	case 60:
		return 120;
	case 61:
		return 121;
	case 62:
		return 122;
	case 63:
		return 123;
	case 64:
		return 124;
	case 65:
		return 125;
	case 66:
		return 126;
	case 67:
		return 37;
	case 68:
		return 38;
	case 69:
		return 39;
	case 70:
		return 40;
	case 71:
		return 18;
	case 72:
		return 192;
	case 73:
		return 220;
	case 74:
		return 8;
	case 75:
		return 20;
	case 76:
		return 188;
	case 77:
		return 15;
	case 78:
		return 17;
	case 79:
		return 46;
	case 80:
		return 35;
	case 81:
		return 13;
	case 82:
		return 187;
	case 83:
		return 27;
	case 84:
		return 36;
	case 85:
		return 45;
	case 86:
		return 219;
	case 87:
		return 189;
	case 88:
		return 34;
	case 89:
		return 33;
	case 90:
		return 190;
	case 91:
		return 222;
	case 92:
		return 221;
	case 93:
		return 186;
	case 94:
		return 16;
	case 95:
		return 191;
	case 96:
		return 32;
	case 97:
		return 9;
	case 98:
		return 16777234;
	case 99:
		return 16777247;
	case 100:
		var keyCode = key[2];
		return keyCode;
	}
};
var flambe_platform_MainLoop = function() {
	this._tickables = [];
};
$hxClasses["flambe.platform.MainLoop"] = flambe_platform_MainLoop;
flambe_platform_MainLoop.__name__ = ["flambe","platform","MainLoop"];
flambe_platform_MainLoop.updateEntity = function(entity,dt) {
	var speed;
	var component = entity.getComponent("SpeedAdjuster_8");
	speed = component;
	if(speed != null) {
		speed._realDt = dt;
		dt *= speed.scale.get__();
		if(dt <= 0) {
			speed.onUpdate(dt);
			return;
		}
	}
	var p = entity.firstComponent;
	while(p != null) {
		var next = p.next;
		if(!flambe_util_BitSets.contains(p._flags,1)) {
			p._flags = flambe_util_BitSets.add(p._flags,1);
			p.onStart();
		}
		p.onUpdate(dt);
		p = next;
	}
	var p1 = entity.firstChild;
	while(p1 != null) {
		var next1 = p1.next;
		flambe_platform_MainLoop.updateEntity(p1,dt);
		p1 = next1;
	}
};
flambe_platform_MainLoop.prototype = {
	update: function(dt) {
		if(dt <= 0) {
			flambe_Log.warn("Zero or negative time elapsed since the last frame!",["dt",dt]);
			return;
		}
		if(dt > 1) dt = 1;
		var ii = 0;
		while(ii < this._tickables.length) {
			var t = this._tickables[ii];
			if(t == null || t.update(dt)) this._tickables.splice(ii,1); else ++ii;
		}
		flambe_System.volume.update(dt);
		flambe_platform_MainLoop.updateEntity(flambe_System.root,dt);
	}
	,render: function(renderer) {
		var graphics = renderer.graphics;
		if(graphics != null) {
			renderer.willRender();
			flambe_display_Sprite.render(flambe_System.root,graphics);
			renderer.didRender();
		}
	}
	,addTickable: function(t) {
		this._tickables.push(t);
	}
	,__class__: flambe_platform_MainLoop
};
var flambe_platform_MouseCodes = function() { };
$hxClasses["flambe.platform.MouseCodes"] = flambe_platform_MouseCodes;
flambe_platform_MouseCodes.__name__ = ["flambe","platform","MouseCodes"];
flambe_platform_MouseCodes.toButton = function(buttonCode) {
	switch(buttonCode) {
	case 0:
		return flambe_input_MouseButton.Left;
	case 1:
		return flambe_input_MouseButton.Middle;
	case 2:
		return flambe_input_MouseButton.Right;
	}
	return flambe_input_MouseButton.Unknown(buttonCode);
};
var flambe_platform_OverdrawGraphics = function(impl) {
	this._impl = impl;
};
$hxClasses["flambe.platform.OverdrawGraphics"] = flambe_platform_OverdrawGraphics;
flambe_platform_OverdrawGraphics.__name__ = ["flambe","platform","OverdrawGraphics"];
flambe_platform_OverdrawGraphics.__interfaces__ = [flambe_platform_InternalGraphics];
flambe_platform_OverdrawGraphics.prototype = {
	save: function() {
		this._impl.save();
	}
	,transform: function(m00,m10,m01,m11,m02,m12) {
		this._impl.transform(m00,m10,m01,m11,m02,m12);
	}
	,multiplyAlpha: function(factor) {
	}
	,setBlendMode: function(blendMode) {
	}
	,applyScissor: function(x,y,width,height) {
		this._impl.applyScissor(x,y,width,height);
	}
	,restore: function() {
		this._impl.restore();
	}
	,drawTexture: function(texture,destX,destY) {
		this.drawRegion(destX,destY,texture.get_width(),texture.get_height());
	}
	,drawSubTexture: function(texture,destX,destY,sourceX,sourceY,sourceW,sourceH) {
		this.drawRegion(destX,destY,sourceW,sourceH);
	}
	,fillRect: function(color,x,y,width,height) {
		this.drawRegion(x,y,width,height);
	}
	,willRender: function() {
		this._impl.willRender();
		this._impl.save();
		this._impl.setBlendMode(flambe_display_BlendMode.Add);
	}
	,didRender: function() {
		this._impl.restore();
		this._impl.didRender();
	}
	,drawRegion: function(x,y,width,height) {
		this._impl.fillRect(1052680,x,y,width,height);
	}
	,__class__: flambe_platform_OverdrawGraphics
};
var flambe_platform_TextureRoot = function() { };
$hxClasses["flambe.platform.TextureRoot"] = flambe_platform_TextureRoot;
flambe_platform_TextureRoot.__name__ = ["flambe","platform","TextureRoot"];
flambe_platform_TextureRoot.prototype = {
	__class__: flambe_platform_TextureRoot
};
var flambe_platform_Tickable = function() { };
$hxClasses["flambe.platform.Tickable"] = flambe_platform_Tickable;
flambe_platform_Tickable.__name__ = ["flambe","platform","Tickable"];
flambe_platform_Tickable.prototype = {
	__class__: flambe_platform_Tickable
};
var flambe_platform_html_CanvasGraphics = function(canvas,alpha) {
	this._firstDraw = false;
	this._canvasCtx = canvas.getContext("2d",{ alpha : alpha});
};
$hxClasses["flambe.platform.html.CanvasGraphics"] = flambe_platform_html_CanvasGraphics;
flambe_platform_html_CanvasGraphics.__name__ = ["flambe","platform","html","CanvasGraphics"];
flambe_platform_html_CanvasGraphics.__interfaces__ = [flambe_platform_InternalGraphics];
flambe_platform_html_CanvasGraphics.prototype = {
	save: function() {
		this._canvasCtx.save();
	}
	,transform: function(m00,m10,m01,m11,m02,m12) {
		this._canvasCtx.transform(m00,m10,m01,m11,m02,m12);
	}
	,restore: function() {
		this._canvasCtx.restore();
	}
	,drawTexture: function(texture,destX,destY) {
		this.drawSubTexture(texture,destX,destY,0,0,texture.get_width(),texture.get_height());
	}
	,drawSubTexture: function(texture,destX,destY,sourceX,sourceY,sourceW,sourceH) {
		if(this._firstDraw) {
			this._firstDraw = false;
			this._canvasCtx.globalCompositeOperation = "copy";
			this.drawSubTexture(texture,destX,destY,sourceX,sourceY,sourceW,sourceH);
			this._canvasCtx.globalCompositeOperation = "source-over";
			return;
		}
		var texture1 = texture;
		var root = texture1.root;
		root.assertNotDisposed();
		this._canvasCtx.drawImage(root.image,Std["int"](texture1.rootX + sourceX),Std["int"](texture1.rootY + sourceY),Std["int"](sourceW),Std["int"](sourceH),Std["int"](destX),Std["int"](destY),Std["int"](sourceW),Std["int"](sourceH));
	}
	,fillRect: function(color,x,y,width,height) {
		if(this._firstDraw) {
			this._firstDraw = false;
			this._canvasCtx.globalCompositeOperation = "copy";
			this.fillRect(color,x,y,width,height);
			this._canvasCtx.globalCompositeOperation = "source-over";
			return;
		}
		var hex = (16777215 & color).toString(16);
		while(hex.length < 6) hex = "0" + Std.string(hex);
		this._canvasCtx.fillStyle = "#" + Std.string(hex);
		this._canvasCtx.fillRect(Std["int"](x),Std["int"](y),Std["int"](width),Std["int"](height));
	}
	,multiplyAlpha: function(factor) {
		this._canvasCtx.globalAlpha *= factor;
	}
	,setBlendMode: function(blendMode) {
		var op;
		switch(Type.enumIndex(blendMode)) {
		case 0:
			op = "source-over";
			break;
		case 1:
			op = "lighter";
			break;
		case 2:
			op = "multiply";
			break;
		case 3:
			op = "screen";
			break;
		case 4:
			op = "destination-in";
			break;
		case 5:
			op = "copy";
			break;
		}
		this._canvasCtx.globalCompositeOperation = op;
	}
	,applyScissor: function(x,y,width,height) {
		this._canvasCtx.beginPath();
		this._canvasCtx.rect(Std["int"](x),Std["int"](y),Std["int"](width),Std["int"](height));
		this._canvasCtx.clip();
	}
	,willRender: function() {
		this._firstDraw = true;
	}
	,didRender: function() {
	}
	,__class__: flambe_platform_html_CanvasGraphics
};
var flambe_platform_html_CanvasRenderer = function(canvas) {
	this.graphics = new flambe_platform_html_CanvasGraphics(canvas,false);
	this._hasGPU = new flambe_util_Value(true);
};
$hxClasses["flambe.platform.html.CanvasRenderer"] = flambe_platform_html_CanvasRenderer;
flambe_platform_html_CanvasRenderer.__name__ = ["flambe","platform","html","CanvasRenderer"];
flambe_platform_html_CanvasRenderer.__interfaces__ = [flambe_platform_InternalRenderer];
flambe_platform_html_CanvasRenderer.prototype = {
	get_type: function() {
		return flambe_subsystem_RendererType.Canvas;
	}
	,createTextureFromImage: function(image) {
		var root = new flambe_platform_html_CanvasTextureRoot(flambe_platform_html_CanvasRenderer.CANVAS_TEXTURES?flambe_platform_html_HtmlUtil.createCanvas(image):image);
		return root.createTexture(root.width,root.height);
	}
	,getCompressedTextureFormats: function() {
		return [];
	}
	,createCompressedTexture: function(format,data) {
		flambe_util_Assert.fail();
		return null;
	}
	,willRender: function() {
		this.graphics.willRender();
	}
	,didRender: function() {
		this.graphics.didRender();
	}
	,__class__: flambe_platform_html_CanvasRenderer
	,__properties__: {get_type:"get_type"}
};
var flambe_platform_html_CanvasTexture = function(root,width,height) {
	flambe_platform_BasicTexture.call(this,root,width,height);
};
$hxClasses["flambe.platform.html.CanvasTexture"] = flambe_platform_html_CanvasTexture;
flambe_platform_html_CanvasTexture.__name__ = ["flambe","platform","html","CanvasTexture"];
flambe_platform_html_CanvasTexture.__super__ = flambe_platform_BasicTexture;
flambe_platform_html_CanvasTexture.prototype = $extend(flambe_platform_BasicTexture.prototype,{
	__class__: flambe_platform_html_CanvasTexture
});
var flambe_platform_html_CanvasTextureRoot = function(image) {
	this._graphics = null;
	this.updateCount = 0;
	flambe_platform_BasicAsset.call(this);
	this.image = image;
	this.width = image.width;
	this.height = image.height;
};
$hxClasses["flambe.platform.html.CanvasTextureRoot"] = flambe_platform_html_CanvasTextureRoot;
flambe_platform_html_CanvasTextureRoot.__name__ = ["flambe","platform","html","CanvasTextureRoot"];
flambe_platform_html_CanvasTextureRoot.__interfaces__ = [flambe_platform_TextureRoot];
flambe_platform_html_CanvasTextureRoot.__super__ = flambe_platform_BasicAsset;
flambe_platform_html_CanvasTextureRoot.prototype = $extend(flambe_platform_BasicAsset.prototype,{
	createTexture: function(width,height) {
		return new flambe_platform_html_CanvasTexture(this,width,height);
	}
	,dirtyContents: function() {
		++this.updateCount;
	}
	,copyFrom: function(that) {
		this.image = that.image;
		this._graphics = that._graphics;
		this.dirtyContents();
	}
	,onDisposed: function() {
		this.image = null;
		this._graphics = null;
	}
	,__class__: flambe_platform_html_CanvasTextureRoot
});
var flambe_platform_html_HtmlAssetPackLoader = function(platform,manifest) {
	flambe_platform_BasicAssetPackLoader.call(this,platform,manifest);
};
$hxClasses["flambe.platform.html.HtmlAssetPackLoader"] = flambe_platform_html_HtmlAssetPackLoader;
flambe_platform_html_HtmlAssetPackLoader.__name__ = ["flambe","platform","html","HtmlAssetPackLoader"];
flambe_platform_html_HtmlAssetPackLoader.detectImageFormats = function(fn) {
	var formats = [flambe_asset_AssetFormat.PNG,flambe_asset_AssetFormat.JPG,flambe_asset_AssetFormat.GIF];
	var formatTests = 2;
	var checkRemaining = function() {
		--formatTests;
		if(formatTests == 0) fn(formats);
	};
	var webp;
	var _this = js_Browser.get_document();
	webp = _this.createElement("img");
	webp.onload = webp.onerror = function(_) {
		if(webp.width == 1) formats.unshift(flambe_asset_AssetFormat.WEBP);
		checkRemaining();
	};
	webp.src = "data:image/webp;base64,UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==";
	var jxr;
	var _this1 = js_Browser.get_document();
	jxr = _this1.createElement("img");
	jxr.onload = jxr.onerror = function(_1) {
		if(jxr.width == 1) formats.unshift(flambe_asset_AssetFormat.JXR);
		checkRemaining();
	};
	jxr.src = "data:image/vnd.ms-photo;base64,SUm8AQgAAAAFAAG8AQAQAAAASgAAAIC8BAABAAAAAQAAAIG8BAABAAAAAQAAAMC8BAABAAAAWgAAAMG8BAABAAAAHwAAAAAAAAAkw91vA07+S7GFPXd2jckNV01QSE9UTwAZAYBxAAAAABP/gAAEb/8AAQAAAQAAAA==";
};
flambe_platform_html_HtmlAssetPackLoader.detectAudioFormats = function() {
	var audio;
	var _this = js_Browser.get_document();
	audio = _this.createElement("audio");
	if(audio == null || $bind(audio,audio.canPlayType) == null) {
		flambe_Log.warn("Audio is not supported at all in this browser!");
		return [];
	}
	var blacklist = new EReg("\\b(iPhone|iPod|iPad|Android|Windows Phone)\\b","");
	var userAgent = js_Browser.get_navigator().userAgent;
	if(!flambe_platform_html_WebAudioSound.get_supported() && blacklist.match(userAgent)) {
		flambe_Log.warn("HTML5 audio is blacklisted for this browser",["userAgent",userAgent]);
		return [];
	}
	var types = [{ format : flambe_asset_AssetFormat.M4A, mimeType : "audio/mp4; codecs=mp4a"},{ format : flambe_asset_AssetFormat.MP3, mimeType : "audio/mpeg"},{ format : flambe_asset_AssetFormat.OPUS, mimeType : "audio/ogg; codecs=opus"},{ format : flambe_asset_AssetFormat.OGG, mimeType : "audio/ogg; codecs=vorbis"},{ format : flambe_asset_AssetFormat.WAV, mimeType : "audio/wav"}];
	var result = [];
	var _g = 0;
	while(_g < types.length) {
		var type = types[_g];
		++_g;
		var canPlayType = "";
		try {
			canPlayType = audio.canPlayType(type.mimeType);
		} catch( _ ) {
		}
		if(canPlayType != "") result.push(type.format);
	}
	return result;
};
flambe_platform_html_HtmlAssetPackLoader.supportsBlob = function() {
	if(flambe_platform_html_HtmlAssetPackLoader._detectBlobSupport) {
		flambe_platform_html_HtmlAssetPackLoader._detectBlobSupport = false;
		if(new EReg("\\bSilk\\b","").match(js_Browser.get_navigator().userAgent)) return false;
		if(js_Browser.get_window().Blob == null) return false;
		var xhr = new XMLHttpRequest();
		xhr.open("GET",".",true);
		if(xhr.responseType != "") return false;
		xhr.responseType = "blob";
		if(xhr.responseType != "blob") return false;
		flambe_platform_html_HtmlAssetPackLoader._URL = flambe_platform_html_HtmlUtil.loadExtension("URL").value;
	}
	return flambe_platform_html_HtmlAssetPackLoader._URL != null && flambe_platform_html_HtmlAssetPackLoader._URL.createObjectURL != null;
};
flambe_platform_html_HtmlAssetPackLoader.__super__ = flambe_platform_BasicAssetPackLoader;
flambe_platform_html_HtmlAssetPackLoader.prototype = $extend(flambe_platform_BasicAssetPackLoader.prototype,{
	loadEntry: function(url,entry) {
		var _g1 = this;
		var _g = entry.format;
		switch(Type.enumIndex(_g)) {
		case 0:case 1:case 2:case 3:case 4:
			var image;
			var _this = js_Browser.get_document();
			image = _this.createElement("img");
			var events = new flambe_platform_EventGroup();
			events.addDisposingListener(image,"load",function(_) {
				if(image.width > 1024 || image.height > 1024) flambe_Log.warn("Images larger than 1024px on a side will prevent GPU acceleration" + " on some platforms (iOS)",["url",url,"width",image.width,"height",image.height]);
				if(flambe_platform_html_HtmlAssetPackLoader.supportsBlob()) flambe_platform_html_HtmlAssetPackLoader._URL.revokeObjectURL(image.src);
				var texture = _g1._platform.getRenderer().createTextureFromImage(image);
				if(texture != null) _g1.handleLoad(entry,texture); else _g1.handleTextureError(entry);
			});
			events.addDisposingListener(image,"error",function(_1) {
				_g1.handleError(entry,"Failed to load image");
			});
			if(flambe_platform_html_HtmlAssetPackLoader.supportsBlob()) this.downloadBlob(url,entry,function(blob) {
				image.src = flambe_platform_html_HtmlAssetPackLoader._URL.createObjectURL(blob);
			}); else image.src = url;
			break;
		case 5:case 6:case 7:
			this.downloadArrayBuffer(url,entry,function(buffer) {
				var texture1 = _g1._platform.getRenderer().createCompressedTexture(entry.format,null);
				if(texture1 != null) _g1.handleLoad(entry,texture1); else _g1.handleTextureError(entry);
			});
			break;
		case 8:case 9:case 10:case 11:case 12:
			if(flambe_platform_html_WebAudioSound.get_supported()) this.downloadArrayBuffer(url,entry,function(buffer1) {
				flambe_platform_html_WebAudioSound.ctx.decodeAudioData(buffer1,function(decoded) {
					_g1.handleLoad(entry,new flambe_platform_html_WebAudioSound(decoded));
				},function() {
					flambe_Log.warn("Couldn't decode Web Audio, ignoring this asset",["url",url]);
					_g1.handleLoad(entry,flambe_platform_DummySound.getInstance());
				});
			}); else {
				var audio;
				var _this1 = js_Browser.get_document();
				audio = _this1.createElement("audio");
				audio.preload = "auto";
				var ref = ++flambe_platform_html_HtmlAssetPackLoader._mediaRefCount;
				if(flambe_platform_html_HtmlAssetPackLoader._mediaElements == null) flambe_platform_html_HtmlAssetPackLoader._mediaElements = new haxe_ds_IntMap();
				flambe_platform_html_HtmlAssetPackLoader._mediaElements.set(ref,audio);
				var events1 = new flambe_platform_EventGroup();
				events1.addDisposingListener(audio,"canplaythrough",function(_2) {
					flambe_platform_html_HtmlAssetPackLoader._mediaElements.remove(ref);
					_g1.handleLoad(entry,new flambe_platform_html_HtmlSound(audio));
				});
				events1.addDisposingListener(audio,"error",function(_3) {
					flambe_platform_html_HtmlAssetPackLoader._mediaElements.remove(ref);
					var code = audio.error.code;
					if(code == 3 || code == 4) {
						flambe_Log.warn("Couldn't decode HTML5 audio, ignoring this asset",["url",url,"code",code]);
						_g1.handleLoad(entry,flambe_platform_DummySound.getInstance());
					} else _g1.handleError(entry,"Failed to load audio: " + audio.error.code);
				});
				events1.addListener(audio,"progress",function(_4) {
					if(audio.buffered.length > 0 && audio.duration > 0) {
						var progress = audio.buffered.end(0) / audio.duration;
						_g1.handleProgress(entry,Std["int"](progress * entry.bytes));
					}
				});
				audio.src = url;
				audio.load();
			}
			break;
		case 13:
			this.downloadText(url,entry,function(text) {
				_g1.handleLoad(entry,new flambe_platform_BasicFile(text));
			});
			break;
		}
	}
	,getAssetFormats: function(fn) {
		var _g = this;
		if(flambe_platform_html_HtmlAssetPackLoader._supportedFormats == null) {
			flambe_platform_html_HtmlAssetPackLoader._supportedFormats = new flambe_util_Promise();
			flambe_platform_html_HtmlAssetPackLoader.detectImageFormats(function(imageFormats) {
				flambe_platform_html_HtmlAssetPackLoader._supportedFormats.set_result(_g._platform.getRenderer().getCompressedTextureFormats().concat(imageFormats).concat(flambe_platform_html_HtmlAssetPackLoader.detectAudioFormats()).concat([flambe_asset_AssetFormat.Data]));
			});
		}
		flambe_platform_html_HtmlAssetPackLoader._supportedFormats.get(fn);
	}
	,downloadArrayBuffer: function(url,entry,onLoad) {
		this.download(url,entry,"arraybuffer",onLoad);
	}
	,downloadBlob: function(url,entry,onLoad) {
		this.download(url,entry,"blob",onLoad);
	}
	,downloadText: function(url,entry,onLoad) {
		this.download(url,entry,"text",onLoad);
	}
	,download: function(url,entry,responseType,onLoad) {
		var _g = this;
		var xhr = null;
		var start = null;
		var intervalId = 0;
		var hasInterval = false;
		var clearRetryInterval = function() {
			if(hasInterval) {
				hasInterval = false;
				js_Browser.get_window().clearInterval(intervalId);
			}
		};
		var retries = 3;
		var maybeRetry = function() {
			--retries;
			if(retries >= 0) {
				flambe_Log.warn("Retrying asset download",["url",entry.url]);
				start();
				return true;
			}
			return false;
		};
		start = function() {
			clearRetryInterval();
			if(xhr != null) xhr.abort();
			xhr = new XMLHttpRequest();
			xhr.open("GET",url,true);
			xhr.responseType = responseType;
			var lastProgress = 0.0;
			xhr.onprogress = function(event) {
				if(!hasInterval) {
					hasInterval = true;
					intervalId = js_Browser.get_window().setInterval(function() {
						if(xhr.readyState != 4 && flambe_platform_html_HtmlUtil.now() - lastProgress > 5000) {
							if(!maybeRetry()) {
								clearRetryInterval();
								_g.handleError(entry,"Download stalled");
							}
						}
					},1000);
				}
				lastProgress = flambe_platform_html_HtmlUtil.now();
				_g.handleProgress(entry,event.loaded);
			};
			xhr.onerror = function(_) {
				if(xhr.status != 0 || !maybeRetry()) {
					clearRetryInterval();
					_g.handleError(entry,"HTTP error " + xhr.status);
				}
			};
			xhr.onload = function(_1) {
				var response = xhr.response;
				if(response == null) response = xhr.responseText;
				clearRetryInterval();
				onLoad(response);
			};
			xhr.send();
		};
		start();
	}
	,__class__: flambe_platform_html_HtmlAssetPackLoader
});
var flambe_platform_html_HtmlCatapultClient = function() {
	var _g = this;
	flambe_platform_CatapultClient.call(this);
	this._socket = new WebSocket("ws://" + js_Browser.get_location().host);
	this._socket.onerror = function(event) {
		_g.onError("unknown");
	};
	this._socket.onopen = function(event1) {
		flambe_Log.info("Catapult connected");
	};
	this._socket.onmessage = function(event2) {
		_g.onMessage(event2.data);
	};
};
$hxClasses["flambe.platform.html.HtmlCatapultClient"] = flambe_platform_html_HtmlCatapultClient;
flambe_platform_html_HtmlCatapultClient.__name__ = ["flambe","platform","html","HtmlCatapultClient"];
flambe_platform_html_HtmlCatapultClient.canUse = function() {
	return Reflect.hasField(js_Browser.get_window(),"WebSocket");
};
flambe_platform_html_HtmlCatapultClient.__super__ = flambe_platform_CatapultClient;
flambe_platform_html_HtmlCatapultClient.prototype = $extend(flambe_platform_CatapultClient.prototype,{
	onRestart: function() {
		js_Browser.get_window().top.location.reload();
	}
	,__class__: flambe_platform_html_HtmlCatapultClient
});
var flambe_subsystem_ExternalSystem = function() { };
$hxClasses["flambe.subsystem.ExternalSystem"] = flambe_subsystem_ExternalSystem;
flambe_subsystem_ExternalSystem.__name__ = ["flambe","subsystem","ExternalSystem"];
flambe_subsystem_ExternalSystem.prototype = {
	__class__: flambe_subsystem_ExternalSystem
};
var flambe_platform_html_HtmlExternal = function() {
};
$hxClasses["flambe.platform.html.HtmlExternal"] = flambe_platform_html_HtmlExternal;
flambe_platform_html_HtmlExternal.__name__ = ["flambe","platform","html","HtmlExternal"];
flambe_platform_html_HtmlExternal.__interfaces__ = [flambe_subsystem_ExternalSystem];
flambe_platform_html_HtmlExternal.prototype = {
	call: function(name,params) {
		if(params == null) params = [];
		var object = js_Browser.get_window();
		var method = object;
		var _g = 0;
		var _g1 = name.split(".");
		while(_g < _g1.length) {
			var fieldName = _g1[_g];
			++_g;
			object = method;
			method = Reflect.field(object,fieldName);
		}
		return Reflect.callMethod(object,method,params);
	}
	,__class__: flambe_platform_html_HtmlExternal
};
var flambe_util_LogHandler = function() { };
$hxClasses["flambe.util.LogHandler"] = flambe_util_LogHandler;
flambe_util_LogHandler.__name__ = ["flambe","util","LogHandler"];
flambe_util_LogHandler.prototype = {
	__class__: flambe_util_LogHandler
};
var flambe_platform_html_HtmlLogHandler = function(tag) {
	this._tagPrefix = tag + ": ";
};
$hxClasses["flambe.platform.html.HtmlLogHandler"] = flambe_platform_html_HtmlLogHandler;
flambe_platform_html_HtmlLogHandler.__name__ = ["flambe","platform","html","HtmlLogHandler"];
flambe_platform_html_HtmlLogHandler.__interfaces__ = [flambe_util_LogHandler];
flambe_platform_html_HtmlLogHandler.isSupported = function() {
	return typeof console == "object" && console.info != null;
};
flambe_platform_html_HtmlLogHandler.prototype = {
	log: function(level,message) {
		message = this._tagPrefix + message;
		switch(Type.enumIndex(level)) {
		case 0:
			console.info(message);
			break;
		case 1:
			console.warn(message);
			break;
		case 2:
			console.error(message);
			break;
		}
	}
	,__class__: flambe_platform_html_HtmlLogHandler
};
var flambe_platform_html_HtmlMouse = function(pointer,canvas) {
	flambe_platform_BasicMouse.call(this,pointer);
	this._canvas = canvas;
};
$hxClasses["flambe.platform.html.HtmlMouse"] = flambe_platform_html_HtmlMouse;
flambe_platform_html_HtmlMouse.__name__ = ["flambe","platform","html","HtmlMouse"];
flambe_platform_html_HtmlMouse.__super__ = flambe_platform_BasicMouse;
flambe_platform_html_HtmlMouse.prototype = $extend(flambe_platform_BasicMouse.prototype,{
	set_cursor: function(cursor) {
		var name;
		switch(Type.enumIndex(cursor)) {
		case 0:
			name = "";
			break;
		case 1:
			name = "pointer";
			break;
		case 2:
			name = "none";
			break;
		}
		this._canvas.style.cursor = name;
		return flambe_platform_BasicMouse.prototype.set_cursor.call(this,cursor);
	}
	,__class__: flambe_platform_html_HtmlMouse
});
var flambe_platform_html_HtmlSound = function(audioElement) {
	flambe_platform_BasicAsset.call(this);
	this.audioElement = audioElement;
};
$hxClasses["flambe.platform.html.HtmlSound"] = flambe_platform_html_HtmlSound;
flambe_platform_html_HtmlSound.__name__ = ["flambe","platform","html","HtmlSound"];
flambe_platform_html_HtmlSound.__interfaces__ = [flambe_sound_Sound];
flambe_platform_html_HtmlSound.__super__ = flambe_platform_BasicAsset;
flambe_platform_html_HtmlSound.prototype = $extend(flambe_platform_BasicAsset.prototype,{
	play: function(volume) {
		if(volume == null) volume = 1.0;
		this.assertNotDisposed();
		return new flambe_platform_html__$HtmlSound_HtmlPlayback(this,volume,false);
	}
	,loop: function(volume) {
		if(volume == null) volume = 1.0;
		this.assertNotDisposed();
		return new flambe_platform_html__$HtmlSound_HtmlPlayback(this,volume,true);
	}
	,copyFrom: function(that) {
		this.audioElement = that.audioElement;
	}
	,onDisposed: function() {
		this.audioElement = null;
	}
	,__class__: flambe_platform_html_HtmlSound
});
var flambe_platform_html__$HtmlSound_HtmlPlayback = function(sound,volume,loop) {
	var _g = this;
	this._sound = sound;
	this._tickableAdded = false;
	var _this = js_Browser.get_document();
	this._clonedElement = _this.createElement("audio");
	this._clonedElement.loop = loop;
	this._clonedElement.src = sound.audioElement.src;
	this.volume = new flambe_animation_AnimatedFloat(volume,function(_,_1) {
		_g.updateVolume();
	});
	this.updateVolume();
	this._complete = new flambe_util_Value(false);
	this.playAudio();
	if(flambe_System.hidden.get__()) this.set_paused(true);
};
$hxClasses["flambe.platform.html._HtmlSound.HtmlPlayback"] = flambe_platform_html__$HtmlSound_HtmlPlayback;
flambe_platform_html__$HtmlSound_HtmlPlayback.__name__ = ["flambe","platform","html","_HtmlSound","HtmlPlayback"];
flambe_platform_html__$HtmlSound_HtmlPlayback.__interfaces__ = [flambe_platform_Tickable,flambe_sound_Playback];
flambe_platform_html__$HtmlSound_HtmlPlayback.prototype = {
	get_sound: function() {
		return this._sound;
	}
	,get_paused: function() {
		return this._clonedElement.paused;
	}
	,set_paused: function(paused) {
		if(this._clonedElement.paused != paused) {
			if(paused) this._clonedElement.pause(); else this.playAudio();
		}
		return paused;
	}
	,update: function(dt) {
		this.volume.update(dt);
		this._complete.set__(this._clonedElement.ended);
		if(this._complete.get__() || this.get_paused()) {
			this._tickableAdded = false;
			this._volumeBinding.dispose();
			this._hideBinding.dispose();
			return true;
		}
		return false;
	}
	,dispose: function() {
		this.set_paused(true);
		this._complete.set__(true);
	}
	,playAudio: function() {
		var _g = this;
		this._clonedElement.play();
		if(!this._tickableAdded) {
			flambe_platform_html_HtmlPlatform.instance.mainLoop.addTickable(this);
			this._tickableAdded = true;
			this._volumeBinding = flambe_System.volume.get_changed().connect(function(_,_1) {
				_g.updateVolume();
			});
			this._hideBinding = flambe_System.hidden.get_changed().connect(function(hidden,_2) {
				if(hidden) {
					_g._wasPaused = _g.get_paused();
					_g.set_paused(true);
				} else _g.set_paused(_g._wasPaused);
			});
		}
	}
	,updateVolume: function() {
		this._clonedElement.volume = flambe_System.volume.get__() * this.volume.get__();
	}
	,__class__: flambe_platform_html__$HtmlSound_HtmlPlayback
	,__properties__: {get_sound:"get_sound",set_paused:"set_paused",get_paused:"get_paused"}
};
var flambe_subsystem_StageSystem = function() { };
$hxClasses["flambe.subsystem.StageSystem"] = flambe_subsystem_StageSystem;
flambe_subsystem_StageSystem.__name__ = ["flambe","subsystem","StageSystem"];
flambe_subsystem_StageSystem.prototype = {
	__class__: flambe_subsystem_StageSystem
};
var flambe_platform_html_HtmlStage = function(canvas) {
	var _g = this;
	this._canvas = canvas;
	this.resize = new flambe_util_Signal0();
	this.scaleFactor = flambe_platform_html_HtmlStage.computeScaleFactor();
	if(this.scaleFactor != 1) {
		flambe_Log.info("Reversing device DPI scaling",["scaleFactor",this.scaleFactor]);
		flambe_platform_html_HtmlUtil.setVendorStyle(this._canvas,"transform-origin","top left");
		flambe_platform_html_HtmlUtil.setVendorStyle(this._canvas,"transform","scale(" + 1 / this.scaleFactor + ")");
	}
	if(flambe_platform_html_HtmlUtil.SHOULD_HIDE_MOBILE_BROWSER) {
		js_Browser.get_window().addEventListener("orientationchange",function(_) {
			flambe_platform_html_HtmlUtil.callLater($bind(_g,_g.hideMobileBrowser),200);
		},false);
		this.hideMobileBrowser();
	}
	js_Browser.get_window().addEventListener("resize",$bind(this,this.onWindowResize),false);
	this.onWindowResize(null);
	this.orientation = new flambe_util_Value(null);
	if(js_Browser.get_window().orientation != null) {
		js_Browser.get_window().addEventListener("orientationchange",$bind(this,this.onOrientationChange),false);
		this.onOrientationChange(null);
	}
	this.fullscreen = new flambe_util_Value(false);
	flambe_platform_html_HtmlUtil.addVendorListener(js_Browser.get_document(),"fullscreenchange",function(_1) {
		_g.updateFullscreen();
	},false);
	flambe_platform_html_HtmlUtil.addVendorListener(js_Browser.get_document(),"fullscreenerror",function(_2) {
		flambe_Log.warn("Error when requesting fullscreen");
	},false);
	this.updateFullscreen();
};
$hxClasses["flambe.platform.html.HtmlStage"] = flambe_platform_html_HtmlStage;
flambe_platform_html_HtmlStage.__name__ = ["flambe","platform","html","HtmlStage"];
flambe_platform_html_HtmlStage.__interfaces__ = [flambe_subsystem_StageSystem];
flambe_platform_html_HtmlStage.computeScaleFactor = function() {
	var devicePixelRatio = js_Browser.get_window().devicePixelRatio;
	if(devicePixelRatio == null) devicePixelRatio = 1;
	var canvas;
	var _this = js_Browser.get_document();
	canvas = _this.createElement("canvas");
	var ctx = canvas.getContext("2d");
	var backingStorePixelRatio = flambe_platform_html_HtmlUtil.loadExtension("backingStorePixelRatio",ctx).value;
	if(backingStorePixelRatio == null) backingStorePixelRatio = 1;
	var scale = devicePixelRatio / backingStorePixelRatio;
	var screenWidth = js_Browser.get_window().screen.width;
	var screenHeight = js_Browser.get_window().screen.height;
	if(scale * screenWidth > 1136 || scale * screenHeight > 1136) return 1;
	return scale;
};
flambe_platform_html_HtmlStage.prototype = {
	get_width: function() {
		return this._canvas.width;
	}
	,get_height: function() {
		return this._canvas.height;
	}
	,lockOrientation: function(orient) {
		var lockOrientation = flambe_platform_html_HtmlUtil.loadExtension("lockOrientation",js_Browser.get_window().screen).value;
		if(lockOrientation != null) {
			var htmlOrient;
			switch(Type.enumIndex(orient)) {
			case 0:
				htmlOrient = "portrait";
				break;
			case 1:
				htmlOrient = "landscape";
				break;
			}
			var allowed = Reflect.callMethod(js_Browser.get_window().screen,lockOrientation,[htmlOrient]);
			if(!allowed) flambe_Log.warn("The request to lockOrientation() was refused by the browser");
		}
	}
	,requestFullscreen: function(enable) {
		if(enable == null) enable = true;
		if(enable) {
			var documentElement = js_Browser.get_document().documentElement;
			var requestFullscreen = flambe_platform_html_HtmlUtil.loadFirstExtension(["requestFullscreen","requestFullScreen"],documentElement).value;
			if(requestFullscreen != null) Reflect.callMethod(documentElement,requestFullscreen,[]);
		} else {
			var cancelFullscreen = flambe_platform_html_HtmlUtil.loadFirstExtension(["cancelFullscreen","cancelFullScreen"],js_Browser.get_document()).value;
			if(cancelFullscreen != null) Reflect.callMethod(js_Browser.get_document(),cancelFullscreen,[]);
		}
	}
	,onWindowResize: function(_) {
		var container = this._canvas.parentElement;
		var rect = container.getBoundingClientRect();
		this.resizeCanvas(rect.width,rect.height);
	}
	,resizeCanvas: function(width,height) {
		var scaledWidth = this.scaleFactor * width;
		var scaledHeight = this.scaleFactor * height;
		if(this._canvas.width == scaledWidth && this._canvas.height == scaledHeight) return false;
		this._canvas.width = Std["int"](scaledWidth);
		this._canvas.height = Std["int"](scaledHeight);
		this.resize.emit();
		return true;
	}
	,hideMobileBrowser: function() {
		var _g = this;
		var mobileAddressBar = 100;
		var htmlStyle = js_Browser.get_document().documentElement.style;
		htmlStyle.height = js_Browser.get_window().innerHeight + mobileAddressBar + "px";
		htmlStyle.width = js_Browser.get_window().innerWidth + "px";
		htmlStyle.overflow = "visible";
		flambe_platform_html_HtmlUtil.callLater(function() {
			flambe_platform_html_HtmlUtil.hideMobileBrowser();
			flambe_platform_html_HtmlUtil.callLater(function() {
				htmlStyle.height = js_Browser.get_window().innerHeight + "px";
				_g.onWindowResize(null);
			},100);
		});
	}
	,onOrientationChange: function(_) {
		var value = flambe_platform_html_HtmlUtil.orientation(js_Browser.get_window().orientation);
		this.orientation.set__(value);
	}
	,updateFullscreen: function() {
		var state = flambe_platform_html_HtmlUtil.loadFirstExtension(["fullscreen","fullScreen","isFullScreen"],js_Browser.get_document()).value;
		this.fullscreen.set__(state == true);
	}
	,__class__: flambe_platform_html_HtmlStage
	,__properties__: {get_height:"get_height",get_width:"get_width"}
};
var flambe_platform_html_HtmlStorage = function(storage) {
	this._storage = storage;
};
$hxClasses["flambe.platform.html.HtmlStorage"] = flambe_platform_html_HtmlStorage;
flambe_platform_html_HtmlStorage.__name__ = ["flambe","platform","html","HtmlStorage"];
flambe_platform_html_HtmlStorage.__interfaces__ = [flambe_subsystem_StorageSystem];
flambe_platform_html_HtmlStorage.prototype = {
	set: function(key,value) {
		var encoded;
		try {
			var serializer = new haxe_Serializer();
			serializer.useCache = true;
			serializer.useEnumIndex = false;
			serializer.serialize(value);
			encoded = serializer.toString();
		} catch( error ) {
			flambe_Log.warn("Storage serialization failed",["message",error]);
			return false;
		}
		try {
			this._storage.setItem("flambe:" + key,encoded);
		} catch( error1 ) {
			flambe_Log.warn("localStorage.setItem failed",["message",error1.message]);
			return false;
		}
		return true;
	}
	,get: function(key,defaultValue) {
		var encoded = null;
		try {
			encoded = this._storage.getItem("flambe:" + key);
		} catch( error ) {
			flambe_Log.warn("localStorage.getItem failed",["message",error.message]);
		}
		if(encoded != null) try {
			return haxe_Unserializer.run(encoded);
		} catch( error1 ) {
			flambe_Log.warn("Storage unserialization failed",["message",error1]);
		}
		return defaultValue;
	}
	,__class__: flambe_platform_html_HtmlStorage
};
var flambe_platform_html_HtmlUtil = function() { };
$hxClasses["flambe.platform.html.HtmlUtil"] = flambe_platform_html_HtmlUtil;
flambe_platform_html_HtmlUtil.__name__ = ["flambe","platform","html","HtmlUtil"];
flambe_platform_html_HtmlUtil.callLater = function(func,delay) {
	if(delay == null) delay = 0;
	js_Browser.get_window().setTimeout(func,delay);
};
flambe_platform_html_HtmlUtil.hideMobileBrowser = function() {
	js_Browser.get_window().scrollTo(1,0);
};
flambe_platform_html_HtmlUtil.loadExtension = function(name,obj) {
	if(obj == null) obj = js_Browser.get_window();
	var extension = Reflect.field(obj,name);
	if(extension != null) return { prefix : "", field : name, value : extension};
	var capitalized = name.charAt(0).toUpperCase() + HxOverrides.substr(name,1,null);
	var _g = 0;
	var _g1 = flambe_platform_html_HtmlUtil.VENDOR_PREFIXES;
	while(_g < _g1.length) {
		var prefix = _g1[_g];
		++_g;
		var field = prefix + capitalized;
		var extension1 = Reflect.field(obj,field);
		if(extension1 != null) return { prefix : prefix, field : field, value : extension1};
	}
	return { prefix : null, field : null, value : null};
};
flambe_platform_html_HtmlUtil.loadFirstExtension = function(names,obj) {
	var _g = 0;
	while(_g < names.length) {
		var name = names[_g];
		++_g;
		var extension = flambe_platform_html_HtmlUtil.loadExtension(name,obj);
		if(extension.field != null) return extension;
	}
	return { prefix : null, field : null, value : null};
};
flambe_platform_html_HtmlUtil.polyfill = function(name,obj) {
	if(obj == null) obj = js_Browser.get_window();
	var value = flambe_platform_html_HtmlUtil.loadExtension(name,obj).value;
	if(value == null) return false;
	Reflect.setField(obj,name,value);
	return true;
};
flambe_platform_html_HtmlUtil.setVendorStyle = function(element,name,value) {
	var style = element.style;
	var _g = 0;
	var _g1 = flambe_platform_html_HtmlUtil.VENDOR_PREFIXES;
	while(_g < _g1.length) {
		var prefix = _g1[_g];
		++_g;
		style.setProperty("-" + prefix + "-" + name,value);
	}
	style.setProperty(name,value);
};
flambe_platform_html_HtmlUtil.addVendorListener = function(dispatcher,type,listener,useCapture) {
	var _g = 0;
	var _g1 = flambe_platform_html_HtmlUtil.VENDOR_PREFIXES;
	while(_g < _g1.length) {
		var prefix = _g1[_g];
		++_g;
		dispatcher.addEventListener(prefix + type,listener,useCapture);
	}
	dispatcher.addEventListener(type,listener,useCapture);
};
flambe_platform_html_HtmlUtil.orientation = function(angle) {
	switch(angle) {
	case -90:case 90:
		return flambe_display_Orientation.Landscape;
	default:
		return flambe_display_Orientation.Portrait;
	}
};
flambe_platform_html_HtmlUtil.now = function() {
	return Date.now();
};
flambe_platform_html_HtmlUtil.createEmptyCanvas = function(width,height) {
	var canvas;
	var _this = js_Browser.get_document();
	canvas = _this.createElement("canvas");
	canvas.width = width;
	canvas.height = height;
	return canvas;
};
flambe_platform_html_HtmlUtil.createCanvas = function(source) {
	var canvas = flambe_platform_html_HtmlUtil.createEmptyCanvas(source.width,source.height);
	var ctx = canvas.getContext("2d");
	ctx.save();
	ctx.globalCompositeOperation = "copy";
	ctx.drawImage(source,0,0);
	ctx.restore();
	return canvas;
};
flambe_platform_html_HtmlUtil.fixAndroidMath = function() {
	if(js_Browser.get_navigator().userAgent.indexOf("Linux; U; Android 4") >= 0) {
		flambe_Log.warn("Monkey patching around Android sin/cos bug");
		var sin = Math.sin;
		var cos = Math.cos;
		Math.sin = function(x) {
			if(x == 0) return 0; else return sin(x);
		};
		Math.cos = function(x1) {
			if(x1 == 0) return 1; else return cos(x1);
		};
	}
};
var flambe_platform_html_WebAudioSound = function(buffer) {
	flambe_platform_BasicAsset.call(this);
	this.buffer = buffer;
};
$hxClasses["flambe.platform.html.WebAudioSound"] = flambe_platform_html_WebAudioSound;
flambe_platform_html_WebAudioSound.__name__ = ["flambe","platform","html","WebAudioSound"];
flambe_platform_html_WebAudioSound.__interfaces__ = [flambe_sound_Sound];
flambe_platform_html_WebAudioSound.__properties__ = {get_supported:"get_supported"}
flambe_platform_html_WebAudioSound.get_supported = function() {
	if(flambe_platform_html_WebAudioSound._detectSupport) {
		flambe_platform_html_WebAudioSound._detectSupport = false;
		var AudioContext = flambe_platform_html_HtmlUtil.loadExtension("AudioContext").value;
		if(AudioContext != null) {
			flambe_platform_html_WebAudioSound.ctx = new AudioContext();
			flambe_platform_html_WebAudioSound.gain = flambe_platform_html_WebAudioSound.createGain();
			flambe_platform_html_WebAudioSound.gain.connect(flambe_platform_html_WebAudioSound.ctx.destination);
			flambe_System.volume.watch(function(volume,_) {
				flambe_platform_html_WebAudioSound.gain.gain.value = volume;
			});
		}
	}
	return flambe_platform_html_WebAudioSound.ctx != null;
};
flambe_platform_html_WebAudioSound.createGain = function() {
	if(flambe_platform_html_WebAudioSound.ctx.createGain != null) return flambe_platform_html_WebAudioSound.ctx.createGain(); else return flambe_platform_html_WebAudioSound.ctx.createGainNode();
};
flambe_platform_html_WebAudioSound.start = function(node,time) {
	if(node.start != null) node.start(time); else node.noteOn(time);
};
flambe_platform_html_WebAudioSound.__super__ = flambe_platform_BasicAsset;
flambe_platform_html_WebAudioSound.prototype = $extend(flambe_platform_BasicAsset.prototype,{
	play: function(volume) {
		if(volume == null) volume = 1.0;
		this.assertNotDisposed();
		return new flambe_platform_html__$WebAudioSound_WebAudioPlayback(this,volume,false);
	}
	,loop: function(volume) {
		if(volume == null) volume = 1.0;
		this.assertNotDisposed();
		return new flambe_platform_html__$WebAudioSound_WebAudioPlayback(this,volume,true);
	}
	,get_duration: function() {
		this.assertNotDisposed();
		return this.buffer.duration;
	}
	,copyFrom: function(that) {
		this.buffer = that.buffer;
	}
	,onDisposed: function() {
		this.buffer = null;
	}
	,__class__: flambe_platform_html_WebAudioSound
	,__properties__: $extend(flambe_platform_BasicAsset.prototype.__properties__,{get_duration:"get_duration"})
});
var flambe_platform_html__$WebAudioSound_WebAudioPlayback = function(sound,volume,loop) {
	var _g = this;
	this._sound = sound;
	this._head = flambe_platform_html_WebAudioSound.gain;
	this._complete = new flambe_util_Value(false);
	this._sourceNode = flambe_platform_html_WebAudioSound.ctx.createBufferSource();
	this._sourceNode.buffer = sound.buffer;
	this._sourceNode.loop = loop;
	this._sourceNode.onended = function() {
		_g._complete.set__(true);
	};
	flambe_platform_html_WebAudioSound.start(this._sourceNode,0);
	this.playAudio();
	this.volume = new flambe_animation_AnimatedFloat(volume,function(v,_) {
		_g.setVolume(v);
	});
	if(volume != 1) this.setVolume(volume);
	if(flambe_System.hidden.get__()) this.set_paused(true);
};
$hxClasses["flambe.platform.html._WebAudioSound.WebAudioPlayback"] = flambe_platform_html__$WebAudioSound_WebAudioPlayback;
flambe_platform_html__$WebAudioSound_WebAudioPlayback.__name__ = ["flambe","platform","html","_WebAudioSound","WebAudioPlayback"];
flambe_platform_html__$WebAudioSound_WebAudioPlayback.__interfaces__ = [flambe_platform_Tickable,flambe_sound_Playback];
flambe_platform_html__$WebAudioSound_WebAudioPlayback.prototype = {
	get_sound: function() {
		return this._sound;
	}
	,get_paused: function() {
		return this._pausedAt >= 0;
	}
	,set_paused: function(paused) {
		if(paused != this.get_paused()) {
			if(paused) {
				this._sourceNode.disconnect();
				this._pausedAt = this.get_position();
			} else this.playAudio();
		}
		return paused;
	}
	,get_position: function() {
		if(this._complete.get__()) return this._sound.get_duration(); else if(this.get_paused()) return this._pausedAt; else {
			var elapsed = flambe_platform_html_WebAudioSound.ctx.currentTime - this._startedAt;
			return elapsed % this._sound.get_duration();
		}
	}
	,update: function(dt) {
		this.volume.update(dt);
		if(this._sourceNode.playbackState == 3) this._complete.set__(true);
		if(this._complete.get__() || this.get_paused()) {
			this._tickableAdded = false;
			this._hideBinding.dispose();
			return true;
		}
		return false;
	}
	,dispose: function() {
		this.set_paused(true);
		this._complete.set__(true);
	}
	,setVolume: function(volume) {
		if(this._gainNode == null) {
			this._gainNode = flambe_platform_html_WebAudioSound.createGain();
			this.insertNode(this._gainNode);
		}
		this._gainNode.gain.value = volume;
	}
	,insertNode: function(head) {
		if(!this.get_paused()) {
			this._sourceNode.disconnect();
			this._sourceNode.connect(head);
		}
		head.connect(this._head);
		this._head = head;
	}
	,playAudio: function() {
		var _g = this;
		this._sourceNode.connect(this._head);
		this._startedAt = flambe_platform_html_WebAudioSound.ctx.currentTime;
		this._pausedAt = -1;
		if(!this._tickableAdded) {
			flambe_platform_html_HtmlPlatform.instance.mainLoop.addTickable(this);
			this._tickableAdded = true;
			this._hideBinding = flambe_System.hidden.get_changed().connect(function(hidden,_) {
				if(hidden) {
					_g._wasPaused = _g.get_paused();
					_g.set_paused(true);
				} else _g.set_paused(_g._wasPaused);
			});
		}
	}
	,__class__: flambe_platform_html__$WebAudioSound_WebAudioPlayback
	,__properties__: {get_position:"get_position",get_sound:"get_sound",set_paused:"set_paused",get_paused:"get_paused"}
};
var flambe_scene_Director = function() {
	this._height = -1;
	this._width = -1;
	this._transitor = null;
	flambe_Component.call(this);
	this.scenes = [];
	this.occludedScenes = [];
	this._root = new flambe_Entity();
};
$hxClasses["flambe.scene.Director"] = flambe_scene_Director;
flambe_scene_Director.__name__ = ["flambe","scene","Director"];
flambe_scene_Director.__super__ = flambe_Component;
flambe_scene_Director.prototype = $extend(flambe_Component.prototype,{
	get_name: function() {
		return "Director_7";
	}
	,setSize: function(width,height) {
		this._width = width;
		this._height = height;
		return this;
	}
	,pushScene: function(scene,transition) {
		var _g = this;
		this.completeTransition();
		var oldTop = this.get_topScene();
		if(oldTop != null) this.playTransition(oldTop,scene,transition,function() {
			_g.hide(oldTop);
		}); else {
			this.add(scene);
			this.invalidateVisibility();
		}
	}
	,popScene: function(transition) {
		var _g = this;
		this.completeTransition();
		var oldTop = this.get_topScene();
		if(oldTop != null) {
			this.scenes.pop();
			var newTop = this.get_topScene();
			if(newTop != null) this.playTransition(oldTop,newTop,transition,function() {
				_g.hideAndDispose(oldTop);
			}); else {
				this.hideAndDispose(oldTop);
				this.invalidateVisibility();
			}
		}
	}
	,unwindToScene: function(scene,transition) {
		var _g = this;
		this.completeTransition();
		var oldTop = this.get_topScene();
		if(oldTop != null) {
			if(oldTop == scene) return;
			this.scenes.pop();
			while(this.scenes.length > 0 && this.scenes[this.scenes.length - 1] != scene) this.scenes.pop().dispose();
			this.playTransition(oldTop,scene,transition,function() {
				_g.hideAndDispose(oldTop);
			});
		} else this.pushScene(scene,transition);
	}
	,onAdded: function() {
		this.owner.addChild(this._root);
	}
	,onRemoved: function() {
		this.completeTransition();
		var _g = 0;
		var _g1 = this.scenes;
		while(_g < _g1.length) {
			var scene = _g1[_g];
			++_g;
			scene.dispose();
		}
		this.scenes = [];
		this.occludedScenes = [];
		this._root.dispose();
	}
	,onUpdate: function(dt) {
		if(this._transitor != null && this._transitor.update(dt)) this.completeTransition();
	}
	,get_topScene: function() {
		var ll = this.scenes.length;
		if(ll > 0) return this.scenes[ll - 1]; else return null;
	}
	,add: function(scene) {
		var oldTop = this.get_topScene();
		if(oldTop != null) this._root.removeChild(oldTop);
		HxOverrides.remove(this.scenes,scene);
		this.scenes.push(scene);
		this._root.addChild(scene);
	}
	,hide: function(scene) {
		var events;
		var component = scene.getComponent("Scene_6");
		events = component;
		if(events != null) events.hidden.emit();
	}
	,hideAndDispose: function(scene) {
		this.hide(scene);
		scene.dispose();
	}
	,show: function(scene) {
		var events;
		var component = scene.getComponent("Scene_6");
		events = component;
		if(events != null) events.shown.emit();
	}
	,invalidateVisibility: function() {
		var ii = this.scenes.length;
		while(ii > 0) {
			var scene = this.scenes[--ii];
			var comp;
			var component = scene.getComponent("Scene_6");
			comp = component;
			if(comp == null || comp.opaque) break;
		}
		if(this.scenes.length > 0) this.occludedScenes = this.scenes.slice(ii,this.scenes.length - 1); else this.occludedScenes = [];
		var scene1 = this.get_topScene();
		if(scene1 != null) this.show(scene1);
	}
	,completeTransition: function() {
		if(this._transitor != null) {
			this._transitor.complete();
			this._transitor = null;
			this.invalidateVisibility();
		}
	}
	,playTransition: function(from,to,transition,onComplete) {
		this.completeTransition();
		this.add(to);
		if(transition != null) {
			this.occludedScenes.push(from);
			this._transitor = new flambe_scene__$Director_Transitor(from,to,transition,onComplete);
			this._transitor.init(this);
		} else {
			onComplete();
			this.invalidateVisibility();
		}
	}
	,get_width: function() {
		if(this._width < 0) return flambe_System.get_stage().get_width(); else return this._width;
	}
	,get_height: function() {
		if(this._height < 0) return flambe_System.get_stage().get_height(); else return this._height;
	}
	,__class__: flambe_scene_Director
	,__properties__: $extend(flambe_Component.prototype.__properties__,{get_height:"get_height",get_width:"get_width",get_topScene:"get_topScene"})
});
var flambe_scene__$Director_Transitor = function(from,to,transition,onComplete) {
	this._from = from;
	this._to = to;
	this._transition = transition;
	this._onComplete = onComplete;
};
$hxClasses["flambe.scene._Director.Transitor"] = flambe_scene__$Director_Transitor;
flambe_scene__$Director_Transitor.__name__ = ["flambe","scene","_Director","Transitor"];
flambe_scene__$Director_Transitor.prototype = {
	init: function(director) {
		this._transition.init(director,this._from,this._to);
	}
	,update: function(dt) {
		return this._transition.update(dt);
	}
	,complete: function() {
		this._transition.complete();
		this._onComplete();
	}
	,__class__: flambe_scene__$Director_Transitor
};
var flambe_scene_Transition = function() { };
$hxClasses["flambe.scene.Transition"] = flambe_scene_Transition;
flambe_scene_Transition.__name__ = ["flambe","scene","Transition"];
flambe_scene_Transition.prototype = {
	init: function(director,from,to) {
		this._director = director;
		this._from = from;
		this._to = to;
	}
	,update: function(dt) {
		return true;
	}
	,complete: function() {
	}
	,__class__: flambe_scene_Transition
};
var flambe_scene_TweenTransition = function(duration,ease) {
	this._duration = duration;
	if(ease != null) this._ease = ease; else this._ease = flambe_animation_Ease.linear;
};
$hxClasses["flambe.scene.TweenTransition"] = flambe_scene_TweenTransition;
flambe_scene_TweenTransition.__name__ = ["flambe","scene","TweenTransition"];
flambe_scene_TweenTransition.__super__ = flambe_scene_Transition;
flambe_scene_TweenTransition.prototype = $extend(flambe_scene_Transition.prototype,{
	init: function(director,from,to) {
		flambe_scene_Transition.prototype.init.call(this,director,from,to);
		this._elapsed = 0;
	}
	,update: function(dt) {
		this._elapsed += dt;
		return this._elapsed >= this._duration;
	}
	,interp: function(from,to) {
		return from + (to - from) * this._ease(this._elapsed / this._duration);
	}
	,__class__: flambe_scene_TweenTransition
});
var flambe_scene_FadeTransition = function(duration,ease) {
	flambe_scene_TweenTransition.call(this,duration,ease);
};
$hxClasses["flambe.scene.FadeTransition"] = flambe_scene_FadeTransition;
flambe_scene_FadeTransition.__name__ = ["flambe","scene","FadeTransition"];
flambe_scene_FadeTransition.__super__ = flambe_scene_TweenTransition;
flambe_scene_FadeTransition.prototype = $extend(flambe_scene_TweenTransition.prototype,{
	init: function(director,from,to) {
		flambe_scene_TweenTransition.prototype.init.call(this,director,from,to);
		var sprite;
		var component = this._to.getComponent("Sprite_2");
		sprite = component;
		if(sprite == null) this._to.add(sprite = new flambe_display_Sprite());
		sprite.alpha.set__(0);
	}
	,update: function(dt) {
		var done = flambe_scene_TweenTransition.prototype.update.call(this,dt);
		((function($this) {
			var $r;
			var component = $this._to.getComponent("Sprite_2");
			$r = component;
			return $r;
		}(this))).alpha.set__(this.interp(0,1));
		return done;
	}
	,complete: function() {
		((function($this) {
			var $r;
			var component = $this._to.getComponent("Sprite_2");
			$r = component;
			return $r;
		}(this))).alpha.set__(1);
	}
	,__class__: flambe_scene_FadeTransition
});
var flambe_scene_Scene = function(opaque) {
	if(opaque == null) opaque = true;
	flambe_Component.call(this);
	this.opaque = opaque;
	this.shown = new flambe_util_Signal0();
	this.hidden = new flambe_util_Signal0();
};
$hxClasses["flambe.scene.Scene"] = flambe_scene_Scene;
flambe_scene_Scene.__name__ = ["flambe","scene","Scene"];
flambe_scene_Scene.__super__ = flambe_Component;
flambe_scene_Scene.prototype = $extend(flambe_Component.prototype,{
	get_name: function() {
		return "Scene_6";
	}
	,__class__: flambe_scene_Scene
});
var flambe_scene_SlideTransition = function(duration,ease) {
	this._direction = 2;
	flambe_scene_TweenTransition.call(this,duration,ease);
};
$hxClasses["flambe.scene.SlideTransition"] = flambe_scene_SlideTransition;
flambe_scene_SlideTransition.__name__ = ["flambe","scene","SlideTransition"];
flambe_scene_SlideTransition.__super__ = flambe_scene_TweenTransition;
flambe_scene_SlideTransition.prototype = $extend(flambe_scene_TweenTransition.prototype,{
	left: function() {
		this._direction = 2;
		return this;
	}
	,init: function(director,from,to) {
		flambe_scene_TweenTransition.prototype.init.call(this,director,from,to);
		var _g = this._direction;
		switch(_g) {
		case 0:
			this._x = 0;
			this._y = -this._director.get_height();
			break;
		case 1:
			this._x = 0;
			this._y = this._director.get_height();
			break;
		case 2:
			this._x = -this._director.get_width();
			this._y = 0;
			break;
		case 3:
			this._x = this._director.get_width();
			this._y = 0;
			break;
		}
		var sprite;
		var component = this._from.getComponent("Sprite_2");
		sprite = component;
		if(sprite == null) this._from.add(sprite = new flambe_display_Sprite());
		sprite.setXY(0,0);
		var sprite1;
		var component1 = this._to.getComponent("Sprite_2");
		sprite1 = component1;
		if(sprite1 == null) this._to.add(sprite1 = new flambe_display_Sprite());
		sprite1.setXY(-this._x,-this._y);
	}
	,update: function(dt) {
		var done = flambe_scene_TweenTransition.prototype.update.call(this,dt);
		((function($this) {
			var $r;
			var component = $this._from.getComponent("Sprite_2");
			$r = component;
			return $r;
		}(this))).setXY(this.interp(0,this._x),this.interp(0,this._y));
		((function($this) {
			var $r;
			var component1 = $this._to.getComponent("Sprite_2");
			$r = component1;
			return $r;
		}(this))).setXY(this.interp(-this._x,0),this.interp(-this._y,0));
		return done;
	}
	,complete: function() {
		((function($this) {
			var $r;
			var component = $this._from.getComponent("Sprite_2");
			$r = component;
			return $r;
		}(this))).setXY(0,0);
		((function($this) {
			var $r;
			var component1 = $this._to.getComponent("Sprite_2");
			$r = component1;
			return $r;
		}(this))).setXY(0,0);
	}
	,__class__: flambe_scene_SlideTransition
});
var flambe_script_Action = function() { };
$hxClasses["flambe.script.Action"] = flambe_script_Action;
flambe_script_Action.__name__ = ["flambe","script","Action"];
flambe_script_Action.prototype = {
	__class__: flambe_script_Action
};
var flambe_script_AnimateTo = function(value,to,seconds,easing) {
	this._value = value;
	this._to = to;
	this._seconds = seconds;
	this._easing = easing;
};
$hxClasses["flambe.script.AnimateTo"] = flambe_script_AnimateTo;
flambe_script_AnimateTo.__name__ = ["flambe","script","AnimateTo"];
flambe_script_AnimateTo.__interfaces__ = [flambe_script_Action];
flambe_script_AnimateTo.prototype = {
	update: function(dt,actor) {
		if(this._tween == null) {
			this._tween = new flambe_animation_Tween(this._value.get__(),this._to,this._seconds,this._easing);
			this._value.set_behavior(this._tween);
			this._value.update(dt);
		}
		if(this._value.get_behavior() != this._tween) {
			var overtime = this._tween.elapsed - this._seconds;
			this._tween = null;
			if(overtime > 0) return Math.max(0,dt - overtime); else return 0;
		}
		return -1;
	}
	,__class__: flambe_script_AnimateTo
};
var flambe_script_CallFunction = function(fn) {
	this._fn = fn;
};
$hxClasses["flambe.script.CallFunction"] = flambe_script_CallFunction;
flambe_script_CallFunction.__name__ = ["flambe","script","CallFunction"];
flambe_script_CallFunction.__interfaces__ = [flambe_script_Action];
flambe_script_CallFunction.prototype = {
	update: function(dt,actor) {
		this._fn();
		return 0;
	}
	,__class__: flambe_script_CallFunction
};
var flambe_script_Delay = function(seconds) {
	this._duration = seconds;
	this._elapsed = 0;
};
$hxClasses["flambe.script.Delay"] = flambe_script_Delay;
flambe_script_Delay.__name__ = ["flambe","script","Delay"];
flambe_script_Delay.__interfaces__ = [flambe_script_Action];
flambe_script_Delay.prototype = {
	update: function(dt,actor) {
		this._elapsed += dt;
		if(this._elapsed >= this._duration) {
			var overtime = this._elapsed - this._duration;
			this._elapsed = 0;
			return dt - overtime;
		}
		return -1;
	}
	,__class__: flambe_script_Delay
};
var flambe_script_Parallel = function(actions) {
	this._completedActions = [];
	if(actions != null) this._runningActions = actions.slice(); else this._runningActions = [];
};
$hxClasses["flambe.script.Parallel"] = flambe_script_Parallel;
flambe_script_Parallel.__name__ = ["flambe","script","Parallel"];
flambe_script_Parallel.__interfaces__ = [flambe_script_Action];
flambe_script_Parallel.prototype = {
	update: function(dt,actor) {
		var done = true;
		var maxSpent = 0.0;
		var _g1 = 0;
		var _g = this._runningActions.length;
		while(_g1 < _g) {
			var ii = _g1++;
			var action = this._runningActions[ii];
			if(action != null) {
				var spent = action.update(dt,actor);
				if(spent >= 0) {
					this._runningActions[ii] = null;
					this._completedActions.push(action);
					if(spent > maxSpent) maxSpent = spent;
				} else done = false;
			}
		}
		if(done) {
			this._runningActions = this._completedActions;
			this._completedActions = [];
			return maxSpent;
		}
		return -1;
	}
	,__class__: flambe_script_Parallel
};
var flambe_script_Repeat = function(action,count) {
	if(count == null) count = -1;
	this._action = action;
	this._count = count;
	this._remaining = count;
};
$hxClasses["flambe.script.Repeat"] = flambe_script_Repeat;
flambe_script_Repeat.__name__ = ["flambe","script","Repeat"];
flambe_script_Repeat.__interfaces__ = [flambe_script_Action];
flambe_script_Repeat.prototype = {
	update: function(dt,actor) {
		if(this._count == 0) return 0;
		var spent = this._action.update(dt,actor);
		if(this._count > 0 && spent >= 0 && --this._remaining == 0) {
			this._remaining = this._count;
			return spent;
		}
		return -1;
	}
	,__class__: flambe_script_Repeat
};
var flambe_script_Script = function() {
	flambe_Component.call(this);
	this.stopAll();
};
$hxClasses["flambe.script.Script"] = flambe_script_Script;
flambe_script_Script.__name__ = ["flambe","script","Script"];
flambe_script_Script.__super__ = flambe_Component;
flambe_script_Script.prototype = $extend(flambe_Component.prototype,{
	get_name: function() {
		return "Script_5";
	}
	,run: function(action) {
		var handle = new flambe_script__$Script_Handle(action);
		this._handles.push(handle);
		return handle;
	}
	,stopAll: function() {
		this._handles = [];
	}
	,onUpdate: function(dt) {
		var ii = 0;
		while(ii < this._handles.length) {
			var handle = this._handles[ii];
			if(handle.removed || handle.action.update(dt,this.owner) >= 0) this._handles.splice(ii,1); else ++ii;
		}
	}
	,__class__: flambe_script_Script
});
var flambe_script__$Script_Handle = function(action) {
	this.removed = false;
	this.action = action;
};
$hxClasses["flambe.script._Script.Handle"] = flambe_script__$Script_Handle;
flambe_script__$Script_Handle.__name__ = ["flambe","script","_Script","Handle"];
flambe_script__$Script_Handle.__interfaces__ = [flambe_util_Disposable];
flambe_script__$Script_Handle.prototype = {
	dispose: function() {
		this.removed = true;
		this.action = null;
	}
	,__class__: flambe_script__$Script_Handle
};
var flambe_script_Sequence = function(actions) {
	this._idx = 0;
	if(actions != null) this._runningActions = actions.slice(); else this._runningActions = [];
};
$hxClasses["flambe.script.Sequence"] = flambe_script_Sequence;
flambe_script_Sequence.__name__ = ["flambe","script","Sequence"];
flambe_script_Sequence.__interfaces__ = [flambe_script_Action];
flambe_script_Sequence.prototype = {
	add: function(action) {
		this._runningActions.push(action);
	}
	,update: function(dt,actor) {
		var total = 0.0;
		while(true) {
			var action = this._runningActions[this._idx];
			if(action != null) {
				var spent = action.update(dt - total,actor);
				if(spent >= 0) total += spent; else return -1;
			}
			++this._idx;
			if(this._idx >= this._runningActions.length) {
				this._idx = 0;
				break;
			} else if(total > dt) return -1;
		}
		return total;
	}
	,__class__: flambe_script_Sequence
};
var flambe_script_Shake = function(strengthX,strengthY,seconds) {
	this._strengthX = strengthX;
	this._strengthY = strengthY;
	this._duration = seconds;
	this._elapsed = 0;
};
$hxClasses["flambe.script.Shake"] = flambe_script_Shake;
flambe_script_Shake.__name__ = ["flambe","script","Shake"];
flambe_script_Shake.__interfaces__ = [flambe_script_Action];
flambe_script_Shake.prototype = {
	update: function(dt,actor) {
		var sprite;
		var component = actor.getComponent("Sprite_2");
		sprite = component;
		if(this._jitterX == null) {
			this._jitterX = new flambe_animation_Jitter(sprite.x.get__(),this._strengthX);
			this._jitterY = new flambe_animation_Jitter(sprite.y.get__(),this._strengthY);
			sprite.x.set_behavior(this._jitterX);
			sprite.y.set_behavior(this._jitterY);
		}
		this._elapsed += dt;
		if(this._elapsed >= this._duration) {
			var overtime = this._elapsed - this._duration;
			if(sprite.x.get_behavior() == this._jitterX) sprite.x.set__(this._jitterX.base);
			if(sprite.y.get_behavior() == this._jitterY) sprite.y.set__(this._jitterY.base);
			this._jitterX = null;
			this._jitterY = null;
			this._elapsed = 0;
			return dt - overtime;
		}
		return -1;
	}
	,__class__: flambe_script_Shake
};
var flambe_subsystem_RendererType = $hxClasses["flambe.subsystem.RendererType"] = { __ename__ : ["flambe","subsystem","RendererType"], __constructs__ : ["Stage3D","WebGL","Canvas"] };
flambe_subsystem_RendererType.Stage3D = ["Stage3D",0];
flambe_subsystem_RendererType.Stage3D.toString = $estr;
flambe_subsystem_RendererType.Stage3D.__enum__ = flambe_subsystem_RendererType;
flambe_subsystem_RendererType.WebGL = ["WebGL",1];
flambe_subsystem_RendererType.WebGL.toString = $estr;
flambe_subsystem_RendererType.WebGL.__enum__ = flambe_subsystem_RendererType;
flambe_subsystem_RendererType.Canvas = ["Canvas",2];
flambe_subsystem_RendererType.Canvas.toString = $estr;
flambe_subsystem_RendererType.Canvas.__enum__ = flambe_subsystem_RendererType;
var flambe_swf_Symbol = function() { };
$hxClasses["flambe.swf.Symbol"] = flambe_swf_Symbol;
flambe_swf_Symbol.__name__ = ["flambe","swf","Symbol"];
flambe_swf_Symbol.prototype = {
	__class__: flambe_swf_Symbol
};
var flambe_swf_Flipbook = function(name,textures) {
	this.name = name;
	var durationPerFrame = 1 / textures.length;
	this.frames = [];
	var _g = 0;
	while(_g < textures.length) {
		var texture = textures[_g];
		++_g;
		this.frames.push(new flambe_swf_FlipbookFrame(texture,durationPerFrame));
	}
};
$hxClasses["flambe.swf.Flipbook"] = flambe_swf_Flipbook;
flambe_swf_Flipbook.__name__ = ["flambe","swf","Flipbook"];
flambe_swf_Flipbook.prototype = {
	setDuration: function(duration) {
		var durationPerFrame = duration / this.frames.length;
		var _g = 0;
		var _g1 = this.frames;
		while(_g < _g1.length) {
			var frame = _g1[_g];
			++_g;
			frame.duration = durationPerFrame;
		}
		return this;
	}
	,setAnchor: function(x,y) {
		var _g = 0;
		var _g1 = this.frames;
		while(_g < _g1.length) {
			var frame = _g1[_g];
			++_g;
			frame.anchorX = x;
			frame.anchorY = y;
		}
		return this;
	}
	,__class__: flambe_swf_Flipbook
};
var flambe_swf_FlipbookFrame = function(texture,duration) {
	this.label = null;
	this.anchorY = 0;
	this.anchorX = 0;
	this.texture = texture;
	this.duration = duration;
};
$hxClasses["flambe.swf.FlipbookFrame"] = flambe_swf_FlipbookFrame;
flambe_swf_FlipbookFrame.__name__ = ["flambe","swf","FlipbookFrame"];
flambe_swf_FlipbookFrame.prototype = {
	toSymbol: function() {
		return new flambe_swf__$Flipbook_FrameSymbol(this);
	}
	,__class__: flambe_swf_FlipbookFrame
};
var flambe_swf__$Flipbook_FrameSymbol = function(frame) {
	this._texture = frame.texture;
	this._anchorX = frame.anchorX;
	this._anchorY = frame.anchorY;
};
$hxClasses["flambe.swf._Flipbook.FrameSymbol"] = flambe_swf__$Flipbook_FrameSymbol;
flambe_swf__$Flipbook_FrameSymbol.__name__ = ["flambe","swf","_Flipbook","FrameSymbol"];
flambe_swf__$Flipbook_FrameSymbol.__interfaces__ = [flambe_swf_Symbol];
flambe_swf__$Flipbook_FrameSymbol.prototype = {
	createSprite: function() {
		var sprite = new flambe_display_ImageSprite(this._texture);
		sprite.setAnchor(this._anchorX,this._anchorY);
		return sprite;
	}
	,__class__: flambe_swf__$Flipbook_FrameSymbol
};
var flambe_swf_Library = function() { };
$hxClasses["flambe.swf.Library"] = flambe_swf_Library;
flambe_swf_Library.__name__ = ["flambe","swf","Library"];
flambe_swf_Library.fromFlipbooks = function(flipbooks) {
	var lib = Type.createEmptyInstance(flambe_swf_Library);
	lib._symbols = new haxe_ds_StringMap();
	lib.frameRate = 60;
	lib._file = null;
	var _g = 0;
	while(_g < flipbooks.length) {
		var flipbook = flipbooks[_g];
		++_g;
		var keyframes = [];
		var _g1 = 0;
		var _g2 = flipbook.frames;
		while(_g1 < _g2.length) {
			var frame = _g2[_g1];
			++_g1;
			keyframes.push({ duration : frame.duration * lib.frameRate, label : frame.label, pivot : [frame.anchorX,frame.anchorY], ref : ""});
		}
		var movie = new flambe_swf_MovieSymbol(lib,{ id : flipbook.name, layers : [{ name : "flipbook", flipbook : true, keyframes : keyframes}]});
		lib._symbols.set(flipbook.name,movie);
		var keyframes1 = movie.layers[0].keyframes;
		var _g21 = 0;
		var _g11 = flipbook.frames.length;
		while(_g21 < _g11) {
			var ii = _g21++;
			keyframes1[ii].setSymbol(flipbook.frames[ii].toSymbol());
		}
	}
	return lib;
};
flambe_swf_Library.prototype = {
	createSprite: function(symbolName,required) {
		if(required == null) required = true;
		var symbol = this._symbols.get(symbolName);
		if(symbol == null) {
			if(required) throw flambe_util_Strings.withFields("Missing symbol",["name",symbolName]);
			return null;
		}
		return symbol.createSprite();
	}
	,createMovie: function(symbolName,required) {
		if(required == null) required = true;
		return this.createSprite(symbolName,required);
	}
	,__class__: flambe_swf_Library
};
var flambe_swf_MovieSprite = function(symbol) {
	this._looped = null;
	flambe_display_Sprite.call(this);
	this.symbol = symbol;
	this.speed = new flambe_animation_AnimatedFloat(1);
	this._animators = flambe_util_Arrays.create(symbol.layers.length);
	var _g1 = 0;
	var _g = this._animators.length;
	while(_g1 < _g) {
		var ii = _g1++;
		var layer = symbol.layers[ii];
		this._animators[ii] = new flambe_swf__$MovieSprite_LayerAnimator(layer);
	}
	this._frame = 0;
	this._position = 0;
	this["goto"](1);
};
$hxClasses["flambe.swf.MovieSprite"] = flambe_swf_MovieSprite;
flambe_swf_MovieSprite.__name__ = ["flambe","swf","MovieSprite"];
flambe_swf_MovieSprite.__super__ = flambe_display_Sprite;
flambe_swf_MovieSprite.prototype = $extend(flambe_display_Sprite.prototype,{
	onAdded: function() {
		flambe_display_Sprite.prototype.onAdded.call(this);
		var _g = 0;
		var _g1 = this._animators;
		while(_g < _g1.length) {
			var animator = _g1[_g];
			++_g;
			this.owner.addChild(animator.content);
		}
	}
	,onRemoved: function() {
		flambe_display_Sprite.prototype.onRemoved.call(this);
		var _g = 0;
		var _g1 = this._animators;
		while(_g < _g1.length) {
			var animator = _g1[_g];
			++_g;
			this.owner.removeChild(animator.content);
		}
	}
	,onUpdate: function(dt) {
		flambe_display_Sprite.prototype.onUpdate.call(this,dt);
		this.speed.update(dt);
		var _g = this._flags & (128 | 256);
		switch(_g) {
		case 0:
			this._position += this.speed.get__() * dt;
			if(this._position > this.symbol.duration) {
				this._position = this._position % this.symbol.duration;
				if(this._looped != null) this._looped.emit();
			}
			break;
		case 256:
			this._flags = flambe_util_BitSets.remove(this._flags,256);
			break;
		}
		var newFrame = this._position * this.symbol.frameRate;
		this["goto"](newFrame);
	}
	,'goto': function(newFrame) {
		if(this._frame == newFrame) return;
		var wrapped = newFrame < this._frame;
		if(wrapped) {
			var _g = 0;
			var _g1 = this._animators;
			while(_g < _g1.length) {
				var animator = _g1[_g];
				++_g;
				animator.needsKeyframeUpdate = true;
				animator.keyframeIdx = 0;
			}
		}
		var _g2 = 0;
		var _g11 = this._animators;
		while(_g2 < _g11.length) {
			var animator1 = _g11[_g2];
			++_g2;
			animator1.composeFrame(newFrame);
		}
		this._frame = newFrame;
	}
	,get_looped: function() {
		if(this._looped == null) this._looped = new flambe_util_Signal0();
		return this._looped;
	}
	,rewind: function() {
		this._position = 0;
		this._flags = flambe_util_BitSets.add(this._flags,256);
	}
	,__class__: flambe_swf_MovieSprite
	,__properties__: $extend(flambe_display_Sprite.prototype.__properties__,{get_looped:"get_looped"})
});
var flambe_swf__$MovieSprite_LayerAnimator = function(layer) {
	this.keyframeIdx = 0;
	this.needsKeyframeUpdate = false;
	this.layer = layer;
	this.content = new flambe_Entity();
	if(layer.empty) this._sprites = null; else {
		this._sprites = flambe_util_Arrays.create(layer.keyframes.length);
		var _g1 = 0;
		var _g = this._sprites.length;
		while(_g1 < _g) {
			var ii = _g1++;
			var kf = layer.keyframes[ii];
			if(ii > 0 && layer.keyframes[ii - 1].symbol == kf.symbol) this._sprites[ii] = this._sprites[ii - 1]; else if(kf.symbol == null) this._sprites[ii] = new flambe_display_Sprite(); else this._sprites[ii] = kf.symbol.createSprite();
		}
		this.content.add(this._sprites[0]);
	}
};
$hxClasses["flambe.swf._MovieSprite.LayerAnimator"] = flambe_swf__$MovieSprite_LayerAnimator;
flambe_swf__$MovieSprite_LayerAnimator.__name__ = ["flambe","swf","_MovieSprite","LayerAnimator"];
flambe_swf__$MovieSprite_LayerAnimator.prototype = {
	composeFrame: function(frame) {
		if(this._sprites == null) return;
		var keyframes = this.layer.keyframes;
		var finalFrame = keyframes.length - 1;
		if(frame > this.layer.frames) {
			((function($this) {
				var $r;
				var component = $this.content.getComponent("Sprite_2");
				$r = component;
				return $r;
			}(this))).set_visible(false);
			this.keyframeIdx = finalFrame;
			this.needsKeyframeUpdate = true;
			return;
		}
		while(this.keyframeIdx < finalFrame && keyframes[this.keyframeIdx + 1].index <= frame) {
			++this.keyframeIdx;
			this.needsKeyframeUpdate = true;
		}
		var sprite;
		if(this.needsKeyframeUpdate) {
			this.needsKeyframeUpdate = false;
			sprite = this._sprites[this.keyframeIdx];
			if(sprite != (function($this) {
				var $r;
				var component1 = $this.content.getComponent("Sprite_2");
				$r = component1;
				return $r;
			}(this))) {
				if(Type.getClass(sprite) == flambe_swf_MovieSprite) {
					var movie = sprite;
					movie.rewind();
				}
				this.content.add(sprite);
			}
		} else {
			var component2 = this.content.getComponent("Sprite_2");
			sprite = component2;
		}
		var kf = keyframes[this.keyframeIdx];
		var visible = kf.visible && kf.symbol != null;
		sprite.set_visible(visible);
		if(!visible) return;
		var x = kf.x;
		var y = kf.y;
		var scaleX = kf.scaleX;
		var scaleY = kf.scaleY;
		var skewX = kf.skewX;
		var skewY = kf.skewY;
		var alpha = kf.alpha;
		if(kf.tweened && this.keyframeIdx < finalFrame) {
			var interp = (frame - kf.index) / kf.duration;
			var ease = kf.ease;
			if(ease != 0) {
				var t;
				if(ease < 0) {
					var inv = 1 - interp;
					t = 1 - inv * inv;
					ease = -ease;
				} else t = interp * interp;
				interp = ease * t + (1 - ease) * interp;
			}
			var nextKf = keyframes[this.keyframeIdx + 1];
			x += (nextKf.x - x) * interp;
			y += (nextKf.y - y) * interp;
			scaleX += (nextKf.scaleX - scaleX) * interp;
			scaleY += (nextKf.scaleY - scaleY) * interp;
			skewX += (nextKf.skewX - skewX) * interp;
			skewY += (nextKf.skewY - skewY) * interp;
			alpha += (nextKf.alpha - alpha) * interp;
		}
		var matrix = sprite.getLocalMatrix();
		var sinX = Math.sin(skewX);
		var cosX = Math.cos(skewX);
		var sinY = Math.sin(skewY);
		var cosY = Math.cos(skewY);
		matrix.set(cosY * scaleX,sinY * scaleX,-sinX * scaleY,cosX * scaleY,x,y);
		matrix.translate(-kf.pivotX,-kf.pivotY);
		sprite.alpha.set__(alpha);
	}
	,__class__: flambe_swf__$MovieSprite_LayerAnimator
};
var flambe_swf_MovieSymbol = function(lib,json) {
	this._name = json.id;
	this.frameRate = lib.frameRate;
	this.frames = 0.0;
	this.layers = flambe_util_Arrays.create(json.layers.length);
	var _g1 = 0;
	var _g = this.layers.length;
	while(_g1 < _g) {
		var ii = _g1++;
		var layer = new flambe_swf_MovieLayer(json.layers[ii]);
		this.frames = Math.max(layer.frames,this.frames);
		this.layers[ii] = layer;
	}
	this.duration = this.frames / this.frameRate;
};
$hxClasses["flambe.swf.MovieSymbol"] = flambe_swf_MovieSymbol;
flambe_swf_MovieSymbol.__name__ = ["flambe","swf","MovieSymbol"];
flambe_swf_MovieSymbol.__interfaces__ = [flambe_swf_Symbol];
flambe_swf_MovieSymbol.prototype = {
	createSprite: function() {
		return new flambe_swf_MovieSprite(this);
	}
	,__class__: flambe_swf_MovieSymbol
};
var flambe_swf_MovieLayer = function(json) {
	this.empty = true;
	this.name = json.name;
	var prevKf = null;
	this.keyframes = flambe_util_Arrays.create(json.keyframes.length);
	var _g1 = 0;
	var _g = this.keyframes.length;
	while(_g1 < _g) {
		var ii = _g1++;
		prevKf = new flambe_swf_MovieKeyframe(json.keyframes[ii],prevKf);
		this.keyframes[ii] = prevKf;
		this.empty = this.empty && prevKf.symbolName == null;
	}
	if(prevKf != null) this.frames = prevKf.index + prevKf.duration; else this.frames = 0;
};
$hxClasses["flambe.swf.MovieLayer"] = flambe_swf_MovieLayer;
flambe_swf_MovieLayer.__name__ = ["flambe","swf","MovieLayer"];
flambe_swf_MovieLayer.prototype = {
	__class__: flambe_swf_MovieLayer
};
var flambe_swf_MovieKeyframe = function(json,prevKf) {
	this.ease = 0;
	this.tweened = true;
	this.visible = true;
	this.alpha = 1;
	this.pivotY = 0;
	this.pivotX = 0;
	this.skewY = 0;
	this.skewX = 0;
	this.scaleY = 1;
	this.scaleX = 1;
	this.y = 0;
	this.x = 0;
	this.symbol = null;
	if(prevKf != null) this.index = prevKf.index + prevKf.duration; else this.index = 0;
	this.duration = json.duration;
	this.label = json.label;
	this.symbolName = json.ref;
	var loc = json.loc;
	if(loc != null) {
		this.x = loc[0];
		this.y = loc[1];
	}
	var scale = json.scale;
	if(scale != null) {
		this.scaleX = scale[0];
		this.scaleY = scale[1];
	}
	var skew = json.skew;
	if(skew != null) {
		this.skewX = skew[0];
		this.skewY = skew[1];
	}
	var pivot = json.pivot;
	if(pivot != null) {
		this.pivotX = pivot[0];
		this.pivotY = pivot[1];
	}
	if(json.alpha != null) this.alpha = json.alpha;
	if(json.visible != null) this.visible = json.visible;
	if(json.tweened != null) this.tweened = json.tweened;
	if(json.ease != null) this.ease = json.ease;
};
$hxClasses["flambe.swf.MovieKeyframe"] = flambe_swf_MovieKeyframe;
flambe_swf_MovieKeyframe.__name__ = ["flambe","swf","MovieKeyframe"];
flambe_swf_MovieKeyframe.prototype = {
	setSymbol: function(symbol) {
		this.symbol = symbol;
	}
	,__class__: flambe_swf_MovieKeyframe
};
var flambe_util_Arrays = function() { };
$hxClasses["flambe.util.Arrays"] = flambe_util_Arrays;
flambe_util_Arrays.__name__ = ["flambe","util","Arrays"];
flambe_util_Arrays.create = function(length) {
	return new Array(length);
};
var flambe_util_Assert = function() { };
$hxClasses["flambe.util.Assert"] = flambe_util_Assert;
flambe_util_Assert.__name__ = ["flambe","util","Assert"];
flambe_util_Assert.that = function(condition,message,fields) {
	if(!condition) flambe_util_Assert.fail(message,fields);
};
flambe_util_Assert.fail = function(message,fields) {
	var error = "Assertion failed!";
	if(message != null) error += " " + message;
	if(fields != null) error = flambe_util_Strings.withFields(error,fields);
	throw error;
};
var flambe_util_BitSets = function() { };
$hxClasses["flambe.util.BitSets"] = flambe_util_BitSets;
flambe_util_BitSets.__name__ = ["flambe","util","BitSets"];
flambe_util_BitSets.add = function(bits,mask) {
	return bits | mask;
};
flambe_util_BitSets.remove = function(bits,mask) {
	return bits & ~mask;
};
flambe_util_BitSets.contains = function(bits,mask) {
	return (bits & mask) != 0;
};
flambe_util_BitSets.containsAll = function(bits,mask) {
	return (bits & mask) == mask;
};
flambe_util_BitSets.set = function(bits,mask,enabled) {
	if(enabled) return flambe_util_BitSets.add(bits,mask); else return flambe_util_BitSets.remove(bits,mask);
};
var flambe_util_Config = function() {
	this.mainSection = new haxe_ds_StringMap();
	this.sections = new haxe_ds_StringMap();
};
$hxClasses["flambe.util.Config"] = flambe_util_Config;
flambe_util_Config.__name__ = ["flambe","util","Config"];
flambe_util_Config.parse = function(text) {
	var config = new flambe_util_Config();
	var commentPattern = new EReg("^\\s*;","");
	var sectionPattern = new EReg("^\\s*\\[\\s*([^\\]]*)\\s*\\]","");
	var pairPattern = new EReg("^\\s*([\\w\\.\\-_]+)\\s*=\\s*(.*)","");
	var currentSection = config.mainSection;
	var _g = 0;
	var _g1 = new EReg("\r\n|\r|\n","g").split(text);
	while(_g < _g1.length) {
		var line = _g1[_g];
		++_g;
		if(commentPattern.match(line)) {
		} else if(sectionPattern.match(line)) {
			var name = sectionPattern.matched(1);
			if(config.sections.exists(name)) currentSection = config.sections.get(name); else {
				currentSection = new haxe_ds_StringMap();
				config.sections.set(name,currentSection);
			}
		} else if(pairPattern.match(line)) {
			var key = pairPattern.matched(1);
			var value = pairPattern.matched(2);
			var quote = StringTools.fastCodeAt(value,0);
			if((quote == 34 || quote == 39) && StringTools.fastCodeAt(value,value.length - 1) == quote) value = HxOverrides.substr(value,1,value.length - 2);
			var value1 = StringTools.replace(StringTools.replace(StringTools.replace(StringTools.replace(StringTools.replace(StringTools.replace(value,"\\n","\n"),"\\r","\r"),"\\t","\t"),"\\'","'"),"\\\"","\""),"\\\\","\\");
			currentSection.set(key,value1);
		}
	}
	return config;
};
flambe_util_Config.prototype = {
	__class__: flambe_util_Config
};
var flambe_util_LogLevel = $hxClasses["flambe.util.LogLevel"] = { __ename__ : ["flambe","util","LogLevel"], __constructs__ : ["Info","Warn","Error"] };
flambe_util_LogLevel.Info = ["Info",0];
flambe_util_LogLevel.Info.toString = $estr;
flambe_util_LogLevel.Info.__enum__ = flambe_util_LogLevel;
flambe_util_LogLevel.Warn = ["Warn",1];
flambe_util_LogLevel.Warn.toString = $estr;
flambe_util_LogLevel.Warn.__enum__ = flambe_util_LogLevel;
flambe_util_LogLevel.Error = ["Error",2];
flambe_util_LogLevel.Error.toString = $estr;
flambe_util_LogLevel.Error.__enum__ = flambe_util_LogLevel;
var flambe_util_MessageBundle = function(config) {
	this.config = config;
	this.missingTranslation = new flambe_util_Signal1();
};
$hxClasses["flambe.util.MessageBundle"] = flambe_util_MessageBundle;
flambe_util_MessageBundle.__name__ = ["flambe","util","MessageBundle"];
flambe_util_MessageBundle.parse = function(text) {
	return new flambe_util_MessageBundle(flambe_util_Config.parse(text));
};
flambe_util_MessageBundle.prototype = {
	__class__: flambe_util_MessageBundle
};
var flambe_util_Promise = function() {
	this.success = new flambe_util_Signal1();
	this.error = new flambe_util_Signal1();
	this.progressChanged = new flambe_util_Signal0();
	this.hasResult = false;
	this._progress = 0;
	this._total = 0;
};
$hxClasses["flambe.util.Promise"] = flambe_util_Promise;
flambe_util_Promise.__name__ = ["flambe","util","Promise"];
flambe_util_Promise.prototype = {
	set_result: function(result) {
		if(this.hasResult) throw "Promise result already assigned";
		this._result = result;
		this.hasResult = true;
		this.success.emit(result);
		return result;
	}
	,get: function(fn) {
		if(this.hasResult) {
			fn(this._result);
			return null;
		}
		return this.success.connect(fn).once();
	}
	,get_progress: function() {
		return this._progress;
	}
	,set_progress: function(progress) {
		if(this._progress != progress) {
			this._progress = progress;
			this.progressChanged.emit();
		}
		return progress;
	}
	,set_total: function(total) {
		if(this._total != total) {
			this._total = total;
			this.progressChanged.emit();
		}
		return total;
	}
	,get_total: function() {
		return this._total;
	}
	,__class__: flambe_util_Promise
	,__properties__: {get_total:"get_total",set_total:"set_total",set_progress:"set_progress",get_progress:"get_progress",set_result:"set_result"}
};
var flambe_util_Signal0 = function(listener) {
	flambe_util_SignalBase.call(this,listener);
};
$hxClasses["flambe.util.Signal0"] = flambe_util_Signal0;
flambe_util_Signal0.__name__ = ["flambe","util","Signal0"];
flambe_util_Signal0.__super__ = flambe_util_SignalBase;
flambe_util_Signal0.prototype = $extend(flambe_util_SignalBase.prototype,{
	connect: function(listener,prioritize) {
		if(prioritize == null) prioritize = false;
		return this.connectImpl(listener,prioritize);
	}
	,emit: function() {
		var _g = this;
		if(this.dispatching()) this.defer(function() {
			_g.emitImpl();
		}); else this.emitImpl();
	}
	,emitImpl: function() {
		var head = this.willEmit();
		var p = head;
		while(p != null) {
			p._listener();
			if(!p.stayInList) p.dispose();
			p = p._next;
		}
		this.didEmit(head);
	}
	,__class__: flambe_util_Signal0
});
var flambe_util__$SignalBase_Task = function(fn) {
	this.next = null;
	this.fn = fn;
};
$hxClasses["flambe.util._SignalBase.Task"] = flambe_util__$SignalBase_Task;
flambe_util__$SignalBase_Task.__name__ = ["flambe","util","_SignalBase","Task"];
flambe_util__$SignalBase_Task.prototype = {
	__class__: flambe_util__$SignalBase_Task
};
var flambe_util_Strings = function() { };
$hxClasses["flambe.util.Strings"] = flambe_util_Strings;
flambe_util_Strings.__name__ = ["flambe","util","Strings"];
flambe_util_Strings.getFileExtension = function(fileName) {
	var dot = fileName.lastIndexOf(".");
	if(dot > 0) return HxOverrides.substr(fileName,dot + 1,null); else return null;
};
flambe_util_Strings.removeFileExtension = function(fileName) {
	var dot = fileName.lastIndexOf(".");
	if(dot > 0) return HxOverrides.substr(fileName,0,dot); else return fileName;
};
flambe_util_Strings.getUrlExtension = function(url) {
	var question = url.lastIndexOf("?");
	if(question >= 0) url = HxOverrides.substr(url,0,question);
	var slash = url.lastIndexOf("/");
	if(slash >= 0) url = HxOverrides.substr(url,slash + 1,null);
	return flambe_util_Strings.getFileExtension(url);
};
flambe_util_Strings.joinPath = function(base,relative) {
	if(base.length > 0 && StringTools.fastCodeAt(base,base.length - 1) != 47) base += "/";
	return base + relative;
};
flambe_util_Strings.withFields = function(message,fields) {
	var ll = fields.length;
	if(ll > 0) {
		if(message.length > 0) message += " ["; else message += "[";
		var ii = 0;
		while(ii < ll) {
			if(ii > 0) message += ", ";
			var name = fields[ii];
			var value = fields[ii + 1];
			if(Std["is"](value,Error)) {
				var stack = value.stack;
				if(stack != null) value = stack;
			}
			message += name + "=" + Std.string(value);
			ii += 2;
		}
		message += "]";
	}
	return message;
};
var haxe_Log = function() { };
$hxClasses["haxe.Log"] = haxe_Log;
haxe_Log.__name__ = ["haxe","Log"];
haxe_Log.trace = function(v,infos) {
	js_Boot.__trace(v,infos);
};
var haxe_Serializer = function() {
	this.buf = new StringBuf();
	this.cache = new Array();
	this.useCache = haxe_Serializer.USE_CACHE;
	this.useEnumIndex = haxe_Serializer.USE_ENUM_INDEX;
	this.shash = new haxe_ds_StringMap();
	this.scount = 0;
};
$hxClasses["haxe.Serializer"] = haxe_Serializer;
haxe_Serializer.__name__ = ["haxe","Serializer"];
haxe_Serializer.prototype = {
	toString: function() {
		return this.buf.toString();
	}
	,serializeString: function(s) {
		var x = this.shash.get(s);
		if(x != null) {
			this.buf.add("R");
			this.buf.add(x);
			return;
		}
		this.shash.set(s,this.scount++);
		this.buf.add("y");
		s = StringTools.urlEncode(s);
		this.buf.add(s.length);
		this.buf.add(":");
		this.buf.add(s);
	}
	,serializeRef: function(v) {
		var vt = typeof(v);
		var _g1 = 0;
		var _g = this.cache.length;
		while(_g1 < _g) {
			var i = _g1++;
			var ci = this.cache[i];
			if(typeof(ci) == vt && ci == v) {
				this.buf.add("r");
				this.buf.add(i);
				return true;
			}
		}
		this.cache.push(v);
		return false;
	}
	,serializeFields: function(v) {
		var _g = 0;
		var _g1 = Reflect.fields(v);
		while(_g < _g1.length) {
			var f = _g1[_g];
			++_g;
			this.serializeString(f);
			this.serialize(Reflect.field(v,f));
		}
		this.buf.add("g");
	}
	,serialize: function(v) {
		{
			var _g = Type["typeof"](v);
			switch(Type.enumIndex(_g)) {
			case 0:
				this.buf.add("n");
				break;
			case 1:
				var v1 = v;
				if(v1 == 0) {
					this.buf.add("z");
					return;
				}
				this.buf.add("i");
				this.buf.add(v1);
				break;
			case 2:
				var v2 = v;
				if(Math.isNaN(v2)) this.buf.add("k"); else if(!Math.isFinite(v2)) this.buf.add(v2 < 0?"m":"p"); else {
					this.buf.add("d");
					this.buf.add(v2);
				}
				break;
			case 3:
				this.buf.add(v?"t":"f");
				break;
			case 6:
				var c = _g[2];
				if(c == String) {
					this.serializeString(v);
					return;
				}
				if(this.useCache && this.serializeRef(v)) return;
				switch(c) {
				case Array:
					var ucount = 0;
					this.buf.add("a");
					var l = v.length;
					var _g1 = 0;
					while(_g1 < l) {
						var i = _g1++;
						if(v[i] == null) ucount++; else {
							if(ucount > 0) {
								if(ucount == 1) this.buf.add("n"); else {
									this.buf.add("u");
									this.buf.add(ucount);
								}
								ucount = 0;
							}
							this.serialize(v[i]);
						}
					}
					if(ucount > 0) {
						if(ucount == 1) this.buf.add("n"); else {
							this.buf.add("u");
							this.buf.add(ucount);
						}
					}
					this.buf.add("h");
					break;
				case List:
					this.buf.add("l");
					var v3 = v;
					var $it0 = v3.iterator();
					while( $it0.hasNext() ) {
						var i1 = $it0.next();
						this.serialize(i1);
					}
					this.buf.add("h");
					break;
				case Date:
					var d = v;
					this.buf.add("v");
					this.buf.add(HxOverrides.dateStr(d));
					break;
				case haxe_ds_StringMap:
					this.buf.add("b");
					var v4 = v;
					var $it1 = v4.keys();
					while( $it1.hasNext() ) {
						var k = $it1.next();
						this.serializeString(k);
						this.serialize(v4.get(k));
					}
					this.buf.add("h");
					break;
				case haxe_ds_IntMap:
					this.buf.add("q");
					var v5 = v;
					var $it2 = v5.keys();
					while( $it2.hasNext() ) {
						var k1 = $it2.next();
						this.buf.add(":");
						this.buf.add(k1);
						this.serialize(v5.get(k1));
					}
					this.buf.add("h");
					break;
				case haxe_ds_ObjectMap:
					this.buf.add("M");
					var v6 = v;
					var $it3 = v6.keys();
					while( $it3.hasNext() ) {
						var k2 = $it3.next();
						var id = Reflect.field(k2,"__id__");
						Reflect.deleteField(k2,"__id__");
						this.serialize(k2);
						Reflect.setField(k2,"__id__",id);
						this.serialize(v6.get(k2));
					}
					this.buf.add("h");
					break;
				case haxe_io_Bytes:
					var v7 = v;
					var i2 = 0;
					var max = v7.length - 2;
					var charsBuf = new StringBuf();
					var b64 = haxe_Serializer.BASE64;
					while(i2 < max) {
						var b1 = v7.get(i2++);
						var b2 = v7.get(i2++);
						var b3 = v7.get(i2++);
						charsBuf.add(b64.charAt(b1 >> 2));
						charsBuf.add(b64.charAt((b1 << 4 | b2 >> 4) & 63));
						charsBuf.add(b64.charAt((b2 << 2 | b3 >> 6) & 63));
						charsBuf.add(b64.charAt(b3 & 63));
					}
					if(i2 == max) {
						var b11 = v7.get(i2++);
						var b21 = v7.get(i2++);
						charsBuf.add(b64.charAt(b11 >> 2));
						charsBuf.add(b64.charAt((b11 << 4 | b21 >> 4) & 63));
						charsBuf.add(b64.charAt(b21 << 2 & 63));
					} else if(i2 == max + 1) {
						var b12 = v7.get(i2++);
						charsBuf.add(b64.charAt(b12 >> 2));
						charsBuf.add(b64.charAt(b12 << 4 & 63));
					}
					var chars = charsBuf.toString();
					this.buf.add("s");
					this.buf.add(chars.length);
					this.buf.add(":");
					this.buf.add(chars);
					break;
				default:
					if(this.useCache) this.cache.pop();
					if(v.hxSerialize != null) {
						this.buf.add("C");
						this.serializeString(Type.getClassName(c));
						if(this.useCache) this.cache.push(v);
						v.hxSerialize(this);
						this.buf.add("g");
					} else {
						this.buf.add("c");
						this.serializeString(Type.getClassName(c));
						if(this.useCache) this.cache.push(v);
						this.serializeFields(v);
					}
				}
				break;
			case 4:
				if(this.useCache && this.serializeRef(v)) return;
				this.buf.add("o");
				this.serializeFields(v);
				break;
			case 7:
				var e = _g[2];
				if(this.useCache) {
					if(this.serializeRef(v)) return;
					this.cache.pop();
				}
				this.buf.add(this.useEnumIndex?"j":"w");
				this.serializeString(Type.getEnumName(e));
				if(this.useEnumIndex) {
					this.buf.add(":");
					this.buf.add(v[1]);
				} else this.serializeString(v[0]);
				this.buf.add(":");
				var l1 = v.length;
				this.buf.add(l1 - 2);
				var _g11 = 2;
				while(_g11 < l1) {
					var i3 = _g11++;
					this.serialize(v[i3]);
				}
				if(this.useCache) this.cache.push(v);
				break;
			case 5:
				throw "Cannot serialize function";
				break;
			default:
				throw "Cannot serialize " + Std.string(v);
			}
		}
	}
	,__class__: haxe_Serializer
};
var haxe_Unserializer = function(buf) {
	this.buf = buf;
	this.length = buf.length;
	this.pos = 0;
	this.scache = new Array();
	this.cache = new Array();
	var r = haxe_Unserializer.DEFAULT_RESOLVER;
	if(r == null) {
		r = Type;
		haxe_Unserializer.DEFAULT_RESOLVER = r;
	}
	this.setResolver(r);
};
$hxClasses["haxe.Unserializer"] = haxe_Unserializer;
haxe_Unserializer.__name__ = ["haxe","Unserializer"];
haxe_Unserializer.initCodes = function() {
	var codes = new Array();
	var _g1 = 0;
	var _g = haxe_Unserializer.BASE64.length;
	while(_g1 < _g) {
		var i = _g1++;
		codes[StringTools.fastCodeAt(haxe_Unserializer.BASE64,i)] = i;
	}
	return codes;
};
haxe_Unserializer.run = function(v) {
	return new haxe_Unserializer(v).unserialize();
};
haxe_Unserializer.prototype = {
	setResolver: function(r) {
		if(r == null) this.resolver = { resolveClass : function(_) {
			return null;
		}, resolveEnum : function(_1) {
			return null;
		}}; else this.resolver = r;
	}
	,get: function(p) {
		return StringTools.fastCodeAt(this.buf,p);
	}
	,readDigits: function() {
		var k = 0;
		var s = false;
		var fpos = this.pos;
		while(true) {
			var c = this.get(this.pos);
			if(StringTools.isEof(c)) break;
			if(c == 45) {
				if(this.pos != fpos) break;
				s = true;
				this.pos++;
				continue;
			}
			if(c < 48 || c > 57) break;
			k = k * 10 + (c - 48);
			this.pos++;
		}
		if(s) k *= -1;
		return k;
	}
	,unserializeObject: function(o) {
		while(true) {
			if(this.pos >= this.length) throw "Invalid object";
			if(this.get(this.pos) == 103) break;
			var k = this.unserialize();
			if(!Std["is"](k,String)) throw "Invalid object key";
			var v = this.unserialize();
			Reflect.setField(o,k,v);
		}
		this.pos++;
	}
	,unserializeEnum: function(edecl,tag) {
		if(this.get(this.pos++) != 58) throw "Invalid enum format";
		var nargs = this.readDigits();
		if(nargs == 0) return Type.createEnum(edecl,tag);
		var args = new Array();
		while(nargs-- > 0) args.push(this.unserialize());
		return Type.createEnum(edecl,tag,args);
	}
	,unserialize: function() {
		var _g = this.get(this.pos++);
		switch(_g) {
		case 110:
			return null;
		case 116:
			return true;
		case 102:
			return false;
		case 122:
			return 0;
		case 105:
			return this.readDigits();
		case 100:
			var p1 = this.pos;
			while(true) {
				var c = this.get(this.pos);
				if(c >= 43 && c < 58 || c == 101 || c == 69) this.pos++; else break;
			}
			return Std.parseFloat(HxOverrides.substr(this.buf,p1,this.pos - p1));
		case 121:
			var len = this.readDigits();
			if(this.get(this.pos++) != 58 || this.length - this.pos < len) throw "Invalid string length";
			var s = HxOverrides.substr(this.buf,this.pos,len);
			this.pos += len;
			s = StringTools.urlDecode(s);
			this.scache.push(s);
			return s;
		case 107:
			return Math.NaN;
		case 109:
			return Math.NEGATIVE_INFINITY;
		case 112:
			return Math.POSITIVE_INFINITY;
		case 97:
			var buf = this.buf;
			var a = new Array();
			this.cache.push(a);
			while(true) {
				var c1 = this.get(this.pos);
				if(c1 == 104) {
					this.pos++;
					break;
				}
				if(c1 == 117) {
					this.pos++;
					var n = this.readDigits();
					a[a.length + n - 1] = null;
				} else a.push(this.unserialize());
			}
			return a;
		case 111:
			var o = { };
			this.cache.push(o);
			this.unserializeObject(o);
			return o;
		case 114:
			var n1 = this.readDigits();
			if(n1 < 0 || n1 >= this.cache.length) throw "Invalid reference";
			return this.cache[n1];
		case 82:
			var n2 = this.readDigits();
			if(n2 < 0 || n2 >= this.scache.length) throw "Invalid string reference";
			return this.scache[n2];
		case 120:
			throw this.unserialize();
			break;
		case 99:
			var name = this.unserialize();
			var cl = this.resolver.resolveClass(name);
			if(cl == null) throw "Class not found " + name;
			var o1 = Type.createEmptyInstance(cl);
			this.cache.push(o1);
			this.unserializeObject(o1);
			return o1;
		case 119:
			var name1 = this.unserialize();
			var edecl = this.resolver.resolveEnum(name1);
			if(edecl == null) throw "Enum not found " + name1;
			var e = this.unserializeEnum(edecl,this.unserialize());
			this.cache.push(e);
			return e;
		case 106:
			var name2 = this.unserialize();
			var edecl1 = this.resolver.resolveEnum(name2);
			if(edecl1 == null) throw "Enum not found " + name2;
			this.pos++;
			var index = this.readDigits();
			var tag = Type.getEnumConstructs(edecl1)[index];
			if(tag == null) throw "Unknown enum index " + name2 + "@" + index;
			var e1 = this.unserializeEnum(edecl1,tag);
			this.cache.push(e1);
			return e1;
		case 108:
			var l = new List();
			this.cache.push(l);
			var buf1 = this.buf;
			while(this.get(this.pos) != 104) l.add(this.unserialize());
			this.pos++;
			return l;
		case 98:
			var h = new haxe_ds_StringMap();
			this.cache.push(h);
			var buf2 = this.buf;
			while(this.get(this.pos) != 104) {
				var s1 = this.unserialize();
				h.set(s1,this.unserialize());
			}
			this.pos++;
			return h;
		case 113:
			var h1 = new haxe_ds_IntMap();
			this.cache.push(h1);
			var buf3 = this.buf;
			var c2 = this.get(this.pos++);
			while(c2 == 58) {
				var i = this.readDigits();
				h1.set(i,this.unserialize());
				c2 = this.get(this.pos++);
			}
			if(c2 != 104) throw "Invalid IntMap format";
			return h1;
		case 77:
			var h2 = new haxe_ds_ObjectMap();
			this.cache.push(h2);
			var buf4 = this.buf;
			while(this.get(this.pos) != 104) {
				var s2 = this.unserialize();
				h2.set(s2,this.unserialize());
			}
			this.pos++;
			return h2;
		case 118:
			var d;
			var s3 = HxOverrides.substr(this.buf,this.pos,19);
			d = HxOverrides.strDate(s3);
			this.cache.push(d);
			this.pos += 19;
			return d;
		case 115:
			var len1 = this.readDigits();
			var buf5 = this.buf;
			if(this.get(this.pos++) != 58 || this.length - this.pos < len1) throw "Invalid bytes length";
			var codes = haxe_Unserializer.CODES;
			if(codes == null) {
				codes = haxe_Unserializer.initCodes();
				haxe_Unserializer.CODES = codes;
			}
			var i1 = this.pos;
			var rest = len1 & 3;
			var size;
			size = (len1 >> 2) * 3 + (rest >= 2?rest - 1:0);
			var max = i1 + (len1 - rest);
			var bytes = haxe_io_Bytes.alloc(size);
			var bpos = 0;
			while(i1 < max) {
				var c11 = codes[StringTools.fastCodeAt(buf5,i1++)];
				var c21 = codes[StringTools.fastCodeAt(buf5,i1++)];
				bytes.set(bpos++,c11 << 2 | c21 >> 4);
				var c3 = codes[StringTools.fastCodeAt(buf5,i1++)];
				bytes.set(bpos++,c21 << 4 | c3 >> 2);
				var c4 = codes[StringTools.fastCodeAt(buf5,i1++)];
				bytes.set(bpos++,c3 << 6 | c4);
			}
			if(rest >= 2) {
				var c12 = codes[StringTools.fastCodeAt(buf5,i1++)];
				var c22 = codes[StringTools.fastCodeAt(buf5,i1++)];
				bytes.set(bpos++,c12 << 2 | c22 >> 4);
				if(rest == 3) {
					var c31 = codes[StringTools.fastCodeAt(buf5,i1++)];
					bytes.set(bpos++,c22 << 4 | c31 >> 2);
				}
			}
			this.pos += len1;
			this.cache.push(bytes);
			return bytes;
		case 67:
			var name3 = this.unserialize();
			var cl1 = this.resolver.resolveClass(name3);
			if(cl1 == null) throw "Class not found " + name3;
			var o2 = Type.createEmptyInstance(cl1);
			this.cache.push(o2);
			o2.hxUnserialize(this);
			if(this.get(this.pos++) != 103) throw "Invalid custom data";
			return o2;
		default:
		}
		this.pos--;
		throw "Invalid char " + this.buf.charAt(this.pos) + " at position " + this.pos;
	}
	,__class__: haxe_Unserializer
};
var haxe_ds_IntMap = function() {
	this.h = { };
};
$hxClasses["haxe.ds.IntMap"] = haxe_ds_IntMap;
haxe_ds_IntMap.__name__ = ["haxe","ds","IntMap"];
haxe_ds_IntMap.__interfaces__ = [IMap];
haxe_ds_IntMap.prototype = {
	set: function(key,value) {
		this.h[key] = value;
	}
	,get: function(key) {
		return this.h[key];
	}
	,exists: function(key) {
		return this.h.hasOwnProperty(key);
	}
	,remove: function(key) {
		if(!this.h.hasOwnProperty(key)) return false;
		delete(this.h[key]);
		return true;
	}
	,keys: function() {
		var a = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) a.push(key | 0);
		}
		return HxOverrides.iter(a);
	}
	,__class__: haxe_ds_IntMap
};
var haxe_ds_ObjectMap = function() {
	this.h = { };
	this.h.__keys__ = { };
};
$hxClasses["haxe.ds.ObjectMap"] = haxe_ds_ObjectMap;
haxe_ds_ObjectMap.__name__ = ["haxe","ds","ObjectMap"];
haxe_ds_ObjectMap.__interfaces__ = [IMap];
haxe_ds_ObjectMap.assignId = function(obj) {
	return obj.__id__ = ++haxe_ds_ObjectMap.count;
};
haxe_ds_ObjectMap.getId = function(obj) {
	return obj.__id__;
};
haxe_ds_ObjectMap.prototype = {
	set: function(key,value) {
		var id = key.__id__ || haxe_ds_ObjectMap.assignId(key);
		this.h[id] = value;
		this.h.__keys__[id] = key;
	}
	,get: function(key) {
		return this.h[haxe_ds_ObjectMap.getId(key)];
	}
	,keys: function() {
		var a = [];
		for( var key in this.h.__keys__ ) {
		if(this.h.hasOwnProperty(key)) a.push(this.h.__keys__[key]);
		}
		return HxOverrides.iter(a);
	}
	,__class__: haxe_ds_ObjectMap
};
var haxe_ds_StringMap = function() {
	this.h = { };
};
$hxClasses["haxe.ds.StringMap"] = haxe_ds_StringMap;
haxe_ds_StringMap.__name__ = ["haxe","ds","StringMap"];
haxe_ds_StringMap.__interfaces__ = [IMap];
haxe_ds_StringMap.prototype = {
	set: function(key,value) {
		this.h["$" + key] = value;
	}
	,get: function(key) {
		return this.h["$" + key];
	}
	,exists: function(key) {
		return this.h.hasOwnProperty("$" + key);
	}
	,keys: function() {
		var a = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) a.push(key.substr(1));
		}
		return HxOverrides.iter(a);
	}
	,iterator: function() {
		return { ref : this.h, it : this.keys(), hasNext : function() {
			return this.it.hasNext();
		}, next : function() {
			var i = this.it.next();
			return this.ref["$" + i];
		}};
	}
	,__class__: haxe_ds_StringMap
};
var haxe_io_Bytes = function(length,b) {
	this.length = length;
	this.b = b;
};
$hxClasses["haxe.io.Bytes"] = haxe_io_Bytes;
haxe_io_Bytes.__name__ = ["haxe","io","Bytes"];
haxe_io_Bytes.alloc = function(length) {
	var a = new Array();
	var _g = 0;
	while(_g < length) {
		var i = _g++;
		a.push(0);
	}
	return new haxe_io_Bytes(length,a);
};
haxe_io_Bytes.prototype = {
	get: function(pos) {
		return this.b[pos];
	}
	,set: function(pos,v) {
		this.b[pos] = v & 255;
	}
	,__class__: haxe_io_Bytes
};
var haxe_io_Eof = function() { };
$hxClasses["haxe.io.Eof"] = haxe_io_Eof;
haxe_io_Eof.__name__ = ["haxe","io","Eof"];
haxe_io_Eof.prototype = {
	toString: function() {
		return "Eof";
	}
	,__class__: haxe_io_Eof
};
var haxe_rtti_Meta = function() { };
$hxClasses["haxe.rtti.Meta"] = haxe_rtti_Meta;
haxe_rtti_Meta.__name__ = ["haxe","rtti","Meta"];
haxe_rtti_Meta.getType = function(t) {
	var meta = t.__meta__;
	if(meta == null || meta.obj == null) return { }; else return meta.obj;
};
var js_Boot = function() { };
$hxClasses["js.Boot"] = js_Boot;
js_Boot.__name__ = ["js","Boot"];
js_Boot.__unhtml = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
};
js_Boot.__trace = function(v,i) {
	var msg;
	if(i != null) msg = i.fileName + ":" + i.lineNumber + ": "; else msg = "";
	msg += js_Boot.__string_rec(v,"");
	if(i != null && i.customParams != null) {
		var _g = 0;
		var _g1 = i.customParams;
		while(_g < _g1.length) {
			var v1 = _g1[_g];
			++_g;
			msg += "," + js_Boot.__string_rec(v1,"");
		}
	}
	var d;
	if(typeof(document) != "undefined" && (d = document.getElementById("haxe:trace")) != null) d.innerHTML += js_Boot.__unhtml(msg) + "<br/>"; else if(typeof console != "undefined" && console.log != null) console.log(msg);
};
js_Boot.isClass = function(o) {
	return o.__name__;
};
js_Boot.isEnum = function(e) {
	return e.__ename__;
};
js_Boot.getClass = function(o) {
	if(Std["is"](o,Array)) return Array; else return o.__class__;
};
js_Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (js_Boot.isClass(o) || js_Boot.isEnum(o))) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str = o[0] + "(";
				s += "\t";
				var _g1 = 2;
				var _g = o.length;
				while(_g1 < _g) {
					var i = _g1++;
					if(i != 2) str += "," + js_Boot.__string_rec(o[i],s); else str += js_Boot.__string_rec(o[i],s);
				}
				return str + ")";
			}
			var l = o.length;
			var i1;
			var str1 = "[";
			s += "\t";
			var _g2 = 0;
			while(_g2 < l) {
				var i2 = _g2++;
				str1 += (i2 > 0?",":"") + js_Boot.__string_rec(o[i2],s);
			}
			str1 += "]";
			return str1;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString) {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str2 = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) {
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str2.length != 2) str2 += ", \n";
		str2 += s + k + " : " + js_Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str2 += "\n" + s + "}";
		return str2;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
};
js_Boot.__interfLoop = function(cc,cl) {
	if(cc == null) return false;
	if(cc == cl) return true;
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0;
		var _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js_Boot.__interfLoop(i1,cl)) return true;
		}
	}
	return js_Boot.__interfLoop(cc.__super__,cl);
};
js_Boot.__instanceof = function(o,cl) {
	if(cl == null) return false;
	switch(cl) {
	case Int:
		return (o|0) === o;
	case Float:
		return typeof(o) == "number";
	case Bool:
		return typeof(o) == "boolean";
	case String:
		return typeof(o) == "string";
	case Array:
		return (o instanceof Array) && o.__enum__ == null;
	case Dynamic:
		return true;
	default:
		if(o != null) {
			if(typeof(cl) == "function") {
				if(o instanceof cl) return true;
				if(js_Boot.__interfLoop(js_Boot.getClass(o),cl)) return true;
			}
		} else return false;
		if(cl == Class && o.__name__ != null) return true;
		if(cl == Enum && o.__ename__ != null) return true;
		return o.__enum__ == cl;
	}
};
js_Boot.__cast = function(o,t) {
	if(js_Boot.__instanceof(o,t)) return o; else throw "Cannot cast " + Std.string(o) + " to " + Std.string(t);
};
var scenes_GameOverScene = function(score,prevHiScore) {
	this.root = new flambe_Entity().add(new flambe_scene_Scene(false));
	yzi_YZI.addFillSprite(this.root,yzi_YZI.halfWidth,yzi_YZI.halfHeight,0,yzi_YZI.width,yzi_YZI.height,0.8);
	yzi_YZI.addLabel(this.root,yzi_YZI.halfWidth,yzi_YZI.halfHeight - 150,"Game Over",1.2,1,true,"font2");
	var v1 = yzi_YZI.addLabel(this.root,yzi_YZI.halfWidth + 50,yzi_YZI.halfHeight,"" + score,1,1,true,"font3").owner;
	yzi_YZI.addImageSprite(v1,-50,25,"score_icon");
	yzi_YZI.addButton(this.root,yzi_YZI.halfWidth - 75,yzi_YZI.halfHeight + 130,"home_btn",function() {
		yzi_Sfx.unmuteSoundtrack();
		yzi_YZI.goToScene(new scenes_MainScene().root);
	});
	yzi_YZI.addButton(this.root,yzi_YZI.halfWidth + 75,yzi_YZI.halfHeight + 130,"replay_btn",function() {
		yzi_Sfx.unmuteSoundtrack();
		yzi_YZI.goToScene(new scenes_GameScene(0).root);
	});
};
$hxClasses["scenes.GameOverScene"] = scenes_GameOverScene;
scenes_GameOverScene.__name__ = ["scenes","GameOverScene"];
scenes_GameOverScene.prototype = {
	__class__: scenes_GameOverScene
};
var scenes_GameScene = function(bonusScore) {
	this.root = new flambe_Entity().add(new flambe_scene_Scene());
	var _g = this;
	this.root.add(new flambe_script_Script());
	yzi_YZI.addImageSprite(this.root,0,0,"game_scene_bg",1,1,false);
	scenes_GameScene.spikesBlock = yzi_YZI.addImageSprite(this.root,-35,-50,"spikes_block",1,1,false);
	scenes_GameScene.spikesBlock.scissor = new flambe_math_Rectangle(35,0,640,scenes_GameScene.spikesBlock.getNaturalHeight());
	var hudBg = yzi_YZI.addImageSprite(this.root,-35,-38,"hud_bg",1,1,false);
	hudBg.scissor = new flambe_math_Rectangle(35,0,640,hudBg.getNaturalHeight());
	if(scenes_GameScene.cLevel == 1) {
		scenes_GameScene.totalScore = 0;
		yzi_YZI.addDelay(this.root,0.2,function() {
			yzi_YZI.pushScene(new scenes_HelpScene().root);
		},false);
	}
	yzi_YZI.addDelay(this.root,0.8,function() {
		yzi_YZI.addButton(_g.root,585,50,"pause_btn",function() {
			yzi_YZI.pushScene(new scenes_PauseScene().root);
		});
		yzi_YZI.addButton(_g.root,355,58,"push_btn",function() {
			((function($this) {
				var $r;
				var component = _g.root.getComponent("GameSceneComp_9");
				$r = component;
				return $r;
			}(this))).addRow();
		});
		_g.root.add(new scenes_GameSceneComp(scenes_GameScene.scoreTillNextLevel(scenes_GameScene.cLevel + 1),0));
	},false);
};
$hxClasses["scenes.GameScene"] = scenes_GameScene;
scenes_GameScene.__name__ = ["scenes","GameScene"];
scenes_GameScene.scoreTillNextLevel = function(nextLevel) {
	var b = 1000;
	var c = 30;
	return nextLevel * b + b * nextLevel + (c * nextLevel * nextLevel - c * nextLevel);
};
scenes_GameScene.prototype = {
	__class__: scenes_GameScene
};
var scenes_GameSceneComp = function(scoreTillNextLevel,bonusScore) {
	this.levelEnd = false;
	this.cLevelScore = 0;
	this.timerC = 0;
	flambe_Component.call(this);
	this.scoreTillNextLevel = scoreTillNextLevel;
	this.cLevelScore = bonusScore;
};
$hxClasses["scenes.GameSceneComp"] = scenes_GameSceneComp;
scenes_GameSceneComp.__name__ = ["scenes","GameSceneComp"];
scenes_GameSceneComp.__super__ = flambe_Component;
scenes_GameSceneComp.prototype = $extend(flambe_Component.prototype,{
	get_name: function() {
		return "GameSceneComp_9";
	}
	,onAdded: function() {
		this.grid = new Grid(this.owner,9,11);
		this.grid.addRandRows(8);
		this.timeTillNextRow = this.caclAddRowTimer();
		yzi_YZI.addLabel(this.owner,32,57,"" + scenes_GameScene.cLevel,1,1,true);
		this.scoreBarFill = yzi_YZI.addImageSprite(this.owner,76,46,"bar1_fill",1,1,false);
		this.scoreBarFillRect = new flambe_math_Rectangle(0,0,0,this.scoreBarFill.getNaturalHeight());
		this.scoreBarFill.scissor = this.scoreBarFillRect;
		this.scoreLabel = yzi_YZI.addLabel(this.owner,190,48,"");
		this.scoreLabel.setAlign(flambe_display_TextAlign.Center);
		this.updateScore(0);
		this.pushUpBarFill = yzi_YZI.addImageSprite(this.owner,396,46,"bar2_fill",1,1,false);
		this.pushUpBarFill.setScaleXY(0.62,1);
		this.pushUpBarFillRect = new flambe_math_Rectangle(0,0,0,this.pushUpBarFill.getNaturalHeight());
		this.pushUpBarFill.scissor = this.pushUpBarFillRect;
		this.pushUpTimer = yzi_YZI.addDelay(this.owner,this.timeTillNextRow,$bind(this,this.addRow),true);
		this.timer = yzi_YZI.addDelay(this.owner,0.1,$bind(this,this.updateTimer),true);
		this.checkForMatches();
	}
	,caclAddRowTimer: function() {
		var it = 9;
		var t = it - Std["int"](0.5 * scenes_GameScene.cLevel);
		if(t < 2) t = 2;
		return t;
	}
	,checkForMatches: function() {
		if(this.levelEnd) return;
		this.checkNextLevel();
		if(this.grid.getDeepMatches().length == 0) {
			this.pushUpTimer.dispose();
			this.pushUpTimer = yzi_YZI.addDelay(this.owner,this.timeTillNextRow,$bind(this,this.addRow),true);
			this.addRow();
		}
	}
	,addRow: function() {
		this.pushUpBarFillRect.width = this.pushUpBarFill.getNaturalWidth();
		this.pushUpBarFill.scissor = this.pushUpBarFillRect;
		this.timerC = 0;
		if(this.levelEnd) return;
		if(this.grid.pushPiecesUp()) {
			this.grid.addRandRows(1);
			if(this.grid.getDeepMatches().length == 0) this.addRow();
		} else this.checkGameOver();
	}
	,checkNextLevel: function() {
		var _g = this;
		if(this.cLevelScore >= this.scoreTillNextLevel) {
			this.levelEnd = true;
			Piece.canMakeAction = false;
			((function($this) {
				var $r;
				var component = $this.pushUpTimer.getComponent("Script_5");
				$r = component;
				return $r;
			}(this))).stopAll();
			((function($this) {
				var $r;
				var component1 = $this.timer.getComponent("Script_5");
				$r = component1;
				return $r;
			}(this))).stopAll();
			yzi_YZI.addDelay(this.owner,1,function() {
				_g.grid.clear2();
			},false);
			scenes_GameScene.cLevel += 1;
			var bonusScore = this.cLevelScore - this.scoreTillNextLevel;
			scenes_GameScene.totalScore += this.cLevelScore;
			G.saveHiScore(scenes_GameScene.totalScore);
			yzi_YZI.addDelay(this.owner,1,function() {
				SG_Hooks.showAdds();
				yzi_Sfx.showAddMuteAll();
			},false);
			yzi_YZI.addDelay(this.owner,6,function() {
				yzi_Sfx.showAddMuteAll();
				yzi_Sfx.playSfx("level_end_sfx",0.3);
				_g.showLevelCompleteMsg();
			},false);
			yzi_YZI.addDelay(this.owner,11,function() {
				yzi_YZI.goToScene(new scenes_GameScene(bonusScore).root,new flambe_scene_SlideTransition(0.6,flambe_animation_Ease.backIn).left());
			},false);
		}
	}
	,checkGameOver: function() {
		this.levelEnd = true;
		Piece.canMakeAction = false;
		var prevHiScore = G.HI_SCORE;
		scenes_GameScene.totalScore += this.cLevelScore;
		G.saveHiScore(scenes_GameScene.totalScore);
		((function($this) {
			var $r;
			var component = $this.pushUpTimer.getComponent("Script_5");
			$r = component;
			return $r;
		}(this))).stopAll();
		((function($this) {
			var $r;
			var component1 = $this.timer.getComponent("Script_5");
			$r = component1;
			return $r;
		}(this))).stopAll();
		scenes_GameScene.cLevel = 1;
		this.grid.clear();
		yzi_YZI.addDelay(this.owner,1,function() {
			SG_Hooks.showAdds();
			yzi_Sfx.showAddMuteAll();
		},false);
		yzi_YZI.addDelay(this.owner,6,function() {
			yzi_Sfx.showAddMuteAll();
			yzi_Sfx.muteSoundtrack();
			yzi_Sfx.playSfx("game_over_sfx",0.4);
			yzi_YZI.pushScene(new scenes_GameOverScene(scenes_GameScene.totalScore,prevHiScore).root);
		},false);
	}
	,updateScore: function(s) {
		this.cLevelScore += s;
		if(this.cLevelScore > this.scoreTillNextLevel) this.cLevelScore = this.scoreTillNextLevel;
		this.scoreLabel.set_text(this.cLevelScore + " > " + this.scoreTillNextLevel);
		this.scoreBarFillRect.width = this.cLevelScore / this.scoreTillNextLevel * this.scoreBarFill.getNaturalWidth();
		this.scoreBarFill.scissor = this.scoreBarFillRect;
	}
	,updateTimer: function() {
		this.timerC += 0.1;
		if(this.timerC > this.timeTillNextRow) this.timerC = this.timeTillNextRow;
		this.pushUpBarFillRect.width = this.timerC / this.timeTillNextRow * this.pushUpBarFill.getNaturalWidth();
		this.pushUpBarFill.scissor = this.pushUpBarFillRect;
	}
	,showLevelCompleteMsg: function() {
		var bg = yzi_YZI.addFillSprite(this.owner,yzi_YZI.halfWidth,yzi_YZI.halfHeight,0,yzi_YZI.width,140,0);
		var msg = yzi_YZI.addLabel(this.owner,yzi_YZI.halfWidth,yzi_YZI.halfHeight,"Level Complete",1,0,true,"font2");
		bg.alpha.animateTo(0.8,0.4,flambe_animation_Ease.quadIn);
		msg.alpha.animateTo(1,0.4,flambe_animation_Ease.quadIn);
	}
	,__class__: scenes_GameSceneComp
});
var scenes_HelpScene = function() {
	this.root = new flambe_Entity().add(new flambe_scene_Scene(false));
	yzi_YZI.addFillSprite(this.root,yzi_YZI.halfWidth,yzi_YZI.halfHeight,0,yzi_YZI.width,yzi_YZI.height,0.8);
	yzi_YZI.addImageSprite(this.root,yzi_YZI.halfWidth,340,"help_info",1,1);
	yzi_YZI.addButton(this.root,yzi_YZI.halfWidth,yzi_YZI.height - 160,"play_btn2",function() {
		yzi_YZI.popScene(new flambe_scene_FadeTransition(0.2));
	});
};
$hxClasses["scenes.HelpScene"] = scenes_HelpScene;
scenes_HelpScene.__name__ = ["scenes","HelpScene"];
scenes_HelpScene.prototype = {
	__class__: scenes_HelpScene
};
var scenes_MainScene = function() {
	this.root = new flambe_Entity().add(new flambe_scene_Scene());
	yzi_Sfx.playSoundtrack("soundtrack1",0.2);
	var v3 = yzi_YZI.addImageSprite(this.root,yzi_YZI.halfWidth,yzi_YZI.halfHeight,"game_scene_bg");
	var v0 = yzi_YZI.addImageSprite(this.root,yzi_YZI.halfWidth,yzi_YZI.halfHeight - 120,"game_title",1,1);
	yzi_YZI.addMovieSprite(this.root,yzi_YZI.halfWidth,yzi_YZI.halfHeight - 230,"bl_anim");
	var v1 = yzi_YZI.addLabel(this.root,yzi_YZI.halfWidth + 85,yzi_YZI.height + 100,"" + G.HI_SCORE,1,0,true,"font4");
	yzi_YZI.addImageSprite(v1.owner,-85,25,"high_score_icon");
	v1.alpha.animateTo(1,1,flambe_animation_Ease.quadOut);
	v1.y.animateTo(yzi_YZI.height - 50,1,flambe_animation_Ease.bounceOut);
	var v2 = yzi_YZI.addButton(this.root,yzi_YZI.halfWidth,yzi_YZI.height - 200,"play_btn2",function() {
		yzi_YZI.goToScene(new scenes_GameScene(0).root);
	},"",1,0);
	v2.alpha.animateTo(1,1,flambe_animation_Ease.quadOut);
	v2.y.animateTo(yzi_YZI.height - 260,1,flambe_animation_Ease.bounceOut);
	var v4 = yzi_YZI.addButton(this.root,yzi_YZI.width - 70,70,"sound_on_btn",function() {
		yzi_Sfx.muteAll();
	},"sound_off_btn",1,1);
	((function($this) {
		var $r;
		var component = v4.owner.parent.firstChild.next.getComponent("Sprite_2");
		$r = component;
		return $r;
	}(this))).set_visible(yzi_Sfx.isGlobalMute);
};
$hxClasses["scenes.MainScene"] = scenes_MainScene;
scenes_MainScene.__name__ = ["scenes","MainScene"];
scenes_MainScene.prototype = {
	__class__: scenes_MainScene
};
var scenes_PauseScene = function() {
	this.root = new flambe_Entity().add(new flambe_scene_Scene(false));
	yzi_YZI.addFillSprite(this.root,yzi_YZI.halfWidth,yzi_YZI.halfHeight,0,yzi_YZI.width,yzi_YZI.height,0.8);
	yzi_YZI.addLabel(this.root,yzi_YZI.halfWidth,yzi_YZI.halfHeight - 205,"Paused",1.2,1,true,"font2");
	yzi_YZI.addButton(this.root,yzi_YZI.halfWidth,yzi_YZI.halfHeight + 5,"play_btn2",function() {
		yzi_YZI.popScene(new flambe_scene_FadeTransition(0));
	});
	yzi_YZI.addButton(this.root,yzi_YZI.halfWidth - 150,yzi_YZI.halfHeight + 200,"home_btn",function() {
		yzi_YZI.goToScene(new scenes_MainScene().root);
	});
	yzi_YZI.addButton(this.root,yzi_YZI.halfWidth,yzi_YZI.halfHeight + 200,"replay_btn",function() {
		scenes_GameScene.cLevel = 1;
		yzi_YZI.goToScene(new scenes_GameScene(0).root);
	});
	var v1 = yzi_YZI.addMuteButton(this.root,yzi_YZI.halfWidth + 150,yzi_YZI.halfHeight + 200,"sound_on_btn","sound_off_btn",yzi_Sfx.isGlobalMute);
	((function($this) {
		var $r;
		var component = v1.owner.parent.firstChild.next.getComponent("Sprite_2");
		$r = component;
		return $r;
	}(this))).set_visible(yzi_Sfx.isGlobalMute);
};
$hxClasses["scenes.PauseScene"] = scenes_PauseScene;
scenes_PauseScene.__name__ = ["scenes","PauseScene"];
scenes_PauseScene.prototype = {
	__class__: scenes_PauseScene
};
var yzi_Sfx = function() { };
$hxClasses["yzi.Sfx"] = yzi_Sfx;
yzi_Sfx.__name__ = ["yzi","Sfx"];
yzi_Sfx.playSfx = function(name,volume) {
	if(volume == null) volume = 1.0;
	if(!yzi_Sfx.isMuted) return yzi_YZI.assets.getSound(yzi_Sfx.soundsFolder + "/" + name).play(volume); else return null;
};
yzi_Sfx.playSoundtrack = function(name,volume) {
	if(volume == null) volume = 1.0;
	var s = yzi_YZI.assets.getSound(yzi_Sfx.soundsFolder + "/" + name);
	if(yzi_Sfx.cSoundtrackPlayback != null) {
		if(yzi_Sfx.cSoundtrackPlayback.get_sound() != s) {
			yzi_Sfx.cSoundtrackVolume = volume;
			yzi_Sfx.cSoundtrackPlayback = s.loop(volume);
			return yzi_Sfx.cSoundtrackPlayback;
		} else return yzi_Sfx.cSoundtrackPlayback;
	} else {
		yzi_Sfx.cSoundtrackVolume = volume;
		yzi_Sfx.cSoundtrackPlayback = s.loop(volume);
		return yzi_Sfx.cSoundtrackPlayback;
	}
};
yzi_Sfx.muteSoundtrack = function() {
	if(yzi_Sfx.cSoundtrackPlayback != null) {
		yzi_Sfx.cSoundtrackPlayback.volume.animateTo(0,1);
		yzi_YZI.addDelay(null,0.8,function() {
			yzi_Sfx.cSoundtrackPlayback.set_paused(true);
		},false);
	}
};
yzi_Sfx.unmuteSoundtrack = function() {
	if(yzi_Sfx.cSoundtrackPlayback != null && !yzi_Sfx.isMuted) {
		yzi_Sfx.cSoundtrackPlayback.set_paused(false);
		yzi_Sfx.cSoundtrackPlayback.volume.animateTo(yzi_Sfx.cSoundtrackVolume,1);
	}
};
yzi_Sfx.muteAll = function() {
	if(!yzi_Sfx.isGlobalMute) {
		yzi_Sfx.isGlobalMute = true;
		yzi_Sfx.muteSoundtrack();
		flambe_System.volume.animateTo(0,1);
	} else {
		yzi_Sfx.isGlobalMute = false;
		yzi_Sfx.unmuteSoundtrack();
		flambe_System.volume.animateTo(1,0);
	}
};
yzi_Sfx.showAddMuteAll = function() {
	if(!yzi_Sfx.isGlobalMute) {
		if(!yzi_Sfx.isMuted) {
			yzi_Sfx.isMuted = true;
			yzi_Sfx.muteSoundtrack();
			flambe_System.volume.animateTo(0,1);
		} else {
			yzi_Sfx.isMuted = false;
			yzi_Sfx.unmuteSoundtrack();
			flambe_System.volume.animateTo(1,0);
		}
	}
};
var yzi_Tweener = function() { };
$hxClasses["yzi.Tweener"] = yzi_Tweener;
yzi_Tweener.__name__ = ["yzi","Tweener"];
yzi_Tweener.tween = function(object,seconds,params,delay,onComplete,easing) {
	if(delay == null) delay = 0;
	var sequence = new flambe_script_Sequence();
	if(delay < 0) delay = 0;
	if(seconds == 0 && delay == 0) yzi_Tweener.apply(object,params,onComplete); else if(seconds == 0 && delay > 0) {
		var entity = new flambe_Entity();
		if(delay != 0) sequence.add(new flambe_script_Delay(delay));
		sequence.add(new flambe_script_CallFunction(function() {
			yzi_Tweener.apply(object,params,onComplete);
			entity.dispose();
		}));
		var script = new flambe_script_Script();
		flambe_System.root.addChild(entity.add(script));
		script.run(sequence);
	} else {
		if(delay > 0) sequence.add(new flambe_script_Delay(delay));
		var parallelActions = new Array();
		var _g = 0;
		var _g1 = Reflect.fields(params);
		while(_g < _g1.length) {
			var param = _g1[_g];
			++_g;
			var property = Reflect.getProperty(object,param);
			if(property != null) parallelActions.push(new flambe_script_AnimateTo(property,Reflect.field(params,param),seconds,easing));
		}
		var parallel = new flambe_script_Parallel(parallelActions);
		sequence.add(parallel);
		var entity1 = new flambe_Entity();
		sequence.add(new flambe_script_Delay(seconds));
		sequence.add(new flambe_script_CallFunction(function() {
			if(onComplete != null) onComplete();
			entity1.dispose();
		}));
		var script1 = new flambe_script_Script();
		flambe_System.root.addChild(entity1.add(script1));
		script1.run(sequence);
	}
};
yzi_Tweener.apply = function(object,params,onComplete) {
	var _g = 0;
	var _g1 = Reflect.fields(params);
	while(_g < _g1.length) {
		var param = _g1[_g];
		++_g;
		var property = Reflect.getProperty(object,param);
		(js_Boot.__cast(property , flambe_animation_AnimatedFloat)).set__(Reflect.field(params,param));
	}
	if(onComplete != null) onComplete();
};
var yzi_YZI = function(w,h) {
	this.init = new flambe_util_Signal0();
	var _g = this;
	yzi_YZI.width = w;
	yzi_YZI.height = h;
	yzi_YZI.halfWidth = Std["int"](w / 2);
	yzi_YZI.halfHeight = Std["int"](h / 2);
	yzi_YZI.director = new flambe_Entity().add(new flambe_display_Sprite()).add(new flambe_scene_Director().setSize(yzi_YZI.width,yzi_YZI.height));
	flambe_System.root.addChild(yzi_YZI.director);
	yzi_YZI.systemBg = yzi_YZI.initFillSpriteComp(0,0,yzi_YZI.systemBgColor,0,0,1,false);
	flambe_System.root.add(yzi_YZI.systemBg);
	var bootLoader = flambe_System.loadAssetPack(flambe_asset_Manifest.fromAssets("boot"));
	bootLoader.get(function(pack) {
		yzi_YZI.assets = pack;
		flambe_System.get_stage().lockOrientation(yzi_YZI.defaultOrientation);
		flambe_System.get_stage().requestFullscreen(true);
		flambe_System.get_stage().orientation.get_changed().connect($bind(_g,_g.onOrientationChange));
		flambe_System.get_stage().resize.connect($bind(_g,_g.onResize));
		_g.onResize();
		_g.initPreloaderScene();
	});
};
$hxClasses["yzi.YZI"] = yzi_YZI;
yzi_YZI.__name__ = ["yzi","YZI"];
yzi_YZI.onResizeCallback = function() {
};
yzi_YZI.onOrientationChangeCallback = function() {
};
yzi_YZI.goToScene = function(scene,trans) {
	if(trans == null) trans = new flambe_scene_FadeTransition(0.5,flambe_animation_Ease.quadOut);
	((function($this) {
		var $r;
		var component = yzi_YZI.director.getComponent("Director_7");
		$r = component;
		return $r;
	}(this))).unwindToScene(scene,trans);
};
yzi_YZI.pushScene = function(scene,trans) {
	if(trans == null) trans = new flambe_scene_FadeTransition(0.5,flambe_animation_Ease.quadOut);
	((function($this) {
		var $r;
		var component = yzi_YZI.director.getComponent("Director_7");
		$r = component;
		return $r;
	}(this))).pushScene(scene,trans);
};
yzi_YZI.popScene = function(trans) {
	if(trans == null) trans = new flambe_scene_FadeTransition(0.5,flambe_animation_Ease.quadOut);
	((function($this) {
		var $r;
		var component = yzi_YZI.director.getComponent("Director_7");
		$r = component;
		return $r;
	}(this))).popScene(trans);
};
yzi_YZI.saveData = function(key,data) {
	return flambe_System.get_storage().set(key,data);
};
yzi_YZI.loadData = function(key) {
	return flambe_System.get_storage().get(key);
};
yzi_YZI.initFlipbooks = function(d) {
	var flipbooks = [];
	var _g1 = 0;
	var _g = d.length;
	while(_g1 < _g) {
		var i = _g1++;
		flipbooks.push(new flambe_swf_Flipbook(d[i][0],yzi_YZI.assets.getTexture(d[i][0]).split(d[i][1],d[i][2])).setDuration(d[i][3]).setAnchor(d[i][4],d[i][5]));
	}
	yzi_YZI.lib = flambe_swf_Library.fromFlipbooks(flipbooks);
};
yzi_YZI.initFillSpriteComp = function(x,y,color,width,height,alpha,centerAnchor) {
	if(centerAnchor == null) centerAnchor = true;
	if(alpha == null) alpha = 1;
	var fillSprite = new flambe_display_FillSprite(color,width,height);
	fillSprite.setXY(x,y);
	fillSprite.setAlpha(alpha);
	if(centerAnchor) fillSprite.centerAnchor();
	return fillSprite;
};
yzi_YZI.initImageSpriteComp = function(x,y,textureName,scale,alpha,centerAnchor,scissorRect) {
	if(centerAnchor == null) centerAnchor = true;
	if(alpha == null) alpha = 1;
	if(scale == null) scale = 1;
	var texture = null;
	if(textureName != "") texture = yzi_YZI.assets.getTexture(textureName);
	if(scissorRect != null) texture = texture.subTexture(Std["int"](scissorRect.x),Std["int"](scissorRect.y),Std["int"](scissorRect.width),Std["int"](scissorRect.height));
	var imageSprite = new flambe_display_ImageSprite(texture);
	imageSprite.setXY(x,y);
	imageSprite.setScale(scale);
	imageSprite.setAlpha(alpha);
	if(centerAnchor) imageSprite.centerAnchor();
	return imageSprite;
};
yzi_YZI.initTextSpriteComp = function(x,y,text,scale,alpha,centerAnchor,fontName) {
	if(fontName == null) fontName = "";
	if(centerAnchor == null) centerAnchor = false;
	if(alpha == null) alpha = 1;
	if(scale == null) scale = 1;
	if(text == null) text = "Label";
	if(fontName == "") fontName = yzi_YZI.defaultFont;
	var textSprite = new flambe_display_TextSprite(new flambe_display_Font(yzi_YZI.assets,fontName),text);
	textSprite.disablePointer();
	textSprite.setXY(x,y);
	textSprite.setScale(scale);
	textSprite.setAlpha(alpha);
	if(centerAnchor) textSprite.centerAnchor();
	return textSprite;
};
yzi_YZI.initMovieSpriteComp = function(x,y,textureName,scale,alpha,centerAnchor) {
	if(centerAnchor == null) centerAnchor = true;
	if(alpha == null) alpha = 1;
	if(scale == null) scale = 1;
	var movieSprite = yzi_YZI.lib.createMovie(textureName);
	movieSprite.setXY(x,y);
	movieSprite.setScale(scale);
	movieSprite.setAlpha(alpha);
	if(centerAnchor) movieSprite.centerAnchor();
	return movieSprite;
};
yzi_YZI.addFillSprite = function(parent,x,y,color,width,height,alpha,centerAnchor) {
	if(centerAnchor == null) centerAnchor = true;
	if(alpha == null) alpha = 1;
	var entity = new flambe_Entity();
	entity.add(new flambe_Disposer());
	var sprite = yzi_YZI.initFillSpriteComp(x,y,color,width,height,alpha,centerAnchor);
	entity.add(sprite);
	if(parent != null) parent.addChild(entity);
	return sprite;
};
yzi_YZI.addImageSprite = function(parent,x,y,textureName,scale,alpha,centerAnchor,scissorRect) {
	if(centerAnchor == null) centerAnchor = true;
	if(alpha == null) alpha = 1;
	if(scale == null) scale = 1;
	var entity = new flambe_Entity();
	entity.add(new flambe_Disposer());
	var sprite = yzi_YZI.initImageSpriteComp(x,y,textureName,scale,alpha,centerAnchor,scissorRect);
	entity.add(sprite);
	if(parent != null) parent.addChild(entity);
	return sprite;
};
yzi_YZI.addLabel = function(parent,x,y,text,scale,alpha,centerAnchor,fontName) {
	if(fontName == null) fontName = "";
	if(centerAnchor == null) centerAnchor = false;
	if(alpha == null) alpha = 1;
	if(scale == null) scale = 1;
	if(text == null) text = "Label";
	var entity = new flambe_Entity();
	entity.add(new flambe_Disposer());
	var sprite = yzi_YZI.initTextSpriteComp(x,y,text,scale,alpha,centerAnchor,fontName);
	entity.add(sprite);
	if(parent != null) parent.addChild(entity);
	return sprite;
};
yzi_YZI.addButton = function(parent,x,y,normalTextureName,onClick,toggleTextureName,scale,alpha) {
	if(alpha == null) alpha = 1;
	if(scale == null) scale = 1;
	if(toggleTextureName == null) toggleTextureName = "";
	var buttonLayer = new flambe_Entity();
	parent.addChild(buttonLayer);
	var entity = yzi_YZI.addImageSprite(buttonLayer,x,y,normalTextureName,scale,alpha,true).owner;
	if(yzi_YZI.useMouseHandCursor) entity.add(new yzi_components_ButtonCursorComp());
	entity.add(new flambe_script_Script());
	var entity2 = null;
	if(toggleTextureName != "") {
		entity2 = yzi_YZI.addImageSprite(buttonLayer,x,y,toggleTextureName,1,1,true).owner;
		if(yzi_YZI.useMouseHandCursor) entity2.add(new yzi_components_ButtonCursorComp());
		((function($this) {
			var $r;
			var component = entity2.getComponent("Sprite_2");
			$r = component;
			return $r;
		}(this))).set_visible(false);
	}
	var scaleUpTo = scale + 0.15;
	var tweenAction = new flambe_script_Sequence();
	tweenAction.add(new flambe_script_CallFunction(function() {
		((function($this) {
			var $r;
			var component1 = entity.getComponent("Sprite_2");
			$r = component1;
			return $r;
		}(this))).scaleX.animateTo(scaleUpTo,0.2,flambe_animation_Ease.backOut);
		((function($this) {
			var $r;
			var component2 = entity.getComponent("Sprite_2");
			$r = component2;
			return $r;
		}(this))).scaleY.animateTo(scaleUpTo,0.2,flambe_animation_Ease.backOut);
	}));
	tweenAction.add(new flambe_script_Delay(0.2));
	tweenAction.add(new flambe_script_CallFunction(function() {
		((function($this) {
			var $r;
			var component3 = entity.getComponent("Sprite_2");
			$r = component3;
			return $r;
		}(this))).scaleX.animateTo(scale,0.1,flambe_animation_Ease.quadIn);
		((function($this) {
			var $r;
			var component4 = entity.getComponent("Sprite_2");
			$r = component4;
			return $r;
		}(this))).scaleY.animateTo(scale,0.1,flambe_animation_Ease.quadIn);
	}));
	var onPointerDown = function(_) {
		((function($this) {
			var $r;
			var component5 = entity.getComponent("Script_5");
			$r = component5;
			return $r;
		}(this))).run(tweenAction);
	};
	var onPointerUp = function(_1) {
		if(entity2 != null) {
			if(!((function($this) {
				var $r;
				var component6 = entity2.getComponent("Sprite_2");
				$r = component6;
				return $r;
			}(this))).get_visible()) {
				((function($this) {
					var $r;
					var component7 = entity.getComponent("Sprite_2");
					$r = component7;
					return $r;
				}(this))).set_visible(false);
				((function($this) {
					var $r;
					var component8 = entity2.getComponent("Sprite_2");
					$r = component8;
					return $r;
				}(this))).set_visible(true);
			} else {
				((function($this) {
					var $r;
					var component9 = entity.getComponent("Sprite_2");
					$r = component9;
					return $r;
				}(this))).set_visible(true);
				((function($this) {
					var $r;
					var component10 = entity2.getComponent("Sprite_2");
					$r = component10;
					return $r;
				}(this))).set_visible(false);
			}
		}
		if(yzi_YZI.buttonClickSfx != "") yzi_Sfx.playSfx(yzi_YZI.buttonClickSfx);
		if(onClick != null) onClick();
	};
	((function($this) {
		var $r;
		var component11 = entity.getComponent("Disposer_4");
		$r = component11;
		return $r;
	}(this))).connect1(((function($this) {
		var $r;
		var component12 = entity.getComponent("Sprite_2");
		$r = component12;
		return $r;
	}(this))).get_pointerDown(),onPointerDown);
	((function($this) {
		var $r;
		var component13 = entity.getComponent("Disposer_4");
		$r = component13;
		return $r;
	}(this))).connect1(((function($this) {
		var $r;
		var component14 = entity.getComponent("Sprite_2");
		$r = component14;
		return $r;
	}(this))).get_pointerUp(),onPointerUp);
	if(entity2 != null) {
		((function($this) {
			var $r;
			var component15 = entity2.getComponent("Disposer_4");
			$r = component15;
			return $r;
		}(this))).connect1(((function($this) {
			var $r;
			var component16 = entity2.getComponent("Sprite_2");
			$r = component16;
			return $r;
		}(this))).get_pointerDown(),onPointerDown);
		((function($this) {
			var $r;
			var component17 = entity2.getComponent("Disposer_4");
			$r = component17;
			return $r;
		}(this))).connect1(((function($this) {
			var $r;
			var component18 = entity2.getComponent("Sprite_2");
			$r = component18;
			return $r;
		}(this))).get_pointerUp(),onPointerUp);
	}
	return Std.instance(entity.getComponent("Sprite_2"),flambe_display_ImageSprite);
};
yzi_YZI.addMovieSprite = function(parent,x,y,name,onComplete,scale,alpha,centerAnchor) {
	if(centerAnchor == null) centerAnchor = true;
	if(alpha == null) alpha = 1;
	if(scale == null) scale = 1;
	var entity = new flambe_Entity();
	entity.add(new flambe_Disposer());
	var sprite = yzi_YZI.initMovieSpriteComp(x,y,name,scale,alpha,centerAnchor);
	entity.add(sprite);
	if(onComplete != null) ((function($this) {
		var $r;
		var component = entity.getComponent("Disposer_4");
		$r = component;
		return $r;
	}(this))).connect0(Std.instance(entity.getComponent("Sprite_2"),flambe_swf_MovieSprite).get_looped(),onComplete);
	if(parent != null) parent.addChild(entity);
	return sprite;
};
yzi_YZI.addMuteButton = function(parent,x,y,onTextureName,offTextureName,on,scale,alpha) {
	if(alpha == null) alpha = 1;
	if(scale == null) scale = 1;
	return yzi_YZI.addButton(parent,x,y,onTextureName,function() {
		yzi_Sfx.muteAll();
	},offTextureName,scale,alpha);
};
yzi_YZI.addDelay = function(parent,delay,onComplete,repeat,rN) {
	if(rN == null) rN = -1;
	if(repeat == null) repeat = false;
	var entity = new flambe_Entity();
	var seqAction = new flambe_script_Sequence();
	seqAction.add(new flambe_script_Delay(delay));
	seqAction.add(new flambe_script_CallFunction(function() {
		if(onComplete != null) onComplete();
		if(!repeat) entity.dispose();
	}));
	var script = new flambe_script_Script();
	entity.add(new flambe_Disposer());
	entity.add(script);
	if(parent != null) parent.addChild(entity);
	if(repeat) script.run(new flambe_script_Repeat(seqAction,rN)); else script.run(seqAction);
	return entity;
};
yzi_YZI.rand = function(n) {
	return Std.random(n);
};
yzi_YZI.randSign = function() {
	var s = 1;
	if(Std.random(2) == 0) s = -1;
	return s;
};
yzi_YZI.prototype = {
	onResize: function() {
		var w = flambe_System.get_stage().get_width();
		var h = flambe_System.get_stage().get_height();
		yzi_YZI.scale = Math.min(w / yzi_YZI.width,h / yzi_YZI.height);
		var ay = 0;
		if(yzi_YZI.rootContYAlign == "top") ay = 0; else if(yzi_YZI.rootContYAlign == "middle") ay = 0.5 * h - 0.5 * yzi_YZI.scale * yzi_YZI.height; else if(yzi_YZI.rootContYAlign == "bottom") ay = h - yzi_YZI.scale * yzi_YZI.height;
		((function($this) {
			var $r;
			var component = yzi_YZI.director.getComponent("Sprite_2");
			$r = component;
			return $r;
		}(this))).setXY(0.5 * w - 0.5 * yzi_YZI.scale * yzi_YZI.width,ay);
		((function($this) {
			var $r;
			var component1 = yzi_YZI.director.getComponent("Sprite_2");
			$r = component1;
			return $r;
		}(this))).setScale(yzi_YZI.scale);
		if(yzi_YZI.maskRootCont) ((function($this) {
			var $r;
			var component2 = yzi_YZI.director.getComponent("Sprite_2");
			$r = component2;
			return $r;
		}(this))).scissor = new flambe_math_Rectangle(0,0,yzi_YZI.width,yzi_YZI.height);
		yzi_YZI.systemBg.setXY(0,0);
		yzi_YZI.systemBg.setSize(w,h);
		var x = ((function($this) {
			var $r;
			var component3 = yzi_YZI.director.getComponent("Sprite_2");
			$r = component3;
			return $r;
		}(this))).x.get__();
		var y = ((function($this) {
			var $r;
			var component4 = yzi_YZI.director.getComponent("Sprite_2");
			$r = component4;
			return $r;
		}(this))).y.get__();
		try {
			haxe_Log.trace(h - 2 * y,{ fileName : "YZI.hx", lineNumber : 138, className : "yzi.YZI", methodName : "onResize", customParams : [((function($this) {
				var $r;
				var component5 = yzi_YZI.director.getComponent("Sprite_2");
				$r = component5;
				return $r;
			}(this))).getNaturalWidth()]});
			flambe_System.get_external().call("updateXY",[x,y,yzi_YZI.width * yzi_YZI.scale,yzi_YZI.height * yzi_YZI.scale,yzi_YZI.scale]);
		} catch( error ) {
		}
		yzi_YZI.onResizeCallback();
	}
	,onOrientationChange: function(newO,oldO) {
		yzi_YZI.onOrientationChangeCallback();
	}
	,initPreloaderScene: function() {
		var _g = this;
		var preloaderBgColor = 1118481;
		var barColor = 16722284;
		var barBgColor = 0;
		var barW = yzi_YZI.width - 104;
		var barH = 76;
		var barBorder = 4;
		var root = new flambe_Entity().add(new flambe_scene_Scene());
		var bg = yzi_YZI.addImageSprite(root,0,0,"bg",1,1,false).owner;
		var barBg = yzi_YZI.addFillSprite(bg,yzi_YZI.halfWidth,yzi_YZI.halfHeight + 2,barBgColor,barW,barH).owner;
		var bar = yzi_YZI.addFillSprite(barBg,barBorder,barBorder,barColor,0,barH - barBorder * 2,1,false).owner;
		var loaderInfFx = null;
		var ldfx = yzi_YZI.addDelay(root,0.6,function() {
			if(loaderInfFx != null) loaderInfFx.dispose();
			loaderInfFx = yzi_YZI.addImageSprite(root,yzi_YZI.halfWidth,yzi_YZI.halfHeight + 80,"ldr_txt" + yzi_YZI.rand(3));
		},true);
		var loader = flambe_System.loadAssetPack(flambe_asset_Manifest.fromAssets("main"));
		loader.get(function(pack) {
			ldfx.dispose();
			yzi_YZI.assets = pack;
			yzi_YZI.settings = flambe_util_MessageBundle.parse(pack.getFile("settings.ini").toString());
			root.removeChild(barBg);
			_g.init.emit();
		});
		loader.progressChanged.connect(function() {
			var p = loader.get_progress() / loader.get_total();
			if(p > 1) p = 1;
			Std.instance(bar.getComponent("Sprite_2"),flambe_display_FillSprite).width.set__(p * (barW - barBorder * 2));
		});
		yzi_YZI.goToScene(root);
	}
	,__class__: yzi_YZI
};
var yzi_components_ButtonCursorComp = function() {
	flambe_Component.call(this);
};
$hxClasses["yzi.components.ButtonCursorComp"] = yzi_components_ButtonCursorComp;
yzi_components_ButtonCursorComp.__name__ = ["yzi","components","ButtonCursorComp"];
yzi_components_ButtonCursorComp.__super__ = flambe_Component;
yzi_components_ButtonCursorComp.prototype = $extend(flambe_Component.prototype,{
	get_name: function() {
		return "ButtonCursorComp_1";
	}
	,onAdded: function() {
		((function($this) {
			var $r;
			var component = $this.owner.getComponent("Disposer_4");
			$r = component;
			return $r;
		}(this))).connect1(((function($this) {
			var $r;
			var component1 = $this.owner.getComponent("Sprite_2");
			$r = component1;
			return $r;
		}(this))).get_pointerIn(),$bind(this,this.onPointerIn));
		((function($this) {
			var $r;
			var component2 = $this.owner.getComponent("Disposer_4");
			$r = component2;
			return $r;
		}(this))).connect1(((function($this) {
			var $r;
			var component3 = $this.owner.getComponent("Sprite_2");
			$r = component3;
			return $r;
		}(this))).get_pointerMove(),$bind(this,this.onPointerMove));
		((function($this) {
			var $r;
			var component4 = $this.owner.getComponent("Disposer_4");
			$r = component4;
			return $r;
		}(this))).connect1(((function($this) {
			var $r;
			var component5 = $this.owner.getComponent("Sprite_2");
			$r = component5;
			return $r;
		}(this))).get_pointerOut(),$bind(this,this.onPointerOut));
	}
	,onPointerIn: function(e) {
		flambe_System.get_mouse().set_cursor(flambe_input_MouseCursor.Button);
	}
	,onPointerMove: function(e) {
		if(e.hit == (function($this) {
			var $r;
			var component = $this.owner.getComponent("Sprite_2");
			$r = component;
			return $r;
		}(this))) flambe_System.get_mouse().set_cursor(flambe_input_MouseCursor.Button);
	}
	,onPointerOut: function(e) {
		flambe_System.get_mouse().set_cursor(flambe_input_MouseCursor.Default);
	}
	,__class__: yzi_components_ButtonCursorComp
});
function $iterator(o) { if( o instanceof Array ) return function() { return HxOverrides.iter(o); }; return typeof(o.iterator) == 'function' ? $bind(o,o.iterator) : o.iterator; }
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; }
Math.NaN = Number.NaN;
Math.NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY;
Math.POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
$hxClasses.Math = Math;
Math.isFinite = function(i) {
	return isFinite(i);
};
Math.isNaN = function(i1) {
	return isNaN(i1);
};
String.prototype.__class__ = $hxClasses.String = String;
String.__name__ = ["String"];
$hxClasses.Array = Array;
Array.__name__ = ["Array"];
Date.prototype.__class__ = $hxClasses.Date = Date;
Date.__name__ = ["Date"];
var Int = $hxClasses.Int = { __name__ : ["Int"]};
var Dynamic = $hxClasses.Dynamic = { __name__ : ["Dynamic"]};
var Float = $hxClasses.Float = Number;
Float.__name__ = ["Float"];
var Bool = $hxClasses.Bool = Boolean;
Bool.__ename__ = ["Bool"];
var Class = $hxClasses.Class = { __name__ : ["Class"]};
var Enum = { };
G.HI_SCORE = 0;
Grid.dirs = [new flambe_math_Point(0,-1),new flambe_math_Point(0,1),new flambe_math_Point(1,0),new flambe_math_Point(-1,0)];
Grid.pieceWidth = 70;
Grid.pieceHeight = 70;
Grid.gap = 0;
Grid.offsetX = 0;
Grid.offsetY = 220;
Grid.pieceTypes = 5;
Grid.minMatchForBonus = 6;
Piece.canMakeAction = true;
flambe_platform_html_HtmlPlatform.instance = new flambe_platform_html_HtmlPlatform();
flambe_util_SignalBase.DISPATCHING_SENTINEL = new flambe_util_SignalConnection(null,null);
flambe_System.root = new flambe_Entity();
flambe_System.uncaughtError = new flambe_util_Signal1();
flambe_System.hidden = new flambe_util_Value(false);
flambe_System.volume = new flambe_animation_AnimatedFloat(1);
flambe_System._platform = flambe_platform_html_HtmlPlatform.instance;
flambe_System._calledInit = false;
flambe_Log.logger = flambe_System.createLogger("flambe");
flambe_asset_Manifest.__meta__ = { obj : { assets : [{ bootstrap : [{ bytes : 3822, md5 : "7942f02ae6cb4d11a04655ba03ea5972", name : "plane.png"}], main : [{ bytes : 917, md5 : "16ee926e87e682f7725a1ab174aea5df", name : "bar1_fill.png"},{ bytes : 929, md5 : "625847636fca9bf9641fcc6c6a6098ce", name : "bar2_fill.png"},{ bytes : 5080, md5 : "6f58e630902a1f5585be76399cebbe74", name : "bl0.png"},{ bytes : 5737, md5 : "e7419c998f05f321b68ecc93c131f638", name : "bl1.png"},{ bytes : 6010, md5 : "e7b20e7a4cf9e62df4543c91254ad576", name : "bl2.png"},{ bytes : 7165, md5 : "3096a1d4526b8550fd81e80cee8162c5", name : "bl3.png"},{ bytes : 6316, md5 : "81d3bbb96b8f75f072a354fd54319b5e", name : "bl4.png"},{ bytes : 5860, md5 : "5a412600a5c4c05753b5a3eec06673d1", name : "bl5.png"},{ bytes : 5723, md5 : "0eb8185901b512a4f64f1b11eaea1e42", name : "bl6.png"},{ bytes : 5590, md5 : "fb66ef613acfda79796adcff43a6917f", name : "bl7.png"},{ bytes : 6241, md5 : "db375339f0fc4e9460f8e07193666b4f", name : "bl8.png"},{ bytes : 5604, md5 : "d814210bc98c29c06ae93ca0a846bc5e", name : "bl9.png"},{ bytes : 319981, md5 : "f611e604aa5cf263b43646c469d93c4a", name : "bl_anim.png"},{ bytes : 2239, md5 : "41056fa3a49ea87747f45cab142c18ac", name : "bonus_marker.png"},{ bytes : 22501, md5 : "150b5d3ee638b5eed99df8bb93560075", name : "debug_font.fnt"},{ bytes : 16702, md5 : "736b0c441c9ef9887af6661d36267ee6", name : "debug_font.png"},{ bytes : 8522, md5 : "5bd17b8d9ffac019ca278d4155a7c479", name : "default_font1.fnt"},{ bytes : 53579, md5 : "6cef8623d84e2701e64b2a1b54af0c54", name : "default_font1.png"},{ bytes : 8559, md5 : "91bae6a9431628c7d811f922582d19e7", name : "font2.fnt"},{ bytes : 78083, md5 : "f5f72051cc7702cbbe20465b9fd82b54", name : "font2.png"},{ bytes : 1168, md5 : "107955d1cb3ddadd7d138d46cd335d95", name : "font3.fnt"},{ bytes : 10751, md5 : "a0c79276e722e34529d8b7e3cbb0bbf0", name : "font3.png"},{ bytes : 1168, md5 : "6c4c72f70490bff0d1589afb52a5dbd7", name : "font4.fnt"},{ bytes : 7007, md5 : "ef52a917299fe84415d6e3081a8f27c2", name : "font4.png"},{ bytes : 1254, md5 : "0b471fe85a2d1e09b549cd5564f1348d", name : "font5.fnt"},{ bytes : 7002, md5 : "9f808cfb66f8524d6b5bab335f197a3a", name : "font5.png"},{ bytes : 205431, md5 : "c4fa0e93aad5ea8f1e644a6c5180f05b", name : "game_scene_bg.png"},{ bytes : 74565, md5 : "8cba7d1072271df318685de4d5de55df", name : "game_title.png"},{ bytes : 118303, md5 : "8a82803863333a1f2c4fa6b0818af04f", name : "help_info.png"},{ bytes : 4708, md5 : "1cf2d9d4c8bfe4fba8ad6c26aa867c56", name : "high_score_icon.png"},{ bytes : 3786, md5 : "2d86369389d3b2d1201a641fb590bc46", name : "home_btn.png"},{ bytes : 18632, md5 : "6463a72dca63427a4de208ff4ef76183", name : "hud_bg.png"},{ bytes : 2574, md5 : "ad3129b5b7eba605c678925f9f49e2ea", name : "more_btn.png"},{ bytes : 2347, md5 : "be75f8379feac490f4252b8aaf50a0f3", name : "pause_btn.png"},{ bytes : 39857, md5 : "f7d0326582241d79d5f954e8d5dafb26", name : "play_btn2.png"},{ bytes : 1785, md5 : "e0bc0e08a561d45202a0e821c057bf10", name : "push_btn.png"},{ bytes : 4634, md5 : "481ede0e12fd538a715bd4139d3a4534", name : "replay_btn.png"},{ bytes : 1848, md5 : "15f9024bc01df35d08808756a0864d1e", name : "score_icon.png"},{ bytes : 12, md5 : "51163c9f36e8f0e8297a037d27802594", name : "settings.ini"},{ bytes : 35005, md5 : "b41917cb62844cb844d411def7980a4e", name : "sounds/bonus_sfx.mp3"},{ bytes : 9328, md5 : "19d4fa92aabbae414abb5d7796967c3b", name : "sounds/button_click_sfx.mp3"},{ bytes : 88249, md5 : "fec04370229effbdca3976eb57607fde", name : "sounds/game_over_sfx.mp3"},{ bytes : 119047, md5 : "56c804f5477d5c5f94062a70e25b8012", name : "sounds/level_end_sfx.mp3"},{ bytes : 9025, md5 : "29e17fd32fedaed5f35f3651978c5a16", name : "sounds/no_match_sfx.mp3"},{ bytes : 10553, md5 : "1ad88225b68f2d18ece32a70f50d1795", name : "sounds/pop_sfx.mp3"},{ bytes : 752233, md5 : "9227111b101029b91cf9c47cc6683734", name : "sounds/soundtrack1.mp3"},{ bytes : 4086, md5 : "341476b300952788f91e27322ea3f475", name : "sound_off_btn.png"},{ bytes : 4343, md5 : "982404300d7bf0c9fab52039c342dabd", name : "sound_on_btn.png"},{ bytes : 42633, md5 : "9fb44ec9ef0df0dd7b26a6a6a6559473", name : "spikes_block.png"}], boot : [{ bytes : 228421, md5 : "f0ad6bb02fedd5cbb729bae944b30133", name : "bg.png"},{ bytes : 6326, md5 : "73db62b72462fa0a993b5c1d71862472", name : "ldr_txt0.png"},{ bytes : 7561, md5 : "14301b56eaa13ba7e803724fff0194d0", name : "ldr_txt1.png"},{ bytes : 7327, md5 : "755ec639e53ff83afe23bfb2e5addb81", name : "ldr_txt2.png"},{ bytes : 5050, md5 : "b84cc9b6d32fcab1545ee72526cc44ff", name : "rot_phone.png"}]}]}};
flambe_asset_Manifest._supportsCrossOrigin = (function() {
	var detected = (function() {
		if(js_Browser.get_navigator().userAgent.indexOf("Linux; U; Android") >= 0) return false;
		var xhr = new XMLHttpRequest();
		return xhr.withCredentials != null;
	})();
	if(!detected) flambe_Log.warn("This browser does not support cross-domain asset loading, any Manifest.remoteBase setting will be ignored.");
	return detected;
})();
flambe_display_Sprite._scratchPoint = new flambe_math_Point();
flambe_display_Font.NEWLINE = new flambe_display_Glyph(10);
flambe_platform_BasicKeyboard._sharedEvent = new flambe_input_KeyboardEvent();
flambe_platform_BasicMouse._sharedEvent = new flambe_input_MouseEvent();
flambe_platform_BasicPointer._sharedEvent = new flambe_input_PointerEvent();
flambe_platform_html_CanvasRenderer.CANVAS_TEXTURES = (function() {
	var pattern = new EReg("(iPhone|iPod|iPad)","");
	return pattern.match(js_Browser.get_window().navigator.userAgent);
})();
flambe_platform_html_HtmlAssetPackLoader._mediaRefCount = 0;
flambe_platform_html_HtmlAssetPackLoader._detectBlobSupport = true;
flambe_platform_html_HtmlUtil.VENDOR_PREFIXES = ["webkit","moz","ms","o","khtml"];
flambe_platform_html_HtmlUtil.SHOULD_HIDE_MOBILE_BROWSER = js_Browser.get_window().top == js_Browser.get_window() && new EReg("Mobile(/.*)? Safari","").match(js_Browser.get_navigator().userAgent);
flambe_platform_html_WebAudioSound._detectSupport = true;
haxe_Serializer.USE_CACHE = false;
haxe_Serializer.USE_ENUM_INDEX = false;
haxe_Serializer.BASE64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789%:";
haxe_Unserializer.DEFAULT_RESOLVER = Type;
haxe_Unserializer.BASE64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789%:";
haxe_ds_ObjectMap.count = 0;
scenes_GameScene.cLevel = 1;
yzi_Sfx.soundsFolder = "sounds";
yzi_Sfx.isMuted = false;
yzi_Sfx.isGlobalMute = false;
yzi_YZI.defaultOrientation = flambe_display_Orientation.Portrait;
yzi_YZI.defaultFont = "default_font1";
yzi_YZI.systemBgColor = 3355443;
yzi_YZI.buttonClickSfx = "";
yzi_YZI.maskRootCont = true;
yzi_YZI.rootContYAlign = "middle";
yzi_YZI.useMouseHandCursor = false;
Main.main();
})();

//# sourceMappingURL=main-html.js.map