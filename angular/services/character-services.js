/*
 * Intended to be used as a globally available reference to the currently loaded character.
 */
angular.module("routerApp").service("CurrentCharacter", ['CharacterLogicService', '$q', 'Character', 'CharacterDao', function (CharacterLogicService, $q, Character, CharacterDao) {

        var self = this;

        var logic = CharacterLogicService;

        self.loading = false;

        // Run on service startup. Basically anonymous function but named for debug log.
        (function init() {
            self.character = new Character();

            // sets from session storage if available
            try {
                self.character.setFieldsFromSessionStorage(sessionStorage.character);
            } catch (e) {
            }
        })();

        self.getCharacter = function () {
            return self.character;
        };

        self.setCharacter = function (server, name) {
            self.clearStoredCharacter();
            self.character = new Character();
            self.loading = true;
            self.character.thumbUrl = "resources/loading.gif"; // loading
            logic.getNewCharacter(server, name).then(function (promises) {
                // display when everything done loading
                $q.all(promises).then(function (data) {
                    self.character.setFieldsFromData(data);
                    self.storeCharacter();
                    self.loading = false;
                });
            }, function () {
                self.character.thumbUrl = "resources/char-not-found.png";
                self.loading = false;
                self.character.setFaction("No Faction");
                console.log(self.character);
            });
        };

        self.storeCharacter = function () {
            sessionStorage.character = JSON.stringify(self.character);
        };

        self.clearStoredCharacter = function () {
            sessionStorage.removeItem('character');
        };

        self.setStats = function (statsData) {
            self.character.setStatsFromData(statsData);
            self.storeCharacter();
        };

        self.setFacts = function (factsData) {
            self.character.extractFacts(factsData);
            self.storeCharacter();
        };

        self.requestStats = function () {

            self.loading = true;

            var promise = logic.getStats(self.character);
            promise.then(function (statsData) {
                self.setStats(statsData);
                self.loading = false;
            });
            return promise;
        };

        self.requestFacts = function () {

            self.loading = true;

            var promise = logic.getFacts(self.character);
            promise.then(function (factsData) {
                console.log(factsData);
                self.setFacts(factsData);
                self.loading = false;
            });

            return promise;
        };

    }]);

angular.module("routerApp").service("CharacterLogicService", ['$q', 'CharacterDao', 'Character', function ($q, CharacterDao, Character) {

        var self = this;

        self.character = new Character();

        self.getNewCharacter = function (server, name) {

            var deferred = $q.defer();

            self.character = new Character();
            //self.characters.push(self.character);

            CharacterDao.getCharacter(server, name).then(function (request) {
                var promises = [];

                self.character.setFieldsFromData(request);

                if (!self.character.getName()) {
                    deferred.reject();
                }

                promises.push(getCharacterClass(request.class));
                promises.push(getCharacterRace(request.race));
                promises.push(CharacterDao.getCharacterImage(request.thumbnail));
                console.log(request);
                $q.all(promises).then(function (details) {
                    request.className = details[0];
                    request.raceName = details[1];
                    request.thumbUrl = details[2];
                    deferred.resolve(request);
                });
                return promises;
            }, function () {
                deferred.reject();
            });

            return deferred.promise;
        };

        self.getStats = function (character) {
            return CharacterDao.getStats(character);
        };

        self.getFacts = function (character) {
            return CharacterDao.getFacts(character);
        };

        var getCharacterClass = function (classId) {

            var deferred = $q.defer();

            CharacterDao.getClassMap().then(function (classMap) {
                deferred.resolve(classMap[classId]);
            });

            return deferred.promise;
        };

        var getCharacterRace = function (raceId) {

            var deferred = $q.defer();

            CharacterDao.getRaceMap().then(function (raceMap) {
                deferred.resolve(raceMap[raceId]);
            });
            return deferred.promise;
        };

    }]);
