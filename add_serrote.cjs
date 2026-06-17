const fs = require('fs');
const jsonPath = 'public/properties-data.json';
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

const newProp = {
  id: "14",
  slug: "terreno-serrote-jericoacoara",
  category: "venda",
  image: "/jericoacara/terreno-serrote.jpeg",
  rating: 5,
  gallery: {
      main: '/jericoacara/terreno-serrote.jpeg',
      sideTop: '/jericoacara/terreno-serrote.jpeg',
      sideBottom: '/jericoacara/terreno-serrote.jpeg',
      extra: []
  },
  mapImage: '/mapa.avif',
  mapUrl: 'https://maps.google.com/maps?q=-2.7963,-40.5134&hl=pt-BR&z=17&output=embed',
  videoSources: ["https://player.vimeo.com/video/1202147252"],
  i18n: {
    pt: {
      title: "VENDA",
      badge: "Lançamento",
      propertyTitle: "TERRENO SERROTE JERICOACOARA",
      location: "Jericoacoara, Ceará",
      exclusiveText: "Lote de 200m² com 7 metros de frente pela Rua do Forró, com acesso Serrote.",
      summaryDescription: "Oportunidade exclusiva no coração de Jericoacoara. Terreno de 200m² com 7 metros de frente, localizado estrategicamente na Rua do Forró.",
      about: [
        "Oportunidade exclusiva no coração de Jericoacoara. Terreno de 200m² com 7 metros de frente, localizado estrategicamente na Rua do Forró e com acesso para o Serrote.",
        "Ideal para a construção da sua casa dos sonhos ou um empreendimento de alto padrão, em um dos destinos mais desejados do Brasil."
      ],
      infra: [
        "Área Total: 200 m²",
        "Frente: 7 metros",
        "Acesso: Rua do Forró e Serrote"
      ],
      facilities: ["200 m²", "7m de frente", "Localização Premium"],
      priceTag: "Valor",
      price: "R$ 1.200.000,00",
      installments: "Consulte condições"
    },
    en: {
      title: "FOR SALE",
      badge: "New Release",
      propertyTitle: "SERROTE LAND JERICOACOARA",
      location: "Jericoacoara, Ceará",
      exclusiveText: "200m² lot with 7 meters frontage on Rua do Forró, with Serrote access.",
      summaryDescription: "Exclusive opportunity in the heart of Jericoacoara. 200m² land with 7 meters frontage, strategically located on Rua do Forró.",
      about: [
        "Exclusive opportunity in the heart of Jericoacoara. 200m² land with 7 meters frontage, strategically located on Rua do Forró with access to Serrote.",
        "Ideal for building your dream home or a high-end development in one of the most desired destinations in Brazil."
      ],
      infra: [
        "Total Area: 200 m²",
        "Frontage: 7 meters",
        "Access: Rua do Forró and Serrote"
      ],
      facilities: ["200 m²", "7m Frontage", "Premium Location"],
      priceTag: "Price",
      price: "R$ 1,200,000.00",
      installments: "Consult conditions"
    },
    es: {
      title: "VENTA",
      badge: "Lanzamiento",
      propertyTitle: "TERRENO SERROTE JERICOACOARA",
      location: "Jericoacoara, Ceará",
      exclusiveText: "Lote de 200m² con 7 metros de frente por la Rua do Forró, con acceso a Serrote.",
      summaryDescription: "Oportunidad exclusiva en el corazón de Jericoacoara. Terreno de 200m² con 7 metros de frente, estratégicamente ubicado en la Rua do Forró.",
      about: [
        "Oportunidad exclusiva en el corazón de Jericoacoara. Terreno de 200m² con 7 metros de frente, estratégicamente ubicado en la Rua do Forró y con acceso a Serrote.",
        "Ideal para la construcción de la casa de sus sueños o un emprendimiento de alto nivel, en uno de los destinos más deseados de Brasil."
      ],
      infra: [
        "Área Total: 200 m²",
        "Frente: 7 metros",
        "Acceso: Rua do Forró y Serrote"
      ],
      facilities: ["200 m²", "7m de frente", "Ubicación Premium"],
      priceTag: "Valor",
      price: "R$ 1.200.000,00",
      installments: "Consulte condiciones"
    }
  }
};

data.unshift(newProp);
fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));
console.log('Added property to JSON');
