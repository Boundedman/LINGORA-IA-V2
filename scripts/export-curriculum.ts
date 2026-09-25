import {writeFileSync} from 'node:fs';
import {curriculum} from '../front/src/data/curriculum';
writeFileSync(new URL('../back/curriculum.json',import.meta.url),JSON.stringify(curriculum,null,2)+'\n');
console.log(`Exportadas ${curriculum.length} lecciones para FastAPI.`);
