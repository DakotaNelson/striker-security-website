(function($) {
  // Contact form
    var contactForm = $('#contact-form');
    contactForm.submit(function(e) {
      e.preventDefault();

      ga('send', 'event', 'ContactForm', 'Submit');

      // var emailAddress = $("#contact-form input[name=email]").val();
      // var name = $("#contact-form input[name=name]").val();
      // var subject = $("#contact-form input[name=subject]").val();
      // var message = $("#contact-form textarea[name=message]").val();

      // TODO see if validation is necessary
      // if (!emailAddress) {
      //   console.log("no email address given");
      // }

      $.ajax({
        url: "//formspree.io/dakota@strikersecurity.com",
        method: 'POST',
        data: $(this).serialize(),
        dataType: 'json',
        beforeSend: function() {
          $("#form-result").text("Message sending...");
        },
        success: function() {
          $("#form-result").text("Thanks! We're excited to follow up with you soon.");
          document.getElementById('contact-form').reset();
        },
        error: function() {
          $("#form-result").text("There was an error sending your message. Please try again or email consulting@strikersecurity.com");
        }
      });
    });
})(jQuery);
