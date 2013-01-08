exports.index = function(req, res){
  res.render('index', { title: 'FG' });
};

exports.app = function(req, res){
  res.render('app', { title: 'FG' });
};
