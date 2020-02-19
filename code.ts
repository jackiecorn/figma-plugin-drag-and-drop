figma.showUI(__html__);

figma.ui.onmessage = msg => {
	const { dropPosition, windowSize, offset } = msg;

	// Getting the position and size of the visible area of the canvas.
	const bounds = figma.viewport.bounds;

	// Getting the zoom level
	const zoom = figma.viewport.zoom;

	// There are two states of the Figma interface: With or without the UI (toolbar + left and right panes)
	// The calculations would be slightly different, depending on whether the UI is shown.
	// So to determine if the UI is shown, we'll be comparing the bounds to the window's width.
	// Math.round is used here because sometimes bounds.width * zoom may return a floating point number very close but not exactly the window width.
	const hasUI = Math.round(bounds.width * zoom) !== windowSize.width;

	// Since the left pane is resizable, we need to get its width by subtracting the right pane and the canvas width from the window width.
	const leftPaneWidth = windowSize.width - bounds.width * zoom - 240;

	// Getting the position of the cursor relative to the top-left corner of the canvas.
	const xFromCanvas = hasUI ? dropPosition.clientX - leftPaneWidth : dropPosition.clientX;
	const yFromCanvas = hasUI ? dropPosition.clientY - 40 : dropPosition.clientY;

	const rect = figma.createRectangle();
	rect.resize(100, 100);
	figma.currentPage.appendChild(rect);

	// The canvas position of the drop point can be calculated using the following:
	rect.x = bounds.x + xFromCanvas / zoom - offset.x;
	rect.y = bounds.y + yFromCanvas / zoom - offset.y;

	figma.currentPage.selection = [rect];
};
