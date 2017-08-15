var Resource = require('./resource');
var util = require("util");
var _ = require("underscore");
var url = require('url');

function Live(session, params) {
    Resource.apply(this, arguments);
}

module.exports = Live;
util.inherits(Live, Resource);

var Request = require('./request');


Live.prototype.parseParams = function (json) {
    json.upload_url = json.upload_url.replace('rtmps://live-upload.instagram.com:443', 'rtmp://live-upload.instagram.com:80');
    return json || {};
};

Live.create = function(session) {
    return new Request(session)
        .setMethod('POST')
        .setResource('createLiveBroadcast')
        .setBodyType('form')
        .generateUUID()
        .setData({
            preview_height: 1184,
            preview_width: 720,
            broadcast_message: '',
            broadcast_type: 'RTMP',
            internal_only: 0,
        })
        .signPayload()
        .send()
        .then(function(data) {
            return new Live(session, data);
        });
};

Live.startBroadcast = function(session, broadcast_id){
    return new Request(session)
        .setMethod('POST')
        .setBodyType('form')
        .setResource('startLiveBroadcast', {broadcast_id: broadcast_id})
        .generateUUID()
        .signPayload()
        .send()
        then(function(data){
            return new Live(session, data);
        });
};