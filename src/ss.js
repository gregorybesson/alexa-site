module.exports = {};

var request = require('request');
var nsm = require("node-squarespace-middleware");
var sqsMiddleware = new nsm.Middleware();
var IMAGE_SHOWING = false;

sqsMiddleware.set("siteurl", "https://chrisgrant.squarespace.com");
sqsMiddleware.set("useremail", "hello@chrisgrant.co");
sqsMiddleware.set("userpassword", "Chris12345");



module.exports.editAlignment = function(intent, session, cb) {
  if (!session.TweakData) session.TweakData = require('./tweak.json');

  session.TweakData.tweakValues.alignment = intent.slots.alignment.value.capitalize();
  makeTweakChange(session.TweakData, cb);
};

module.exports.editBorder = function(intent, session, cb) {
  if (!session.TweakData) session.TweakData = require('./tweak.json');

  session.TweakData.tweakValues['enable-page-border'] = 'true';
  makeTweakChange(session.TweakData, cb);
};

module.exports.editIcons = function(intent, session, cb) {
  if (!session.TweakData) session.TweakData = require('./tweak.json');

  session.TweakData.tweakValues['social-icons-size'] = 'Small';
  makeTweakChange(session.TweakData, cb);
};

module.exports.editBackground = function(intent, session, cb) {
  //https://chrisgrant.squarespace.com/api/slides/572e5845859fd009b434d2ba/slices/572efec7f85082ddc7949fbe
  // 572f079ae707ebda425ee63b 572f0799e707ebda425ee638
  // https://chrisgrant.squarespace.com/api/commondata/RemoveItems?

  if (IMAGE_SHOWING) {
    console.log('ACTION: Removing Image');
    request({
      url: 'https://chrisgrant.squarespace.com/api/commondata/RemoveItems?crumb=' + sqsMiddleware.getCrumb(),
      method: 'POST',
      headers: sqsMiddleware.getHeaders(),
      form: {
        items: '572f14cd2fe131e2fe888c50'
      }
    }, function(err, res, data) {
      err = sqsMiddleware.getError(err, data);

      if (err) return cb(err);
      console.log('STATUS: COMPLETE');

      return cb(null, false);
    });
  } else {
    console.log('ACTION: Showing Images');
    request({
      url: 'https://chrisgrant.squarespace.com/api/slides/572e5845859fd009b434d2ba/slices/572efec7f85082ddc7949fbe?crumb=' + sqsMiddleware.getCrumb(),
      method: 'PUT',
      headers: sqsMiddleware.getHeaders(),
      json: {
        "websiteId": "551f3768e4b019d7121c966c",
        "createdOn": 1462697671444,
        "updatedOn": 1462699541370,
        "id": "572efec7f85082ddc7949fbe",
        "slideId": "572e5845859fd009b434d2ba",
        "type": 5,
        "content": {
          "_type": "Gallery",
          "slideId": "572e5845859fd009b434d2ba",
          "refreshRenderingAfterSave": false,
          "contentCollectionId": "572efe84f85082ddc7949f21",
          "source": 1,
          "disableImages": false
        },
        "isDemo": false,
        "isCompoundType": false,
        "absoluteType": 5,
        "absoluteContent": {
          "_type": "Gallery",
          "slideId": "572e5845859fd009b434d2ba",
          "refreshRenderingAfterSave": false,
          "contentCollectionId": "572efe84f85082ddc7949f21",
          "source": 1,
          "disableImages": true
        }
      }
    }, function(err, res, data) {
      err = sqsMiddleware.getError(err, data);

      if (err) return cb(err);
      console.log('STATUS: COMPLETE');

      IMAGE_SHOWING = true;
      return cb(null, true);
    });
  }

};





var makeTweakChange = function(data, cb) {
  if (sqsMiddleware.getCrumb()) {
    console.log('AUTHENTICATED');
    request({
      url: 'https://chrisgrant.squarespace.com/api/slides/572e5845859fd009b434d2ba/tweaks?crumb=' + sqsMiddleware.getCrumb(),
      method: 'PUT',
      headers: sqsMiddleware.getHeaders(),
      json: data
    }, function(err, res, data) {
      err = sqsMiddleware.getError(err, data);

      if (err) return cb(err);
      console.log('finished change');
      return cb(null);
    });
  } else {
    console.log('UNAUTHENTICATED');
    sqsMiddleware.doLogin(function(err, headers) {
      if (err) return cb(err);
      console.log('AUTHENTICATED');

      console.log('ACTION: Tweak Change');
      request({
        url: 'https://chrisgrant.squarespace.com/api/slides/572e5845859fd009b434d2ba/tweaks?crumb=' + sqsMiddleware.getCrumb(),
        method: 'PUT',
        headers: sqsMiddleware.getHeaders(),
        json: data
      }, function(err, res, data) {
        err = sqsMiddleware.getError(err, data);

        if (err) return cb(err);
        console.log('STATUS: COMPLETE');
        return cb(null);
      });
    });
  }
};

String.prototype.capitalize = function() {
  return this.replace(/(?:^|\s)\S/g, function(a) {
    return a.toUpperCase();
  });
};
