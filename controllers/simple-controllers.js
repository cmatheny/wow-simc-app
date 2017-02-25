angular.module("routerApp").controller("CharacterCtrl", function(CurrentCharacter) {
    var self = this;

    var character = function() {
        return CurrentCharacter.getCharacter();
    };
    
    self.getName = () => character().getName();
    self.getRealm = () => character().getRealm();
    self.getLevel = () => character().getLevel();
    self.getClass = () => character().getClass();
    self.getRace = () => character().getRace();
    self.getFaction = () => character().getFaction();
    self.getGuild = () => character().getGuild();
    self.getThumbUrl = () => character().getThumbUrl();
    
    
});

angular.module("routerApp").controller("ApiCtrl", function(ApiSearchService) {
    var self = this;
    
    self.sendRequest = function() {
        var promise = ApiSearchService.sendApiRequest(self.urlStub,self.params);

        promise.then(function(response){
        //console.log("success");
        console.log(response);
        console.log(response.data);
        self.data = response.data;

        }, function(response){
            console.log("failure");
            console.log(response);
            alert("Not Found");
        });

    };
        
});

angular.module("routerApp").controller("ResetKeyCtrl", function(ApiKeyService) {
    var self = this;
    self.resetKey = ApiKeyService.clearApiKey;
});