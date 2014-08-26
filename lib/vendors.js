var vendors = {
  "De Atramentis" : {
    url : "http://www.de-atramentis.com"
  },
  "Delta" :  {
    url : "https://www.facebook.com/deltainkhelena"
  },
  "Diamine" : {
    url :  "http://www.diamineinks.co.uk"
  },
  "J. Herbin" : {
    url :  "http://www.jherbin.com"
  },
  "Kaweco" : {
    url :  "http://www.kaweco-pen.com"
  },
  "Lamy" : {
    url :  "http://lamyusa.com/refills_main.php"
  },
  "Monteverde" : {
    url :  "http://www.monteverdepens.com/new_refill_page.html"
  },
  "Noodler's Ink" : {
    url :  "http://noodlersink.com"
  },
  "Omas" : {
    url :  "http://www.omas.com/en/collections/accessories/inks"
  },
  "Organics Studio" : {
    url :  "http://www.organicsstudio.com"
  },
  "Parker Quink" : {
    url :  "http://www.parkerpen.com/en-US/pens-inks/ink-bottles"
  },
  "Pelikan 4001" : {
    url :  "http://www.pelikan.com/pulse/Pulsar/en_US.Store.displayStore.135685./the-pelikan-ink-4001"
  },
  "Pilot" : {
    url :  "http://pilotpen.us/categories/refills-ink"
  },
  "Platinum" : {
    url :  "http://www.platinum-pen.co.jp/products/spare/ink/eink_.html"
  },
  "Private Reserve" : {
    url :  "http://privatereserveink.com"
  },
  "Rohrer & Klingner" : {
    url :  "http://www.rohrer-klingner.de/index.php?id=2&L=1"
  },
  "Waterman" : {
    url :  "http://www.waterman.com/en/7-inks"
  },
  "Talens Ecoline" : {
    url :  "http://www.talens.com/en-us/brands/talens/graphic-art-products/ecoline-liquid-water-colour"
  }
};

var fallback = {
  url: "http://www.duckduckgo.com"
}

var findVendor = function(name) {
  var vendor = vendors[name];
  if(vendor) return vendor;
  return fallback;
};

module.exports = {
  load: function(req, res, next) {
    res.locals.findVendor = findVendor;
    next();
  }
};

