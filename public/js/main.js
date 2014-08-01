var htmlLink ='http://mtgimage.com/setname/magic%202014%20core%20set/';  //store first part of HTML link for concatenation.

var CardsModel = Backbone.Model.extend({});
var CardsCollection = Backbone.Collection.extend({
  model:CardsModel,
  url:'api/list',
  comparator: "title"
});
// Create a collection organized by title

var cardsCollection = new CardsCollection(); // start a new collection.

// create an array of card names for testing. The temp variable is used to
// store the concatenated URL to find card images.
var list = [];
var temp ='';



 list.push('Child of Night');
 list.push('Solemn Offering');
 list.push('Angelic Wall');

//var rand = Math.random()*list.length;
//rand = Math.floor(rand);

$.getJSON("/js/lib/M14.json", function(data){
  data.cards.forEach(function(cardInfo, index){

      (function populate(){

        var card ={};
          list.forEach(function(name, index){
            if( cardInfo.name === name){
            card.title = name;
            card.img = htmlLink + (name.replace(/\ /g, '%20')) +'.jpg';
            card.text = cardInfo.text;
            console.log('\n', card.title, '\n');

            cardsCollection.create(card);
            card ={};
          }
        });

      })();

   });
  $(function () {
  window.app = new Router();
  Backbone.history.start();
});

 });

var Router = Backbone.Router.extend({
  routes: {
    '': 'home'
  },
  home: function () {
    this.homeView = new HomeView({collection: cardsCollection});
    this.homeView.render();
  }

});

var HomeView = Backbone.View.extend({
  el: 'tbody',

    render: function () {
      cardsCollection.fetch({success:function(){
      for (var i=0; i < cardsCollection.length;++i){
        console.log(cardsCollection.models.length);
        temp +='<tr><td style ="display: inline-block; width: 200"><img width="200" class="img-responsive" src= '+
        cardsCollection.models[i].attributes.img +'></td>' + '<td style ="float: left width:200" align ="left">' +
        cardsCollection.models[i].attributes.text+'</td></tr>';
       }
         $(this.el).html(temp);
       }});
   }
  });

temp = '';




// this.create vs add adds it to server.
