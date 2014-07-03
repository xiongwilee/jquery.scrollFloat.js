/*
 * @name jquery.scrollFloat.js
 * @author wilee
 * @time 2014-04-16
 * @param {Object} options 选项参数
 * @demo
 * new $.scrollFloat({
 *	ele:'#test',
 *	scrTop:30
 * })
 * 
 */

(function($){
	$.scrollFloat = function(cfg){
		this.ele = cfg.ele;//操作的元素
		this.scrTop = cfg.scrTop || 20;//距离顶部的高度，默认为20px
		this.srcollStatus = false;

		this.bottomPos = function(){
			return this.Offset.top-$(document).scrollTop()+this.Height
		}

		this._slide = function(from,to,callback,time){
		    var frequence = 10;
		    var totalTime = time || 200;
		    var changeTimes =  totalTime/frequence;
		    var singleChange =  (to-from)/changeTimes;
		    var interval = setInterval(function(){
		        from = from + singleChange;
		        changeTimes--
		        if(changeTimes<0 || singleChange == 0){
		            clearInterval(interval)
		            callback(to)
		        }else{
		            callback(from)
		        }        
		    },frequence)
		}

		this.setSrcoll = function(bottomPos){
			var me = this;
			if(bottomPos>=0 && me.srcollStatus){
				me.srcollStatus = false;
				me.$ele.css({
					position:'',
					top:'',
					left:''
				})
			}else if(bottomPos<0 && !me.srcollStatus){
				me.srcollStatus = true;
				me.Offset.left = me.$ele.offset().left;
				me.$ele.css({
					position:'fixed',
					top:'-'+me.Height+'px',
					left:me.Offset.left
				})
				me._slide(-me.Height,me.scrTop,function(to){
					me.$ele.css({
						top:to+'px'
					})
				})
			}
		}

		this.render = function(){
			var me = this,
				left = me.Offset.left;
			$(window).on('scroll',function(evt){
				me.setSrcoll(me.bottomPos())
			})
		}

		var init = function(me){
			if(!me.ele) return;

			me.$ele = $(me.ele);
			me.Offset = me.$ele.offset();
			me.Height = me.$ele.height();

			me.render();

			return me;
		}(this)
	}
})(jQuery)
