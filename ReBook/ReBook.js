Posts = new Meteor.Collection('Posts');

//SECURITY - Allow Callbacks for posting
Posts.allow({
  insert: function(userId, doc) {
    // only allow posting if you are logged in
    return !! userId;
  },
});

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
  // *** EMAIL DOES NOT GET VALIDATED
  email:{
    type: String,
    label: "Email",
  },
  createdBy: {
    type: String,
    autoValue: function(){ return Meteor.userId() }
  },
  username: {
    type: String,
    autoValue: function(){ return Meteor.user().username }
  },
  createdAt: {
    type: Date,
    autoValue: function(){ return new Date(); }
  },
}));

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish("Posts", function () {
    return Posts.find();
  });
}

// Code, that runs only on the client side of an application
if (Meteor.isClient){

  // Subscribing for posts
  Meteor.subscribe('Posts');

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
  // Buy view helper
  Template.buyView.helpers({
    // Return all the posts from DB
    posts: function () {
      return Posts.find({}, {sort: {createdAt: -1}});
    },
    // Counter to show all the books in the DB
    booksCounter: function(){
      return Posts.find({}).count();
    },
    isOwner: function () {
      return this.createdBy === Meteor.userId();
    }
  });

  /* *******
   * Events
   * */
  // Buy view events
  Template.buyView.events({
    'click .delete': function () {
      Meteor.call("deletePost", this._id);
    }
  });

  /* *******
   * Configuring UAC with usernames only
   * */
  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });
}

/*
* Meteor methods adding
* */
Meteor.methods({
  deletePost: function (postId) {
    var post = Posts.findOne(postId);
    if (post.createdBy !== Meteor.userId()) {
      // If the task is private, make sure only the owner can delete it
      throw new Meteor.Error("not-authorized");
    }

    // If user is the owner, then delete post
    Posts.remove(postId);
  }
});

