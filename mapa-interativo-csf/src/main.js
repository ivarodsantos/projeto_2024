import { initMap } from './mapInitialization.js';
import { addAssentamentosPrecariosLayer } from './layers/assentamentosPrecariosLayer.js';
import { addCozinhasFortalezaLayer } from './layers/cozinhasFortalezaLayer.js';
import { addPopulationLayer } from './layers/densidadePopFortalezaLayer.js';
import { addEscolasEstaduaisLayer } from './layers/escolasEstaduais.js';
import { addCrasCearaLayer } from './layers/cras_ceara.js';
import { addCreasCearaLayer } from './layers/creas_ce.js';
import { addEscolasProfissionaisLayer } from './layers/escolasProfissionais.js';
import { addLotesInteriorLayer } from './layers/lotes_interior.js';
import { addEquipSPSLayer } from './layers/equipamentos_sps.js';
// Importe outras camadas conforme necessário


async function main() {
  const map = initMap();
  await addAssentamentosPrecariosLayer(map);
  await addCozinhasFortalezaLayer(map);
  await addPopulationLayer(map);
  await addEscolasEstaduaisLayer(map);
  await addCrasCearaLayer(map);
  await addCreasCearaLayer(map);
  await addEscolasProfissionaisLayer(map);
  await addLotesInteriorLayer(map);
  await addEquipSPSLayer(map);
  // Adicione outras camadas de forma semelhante
}

window.onload = main;
