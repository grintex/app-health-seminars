import $$ from 'dom7';
import { v4 as uuidv4 } from 'uuid';

/**
 * Analytics with a grain of salt. Integrates Google Analytics into Framework7.
 * 
 * @author Fernando Bevilacqua <dovyski@gmail.com>
 * @license MIT
 */
var Abalytics = {
    STORAGE_KEY: 'abalytocs-data-v1',
    API_URL: 'https://app-seminarios-saude.api.uffs.cc/v0/analytics',
    f7: null,
    uuid: '',
    
    trackScreenView: function(screenName) {
        Abalytics.track('event', 'screen_view', {
            'screen_name': screenName
        });
    },

    addScreenTracking: function() {
        $$(document).on('page:afterin', function (e) {
            var page = e.detail;

            if(!page || page.direction != 'forward') {
                return;
            }

            Abalytics.trackScreenView(page.name);
        });
      },

    injectAdditionalData: function(data) {
        var storedData = Abalytics.getStoredData();

        if(!storedData) {
            return;
        }

        for(var key in storedData) {
            data[key] = storedData[key];
        }

        return data;
    },

    track: function(type, label, data) {
        var app = Abalytics.f7;

        if(type != 'event') {
            console.error('invalid event type: ' + type);
            return;
        }

        if(!gtag) {
            console.warn('gtag is not present, unable to track Abalytics:', type, label, data);
            return;
        }

        Abalytics.injectAdditionalData(data);

        console.log('[Abalytics] ' + type + ' | ' + label + ': ', data);
        gtag(type, label, data);

        var payload = {
            uuid: Abalytics.getUUI() + '-' + (app.device.cordova ? 'c' : 'w'),
            type: type,
            label: label,
            data: data
        };

        app.request.post(Abalytics.API_URL, payload, function (data) {
            console.debug('[Abalytics] Payload sent to API: ', data);
        });
    },

    getStoredData: function () {
        var app = Abalytics.f7;
        var data = app.form.getFormData(Abalytics.STORAGE_KEY);

        if(!data) {
            // No stored data, let's create some
            data = {
                uuid: uuidv4()
            };

            app.form.storeFormData(Abalytics.STORAGE_KEY, data);
            console.debug('[Abalytics] uuid created: ', data.uuid);
        }

        return data;
    },

    storeData: function (key, value) {
        var app = Abalytics.f7;
        var data = Abalytics.getStoredData();

        data[key] = value;
        app.form.storeFormData(Abalytics.STORAGE_KEY, data);

        console.debug('[Abalytics] data stored: ', key, value, data);
    },    

    getUUI: function () {
        var data = Abalytics.getStoredData();

        Abalytics.uuid = data.uuid;
        console.debug('[Abalytics] uuid used: ', Abalytics.uuid);

        return Abalytics.uuid;
    },

    init: function (f7) {
        // Save f7 instance
        Abalytics.f7 = f7;
        f7.abalytics = Abalytics;

        // Track things
        Abalytics.addScreenTracking();
    },
};

export default Abalytics;