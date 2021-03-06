const appTotal = {};

// Random numbers generator
appTotal.randomNyt = function(nytArray) {
  return Math.floor(Math.random() * nytArray.length);
};
appTotal.randomLcbo = function(lcboArray){
  return Math.floor(Math.random() * lcboArray.length);
};

// Holding all events
appTotal.events = function(){

// User Input for NYT
$('.party-type--form').on('click', function (event) {
  appTotal.nytSubject = $(this).attr('id'); 
  appTotal.lcboTags = $(this).attr('data-type');
  appTotal.nytGenerator(appTotal.nytSubject);
});

// User Input for LCBO
$('.price-level--form').on('click', function (event) {
  appTotal.lcboPrice = $(this).attr('id');
  appTotal.lcboAsc = $(this).attr('data-set');
  appTotal.lcboPagePosition = $(this).attr('data-page');
  console.log(appTotal.lcboPagePosition);
  appTotal.lcboGenerator();
});

// Give users more/other results that match their original responses
$('.another-please--button').on('click', function (event) {
  event.preventDefault();
  appTotal.nytGenerator(appTotal.nytSubject);
  appTotal.lcboGenerator();
});

// Reset button that resets page and brings user back to first page
  $('.section-three--anchor').on('click', function (event) {
    event.preventDefault();
    location.reload();
  });

  // Toggles that bring user from section to section
  $('.section-one--button').on('click', function () {
    $(".section-two--dis").show();
  });

  $('.section-two--button').on('click', function () {
    $(".section-three--dis").show();
  });

  // Smooth scroll
  $('a').smoothScroll({
    speed: 1200
  });
}

// NYT Function
appTotal.nytGenerator = function(nytResult) {

  let url = `https://api.nytimes.com/svc/mostpopular/v2/mostshared/${nytResult}/7.json`;
  url += '?' + $.param({
    'api-key': "6c76a32dd92243a7890f11db2690506c"
  });
  $.ajax({
    url: url,
    method: 'GET',
  }).then(function(result) {
    const nytResults = result.results;
    appTotal.nytDisplayResults(nytResults);
  }).fail(function (err) {
    throw err;
  });
};

// Displays NYT results on page
appTotal.nytDisplayResults = function(nytResults) {
    const nytRandumNumber = appTotal.randomNyt(nytResults);

    const nytPeice = nytResults[nytRandumNumber];
    
    const nytTitle = (`<h3><a href="${nytPeice.url}">${nytPeice.title}</a></h3>`);
    const nytByline = (`<p class="nytbyline">${nytPeice.byline}</p>`);
    const nytAbstract = (`<p class="final-results--paragraphs">${nytPeice.abstract}</p>`); 
    const nytContainer = $(`<div class="results--background">`).append(nytTitle, nytByline, nytAbstract);
    
    $(".nyt-result").html(nytContainer);
}

// LCBO

appTotal.lcboGenerator = function() {
  $.ajax({
  url: 'https://lcboapi.com/products',
  headers: { 'Authorization': 'Token MDo2MjE2OWI1Ni1jOTRjLTExZTctODNhMy1hNzkxNDdlZTVkZGU6SmRFdEJ2MHF5OHRUMUFTTVNWYWhVeHMzbDY2Wlh5UDQ3cFhB' },
  data:{
    is_dead: false,
    q: appTotal.lcboTags,
    order: `price_in_cents.${appTotal.lcboAsc}`,
    per_page: 100,
    page: appTotal.lcboPagePosition
    }
  }).then(function (results) {
    const lcboResults = results.result;
    appTotal.lcboDisplayResults(lcboResults);
    }).fail(function (err) {
    throw err;
  });

};

// Displays LCBO results

appTotal.lcboDisplayResults = function (lcboResults) {
  lcboResults = lcboResults.filter(function (lcboPeice) {
    return lcboPeice.image_thumb_url != null;
  });

  const lcboRandumNumber = appTotal.randomLcbo(lcboResults);
  const lcboPeice = lcboResults[lcboRandumNumber];

  // Lcbo money converter and lcbo website

  const lcboInDollars = (lcboPeice.price_in_cents/ 100).toFixed(2)
  const lcboWebsite = "http://www.LCBO.com"


  // Sending lcbo info to DOM

  const lcboTitle = (`<h3><a href="${lcboWebsite}">${lcboPeice.name}</a></h3>`);
  const lcboPhoto = (`<div class="lcbo-photo--background"><img src="${lcboPeice.image_thumb_url}" alt="${lcboPeice.name}"></div>`);
  const lcboFinalPrice = (`<p class="final-results--paragraphs">Price: $${lcboInDollars}</p>`);

  const lcboContainer = $(`<div>`).append(lcboTitle, lcboFinalPrice, lcboPhoto);

  $(".lcbo-result").html(lcboContainer);
  
};

appTotal.init = function(){
  appTotal.events();
  $('.prettySocial').prettySocial();
};

// The final goods
$(function() {
  appTotal.init();
});


