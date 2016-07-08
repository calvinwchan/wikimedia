var template,
	categoryInput,
	categoryOutput,
	categorySortMethod,
	categorySortTitle,
	entryInput,
	response,
	up,
	selected,
	search,
	numArticles;

function sortByKeyAscending(array, key) {
	return array.sort(function(a, b) {
		var x = a[key];
		var y = b[key];
		return ((x < y) ? -1 : ((x > y) ? 1 : 0));
	});
}

function sortByKeyDescending(array, key) {
	return array.sort(function(a, b) {
		var x = a[key];
		var y = b[key];
		return ((x > y) ? -1 : ((x < y) ? 1 : 0));
	});
}

function categorySearch() {
	$.get('/categorySearch', { input: categoryInput.val(), numArticles: numArticles }, function(req, res, data) {
		response = data['responseJSON'];

		sortByKeyDescending(response, categorySortMethod);
		for (entry in response) {
			response[entry]['urltitle'] = "https://en.wikipedia.org/wiki/" + encodeURIComponent(response[entry]['title']);
			response[entry]['score'] = response[entry][categorySortMethod];
		}

		categoryOutput.html(template(response));
		$('#score-title').html(categorySortTitle);
	});
}

$(function() {
	template = Handlebars.compile($('#results-template').html());
	categoryInput = $('#category-input');
	categoryOutput = $('#category-output');
	entryInput = $('#entry-input');
	methodDropdown = $('#methodologies');
	up = true;
	selected = 'flesch';
	search = $('#search-wrapper');

	$('#sort-container').click(function(e) {
		if (up) {
			$('#sort-arrow').addClass('fa-angle-down').removeClass('fa-angle-up');
			$('#sort-options').show();
		} else {
			$('#sort-arrow').addClass('fa-angle-up').removeClass('fa-angle-down');
			$('#sort-options').hide();
		}
		up = !up;
	});

	$('.sort').click(function(e) {
		up = true;
		var id = $(this).attr('id');
		$('#sort-arrow').addClass('fa-angle-up').removeClass('fa-angle-down');
		$('#sort-options').slideUp('fast');

		if (id == 'flesch') {
			selected = id;
			$('#sort').html('Flesch Reading Ease');
		} else if (id == 'fleschKincaidGrade') {
			selected = id;
			$('#sort').html('Flesch-Kincaid Grade Level');
		} else if (id == 'gunningFogScore') {
			selected = id;
			$('#sort').html('Gunning-Fog Index');
		} else if (id == 'colemanLiauIndex') {
			selected = id;
			$('#sort').html('Coleman-Liau Index');
		} else if (id == 'smogIndex') {
			selected = id;
			$('#sort').html('SMOG Grade');
		} else if (id == 'automatedReadabilityIndex') {
			selected = id;
			$('#sort').html('Automated Readability Index');
		}
		$('#sort').addClass('black');

		if (response) {
			categorySortMethod = selected;
			categorySortTitle = $('#sort').html();

			sortByKeyDescending(response, categorySortMethod);
			for (entry in response) {
				response[entry]['urltitle'] = "https://en.wikipedia.org/wiki/" + encodeURIComponent(response[entry]['title']);
				response[entry]['score'] = response[entry][categorySortMethod];
			}

			categoryOutput.html(template(response));
			$('#score-title').html(categorySortTitle);
		}
	});

	search.click(function(e) {
		categoryOutput.html('<div class="spinner"><i class="fa fa-spinner fa-spin"></i></div>');
		categorySortMethod = selected;
		categorySortTitle = $('#sort').html();
		numArticles = (((Number(entryInput.val()) === 0) || (Number(entryInput.val()) === NaN)) ? 10 : Number(entryInput.val()));
		categorySearch();
	});
});
