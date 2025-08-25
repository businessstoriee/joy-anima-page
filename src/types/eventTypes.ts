import { EventType } from '@/types/greeting';

export const eventTypes: EventType[] = [
  // Birthday Category
  { 
    value: 'birthday', 
    label: 'Birthday', 
    emoji: '🎂', 
    defaultMessage: 'Wishing you a fantastic birthday filled with joy and happiness!', 
    theme: 'card-birthday',
    category: 'birthday'
  },
  { 
    value: 'sweet-sixteen', 
    label: 'Sweet Sixteen', 
    emoji: '🎈', 
    defaultMessage: 'Sweet sixteen and never been so amazing! Happy Birthday!', 
    theme: 'card-birthday',
    category: 'birthday'
  },
  { 
    value: 'milestone-birthday', 
    label: 'Milestone Birthday', 
    emoji: '🎉', 
    defaultMessage: 'Celebrating this amazing milestone in your life!', 
    theme: 'card-birthday',
    category: 'birthday'
  },

  // Religious Festivals
  { 
    value: 'diwali', 
    label: 'Diwali', 
    emoji: '🪔', 
    defaultMessage: 'May this festival of lights illuminate your path to happiness and prosperity!', 
    theme: 'card-diwali',
    category: 'religious'
  },
  { 
    value: 'holi', 
    label: 'Holi', 
    emoji: '🌈', 
    defaultMessage: 'May your life be filled with colors of joy, happiness, and love!', 
    theme: 'card-holi',
    category: 'religious'
  },
  { 
    value: 'eid', 
    label: 'Eid', 
    emoji: '🌙', 
    defaultMessage: 'Eid Mubarak! May this blessed day bring you peace and happiness!', 
    theme: 'card-eid',
    category: 'religious'
  },
  { 
    value: 'christmas', 
    label: 'Christmas', 
    emoji: '🎄', 
    defaultMessage: 'Merry Christmas! May your holidays be merry and bright!', 
    theme: 'card-christmas',
    category: 'religious'
  },
  { 
    value: 'navratri', 
    label: 'Navratri', 
    emoji: '💃', 
    defaultMessage: 'May Maa Durga bless you with strength, prosperity, and happiness!', 
    theme: 'card-navratri',
    category: 'religious'
  },
  { 
    value: 'ramadan', 
    label: 'Ramadan', 
    emoji: '🕌', 
    defaultMessage: 'Ramadan Mubarak! May this holy month bring you spiritual growth and peace!', 
    theme: 'card-ramadan',
    category: 'religious'
  },
  { 
    value: 'karwa-chauth', 
    label: 'Karwa Chauth', 
    emoji: '🌙', 
    defaultMessage: 'May your love grow stronger with each passing moon!', 
    theme: 'card-karwa-chauth',
    category: 'religious'
  },
  { 
    value: 'raksha-bandhan', 
    label: 'Raksha Bandhan', 
    emoji: '🧿', 
    defaultMessage: 'Celebrating the beautiful bond of love and protection!', 
    theme: 'card-raksha-bandhan',
    category: 'religious'
  },
  { value: 'hanukkah', label: 'Hanukkah', emoji: '🕎', defaultMessage: 'Wishing you light, joy, and peace this Hanukkah!', theme: 'card-hanukkah', category: 'religious' },
  { value: 'easter', label: 'Easter', emoji: '🐣', defaultMessage: 'Happy Easter! May your day be filled with joy, hope, and renewal.', theme: 'card-easter', category: 'religious' },

  // National Holidays
  { 
    value: 'independence-day', 
    label: 'Independence Day', 
    emoji: '🇮🇳', 
    defaultMessage: 'Celebrating the spirit of freedom and unity! Happy Independence Day!', 
    theme: 'card-independence',
    category: 'national'
  },
  { 
    value: 'republic-day', 
    label: 'Republic Day', 
    emoji: '🏛️', 
    defaultMessage: 'Honoring our constitution and democratic values! Happy Republic Day!', 
    theme: 'card-republic',
    category: 'national'
  },
  { 
    value: 'gandhi-jayanti', 
    label: 'Gandhi Jayanti', 
    emoji: '🕊️', 
    defaultMessage: 'Remembering the Father of our Nation and his teachings of peace!', 
    theme: 'card-gandhi',
    category: 'national'
  },
  { value: 'bastille-day', label: 'Bastille Day', emoji: '🇫🇷', defaultMessage: 'Vive la France! Celebrating liberty, equality, and fraternity!', theme: 'card-bastille', category: 'national' },
  { value: 'fourth-of-july', label: 'Fourth of July', emoji: '🇺🇸', defaultMessage: 'Happy Independence Day USA! Celebrate freedom and unity!', theme: 'card-fourth-july', category: 'national' },


  // Seasonal Festivals
  { 
    value: 'makar-sankranti', 
    label: 'Makar Sankranti', 
    emoji: '🪁', 
    defaultMessage: 'May your dreams soar high like colorful kites in the sky!', 
    theme: 'card-makar-sankranti',
    category: 'seasonal'
  },
  { 
    value: 'baisakhi', 
    label: 'Baisakhi', 
    emoji: '🌾', 
    defaultMessage: 'May this harvest festival bring prosperity and joy to your life!', 
    theme: 'card-baisakhi',
    category: 'seasonal'
  },
  { 
    value: 'onam', 
    label: 'Onam', 
    emoji: '🌺', 
    defaultMessage: 'May King Mahabali bless you with happiness and prosperity!', 
    theme: 'card-onam',
    category: 'seasonal'
  },
  { 
    value: 'pongal', 
    label: 'Pongal', 
    emoji: '🍯', 
    defaultMessage: 'May this harvest festival sweeten your life with joy!', 
    theme: 'card-pongal',
    category: 'seasonal'
  },
  { value: 'thanksgiving', label: 'Thanksgiving', emoji: '🦃', defaultMessage: 'Wishing you a harvest of blessings, good health, and good times!', theme: 'card-thanksgiving', category: 'seasonal' },
  { value: 'chinese-new-year', label: 'Chinese New Year', emoji: '🧧', defaultMessage: 'Happy Lunar New Year! Wishing you luck, prosperity, and joy!', theme: 'card-chinese-new-year', category: 'seasonal' },


  // Global Observances & Special Days
  { value: 'valentines-day', label: 'Valentine’s Day', emoji: '❤️', defaultMessage: 'Happy Valentine’s Day! Wishing you love and happiness!', theme: 'card-valentine', category: 'special' },
  { value: 'new-year', label: 'New Year', emoji: '🎆', defaultMessage: 'Happy New Year! Wishing you a year full of joy, success, and health!', theme: 'card-new-year', category: 'special' },
  { value: 'womens-day', label: 'International Women’s Day', emoji: '👩‍🦰', defaultMessage: 'Celebrating the strength, achievements, and spirit of women everywhere!', theme: 'card-womens-day', category: 'special' },
  { value: 'fathers-day', label: 'Father’s Day', emoji: '👨‍👧‍👦', defaultMessage: 'Happy Father’s Day! Thank you for your love and guidance.', theme: 'card-fathers-day', category: 'special' },
  { value: 'mothers-day', label: 'Mother’s Day', emoji: '👩‍👧‍👦', defaultMessage: 'Happy Mother’s Day! Thank you for your endless love and care.', theme: 'card-mothers-day', category: 'special' },
  { value: 'world-environment-day', label: 'World Environment Day', emoji: '🌍', defaultMessage: 'Let’s protect our planet for future generations!', theme: 'card-environment', category: 'special' },

  
  // Personal Milestones
  { 
    value: 'anniversary', 
    label: 'Anniversary', 
    emoji: '💍', 
    defaultMessage: 'Celebrating your special day and the beautiful journey you share together!', 
    theme: 'card-anniversary',
    category: 'personal'
  },
  { 
    value: 'retirement', 
    label: 'Retirement', 
    emoji: '👴', 
    defaultMessage: 'Congratulations on your well-deserved retirement! Enjoy this new chapter!', 
    theme: 'card-retirement',
    category: 'personal'
  },
  { 
    value: 'promotion', 
    label: 'Promotion', 
    emoji: '📈', 
    defaultMessage: 'Congratulations on your promotion! Your hard work has truly paid off!', 
    theme: 'card-promotion',
    category: 'personal'
  },
  { 
    value: 'farewell', 
    label: 'Farewell', 
    emoji: '👋', 
    defaultMessage: 'Wishing you all the best in your new journey. You will be missed!', 
    theme: 'card-farewell',
    category: 'personal'
  },
  { 
    value: 'graduation', 
    label: 'Graduation', 
    emoji: '🎓', 
    defaultMessage: 'Congratulations graduate! Your achievements are truly inspiring!', 
    theme: 'card-graduation',
    category: 'personal'
  },
  { 
    value: 'wedding', 
    label: 'Wedding', 
    emoji: '💒', 
    defaultMessage: 'Wishing you a lifetime of love, laughter, and happiness together!', 
    theme: 'card-wedding',
    category: 'personal'
  },
  { 
    value: 'new-baby', 
    label: 'New Baby', 
    emoji: '👶', 
    defaultMessage: 'Congratulations on your bundle of joy! Welcome to parenthood!', 
    theme: 'card-baby',
    category: 'personal'
  },
  { 
    value: 'new-home', 
    label: 'New Home', 
    emoji: '🏠', 
    defaultMessage: 'Congratulations on your new home! May it be filled with love and laughter!', 
    theme: 'card-home',
    category: 'personal'
  },

  // Custom
  { 
    value: 'custom', 
    label: 'Custom Event', 
    emoji: '✨', 
    defaultMessage: 'Sending you warm wishes and positive vibes!', 
    theme: 'card-custom',
    category: 'custom'
  }
];

export const animationStyles = [
  { value: 'fade', label: 'Fade In' },
  { value: 'slide', label: 'Slide In' },
  { value: 'zoom', label: 'Zoom In' },
  { value: 'flip', label: 'Flip In' },
  { value: 'bounce', label: 'Bounce In' },
  { value: 'rotate', label: 'Rotate In' },
  { value: 'pulse', label: 'Pulse' },
  { value: 'shake', label: 'Shake' },
  { value: 'swing', label: 'Swing' },
  { value: 'tada', label: 'Tada' }
];



export const layoutStyles = [

  { value: 'grid', label: '🔲 Grid Layout' },

  { value: 'masonry', label: '🧩 Masonry Layout' },

  { value: 'carousel', label: '🎠 Carousel Layout' },

  { value: 'slideshow', label: '🎬 Slideshow Layout' },

  { value: 'polaroid', label: '📸 Polaroid Layout' },

  { value: 'gallery', label: '🖼️ Gallery Layout' },

  { value: 'hexagon', label: '⬡ Hexagon Layout' },

  { value: 'circular', label: '⭕ Circular Layout' },

  { value: 'spiral', label: '🌀 Spiral Layout' },

  { value: 'wave', label: '🌊 Wave Layout' }

];