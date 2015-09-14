var frames =
    [{ height: 360, width: 1000 },
     { height: 600, width: 400 },
     { height: 400, width: 600 },
     { height: 400, width: 600 },
     { height: 400, width: 300 },
     { height: 400, width: 300 }];

var cats = [
    { height: 900, width: 1600, file: "cat1.jpg" },
    { height: 920, width: 1150, file: "cat2.jpg"  },
    { height: 660, width: 1024, file: "cat3.jpg"  },
    { height: 828, width: 1913, file: "cat4.jpg"  },
    { height: 749, width: 852, file: "cat5.jpg"  },
    { height: 962, width: 1576, file: "cat6.jpg"  },
    { height: 754, width: 1270, file: "cat7.jpg"  },
    { height: 2407, width: 3743, file: "cat8.jpg"  },
    { height: 730, width: 459, file: "cat9.jpg"  },
    { height: 1200, width: 1920, file: "cat10.jpg"  },
    { height: 768, width: 1024, file: "cat11.jpg"  },
    { height: 1000, width: 1110, file: "cat12.jpg"  },
    { height: 768, width: 1024, file: "cat13.jpg"  },
    { height: 733, width: 822, file: "cat14.jpg"  },
    { height: 1200, width: 1920, file: "cat15.jpg"  }
];

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

    // Public API

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
        layoutFrames: function(images, containerWidth, maxRowHeight, spacing) {
            var rows = [];
            var currRow = [];
            var currRowHeight = maxRowHeight;
            // inelegant deep copy to preserve source array.
            var imagesClone = JSON.parse(JSON.stringify(images));
            imagesClone.forEach(function(currImage) {
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
            });

            if (currRow.length > 1) {
                rows.push(currRow);
            }

            return rows;
        },

        renderFrames: function(rows, containerWidth, spacing) {
            document.getElementById("container").innerHTML = "";
            var html = [];
            // render row
            rows.forEach(function(row) {
                html.push("<div style='width:" + containerWidth + "px;'>");
                //render image
                row.forEach(function(image, index) {
                    var marginRight = 0;
                    if (index < row.length - 1) {
                        marginRight = spacing + "px";
                    }
                    html.push("<div class='gallery-image' style='width:" + image.width + "; margin-right:" + marginRight + "; margin-bottom: " + spacing + "px;'>");
                    html.push("<img src='images/" + image.file + "' width='" + image.width + "' height='" + image.height + "' border='0'>");
                    html.push("<div class='image-footer'>", image.file, "</div>");
                    html.push("</div>");
                });
                html.push("</div>");
            });
            document.getElementById("container").innerHTML = html.join("");
        }
    };

}.call(this));

document.addEventListener("DOMContentLoaded", function(event) {
    Gallery.renderFrames(Gallery.layoutFrames(cats, 1000, 260, 10), 1000, 10);
});
