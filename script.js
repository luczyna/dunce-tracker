$(document).ready(function() {

	function init() {
		$('#settings').hide();
	}
	init();



	// add more list items to list out your tasks
	function addMoreItems() {
		var item = '<li class="item empty-field not-completed"><span class="controls">&#8942;</span><p contenteditable="true" class="title-individual">type something you need to do</p><div class="item-info"><p contenteditable="true" class="title-settings-individual">type</p><p contenteditable="true" class="notes empty-field">enter in any notes on this task</p><p class="button">done</p></div></li>';
		var list = $('#the-list');
		//tried .clone(), but it copied the first item word for word. 
		//if the item was updated, the whole thing would be copied, and I couldn't save a 'plain' clone
		$(item).appendTo(list);
	}
	$('.more').click(function() {
		addMoreItems();
		colorChange();
	});
	//keyboard shortcuts!
	Mousetrap.bind(['command n', 'ctrl n'], function() {
		addMoreItems();
		colorChange();
	});



	//open the settings dialogue when the icon is clicked
	$('#settings-icon').click(function() {
		var settings = $('#settings');
		
		//control the things about this settings dialogue
		titleSettings = settings.find('#list-title-settings');
		title = $('#list-title');

		if (titleSettings.text() !== title.text()) {
			titleSettings.text(title.text());
		}

		settings.fadeIn();
	});
		//keyboard shortcuts!
	Mousetrap.bind(['s s'], function() {
		var settings = $('#settings');
		
		//control the things about this settings dialogue
		titleSettings = settings.find('#list-title-settings');
		title = $('#list-title');

		if (titleSettings.text() !== title.text()) {
			titleSettings.text(title.text());
		}

		settings.fadeIn();
	});
	//close the settings dialogue and make the appropriate changes
	$('.closer').click(function() {
		var settings = $('#settings');

		//control the things about this settings dialogue
		titleSettings = settings.find('#list-title-settings');
		title = $('#list-title');

		if (titleSettings.text() !== title.text()) {
			title.text(titleSettings.text());
		}

		settings.fadeOut();
	});



	//open individual settings when the ... is clicked
	$('.controls').live('click', function() {
		console.log('you clicked it');
		var item = $(this).parent('.item');
		var settings = item.find('.item-info');
		var title = item.find('.title-individual');
		var titleSettings = settings.find('.title-settings-individual');
		
		//control the title... when it is changed it needs to be reflected in other areas
		if (title.text() != titleSettings.text()) {
			titleSettings.text(title.text());
		}
		settings.fadeIn(350);
	});
	//close the individual settings
	$('.button').live('click', function() {
		var settings = $(this).parent('.item-info');
		var item = settings.parent('.item');
		var title = item.find('.title-individual');
		var titleSettings = settings.find('.title-settings-individual');
		
		//control the title... when it is changed it needs to be reflected in other areas
		if (title.text() !== titleSettings.text()) {
			title.text(titleSettings.text());
		}
		settings.fadeOut(300);
	});



	//track your time!
	var running = false;
	var start, now, keepTrack;
	function timeKiller() {
		var control = $(this);
		var clock = $('#time-monitor');
		if (!running) {
			//change the button to say stop
			control.text('stop');
			start = new Date();
			keepTrack = start.getTime();
			clock.text('0 minutes');
			clock.show();
			running = true;
		} else if (running) {
			now = new Date();
			control.text('elapsed time');
			console.log(keepTrack);
			console.log(now.getTime());
			var elapsed = Math.round(((now.getTime() - start.getTime()) / 1000) / 60)
			clock.text(  + ' minutes') ;
			running = false;
		}
	}
	$('#time-control').click(timeKiller);



	//choose a color scheme!
	var scheme;
	function colorScheme() {
		var chosen = $(this);
		chosen.addClass('selected');
		chosen.siblings().removeClass('selected');
		scheme = chosen.attr('id');
		colorChange();
	}
	$('.color-choice').click(colorScheme);

	

	//change the color scheme
	function colorChange() {
		var colorReplace;
		var itemList = $('.item');
		var i, color, thisItem;

		if (scheme == 'warm') {
			for (i = 0; i < itemList.length; i++) {
				color = 255 - (i * 10);
				colorReplace = 'rgb(' + color + ', 70, 0)';
				thisItem = itemList[i];
				$(thisItem).css({'background': colorReplace, 'color': 'white'});
			}
		} else if (scheme == 'cool') {
			for (i = 0; i < itemList.length; i++) {
				if (i <= 20) {
					color = 100 + (i * 5);
					colorReplace = 'rgb(0, 70, ' + color + ')';
				} else {
					color = 70 + ((i - 20) * 5);
					colorReplace = 'rgb(0, ' + color + ', 225)';
				}
				thisItem = itemList[i];
				$(thisItem).css({'background': colorReplace, 'color': 'white'});
			}
		} else if (scheme == 'default') {
			for (i = 0; i < itemList.length; i++) {
				colorReplace = 'aquamarine';
				thisItem = itemList[i];
				$(thisItem).css({'background': colorReplace, 'color': 'black'});
			}
		} else if (scheme == 'custom') {
			for (i = 0; i < itemList.length; i++) {
				colorReplace = $('#custom').text();
				thisItem = itemList[i];
				$(thisItem).css({'background': colorReplace, 'color': 'black'});
			}
		}
		//end the colorChange()
	}

});








