<!DOCTYPE html>
<html>
<head>
	<title>Bracket template designer</title>
	<link rel="stylesheet" href="http://code.jquery.com/ui/1.10.3/themes/smoothness/jquery-ui.css">
	<!--<link rel="stylesheet" href="./jquery-ui.css"><!--1.10.3 smoothness-->
	<link rel="stylesheet" href="./brackets.css">
	<link rel="stylesheet" href="./style.css">
	<script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
	<script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/jquery-ui.min.js"></script>
	<!--<script src="./jquery.min.js"></script><!--1.10.2-->
	<!--<script src="./jquery-ui.min.js"></script><!--1.10.3-->
	<script src="./jquery.livequery.js"></script>
	<script src="./jquery.ui-contextmenu.js"></script>
	<script src="./bracket-template-designer.js"></script>
</head>
<body>
	<div id="delete-element-dialog">
		<p><span class="ui-icon ui-icon-alert" style="float:left; margin:0 7px 0 0;"></span>
		Are you sure?</p>
	</div>

	<div id="empty-section-dialog">
		<p><span class="ui-icon ui-icon-alert" style="float:left; margin:0 7px 0 0;"></span>
		All columns and elements in this section will be deleted. Are you sure?</p>
	</div>

	<div id="empty-column-dialog">
		<p><span class="ui-icon ui-icon-alert" style="float:left; margin:0 7px 0 0;"></span>
		All elements in this column will be deleted. Are you sure?</p>
	</div>

	<div id="section-width-dialog">
		<form>
			<label for="section-width">Enter the width in pixels (even number).</label><br/>
			<input type="text" id="section-width"/>
		</form>
	</div>

	<div id="column-width-dialog">
		<form>
			<label for="column-width">Enter the width in pixels (even number).</label><br/>
			<input type="text" id="column-width"/>
		</form>
	</div>

	<div id="simple-height-dialog">
		<form>
			<label for="simple-height">Enter the height in pixels.</label><br/>
			<input type="text" id="simple-height"/>
		</form>
	</div>

	<div id="game-height-dialog">
		<p>Select the sizes of the top and bottom cell.<p>
		<form>
			<label for="game-top-height">Size of the top cell: </label>
			<select id="game-top-height">
				<option value="bracket-cell-r1">1</option>
				<option value="bracket-cell-r2">2</option>
				<option value="bracket-cell-r3">3</option>
				<option value="bracket-cell-r4">4</option>
				<option value="bracket-cell-r5">5</option>
				<option value="bracket-cell-r6">6</option>
				<option value="bracket-cell-r7">7</option>
			</select><br/>
			<label for="game-top-height">Size of the bottom cell: </label>
			<select id="game-bottom-height">
				<option value="bracket-cell-r1">1</option>
				<option value="bracket-cell-r2">2</option>
				<option value="bracket-cell-r3">3</option>
				<option value="bracket-cell-r4">4</option>
				<option value="bracket-cell-r5">5</option>
				<option value="bracket-cell-r6">6</option>
				<option value="bracket-cell-r7">7</option>
			</select>
		</form>
	</div>

	<p>Use the blue dashed lines to resize elements.</p>
	<div class="bracket-options">
		<input type="checkbox" id="bracket-resizable-bottom-borders" checked="checked"/>
		<label for="bracket-resizable-bottom-borders">Show bottom borders of resizable elements</label>
		<input type="checkbox" id="bracket-cell-helper"/>
		<label for="bracket-cell-helper">Show bracket cell helpers</label>
		<input type="button" id="convert-to-wikitext" value="Convert to wikitext"/>
	</div>
	<div class="bracket-toolbar">
		<div class="bracket-toolbar-title"><b>Drag and drop in the bracket:</b></div>
		<div class="bracket-toolbar-title">Game column only:</div>
		<div class="bracket-toolbar-item bracket-toolbar-header">Header</div>
		<div class="bracket-toolbar-item bracket-toolbar-game">Match</div>
		<div class="bracket-toolbar-item bracket-toolbar-thirdplacematch">Third place match</div>
		<div class="bracket-toolbar-title">Connector column only:</div>
		<div class="bracket-toolbar-item bracket-toolbar-placeholder">Placeholder</div>
		<div class="bracket-toolbar-item bracket-toolbar-connector-up" title="Upward connector">&nbsp;</div>
		<div class="bracket-toolbar-item bracket-toolbar-connector-down" title="Downward connector">&nbsp;</div>
		<div class="bracket-toolbar-item bracket-toolbar-connector-drop" title="Drop connector">&nbsp;</div>
		<div class="bracket-toolbar-item bracket-toolbar-connector-flat" title="Flat connector">&nbsp;</div>
	</div>

	<div class="bracket" style="min-height:300px; min-width: 150px; width:490px; border: 1px solid silver;">
		<table class="bracket-headers">
			<tr class="bracket-section-header-row">
				<th class="bracket-section-header">A</th>
				<th class="bracket-section-header">B</th>
			</tr>
			<tr class="bracket-column-header-row">
				<td style="width:320px;" class="bracket-column-header-section">
					<div style="width:150px;" class="bracket-column-header bracket-game-column-header">1</div><!--
					--><div style="width:20px;" class="bracket-column-header bracket-connector-column-header">2</div><!--
					--><div style="width:150px;" class="bracket-column-header bracket-game-column-header bracket-column-header-break">3</div><!--
					--><div style="width:150px;" class="bracket-column-header bracket-game-column-header">4</div><!--
					--><div style="width:20px;" class="bracket-column-header bracket-connector-column-header">5</div><!--
					--><div style="width:150px;" class="bracket-column-header bracket-game-column-header">6</div>
				</td>
				<td style="width:170px;" class="bracket-column-header-section">
					<div style="width:20px;" class="bracket-column-header bracket-connector-column-header">1</div><!--
					--><div style="width:150px;" class="bracket-column-header bracket-game-column-header">2</div>
				</td>
			</tr>
		</table>
		<div style="width:320px;" class="bracket-section">
			<div style="width: 150px;" class="bracket-column bracket-game-column">
				<div class="bracket-header-container" style="height:40px;margin-top:0px"><div class="bracket-header" id="R1"><input type="text" value="Semifinals"/></div></div>
				<div class="bracket-element bracket-game ui-widget-content">
					<div class="bracket-cell bracket-cell-r1">
						<div class="bracket-player-top"><div class="bracket-score" style="width:21px"> </div></div>
					</div>
					<div class="bracket-cell bracket-cell-r1">
						<div class="bracket-player-bottom"><div class="bracket-score" style="width:21px"> </div></div>
					</div>
				</div>
				<div class="bracket-element bracket-game ui-widget-content">
					<div class="bracket-cell bracket-cell-r1">
						<div class="bracket-player-top"><div class="bracket-score" style="width:21px"> </div></div>
					</div>
					<div class="bracket-cell bracket-cell-r1">
						<div class="bracket-player-bottom"><div class="bracket-score" style="width:21px"> </div></div>
					</div>
				</div>
			</div>
			<div class="bracket-column bracket-connector-column" style="width: 20px;">
				<div style="height: 75px;" class="bracket-placeholder"></div>
				<div style="height: 26px;" class="bracket-connector bracket-connector-down">
					<div class="bracket-connector-part bracket-connector-left" style="float: left; clear: left; width:9px">
						<div style="width:9px;height:16px;border-top-right-radius:3px;border:solid #aaa;border-width:2px 2px 0 0"> </div>
						<div style="width:9px;height:8px"> </div>
					</div>
					<div class="bracket-connector-part bracket-connector-right" style="float: left; width:9px;">
						<div style="width:9px;height:18px;"> </div>
						<div style="width:9px;height:6px;border-bottom-left-radius:3px;border:solid #aaa;border-width:0 0 2px 2px"> </div>
					</div>
				</div>
				<div style="height: 22px;" class="bracket-placeholder"></div>
				<div style="height: 26px;" class="bracket-connector bracket-connector-up">
					<div class="bracket-connector-part bracket-connector-left" style="float: left; clear: left; width:9px;">
						<div style="width:9px;height:8px"> </div>
						<div style="width:9px;height:16px;border-bottom-right-radius:3px;border:solid #aaa;border-width:0 2px 2px 0"> </div>
					</div>
					<div class="bracket-connector-part bracket-connector-right" style="float: left; width:9px;">
						<div style="width:9px;height:6px;border-top-left-radius:3px;border:solid #aaa;border-width:2px 0 0 2px"> </div>
						<div style="width:9px;height:18px;"> </div>
					</div>
				</div>
				<div style="height:35px;" class="bracket-placeholder"></div>
			</div>
			<div style="width: 150px;" class="bracket-column bracket-game-column bracket-column-break">
				<div class="bracket-header-container" style="height:40px;margin-top:0px"><div class="bracket-header" id="R2"><input type="text" value="Finals"/></div></div>
				<div class="bracket-element bracket-game ui-widget-content">
					<div class="bracket-cell bracket-cell-r2">
						<div class="bracket-player-top"><div class="bracket-score" style="width:21px"> </div></div>
					</div>
					<div class="bracket-cell bracket-cell-r2">
						<div class="bracket-player-bottom"><div class="bracket-score" style="width:21px"> </div></div>
					</div>
				</div>
			</div>
			<div style="width: 150px;" class="bracket-column bracket-game-column">
				<div class="bracket-header-container" style="height:64px;margin-top:16px"><div class="bracket-header" id="L1"><input type="text" value="Loser's Round 1"/></div></div>
				<div class="bracket-element bracket-game ui-widget-content">
					<div class="bracket-cell bracket-cell-r1">
						<div class="bracket-player-top"><div class="bracket-score" style="width:21px"> </div></div>
					</div>
					<div class="bracket-cell bracket-cell-r1">
						<div class="bracket-player-bottom"><div class="bracket-score" style="width:21px"> </div></div>
					</div>
				</div>
			</div>
			<div style="width:20px;" class="bracket-column bracket-connector-column">
				<div style="height: 80px;" class="bracket-placeholder"></div>
				<div style="height: 14px;" class="bracket-connector bracket-connector-drop">
					<div class="bracket-connector-part bracket-connector-left" style="float: left; clear: left; width:9px;height:100%;"> </div>
					<div class="bracket-connector-part bracket-connector-right" style="float: left; width:9px;height:12px;border-bottom-left-radius:3px;border:solid #aaa;border-width:0 0 2px 2px"> </div>
				</div>
				<div style="height: 21px;" class="bracket-placeholder"></div>
				<div style="height: 0px;border-bottom:solid #aaa 2px;" class="bracket-connector bracket-connector-flat"> </div>
				<div style="height: 35px;" class="bracket-placeholder"></div>
			</div>
			<div style="width: 150px;" class="bracket-column bracket-game-column">
				<div class="bracket-header-container" style="height:52px;margin-top:16px"><div class="bracket-header" id="L2"><input type="text" value="Loser's Finals"/></div></div>
				<div class="bracket-element bracket-game ui-widget-content">
					<div class="bracket-cell bracket-cell-r1">
						<div class="bracket-player-top"><div class="bracket-score" style="width:21px"> </div></div>
					</div>
					<div class="bracket-cell bracket-cell-r1">
						<div class="bracket-player-bottom"><div class="bracket-score" style="width:21px"> </div></div>
					</div>
				</div>
			</div>
		</div><!--
		--><div style="width:170px;" class="bracket-section">
			<div style="width: 20px;" class="bracket-column bracket-connector-column">
				<div style="height: 111px;" class="bracket-placeholder"></div>
				<div style="height: 78px;" class="bracket-connector bracket-connector-down">
					<div class="bracket-connector-part bracket-connector-left" style="float: left; clear: left; width:9px">
						<div style="width:9px;height:68px;border-top-right-radius:3px;border:solid #aaa;border-width:2px 2px 0 0"> </div>
						<div style="width:9px;height:8px"> </div>
					</div>
					<div class="bracket-connector-part bracket-connector-right" style="float: left; width:9px;">
						<div style="width:9px;height:70px;"> </div>
						<div style="width:9px;height:6px;border-bottom-left-radius:3px;border:solid #aaa;border-width:0 0 2px 2px"> </div>
					</div>
				</div>
				<div style="height: 22px;" class="bracket-placeholder"></div>
				<div style="height: 78px;" class="bracket-connector bracket-connector-up">
					<div class="bracket-connector-part bracket-connector-left" style="float: left; clear: left; width:9px;">
						<div style="width:9px;height:8px"> </div>
						<div style="width:9px;height:68px;border-bottom-right-radius:3px;border:solid #aaa;border-width:0 2px 2px 0"> </div>
					</div>
					<div class="bracket-connector-part bracket-connector-right" style="float: left; width:9px;">
						<div style="width:9px;height:6px;border-top-left-radius:3px;border:solid #aaa;border-width:2px 0 0 2px"> </div>
						<div style="width:9px;height:70px;"> </div>
					</div>
				</div>
				<div style="height:35px;" class="bracket-placeholder"></div>
			</div>
			<div style="width: 150px;" class="bracket-column bracket-game-column">
				<div class="bracket-header-container" style="height:164px;margin-top:0px"><div class="bracket-header" id="R3"><input type="text" value="Grand Finals"/></div></div>
				<div class="bracket-element bracket-game ui-widget-content">
					<div class="bracket-cell bracket-cell-r1">
						<div class="bracket-player-top"><div class="bracket-score" style="width:21px"> </div></div>
					</div>
					<div class="bracket-cell bracket-cell-r1">
						<div class="bracket-player-bottom"><div class="bracket-score" style="width:21px"> </div></div>
					</div>
				</div>
				<!--<div class="bracket-element bracket-game bracket-thirdplacematch" style="margin-top:11px;">
					<div class="bracket-cell bracket-cell-r1">
						<div class="bracket-player-top"><div class="bracket-score" style="width:21px"> </div></div>
					</div>
					<div class="bracket-cell bracket-cell-r1">
						<div class="bracket-player-bottom"><div class="bracket-score" style="width:21px"> </div></div>
					</div>
					<div class="bracket-thirdplacematchlabel" style="position:absolute;width:100%;text-align:center;top:-6px"><b>3rd Place Match</b></div>
				</div>-->
			</div>
		</div>
		<div style="clear:left;"> </div>
	</div>
</body>
</html>