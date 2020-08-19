import Framework7 from 'framework7/framework7.esm.bundle.js';

/**
 * Fetches data from the API endpoints.
 * 
 * @author Fernando Bevilacqua <dovyski@gmail.com>
 * @license MIT
 */
var DataProvider = {
    source_url: 'http://app-seminarios-saude.api.uffs.cc/v0/activities',
    f7: null,

    sync: function() {
        var app = this.f7;

        if(!this.source_url) {
            console.error('Unable to sync because no API endpoint has been informed yet.');
            return;
        }

        app.preloader.show();

        Framework7.request.json(this.source_url, {}, function(data) {
            app.data.activities = data;

            app.preloader.hide();
            app.emit('syncDone', data);

            app.toast.create({
                text: 'Dados atualizados!',
                closeTimeout: 2000,
            }).open();

        }, function() {
            app.preloader.hide();
            app.toast.create({
                text: 'Não foi possível sincronizar os dados. Por favor, tente de novo.',
                closeTimeout: 4000,
            }).open();
        });
    },

    init: function (f7) {
        // Save f7 instance
        DataProvider.f7 = f7;
        f7.dataProvider = DataProvider;

        console.log('DataProvider init');
    },
};

export default DataProvider;