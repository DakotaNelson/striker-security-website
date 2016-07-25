(function($) {
  // Newsletter signup
    $('#newsletter .submit').on("click", function() {
      ga('send', 'event', 'NewsletterSignup', 'Submit');

      // TODO actually send the data (formspree?)
      var emailAddress = $("#newsletter input[name=email]").val();

      event.preventDefault();
    });

  // Contact form
    $('#send-message').on("click", function() {
      ga('send', 'event', 'ContactForm', 'Submit');

      // TODO actually send the data (formspree?)
      var emailAddress = $("#contact-form input[name=email]").val();
      var name = $("#contact-form input[name=name]").val();
      var subject = $("#contact-form input[name=subject]").val();
      var message = $("#contact-form textarea[name=message]").val();

      // TODO see if validation is necessary
      // if (!emailAddress) {
      //   console.log("no email address given");
      // }

      event.preventDefault();
    });
})(jQuery);
