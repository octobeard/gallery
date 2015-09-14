var frames =
    [{ height: 360, width: 1000 },
     { height: 600, width: 400 },
     { height: 400, width: 600 },
     { height: 400, width: 600 },
     { height: 400, width: 300 },
     { height: 400, width: 300 }];

/**
 * @param images {Array<Object>} array of frame objects with height/width properties
 * @param containerWidth{number} width of the containing element, in pixels
 * @param maxRowHeight {number} maximum height of each row of images, in pixels
 * @param spacing {number} spacing between images in a row, in pixels
 * @returns {Array<Array<Object>>} array of rows of resized frames
 */
function layoutFrames(images, containerWidth, maxRowHeight, spacing) {
    var rows = [];
    var currRow = [];
    var currRowHeight = maxRowHeight;
    while (images.length > 0) {
        var currImage = images.shift();
        currRow.push(currImage);

        if (currImage.height < currRowHeight) {
            currRowHeight = currImage.height;
        }
        normalizeRowHeight(currRow, currRowHeight);

        if (getRowWidth(currRow, spacing) > containerWidth) {
            // adjust row to meet container width by reducing height of each image to correspond and push it
            adjustRowToFitContainer(currRow, spacing, containerWidth);
            rows.push(currRow);
            currRow = [];
            currRowHeight = maxRowHeight;
        }
    }

    if (currRow.length > 1) {
        rows.push(currRow);
    }

    return rows;
}

function normalizeRowHeight(row, height) {
    row.forEach(function(image) {
        image.width = Math.floor((image.width / image.height) * height);
        image.height = height;
    });
}

function getRowWidth(row, spacing) {
    var width = 0;
    row.forEach(function(image) {
        width += image.width;
    });
    return width + ((row.length - 1) * spacing);
}


function adjustRowToFitContainer(row, spacing, containerWidth) {
    var width = getRowWidth(row, 0);
    var fitWidth = containerWidth - ((row.length - 1) * spacing);
    row.forEach(function(image) {
        image.width = Math.floor(image.width * (fitWidth/width));
        image.height = Math.floor(image.height * (fitWidth/width));
    });
}
