import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const baseUrl = 'https://terraventos.com';

const locales = {
  pt: {
    code: 'pt_BR',
    homeTitle: 'Terra Ventos | Imóveis de Luxo e Investimentos no Ceará',
    homeDesc: 'Curadoria exclusiva de imóveis de alto padrão e oportunidades de investimento no litoral cearense (Preá, Tatajuba, Bitupitá).',
    properties: [
      { slug: 'terreno-praia-do-farol', title: 'Terreno Praia do Farol', description: 'Terreno com frente para lagoa em área de alta valorização do litoral cearense. A apenas 2 minutos da praia, ideal para casas de alto padrão ou pousada.', image: '/PradoFarol/WhatsApp%20Image%202026-06-23%20at%2007.58.08.jpeg' },
      { slug: 'terreno-barrinha-1753m', title: 'Terreno Barrinha Pé na Areia', description: 'Oportunidade rara de investimento na desejada região da Barrinha, bem próximo ao Preá. Área de 1.753 m² pé na areia com documentação 100% regularizada.', image: '/barrinhaNova/barrinha-1.jpeg' },
      /* { slug: 'lotes-exclusivos-taiba', title: 'Lotes Exclusivos Taíba', description: 'Área de 2.800m² subdividida em 5 lotes de 540m². Quadra da praia, próximo ao Villa Marola.', image: '/taiba/taiba-lotes-1.jpg' },
 */
      { slug: 'terreno-serrote-jericoacoara', title: 'Terreno Serrote Jericoacoara', description: 'Lote de 200m² com 7 metros de frente pela Rua do Forró, com acesso Serrote.', image: '/jericoacara/terreno-serrote.jpeg' },
      { slug: 'casa-alto-padrao-praia-barrinha', title: 'Casa de Alto Padrão na Praia da Barrinha | Acaraú - CE', description: 'Encante-se com essa casa incrível a 400 metros da praia da Barrinha. 4 suítes, 5 banheiros, piscina, espaço gourmet e jardim com coqueiros. R$ 6.600.000.', image: '/og-barrinha.jpg' },
      { slug: 'area-exclusiva-tatajuba-guriu-100000m', title: 'Área Exclusiva em Tatajuba/Guriú - 100.000m²', description: 'Oportunidade única de investimento em frente ao mar entre Guriú e Tatajuba. Área de 10 hectares com documentação regularizada.', image: '/GURIU/VS--TATAJUBAfromTerraVentosonVimeo-0%E2%80%9920%E2%80%9D.jpg' },
      { slug: 'terreno-exclusivo-tatajuba-1000m', title: 'Terreno Exclusivo em Tatajuba — 1.000 m²', description: 'Descubra a joia de Tatajuba: Um terreno de 1.000 m² no coração da vila que é o novo desejo do kitesurf mundial.', image: '/TATAJUBA/WhatsApp%20Image%202026-04-23%20at%2018.35.22.jpeg' },
      { slug: 'terreno-exclusivo-prea-200m-mar', title: 'Terreno Exclusivo Preá — 200m do Mar', description: 'Excelente oportunidade de investimento no Preá. Terreno com 250 m² localizado a apenas 200 metros da praia.', image: '/prea%20oportunidade/WhatsApp%20Image%202026-04-21%20at%2009.32.47.jpeg' },
      { slug: 'prea-house', title: 'Preá House | Luxo e Sofisticação no Preá', description: 'Propriedade luxuosa com 3 suítes, piscina e rooftop terrace. O melhor do design e conforto à beira-mar.', image: '/Prea%20House/WhatsApp%20Image%202026-04-20%20at%2009.12.53.jpeg' },
      { slug: 'villa-prabhu', title: 'Villa Prabhu — Paracuru-CE', description: 'Loteamento exclusivo com lagoa privativa e lazer completo a 100m da praia em Paracuru.', image: '/VILLA_PRABHU/WhatsApp%20Image%202026-04-01%20at%2014.58.56%20(3).jpeg' },
      { slug: 'villa-condudu-3', title: 'Casa Alto Padrão 3 Suítes — Frente Mar Preá', description: 'Vila Conduru III: Luxo rústico à beira-mar com 3 suítes amplas e piscina privativa.', image: '/VillaCondutuPaginaInicial/FINAL%2014.png' },
      { slug: 'terrenos-bitupita', title: 'Terrenos Pé na Areia em Bitupitá', description: 'A próxima fronteira de valorização no Ceará. Lotes exclusivos em uma vila de pescadores intocada.', image: '/bitupitaPaginaIndividual/DJI_20251020023318_0221_D.jpg' },
      { slug: 'vila-do-ingles', title: 'Vila do Inglês | Luxo Sustentável no Preá', description: 'Residência moderna de 200 m² alimentada por energia solar em localização premium.', image: '/viladoinglesPaginaInicial/Final%2004%20(1).png' },
      { slug: 'casa-matanzas', title: 'Casa Matanzas | Vista Mar e Bosque (Chile)', description: 'Descubra Matanzas Paradise: Casa moderna com vistas panorâmicas espetaculares e tinaja privada.', image: '/Matanzas/3b77d98c-5cd0-4f51-816a-6e42748720d2.avif' },
      { slug: 'lote-109-taiba', title: 'LOTE 109 — TAIBA', description: 'Terreno de 560 m² em localização estratégica, totalmente murado e pronto para construir.', image: '/og-propriedades.png' },
      { slug: 'lote-barramar-lagoa-taiba', title: 'LOTE BARRAMAR LAGOA — TAIBA', description: 'Terreno de 800 m² no Loteamento Barramar em Taiba, a apenas 300 metros da Lagoa.', image: '/og-propriedades.png' },
      { slug: 'terreno-acarau-castelhano-simi', title: 'TERRENO ACARAÚ — CASTELHANO', description: 'Terreno de 1.680 m² limpo, pé no chão e pronto para construir.', image: '/Terreno para Venda, Acaraú _ CE/202605191306364488.jpeg' },
      { slug: 'terreno-vila-prea-215m-simi', title: 'TERRENO VILA PREÁ — 215,80 m²', description: 'Terreno de 215,80 m² localizado na Vila Preá com dimensões perfeitas para construção.', image: '/Terreno para Venda, bairro Barrinha, área total 2.760,00 m/202606261217521256.jpeg' },
      { slug: 'terreno-barrinha-2760m-simi', title: 'TERRENO BARRINHA — 2.760,00 m²', description: 'Terreno Exclusivo de 2.760,00 m² à venda na Praia da Barrinha, região de alta valorização.', image: '/Terreno para Venda, bairro Barrinha, área total 2.760,00 m²/1.jpg' },
      { slug: 'terreno-praia-do-prea-1273m-simi', title: 'TERRENO PRAIA DO PREÁ — 1.273,00 m²', description: 'Terreno de 1.273,00 m² na Praia do Preá com 12,35 metros de frente.', image: '/Terreno para Venda, bairro Praia Do Preá/202606051159349483.jpg' },
      { slug: 'terreno-praia-do-prea-523m-simi', title: 'TERRENO PRAIA DO PREÁ — 523,00 m²', description: 'Terreno com 523,00 m² de área total, localizado na Praia do Preá.', image: '/Terreno para Venda, bairro Praia Do Preá, área total 523,00 m²/1.jpeg' },
      { slug: 'terreno-praia-do-prea-600m-simi', title: 'TERRENO PRAIA DO PREÁ — 600,00 m²', description: 'Oportunidade de terreno de 600,00 m² na Praia do Preá.', image: '/Terreno para Venda, bairro Praia Do Preá, área total 600,00 m²/202606241105101964.jpeg' },
      { slug: 'terreno-cruz-cavalo-bravo-simi', title: 'TERRENO CRUZ — CAVALO BRAVO PREÁ', description: 'Terreno de 231,00 m² (11x21m) no bairro Cavalo Bravo em Cruz.', image: '/Terreno para Venda, Cruz _ CE, bairro Cavalo Bravo Preá/1.jpeg' },
      { slug: 'terreno-prea-esquina-praca-nova-simi', title: 'TERRENO DE ESQUINA PRAIA DO PREÁ', description: 'Terreno de esquina com 1.350 m² (27x50m), a apenas 350m da praia e próximo à Praça Nova no Preá.', image: '/terreno-prea-esquina/1.png' },


    ]
  },
  en: {
    code: 'en_US',
    homeTitle: 'Terra Ventos | Luxury Real Estate and Investments in Ceará',
    homeDesc: 'Exclusive curation of high-end properties and investment opportunities on the Ceará coast (Preá, Tatajuba, Bitupitá).',
    properties: [
      { slug: 'terreno-praia-do-farol', title: 'Praia do Farol Land', description: 'Land facing the lagoon, located in one of the highest appreciation areas on the Ceará coast. Just 2 minutes from the beach, offering excellent potential.', image: '/PradoFarol/WhatsApp%20Image%202026-06-23%20at%2007.58.08.jpeg' },
      { slug: 'terreno-barrinha-1753m', title: 'Beachfront Barrinha Land', description: 'Rare investment opportunity in the desired Barrinha region, very close to Preá. 1,753 sqm beachfront area with 100% legalized documentation.', image: '/barrinhaNova/barrinha-1.jpeg' },
      /* { slug: 'lotes-exclusivos-taiba', title: 'Exclusive Lots Taíba', description: '2,800m² area subdivided into 5 lots of 540m². One block from the beach, near Villa Marola.', image: '/taiba/taiba-lotes-1.jpg' },
 */
      { slug: 'terreno-serrote-jericoacoara', title: 'Serrote Land Jericoacoara', description: '200m² lot with 7 meters frontage on Rua do Forró, with Serrote access.', image: '/jericoacara/terreno-serrote.jpeg' },
      { slug: 'casa-alto-padrao-praia-barrinha', title: 'High-End Beach House — Praia da Barrinha | Acaraú - CE', description: 'Be enchanted by this incredible house 400 meters from Barrinha beach. 4 suites, 5 bathrooms, pool, gourmet space and garden with coconut palms. R$ 6,600,000.', image: '/og-barrinha.jpg' },
      { slug: 'area-exclusiva-tatajuba-guriu-100000m', title: 'Exclusive Beachfront Area — 100,000 sqm', description: 'Monumental 10-hectare area strategically located between Tatajuba and Guriú. Direct beachfront access.', image: '/GURIU/VS--TATAJUBAfromTerraVentosonVimeo-0%E2%80%9920%E2%80%9D.jpg' },
      { slug: 'terreno-exclusivo-tatajuba-1000m', title: 'Exclusive Land in Tatajuba — 1,000 sqm', description: 'Discover the jewel of Tatajuba: A 1,000 sqm lot in the heart of the village, the world\'s newest kitesurf destination.', image: '/TATAJUBA/WhatsApp%20Image%202026-04-23%20at%2018.35.22.jpeg' },
      { slug: 'terreno-exclusivo-prea-200m-mar', title: 'Exclusive Preá Land — 200m from Sea', description: 'Excellent investment opportunity in Preá. 250 sqm lot located just 200 meters from the beach.', image: '/prea%20oportunidade/WhatsApp%20Image%202026-04-21%20at%2009.32.47.jpeg' },
      { slug: 'prea-house', title: 'Preá House | Luxury and Sophistication', description: 'Luxury property with 3 suites, pool, and rooftop terrace. The best of design and beachfront comfort.', image: '/Prea%20House/WhatsApp%20Image%202026-04-20%20at%2009.12.53.jpeg' },
      { slug: 'villa-prabhu', title: 'Villa Prabhu — Paracuru, Brazil', description: 'Exclusive gated community with private lagoon and full leisure, 100m from the beach.', image: '/VILLA_PRABHU/WhatsApp%20Image%202026-04-01%20at%2014.58.56%20(3).jpeg' },
      { slug: 'villa-condudu-3', title: 'High-End 3-Suite House — Beachfront Preá', description: 'Vila Conduru III: Rustic luxury by the sea with 3 large suites and private pool.', image: '/VillaCondutuPaginaInicial/FINAL%2014.png' },
      { slug: 'terrenos-bitupita', title: 'Beachfront Land in Bitupitá', description: 'The next appreciation frontier in Ceará. Exclusive lots in an untouched fishing village.', image: '/bitupitaPaginaIndividual/DJI_20251020023318_0221_D.jpg' },
      { slug: 'vila-do-ingles', title: 'Vila do Inglês | Sustainable Luxury in Preá', description: 'Modern 200 sqm residence powered by solar energy in a premium location.', image: '/viladoinglesPaginaInicial/Final%2004%20(1).png' },
      { slug: 'casa-matanzas', title: 'Casa Matanzas | Sea and Forest View (Chile)', description: 'Discover Matanzas Paradise: Modern house with spectacular panoramic views and private hot tub.', image: '/Matanzas/3b77d98c-5cd0-4f51-816a-6e42748720d2.avif' },
      { slug: 'lote-109-taiba', title: 'LOTE 109 — TAIBA', description: 'Terreno de 560 m² em localização estratégica, totalmente murado e pronto para construir.', image: '/og-propriedades.png' },
      { slug: 'lote-barramar-lagoa-taiba', title: 'LOTE BARRAMAR LAGOA — TAIBA', description: 'Terreno de 800 m² no Loteamento Barramar em Taiba, a apenas 300 metros da Lagoa.', image: '/og-propriedades.png' },
      { slug: 'terreno-acarau-castelhano-simi', title: 'TERRENO ACARAÚ — CASTELHANO', description: 'Terreno de 1.680 m² limpo, pé no chão e pronto para construir.', image: '/Terreno para Venda, Acaraú _ CE/202605191306364488.jpeg' },
      { slug: 'terreno-vila-prea-215m-simi', title: 'TERRENO VILA PREÁ — 215,80 m²', description: 'Terreno de 215,80 m² localizado na Vila Preá com dimensões perfeitas para construção.', image: '/Terreno para Venda, bairro Barrinha, área total 2.760,00 m/202606261217521256.jpeg' },
      { slug: 'terreno-barrinha-2760m-simi', title: 'TERRENO BARRINHA — 2.760,00 m²', description: 'Terreno Exclusivo de 2.760,00 m² à venda na Praia da Barrinha, região de alta valorização.', image: '/Terreno para Venda, bairro Barrinha, área total 2.760,00 m²/1.jpg' },
      { slug: 'terreno-praia-do-prea-1273m-simi', title: 'TERRENO PRAIA DO PREÁ — 1.273,00 m²', description: 'Terreno de 1.273,00 m² na Praia do Preá com 12,35 metros de frente.', image: '/Terreno para Venda, bairro Praia Do Preá/202606051159349483.jpg' },
      { slug: 'terreno-praia-do-prea-523m-simi', title: 'TERRENO PRAIA DO PREÁ — 523,00 m²', description: 'Terreno com 523,00 m² de área total, localizado na Praia do Preá.', image: '/Terreno para Venda, bairro Praia Do Preá, área total 523,00 m²/1.jpeg' },
      { slug: 'terreno-praia-do-prea-600m-simi', title: 'TERRENO PRAIA DO PREÁ — 600,00 m²', description: 'Oportunidade de terreno de 600,00 m² na Praia do Preá.', image: '/Terreno para Venda, bairro Praia Do Preá, área total 600,00 m²/202606241105101964.jpeg' },
      { slug: 'terreno-cruz-cavalo-bravo-simi', title: 'TERRENO CRUZ — CAVALO BRAVO PREÁ', description: 'Terreno de 231,00 m² (11x21m) no bairro Cavalo Bravo em Cruz.', image: '/Terreno para Venda, Cruz _ CE, bairro Cavalo Bravo Preá/1.jpeg' },
      { slug: 'terreno-prea-esquina-praca-nova-simi', title: 'TERRENO DE ESQUINA PRAIA DO PREÁ', description: 'Terreno de esquina com 1.350 m² (27x50m), a apenas 350m da praia e próximo à Praça Nova no Preá.', image: '/terreno-prea-esquina/1.png' },


    ]
  },
  es: {
    code: 'es_ES',
    homeTitle: 'Terra Ventos | Inmuebles de Lujo e Inversiones en Ceará',
    homeDesc: 'Curaduría exclusiva de propiedades de alto nivel y oportunidades de inversión en la costa de Ceará (Preá, Tatajuba, Bitupitá).',
    properties: [
      { slug: 'terreno-praia-do-farol', title: 'Terreno Praia do Farol', description: 'Terreno frente a la laguna, ubicado en una de las áreas de mayor valorización de la costa de Ceará. A solo 2 minutos de la playa.', image: '/PradoFarol/WhatsApp%20Image%202026-06-23%20at%2007.58.08.jpeg' },
      { slug: 'terreno-barrinha-1753m', title: 'Terreno Barrinha Frente al Mar', description: 'Rara oportunidad de inversión en la deseada región de Barrinha, muy cerca de Preá. Área de 1.753 m² frente al mar con documentación 100% legalizada.', image: '/barrinhaNova/barrinha-1.jpeg' },
      /* { slug: 'lotes-exclusivos-taiba', title: 'Lotes Exclusivos Taíba', description: 'Área de 2.800m² subdividida en 5 lotes de 540m². A una cuadra de la playa, cerca de Villa Marola.', image: '/taiba/taiba-lotes-1.jpg' },
 */
      { slug: 'terreno-serrote-jericoacoara', title: 'Terreno Serrote Jericoacoara', description: 'Lote de 200m² con 7 metros de frente por la Rua do Forró, con acceso a Serrote.', image: '/jericoacara/terreno-serrote.jpeg' },
      { slug: 'casa-alto-padrao-praia-barrinha', title: 'Casa de Alta Gama en Praia da Barrinha | Acaraú - CE', description: 'Quédate maravillado con esta casa increíble a 400 metros de la playa de Barrinha. 4 suites, 5 baños, piscina, espacio gourmet y jardín con palmeras. R$ 6.600.000.', image: '/og-barrinha.jpg' },
      { slug: 'area-exclusiva-tatajuba-guriu-100000m', title: 'Área Exclusiva Frente al Mar — 100.000 m²', description: 'Área monumental de 10 hectáreas ubicada estratégicamente entre Tatajuba y Guriú. Acceso directo a la playa.', image: '/GURIU/VS--TATAJUBAfromTerraVentosonVimeo-0%E2%80%9920%E2%80%9D.jpg' },
      { slug: 'terreno-exclusivo-tatajuba-1000m', title: 'Terreno Exclusivo en Tatajuba — 1.000 m²', description: 'Descubra la joya de Tatajuba: Un terreno de 1.000 m² en el corazón del pueblo, el nuevo deseo del kitesurf mundial.', image: '/TATAJUBA/WhatsApp%20Image%202026-04-23%20at%2018.35.22.jpeg' },
      { slug: 'terreno-exclusivo-prea-200m-mar', title: 'Terreno Exclusivo Preá — 200m del Mar', description: 'Excelente oportunidad de inversión en Preá. Terreno de 250 m² ubicado a solo 200 metros de la playa.', image: '/prea%20oportunidade/WhatsApp%20Image%202026-04-21%20at%2009.32.47.jpeg' },
      { slug: 'prea-house', title: 'Preá House | Lujo y Sofisticación en Preá', description: 'Propiedad de lujo con 3 suites, piscina y terraza en la azotea. Lo mejor del diseño y confort frente al mar.', image: '/Prea%20House/WhatsApp%20Image%202026-04-20%20at%2009.12.53.jpeg' },
      { slug: 'villa-prabhu', title: 'Villa Prabhu — Paracuru, Ceará', description: 'Loteamiento exclusivo con laguna privada y ocio completo a 100m de la playa en Paracuru.', image: '/VILLA_PRABHU/WhatsApp%20Image%202026-04-01%20at%2014.58.56%20(3).jpeg' },
      { slug: 'villa-condudu-3', title: 'Casa de Alto Nivel 3 Suites — Frente Mar Preá', description: 'Vila Conduru III: Lujo rústico frente al mar con 3 amplias suites y piscina privada.', image: '/VillaCondutuPaginaInicial/FINAL%2014.png' },
      { slug: 'terrenos-bitupita', title: 'Terrenos Frente al Mar en Bitupitá', description: 'La próxima frontera de valorización en Ceará. Lotes exclusivos en un pueblo de pescadores virgen.', image: '/bitupitaPaginaIndividual/DJI_20251020023318_0221_D.jpg' },
      { slug: 'vila-do-ingles', title: 'Vila do Inglês | Lujo Sostenible en Preá', description: 'Residencia moderna de 200 m² alimentada por energía solar en ubicación premium.', image: '/viladoinglesPaginaInicial/Final%2004%20(1).png' },
      { slug: 'casa-matanzas', title: 'Casa Matanzas | Vista Mar y Bosque (Chile)', description: 'Descubra Matanzas Paradise: Casa moderna con espectaculares vistas panorámicas y tinaja privada.', image: '/Matanzas/3b77d98c-5cd0-4f51-816a-6e42748720d2.avif' },
      { slug: 'lote-109-taiba', title: 'LOTE 109 — TAIBA', description: 'Terreno de 560 m² em localização estratégica, totalmente murado e pronto para construir.', image: '/og-propriedades.png' },
      { slug: 'lote-barramar-lagoa-taiba', title: 'LOTE BARRAMAR LAGOA — TAIBA', description: 'Terreno de 800 m² no Loteamento Barramar em Taiba, a apenas 300 metros da Lagoa.', image: '/og-propriedades.png' },
      { slug: 'terreno-acarau-castelhano-simi', title: 'TERRENO ACARAÚ — CASTELHANO', description: 'Terreno de 1.680 m² limpo, pé no chão e pronto para construir.', image: '/Terreno para Venda, Acaraú _ CE/202605191306364488.jpeg' },
      { slug: 'terreno-vila-prea-215m-simi', title: 'TERRENO VILA PREÁ — 215,80 m²', description: 'Terreno de 215,80 m² localizado na Vila Preá com dimensões perfeitas para construção.', image: '/Terreno para Venda, bairro Barrinha, área total 2.760,00 m/202606261217521256.jpeg' },
      { slug: 'terreno-barrinha-2760m-simi', title: 'TERRENO BARRINHA — 2.760,00 m²', description: 'Terreno Exclusivo de 2.760,00 m² à venda na Praia da Barrinha, região de alta valorização.', image: '/Terreno para Venda, bairro Barrinha, área total 2.760,00 m²/1.jpg' },
      { slug: 'terreno-praia-do-prea-1273m-simi', title: 'TERRENO PRAIA DO PREÁ — 1.273,00 m²', description: 'Terreno de 1.273,00 m² na Praia do Preá com 12,35 metros de frente.', image: '/Terreno para Venda, bairro Praia Do Preá/202606051159349483.jpg' },
      { slug: 'terreno-praia-do-prea-523m-simi', title: 'TERRENO PRAIA DO PREÁ — 523,00 m²', description: 'Terreno com 523,00 m² de área total, localizado na Praia do Preá.', image: '/Terreno para Venda, bairro Praia Do Preá, área total 523,00 m²/1.jpeg' },
      { slug: 'terreno-praia-do-prea-600m-simi', title: 'TERRENO PRAIA DO PREÁ — 600,00 m²', description: 'Oportunidade de terreno de 600,00 m² na Praia do Preá.', image: '/Terreno para Venda, bairro Praia Do Preá, área total 600,00 m²/202606241105101964.jpeg' },
      { slug: 'terreno-cruz-cavalo-bravo-simi', title: 'TERRENO CRUZ — CAVALO BRAVO PREÁ', description: 'Terreno de 231,00 m² (11x21m) no bairro Cavalo Bravo em Cruz.', image: '/Terreno para Venda, Cruz _ CE, bairro Cavalo Bravo Preá/1.jpeg' },
      { slug: 'terreno-prea-esquina-praca-nova-simi', title: 'TERRENO DE ESQUINA PRAIA DO PREÁ', description: 'Terreno de esquina com 1.350 m² (27x50m), a apenas 350m da praia e próximo à Praça Nova no Preá.', image: '/terreno-prea-esquina/1.png' },


    ]
  }
};

const distPath = path.resolve(__dirname, 'dist');
const templatePath = path.resolve(distPath, 'index.html');

if (!fs.existsSync(templatePath)) {
  console.error('ERRO: dist/index.html não encontrado. Execute "npm run build" primeiro.');
  process.exit(1);
}

const template = fs.readFileSync(templatePath, 'utf8');

function generatePage(targetPath, title, desc, img, url, langCode, langId, imgAlt = null) {
  let html = template;
  const fullImageUrl = img.startsWith('http') ? img : `${baseUrl}${img}`;
  const displayTitle = title.includes('Terra Ventos') ? title : `${title} | Terra Ventos`;
  const imageAltText = imgAlt || displayTitle;

  // Basico
  html = html.replace(/<html lang=".*?"/g, `<html lang="${langId}" prefix="og: http://ogp.me/ns#"`);
  html = html.replace(/<title>.*?<\/title>/g, `<title>${displayTitle}</title>`);
  html = html.replace(/<meta name="description" content=".*?" ?\/?>/g, `<meta name="description" content="${desc}" />`);
  
  // Open Graph
  html = html.replace(/<meta property="og:title" content=".*?" ?\/?>/g, `<meta property="og:title" content="${displayTitle}" />`);
  html = html.replace(/<meta property="og:description" content=".*?" ?\/?>/g, `<meta property="og:description" content="${desc}" />`);
  html = html.replace(/<meta property="og:image" content=".*?" ?\/?>/g, `<meta property="og:image" content="${fullImageUrl}" />`);
  html = html.replace(/<meta property="og:url" content=".*?" ?\/?>/g, `<meta property="og:url" content="${url}" />`);
  html = html.replace(/<meta property="og:site_name" content=".*?" ?\/?>/g, `<meta property="og:site_name" content="Terra Ventos" />`);
  html = html.replace(/<meta property="og:locale" content=".*?" ?\/?>/g, `<meta property="og:locale" content="${langCode}" />`);

  // Twitter
  html = html.replace(/<meta name="twitter:title" content=".*?" ?\/?>/g, `<meta name="twitter:title" content="${displayTitle}" />`);
  html = html.replace(/<meta name="twitter:description" content=".*?" ?\/?>/g, `<meta name="twitter:description" content="${desc}" />`);
  html = html.replace(/<meta name="twitter:image" content=".*?" ?\/?>/g, `<meta name="twitter:image" content="${fullImageUrl}" />`);
  html = html.replace(/<meta name="twitter:url" content=".*?" ?\/?>/g, `<meta name="twitter:url" content="${url}" />`);

  // OG image dimensions + alt (melhora preview no LinkedIn, WhatsApp, Instagram)
  html = html.replace(/<meta property="og:image:width" content=".*?">/g, '<meta property="og:image:width" content="1200">');
  html = html.replace(/<meta property="og:image:height" content=".*?">/g, '<meta property="og:image:height" content="630">');
  // Inject og:image:alt if not already present
  if (!html.includes('og:image:alt')) {
    html = html.replace('</head>', `<meta property="og:image:alt" content="${imageAltText}" />\n</head>`);
  } else {
    html = html.replace(/<meta property="og:image:alt" content=".*?" ?\/?>/g, `<meta property="og:image:alt" content="${imageAltText}" />`);
  }

  // Injetar script para forçar o idioma no React (através do localStorage)
  const langScript = `<script>localStorage.setItem('i18nextLng', '${langId}');</script>`;
  html = html.replace('</head>', `${langScript}\n</head>`);

  const dir = path.dirname(targetPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  // Injetar H1 e conteúdo básico no root para crawlers que não executam JS
  const staticContent = `
    <div id="root">
      <header>
        <img src="${baseUrl}/logo.avif" alt="Terra Ventos" />
        <nav>
          <a href="${baseUrl}/">Início</a>
          <a href="${baseUrl}/propriedades">Oportunidades</a>
        </nav>
      </header>
      <main>
        <h1>${displayTitle}</h1>
        <p>${desc}</p>
        <img src="${fullImageUrl}" alt="${displayTitle}" />
        
        <section>
          <h2>Sobre a Terra Ventos</h2>
          <p>A Terra Ventos é especialista em curadoria de imóveis de luxo e investimentos exclusivos no litoral do Ceará. Com foco em destinos de alto padrão como Preá, Tatajuba e Bitupitá, oferecemos oportunidades únicas para quem busca sofisticação, conforto e rentabilidade no paraíso do kitesurf.</p>
          <p>Nossa assessoria completa garante segurança jurídica e as melhores taxas de valorização para investidores nacionais e internacionais. Explore nossas casas de design, terrenos pé na areia e projetos exclusivos integrados à natureza.</p>
        </section>

        <section>
          <h2>Destinos em Destaque</h2>
          <ul>
            <li><strong>Preá:</strong> O epicentro do luxo rústico e do kitesurf mundial.</li>
            <li><strong>Tatajuba:</strong> Beleza intocada e valorização acelerada.</li>
            <li><strong>Bitupitá:</strong> A nova fronteira do investimento pé na areia.</li>
          </ul>
        </section>
      </main>
      <footer>
        <p>Terra Ventos | Imóveis de Luxo no Ceará</p>
        <p>Contatos: +55 (85) 9 8557-2807 | info@terraventos.com.br</p>
        <p>Endereço: Rua Monsenhor Bruno, nº 1153, sala 608, Aldeota, Fortaleza - CE</p>
      </footer>
    </div>
  `;
  
  html = html.replace('<div id="root"></div>', staticContent);

  fs.writeFileSync(targetPath, html);
}

const instPages = [
  {
    slug: 'quem-somos',
    titles: {
      pt: 'Quem Somos | Terra Ventos',
      en: 'About Us | Terra Ventos',
      es: 'Quiénes Somos | Terra Ventos'
    },
    descriptions: {
      pt: 'Curadoria de imóveis de luxo e investimentos estratégicos no litoral do Ceará.',
      en: 'Curating luxury properties and strategic investments on the Ceará coast.',
      es: 'Curaduría de propiedades de lujo e inversiones estratégicas en la costa de Ceará.'
    }
  },
  {
    slug: 'termos-e-condicoes',
    titles: {
      pt: 'Termos e Condições | Terra Ventos',
      en: 'Terms & Conditions | Terra Ventos',
      es: 'Términos y Condiciones | Terra Ventos'
    },
    descriptions: {
      pt: 'Regras e diretrizes para navegação e serviços da Terra Ventos.',
      en: 'Rules and guidelines for browsing and using Terra Ventos services.',
      es: 'Reglas y directrices para la navegación y servicios de Terra Ventos.'
    }
  },
  {
    slug: 'politica-de-privacidade',
    titles: {
      pt: 'Política de Privacidade | Terra Ventos',
      en: 'Privacy Policy | Terra Ventos',
      es: 'Política de Privacidad | Terra Ventos'
    },
    descriptions: {
      pt: 'Como protegemos e respeitamos os seus dados pessoais.',
      en: 'How we protect and respect your personal data.',
      es: 'Cómo protegemos y respetamos sus datos personales.'
    }
  },
  {
    slug: 'contato',
    titles: {
      pt: 'Contato | Terra Ventos',
      en: 'Contact Us | Terra Ventos',
      es: 'Contacto | Terra Ventos'
    },
    descriptions: {
      pt: 'Canais oficiais de atendimento da Terra Ventos. CNPJ 60.726.249/0001-00.',
      en: 'Official service channels for Terra Ventos. CNPJ 60.726.249/0001-00.',
      es: 'Canales oficiales de atención de Terra Ventos. CNPJ 60.726.249/0001-00.'
    }
  }
];

// Gerar Sitemap.xml
let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">`;

Object.entries(locales).forEach(([langId, data]) => {
  const langPrefix = langId === 'pt' ? '' : `/${langId}`;
  
  // Home Page
  const homePath = langId === 'pt' ? templatePath : path.resolve(distPath, langId, 'index.html');
  generatePage(homePath, data.homeTitle, data.homeDesc, '/banners/2.png', `${baseUrl}${langPrefix}/`, data.code, langId);
  console.log(`Página Home gerada para: ${langId}`);

  sitemap += `
  <url>
    <loc>${baseUrl}${langPrefix}/</loc>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="pt" href="${baseUrl}/"/>
    <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/en/"/>
    <xhtml:link rel="alternate" hreflang="es" href="${baseUrl}/es/"/>
  </url>`;

  // Listagem de Propriedades (Oportunidades)
  const listPath = path.resolve(distPath, langId === 'pt' ? '' : langId, 'propriedades', 'index.html');
  const listTitle = langId === 'pt'
    ? 'Imóveis de Luxo no Ceará — Todas as Propriedades | Terra Ventos'
    : langId === 'en'
      ? 'Luxury Real Estate in Ceará — All Properties | Terra Ventos'
      : 'Inmuebles de Lujo en Ceará — Todas las Propiedades | Terra Ventos';
  const listDesc = langId === 'pt'
    ? 'Explore 9+ imóveis exclusivos à beira-mar no litoral do Ceará. Terrenos, casas e projetos de alto padrão em Preá, Tatajuba e Bitupitá. Curadoria Terra Ventos.'
    : langId === 'en'
      ? 'Browse 9+ exclusive beachfront properties on the Ceará coast. High-end land, houses, and projects in Preá, Tatajuba and Bitupitá. Terra Ventos curation.'
      : 'Explora 9+ propiedades exclusivas frente al mar en la costa de Ceará. Terrenos, casas y proyectos de alto nivel en Preá, Tatajuba y Bitupitá.';
  const listImgAlt = langId === 'pt'
    ? 'Imóveis de Luxo no Ceará — Terra Ventos'
    : langId === 'en'
      ? 'Luxury Real Estate in Ceará — Terra Ventos'
      : 'Inmuebles de Lujo en Ceará — Terra Ventos';
  generatePage(listPath, listTitle, listDesc, '/og-propriedades.png', `${baseUrl}${langPrefix}/propriedades`, data.code, langId, listImgAlt);
  console.log(`Página Listagem Propriedades gerada para: ${langId}`);

  sitemap += `
  <url>
    <loc>${baseUrl}${langPrefix}/propriedades</loc>
    <priority>0.9</priority>
    <xhtml:link rel="alternate" hreflang="pt" href="${baseUrl}/propriedades"/>
    <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/en/propriedades"/>
    <xhtml:link rel="alternate" hreflang="es" href="${baseUrl}/es/propriedades"/>
  </url>`;

  // Institucionais
  instPages.forEach(p => {
    const instPath = path.resolve(distPath, langId === 'pt' ? '' : langId, p.slug, 'index.html');
    const title = p.titles[langId];
    const desc = p.descriptions[langId];
    generatePage(instPath, title, desc, '/og-propriedades.png', `${baseUrl}${langPrefix}/${p.slug}`, data.code, langId);
    console.log(`Página Institucional gerada: ${langId} - ${p.slug}`);

    sitemap += `
  <url>
    <loc>${baseUrl}${langPrefix}/${p.slug}</loc>
    <priority>0.7</priority>
    <xhtml:link rel="alternate" hreflang="pt" href="${baseUrl}/${p.slug}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/en/${p.slug}"/>
    <xhtml:link rel="alternate" hreflang="es" href="${baseUrl}/es/${p.slug}"/>
  </url>`;
  });

  // Propriedades
  data.properties.forEach(prop => {
    const propPath = path.resolve(distPath, langId === 'pt' ? '' : langId, 'propriedade', prop.slug, 'index.html');
    generatePage(propPath, prop.title, prop.description, prop.image, `${baseUrl}${langPrefix}/propriedade/${prop.slug}`, data.code, langId);
    console.log(`Página Propriedade gerada: ${langId} - ${prop.slug}`);

    sitemap += `
  <url>
    <loc>${baseUrl}${langPrefix}/propriedade/${prop.slug}</loc>
    <priority>0.8</priority>
    <xhtml:link rel="alternate" hreflang="pt" href="${baseUrl}/propriedade/${prop.slug}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/en/propriedade/${prop.slug}"/>
    <xhtml:link rel="alternate" hreflang="es" href="${baseUrl}/es/propriedade/${prop.slug}"/>
  </url>`;
  });
});

sitemap += `\n</urlset>`;
fs.writeFileSync(path.resolve(distPath, 'sitemap.xml'), sitemap);
console.log('Sitemap.xml gerado com sucesso.');

console.log('Finalizado: Todas as páginas individuais e localizadas foram criadas.');
