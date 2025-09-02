// newsController.js
const News = require('../model/news');

exports.getAllNews = async (req, res) => {
  try {
    const news = await News.find().sort({ eventDate: -1 });
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getNews = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createNews = async (req, res) => {
  try {
    const news = new News({
      title: req.body.title,
      content: req.body.content,
      eventDate: req.body.eventDate,
      isHighlighted: req.body.isHighlighted,
      author: req.body.author,
      images: req.body.images,
      createdAt: req.body.createdAt
    });

    const savedNews = await news.save();
    res.status(201).json(savedNews);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateNews = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }

    const updatedNews = await News.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        content: req.body.content,
        eventDate: req.body.eventDate,
        isHighlighted: req.body.isHighlighted,
        author: req.body.author,
        images: req.body.images,
        updatedAt: req.body.updatedAt
      },
      { new: true }
    );

    res.json(updatedNews);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteNews = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }

    await news.remove();
    res.json({ message: 'News deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getFeaturedNews = async (req, res) => {
  try {
    const featuredNews = await News.find({ isHighlighted: true })
      .sort({ eventDate: -1 });
    res.json(featuredNews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getNewsByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const news = await News.find({
      eventDate: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    }).sort({ eventDate: -1 });
    
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};