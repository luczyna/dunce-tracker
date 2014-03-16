$(document).ready(function() {

	function init() {
		$('#settings').hide();
	}
	init();



	// add more list items to list out your tasks
	function addMoreItems() {
		var item = '<li class="item empty-field not-completed" style="display: none;"><span class="controls">&#8942;</span><p contenteditable="true" class="title-individual">type something you need to do</p><div class="item-info"><p contenteditable="true" class="title-settings-individual">type</p><p contenteditable="true" class="notes empty-field">enter in any notes on this task</p><p class="button">done</p><div class="status"><span class="delete-me">delete</span><span class="finish-me">finished</span></div></div></li>';
		var list = $('#the-list');
		//tried .clone(), but it copied the first item word for word. 
		//if the item was updated, the whole thing would be copied, and I couldn't save a 'plain' clone
		$(item).appendTo(list).slideToggle(150, 'linear');
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


	//enable the status options
	$('.status').find('span').click(function() {
		var item = $(this).parents('.item');
		var settings = item.find('.item-info');

		if ($(this).hasClass('delete-me')) {
			settings.fadeOut(250, function() {
				item.slideUp(250, 'linear', function() {
					item.addClass('deleted').appendTo('#archive');
				});
			});
		} else if ($(this).hasClass('finish-me') && item.hasClass('not-completed')) {
			settings.fadeOut(300, function() {
				settings.find('.finish-me').text('not finished');
				item.removeClass('not-completed').addClass('completed');
			});
		} else if ($(this).hasClass('finish-me') && item.hasClass('completed')) {
			settings.fadeOut(300, function() {
				settings.find('.finish-me').text('finished');
				item.removeClass('completed').addClass('not-completed');
			});
		}

	});



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






	//before we do time-killer testing, we need to start the storage of data for each available clokan that can possibly be run.
	var informadata = [];
	function forstorData() {
		//how many clockans are we dealing with?
		var amount = $('.clokan').length;
		
		//create an array for each clokan that will store the data on time
		for (var i = 0; i < amount; i++) {
			//store this in a global variable with a special name
				//I want to know a better way, bc Paul will always tell me to avoid global variables at all cost
			var nameThis = 'clockan' + i;
			informadata[i] = [];
		}
	}
	forstorData();

	//time killer testing
	$('.clokan').on('click', function() {
		clokanUpdate($(this));
	});


	//we calculate the time, and print it out
	function clokanUpdate(clokan) {
		//which clokan is this out of its brothers and sisters?
		var order = $(clokan).index();
		// console.log(order);
		//something was clicked, so we need to mark it's time.
		var click = new Date();

		//check whether or not it is waiting to start, is running, or is paused
		if ($(clokan).hasClass('init')) {
			$(clokan).removeClass('init').addClass('running');
			$(clokan).text('recording');

			// record the time that this event has happened to this specific clokan
			informadata[order].push(click.getTime());
			// console.log(informadata[order]);

		} else if ($(clokan).hasClass('running')) {
			$(clokan).removeClass('running').addClass('paused');
			informadata[order].push(click.getTime());

			//we need to know how many start/stop pairs of data there are.
			var clickAmount = informadata[order].length;
			var addTheseTogether = [];
			for (var j = (clickAmount / 2); j > 0; j--) {
				//take start stop pair, as j and the previous entry to j
				//subtract start from stop to find elapsed time
				//put this elapsed time to the array we're saving them to
				//remember that .length returns a number starting from 1, and our arrays start at 0
				addTheseTogether.push(informadata[order][(j * 2 - 1)] - informadata[order][(j * 2 - 2)]);
			}
			var timeLogged = 0;
			for (var k = 0; k < addTheseTogether.length; k++) {
				timeLogged = timeLogged + addTheseTogether[k];
			}

			// console.log(timeLogged);
			var prettyTime = timeLogged / 1000;
			if (prettyTime > 60) {
				var prettyMinutes = (prettyTime / 60).toFixed(2);
				$(clokan).text('paused at  ' + prettyMinutes + ' minutes');
			} else if (prettyTime > 3600) {
				prettyHour = (prettyTime / 3600).toFixed(2);
				$(clokan).text('paused at  ' + prettyHours + ' hours');
			} else {
				$(clokan).text('paused at  ' + ((prettyTime).toFixed(2)) + ' seconds');
			}

		} else if ($(clokan).hasClass('paused')) {
			$(clokan).removeClass('paused').addClass('running');
			informadata[order].push(click.getTime());
			$(clokan).text('recording');

		}
	}


	//save our information into the localStorage!
	$('#save').click(function() {
		//pause the timer if it is running
		if($('.clokan').hasClass('running')) {
			clokanUpdate($(this));
		}

		//now go through the information
		if(!$(this).hasClass('saved')) {
			var string = prompt('What would like to save this list as?');
			console.log(string);

			//start the saving into localStorage
				//the title and list information
			localStorage.setItem(string + '_list-title', $('#list-title').text());
			localStorage.setItem(string + '_list-desc', $('#list-desc').text());
			if (!scheme) {
				localStorage.setItem(string + '_color-scheme', scheme);
			} else {
				localStorage.setItem(string + '_color-scheme', 'default');
			}

				//the list items
			localStorage.setItem(string + '_list-length', $('.item').length);
			for (var i = 0; i < $('.item').length; i++) {
				localStorage.setItem(string + '_item-title_' + i, $('.item').eq(i).find('.title-individual').text());
				localStorage.setItem(string + '_item_notes_' + i, $('.item').eq(i).find('.notes').text());
				localStorage.setItem(string + '_item_classes_' + i, $('.item').attr('class'));
			}			

				//the time information
			localStorage.setItem(string + '_time', informadata.toString());

			//mark the save as having done it's job
			$('#job').addClass('saved');

			//tell the person that they can access this list
			alert('you can access this list later with index.html?s=' + string);
		} else {
			console.log('why, lord?');
		}
	});

	
	//this function will load all the saved localStorage information

});








