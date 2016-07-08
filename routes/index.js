const getFirstItem = function(obj) {
	const key = Object.keys(obj).shift();
	return obj[key];
};

const fetchArticles = function(data, res) {
	var output = [];
	var counter = 0;
	for (entry in data) {
		var params = {
			action: 'query',
			prop: 'extracts',
			explaintext: true,
			exintro: true
		};

		// both page ID or title can be provided
		if (typeof data[entry].title === 'number') {
			params.pageids = data[entry].title;
		}
		else {
			params.titles = data[entry].title;
		}

		let pageid = data[entry].pageid;
		let entryData = data[entry];

		wikiclient.api.call(
			params,
			function(err, info, next, returnedData) {
				pageid = pageid.toString();
				let extract = returnedData.query.pages[pageid].extract;
				let stats;
				let outputEntry = entryData;

				try {
					stats = textstatistics(extract);
					outputEntry['flesch'] = stats.fleschKincaidReadingEase();
					outputEntry['fleschKincaidGrade'] = stats.fleschKincaidGradeLevel();
					outputEntry['gunningFogScore'] = stats.gunningFogScore();
					outputEntry['colemanLiauIndex'] = stats.colemanLiauIndex();
					outputEntry['smogIndex'] = stats.smogIndex();
					outputEntry['automatedReadabilityIndex'] = stats.automatedReadabilityIndex();
					output.push(outputEntry);
				} catch (e) {
					outputEntry['flesch'] = 0;
					outputEntry['fleschKincaidGrade'] = 0;
					outputEntry['gunningFogScore'] = 0;
					outputEntry['colemanLiauIndex'] = 0;
					outputEntry['smogIndex'] = 0;
					outputEntry['automatedReadabilityIndex'] = 0;
					output.push(outputEntry);
				}

				if (++counter == data.length) {
					res.send(output);
				}
			}
		);
	}
}

exports.view = function(req, res) {
	res.render('index', {layout: 'index'});
}

exports.categorySearch = function(req, res) {
	const params = {
		action: 'query',
		list: 'categorymembers',
		cmtitle: 'Category:' + req.query.input,
		cmlimit: req.query.numArticles
	}

	var categoryMembers;

	wikiclient.api.call(
		params,
		function(err, info, next, data) {
			categoryMembers = data.query.categorymembers;
			fetchArticles(categoryMembers, res);
		}
	);
}
