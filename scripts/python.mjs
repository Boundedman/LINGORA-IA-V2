import {spawn} from 'node:child_process';
import {existsSync} from 'node:fs';
const python=process.platform==='win32'?'.venv/Scripts/python.exe':'.venv/bin/python';
if(!existsSync(python)){console.error('Crea el entorno Python siguiendo docs/SETUP_GUIDE.md.');process.exit(1);}
const child=spawn(python,process.argv.slice(2),{stdio:'inherit'});
child.on('error',error=>{console.error(error.message);process.exit(1);});
child.on('exit',code=>process.exit(code??1));
process.on('SIGINT',()=>child.kill('SIGINT'));
process.on('SIGTERM',()=>child.kill('SIGTERM'));
