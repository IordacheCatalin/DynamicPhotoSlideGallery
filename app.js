"use strict";
(function () {

    $(document).ready(function () {
       
        var appUrl = $("#appUrl").val();
        var $loader = $("#app-loader-container");

        let slideIndex = 1;
        var connection = new signalR.HubConnectionBuilder().withUrl(appUrl + "cameraHub").build();
        connection.start().then(function () {
            /* alert('start');*/
        }).catch(function (err) {
            return console.error(err.toString());
        });

        var categoryGalleries = {};

        var receivedMessageHandler = function (receivedMessage, category) {
            if (category === "CarCertificate") {
                $('#takePhotoResultModalLabel').text('Poză Talon');
            } else {
                $('#takePhotoResultModalLabel').text('Poză Buletin');
            }

            if (receivedMessage === "TakePhotoOpen") {           
                $('#takePhotoModal').modal().modal('hide');
                $('#takePhotoResultModal').modal().modal('show');
            } else {
                $('#photoCategory').html(category);

                if (!categoryGalleries[category]) {
                    // Create a new gallery for the category
                    categoryGalleries[category] = createCategoryGallery(category);
                    $('#photoPicture').append(categoryGalleries[category]);
                }
                var slideNumber = $('.mySlides', categoryGalleries[category]).length + 1;
                var imgTake =
                    "<div class='mySlides slide-gallery'>" +
                    "<div class='numbertext slide-gallery'>" + slideNumber + " photo</div>" +
                    "<img src='" + receivedMessage + "' class='image-container-slide slide-gallery'" + "' data-categori='" + category + "' >" +
                    "</div>";
                $('.photoPicture_' + category + ' .photo-' + category + '-container').append(imgTake);

                var thumbnailImg =
                    "<div class='thumbnail-container-slide slide-gallery'>" +
                    "<img class='image-thumbnail cursor slide-gallery' src='" + receivedMessage + "'alt='" + slideNumber + "' data-category='" + category + "'>" +
                    "</div>";
                categoryGalleries[category].find('.row.slide-gallery').append(thumbnailImg);
            }
            showSlides(category);
        };

        var chanel = $("#CameraChanelGuid").val();
        connection.on(chanel, receivedMessageHandler);

        function createCategoryGallery(category) {
            var galleryHTML =
                `<div class="container-slide-show slide-gallery">            
                <div class="photoPicture_${category}">
                   <div class="slide-title slide-gallery">Document category: ${category}</div>
                   <div class="photo-${category}-container"></div>
                   <div class="btn-slide-group slide-gallery">
                    <a class="prev-image btn-slide-show-prev slide-gallery" data-category="${category}">&#10094;</a>
                    <a class="next-image btn-slide-show-next slide-gallery" data-category="${category}">&#10095;</a>
                   </div>                  
                    <div class="caption-container slide-gallery">
                        <span>Photo number: </span>
                        <span id="caption_${category}"></span>
                    </div>         
                    <div class="row slide-gallery"></div>
                </div>
            </div>`;
            return $(galleryHTML);
        }

        function plusSlides(category, any) {
            slideIndex += any;
            showSlides(category);
        }
        function showSlides(category, currentIndex) {

            let slides = $('.photoPicture_' + category + ' .mySlides');
            let images = $('.photoPicture_' + category + ' .mySlides' + ' ' + 'img');
            let dots = $('.photoPicture_' + category + ' .image-thumbnail');
            let captionText = $("#caption_" + category);

            var totalSlides = slides.length;

            if (currentIndex) {
                slideIndex = parseInt(currentIndex);
            } else {
                if (slideIndex > totalSlides) { slideIndex = 1; }
                if (slideIndex < 1) { slideIndex = totalSlides; }
            }
            slides.hide();
            dots.removeClass("active thumbnail-selected");
            slides.removeClass("photo-container-selected");
            images.removeClass("photo-selected");
            $(slides[slideIndex - 1]).css("display", "block");
            $(slides[slideIndex - 1]).addClass("photo-container-selected");
            $(images[slideIndex - 1]).addClass("photo-selected");
            $(dots[slideIndex - 1]).addClass("active-thumbnail thumbnail-selected");
            captionText.html($(dots[slideIndex - 1]).attr("alt"));
        }

        $(document).on("click", ".btn-slide-show-next", function () {
            let category = $(this).data('category');
            plusSlides(category, 1);
        });

        $(document).on("click", ".btn-slide-show-prev", function () {
            let category = $(this).data('category');
            plusSlides(category, -1);
        });

        $(document).on("click", ".image-thumbnail", function () {
            let category = $(this).data('category');
            let currentIndex = $(this).attr('alt');
            showSlides(category, currentIndex);
        });

        $('.close-modal.take-photo-modal').on('click', function () {
            $('#takePhotoResultModal').modal('hide');
        });


    });


})();