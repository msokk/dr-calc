$(function(){
  var App = window.App = {
    loader: $('#loader')
  };
  
  App.loader.ajaxStart(function(){
    $(this).show();
  });
  
  App.loader.ajaxStop(function(){
    $(this).hide();
  });

  /**
   * One and only model
   */
  App.Calculation = Backbone.Model.extend({
    name: '',
    interest: '',
    starting_value: '',
    quantity: '',
    years: '',
    toJSON: function() {
      return { calculation: this.attributes }
    }
  });

  /**
   * We have a collection of models
   */
  var Calculations = Backbone.Collection.extend({
    url: '/calculations',
    model: App.Calculation
  });
  
  App.Calculations = new Calculations();
  
  //VIEWS
  App.IndexView = Backbone.View.extend({
    initialize: function() {
      _.bindAll(this, "render");
    },
    
    render: function() {
      $(this.el).html(ich.index());
      return this;
    }

  });
  
  App.CreateView = Backbone.View.extend({
    initialize: function() {
      _.bindAll(this, "render");
    },
    
    events: {
      "click #calculate": "save",
      "change #createForm input": "recalculate"
    },
    
    render: function() {
      $(this.el).html(ich.create(App.Calculations.toJSON()));
      return this;
    },
    
    save: function() {
      var othello = App.Calculations.create({
        name: $('input#name').val(),
        interest: $('input#interest').val(),
        starting_value: $('input#starting_value').val(),
        quantity: $('input#quantity').val(),
        years: $('input#years').val()
      });
    },
    
    recalculate: function() {
      var values = {
        name: $('input#name').val(),
        interest: $('input#interest').val(),
        starting_value: $('input#starting_value').val(),
        quantity: $('input#quantity').val(),
        years: $('input#years').val()
      };
      
      console.log(values);
    }

  });

  var CalcController = Backbone.Controller.extend({

    routes: {
      "": "index",
      "create": "create",
      "destroy/:id": "destroy",
      "edit/:id": "edit"
    },

    index: function() {
      App.Calculations.fetch();
      new App.IndexView({ el: $('#container') }).render();
    },
    
    create: function() {
      new App.CreateView({ el: $('#container') }).render();
    },
    
    destroy: function() {
    
    },
    
    edit: function() {
      
    }
  });

  App.CalcController = new CalcController();
  Backbone.history.start();
});
