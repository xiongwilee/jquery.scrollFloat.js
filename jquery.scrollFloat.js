/*
 * @name jquery.scrollFloat.js
 * @author wilee
 * @time 2014-04-16
 * @param {Object} options 选项参数
 * @demo
 * new scrollFloat({
 *	ele:'#test',
 *	scrTop:30
 * })
 * 
 */
(function($){
    $.fn.extend({
    	scrollFloat:function(cfg){
    		var params = {
				cfg	:cfg,
				ele:$(this),	//操作的元素
				scrTop:cfg.scrTop || 0,//距离顶部的高度，默认为20px
				scrBottom:cfg.scrBottom || 0,//距离底部元素的距离，默认为20px
				$bottomWraEle:cfg.bottomEle ? $(cfg.bottomEle) : '',//可选参数
				showAll:cfg.showAll || true
    		}

    		var _scrollFloat = function(options){

    			this.srcollStatus = false;

    			$.extend(this,options);
    			
    		}

    		_scrollFloat.prototype = {
				bottomPos : function(){
					this.Height = this.Height || this.$ele.height();
					if(this.showAll){
						return this.Offset.top + this.Height - $(document).scrollTop()
					}else{		
						return this.Offset.top - $(document).scrollTop()
					}
				},
				bottomEle : function(){
					if(this.$bottomWraEle){
						var scrollOutPosition = this.wrapOffset.top + this.wrapHeight - $(document).scrollTop() - this.$ele.height(),
							bottomPosition = scrollOutPosition - this.scrTop - this.scrBottom;

						this.status_3_postion = bottomPosition;
						//console.log(bottomPosition+'\n');
						return bottomPosition;
					}
				},
				_slide : function(from,to,callback,time){
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
				},
				needFloat : function(){
					var status = 2;
					if(this.bottomPos()>=0){
						return 1;//第一种状态是原本的ele位置在可视区域内
					}

					var bottomPos = this.bottomEle();
					if(bottomPos && bottomPos <= 0){
						return 3;//第三种状态指当前的
					}
					return status;
				},
				setSrcoll : function(bottomPos){
					var me = this,
						bottomPos = me.needFloat();
					if(bottomPos == 1 && me.srcollStatus){
						me.srcollStatus = false;
						me.$ele.css({
							position:'',
							top:'',
							left:''
						})
					}else if(bottomPos == 2 && !me.srcollStatus){
						me.srcollStatus = true;
						me.Offset.left = me.$ele.offset().left;
						me.$ele.css({
							position:'fixed',
							top:'-'+me.Height+'px',
							left:me.Offset.left
						})

						if(this.showAll){
							me._slide(-me.Height,me.scrTop,function(to){
								me.$ele.css({
									top:to+'px'
								})
							})
						}else{
							me.$ele.css({
								top:me.scrTop+'px'
							})
						}
					}else if(bottomPos == 3 && me.srcollStatus){
						me.srcollStatus = true;
						me.Offset.left = me.$ele.offset().left;
						me.$ele.css({
							position:'fixed',
							top: me.status_3_postion+'px',
							left:me.Offset.left
						})
					}
				},
				render : function(){
					var me = this,
						left = me.Offset.left;
					$(window).on('scroll',function(evt){
						me.setSrcoll()
					})
				},
				init : function(){
					var me = this;

					if(!me.ele) return;

					me.$ele = $(me.ele);
					me.Offset = me.$ele.offset();
					me.Height = me.$ele.height();

					if(me.$bottomWraEle){
						me.wrapHeight = me.$bottomWraEle.height();
						me.wrapOffset = me.$bottomWraEle.offset();
					}

					me.render();

					return me;
				}
			}

			var ScrollFloat = new _scrollFloat(params);

			ScrollFloat.init();

			return ScrollFloat;
    	}
    });
})(jQuery);