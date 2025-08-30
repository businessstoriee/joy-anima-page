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
  },
  { 
    value: 'ganesh-chaturthi', 
    label: 'Ganesh Chaturthi', 
    emoji: '🐘', 
    defaultMessage: 'May Lord Ganesha remove all obstacles and bring wisdom and prosperity to your life!', 
    theme: 'card-ganesh',
    category: 'religious'
  },
  { 
    value: 'janmashtami', 
    label: 'Janmashtami', 
    emoji: '👶', 
    defaultMessage: 'May Lord Krishna fill your life with divine love and eternal happiness!', 
    theme: 'card-janmashtami',
    category: 'religious'
  },
  { 
    value: 'maha-shivratri', 
    label: 'Maha Shivratri', 
    emoji: '☯️', 
    defaultMessage: 'May Lord Shiva bless you with strength, peace, and spiritual enlightenment!', 
    theme: 'card-shivratri',
    category: 'religious'
  },
  { 
    value: 'durga-puja', 
    label: 'Durga Puja', 
    emoji: '🕉️', 
    defaultMessage: 'May Goddess Durga empower you with strength and destroy all evils from your life!', 
    theme: 'card-durga-puja',
    category: 'religious'
  },
  { 
    value: 'chhath-puja', 
    label: 'Chhath Puja', 
    emoji: '🌅', 
    defaultMessage: 'May the Sun God bless you with health, prosperity, and happiness!', 
    theme: 'card-chhath',
    category: 'religious'
  },

  // Islamic Festivals (New Additions)
  { 
    value: 'muharram', 
    label: 'Muharram', 
    emoji: '☪️', 
    defaultMessage: 'May this sacred month bring peace, reflection, and spiritual growth to your life!', 
    theme: 'card-muharram',
    category: 'religious'
  },
  { 
    value: 'eid-ul-adha', 
    label: 'Eid-ul-Adha', 
    emoji: '🐏', 
    defaultMessage: 'Eid Mubarak! May your sacrifices be accepted and your prayers answered!', 
    theme: 'card-eid-adha',
    category: 'religious'
  },

  // Christian Festivals (New Additions)
  { 
    value: 'good-friday', 
    label: 'Good Friday', 
    emoji: '✝️', 
    defaultMessage: 'May the sacrifice of Jesus Christ bring peace and redemption to your life!', 
    theme: 'card-good-friday',
    category: 'religious'
  },
  { 
    value: 'palm-sunday', 
    label: 'Palm Sunday', 
    emoji: '🌴', 
    defaultMessage: 'May this holy week bring you closer to faith and spiritual awakening!', 
    theme: 'card-palm-sunday',
    category: 'religious'
  },

  // Sikh Festivals (New Additions)
  { 
    value: 'guru-nanak-jayanti', 
    label: 'Guru Nanak Jayanti', 
    emoji: '📿', 
    defaultMessage: 'May the teachings of Guru Nanak Dev Ji guide you towards truth and compassion!', 
    theme: 'card-gurupurab',
    category: 'religious'
  },
  { 
    value: 'vaisakhi', 
    label: 'Vaisakhi', 
    emoji: '⚔️', 
    defaultMessage: 'Celebrating the birth of Khalsa! May you be blessed with courage and righteousness!', 
    theme: 'card-vaisakhi',
    category: 'religious'
  },

  // Jain Festivals (New Additions)
  { 
    value: 'mahavir-jayanti', 
    label: 'Mahavir Jayanti', 
    emoji: '🕊️', 
    defaultMessage: 'May Lord Mahavira teachings of non-violence and peace illuminate your path!', 
    theme: 'card-mahavir',
    category: 'religious'
  },
  { 
    value: 'paryushan', 
    label: 'Paryushan', 
    emoji: '🙏', 
    defaultMessage: 'May this festival of forgiveness bring peace and spiritual purification to your soul!', 
    theme: 'card-paryushan',
    category: 'religious'
  },

  // Buddhist Festivals (New Additions)
  { 
    value: 'buddha-purnima', 
    label: 'Buddha Purnima', 
    emoji: '☸️', 
    defaultMessage: 'May the enlightenment of Buddha bring peace and wisdom to your life!', 
    theme: 'card-buddha-purnima',
    category: 'religious'
  },

  // Regional Indian Festivals (New Additions)
  { 
    value: 'pongal', 
    label: 'Pongal', 
    emoji: '🍯', 
    defaultMessage: 'May this harvest festival bring abundance and sweetness to your life!', 
    theme: 'card-pongal',
    category: 'seasonal'
  },
  { 
    value: 'onam', 
    label: 'Onam', 
    emoji: '🌺', 
    defaultMessage: 'May King Mahabali blessing bring prosperity and harmony to your home!', 
    theme: 'card-onam',
    category: 'seasonal'
  },
  { 
    value: 'bihu', 
    label: 'Bihu', 
    emoji: '🌾', 
    defaultMessage: 'May this Assamese festival fill your life with joy, dance, and new beginnings!', 
    theme: 'card-bihu',
    category: 'seasonal'
  },
  { 
    value: 'gudi-padwa', 
    label: 'Gudi Padwa', 
    emoji: '🎋', 
    defaultMessage: 'Wishing you a prosperous and joyful Maharashtrian New Year!', 
    theme: 'card-gudi-padwa',
    category: 'seasonal'
  },
  { 
    value: 'ugadi', 
    label: 'Ugadi', 
    emoji: '🥭', 
    defaultMessage: 'May this Telugu New Year bring new hopes and sweet beginnings to your life!', 
    theme: 'card-ugadi',
    category: 'seasonal'
  },

  // International Festivals (New Additions)
  { 
    value: 'songkran', 
    label: 'Songkran', 
    emoji: '💦', 
    defaultMessage: 'Happy Thai New Year! May water wash away all negativity from your life!', 
    theme: 'card-songkran',
    category: 'international'
  },
  { 
    value: 'dia-de-muertos', 
    label: 'Día de Muertos', 
    emoji: '💀', 
    defaultMessage: 'Honoring loved ones with beautiful memories and celebration of life!', 
    theme: 'card-dia-de-muertos',
    category: 'international'
  },
  { 
    value: 'oktoberfest', 
    label: 'Oktoberfest', 
    emoji: '🍺', 
    defaultMessage: 'Prost! Wishing you joy, laughter, and good times with loved ones!', 
    theme: 'card-oktoberfest',
    category: 'international'
  },
  { 
    value: 'carnival', 
    label: 'Carnival', 
    emoji: '🎭', 
    defaultMessage: 'May your life be as colorful and joyful as the Carnival celebrations!', 
    theme: 'card-carnival',
    category: 'international'
  },

  // Professional & Academic Events (New Additions)
  { 
    value: 'teachers-day', 
    label: 'Teacher Day', 
    emoji: '📚', 
    defaultMessage: 'Thank you for lighting the path of knowledge and wisdom!', 
    theme: 'card-teachers-day',
    category: 'professional'
  },
  { 
    value: 'doctors-day', 
    label: 'Doctor Day', 
    emoji: '⚕️', 
    defaultMessage: 'Thank you for your dedication and healing touch!', 
    theme: 'card-doctors-day',
    category: 'professional'
  },
  { 
    value: 'engineers-day', 
    label: 'Engineer Day', 
    emoji: '⚙️', 
    defaultMessage: 'Celebrating innovation and the builders of our modern world!', 
    theme: 'card-engineers-day',
    category: 'professional'
  },

  // Personal Growth & Wellness (New Additions)
  { 
    value: 'yoga-day', 
    label: 'International Yoga Day', 
    emoji: '🧘', 
    defaultMessage: 'May your journey of yoga bring peace, health, and harmony!', 
    theme: 'card-yoga',
    category: 'wellness'
  },
  { 
    value: 'mental-health-day', 
    label: 'Mental Health Day', 
    emoji: '💚', 
    defaultMessage: 'Your mental health matters. Take time to nurture your mind and soul!', 
    theme: 'card-mental-health',
    category: 'wellness'
  },
  { 
    value: 'friendship-day', 
    label: 'Friendship Day', 
    emoji: '👯', 
    defaultMessage: 'Celebrating the beautiful bonds that make life worth living!', 
    theme: 'card-friendship',
    category: 'personal'
  },

  // Seasonal & Nature Celebrations (New Additions)
  { 
    value: 'spring-equinox', 
    label: 'Spring Equinox', 
    emoji: '🌸', 
    defaultMessage: 'May new beginnings blossom in your life like spring flowers!', 
    theme: 'card-spring',
    category: 'seasonal'
  },
  { 
    value: 'summer-solstice', 
    label: 'Summer Solstice', 
    emoji: '☀️', 
    defaultMessage: 'May your life be as bright and warm as the longest day of the year!', 
    theme: 'card-summer',
    category: 'seasonal'
  },
  { 
    value: 'harvest-festival', 
    label: 'Harvest Festival', 
    emoji: '🌽', 
    defaultMessage: 'Celebrating abundance and the fruits of hard work!', 
    theme: 'card-harvest',
    category: 'seasonal'
  },

];

// ❌ REMOVED: Duplicate animation and layout arrays moved to consolidated files
// - animationStyles -> Use animationOptions from @/types/animations  
// - layoutStyles -> Use layoutStyles from @/types/layouts