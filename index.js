#!/usr/bin/env osascript -l JavaScript

const prefName = 'System Preferences';

function showError(err, title) {
	const app = Application.currentApplication();
	app.includeStandardAdditions = true;
	app.displayAlert(err.toString(), {
		withTitle: title
	});
}

function getBrightnessSliders() {
	return new Application('System Events')
		.processes[prefName]
		.windows()
		.filter(w => w.tabGroups.length > 0).map(w => w.tabGroups[0])
		.filter(t => t.groups.length > 0).map(t => t.groups[0])
		.filter(g => g.sliders.length > 0).map(g => g.sliders[0]);
}

function run(argv) {
	const prefApp = new Application(prefName);
	const anchor = prefApp
		.panes.byId('com.apple.preference.displays')
		.anchors.byName('displaysDisplayTab');

	try {
		anchor.reveal();
		delay(0.2);
	} catch (err) {
		showError(err, err.toString());
		return;
	}

	if (/\d+/.test(argv[0])) {
		const sliders = getBrightnessSliders();
		if (sliders.length <= 0) {
			showError('Failed to find any sliders about brightness', 'Error');
		} else {
			sliders[0].value = Number.parseInt(argv[0], 10) / 100;
		}
	} else {
		showError('Please set brightness(0 ~ 100)', 'Error');
	}

	prefApp.quit();
}

