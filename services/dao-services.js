angular.module("routerApp").service("DaoService", function(ApiKeyService,$resource,$q){
    
    var self = this;
    var baseUrl = "https://us.api.battle.net/wow/";
    var apiKey = ApiKeyService.apiKeyCheck();
    console.log("Dao init");
    
    var getCharacterResource = $resource(baseUrl+"character/:server/:name", { locale: 'en_US', apikey: apiKey });
    
    self.getCharacter = function(server, name) {
        var resourceObj = getCharacterResource.get({server: server, name: name},function() {
            console.log("done",self.test);
        });
        return resourceObj;
    };
    
    self.getClassMapPromise = function() {
        var deferred = $q.defer();
        if (self.characterClassMap) {
            deferred.resolve(self.characterClassMap);
        } else {

            var urlStub = "data/character/classes";
            var getFromApi = ApiSearchService.sendApiRequest(urlStub);
            
            // class definitions start at 1
            self.characterClassMap = [undefined];

            getFromApi.then(function(response) {
                console.log(response);
                for (var index in response.data.classes) {
                    self.characterClassMap.push(response.data.classes[index].name);
                }
                deferred.resolve(self.characterClassMap);
            });
        }
        console.log(deferred.promise);
        return deferred.promise;
    };
});

angular.module("routerApp").service("ApiSearchService", function($http, ApiKeyService) {

    var self = this;

    self.sendApiRequest = function(urlStub,params) {
        console.log(params);
        if (params) params += '&';
        else params = '';
        params = "?" + params + "locale=en_US&apikey=" + ApiKeyService.apiKeyCheck();
        console.log(params);
        var url = "https://us.api.battle.net/wow/"+urlStub+params;
        console.log(url);
        return $http.get(url);
    };
});

angular.module("routerApp").service("ApiKeyService", function() {

    var self = this;

    self.apiKeyPrompt = function(){
        var input = prompt("Enter API key:");
        console.log(input);
        return input;

    };

    self.apiKeyCheck = function() {
        if (localStorage.apiKey){
            return localStorage.apiKey;
        } else {
            var input = self.apiKeyPrompt();
            if (input) {
                localStorage.apiKey = input;
                return input;
            } else alert('No API key registered. You will not be able to retrieve from the API.');
        }
    };
    
    self.clearApiKey = () => localStorage.removeItem('apiKey');
    
});