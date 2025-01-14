const images = {
  //animation
  homeAnimate: require('~/resources/json/homeAnimation.json'),
  moon: require('~/resources/json/moon.json'),
  profile: require('~/resources/json/profile.json'),
  moon2: require('~/resources/json/music.json'),
  logoTrans: require('~/resources/images/logoTrans.png'),
  onBoardingFirst: require('~/resources/json/backgroundOnboradingAnimation.json'),
  onBoardingTwo: require('~/resources/images/OnBoardingImage/onboarding2.png'),
  onBoardingThree: require('~/resources/images/OnBoardingImage/onboarding3.png'),

  // //country
  English: require('~/resources/images/Home/image_eng_flag.png'),
  Vietnam: require('~/resources/images/countryFlag/vietnam.png'),
  China: require('~/resources/images/countryFlag/china.png'),
  Hindi: require('~/resources/images/countryFlag/india.png'),
  Spanish: require('~/resources/images/countryFlag/spain.png'),
  Arabic: require('~/resources/images/countryFlag/Arabic.png'),
  French: require('~/resources/images/countryFlag/france.png'),
  Bengali: require('~/resources/images/countryFlag/bangladesh.png'),
  Russia: require('~/resources/images/countryFlag/russia.png'),
  Portugal: require('~/resources/images/countryFlag/portugal.png'),
  Kenya: require('~/resources/images/countryFlag/kenya.png'),
  Indonesia: require('~/resources/images/countryFlag/indonesia.png'),
  Pakistan: require('~/resources/images/countryFlag/pakistan.png'),
  Japan: require('~/resources/images/countryFlag/japan.png'),
  Germany: require('~/resources/images/countryFlag/germany.png'),
  Punjab: require('~/resources/images/countryFlag/punjab.png'),
  Iran: require('~/resources/images/countryFlag/iran.png'),
  Italy: require('~/resources/images/countryFlag/italy.png'),
  Turkey: require('~/resources/images/countryFlag/turkey.png'),
  Belarus: require('~/resources/images/countryFlag/belarus.png'),
  Singapore: require('~/resources/images/countryFlag/singapore.png'),
  Korea: require('~/resources/images/countryFlag/korea.png'),
  Nigeria: require('~/resources/images/countryFlag/nigeria.png'),
  Thailand: require('~/resources/images/countryFlag/thailand.png'),
  Catalunya: require('~/resources/images/countryFlag/Catalunya.png'),
  Nepal: require('~/resources/images/countryFlag/nepal.png'),
  Poland: require('~/resources/images/countryFlag/poland.png'),
  Ukraina: require('~/resources/images/countryFlag/Ukraina.png'),
  Afghanistan: require('~/resources/images/countryFlag/afghanistan.png'),
  Azerbaijan: require('~/resources/images/countryFlag/azerbaijan.png'),
  Denmark: require('~/resources/images/countryFlag/denmark.png'),
  Uzbekistan: require('~/resources/images/countryFlag/uzbekistan.png'),
  Madagascar: require('~/resources/images/countryFlag/madagascar.png'),
};

export default (imageName: keyof typeof images) => {
  return images[imageName];
};
