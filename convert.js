var convertToWikitext = function() {
	var $bracket = $('.bracket'),
		$wikiBracket = $('<div>')
			.addClass('bracket');

		matchColumnWidth = 0;
		matchColumns = 0;
		connectorColumnTotalWidth = 0;

	$bracket.children('.bracket-section').each(function (index) {
		var $wikiSection = $('<div>');
		$(this).children('.bracket-column').each(function (index) {
			var $wikiColumn = $('<div>')
				.addClass($(this).attr('class'));
			$(this).children().each(function (index) {
				var $wikiElement = $('<div>');
				if ($(this).is('.bracket-header-container')) {
					var $bracketHeader = $(this).find('.bracket-header');

					$wikiElement.css('width', $(this).css('width'))
						.css('margin-top', $(this).css('margin-top'));
					$wikiElement.html($('<div>')
						.addClass('bracket-header')
						.html('{{{' + $bracketHeader.attr('id') + '|' + $bracketHeader.find('input').val() + '}}}');
					);
				}
				$wikiColumn.append($wikiElement);
			});

			$wikiSection.append($wikiColumn);
		});

		$wikiBracket.append($wikiSection);
	});
	console.log('html', $wikiBracket.html());
};
