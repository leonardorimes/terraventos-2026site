const fs = require('fs');
const jsonPath = 'public/properties-data.json';
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

const newProp = {
  id: "15",
  slug: "lotes-exclusivos-taiba",
  category: "venda",
  image: "/taiba/taiba-lotes-2.jpg",
  rating: 5,
  gallery: {
      main: '/taiba/taiba-lotes-2.jpg',
      sideTop: '/taiba/taiba-lotes-1.jpg',
      sideBottom: '/taiba/taiba-lotes-2.jpg',
      extra: []
  },
  mapImage: '/mapa.avif',
  mapUrl: '',
  videoSources: [],
  i18n: {
    pt: {
      title: "VENDA",
      badge: "Lançamento",
      propertyTitle: "LOTES EXCLUSIVOS TAÍBA",
      location: "Taíba, Ceará",
      exclusiveText: "Área de 2.800m² subdividida em 5 lotes de 540m². Quadra da praia, próximo ao Villa Marola.",
      summaryDescription: "Oportunidade rara de investimento na Taíba. 5 lotes de 540m² a uma quadra da praia, com luz elétrica instalada.",
      about: [
        "Oportunidade rara de investimento na desejada praia da Taíba. Esta área total de 2.800m² é composta por 5 lotes de 540m² cada, localizados a apenas uma quadra da praia.",
        "Situada perto do renomado Villa Marola, a propriedade já conta com energia elétrica instalada e pronta para o desenvolvimento de projetos de alto padrão, como resorts boutique ou vilas de luxo."
      ],
      infra: [
        "Área Total: 2.800 m²",
        "Subdivisão: 5 lotes de 540m²",
        "Infraestrutura: Luz elétrica instalada",
        "Localização: Quadra da Praia, perto do Villa Marola"
      ],
      facilities: ["2.800 m²", "5 Lotes", "Quadra da Praia", "Luz Elétrica"],
      priceTag: "Valor",
      price: "Sob Consulta",
      installments: "Consulte condições"
    },
    en: {
      title: "FOR SALE",
      badge: "New Release",
      propertyTitle: "EXCLUSIVE LOTS TAÍBA",
      location: "Taíba, Ceará",
      exclusiveText: "2,800m² area subdivided into 5 lots of 540m². One block from the beach, near Villa Marola.",
      summaryDescription: "Rare investment opportunity in Taíba. 5 lots of 540m² one block from the beach, with electricity already installed.",
      about: [
        "Rare investment opportunity in the highly desired Taíba beach. This total area of 2,800m² consists of 5 lots of 540m² each, located just one block from the beach.",
        "Situated near the renowned Villa Marola, the property already has electricity installed and is ready for the development of high-end projects, such as boutique resorts or luxury villas."
      ],
      infra: [
        "Total Area: 2,800 m²",
        "Subdivision: 5 lots of 540m²",
        "Infrastructure: Electricity installed",
        "Location: One block from the beach, near Villa Marola"
      ],
      facilities: ["2,800 m²", "5 Lots", "Near Beach", "Electricity"],
      priceTag: "Price",
      price: "Upon Request",
      installments: "Consult conditions"
    },
    es: {
      title: "VENTA",
      badge: "Lanzamiento",
      propertyTitle: "LOTES EXCLUSIVOS TAÍBA",
      location: "Taíba, Ceará",
      exclusiveText: "Área de 2.800m² subdividida en 5 lotes de 540m². A una cuadra de la playa, cerca de Villa Marola.",
      summaryDescription: "Rara oportunidad de inversión en Taíba. 5 lotes de 540m² a una cuadra de la playa, con luz eléctrica ya instalada.",
      about: [
        "Rara oportunidad de inversión en la deseada playa de Taíba. Esta área total de 2.800m² consta de 5 lotes de 540m² cada uno, ubicados a solo una cuadra de la playa.",
        "Situada cerca de la famosa Villa Marola, la propiedad ya cuenta con energía eléctrica instalada y lista para el desarrollo de proyectos de alto nivel, como resorts boutique o villas de lujo."
      ],
      infra: [
        "Área Total: 2.800 m²",
        "Subdivisión: 5 lotes de 540m²",
        "Infraestructura: Luz eléctrica instalada",
        "Ubicación: A una cuadra de la playa, cerca de Villa Marola"
      ],
      facilities: ["2.800 m²", "5 Lotes", "Cerca de Playa", "Luz Eléctrica"],
      priceTag: "Valor",
      price: "Consultar Precio",
      installments: "Consulte condiciones"
    }
  }
};

data.unshift(newProp);
fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));
console.log('Added Taiba property to JSON');
