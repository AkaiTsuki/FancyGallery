(function($){

	/* Debug flag*/
	var debugFlag = false;

	var methods={
		init: function(options){
			var settings = $.extend({}, $.fn.fancyGallery.defaults, options);

			return this.each(function() {

				var $this=$(this);
				
				createGallery($this,settings);
				setDimension(settings,$this);
				bindEvent($this,settings);
				
				debug("numDisplay: "+settings.numDisplay);
				
				hideAll($this,settings);
			});
		}
	};

	/*
	* Hide all lists in gallery except the start page
	* @$this: the element calling on the plugin
	* @settings: the settings of plugin
	*/
	function hideAll($this,settings){
		$this.find("li").hide();
		showCurrentPage($this,settings);
	}

	/*
	* Create gallery by adding control arrows
	* @target: the element calling on the plugin
	* @settings: the setting of the plugin
	*/
	function createGallery($target,settings){

		$target.attr('page',0);

		var $container=$('<div>').addClass('fancyGallery');
		var $leftArrow=createArrow("img/left-arrow.png",'leftArrow');
		var $rightArrow=createArrow("img/right-arrow.png",'rightArrow');
		
		$target.wrap($container);
		$target.before($leftArrow);
		$target.after($rightArrow);

	}


	/*
	* Set up the dimension of gallery elements
	* @settings: settings of the gallery plugin
	* @$this: the element calling on the plugin
	*/	
	function setDimension(settings,$this){
		setContainerWidth(settings,$this);
		var listWidth=setupListDimension(settings,$this);
		setGalleryHeight($this, settings);
		setArrowPosition(settings.arrowSizePixel,$this);
	}

	/*
	* Set up the container's width based on the gallery's width
	* @settings: settings of the gallery plugin
	* @$this: the element calling on the plugin
	*/	
	function setContainerWidth(settings,$this){
		var width = $('.fancyGallery').width() - (settings.arrowSizePixel + settings.listMarginRight)*2;
		$this.width(width);
		debug("fancyGallery width:"+width);
	}

	/*
	* Set up the container's width based on the gallery's width
	* @settings: settings of the gallery plugin
	* @$this: the element calling on the plugin
	*/
	function setGalleryHeight($this,settings){
		var height=0;
		
		if(settings.height==='auto'){
			height = $('li',$this).width();
		}else if(settings.height === 'max'){
			height = getMaximumHeight($this);
		}else{
			height = settings.height;
		}

		$this.parent().height(height);
	}

	/*
	* Get the maximum height of items in gallery
	* @$this: the element calling on the plugin
	*/
	function getMaximumHeight($this){
		var max=0;

		$('li',$this).each(function(){
			var h = $(this).outerHeight(true);
			if(h>max)
				max=h;
		});

		return max;
	}

	/*
	* Set up the arrow's position in y-cordinate based on the list's dimension
	* @arrowSize: the dimension of the arrow icon
	* @$this: the element calling on the plugin
	*/
	function setArrowPosition(arrowSize,$this){
		var top = $this.parent().outerHeight()/2 - arrowSize/2;
		$this.parent().find('.leftArrow').css('top',top);
		$this.parent().find('.rightArrow').css('top',top);
	}

	/*
	* Set up the list width, height and margin in gallery
	* @settings: settings of the gallery plugin
	* @$this: the element calling on the plugin
	*/	
	function setupListDimension(settings,$this){
		var width=$this.width();
		var listWidth=caculateListWidth(settings.numDisplay,settings.listMarginRight,width);

		$this.find('li').css({'width':listWidth}).each(function(index){
			if(index % (settings.numDisplay)==settings.numDisplay-1)
				$(this).addClass('clearMargin');
		});

		return listWidth;

		debug("fancyGallery ul width:"+width);
		debug("fancyGallery listWidth:"+listWidth);
	}


	/*
	* Caculate the list width based on list right-margin and
	* the parent container's width
	* @numDisplay: number of the list will be displayed in one page.
	* @listMarginRight: the width of right margin for each list in pixel
	* @containerWidth: the width of the list container.
	*/
	function caculateListWidth(numDisplay,listMarginRight,containerWidth){
		var marginNum=numDisplay-1;
		var	marginTotalWidth=marginNum*listMarginRight;
		var width = (containerWidth - marginTotalWidth)/numDisplay;
		return width;
	}

	/*
	* Create Control arrow
	* @src: image source
	* @className: css class: should be one of the following:
	* leftArrow || rightArrow
	*/
	function createArrow(src,className){
		var arrowImg=$("<img>").attr('src',src);
		var $a=$("<a href=''>").append(arrowImg);
		return $("<div>").addClass(className).append($a);	
	}


	/*
	*  Show lists in current page
	*  @$this: the element calling on the plugin
	*  @settings: the settings of plugin
	*/
	function showCurrentPage($this,settings){
		$('.pageShowing',$this).hide().removeClass('pageShowing');

		var page = parseInt($this.attr('page'));
		var capacity = settings.numDisplay;

		for (var i = 0; i < capacity; i++) {
			var index=getActualIndex(i,page,capacity);
			$('li',$this).eq(index).fadeIn(200).addClass('pageShowing');
		};
	}


	/*
	* Get the actual index of the list in container
	* @offset: the relative offset in each page
	* @page: the nth page
	* @capacity: the capacity of each page
	*/
	function getActualIndex(offset,page,capacity){
		return page*capacity+offset;
	}


	/*
	*  set current page to previous one, return whether the setting is succeed.
	*  @$this : the container of lists
	*/
	function prevPage($this){
		var currentPage = parseInt($this.attr('page'));
		var prev= currentPage - 1;
		if(prev>=0){
			$this.attr('page',prev); 
			return true;
		}
		return false;
	}

	/*
	* set current page to next one, return whether the setting is succeed.
	* @$this: the element calling on the plugin
	* settings: the settings of the plugin
	*/
	function nextPage($this,settings){
		var currentPage = parseInt($this.attr('page'));
		var next= currentPage + 1;
		var total = $('li',$this).length;
		var totalPageNum = Math.ceil(total/settings.numDisplay);
		if(next < totalPageNum){
			$this.attr('page',next); 
			return true;
		}
		return false;
	}

	/*
	* Bind click event on prev and next button
	* @$this: the element calling on the plugin
	* settings: the settings of the plugin
	*/
	function bindEvent($this,settings){
		$this.parent().find('.leftArrow a').click(function(){
			if(prevPage($this))
				showCurrentPage($this,settings);
			return false;
		});

		$this.parent().find('.rightArrow a').click(function(){
			if(nextPage($this,settings))
				showCurrentPage($this,settings);
			return false;
		});
	}


	/*
	* Print debug information to browser console
	* @msg: message will be printed
	*/
	function debug(msg){
		if(debugFlag)
			console.log(msg);
	}

	$.fn.fancyGallery=function(method){
		$.fn.fancyGallery.defaults={
			numDisplay: 4,   /* number of items could be showed in each page */
			listMarginRight: 20, /* the right margin of each item in gallery */
			arrowSizePixel: 40, /* The size of arrow icons in pixel */
			startPage: 0,  /* The start page of the pagination */
			height: "auto" /* The height of the gallery which does not contains paddings and margins*/
		};

		// Method calling logic
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.tooltip');
        }
	}	

})(jQuery)