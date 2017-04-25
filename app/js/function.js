function guid() {
  function s4() {
    // floor nombre entier inf
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

function getMonth(date) {
    var month = date.getMonth() + 1;
    return month < 10 ? '0' + month : '' + month; // ('' + month) for string result
}

function getDate(date) {
    var gDate = date.getDate();
    return gDate < 10 ? '0' + gDate : '' + gDate; // ('' + month) for string result
}
