Posts = new Meteor.Collection('Posts');

// MongoDb schema
Posts.attachSchema(new SimpleSchema({
  title: {
    type: String,
    label: "Title",
    max: 200
  },
  author: {
    type: String,
    label: "Author"
  },
  isbn: {
    type: Number,
    label: "ISBN of a book",
    min: 1111111111,
    max: 9999999999
  },
  summary: {
    type: String,
    label: "Brief summary",
    optional: true,
    max: 1000
  },
  cost: {
    type: Number,
    label: "Cost",
    min: 0.1,
    max: 10000,
    decimal: true,
  },
  createdBy: {
    type: String,
    autoValue:function(){ return this.userId }
  },
}));

// Code, that runs only on the client side of an application
if (Meteor.isClient){

  /* *******
   * Routing
   * */
  Router.route('/', function() {
    this.render('mainView');
  });

  Router.route('/buy', function () {
    this.render('buyView');
  });

  Router.route('/sell', function () {
    this.render('sellView');
  });

  /* *******
   * Helpers
   * */
  Template.buyView.helpers({
    posts: function () {
      return Posts.find({});
    }
  });

  /* *******
   * Configuring UAC with usernames only
   * */
  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });
}

