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
	var insertStrings = {
		'sectionHeader': '<div style="width:@widthpx;" class="bracket-section-header">A</div>',
		'columnHeaderSection': '<div style="width:@widthpx;" class="bracket-column-header-section"></div>',
		'section': '<div style="width:@widthpx;" class="bracket-section">&nbsp;</div>',
		'columnHeader': '<div style="width:@widthpx;" class="bracket-column-header">1</div>',
		'column': '<div style="width:@widthpx;" class="bracket-column bracket-@type-column">&nbsp;</div>'
	};

	var sameColumnWidth = $('#same-column-width').is(':checked');
	$('#same-column-width').click(function() {
		sameColumnWidth = $(this).is(':checked');

	});

	$('#bracket-cell-helper').click(function() {
		$('.bracket').toggleClass('bracket-cell-helper-on', $(this).is(':checked'));
	});
	$('.bracket').toggleClass('bracket-cell-helper-on', $('#bracket-cell-helper').is(':checked'));
	$('#bracket-resizable-bottom-borders').click(function() {
		$('.bracket').toggleClass('bracket-resizable-bottom-borders-on', $(this).is(':checked'));
	});
	$('.bracket').toggleClass('bracket-resizable-bottom-borders-on', $('#bracket-resizable-bottom-borders').is(':checked'));

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
	$('.bracket-column-header-section').sortable({
		placeholder: 'bracket-column-header placeholder',
		forcePlaceholderSize: true,
		//containment: 'parent',
		stop: function (event, ui) {
			var oldColumnIndex = parseInt(ui.item.text()) - 1,
				newColumnIndex = ui.item.index(),
				$bracketSection = $('.bracket-section').eq(ui.item.parent().index()),
				$bracketColumn = $bracketSection.find('.bracket-column').eq(oldColumnIndex);
			if (oldColumnIndex == newColumnIndex) {
				return true;
			}
			$bracketColumn.detach();
			if (oldColumnIndex < newColumnIndex) {
				$bracketSection.find('.bracket-column').eq(newColumnIndex - 1).after($bracketColumn);
			} else {
				$bracketSection.find('.bracket-column').eq(newColumnIndex).before($bracketColumn);				
			}
			numberColumnHeaders();
		}
	});
	var resizeSection = function (sectionIndex, width) {
		$('.bracket-section').eq(sectionIndex).css('width', width + 'px');
		$('.bracket-column-header-section').eq(sectionIndex).css('width', width + 'px');
	};
	var updateSectionsWidth = function () {
		var totalWidth = 0;
		$('.bracket-section').each(function (index) {
			var width = '',
				$headerBreak;
			$(this).css('width', '');
			if (($headerBreak = $(this).find('.bracket-column-break')).length > 0) {
				width = ($headerBreak.position().left + $headerBreak.width()) + 'px';
			}
			$(this).css('width', width);
			$('.bracket-column-header-section').eq(index).css('width', width);
			totalWidth += $(this).width();
		});
		$('.bracket').css('width', totalWidth + 'px');
	}
	var resizeColumns = function (sectionIndex, columnIndex, width) {
		var $connectorsUpDown,
			$column = $('.bracket-section').eq(sectionIndex).find('.bracket-column').eq(columnIndex);

		if ($column.is('.bracket-game-column')) {
			$('.bracket-game-column').css('width', width + 'px').each(function () {
				var columnIndex = $(this).index(),
					sectionIndex = $(this).parent().index() - 1;
				$('.bracket-column-header-section').eq(sectionIndex).find('.bracket-column-header').eq(columnIndex)
					.css('width', width + 'px');
			});
		} else if ($column.is('.bracket-connector-column')) {
			$('.bracket-connector-column').css('width', width + 'px').each(function () {
				var columnIndex = $(this).index(),
					sectionIndex = $(this).parent().index() - 1;
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
		}
		updateSectionsWidth();
	};
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
	$('.bracket-column').droppable();
	$('.bracket-column').sortable({
		placeholder: 'bracket-column-placeholder',
		forcePlaceholderSize: true,
		axis: 'y',
		receive: function(event, ui) {
			var $received = $(event.target).find('.ui-draggable'),
				$newElement;
			//console.log('Received the package!', event, ui);
			if ($(event.target).is('.bracket-game-column')) {
				if ($received.is('.bracket-toolbar-header')) {
					$received.after('<div style="height:40px;margin-top:0px"><div class="bracket-header" id="Rx">Round x</div></div>');
				} else if ($received.is('.bracket-toolbar-game')) {
					$received.after($('<div class="bracket-element bracket-game">' +
						'<div class="bracket-cell bracket-cell-r1">' +
							'<div class="bracket-player-top"><div class="bracket-score" style="width:21px"> </div></div>' +
						'</div>' +
						'<div class="bracket-cell bracket-cell-r1">' +
							'<div class="bracket-player-bottom"><div class="bracket-score" style="width:21px"> </div></div>' +
						'</div>' +
					'</div>'));
				} else if ($received.is('.bracket-toolbar-thirdplacematch')) {
					$received.after('<div class="bracket-element bracket-game bracket-thirdplacematch" style="margin-top:11px;">' +
						'<div class="bracket-cell bracket-cell-r1">' +
							'<div class="bracket-player-top"><div class="bracket-score" style="width:21px"> </div></div>' +
						'</div>' +
						'<div class="bracket-cell bracket-cell-r1">' +
							'<div class="bracket-player-bottom"><div class="bracket-score" style="width:21px"> </div></div>' +
						'</div>' +
						'<div class="bracket-thirdplacematchlabel" style="position:absolute;width:100%;text-align:center;top:-6px"><b>3rd Place Match</b></div>' +
					'</div>');
				}
			} else {
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
	var deleteElementWithDialog = function (event, ui) {
		$(ui.target).closest('.active').addClass('delete-target');
		$('#delete-element-dialog').dialog('open');
	};
	var addScoreColumn = function (event, ui) {
		$('.bracket-double-score-game').removeClass('.bracket-double-score-game');
		$(ui.target).addClass('.bracket-double-score-game');
	};
	var resizeGame = function (event, ui) {
		$(ui.target).closest('.bracket-game').addClass('resize-target');
		$('#game-height-dialog').dialog('open');		
	};
	var resizeClassic = function (event, ui) {
		$(ui.target).closest('.active').addClass('resize-target');
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
	var insertSectionBefore = function (event, ui) {
		insertSection($(ui.target).index(), 'before');
	};
	var insertSectionAfter = function (event, ui) {
		insertSection($(ui.target).index(), 'after');
	};
	var insertSection = function (index, side) {
		var width = 150;
		$.fn[side].apply($('.bracket-column-header-section').eq(index),
			[insertStrings.columnHeaderSection.replace('@width', width)]);
		$.fn[side].apply($('.bracket-section-header').eq(index),
			[insertStrings.sectionHeader.replace('@width', width)]);
		$.fn[side].apply($('.bracket-section').eq(index),
			[insertStrings.section.replace('@width', width)]);
		numberSectionHeaders();
	};
	var insertGameColumnBefore = function (event, ui) {
		insertColumn($(ui.target).closest('.bracket-column-header-section').index(), $(ui.target).index(), 'game', 'before');
	};
	var insertGameColumnAfter = function (event, ui) {
		insertColumn($(ui.target).closest('.bracket-column-header-section').index(), $(ui.target).index(), 'game', 'after');
	};
	var insertConnectorColumnBefore = function (event, ui) {
		insertColumn($(ui.target).closest('.bracket-column-header-section').index(), $(ui.target).index(), 'connector', 'before');
	};
	var insertConnectorColumnAfter = function (event, ui) {
		insertColumn($(ui.target).closest('.bracket-column-header-section').index(), $(ui.target).index(), 'connector', 'after');
	};
	var insertColumn = function (sectionIndex, columnIndex, type, side) {
		var width;
		switch(type) {
		case 'connector':
			width = 20;
			break;
		case 'game':
		default:
			width = 150;
		}
		$.fn[side].apply($('.bracket-column-header-section').eq(sectionIndex).find('.bracket-column-header').eq(columnIndex),
			[insertStrings.columnHeader
				.replace('@width', width)
				.replace('@type', type)]);
		$.fn[side].apply($('.bracket-section').eq(sectionIndex).find('.bracket-column').eq(columnIndex),
			[insertStrings.column
				.replace('@width', width)
				.replace('@type', type)]);
		numberColumnHeaders();
	};
	$('.bracket-section-header').livequery(function () {
		$(this)
			.contextmenu({
				show: false,
				menu: [
					{title: 'Insert a section before', action: insertSectionBefore},
					{title: 'Insert a section after', action: insertSectionAfter},
					{title: 'Empty section', action: emptySectionWithDialog},
					{title: 'Delete section', uiIcon: 'ui-icon-trash', action: deleteElementWithDialog},
					{title: 'Resize section...', uiIcon: 'ui-icon-arrowthick-2-n-s', action: resizeSectionWithDialog}
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
	$('.bracket-column-header').livequery(function () {
		var minWidth;
		if ($(this).is('.bracket-game-column-header')) {
			minWidth = 100;
		} else if ($(this).is('.bracket-connector-column-header')) {
			minWidth = 10;
		} else {
			minWidth = 10;
		}
		$(this)
			.contextmenu({
				show: false,
				menu: [
					{title: 'Insert a game column before', action: insertGameColumnBefore},
					{title: 'Insert a game column after', action: insertGameColumnAfter},
					{title: 'Insert a connector column before', action: insertConnectorColumnBefore},
					{title: 'Insert a connector column after', action: insertConnectorColumnAfter},
					{title: 'Empty column', action: emptyColumnWithDialog},
					{title: 'Delete column', uiIcon: 'ui-icon-trash', action: deleteElementWithDialog},
					{title: 'Resize column...', uiIcon: 'ui-icon-arrowthick-2-n-s', action: resizeColumnWithDialog}
				]
			})
			.resizable({
				handles: 'e',
				containment: '.bracket-column-header-section',
				minWidth: minWidth,
				resize: function (event, ui) {
					var columnIndex = $(this).index(),
						sectionIndex = $(this).parent().index();
					ui.size.width = Math.round(ui.size.width / 2) * 2;
					//resizeColumn(sectionIndex, columnIndex, ui.size.width);
					resizeColumns(sectionIndex, columnIndex, ui.size.width);
				}
			})
			.disableSelection();
	});
	$('.bracket-game').livequery(function () {
		$(this)
			.contextmenu({
				show: false,
				menu: [
					{title: 'Add score column', action: addScoreColumn},
					{title: 'Delete game', uiIcon: 'ui-icon-trash', action: deleteElementWithDialog},
					{title: 'Resize game...', uiIcon: 'ui-icon-arrowthick-2-n-s', action: resizeGame}
				]
			})
			.find('.bracket-cell').resizable({
				handles: 's',
				containment: ".bracket-column",
				baseY: 36
			});
	});
	$('.bracket-header-container').livequery(function () {
		$(this)
			.contextmenu({
				show: false,
				menu: [
					{title: 'Delete header', uiIcon: 'ui-icon-trash', action: deleteElementWithDialog},
					{title: 'Resize header...', uiIcon: 'ui-icon-arrowthick-2-n-s', action: resizeClassic}
				]
			})
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
					{title: 'Delete placeholder', uiIcon: 'ui-icon-trash', action: deleteElementWithDialog},
					{title: 'Resize placeholder...', uiIcon: 'ui-icon-arrowthick-2-n-s', action: resizeClassic}
				]
			})
			.resizable({
				handles: 's',
				containment: ".bracket-column"
			});
	});
	$('.bracket-connector:not(.bracket-connector-flat)').livequery(function () {
		$(this)
			.contextmenu({
				show: false,
				menu: [
					{title: 'Delete connector', uiIcon: 'ui-icon-trash', action: deleteElementWithDialog},
					{title: 'Resize connector...', uiIcon: 'ui-icon-arrowthick-2-n-s', action: resizeClassic}
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
	$('.bracket-section-header, .bracket-column-header, .bracket-game, .bracket-header-container, .bracket-placeholder, .bracket-connector').livequery(function () {
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
					sectionIndex = $target.index();

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
					sectionIndex = $target.parent().index();

				if (typeof width !== 'undefined' && !isNaN(width)) {
					$target.css('width', width + 'px');
					//resizeColumn(sectionIndex, columnIndex, width);
					resizeColumns(sectionIndex, columnIndex, width);
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
	var numberColumnHeaders = function () {
		$('.bracket-column-header-section').each(function (sectionIndex) {
			$(this).find('.bracket-column-header').each(function (index) {
				$(this).text(index + 1);
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
					numberColumnHeaders();
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
				$('.bracket-section').eq($target.index()).html('&nbsp;');				
				
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

				$('.bracket-column').eq($target.index()).html('&nbsp;');				
				
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
			$htmlContainer = $('<div>'),
			$wikiBracket = $('<div>')
				.addClass('bracket'),
			wikitext = '',
			bracketInnerWikitext = '',
			dualScore = true,			
			gameColumnWidth = $('.bracket-game-column').first().width(),

			gameColumnNumber = 0,
			connectorColumnTotalWidth = 0,
			
			sectionGameColumnNumber = 0,
			sectionConnectorColumnTotalWidth = 0,
			isSectionBroken = false;			

		$bracket.children('.bracket-section').each(function (sectionIndex) {
			var $wikiSection = $('<div>'),
				sectionInnerWikitext = '';
				sectionGameColumnNumber = 0;
				sectionConnectorColumnTotalWidth = 0;
				isSectionBroken = false;

			$(this).children('.bracket-column').each(function (columnIndex) {
				var $wikiColumn = $('<div>')
					.addClass($(this).attr('class').match(/bracket[a-z\-]*-column/g).join(' ')),
					columnInnerWikitext = '';

				if (!isSectionBroken) {
					if ($(this).is('.bracket-game-column')) {
						sectionGameColumnNumber++;
					} else if ($(this).is('.bracket-connector-column')) {
						sectionConnectorColumnTotalWidth += $(this).width();
					}
					isSectionBroken |= $(this).is('.bracket-column-break');
				}

				$(this).children().each(function (elementIndex) {
					var $wikiElement = $('<div>');

					if ($(this).is('.bracket-header-container')) {
						var $bracketHeader = $(this).find('.bracket-header');

						/*$wikiElement.css('width', $(this).css('width'))
							.css('margin-top', $(this).css('margin-top'));
						$wikiElement
							.html('{{#ifeq:true|{{{hideroundtitles}}}||')
							.append($('<div>')
								.addClass('bracket-header')
								.html('{{{' + $bracketHeader.attr('id') + '|' + $bracketHeader.find('input').val() + '}}}')
							)
							.append('}}');
						$htmlContainer.html($wikiElement);
						wikitext += $htmlContainer.html() + "\n";*/
						columnInnerWikitext += identedText(htmlStrings.bracketHeader
								.replace('@height', $(this).css('height'))
								.replace('@marginTop', $(this).css('margin-top'))
								.replace('@roundId', $bracketHeader.attr('id'))
								.replace('@roundTitle', $bracketHeader.find('input').val())
							);
					} else if ($(this).is('.bracket-game')) {
						var $topCell = $('.bracket-cell').first(),
							$bottomCell = $('.bracket-cell').last();
						columnInnerWikitext += identedText(htmlStrings.bracketGame
								.replace('@gameColumnWidth', gameColumnWidth)
								.replace('@topCellClass', $topCell.attr('class').match(/bracket-cell-r[1-7]/)[0])
								.replace('@bottomCellClass', $bottomCell.attr('class').match(/bracket-cell-r[1-7]/)[0])
								.replace(/@gameId/g, 'RxGg')
								.replace(/@topPlayerId/g, 'RxDy')
								.replace(/@bottomPlayerId/g, 'RxDz')
							);
					}
					$wikiColumn.append($wikiElement);
				});
				
				sectionInnerWikitext += identedText(htmlStrings.bracketColumn
						.replace('@innerWikitext', columnInnerWikitext)
						.replace('@gameColumnWidth', gameColumnWidth)
					);
				$wikiSection.append($wikiColumn);
			});

			bracketInnerWikitext += identedText(htmlStrings.bracketSection
					.replace('@innerWikitext', sectionInnerWikitext)
					.replace('@gameColumnWidth', gameColumnWidth)
					.replace('@sectionGameColumnNumber', sectionGameColumnNumber)
					.replace('@sectionConnectorColumnTotalWidth', sectionConnectorColumnTotalWidth)
				);
			gameColumnNumber += sectionGameColumnNumber;
			connectorColumnTotalWidth += sectionConnectorColumnTotalWidth;
			$wikiBracket.append($wikiSection);
		});

		additionalWidth = dualScore ? htmlStrings.additionalWidth.replace('@doubleScoreGame', 'RxDy') : '';
		wikitext = identedText(htmlStrings.bracket
			.replace('@innerWikitext', bracketInnerWikitext)
			.replace('@gameColumnWidth', gameColumnWidth)
			.replace('@gameColumnNumber', gameColumnNumber)
			.replace('@connectorColumnTotalWidth', connectorColumnTotalWidth)
			.replace('@additionalWidth', additionalWidth)
		);
		wikitext = wikitext.replace(/^\t/gm, '');
		$('#generated-wikitext').text(wikitext);
		$('#generated-wikitext-dialog').dialog('open');
		
		$htmlContainer.html($wikiBracket);
		//console.log('html', $htmlContainer.html());
	};
	$('#convert-to-wikitext').click(convertToWikitext);
});