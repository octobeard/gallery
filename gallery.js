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

        /**
         * Renders a given list of images dimensions and files into a gallery.  Formats images first and
         * then builds up an html string and places result in the container div.
         *
         * @param images {Array<Object>} array of frame objects with height/width properties
         * @param containerWidth{number} width of the containing element, in pixels
         * @param maxRowHeight {number} maximum height of each row of images, in pixels
         * @param spacing {number} spacing between images in a row, in pixels
         */
        renderFrames: function(images, containerWidth, maxRowHeight, spacing) {
            var rows = Gallery.layoutFrames(images, containerWidth, maxRowHeight, spacing);
            document.getElementById("container").innerHTML = "";
            var html = [];
            // render row
            rows.forEach(function(row) {
                html.push("<div style='width:", containerWidth, "px;'>");
                //render image
                row.forEach(function(image, index) {
                    var marginRight = 0;
                    if (index < row.length - 1) {
                        marginRight = spacing + "px";
                    }
                    // normally I'd use a handlebars template but going native here.
                    html.push("<div class='gallery-image' style='width:", image.width, "px; margin-right:",
                              marginRight, "; margin-bottom: ", spacing, "px;'>");
                    html.push("<img src='images/", image.file, "' width='", image.width, "' height='", image.height,
                              "' border='0'>");
                    html.push("<div class='image-footer' style='width: ", image.width, "px'>", image.title, "</div>");
                    html.push("</div>");
                });
                html.push("</div>");
            });
            document.getElementById("container").innerHTML = html.join("");
        }
    };

}.call(this));

// test data!
var cats = [
    { height: 900, width: 1600, file: "cat1.jpg", title: "I'm open!" },
    { height: 920, width: 1150, file: "cat2.jpg", title: "Where's the cuddle flower?" },
    { height: 660, width: 1024, file: "cat3.jpg", title: "This bucket is full of cute!"  },
    { height: 828, width: 1913, file: "cat4.jpg", title: "Go away!"  },
    { height: 749, width: 852, file: "cat5.jpg", title: "Twinning!"  },
    { height: 962, width: 1576, file: "cat6.jpg", title: "Facepalm."  },
    { height: 754, width: 1270, file: "cat7.jpg", title: "Peak fuzz."  },
    { height: 2407, width: 3743, file: "cat8.jpg", title: "Rawr!"  },
    { height: 730, width: 459, file: "cat9.jpg", title: "Chillin'"  },
    { height: 1200, width: 1920, file: "cat10.jpg", title: "Kitty head a-pokin'"  },
    { height: 768, width: 1024, file: "cat11.jpg", title: "I'm stumped!"  },
    { height: 1000, width: 1110, file: "cat12.jpg", title: "Delicious breath!"  },
    { height: 768, width: 1024, file: "cat13.jpg", title: "Like my sculpture?"  },
    { height: 733, width: 822, file: "cat14.jpg", title: "Meows given: 0"  },
    { height: 1200, width: 1920, file: "cat15.jpg", title: "Thpbhbthbt!!"  }
];

document.addEventListener("DOMContentLoaded", function(event) {
    Gallery.renderFrames(cats, 1200, 220, 10);
});
