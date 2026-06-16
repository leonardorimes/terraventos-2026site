const fs = require('fs');

const videoIds = [
  "1201412713", "1201412789", "1201412849", "1201412979", "1201413032",
  "1201413057", "1201413090", "1201413261", "1201413287", "1201413321",
  "1201412910", "1201413348", "1201413371", "1201413409", "1201413430",
  "1201413461", "1201413486", "1201413513", "1201413537", "1201413572",
  "1201413599", "1201413616", "1201413633", "1201413652", "1201413678",
  "1201413701", "1201413719"
];

const videoSources = videoIds.map(id => `https://player.vimeo.com/video/${id}`);

const tsPt = `    {
      id: '13',
      slug: 'mansao-praia-do-prea', category: 'venda',
      title: 'VENDA',
      badge: 'Alto Padrão',
      propertyTitle: 'CASA ALTO PADRÃO NA PRAIA DO PREÁ',
      location: 'Praia do Preá, Ceará, Brasil',
      rating: 5,
      exclusiveText: '4 Suítes | Academia | SPA | Rooftop | A 500m do mar',
      summaryDescription: 'Belíssima casa de alto padrão no bairro de mansões do Preá, com 4 suítes, rooftop com SPA e vista para o mar e para o Parque Nacional de Jericoacoara.',
      about: [
        'Belíssima casa alto padrão, arejada e com muita iluminação natural, a apenas 500 metros do mar e 400 da rua principal no bairro de mansões do Preá.',
        'O imóvel conta com fechaduras biométricas, câmeras de segurança, cerca elétrica, hospedando confortavelmente 12 pessoas distribuídas em suas quatro suítes.',
        'Sala de estar/TV com pé direito duplo, sala de jantar integrada à cozinha equipada com ilha de 3m e área gourmet com churrasqueira e cervejeira.',
        'Amplo rooftop com vista mar e vista para o Parque Nacional de Jericoacoara, equipado com SPA de hidromassagem para 8 pessoas.',
        'A casa possui poço artesiano com filtro, gerador de energia e caixa d\\'água de 3.000 litros, além de academia completa, piscina com deck e prainha com areia.'
      ],
      infra: [
        'Localização: Bairro de mansões, a 500m do mar',
        'Garagem para 3 veículos',
        'Rooftop com SPA e vista mar',
        'Gerador de energia',
        'Sistema de segurança completo'
      ],
      facilities: ['4 Suítes', 'Piscina e Prainha', 'Academia', 'Rooftop com SPA', 'Área Gourmet', 'Ar-condicionado', 'Poço Artesiano', 'Segurança'],
      price: 'R$ 4.000.000,00',
      installments: 'Consulte condições',
      priceTag: '',
      image: 'https://vumbnail.com/1201412713.jpg',
      gallery: {
        main: 'https://vumbnail.com/1201412713.jpg',
        sideTop: 'https://vumbnail.com/1201412789.jpg',
        sideBottom: 'https://vumbnail.com/1201412849.jpg',
        extra: [
          'https://vumbnail.com/1201412979.jpg',
          'https://vumbnail.com/1201413032.jpg',
          'https://vumbnail.com/1201413057.jpg',
          'https://vumbnail.com/1201413090.jpg',
          'https://vumbnail.com/1201413261.jpg',
          'https://vumbnail.com/1201412910.jpg'
        ]
      },
      mapImage: '/mapa.avif',
      mapUrl: 'https://maps.google.com/maps?q=Praia+do+Pre%C3%A1,+Cruz+-+CE&hl=pt-BR&z=15&output=embed',
      videoSources: ${JSON.stringify(videoSources)},
      videoGalleryCredits: "Mais imagens no @casaohanaprea",
    },`;

const tsEn = `    {
      id: '13',
      slug: 'mansao-praia-do-prea', category: 'venda',
      title: 'FOR SALE',
      badge: 'High-End',
      propertyTitle: 'HIGH-END HOUSE IN PRAIA DO PREÁ',
      location: 'Praia do Preá, Ceará, Brazil',
      rating: 5,
      exclusiveText: '4 Suites | Gym | SPA | Rooftop | 500m from the sea',
      summaryDescription: 'Beautiful high-end house in the mansion neighborhood of Preá, with 4 suites, rooftop with SPA, and views of the sea and the Jericoacoara National Park.',
      about: [
        'Beautiful high-end house, airy and with lots of natural lighting, just 500 meters from the sea and 400 from the main street in the mansion neighborhood of Preá.',
        'The property features biometric locks, security cameras, an electric fence, comfortably accommodating 12 people distributed in its four suites.',
        'Living/TV room with double height ceiling, dining room integrated into the kitchen equipped with a 3m island and a gourmet area with barbecue and beer fridge.',
        'Spacious rooftop with sea view and view to the Jericoacoara National Park, equipped with a hydromassage SPA for 8 people.',
        'The house has an artesian well with filter, power generator, and a 3,000-liter water tank, as well as a full gym, pool with deck, and a sandy beach area.'
      ],
      infra: [
        'Location: Mansion neighborhood, 500m from the sea',
        'Garage for 3 vehicles',
        'Rooftop with SPA and sea view',
        'Power generator',
        'Complete security system'
      ],
      facilities: ['4 Suites', 'Pool and Beach Area', 'Gym', 'Rooftop with SPA', 'Gourmet Area', 'Air conditioning', 'Artesian Well', 'Security'],
      price: 'R$ 4,000,000.00',
      installments: 'Consult conditions',
      priceTag: '',
      image: 'https://vumbnail.com/1201412713.jpg',
      gallery: {
        main: 'https://vumbnail.com/1201412713.jpg',
        sideTop: 'https://vumbnail.com/1201412789.jpg',
        sideBottom: 'https://vumbnail.com/1201412849.jpg',
        extra: [
          'https://vumbnail.com/1201412979.jpg',
          'https://vumbnail.com/1201413032.jpg',
          'https://vumbnail.com/1201413057.jpg',
          'https://vumbnail.com/1201413090.jpg',
          'https://vumbnail.com/1201413261.jpg',
          'https://vumbnail.com/1201412910.jpg'
        ]
      },
      mapImage: '/mapa.avif',
      mapUrl: 'https://maps.google.com/maps?q=Praia+do+Pre%C3%A1,+Cruz+-+CE&hl=pt-BR&z=15&output=embed',
      videoSources: ${JSON.stringify(videoSources)},
      videoGalleryCredits: "Mais imagens no @casaohanaprea",
    },`;

const tsEs = `    {
      id: '13',
      slug: 'mansao-praia-do-prea', category: 'venda',
      title: 'VENTA',
      badge: 'Alta Gama',
      propertyTitle: 'CASA DE ALTA GAMA EN PRAIA DO PREÁ',
      location: 'Praia do Preá, Ceará, Brasil',
      rating: 5,
      exclusiveText: '4 Suites | Gimnasio | SPA | Rooftop | A 500m del mar',
      summaryDescription: 'Hermosa casa de alta gama en el barrio de mansiones de Preá, con 4 suites, rooftop con SPA y vistas al mar y al Parque Nacional de Jericoacoara.',
      about: [
        'Hermosa casa de alta gama, aireada y con mucha iluminación natural, a solo 500 metros del mar y 400 de la calle principal en el barrio de mansiones de Preá.',
        'La propiedad cuenta con cerraduras biométricas, cámaras de seguridad, cerco eléctrico, alojando cómodamente a 12 personas distribuidas en sus cuatro suites.',
        'Sala de estar/TV con techo de doble altura, comedor integrado a la cocina equipada con isla de 3m y área gourmet con barbacoa y nevera para cervezas.',
        'Amplio rooftop con vista al mar y vista al Parque Nacional de Jericoacoara, equipado con SPA de hidromasaje para 8 personas.',
        'La casa cuenta con pozo artesiano con filtro, generador de energía y un tanque de agua de 3.000 litros, además de un gimnasio completo, piscina con deck y una zona de playa de arena.'
      ],
      infra: [
        'Ubicación: Barrio de mansiones, a 500m del mar',
        'Garaje para 3 vehículos',
        'Rooftop con SPA y vista al mar',
        'Generador de energía',
        'Sistema de seguridad completo'
      ],
      facilities: ['4 Suites', 'Piscina y Playa', 'Gimnasio', 'Rooftop con SPA', 'Área Gourmet', 'Aire acondicionado', 'Pozo Artesiano', 'Seguridad'],
      price: 'R$ 4.000.000,00',
      installments: 'Consulte condiciones',
      priceTag: '',
      image: 'https://vumbnail.com/1201412713.jpg',
      gallery: {
        main: 'https://vumbnail.com/1201412713.jpg',
        sideTop: 'https://vumbnail.com/1201412789.jpg',
        sideBottom: 'https://vumbnail.com/1201412849.jpg',
        extra: [
          'https://vumbnail.com/1201412979.jpg',
          'https://vumbnail.com/1201413032.jpg',
          'https://vumbnail.com/1201413057.jpg',
          'https://vumbnail.com/1201413090.jpg',
          'https://vumbnail.com/1201413261.jpg',
          'https://vumbnail.com/1201412910.jpg'
        ]
      },
      mapImage: '/mapa.avif',
      mapUrl: 'https://maps.google.com/maps?q=Praia+do+Pre%C3%A1,+Cruz+-+CE&hl=pt-BR&z=15&output=embed',
      videoSources: ${JSON.stringify(videoSources)},
      videoGalleryCredits: "Mais imagens no @casaohanaprea",
    },`;

let tsContent = fs.readFileSync('src/data/oportunidadesDataI18n.ts', 'utf8');

// Insert at the beginning of pt
tsContent = tsContent.replace("pt: [", () => "pt: [\n" + tsPt);
// Insert at the beginning of en
tsContent = tsContent.replace("en: [", () => "en: [\n" + tsEn);
// Insert at the beginning of es
tsContent = tsContent.replace("es: [", () => "es: [\n" + tsEs);

fs.writeFileSync('src/data/oportunidadesDataI18n.ts', tsContent);

console.log("Updated ts files successfully");
