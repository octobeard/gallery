var frames =
    [{ height: 360, width: 1000 },
     { height: 600, width: 400 },
     { height: 400, width: 600 },
     { height: 400, width: 600 },
     { height: 400, width: 300 },
     { height: 400, width: 300 }];

(function() {
    var root = this;

    // Private helper functions

    /**
     * Normalize the images in a row to a given height.
     *
     * @param row {Array<Object>} array of frame objects with height/width properties
     * @param height {number} new height of row
     */
    function normalizeRowHeight(row, height) {
        row.forEach(function(image) {
            image.width = Math.floor((image.width / image.height) * height);
            image.height = height;
        });
    }

    /**
     * Returns the calculated total row width with spacing.
     *
     * @param row {Array<Object>} array of frame objects with height/width properties
     * @param spacing {number} pixels of spacing between images
     * @returns {number} calculated width
     */
    function getRowWidth(row, spacing) {
        var width = 0;
        row.forEach(function(image) {
            width += image.width;
        });
        return width + ((row.length - 1) * spacing);
    }

    /**
     * Adjusts dimensions on the given row to fit the given containerWidth. Calculates the percentage
     * width to shrink and shrinks the height an equal amount.
     *
     * @param row {Array<Object>} array of frame objects with height/width properties
     * @param spacing {number} pixels of spacing between images
     * @param containerWidth {number} width of row to adjust to
     */
    function adjustRowToFitContainer(row, spacing, containerWidth) {
        var width = getRowWidth(row, 0);
        var fitWidth = containerWidth - ((row.length - 1) * spacing);
        row.forEach(function(image) {
            image.width = Math.floor(image.width * (fitWidth/width));
            image.height = Math.floor(image.height * (fitWidth/width));
        });
    }

    this.Gallery = {
        /**
         * Adjust array of given image dimensions to a number of rows that will fit the containerWidth
         * 
         * @param images {Array<Object>} array of frame objects with height/width properties
         * @param containerWidth{number} width of the containing element, in pixels
         * @param maxRowHeight {number} maximum height of each row of images, in pixels
         * @param spacing {number} spacing between images in a row, in pixels
         * @returns {Array<Array<Object>>} array of rows of resized frames
         */
        layoutFrames:    function(images, containerWidth, maxRowHeight, spacing) {
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
    };

}.call(this));
