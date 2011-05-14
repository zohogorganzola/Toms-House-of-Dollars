/* ddate.js
 * a DDate() object for Javascript
 * Works similar to Date()
 * Public Domain 2005 and (K) 3171 by the other anonymous
 */

/* BUGS:
 * - parse() method is not supported
 * - "time of day" is not supported
 * - our goal is to implement all methods of Date()
 *   (might be easier to set our prototype to a Date and override as needed)
 */

/* Example usage:
 * var foo = new DDate();
 * document.write(foo.toString());
 */

/* new DDate()        -> value = currentTime
 * new DDate(ms)      -> value = milliseconds since Jan 1, 1970
 * XXX:new DDate(str)     -> value = DDate.parse(str)
 * new DDate(y,s[,d]) -> value = DDate.setFullYear(y,s,d)
 */
function DDate(year,season,date)
{
  if (arguments.length >= 2) {

    for (var i = 0; i < 3; i++) {
      arguments[i] = (arguments[i]===undefined)
                     ? (i==2?1:0)
                     : arguments[i].valueOf();
      if (typeof(arguments[i]) == "string")
        arguments[i] = parseInt(arguments[i]);
    }
    this.setFullYear(year,season,date);

  } else if (arguments.length == 1) {

    var t = arguments[0].valueOf();
    this.value = (typeof(t) == "string")
                 ? this.parse(t)
                 : Math.floor(t / 86400000);

  } else {

    var gd = new Date();
    this.value = this._timeClip(Math.floor(gd.valueOf() / 86400000));
  }
}

DDate.prototype = {

_yearToDays : function (year) {
  year -= 1166;
  return 365 * (year-1970)
             + Math.floor((year-1969)/4)
             - Math.floor((year-1901)/100)
             + Math.floor((year-1601)/400);
},

_isLeapYear : function (year) {
  var y = year - 1166;
  return ( !(y%4) && (!(y%100) || (y%400)) );
},

_toInt : function (v) {
  v = v.valueOf();
  return (typeof(v) == "string") ? parseInt(v) : v;
},

_timeClip : function (t) {
  if (!isFinite(t)) return NaN;
  if (t > 8.64e15 || t < -8.64e15) return NaN;
  return this._toInt(t) + (+0);
},

valueOf : function() { return (86400000 * this.value); },

getYear : function() { return this.getFullYear(); },

getDayOfYear : function() {
  var doy = this.value - this._yearToDays(this.getFullYear());
  if (this.isLeapYear()) {
    if (doy == 59) return -1;
    if (doy > 59) doy--;
  }
  return doy;
},

isLeapYear : function() { return this._isLeapYear(this.getFullYear()); },

isStTibs : function () { return this.getDayOfYear() == -1; },

getTime : function() { return this.value; },

getFullYear : function() {
  var y = Math.floor(this.value / 365) + 3136;
  while (this._yearToDays(y) <= this.value) y++;
  while (this._yearToDays(y) > this.value) y--;
  return y;
},

getSeason : function() {
  var doy = this.getDayOfYear();
  return (doy >= 0) ? Math.floor(doy/73) : 1;
},

getDate : function() {
  var doy = this.getDayOfYear();
  return (doy >= 0) ? (doy%73)+1 : -1;
},

getDay : function() {
  var doy = this.getDayOfYear();
  return (doy >= 0) ? (doy%5) : -1;
},

setTime : function(time) {
  if (typeof(time) != "date") throw "TypeError";
  this.value = this._timeClip(Math.floor(time.valueOf() / 86400000));
  return this.value * 86400000;
},

setDate : function (date) {
  return this.setFullYear(this.getFullYear(),this.getSeason(),date);
},

setSeason : function (season,date) {
  return this.setFullYear(this.getFullYear(),season,date);
},

setFullYear : function (year,season,date) {
  if (season === undefined) season = this.getSeason();
  if (date === undefined) date = this.getDate();
  var t = this.value;
  if (isNaN(t)) t = 0;
  year = this._toInt(year);
  season = this._toInt(season);
  date = this._toInt(date);
  if (season >= 0) {
    year += Math.floor(season/5);
    season %= 5;
  }
  var doy = (season == -1 || date == -1)
            ? -1
            : ((season * 73) + date - 1);
  if (this._isLeapYear(year)) {
    if (doy >= 59) doy++;
    if (doy < 0) doy = 59;
  }
  this.value = this._timeClip(this._yearToDays(year) + doy);
  return this.value * 86400000;
},

toString : function () {
  var weekdayNames = [
    "Sweetmorn",
    "Boomtime",
    "Pungenday",
    "Prickle-Prickle",
    "Setting Orange"
  ];
  var seasonNames = [
    "Chaos",
    "Discord",
    "Confusion",
    "Bureaucracy",
    "The Aftermath"
  ];
  var stTibsName = "St. Tib's Day";
  var csp = ", ", sp = " ";
  var str = "";

  if (this.isStTibs()) {
    str = stTibsName;
  } else {
    str = weekdayNames[this.getDay()]
        + csp + this.getDate()
        + sp + seasonNames[this.getSeason()];
  }
  str += csp + this.getFullYear();
  return str;
}
};
