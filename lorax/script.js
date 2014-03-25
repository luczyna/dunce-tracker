$(document).ready(function() {
	var informadata = [];
	initForstorData();
	// forstorData();
	
	function init() {
		$('#settings').hide();
		
		//is there a query for saved information?
		if ((window.location.search).indexOf('?') !== -1) {
			var query = window.location.search;
			//should return ?saved=someString
			query = query.replace('?saved=', '');
			if (checkLocalStorage(query)) {
				loadLocalStorage(query);
			}
		}
	}
	init();



	// add more list items to list out your tasks
	// param classes = string [class list]
	// param display = bool   [show this initially? useful for animations]
	// param title   = string [title]
	// param desc    = string [description of item]
	// param list    = object [where to append the item]
	function addMoreItems(classes, display, title, desc, list, clokan) {

		//default values
		classes = typeof classes !== 'undefined' ? classes : 'item empty-field not-completed';
		display = typeof display !== 'undefined' ? display : false;
		title   = typeof title   !== 'undefined' ? title   : 'type something you need to do';
		desc    = typeof desc    !== 'undefined' ? desc    : 'enter in any notes on this task';
		list    = typeof list    !== 'undefined' ? list    : '#the-list';
		clokan  = typeof clokan  !== 'undefined' ? clokan  : false;

		//clokan value
		var clokanIndex;
		if (clokan) {
			clokanIndex = clokan;
		} else {
			clokanIndex = forstorData();
		}

		//build our item
		var item = '<li class="' + classes + '"';
		if (!display) {
			item += 'style="display: none;" >';
		} else {
			item += '>';
		}
		item += '<span class="controls">&#9660;</span>';
		item += '<p contenteditable="true" class="title-individual">' + title + '</p>';
		item += '<div class="item-info">';
		item += '<p class="clokan init" data-count="' + clokanIndex + '">start a timer</p>';
		item += '<p contenteditable="true" class="notes empty-field">' + desc + '</p>';
		item += '<div class="status"><span class="delete-me">delete</span><span class="finish-me">finished</span></div></div></li>';
		var destination = $(list);

		//tried .clone(), but it copied the first item word for word. 
		//if the item was updated, the whole thing would be copied, and I couldn't save a 'plain' clone

		//if this will be visible in the end?
		if (display === false) {
			$(item).appendTo(destination).slideDown(150, 'linear');
		} else {
			destination.append($(item));
		}
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



	//open individual settings when the down arrow is clicked
	$('.controls').live('click', function() {
		// console.log('you clicked it');
		var item = $(this).parent('.item');
		var settings = item.find('.item-info');
		if (item.hasClass('active')) {
			settings.slideUp(350);
			item.removeClass('active');
		} else {
			settings.slideToggle(350);
			item.addClass('active');
		}
	});


	//enable the status options
	$('.status').find('span').live('click', function() {
		var item = $(this).parents('.item');
		var settings = item.find('.item-info');

		if ($(this).hasClass('delete-me')) {
			settings.slideUp(400, function() {
				item.delay(200).slideUp(100, 'linear', function() {
					item.addClass('deleted').appendTo('#archive');
				});
			});
		} else if ($(this).hasClass('finish-me') && item.hasClass('not-completed')) {
			settings.slideUp(300, function() {
				settings.find('.finish-me').text('not finished');
			}).queue(function() {
				item.removeClass('not-completed').addClass('completed');
				$(this).dequeue();
			});
		} else if ($(this).hasClass('finish-me') && item.hasClass('completed')) {
			settings.slideUp(300, function() {
				settings.find('.finish-me').text('finished');
			}).queue(function() {
				item.removeClass('completed').addClass('not-completed');
				$(this).dequeue();
			});
		}

	});

	$('.title-individual').live('click', function() {
		if ($(this).text() === 'type something you need to do') {
			// console.log('you are trying to change me, baby');
			$(this).selectText();
		}
	});

	$('.notes').live('click', function() {
		if ($(this).text() === 'enter in any notes on this task') {
			$(this).selectText();
		}
	});

	$('#list-title').live('click', function() {
		if ($(this).text() === 'Title of List') {
			$(this).selectText();
		}
	});

	$('#list-desc').live('click', function() {
		if ($(this).text() === 'Keep any notes on this list') {
			$(this).selectText();
		}
	});

	//http://stackoverflow.com/questions/12243898/how-to-select-all-text-in-contenteditable-div#answer-12244703
	jQuery.fn.selectText = function(){
		var doc = document;
		var element = this[0];

		// console.log(this, element);
		
		if (doc.body.createTextRange) {
			var range = document.body.createTextRange();
			range.moveToElementText(element);
			range.select();
			// console.log('first');
		} else if (window.getSelection) {
			var selection = window.getSelection();        
			var range = document.createRange();
			range.selectNodeContents(element);
			selection.removeAllRanges();
			selection.addRange(range);
			// console.log('second');
		}
	};


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
	function initForstorData() {
		//how many clokans are we dealing with initally?
		var amount = $('.clokan').length;
		
		//create an array for each clokan that will store the data on time
		for (var i = 0; i < amount; i++) {
			//store this in a global variable with a special name
				//I want to know a better way, bc Paul will always tell me to avoid global variables at all cost
			$('.clokan').eq(i).attr('data-count', i);
			// console.log(i);
			informadata[i] = [];
		}
		informadata['count'] = amount;
		// console.log(informadata);
	}

	function forstorData() {
		//we run this every time a new clock is added
		//the current clock count will go up by one everytime
		//remember that the count is based at 1, not 0
		var newCount = informadata['count'];
		informadata['count'] = newCount + 1;

		//this initiallizes the empty array for this particular clokan
		informadata[newCount] = [];

		console.log(informadata);
		//this give the count to be attributed to the new clokan
		return newCount;
	}
	

	//time killer testing
	$('.clokan').live('click', function() {
		clokanUpdate($(this));
	});


	//we calculate the time, and print it out
	function clokanUpdate(clokan) {
		//which clokan is this out of its brothers and sisters?
		var order = parseInt($(clokan).attr('data-count'), 10);
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
			// console.log(prettyTime);
			if (prettyTime > 3600) {
				prettyHour = (prettyTime / 3600).toFixed(2);
				$(clokan).text('paused at  ' + prettyHours + ' hours');
			} else if (prettyTime > 60) {
				var prettyMinutes = (prettyTime / 60).toFixed(2);
				$(clokan).text('paused at  ' + prettyMinutes + ' minutes');
			} else {
				$(clokan).text('paused at  ' + ((prettyTime).toFixed(2)) + ' seconds');
			}
			// console.log(informadata);

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

		var string = prompt('What would like to save this list as? Please enter a single word, no spaces or funny business.');
		// console.log(string);

		//set up a check value
		localStorage.setItem(string + '_list', 'true');

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
			localStorage.setItem(string + '_item-notes_' + i, $('.item').eq(i).find('.notes').text());
			localStorage.setItem(string + '_item-classes_' + i, $('.item').eq(i).attr('class'));
			localStorage.setItem(string + '_item-clokan_' + i, $('.item').eq(i).find('.clokan').attr('data-count'));
		}	

			//the time information
		localStorage.setItem(string + '_time', informadata.toString());

		//mark the save as having done it's job
		$('#save').addClass('saved');

		//tell the person that they can access this list
		alert('you can access this list later with lorax/index.html?s=' + string);
	});

	
	//this function will load all the saved localStorage information
	function loadLocalStorage(string) {
		//clear any existing items first
		$('.item').slideUp(100, function() {
			$(this).remove();
		});
		


		//what is the title of this list?
		$('#list-title').text(localStorage.getItem(string + '_list-title'));
		//what is the description?
		$('#list-desc').text(localStorage.getItem(string + '_list-desc'));

		//what is the color scheme?
		scheme = localStorage.getItem(string + '_color-scheme')
		colorChange();

		//now all the list items
		itemLength = parseInt(localStorage.getItem(string + '_list-length'), 10);

		for (var i = 0; i < itemLength; i++) {
			var title     = localStorage.getItem(string + '_item-title_' + i);
			var desc      = localStorage.getItem(string + '_item-notes_' + i);
			var classes   = localStorage.getItem(string + '_item-classes_' + i);
			var timeIndex = parseInt(localStorage.getItem(string + '_item-clokan_' + i), 10);
			var list;
			var display;

			//which list does this go to?
			//is this an archived item?
			if (classes.indexOf("deleted") != -1) {
				//this is archived
				list = '#archive';
				display = false;
			} else {
				//this goes in the main list
				list = '#the-list';
				display = true;
			}
			addMoreItems(classes, display, title, desc, list, timeIndex);
		}
		//end the for loop

		//get the time information
		//the time information
		var savedTimeString = localStorage.getItem(string + '_time');
		console.log(savedTimeString);
		//we are only using 1 clokan so far. if this ever changes, then this needs to change
		var arrayOfTime = savedTimeString.split(',');
		for (var j = 0; j < arrayOfTime.length; j++) {
			var numeral = parseInt(arrayOfTime[j], 10);
			informadata[0].push(numeral);
		}
		// console.log(informadata[0]);
	}



	//this function will check to make sure there is something to grab
	function checkLocalStorage(string) {
		if (localStorage.getItem(string + '_list') === 'true') {
			return true;
		} else {
			var alternatives = [];
			for (var i = 0; i < localStorage.length; i++) {
				var key = localStorage.key(i);

				//we check for any key that returns true... since that was our check initially.
				if (localStorage.getItem(key) === 'true') {
					var string = key.replace('_list', '');
					alternatives.push(string);
					delete string;
				}
				// key = NULL;
				delete key;
			}
			alert('did you mean something else? maybe the following: \n' + alternatives.toString());
			return false;
		}
	}

	$('.load-me').click(function() {
		var query = prompt('what did you save your list as?');
		if (checkLocalStorage(query)) {
				loadLocalStorage(query);
			}

	});




	//create a txt that someone can copy and save to something else
	function exportList() {
		var string;

		//save stuff to string
		//the title
		string = '<p>' + $('#list-title').text() + '</p>';
		string += '<p>' +$('#list-desc').text() + '</p>';

		//the list items
		for (var i = 0; i < $('.item').length; i++) {
			string += '<p>' + (i + 1) + '. ' + $('.item').eq(i).find('.title-individual').text() + '<br>';
			string += $('.item').eq(i).find('.notes').text() + '<br>';
			string += ' [ ';
			var classes = $('.item').eq(i).attr('class');
			if (classes.indexOf("deleted") != -1) {
				string += 'archived ';
			}
			if (classes.indexOf("completed") != -1) {
				string += 'completed ';
			}
			if (classes.indexOf("not-completed") != -1) {
				string += 'not completed ';
			}
			string += ']';
			string += '</p>';
		}

		//now show the entire list in a popup for someone to copy and paste
		$('#export-data').html(string);
		$('.export').fadeIn(300);
	}

	$('#export-me').click(function() {
		var settings = $('#settings');

		settings.fadeOut(250, function() {
			exportList();
		});
	});

	$('.close-export').click(function() {
		$('.export').fadeOut(300);
	});
});








