// TODO:
// Reorder elements
// Assign Round ID
// Assign player origins (D, W)
$.ui.plugin.add("resizable", "baseY", {
	resize: function(event, ui) {
		var self = $(this).data("uiResizable"), o = self.options, cs = self.size, os = self.originalSize,
			op = self.originalPosition, a = self.axis, ratio = o._aspectRatio || event.shiftKey;
		var ry = Math.round(Math.log(cs.height / (o.baseY||1)) / Math.log(2));
		if (ry < 0) { ry = 0 };
		var oy = Math.pow(2, ry) * (o.baseY||1) - os.height;

		self.size.height = os.height + oy;

		$(this).removeClass(function(index, oldClass) {
				return (oldClass.match('bracket-cell-r[1-7]') || []).join(' ');
			}).addClass('bracket-cell-r' + (ry + 1));
	}
});
$(function() {
	var bracketdesigner = {};
	bracketdesigner.fn = {};

	bracketdesigner.fn.insertGameColumnBefore = function (event, ui) {
		bracketdesigner.fn.insertColumn(
			$(ui.target).closest('.bracket-column-header-section').index(),
			$(ui.target).closest('.bracket-column-header').index(),
			'game', 'before'
		);
	};
	bracketdesigner.fn.insertGameColumnAfter = function (event, ui) {
		bracketdesigner.fn.insertColumn(
			$(ui.target).closest('.bracket-column-header-section').index(),
			$(ui.target).closest('.bracket-column-header').index(),
			'game', 'after'
		);
	};
	bracketdesigner.fn.insertConnectorColumnBefore = function (event, ui) {
		bracketdesigner.fn.insertColumn(
			$(ui.target).closest('.bracket-column-header-section').index(),
			$(ui.target).closest('.bracket-column-header').index(),
			'connector', 'before'
		);
	};
	bracketdesigner.fn.insertConnectorColumnAfter = function (event, ui) {
		bracketdesigner.fn.insertColumn(
			$(ui.target).closest('.bracket-column-header-section').index(),
			$(ui.target).closest('.bracket-column-header').index(),
			'connector', 'after'
		);
	};
	bracketdesigner.fn.insertColumn = function (sectionIndex, columnIndex, type, side) {
		var width,
			$columnHeader, $column;
		console.log('iC');
		switch (type) {
		case 'connector':
			width = 20;
			break;
		case 'game':
		default:
			width = 170;
		}
		$columnHeader = $(insertStrings.columnHeader
				.replace('@width', width)
				.replace('@type', type));
		$.fn[side].call($('.bracket-column-header-section').eq(sectionIndex).find('.bracket-column-header').eq(columnIndex),
			$columnHeader);
		liveColumnHeader.call($columnHeader);

		$column = $(insertStrings.column
				.replace('@width', width)
				.replace('@type', type));
		$.fn[side].call($('.bracket-section').eq(sectionIndex).find('.bracket-column').eq(columnIndex),
			$column);
		liveColumn.call($column);
		
		numberColumns();
	};
	
	// bracketdesigner.dialog
	bracketdesigner.dialog = {};
	bracketdesigner.dialog.handleCmd = function (event, ui) {
		console.log('handleCmd', event, ui);
		bracketdesigner.dialog.dialogs[ui.cmd].init(event, ui);
		bracketdesigner.dialog.dialogs[ui.cmd].elem.dialog('open');
	};
	bracketdesigner.dialog.dialogs = {};
	bracketdesigner.dialog.dialogs.changeTopMargin = {
		elem: $('#change-top-margin-dialog'),
		init: function (event, ui) {
			$(ui.target).closest('.bracket-header-super-container').addClass('change-top-margin-target');
		},
		options: {
			title: 'Change top margin',
			buttons: {
				'OK' : function() {
					var $topMarginElem = $('.bracket .change-top-margin-target').find('.bracket-header-top-margin'),
					margin = $('#top-margin').val();
					if (typeof margin !== 'undefined' && !isNaN(margin)) {
						$topMarginElem.css('height', margin + 'px');
					}
					$(this).dialog('close');
				},
				'Cancel' : function() {
					$(this).dialog('close');
				}
			},
			open: function (event, ui) {
				var $topMarginElem = $('.bracket .change-top-margin-target').find('.bracket-header-top-margin');
				$('#top-margin').val(parseInt($topMarginElem.css('height')));
			},
			close: function (event, ui) {
				$('.bracket .change-top-margin-target').removeClass('change-top-margin-target');
			}
		}
	};
	for (var i in bracketdesigner.dialog.dialogs) {
		var dialog = bracketdesigner.dialog.dialogs[i],
			options = { autoOpen: false, modal: true };
		$.extend(options, dialog.options);
		dialog.elem.dialog(options);
	}

	var insertStrings = {
		'sectionHeader': '<div style="width:@widthpx;" class="bracket-section-header">A</div>',
		'columnHeaderSection': '<div style="width:@widthpx;" class="bracket-column-header-section"></div>',
		'section': '<div style="width:@widthpx;" class="bracket-section"></div>',
		'columnHeader': '<div style="width:@widthpx;" class="bracket-column-header bracket-@type-column-header">1</div>',
		'column': '<div style="width:@widthpx;" class="bracket-column bracket-@type-column"></div>',
		'game': '<div class="bracket-element bracket-game" id="bracket-game-">' +
				'<div class="bracket-cell bracket-cell-r1" id="bracket-cell-">' +
					'<div class="bracket-player-top"><div class="bracket-score" style="width:21px"> </div></div>' +
				'</div>' +
				'<div class="bracket-cell bracket-cell-r1" id="bracket-cell-">' +
					'<div class="bracket-player-bottom"><div class="bracket-score" style="width:21px"> </div></div>' +
				'</div>' +
			'</div>',
		'thirdplacematch': '<div class="bracket-element bracket-game bracket-thirdplacematch" id="bracket-game-" style="margin-top:11px;">' +
				'<div class="bracket-cell bracket-cell-r1" id="bracket-cell-">' +
					'<div class="bracket-player-top"><div class="bracket-score" style="width:21px"> </div></div>' +
				'</div>' +
				'<div class="bracket-cell bracket-cell-r1" id="bracket-cell-">' +
					'<div class="bracket-player-bottom"><div class="bracket-score" style="width:21px"> </div></div>' +
				'</div>' +
				'<div class="bracket-thirdplacematchlabel" style="position:absolute;width:100%;text-align:center;top:-6px"><b>3rd Place Match</b></div>' +
			'</div>'
	};

	var sameColumnWidth = $('#same-column-width').is(':checked');
	$('#same-column-width').click(function() {
		sameColumnWidth = $(this).is(':checked');
	});

	$('#bracket-game-column-width').on('change', function() {
		var width = parseInt($(this).val(), 10) || 0;
		if (width > 99 && width <= 300) {
			resizeColumns({'type': 'game'}, $(this).val());
		} else {
			alert('Game column width must be a decimal number between 100 and 300.');
			$(this).val(width < 100 ? 100 : 300);
		}
	});

	$('#bracket-connector-column-width').on('change', function() {
		var width = parseInt($(this).val(), 10) || 0;
		if (width > 9 && width <= 100 && Math.round(width / 2) == width / 2) {
			resizeColumns({'type': 'connector'}, $(this).val());
		} else {
			alert('Game column width must be an even number between 10 and 100.');
			$(this).val(width < 10 ? 10 : 100);
		}
	});

	$('#bracket-score-width').on('change', function() {
		var width = parseInt($(this).val(), 10) || 0;
		if (width > 20 && width <= 32) {
			resizeScores($(this).val());
		} else {
			alert('Game column width must be a decimal number between 21 and 32.');
			$(this).val(width < 21 ? 21 : 32);
		}
	});

	$('#bracket-show-cell-helper').click(function() {
		$('.bracket').toggleClass('bracket-cell-helper-on', $(this).is(':checked'));
	});
	$('#bracket-show-resizable-bottom-borders').click(function() {
		$('.bracket').toggleClass('bracket-resizable-bottom-borders-on', $(this).is(':checked'));
	});
	$('#bracket-show-game-ids').click(function() {
		$('.bracket').toggleClass('bracket-game-ids-on', $(this).is(':checked'));
	});
	$('#bracket-show-cell-ids').click(function() {
		$('.bracket').toggleClass('bracket-cell-ids-on', $(this).is(':checked'));
	});
	$('#bracket-show-column-overlays').click(function() {
		$('.bracket').toggleClass('bracket-column-overlays-on', $(this).is(':checked'));
		$('.bracket-column').sortable('option', 'disabled', $(this).is(':checked'));
	});
	$('.bracket')
		.toggleClass('bracket-cell-helper-on', $('#bracket-show-cell-helper').is(':checked'))
		.toggleClass('bracket-resizable-bottom-borders-on', $('#bracket-show-resizable-bottom-borders').is(':checked'))
		.toggleClass('bracket-game-ids-on', $('#bracket-show-game-ids').is(':checked'))
		.toggleClass('bracket-cell-ids-on', $('#bracket-show-cell-ids').is(':checked'));

	$('.bracket-section-header-row').sortable({
		placeholder: 'bracket-section-header placeholder',
		forcePlaceholderSize: true,
		//containment: 'parent',
		stop: function (event, ui) {
			var oldIndex = ui.item.text().charCodeAt(0) - 'A'.charCodeAt(0),
				newIndex = ui.item.index(),
				$bracketHeaderSection = $('.bracket-column-header-section').eq(oldIndex);
				$bracketSection = $('.bracket-section').eq(oldIndex);
			if (oldIndex == newIndex) {
				return true;
			}
			$bracketHeaderSection.detach();
			$bracketSection.detach();
			if (oldIndex < newIndex) {
				console.log(oldIndex, '<', newIndex);
				$('.bracket-column-header-section').eq(newIndex - 1).after($bracketHeaderSection);
				$('.bracket-section').eq(newIndex - 1).after($bracketSection);
			} else {
				console.log(oldIndex, '>', newIndex);
				$('.bracket-column-header-section').eq(newIndex).before($bracketHeaderSection);
				$('.bracket-section').eq(newIndex).before($bracketSection);	
			}
			numberSectionHeaders();
		}
	});
	$('.bracket-column-header-row').data('selected', '');
	var resizeSection = function (sectionIndex, width) {
		$('.bracket-section').eq(sectionIndex).css('width', width + 'px');
		$('.bracket-column-header-section').eq(sectionIndex).css('width', width + 'px');
	};
	var updateSectionsWidth = function () {
		var totalWidth = 0;
		$('.bracket-section').each(function (index) {
			var width = 0,
				isSectionBroken = false,
				maxColumnWidth = 0;
			$(this).find('.bracket-column').each(function () {
				if (!isSectionBroken) {
					width += $(this).width();
				}
				console.log(index, $(this).width());
				isSectionBroken |= $(this).is('.bracket-column-break');
				if ($(this).width() > maxColumnWidth) {
					maxColumnWidth = $(this).width();
				}
			});
			width = Math.max(width, maxColumnWidth);
			$(this).css('width', width + 'px');
			$('.bracket-column-header-section').eq(index).css('width', width + 'px');
			totalWidth += width;
			console.log(totalWidth);
		});
		$('.bracket').css('width', totalWidth + 'px');
	}
	var resizeColumns = function (options, width) {
		var $connectorsUpDown,
			columnType;

		console.log('rCs', options);

		if (options.type !== undefined) {
		 	columnType = options.type;
		} else if (options.sectionIndex !== undefined && options.columnIndex !== undefined) {
			columnType = $('.bracket-section').eq(options.sectionIndex)
				.find('.bracket-column').eq(options.columnIndex)
				.data('columnType');
		}

		console.log('type:', columnType);

		switch (columnType) {
		case 'game':
			$('.bracket-game-column').css('width', width + 'px').each(function () {
				var columnIndex = $(this).index(),
					sectionIndex = $(this).parent().index('.bracket-section');
				resizeGameColumn(sectionIndex, columnIndex, width);
				//$('.bracket-column-header-section').eq(sectionIndex).find('.bracket-column-header').eq(columnIndex)
					//.css('width', width + 'px');
			});
			break;
		case 'connector':
			$('.bracket-connector-column').css('width', width + 'px').each(function () {
				var columnIndex = $(this).index(),
					sectionIndex = $(this).parent().index('.bracket-section');
				$('.bracket-column-header-section').eq(sectionIndex).find('.bracket-column-header').eq(columnIndex)
					.css('width', width + 'px');

				// Up and down connectors
				$connectorsUpDown = $(this).find('.bracket-connector-down, .bracket-connector-up');
				$connectorsUpDown.find('.bracket-connector-left, .bracket-connector-right,' +
					'.bracket-connector-left > div, .bracket-connector-right > div')
					.css('width', (Math.round(width*.5) - 1) + 'px');				
				// Drop connectors
				$(this).find('.bracket-connector-drop .bracket-connector-left,' +
					'.bracket-connector-drop .bracket-connector-right')
					.css('width', (Math.round(width*.5) - 1) + 'px');
			});
			break;
		}
		$('#bracket-' + columnType + '-column-width').val(width);
		updateSectionsWidth();
	};
	var resizeGameColumn = function (sectionIndex, columnIndex, width) {
		var $column = $('.bracket-column-header-section').eq(sectionIndex).find('.bracket-column-header').eq(columnIndex),
			scoreWidth = $('#bracket-score-width').val();

		if ($column.find('.bracket-double-score-game').length > 0) {
			width += scoreWidth;
		}

		$column.css('width', width + 'px');
	};
	// Deprecated
	var resizeColumn = function (sectionIndex, columnIndex, width) {
		var $connectorsUpDown,
			$column = $('.bracket-section').eq(sectionIndex).find('.bracket-column').eq(columnIndex);
		console.log($column, sectionIndex, columnIndex, width + 'px');

		$column.css('width', width + 'px');
		if ($column.is('.bracket-connector-column')) {
			// Up and down connectors
			$connectorsUpDown = $column.find('.bracket-connector-down, .bracket-connector-up');
			if (width <= 20) {
				$connectorsUpDown.find('.bracket-connector-left, .bracket-connector-right,' +
					'.bracket-connector-left > div, .bracket-connector-right > div')
					.css('width', (Math.round(width*.5) - 1) + 'px');
			} else {
				$connectorsUpDown.find('.bracket-connector-left, .bracket-connector-left > div')
					.css('width', '9px');
				$connectorsUpDown.find('.bracket-connector-right, .bracket-connector-right > div')
					.css('width', (width - 11) + 'px');
			}
			// Drop connectors
			console.log($column, '**', $column.find('.bracket-connector-drop .bracket-connector-left'));
			$column.find('.bracket-connector-drop .bracket-connector-left')
				.css('width', (width - 11) + 'px');
		}
	};
	var resizeScores = function (width) {
		$('.bracket-score').css('width', width + 'px');
	};
	var resizeConnector = function (connector, height) {
		var number, inHeight;

		$(connector).css('height', height + 'px');
		if ($(connector).is('.bracket-connector-drop')) {
			$(connector).children('.bracket-connector-right').css('height', (height - 2) + 'px');
		} else {
			if ($(connector).is('.bracket-connector-down')) {
				number = 0;
			} else {
				number = 1;
			}
			$(connector).children('.bracket-connector-part').each(function(){
				inHeight = height - 8 - ($(this).is('.bracket-connector-left') ? 2 : 0);
				$(this).find('div').eq(number).css('height', inHeight + 'px');
			});
		}
	};

	$('.bracket-toolbar-item').draggable({
		helper: 'clone',
		cursor: 'move',
		revert: 'invalid',
		connectToSortable: '.bracket-column',
		zIndex: 95
	});
	
	var deleteElementWithDialog = function (event, ui) {
		$(this).addClass('delete-target');
		$('#delete-element-dialog').dialog('open');
	};
	var addScoreColumn = function (event, ui) {
		var columnIndex = $(ui.target).closest('.bracket-column').index(),
			sectionIndex = $(ui.target).closest('.bracket-section').index('.bracket-section');
		console.log('addScoreColumn', sectionIndex, columnIndex, $(ui.target));

		$('.bracket-double-score-game').removeClass('.bracket-double-score-game');
		$(ui.target).closest('.bracket-game').addClass('bracket-double-score-game');
		resizeGameColumn(sectionIndex, columnIndex, $('#bracket-game-width').val());
	};
	var resizeGame = function (event, ui) {
		$(ui.target).closest('.bracket-game').addClass('resize-target');
		$('#game-height-dialog').dialog('open');		
	};
	var resizeClassic = function (event, ui) {
		console.log(this);
		$(this).addClass('resize-target');
		$('#simple-height-dialog').dialog('open');
	};
	var resizeColumnWithDialog = function (event, ui) {
		$(ui.target).addClass('resize-target');
		$('#column-width-dialog').dialog('open');
	};
	var resizeSectionWithDialog = function (event, ui) {
		$(ui.target).addClass('resize-target');
		$('#section-width-dialog').dialog('open');
	};
	var emptySectionWithDialog = function (event, ui) {
		$(ui.target).addClass('empty-target');
		$('#empty-section-dialog').dialog('open');
	};
	var emptyColumnWithDialog = function (event, ui) {
		$(ui.target).addClass('empty-target');
		$('#empty-column-dialog').dialog('open');
	};
	var setAsBreakColumn = function(event, ui) {
		var $columnHeader = $(ui.target).closest('.bracket-column-header'),
			columnIndex = $columnHeader.index(),
			sectionIndex = $columnHeader.closest('.bracket-column-header-section').index('.bracket-column-header-section');
		console.log("setAsBreakColumn", $(ui.target), sectionIndex, columnIndex);

		removeBreakColumn(sectionIndex);
		$('.bracket-section').eq(sectionIndex).find('.bracket-column').eq(columnIndex).addClass('bracket-column-break');
		$columnHeader.addClass('bracket-column-header-break');
		updateSectionsWidth();
	};
	var removeBreakColumn = function(sectionIndex) {
		$('.bracket-section').eq(sectionIndex).find('.bracket-column-break').removeClass('bracket-column-break');
		$('.bracket-column-header-section').eq(sectionIndex).find('.bracket-column-header-break').removeClass('bracket-column-header-break');
	};
	var insertSectionBefore = function (event, ui) {
		insertSection($(ui.target).index(), 'before');
	};
	var insertSectionAfter = function (event, ui) {
		insertSection($(ui.target).index(), 'after');
	};
	var insertSection = function (index, side) {
		var width = 170;
		$.fn[side].call($('.bracket-column-header-section').eq(index),
			insertStrings.columnHeaderSection.replace('@width', width));
		$.fn[side].call($('.bracket-section-header').eq(index),
			insertStrings.sectionHeader.replace('@width', width));
		$.fn[side].call($('.bracket-section').eq(index),
			insertStrings.section.replace('@width', width));
		numberSectionHeaders();
	};

	var liveColumn = function () {
		if ($(this).is('.bracket-game-column')) {
			$(this).data('columnType', 'game');
		} else if ($(this).is('.bracket-connector-column')) {
			$(this).data('columnType', 'connector');
		}
		$(this).append($('<div>')
				.addClass('column-overlay')
				.html($('<div>')
					.addClass('column-number-container')
					.html($('<div>').addClass('column-number'))
				)
			);
		$(this).droppable();
		$(this).sortable({
			placeholder: 'bracket-column-placeholder',
			cancel: '.column-overlay',
			forcePlaceholderSize: true,
			axis: 'y',
			receive: function(event, ui) {
				var $received = $(event.target).find('.ui-draggable'),
					$newElement;
				//console.log('Received the package!', event, ui);
				switch ($(event.target).data('columnType')) {
				case 'game':
					if ($received.is('.bracket-toolbar-header')) {
						$received.after('<div class="bracket-header-super-container">' +
							'<div class="bracket-header-top-margin" style="height:16px;"> </div>' + 
							'<div class="bracket-header-container" style="height:40px;">' +
								'<div class="bracket-header" id="Rx"><input type="text" value="Round x"/></div>' +
							'</div>' +
						'<div>');
					} else if ($received.is('.bracket-toolbar-game')) {
						$received.after(insertStrings.game);
					} else if ($received.is('.bracket-toolbar-thirdplacematch')) {
						$received.after(insertStrings.thirdplacematch);
					}
					break;
				case 'connector':
					if ($received.is('.bracket-toolbar-placeholder')) {
						$received.after($('<div style="height:40px;" class="bracket-placeholder"></div>'));
					} else if ($received.is('.bracket-toolbar-connector-up')) {
						$received.after($('<div style="height: 26px;" class="bracket-connector bracket-connector-up">' +
							'<div class="bracket-connector-part bracket-connector-left" style="float: left; clear: left; width:9px;">' +
								'<div style="width:9px;height:8px"> </div>' +
								'<div style="width:9px;height:16px;border-bottom-right-radius:3px;border:solid #aaa;border-width:0 2px 2px 0"> </div>' +
							'</div>' +
							'<div class="bracket-connector-part bracket-connector-right" style="float: left; width:9px;">' +
								'<div style="width:9px;height:6px;border-top-left-radius:3px;border:solid #aaa;border-width:2px 0 0 2px"> </div>' +
								'<div style="width:9px;height:18px;"> </div>' +
							'</div>' +
						'</div>'));
					} else if ($received.is('.bracket-toolbar-connector-down')) {
						$received.after($('<div style="height: 26px;" class="bracket-connector bracket-connector-down">' +
							'<div class="bracket-connector-part bracket-connector-left" style="float: left; clear: left; width:9px">' +
								'<div style="width:9px;height:16px;border-top-right-radius:3px;border:solid #aaa;border-width:2px 2px 0 0"> </div>' +
								'<div style="width:9px;height:8px"> </div>' +
							'</div>' +
							'<div class="bracket-connector-part bracket-connector-right" style="float: left; width:9px;">' +
								'<div style="width:9px;height:18px;"> </div>' +
								'<div style="width:9px;height:6px;border-bottom-left-radius:3px;border:solid #aaa;border-width:0 0 2px 2px"> </div>' +
							'</div>' +
						'</div>'));
					} else if ($received.is('.bracket-toolbar-connector-drop')) {
						$received.after($('<div style="height: 14px;" class="bracket-connector bracket-connector-drop">' +
							'<div class="bracket-connector-part bracket-connector-left" style="float: left; clear: left; width:9px;height:100%;"> </div>' +
							'<div class="bracket-connector-part bracket-connector-right" style="float: left; width:9px;height:12px;border-bottom-left-radius:3px;border:solid #aaa;border-width:0 0 2px 2px"> </div>' +
						'</div>'));
					} else if ($received.is('.bracket-toolbar-connector-flat')) {
						$received.after($('<div style="height: 0px;border-bottom:solid #aaa 2px;" class="bracket-connector bracket-connector-flat"> </div>'));
					}
				}
				$received.remove();
			},
			over: function(event, ui) {
				$(event.target).addClass('active');
			},
			out: function(event, ui) {
				$(event.target).removeClass('active');
			}
		});
		$(this).sortable('option', 'disabled', $('#bracket-show-column-overlays').is(':checked'));
	};
	$('.bracket-column').each(liveColumn);
	$('.bracket-connector').livequery(function () {
		if ($(this).is('.bracket-connector-up')) {
			$(this).data('connectorType', 'up');
		} else if ($(this).is('.bracket-connector-down')) {
			$(this).data('connectorType', 'down');
		} else if ($(this).is('.bracket-connector-drop')) {
			$(this).data('connectorType', 'drop');
		} else if ($(this).is('.bracket-connector-flat')) {
			$(this).data('connectorType', 'flat');
		}
	});
	$('.bracket-section-header').livequery(function () {
		$(this)
			.contextmenu({
				show: false,
				menu: [
					{title: 'Insert a section before', action: insertSectionBefore},
					{title: 'Insert a section after', action: insertSectionAfter},
					{title: 'Empty section', action: emptySectionWithDialog},
					{title: 'Delete section', uiIcon: 'ui-icon-trash', action: $.proxy(deleteElementWithDialog, this)},
					{title: 'Resize section...', uiIcon: 'ui-icon-arrowthick-2-n-s', action: $.proxy(resizeSectionWithDialog, this)}
				]
			})
			/*.resizable({
				handles: 'e',
				containment: '.bracket-section-header-row',
				minWidth: 10,
				resize: function (event, ui) {
					var sectionIndex = $(this).index();
					resizeSection(sectionIndex, ui.size.width);
				}
			})
			.disableSelection()*/;
	});
	$('.bracket-column-header-section').livequery(function () {
		$(this)
			.sortable({
				cancel: '.bracket-column-header:not(.selected)',
				placeholder: 'bracket-column-header placeholder',
				forcePlaceholderSize: true,
				//containment: 'parent',
				stop: function (event, ui) {
					var oldColumnIndex = parseInt(ui.item.text()) - 1,
						newColumnIndex = ui.item.index(),
						$bracketSection = $('.bracket-section').eq(ui.item.parent().index()),
						$bracketColumn = $bracketSection.find('.bracket-column').eq(oldColumnIndex);
					console.log("bchs-s", ui.item, oldColumnIndex, newColumnIndex);
					if (oldColumnIndex == newColumnIndex) {
						return true;
					}
					$bracketColumn.detach();
					if (oldColumnIndex < newColumnIndex) {
						$bracketSection.find('.bracket-column').eq(newColumnIndex - 1).after($bracketColumn);
					} else {
						$bracketSection.find('.bracket-column').eq(newColumnIndex).before($bracketColumn);				
					}
					numberColumns();
					updateSectionsWidth();
				}
			});
		//$(this).sortable('disable');
	});
	var liveColumnHeader = function () {
		var minWidth, maxWidth;
		if ($(this).is('.bracket-game-column-header')) {
			minWidth = 100;
			maxWidth = 300;
		} else if ($(this).is('.bracket-connector-column-header')) {
			minWidth = 10;
			maxWidth = 100;
		} else {
			minWidth = 10;
			maxWidth = 100;
		}
		$(this)
			.html($('<div>').addClass('column-number'))
			.contextmenu({
				show: false,
				menu: [
					{title: 'Insert a game column before', action: bracketdesigner.fn.insertGameColumnBefore},
					{title: 'Insert a game column after', action: bracketdesigner.fn.insertGameColumnAfter},
					{title: 'Insert a connector column before', action: bracketdesigner.fn.insertConnectorColumnBefore},
					{title: 'Insert a connector column after', action: bracketdesigner.fn.insertConnectorColumnAfter},
					{title: 'Empty column', action: emptyColumnWithDialog},
					{title: 'Set column as break', action: setAsBreakColumn},
					{title: 'Delete column', uiIcon: 'ui-icon-trash', action: $.proxy(deleteElementWithDialog, this)},
					//{title: 'Resize column...', uiIcon: 'ui-icon-arrowthick-2-n-s', action: resizeColumnWithDialog}
				]
			})
			.resizable({
				handles: 'e',
				containment: '.bracket-column-header-section',
				minWidth: minWidth,
				maxWidth: maxWidth,
				resize: function (event, ui) {
					var columnIndex = $(this).index(),
						sectionIndex = $(this).parent().index('.bracket-column-header-section');
					ui.size.width = Math.round(ui.size.width*.5) * 2;
					//resizeColumn(sectionIndex, columnIndex, ui.size.width);
					resizeColumns({'sectionIndex': sectionIndex, 'columnIndex': columnIndex}, ui.size.width);
				}
			})
			.on('click', function (event, ui) {
				$('.bracket-column-header.selected').removeClass('selected');
				$(this).addClass('selected');
			});
		console.log('live bracket-column-header');
	};
	$('.bracket-column-header').each(liveColumnHeader);
	$('.bracket-game').livequery(function () {
		var gameIdRegExp = /bracket-game-([\w]*)/,
			cellIdRegExp = /bracket-cell-([\w]*)/,
			gameIdMatch, cellIdMatch,
			gameId = '', cellId = ['', ''],
			i;

		gameIdMatch = $(this).attr('id').match(gameIdRegExp);
		if (gameIdMatch !== null) {
			gameId = gameIdMatch[1];
		}

		for (i = 0; i < 2; i++) {
			cellIdMatch = $(this).find('.bracket-cell').eq(i).attr('id').match(cellIdRegExp);
			if (cellIdMatch !== null) {
				cellId[i] = cellIdMatch[1];
			}
		}

		$(this)
			.contextmenu({
				show: false,
				menu: [
					{title: 'Add score column', action: addScoreColumn},
					{title: 'Delete game', uiIcon: 'ui-icon-trash', action: $.proxy(deleteElementWithDialog, this)},
					{title: 'Resize game...', uiIcon: 'ui-icon-arrowthick-2-n-s', action: resizeGame}
				]
			})
			.find('.bracket-cell').resizable({
				handles: 's',
				containment: ".bracket-column",
				baseY: 36
			});
		$(this).find('.bracket-player-top')
			.append($('<input>')
				.addClass('bracket-cell-id')
				.attr('type', 'text')
				.val(cellId[0])
			);
		$(this).find('.bracket-player-bottom')
			.append($('<input>')
				.addClass('bracket-cell-id')
				.attr('type', 'text')
				.val(cellId[1])
			);
		$(this).find('.bracket-cell').eq(1)
			.append($('<div>')
				.addClass('bracket-game-id')
				.html($('<input>')
					.attr('type', 'text')
					.val(gameId)
				)
			);
		$(this).data('gameId', gameId);
		$(this).data('cellId', cellId);
	});
	$('.bracket-header-super-container').livequery(function () {
		var proxyContext = $(this).find('.bracket-header-container');
		$(this)
			.contextmenu({
				show: false,
				menu: [
					{title: 'Delete header', uiIcon: 'ui-icon-trash', action: $.proxy(deleteElementWithDialog, this)},
					{title: 'Resize header...', uiIcon: 'ui-icon-arrowthick-2-n-s', action: $.proxy(resizeClassic, proxyContext) },
					{title: 'Change top margin...', uiIcon: 'ui-icon-arrowthick-1-n', cmd: 'changeTopMargin', action: bracketdesigner.dialog.handleCmd}
				]
			});
		$(this).find('.bracket-header-container')
			.resizable({
				handles: 's',
				containment: ".bracket-column"
			});
	});
	$('.bracket-placeholder').livequery(function () {
		$(this)
			.contextmenu({
				show: false,
				menu: [
					{title: 'Delete placeholder', uiIcon: 'ui-icon-trash', action: $.proxy(deleteElementWithDialog, this)},
					{title: 'Resize placeholder...', uiIcon: 'ui-icon-arrowthick-2-n-s', action: $.proxy(resizeClassic, this)}
				]
			})
			.resizable({
				handles: 's',
				containment: ".bracket-column"
			});
	});
	$('.bracket-connector:not(.bracket-connector-flat)').livequery(function () {
		var resizeProxy = this;
		$(this)
			.contextmenu({
				show: false,
				menu: [
					{title: 'Delete connector', uiIcon: 'ui-icon-trash', action: $.proxy(deleteElementWithDialog, this)},
					{title: 'Resize connector...', uiIcon: 'ui-icon-arrowthick-2-n-s', action: $.proxy(resizeClassic, this)}
				]
			})
			.resizable({
				handles: 's',
				containment: ".bracket-column",
				resize: function(event, ui) {
					resizeConnector(this, ui.size.height);
				}
			});
	});
	$('.bracket-section-header, .bracket-column-header, .bracket-game, .bracket-header-super-container, .bracket-placeholder, .bracket-connector').livequery(function () {
		$(this)
			.bind('contextmenubeforeopen', function (event, ui) {
				if (event.ctrlKey) {
					return false;
				}
			})
			.bind('contextmenuopen', function (event, ui) {
				$(this).addClass('active');
			})
			.bind('contextmenuclose', function (event, ui) {
				$(this).removeClass('active');
			});
	});

	$( "#section-width-dialog" ).dialog({
		autoOpen: false,
		modal: true,
		title: 'Resize section',
		buttons: {
			'OK' : function() {
				var $target = $('.bracket .resize-target'),
					width = $('#section-width').val(),
					sectionIndex = $target.index('.bracket-column-header-section');

				if (typeof width !== 'undefined' && !isNaN(width)) {
					$target.css('width', width + 'px');
					resizeSection(sectionIndex, width);
				}
				$(this).dialog('close');
			},
			'Cancel' : function() {
				$(this).dialog('close');
			}
		},
		open: function(event, ui) {
			var $target = $('.bracket .resize-target');
			$('#section-width').val(parseInt($target.css('width')));
		},
		close: function(event, ui) {
			$('.bracket .resize-target').removeClass('resize-target');
		}
	});
	$( "#column-width-dialog" ).dialog({
		autoOpen: false,
		modal: true,
		title: 'Resize column',
		buttons: {
			'OK' : function() {
				var $target = $('.bracket .resize-target'),
					width = $('#column-width').val(),
					columnIndex = $target.index();
					sectionIndex = $target.parent().index('.bracket-column-header-section');

				if (typeof width !== 'undefined' && !isNaN(width)) {
					$target.css('width', width + 'px');
					//resizeColumn(sectionIndex, columnIndex, width);
					resizeColumns({'sectionIndex': sectionIndex, 'columnIndex': columnIndex}, width);
				}
				$(this).dialog('close');
			},
			'Cancel' : function() {
				$(this).dialog('close');
			}
		},
		open: function(event, ui) {
			var $target = $('.bracket .resize-target');
			$('#column-width').val(parseInt($target.css('width')));
		},
		close: function(event, ui) {
			$('.bracket .resize-target').removeClass('resize-target');
		}
	});
	$( "#simple-height-dialog" ).dialog({
		autoOpen: false,
		modal: true,
		title: 'Resize element',
		buttons: {
			'OK' : function() {
				var $target = $('.bracket .resize-target'),
					height = $('#simple-height').val();
				if (typeof height !== 'undefined' && !isNaN(height)) {
					$target.css('height', height + 'px');
				}		
				if ($target.is('.bracket-connector')) {
					resizeConnector($target.get(0), height);
				}
				$(this).dialog('close');
			},
			'Cancel' : function() {
				$(this).dialog('close');
			}
		},
		open: function(event, ui) {
			var $target = $('.bracket .resize-target');
			$('#simple-height').val(parseInt($target.css('height')));
		},
		close: function(event, ui) {
			$('.bracket .resize-target').removeClass('resize-target');
		}
	});
	$( "#game-height-dialog" ).dialog({
		autoOpen: false,
		modal: true,
		title: 'Resize game',
		buttons: {
			'OK' : function() {
				var $target = $('.bracket .resize-target'),
					$cells = $target.find('.bracket-cell'),
					newSizeTop = $('#game-top-height option:selected').val(),
					newSizeBottom = $('#game-bottom-height option:selected').val();

				$cells.first().removeClass(function(index, oldClass) {
						return (oldClass.match('bracket-cell-r[1-7]') || []).join(' ');
					}).addClass(newSizeTop)
					.css('height', '');
				$cells.last().removeClass(function(index, oldClass) {
						return (oldClass.match('bracket-cell-r[1-7]') || []).join(' ');
					})
					.addClass(newSizeBottom)
					.css('height', '');
				$(this).dialog('close');
			},
			'Cancel' : function() {
				$(this).dialog('close');
			}
		},
		open: function(event, ui) {
			var $target = $('.bracket .resize-target'),
				topHeight = $target.find('.bracket-cell').first().attr('class').match(/bracket-cell-r[1-7]/)[0];
				bottomHeight = $target.find('.bracket-cell').last().attr('class').match(/bracket-cell-r[1-7]/)[0];
			$('#game-top-height option[value="' + topHeight + '"]').prop('selected', true);
			$('#game-bottom-height option[value="' + bottomHeight + '"]').prop('selected', true);
		},
		close: function(event, ui) {
			$('.bracket .resize-target').removeClass('resize-target');
		}
	});
	var numberSectionHeaders = function () {
		$('.bracket-section-header').each(function (index) {
			$(this).text(String.fromCharCode('A'.charCodeAt(0) + index));
		});
	};
	var numberColumns = function () {
		$('.bracket-column-header-section').each(function (sectionIndex) {
			$(this).find('.bracket-column-header').each(function (index) {
				$(this).find('.column-number').text(index + 1);
			});
		});
		$('.bracket-section').each(function (sectionIndex) {
			$(this).find('.bracket-column').each(function (index) {
				$(this).find('.column-number').text(index + 1);
			});
		});
	};
	$( "#delete-element-dialog" ).dialog({
		autoOpen: false,
		modal: true,
		title: 'Delete element',
		buttons: {
			'OK' : function() {
				var $target = $('.bracket .delete-target');
				if ($target.is('.bracket-column-header')) {
					$('.bracket-column').eq($target.index()).detach();
				} else if ($target.is('.bracket-section-header')) {
					$('.bracket-column-header-section').eq($target.index()).detach();
					$('.bracket-section').eq($target.index()).detach();
				}
				$target.detach();
				if ($target.is('.bracket-column-header')) {
					numberColumns();
				} else if ($target.is('.bracket-section-header')) {
					numberSectionHeaders();
				}
				$(this).dialog('close');
			},
			'Cancel' : function() {
				$(this).dialog('close');
			}
		},
		open: function(event, ui) {
			var $target = $('.bracket .delete-target');
		},
		close: function(event, ui) {
			$('.bracket .delete-target').removeClass('delete-target');
		}
	});
	$( "#empty-section-dialog" ).dialog({
		autoOpen: false,
		modal: true,
		title: 'Empty section',
		buttons: {
			'OK' : function() {
				var $target = $('.bracket .empty-target');
				
				$('.bracket-column-header-section').eq($target.index()).empty();
				$('.bracket-section').eq($target.index()).html('');				
				
				$(this).dialog('close');
			},
			'Cancel' : function() {
				$(this).dialog('close');
			}
		},
		open: function(event, ui) {
			var $target = $('.bracket .empty-target');
		},
		close: function(event, ui) {
			$('.bracket .empty-target').removeClass('empty-target');
		}
	});
	$( "#empty-column-dialog" ).dialog({
		autoOpen: false,
		modal: true,
		title: 'Empty column',
		buttons: {
			'OK' : function() {
				var $target = $('.bracket .empty-target');

				$('.bracket-column').eq($target.index()).html('');				
				
				$(this).dialog('close');
			},
			'Cancel' : function() {
				$(this).dialog('close');
			}
		},
		open: function(event, ui) {
			var $target = $('.bracket .empty-target');
		},
		close: function(event, ui) {
			$('.bracket .empty-target').removeClass('empty-target');
		}
	});
	$( "#generated-wikitext-dialog" ).dialog({
		autoOpen: false,
		modal: true,
		title: 'Generated wikitext',
		width: '70%',
		buttons: {
			'OK' : function() {			
				$(this).dialog('close');
			}
		}
	})
	var identedText = function(text, identation) {
		return "\t" + text.replace(/\n/g, "\n\t") + "\n";
	}
	var htmlStrings = {
		'bracket': '<div style="width:{{#expr:{{{column-width|@gameColumnWidth}}}*@gameColumnNumber+@connectorColumnTotalWidth' +
			'@additionalWidth' + ' class="bracket">' + "\n" +
			'@innerWikitext' +
			'<div style="clear: both;">',
		'additionalWidth': '{{#if:{{{@doubleScoreGamescore2|}}}|+{{{score-width|@scoreWidth}}}}}}}px"',
		'bracketSection': '<div style="width:{{#expr:{{{column-width|@gameColumnWidth}}}*@sectionGameColumnNumber+@sectionConnectorColumnTotalWidth}}px;float:left">' + "\n" +
			'@innerWikitext' +
			'</div>',
		'bracketColumn': '<div class="bracket-column" style="width:{{{column-width|@gameColumnWidth}}}px">' + "\n" +
			'@innerWikitext' +
			'</div>',
		'connectorSubcolumn': '<div style="float:left;width:@widthpx">' + "\n" +
			'@innerWikitext' +
			'</div>',
		'columnPlaceholder': '<div style="width:@widthpx;height:@heightpx@bottomBorder"> </div>',
		'connectorDownLeftElbow': '<div style="width:@widthpx;height:@heightpx;border-top-right-radius:3px;border:solid #aaa;border-width:2px 2px 0 0"> </div>',
		'connectorUpLeftElbow': '<div style="width:@widthpx;height:@heightpx;border-bottom-right-radius:3px;border:solid #aaa;border-width:0 2px 2px 0"> </div>',
		'connectorDownRightElbow': '<div style="width:@widthpx;height:@heightpx;border-bottom-left-radius:3px;border:solid #aaa;border-width:0 0 2px 2px"> </div>',
		'connectorUpRightElbow': '<div style="width:@widthpx;height:@heightpx;border-top-left-radius:3px;border:solid #aaa;border-width:2px 0 0 2px"> </div>',
		'connectorDropElbow': '<div style="width:@widthpx;height:@heightpx;border-bottom-left-radius:3px;border:solid #aaa;border-width:0 0 2px 2px"> </div>',
		'bracketHeader': '<div style="height:@height;margin-top:@marginTop">' +
			'{{#ifeq:true|{{{hideroundtitles}}}||<div class="bracket-header">{{{@roundId|@roundTitle}}}</div>}}' +
			'</div>',
		'bracketGame': '<div class="bracket-game">' + "\n" +
			'	<div class="@topCellClass" style="{{#if:{{{@gameIdwin|}}}|font-weight:bold}}">' + "\n" +
			'		<div class="bracket-player-top" style="{{#if:{{{@topPlayerIdrace|}}}|background:{{RaceColor|{{{@topPlayerIdrace}}}}};}} padding-right:{{#expr:{{{score-width|21}}}+2}}px">' +
				'&nbsp;{{#if:{{{@topPlayerIdflag|}}}|{{flag/{{lc:{{{@topPlayerIdflag}}}}}}}}}&nbsp;<span style="vertical-align:-1px;">{{{@topPlayerId|@topPlayerId}}}</span>' +
				'<div class="bracket-score" style="width:@scoreWidthpx">{{{@topPlayerIdscore|}}}</div></div></div>' + "\n" +
			'	<div class="@bottomCellClass" style="{{#if:{{{@gameIdwin|}}}|font-weight:bold}}">' + "\n" +
			'		<div class="bracket-player-bottom" style="{{#if:{{{@bottomPlayerIdrace|}}}|background:{{RaceColor|{{{@bottomPlayerIdrace}}}}};}} padding-right:{{#expr:{{{score-width|21}}}+2}}px">' +
				'&nbsp;{{#if:{{{@bottomPlayerIdflag|}}}|{{flag/{{lc:{{{@bottomPlayerIdflag}}}}}}}}}&nbsp;<span style="vertical-align:-1px;">{{{@bottomPlayerId|@bottomPlayerId}}}</span>' +
				'<div class="bracket-score" style="width:@scoreWidthpx">{{{@bottomPlayerIdscore|}}}</div></div></div>' + "\n" +
			'</div>'
	};
	var testFunction = function () {
		$section = $('.bracket-section').eq(0);
		$section.find('.bracket-column').each(function (index) {
			console.log($(this).position().top);
		});
	};
	var convertToWikitext = function () {
		console.log('hey');
		var $bracket = $('.bracket'),
			wikitext = '',
			bracketInnerWikitext = '',
			dualScore = true,			
			bracketWidths = {
				'gameColumn': $('#bracket-game-column-width').val(),
				'connectorColumn': $('#bracket-connector-column-width').val(),
				'score': $('#bracket-score-width').val()
			},
			gameColumnNumber = 0,
			connectorColumnTotalWidth = 0,
			
			sectionGameColumnNumber = 0,
			sectionConnectorColumnTotalWidth = 0,
			isSectionBroken = false;			

		$bracket.children('.bracket-section').each(function (sectionIndex) {
			var sectionInnerWikitext = '';
				sectionGameColumnNumber = 0;
				sectionConnectorColumnTotalWidth = 0;
				isSectionBroken = false;

			$(this).children('.bracket-column').each(function (columnIndex) {
				var columnInnerWikitext = '',
					columnWidth = 0,
					leftSubcolumn = {},
					rightSubcolumn = {},
					tempHeight;

				if (!isSectionBroken) {
					switch ($(this).data('columnType')) {
					case 'game':
						sectionGameColumnNumber++;
						break;
					case 'connector':
						sectionConnectorColumnTotalWidth += $(this).width();
					}
					isSectionBroken |= $(this).is('.bracket-column-break');
				}

				switch ($(this).data('columnType')) {
				case 'game':
					columnWidth = bracketWidths.gameColumn;
					$(this).children().each(function (elementIndex) {
						if ($(this).is('.bracket-header-super-container')) {
							var $bracketContainer = $(this).find('.bracket-header-container'),
								$bracketTopMargin = $(this).find('.bracket-header-top-margin'),
								$bracketHeader = $bracketContainer.find('.bracket-header');

							columnInnerWikitext += identedText(htmlStrings.bracketHeader
									.replace('@height', $bracketContainer.css('height'))
									.replace('@marginTop', $bracketTopMargin.css('height'))
									.replace('@roundId', $bracketHeader.attr('id'))
									.replace('@roundTitle', $bracketHeader.find('input').val())
								);
						} else if ($(this).is('.bracket-game')) {
							var $topCell = $(this).find('.bracket-cell').first(),
								$bottomCell = $(this).find('.bracket-cell').last();

							columnInnerWikitext += identedText(htmlStrings.bracketGame
									.replace('@gameColumnWidth', bracketWidths.gameColumn)
									.replace('@topCellClass', $topCell.attr('class').match(/bracket-cell-r[1-7]/)[0])
									.replace('@bottomCellClass', $bottomCell.attr('class').match(/bracket-cell-r[1-7]/)[0])
									.replace(/@scoreWidth/g, bracketWidths.score)
									.replace(/@gameId/g, $(this).data('gameId'))
									.replace(/@topPlayerId/g, $(this).data('cellId')[0])
									.replace(/@bottomPlayerId/g, $(this).data('cellId')[1])
								);
						}
					});
					break;
				case 'connector':
					columnWidth = bracketWidths.connectorColumn;
					leftSubcolumn = {
						'width': Math.round(bracketWidths.connectorColumn*.5) - 1,
						'innerWikitext': '',
						'placeholderHeight': 0
					};
					rightSubcolumn = {
						'width': Math.round(bracketWidths.connectorColumn*.5) - 1,
						'innerWikitext': '',
						'placeholderHeight': 0
					};

					$(this).children().each(function (elementIndex) {
						if ($(this).is('.bracket-placeholder')) {
							leftSubcolumn.placeholderHeight += $(this).height() + 1;
							rightSubcolumn.placeholderHeight += $(this).height() + 1;
						} else if ($(this).is('.bracket-connector')) {
							switch ($(this).data('connectorType')) {
							case 'up':
								tempHeight = $(this).find('.bracket-connector-left > div').last().height();
								
								leftSubcolumn.placeholderHeight += 8;
								addPlaceholderIfNeeded(leftSubcolumn, false);
								leftSubcolumn.innerWikitext += htmlStrings.connectorUpLeftElbow
									.replace('@height', tempHeight)
									.replace('@width', leftSubcolumn.width);
								
								addPlaceholderIfNeeded(rightSubcolumn, false);
								rightSubcolumn.innerWikitext += htmlStrings.connectorUpRightElbow
									.replace('@height', 6)
									.replace('@width', rightSubcolumn.width);
								rightSubcolumn.placeholderHeight += tempHeight + 2;
								break;
							case 'down':
								tempHeight = $(this).find('.bracket-connector-left > div').first().height();
								
								addPlaceholderIfNeeded(leftSubcolumn, false);
								leftSubcolumn.innerWikitext += htmlStrings.connectorDownLeftElbow
									.replace('@height', tempHeight)
									.replace('@width', leftSubcolumn.width);
								leftSubcolumn.placeholderHeight += 8;

								rightSubcolumn.placeholderHeight += tempHeight + 2;
								addPlaceholderIfNeeded(rightSubcolumn, false);
								rightSubcolumn.innerWikitext += htmlStrings.connectorDownRightElbow
									.replace('@height', 6)
									.replace('@width', rightSubcolumn.width);
								break;
							case 'drop':
								tempHeight = $(this).height() + 1;
								leftSubcolumn.placeholderHeight += tempHeight;
								addPlaceholderIfNeeded(rightSubcolumn, false);
								rightSubcolumn.innerWikitext += htmlStrings.connectorDropElbow
									.replace('@height', tempHeight - 2)
									.replace('@width', rightSubcolumn.width);
								break;
							case 'flat':
								addPlaceholderIfNeeded(leftSubcolumn, true);
								addPlaceholderIfNeeded(rightSubcolumn, true);
								break;
							}
						}
					});
					/*if (leftSubcolumn.placeholderHeight > 0) {
						leftSubcolumn.innerWikitext += identedText(htmlStrings.columnPlaceholder
								.replace('@height', leftSubcolumn.placeholderHeight)
								.replace('@width', leftSubcolumn.width)
							);
					}
					if (rightSubcolumn.placeholderHeight > 0) {
						rightSubcolumn.innerWikitext += identedText(htmlStrings.columnPlaceholder
								.replace('@height', rightSubcolumn.placeholderHeight)
								.replace('@width', rightSubcolumn.width)
							);
					}*/

					columnInnerWikitext += identedText(htmlStrings.connectorSubcolumn
							.replace('@innerWikitext', leftSubcolumn.innerWikitext)
							.replace('@width', leftSubcolumn.width)
						);
					columnInnerWikitext += identedText(htmlStrings.connectorSubcolumn
							.replace('@innerWikitext', rightSubcolumn.innerWikitext)
							.replace('@width', rightSubcolumn.width)
						);
				}
				
				sectionInnerWikitext += identedText(htmlStrings.bracketColumn
						.replace('@innerWikitext', columnInnerWikitext)
						.replace('@gameColumnWidth', columnWidth)
					);
			});

			bracketInnerWikitext += identedText(htmlStrings.bracketSection
					.replace('@innerWikitext', sectionInnerWikitext)
					.replace('@gameColumnWidth', bracketWidths.gameColumn)
					.replace('@sectionGameColumnNumber', sectionGameColumnNumber)
					.replace('@sectionConnectorColumnTotalWidth', sectionConnectorColumnTotalWidth)
				);
			gameColumnNumber += sectionGameColumnNumber;
			connectorColumnTotalWidth += sectionConnectorColumnTotalWidth;
		});

		if (dualScore) {
			additionalWidth = htmlStrings.additionalWidth
				.replace('@doubleScoreGame', 'RxDy')
				.replace('@scoreWidth', bracketWidths.score);
		} else {
			additionalWidth = '';
		}
		wikitext = identedText(htmlStrings.bracket
			.replace('@innerWikitext', bracketInnerWikitext)
			.replace('@gameColumnWidth', bracketWidths.gameColumn)
			.replace('@gameColumnNumber', gameColumnNumber)
			.replace('@connectorColumnTotalWidth', connectorColumnTotalWidth)
			.replace('@additionalWidth', additionalWidth)
		);
		wikitext = wikitext.replace(/^\t/gm, '');
		$('#generated-wikitext').text(wikitext);
		$('#generated-wikitext-dialog').dialog('open');
	};
	$('#convert-to-wikitext').click(convertToWikitext);
	var addPlaceholderIfNeeded = function (subcolumn, flatAfter) {
		if (subcolumn.placeholderHeight > 0) {
			subcolumn.innerWikitext += identedText(htmlStrings.columnPlaceholder
					.replace('@height', subcolumn.placeholderHeight)
					.replace('@width', subcolumn.width + (flatAfter ? 2 : 0))
					.replace('@bottomBorder', flatAfter ? ';border-bottom: solid #aaa 2px' : '')
				);
			subcolumn.placeholderHeight = 0;
		}
	};
	var editGameCellIDs = function () {
		var $dialog = $('#game-cell-ids-dialog'),
			$ul, $sectionHeader, $columnHeader,
			$sectionDiv = '';

		$dialog = $('#game-cell-ids-dialog').empty();
		$ul = $('<ul>').appendTo($dialog);
		$('.bracket-section').each( function(sectionIndex) {
			$sectionHeader = $('.bracket-section-header').eq(sectionIndex);
			$ul.append($('<li>')
				.html($('<a>')
					.attr('href', '#section-' + $sectionHeader.text())
					.text('Section ' + $sectionHeader.text())
				)
			);
			$sectionDiv = $('<div>').attr('id', 'section-' + $sectionHeader.text());
			$dialog.append($sectionDiv);
			
			$(this).find('.bracket-game-column').each( function(columnIndex) {
				$columnHeader = $('.bracket-column-header-section').eq(sectionIndex)
					.find('.bracket-column-header').eq(columnIndex);
				$sectionDiv.append($('<span>').text('Column ' + $columnHeader.text()));
				
				$(this).find('.bracket-game').each( function(index) {
					$sectionDiv.append($('<input>')
						.attr('type', 'text')
						.val(index)
					);
				});
			});
		});
		$('#game-cell-ids-dialog').dialog('open');
		try {
			$dialog.tabs('refresh');
			//$dialog.display(1);
		} catch(e) {
			$dialog.tabs();
		}
	};
	$('#edit-game-cell-ids').click(editGameCellIDs);
	$('#game-cell-ids-dialog').dialog({
		autoOpen: false,
		modal: true,
		title: 'Edit IDs of games and players',
		minHeight: 450,
		width: 450,
		buttons: {
			'OK' : function() {
				//$(this).tabs('destroy');
				$(this).dialog('close');
			},
			'Cancel' : function() {
				//$(this).tabs('destroy');
				$(this).dialog('close');
			}
		}
	});

	numberColumns();
});