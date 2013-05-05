define(['models/StatusCollection'], function(StatusCollection) {
  var Account = Backbone.Model.extend({
    urlRoot: '/account',
    initialize: function() {
      this.status = new StatusCollection();
      this.status.url = '/account/' + this.id + '/status';
      this.activity = new StatusCollection();
      this.activity.url = '/account/' + this.id + '/activity';
    }
  });

  return Account;
});