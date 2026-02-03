export interface BillBrand {
  id: string;
  name: string;
  logoUrl?: string;
  networkValue?: string; // Value to bind to the form's network select
}

// Mapping of available brands per country code and bill service id
// Country codes must match entries from '@/utils/constants' (e.g., 'NG', 'GH', 'KE', 'CD')
// Service ids must match entries from '@/data/bill-payment-services' (e.g., 'airtime', 'data', 'electricity', 'betting', 'giftcard', 'cabletv')
export const brandsByCountryAndService: Record<string, Record<string, BillBrand[]>> = {
  // Nigeria
  NG: {
    airtime: [
      {
        id: 'mtn',
        name: 'MTN',
        logoUrl: 'public/assets/svgs/mtn_logo.svg',
        networkValue: 'mtn'
      },
      {
        id: 'airtel',
        name: 'Airtel',
        logoUrl: 'public/assets/svgs/airtel_logo.svg',
        networkValue: 'airtel'
      },
      {
        id: 'glo',
        name: 'Glo',
        logoUrl: 'public/assets/svgs/glo_logo.svg',
        networkValue: 'glo'
      },
      {
        id: '9mobile',
        name: '9mobile',
        logoUrl: 'public/assets/svgs/9mobile_logo.svg',
        networkValue: '9mobile'
      }
    ],
    data: [
      {
        id: 'mtn',
        name: 'MTN',
        logoUrl: 'public/assets/svgs/mtn_logo.svg',
        networkValue: 'mtn'
      },
      {
        id: 'airtel',
        name: 'Airtel',
        logoUrl: 'public/assets/svgs/airtel_logo.svg',
        networkValue: 'airtel'
      },
      {
        id: 'glo',
        name: 'Glo',
        logoUrl: 'public/assets/svgs/glo_logo.svg',
        networkValue: 'glo'
      },
      {
        id: '9mobile',
        name: '9mobile',
        logoUrl: 'public/assets/svgs/9mobile_logo.svg',
        networkValue: '9mobile'
      }
    ],
    electricity: [
      { id: 'ekedc', name: 'EKEDC', networkValue: 'ekedc' },
      { id: 'ikedc', name: 'IKEDC', networkValue: 'ikedc' }
    ],
    betting: [{ id: 'bet9ja', name: 'Bet9ja', networkValue: 'bet9ja' }],
    cabletv: [
      { id: 'dstv', name: 'DStv', networkValue: 'dstv' },
      { id: 'gotv', name: 'GOtv', networkValue: 'gotv' }
    ]
  },

  // Ghana
  GH: {
    airtime: [
      { id: 'mtn', name: 'MTN', networkValue: 'mtn' },
      { id: 'airteltigo', name: 'AirtelTigo', networkValue: 'airtel' },
      { id: 'vodafone', name: 'Vodafone', networkValue: 'vodafone' }
    ],
    data: [
      { id: 'mtn', name: 'MTN', networkValue: 'mtn' },
      { id: 'airteltigo', name: 'AirtelTigo', networkValue: 'airtel' },
      { id: 'vodafone', name: 'Vodafone', networkValue: 'vodafone' }
    ],
    electricity: [{ id: 'ecg', name: 'ECG', networkValue: 'ecg' }],
    betting: [{ id: 'sportybet', name: 'SportyBet', networkValue: 'sportybet' }],
    cabletv: [{ id: 'dstv', name: 'DStv', networkValue: 'dstv' }]
  },

  // Kenya
  KE: {
    airtime: [
      { id: 'safaricom', name: 'Safaricom', networkValue: 'safaricom' },
      { id: 'airtel', name: 'Airtel', networkValue: 'airtel' },
      { id: 'telkom', name: 'Telkom', networkValue: 'telkom' }
    ],
    data: [
      { id: 'safaricom', name: 'Safaricom', networkValue: 'safaricom' },
      { id: 'airtel', name: 'Airtel', networkValue: 'airtel' },
      { id: 'telkom', name: 'Telkom', networkValue: 'telkom' }
    ],
    electricity: [{ id: 'kplc', name: 'KPLC', networkValue: 'kplc' }],
    betting: [{ id: 'sportpesa', name: 'SportPesa', networkValue: 'sportpesa' }],
    cabletv: [{ id: 'dstv', name: 'DStv', networkValue: 'dstv' }]
  },

  // Democratic Republic of the Congo (DRC)
  CD: {
    airtime: [
      { id: 'vodacom', name: 'Vodacom', networkValue: 'vodacom' },
      { id: 'orange', name: 'Orange', networkValue: 'orange' },
      { id: 'airtel', name: 'Airtel', networkValue: 'airtel' }
    ],
    data: [
      { id: 'vodacom', name: 'Vodacom', networkValue: 'vodacom' },
      { id: 'orange', name: 'Orange', networkValue: 'orange' },
      { id: 'airtel', name: 'Airtel', networkValue: 'airtel' }
    ],
    electricity: [{ id: 'snel', name: 'SNEL', networkValue: 'snel' }],
    betting: [
      { id: 'premier', name: 'Premier', networkValue: 'premier' },
      { id: 'betpower', name: 'BetPower', networkValue: 'betpower' }
    ],
    cabletv: [{ id: 'startimes', name: 'Startimes', networkValue: 'startimes' }]
  },
  // South Africa
  ZA: {
    airtime: [
      { id: 'vodacom', name: 'Vodacom', networkValue: 'vodacom' },
      { id: 'mtn', name: 'MTN', networkValue: 'mtn' },
      { id: 'cellc', name: 'Cell C', networkValue: 'cellc' },
      { id: 'telkom', name: 'Telkom', networkValue: 'telkom' }
    ],
    data: [
      { id: 'vodacom', name: 'Vodacom', networkValue: 'vodacom' },
      { id: 'mtn', name: 'MTN', networkValue: 'mtn' },
      { id: 'cellc', name: 'Cell C', networkValue: 'cellc' },
      { id: 'telkom', name: 'Telkom', networkValue: 'telkom' }
    ],
    cabletv: [
      { id: 'dstv', name: 'DStv', networkValue: 'dstv' },
      { id: 'gotv', name: 'GOtv', networkValue: 'gotv' }
    ]
  },

  // Benin
  BJ: {
    airtime: [
      { id: 'mtn', name: 'MTN Benin', networkValue: 'mtn' },
      { id: 'moov', name: 'Moov Benin', networkValue: 'moov' },
      { id: 'celtiis', name: 'Celtiis', networkValue: 'celtiis' }
    ],
    data: [
      { id: 'mtn', name: 'MTN Benin', networkValue: 'mtn' },
      { id: 'moov', name: 'Moov Benin', networkValue: 'moov' },
      { id: 'celtiis', name: 'Celtiis', networkValue: 'celtiis' }
    ],
    electricity: [{ id: 'sbee', name: 'SBEE', networkValue: 'sbee' }],
    cabletv: [
      { id: 'canalplus', name: 'CANAL+', networkValue: 'canalplus' },
      { id: 'startimes', name: 'Startimes', networkValue: 'startimes' }
    ]
  },

  // Senegal
  SN: {
    airtime: [
      { id: 'orange', name: 'Orange', networkValue: 'orange' },
      { id: 'free', name: 'Free', networkValue: 'free' },
      { id: 'expresso', name: 'Expresso', networkValue: 'expresso' }
    ],
    data: [
      { id: 'orange', name: 'Orange', networkValue: 'orange' },
      { id: 'free', name: 'Free', networkValue: 'free' },
      { id: 'expresso', name: 'Expresso', networkValue: 'expresso' }
    ]
  },

  // Côte d'Ivoire
  CI: {
    airtime: [
      { id: 'orange', name: 'Orange', networkValue: 'orange' },
      { id: 'mtn', name: 'MTN', networkValue: 'mtn' },
      { id: 'moov', name: 'Moov Africa', networkValue: 'moov' }
    ],
    data: [
      { id: 'orange', name: 'Orange', networkValue: 'orange' },
      { id: 'mtn', name: 'MTN', networkValue: 'mtn' },
      { id: 'moov', name: 'Moov Africa', networkValue: 'moov' }
    ]
  },

  // Mali
  ML: {
    airtime: [
      { id: 'orange', name: 'Orange Mali', networkValue: 'orange' },
      { id: 'telecel', name: 'Telecel', networkValue: 'telecel' },
      { id: 'malitel', name: 'Malitel', networkValue: 'malitel' }
    ],
    data: [
      { id: 'orange', name: 'Orange Mali', networkValue: 'orange' },
      { id: 'telecel', name: 'Telecel', networkValue: 'telecel' },
      { id: 'malitel', name: 'Malitel', networkValue: 'malitel' }
    ]
  },

  // Niger
  NE: {
    airtime: [
      { id: 'airtel', name: 'Airtel', networkValue: 'airtel' },
      { id: 'moov', name: 'Moov Africa', networkValue: 'moov' },
      { id: 'zamani', name: 'Zamani', networkValue: 'zamani' }
    ],
    data: [
      { id: 'airtel', name: 'Airtel', networkValue: 'airtel' },
      { id: 'moov', name: 'Moov Africa', networkValue: 'moov' },
      { id: 'zamani', name: 'Zamani', networkValue: 'zamani' }
    ]
  },

  // Togo
  TG: {
    airtime: [
      { id: 'togocom', name: 'TogoCom', networkValue: 'togocom' },
      { id: 'moov', name: 'Moov Africa', networkValue: 'moov' }
    ],
    data: [
      { id: 'togocom', name: 'TogoCom', networkValue: 'togocom' },
      { id: 'moov', name: 'Moov Africa', networkValue: 'moov' }
    ]
  },

  // Burkina Faso
  BF: {
    airtime: [
      { id: 'orange', name: 'Orange', networkValue: 'orange' },
      { id: 'telmob', name: 'Telmob', networkValue: 'telmob' },
      { id: 'telecel', name: 'Telecel', networkValue: 'telecel' }
    ],
    data: [
      { id: 'orange', name: 'Orange', networkValue: 'orange' },
      { id: 'telmob', name: 'Telmob', networkValue: 'telmob' },
      { id: 'telecel', name: 'Telecel', networkValue: 'telecel' }
    ]
  },

  // Guinea
  GN: {
    airtime: [
      { id: 'orange', name: 'Orange', networkValue: 'orange' },
      { id: 'mtn', name: 'MTN', networkValue: 'mtn' },
      { id: 'cellcom', name: 'Cellcom', networkValue: 'cellcom' }
    ],
    data: [
      { id: 'orange', name: 'Orange', networkValue: 'orange' },
      { id: 'mtn', name: 'MTN', networkValue: 'mtn' },
      { id: 'cellcom', name: 'Cellcom', networkValue: 'cellcom' }
    ]
  },

  // Cameroon
  CM: {
    airtime: [
      { id: 'mtn', name: 'MTN', networkValue: 'mtn' },
      { id: 'orange', name: 'Orange', networkValue: 'orange' },
      { id: 'nexttel', name: 'Nexttel', networkValue: 'nexttel' },
      { id: 'camtel', name: 'Camtel', networkValue: 'camtel' }
    ],
    data: [
      { id: 'mtn', name: 'MTN', networkValue: 'mtn' },
      { id: 'orange', name: 'Orange', networkValue: 'orange' },
      { id: 'nexttel', name: 'Nexttel', networkValue: 'nexttel' },
      { id: 'camtel', name: 'Camtel', networkValue: 'camtel' }
    ]
  },

  // Gabon
  GA: {
    airtime: [
      { id: 'airtel', name: 'Airtel', networkValue: 'airtel' },
      { id: 'moov', name: 'Moov Africa', networkValue: 'moov' }
    ],
    data: [
      { id: 'airtel', name: 'Airtel', networkValue: 'airtel' },
      { id: 'moov', name: 'Moov Africa', networkValue: 'moov' }
    ]
  },

  // Republic of the Congo
  CG: {
    airtime: [
      { id: 'airtel', name: 'Airtel', networkValue: 'airtel' },
      { id: 'mtn', name: 'MTN', networkValue: 'mtn' }
    ],
    data: [
      { id: 'airtel', name: 'Airtel', networkValue: 'airtel' },
      { id: 'mtn', name: 'MTN', networkValue: 'mtn' }
    ]
  },

  // Central African Republic
  CF: {
    airtime: [
      { id: 'orange', name: 'Orange', networkValue: 'orange' },
      { id: 'telecel', name: 'Telecel', networkValue: 'telecel' }
    ],
    data: [
      { id: 'orange', name: 'Orange', networkValue: 'orange' },
      { id: 'telecel', name: 'Telecel', networkValue: 'telecel' }
    ]
  },

  // Chad
  TD: {
    airtime: [
      { id: 'airtel', name: 'Airtel', networkValue: 'airtel' },
      { id: 'moov', name: 'Moov Africa', networkValue: 'moov' }
    ],
    data: [
      { id: 'airtel', name: 'Airtel', networkValue: 'airtel' },
      { id: 'moov', name: 'Moov Africa', networkValue: 'moov' }
    ]
  },

  // Morocco
  MA: {
    airtime: [
      { id: 'iam', name: 'Maroc Telecom (IAM)', networkValue: 'iam' },
      { id: 'orange', name: 'Orange', networkValue: 'orange' },
      { id: 'inwi', name: 'Inwi', networkValue: 'inwi' }
    ],
    data: [
      { id: 'iam', name: 'Maroc Telecom (IAM)', networkValue: 'iam' },
      { id: 'orange', name: 'Orange', networkValue: 'orange' },
      { id: 'inwi', name: 'Inwi', networkValue: 'inwi' }
    ]
  },

  // Algeria
  DZ: {
    airtime: [
      { id: 'mobilis', name: 'Mobilis', networkValue: 'mobilis' },
      { id: 'djezzy', name: 'Djezzy', networkValue: 'djezzy' },
      { id: 'ooredoo', name: 'Ooredoo', networkValue: 'ooredoo' }
    ],
    data: [
      { id: 'mobilis', name: 'Mobilis', networkValue: 'mobilis' },
      { id: 'djezzy', name: 'Djezzy', networkValue: 'djezzy' },
      { id: 'ooredoo', name: 'Ooredoo', networkValue: 'ooredoo' }
    ]
  },

  // Tunisia
  TN: {
    airtime: [
      { id: 'tunisie', name: 'Tunisie Telecom', networkValue: 'tunisie' },
      { id: 'orange', name: 'Orange', networkValue: 'orange' },
      { id: 'ooredoo', name: 'Ooredoo', networkValue: 'ooredoo' }
    ],
    data: [
      { id: 'tunisie', name: 'Tunisie Telecom', networkValue: 'tunisie' },
      { id: 'orange', name: 'Orange', networkValue: 'orange' },
      { id: 'ooredoo', name: 'Ooredoo', networkValue: 'ooredoo' }
    ]
  },

  // Mauritania
  MR: {
    airtime: [
      { id: 'mauritel', name: 'Moov Africa Mauritel', networkValue: 'mauritel' },
      { id: 'chinguitel', name: 'Chinguitel', networkValue: 'chinguitel' },
      { id: 'mattel', name: 'Mattel', networkValue: 'mattel' }
    ],
    data: [
      { id: 'mauritel', name: 'Moov Africa Mauritel', networkValue: 'mauritel' },
      { id: 'chinguitel', name: 'Chinguitel', networkValue: 'chinguitel' },
      { id: 'mattel', name: 'Mattel', networkValue: 'mattel' }
    ]
  }
};

export const getBrandsFor = (countryCode?: string, serviceId?: string): BillBrand[] => {
  if (!countryCode || !serviceId) return [];
  const countryMap = brandsByCountryAndService[countryCode];
  if (!countryMap) return [];
  return countryMap[serviceId] || [];
};
