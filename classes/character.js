angular.module("routerApp").factory("Character", ['Stats', 'FormatService', function (Stats, FormatService) {
        var Character = function () {

            var self = this;

            self.stats = new Stats();
            self.talents = [];
            self.gear = {};

            self.name;
            self.nameWithTitle;
            self.realm;
            self.level;
            self.class;
            self.race;
            self.faction;
            self.guild;
            self.title;
            self.thumbUrl;

            self.getName = () => self.name;

            self.getNameWithTitle = () => self.nameWithTitle;

            self.getRealm = () => self.realm;

            self.getLevel = () => self.level;

            self.getClass = () => self.class;
            self.setClass = (classStr) => self.class = classStr;

            self.getRace = () => self.race;
            self.setRace = (raceStr) => self.race = raceStr;

            self.getFaction = () => self.faction;
            self.setFaction = (factionStr) => self.faction = factionStr;

            self.getGuild = () => self.guild;

            self.getTitle = () => self.title;

            self.getThumbUrl = () => self.thumbUrl;
            self.setThumbUrl = (thumbUrl) => self.thumbUrl = thumbUrl;

            self.getStats = () => self.stats;
            self.getTalents = () => self.talents;
            self.getGear = () => self.gear;

            self.hasStats = () => !angular.equals(self.stats.armor, undefined);
            self.hasTalents = () => !angular.equals(self.talents, []);
            self.hasGear = () => !angular.equals(self.gear, {});

            self.setFieldsFromSessionStorage = function (json) {
                var data = JSON.parse(json);
                Object.keys(data).forEach(function (key) {
                    self[key] = data[key];
                });
                console.log(self);
            };

            self.setFieldsFromData = function (data) {
                self.name = data.name;
                self.realm = data.realm;
                self.level = data.level;

                if (data.className)
                    self.class = data.className;
                self.classId = data.class;

                if (data.raceName) {
                    self.race = data.raceName;
                }

                self.raceId = data.race;

                self.factionId = data.faction;

                if (self.factionId === 0) {
                    self.faction = "Alliance";
                } else if (self.factionId === 1) {
                    self.faction = "Horde";
                } else if (self.factionId === 2) {
                    self.faction = "No Faction";
                }
                if (data.guild) {
                    self.guild = "<" + data.guild.name + ">";
                } else {
                    self.guild = "";
                }

                self.title = (function () {
                    for (var index in data.titles) {
                        console.log(index);
                        if (data.titles[index].selected === true) {
                            return data.titles[index].name;
                        }
                    }
                    return null;
                })();

                self.nameWithTitle = (function() {
                    if (!self.title) {
                        return self.name;
                    } else {
                        return FormatService.injectStringToFormat(self.name,self.title);
                    }

                })();

                if (data.thumbUrl)
                    self.thumbUrl = data.thumbUrl;
                console.log(self);
            };

            self.setStatsFromData = function (sData) {
                self.stats.setFieldsFromData(sData);
                console.log(self);
            };

        };

        return Character;
    }]);