import Settings from '../models/Settings.js';
import ContactInfo from '../models/ContactInfo.js';

export const getTheme = async (req, res, next) => {
  try {
    const settings = await Settings.getSingleton();
    res.json({
      primaryColor: settings.primaryColor,
      secondaryColor: settings.secondaryColor,
      logoUrl: settings.logoUrl || '',
    });
  } catch (err) {
    next(err);
  }
};

export const getHeroImages = async (req, res, next) => {
  try {
    const settings = await Settings.getSingleton();
    res.json({
      heroImagesMobile: settings.heroImagesMobile || [],
      heroImagesDesktop: settings.heroImagesDesktop || [],
    });
  } catch (err) {
    next(err);
  }
};

export const getContact = async (req, res, next) => {
  try {
    const contact = await ContactInfo.getSingleton();
    res.json(contact.toObject());
  } catch (err) {
    next(err);
  }
};

export const updateTheme = async (req, res, next) => {
  try {
    const settings = await Settings.getSingleton();
    const { primaryColor, secondaryColor, logoUrl } = req.body;
    if (primaryColor !== undefined) settings.primaryColor = primaryColor;
    if (secondaryColor !== undefined) settings.secondaryColor = secondaryColor;
    if (logoUrl !== undefined) settings.logoUrl = logoUrl;
    await settings.save();
    res.json({
      primaryColor: settings.primaryColor,
      secondaryColor: settings.secondaryColor,
      logoUrl: settings.logoUrl || '',
    });
  } catch (err) {
    next(err);
  }
};

export const updateHeroImages = async (req, res, next) => {
  try {
    const settings = await Settings.getSingleton();
    const { heroImagesMobile, heroImagesDesktop } = req.body;

    if (heroImagesMobile !== undefined) settings.heroImagesMobile = heroImagesMobile;
    if (heroImagesDesktop !== undefined) settings.heroImagesDesktop = heroImagesDesktop;

    await settings.save();
    res.json({
      heroImagesMobile: settings.heroImagesMobile || [],
      heroImagesDesktop: settings.heroImagesDesktop || [],
    });
  } catch (err) {
    next(err);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const contact = await ContactInfo.getSingleton();
    const allowed = [
      'brandName',
      'heroKicker',
      'heroHeadline',
      'heroTagline',
      'footerTagline',
      'whatsappNumber',
      'phone',
      'email',
      'address',
      'instagramHandle',
      'facebookHandle',
      'mapEmbedUrl',
      'aboutText',
    ];
    for (const key of allowed) {
      if (req.body[key] !== undefined) contact[key] = req.body[key];
    }
    await contact.save();
    res.json(contact.toObject());
  } catch (err) {
    next(err);
  }
};
