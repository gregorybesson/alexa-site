/**
 * App ID for the skill
 */
var APP_ID = 'arn:aws:lambda:us-east-1:675270613548:function:AlexaSite'; //replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";
var AlexaSkill = require('./AlexaSkill');

var nsm = require( "node-squarespace-middleware" );
var sqsMiddleware = new nsm.Middleware();

var SS = require('./ss');


var AlexaSite = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
AlexaSite.prototype = Object.create(AlexaSkill.prototype);
AlexaSite.prototype.constructor = AlexaSite;

AlexaSite.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("AlexaSite onSessionStarted requestId: " + sessionStartedRequest.requestId + ", sessionId: " + session.sessionId);
    // any initialization logic goes here
};

AlexaSite.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("AlexaSite onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    var speechOutput = "You are now editing the Jackson Filman Site";
    var repromptText = "Request some design changes or just say help";
    response.ask(speechOutput, repromptText);
};

AlexaSite.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("AlexaSite onSessionEnded requestId: " + sessionEndedRequest.requestId + ", sessionId: " + session.sessionId);
    // any cleanup logic goes here
};

AlexaSite.prototype.intentHandlers = {
    // register custom intent handlers
    "EditPageAlignmentIntent": function(intent, session, response) {

      SS.editAlignment(intent, session, function(err) {
        if (err) return console.log('ERROR:\n'+err);
        console.log('done');
        return response.tellWithCard('Ok Chris, the page is now ' + intent.slots.alignment.value + ' aligned', 'Page Aligned', 'Left');
      });
    },
    "EditPageBorderIntent":  function(intent, session, response) {
      SS.editBorder(intent, session, function(err) {
        if (err) return console.log('ERROR:\n'+err);
        console.log('done');
        return response.tellWithCard('Ok Chris, I have added a border to the page.', 'Page Border', 'Added');
      });
    },
    "EditIconSizeIntent":  function(intent, session, response) {
      SS.editIcons(intent, session, function(err) {
        if (err) return console.log('ERROR:\n'+err);
        console.log('done');
        return response.tellWithCard('Ok Chris, the icons are a bit larger now. Anything else?', 'Icon Size', 'Increased');
      });
    },
    "EditBackgroundImageIntent":  function(intent, session, response) {
      SS.editBackground(intent, session, function(err, firstPart) {
        if (err) return console.log('ERROR:\n'+err);
        console.log('done');
        if (firstPart) {
          return response.tellWithCard('Ok Chris, I\'ve added an image related to carpentry', 'Background Image', 'Changed');
        } else {
          return response.tellWithCard('No problem Chris, I\'ve added different image', 'Background Image', 'Changed');
        }

      });
    },
    "AMAZON.HelpIntent": function (intent, session, response) {
        response.ask("You can say hello to me!", "You can say hello to me!");
    }
};

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the AlexaSite skill.
    var alexaSite = new AlexaSite();
    alexaSite.execute(event, context);
};
