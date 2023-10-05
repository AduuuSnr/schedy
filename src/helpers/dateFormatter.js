export const dateFormatter = date => {
  var pad = function (num) {
    return ('00' + num).slice(-2);
  };

  date =
    date.getUTCFullYear() +
    '-' +
    pad(date.getUTCMonth() + 1) +
    '-' +
    pad(date.getUTCDate()) +
    ' ' +
    pad(date.getUTCHours()) +
    ':' +
    pad(date.getUTCMinutes()) +
    ':' +
    pad(date.getUTCSeconds());
  date = date.split(' ')[0] + ' ' + '00:00:00';
  return date;
};

export const dateFormatter2 = date => {
  return date && `${date?.split('T')[0]?.slice(5, 10)}`;
};

export const dateFormatter3 = date => {
  return `${date?.split('T')[0]} ${date?.split('T')[1].split(':')[0]}:${
    date?.split('T')[1].split(':')[1]
  }:${date?.split('T')[1].split(':')[2].split('.')[0]}`;
};
