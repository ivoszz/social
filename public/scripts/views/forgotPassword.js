define(['SocialNetView', 'text!templates/forgotPassword.html'],
    function(SocialNetView, forgotPasswordTemplate) {
  var forgotPasswordView = SocialNetView.extend({
    el: $('#content'),

    events: {
      "submit form": "password"
    },

    password: function() {
      $.post('/forgotPassword', {
        email: $('input[name=email]').val()
      }, function(data) {
        console.log(data);
      });
      return false;
    },

    render: function() {
      this.$el.html(forgotPasswordTemplate);
    }
  });

  return forgotPasswordView;
});