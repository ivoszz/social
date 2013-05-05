define(function(require) {
  var Status = Backbone.Model.extend({
    urlRoot: '/account/' + this.accountId + '/status'
  });

  return Status;
});