const home = async (req, res) => {
  res.json({
    message: 'Welcome to API Fish Finder',
  });
};

module.exports = home;
