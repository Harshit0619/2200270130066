import Url from '../models/urlModel.js';
import generateShortcode from '../utils/generateShortcode.js';

export const createShortUrl = async (req, res, next) => {
  try {
    const { originalUrl, customCode, validity } = req.body;

    const expiresAt = new Date(Date.now() + ((validity || 30) * 60000)); // default 30 mins
    let shortCode = customCode || generateShortcode();

    const existing = await Url.findOne({ shortCode });
    if (existing) return res.status(400).json({ message: 'Shortcode already exists' });

    const url = new Url({ originalUrl, shortCode, expiresAt });
    await url.save();

    res.json({ shortUrl: `${process.env.BASE_URL}/api/r/${shortCode}` });
  } catch (err) {
    next(err);
  }
};

export const redirectUrl = async (req, res, next) => {
  try {
    const { code } = req.params;
    const urlDoc = await Url.findOne({ shortCode: code });

    if (!urlDoc) return res.status(404).json({ message: 'Short URL not found' });
    if (urlDoc.expiresAt < new Date()) return res.status(410).json({ message: 'Short URL expired' });

    urlDoc.clickCount += 1;
    await urlDoc.save();

    res.redirect(urlDoc.originalUrl);
  } catch (err) {
    next(err);
  }
};

export const getStats = async (req, res, next) => {
  try {
    const { code } = req.params;
    const urlDoc = await Url.findOne({ shortCode: code });

    if (!urlDoc) return res.status(404).json({ message: 'Short URL not found' });

    res.json({
      originalUrl: urlDoc.originalUrl,
      shortCode: urlDoc.shortCode,
      createdAt: urlDoc.createdAt,
      expiresAt: urlDoc.expiresAt,
      clickCount: urlDoc.clickCount,
    });
  } catch (err) {
    next(err);
  }
};
