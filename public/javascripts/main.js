$(function(){
  var App = window.App = {
    loader: $('#loader'),
    views: {}
  };
  
  //Helpers
  
  /**
   * Loading bar helpers
   */
  App.loader.ajaxStart(function(){
    $(this).show();
  });
  
  App.loader.ajaxStop(function(){
    $(this).hide();
  });
  
  /**
   * Make the calculations based on params 
   * and return data structure
   */
  App.calculate = function(price, qnt, percent, years) {
    var total = price * qnt;
    percent = (percent == 0)? 0: (percent / 100);
    var graphdata = [];
    graphdata.push(total);
    for(var i = 0; i < years; i++) {
      total = total + (total * percent);
      graphdata.push(total);
    }
    return { total: total, data: graphdata };
  };
  
  /**
   * Draw chart based on calculated data
   */
  App.drawChart = function(data) {
    var thisYear = new Date().getFullYear();
    var years = [];
    for(var i = 0; i < data.length; i++) {
      years.push(thisYear + i);
    };
  
    var chart = new Highcharts.Chart({
      credits: {
        enabled: false
      },
      chart: {
        renderTo: 'chart',
        defaultSeriesType: 'line',
        marginRight: 20,
      },
      title: {
        text: 'Tulemus',
        x: -20
      },
      xAxis: { categories: years },
      yAxis: {
        title: { text: 'EUR' },
        plotLines: [{ value: 0, width: 1,
          color: '#434654' }]
      },
      tooltip: {
        formatter: function() {
         return '<b>' + this.x +'</b>: '
          + Number(this.y).toPrecision(4) +' €';
        }
      },
      legend: { enabled: false },
      series: [{ data: data }]
    });
  };
  
  //END HELPERS

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
  App.CalculationsCollection = Backbone.Collection.extend({
    url: '/calculations',
    model: App.Calculation
  });
  
  //VIEWS
  
  /**
   * Render and maintain index page UI logic
   */
  App.IndexView = Backbone.View.extend({
  
    el: $('#container'),
    
    initialize: function() {
      _.bindAll(this, 'render');
    },
    
    events: {
      'click .deleteBtn': 'remove'
    },
    
    render: function() {
      $(this.el).html($('#index-tmpl').tmpl(App.Calculations));
      return this;
    },
    
    remove: function(e) {
      if(confirm('Oled kindel?')) {
        var row = $(e.target).parent().parent(); //HACKISH
        var id = $(row).attr('id');
        var calculation = App.Calculations.get(id);
        calculation.destroy();
        $(row).remove();
      }
    }
  });
  
  /**
   * Render and maintain index page UI logic
   */
  App.CreateEditShowView = Backbone.View.extend({
    el: $('#container'),
    
    model: null,
      
    initialize: function() {
      _.bindAll(this, 'render');
    },
    
    events: {
      'click #calculate': 'save',
      'click #updateBtn': 'update',
      'keyup #createForm input': 'recalculate',
      'keyup #editForm input': 'recalculate'
    },
    
    render: function(model) {
      if(model) {
        this.model = model;
        $(this.el).html($('#edit-tmpl').tmpl({old: model})); //Bit hackish
        this.recalculate();
      } else {
        $(this.el).html($('#create-tmpl').tmpl());
      }
      return this;
    },
    
    gatherValues: function() {
      return {
        name: $('input#name').val() || 'Arvutus',
        interest: $('input#interest').val() || 0,
        starting_value: $('input#starting_value').val() || 0,
        quantity: $('input#quantity').val() || 0,
        years: $('input#years').val() || 0
      };
    },
    
    save: function() {
      App.Calculations.create(this.gatherValues());
    },
    
    update: function() {
      this.model.save(this.gatherValues());
    },
    
    recalculate: _.debounce(function() {
      var values = this.gatherValues();
      App.drawChart(
        App.calculate(values.starting_value, values.quantity, 
          values.interest, values.years).data
      );
    }, 150)

  });
  

  /**
   * Application router
   */
  var CalcRouter = Backbone.Router.extend({

    routes: {
      '': 'index',
      'create': 'create',
      'edit/:id': 'edit'
    },

    index: function() {
      App.Calculations.fetch({ success: function() { //When to fetch data?
        App.views.index.render();
      } });
    },
    
    create: function() {
      App.views.ces.render();
    },
    
    edit: function(id) {
      App.Calculations.fetch({ success: function() { //Not the best practice
        App.views.ces.render(App.Calculations.get(id));
      } });
    }
    
  });
  
  //Bootstrap the app
  App.Calculations = new App.CalculationsCollection();
  App.views.index = new App.IndexView();
  App.views.ces = new App.CreateEditShowView();
  App.CalcRouter = new CalcRouter();
  Backbone.history.start();
});
