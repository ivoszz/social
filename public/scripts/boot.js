require.config({
  paths: {
    jQuery: '/scripts/libs/jquery',
    Underscore: '/scripts/libs/underscore',
    Backbone: '/scripts/libs/backbone',
    models: 'models',
    text: '/scripts/libs/text',
    templates: '/templates',

    SocialNetView: '/scripts/SocialNetView'
  },
  shim: {
    'Backbone': ['Underscore', 'jQuery'],
    'SocialNet': ['Backbone']
  }
});

require(['SocialNet'], function(SocialNet) {
  SocialNet.initialize();
});