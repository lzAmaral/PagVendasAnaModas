const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Ler o .env.local
const envPath = path.resolve(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const cleanLine = line.trim();
  if (!cleanLine || cleanLine.startsWith('#')) return;
  const parts = cleanLine.split('=');
  if (parts.length >= 2) {
    const key = parts[0].trim();
    const val = parts.slice(1).join('=').trim();
    env[key] = val;
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false }
});

async function run() {
  console.log('🔄 Atualizando fotos dos produtos no Supabase...');

  // Renomear "image (2).png" para "camiseta-manga-curta.png" se existir
  const oldPath = path.join(__dirname, '../public/produtos/image (2).png');
  const newPath = path.join(__dirname, '../public/produtos/camiseta-manga-curta.png');
  if (fs.existsSync(oldPath)) {
    fs.renameSync(oldPath, newPath);
    console.log('✅ Renomeado: "image (2).png" -> "camiseta-manga-curta.png"');
  }

  // Obter todos os produtos
  const { data: produtos, error } = await supabase.from('produtos').select('*');
  
  if (error) {
    console.error('Erro ao buscar produtos:', error);
    process.exit(1);
  }

  for (const produto of produtos) {
    let foto = '';
    const nome = produto.nome.toLowerCase();

    if (nome.includes('camiseta manga curta')) {
      foto = '/produtos/camiseta-manga-curta.png';
    } else if (nome.includes('regata')) {
      foto = '/produtos/regata.png';
    } else if (nome.includes('camiseta manga longa')) {
      foto = '/produtos/camiseta-manga-longa.png';
    } else if (nome.includes('bermuda masculina')) {
      foto = '/produtos/bermuda-masculina.png';
    } else if (nome.includes('calça masculina helanca')) {
      // Como não temos calca-helanca.png, usamos calca-flanelada.png como fallback
      foto = fs.existsSync(path.join(__dirname, '../public/produtos/calca-helanca.png')) 
        ? '/produtos/calca-helanca.png' 
        : '/produtos/calca-flanelada.png';
    } else if (nome.includes('calça masculina flanelada')) {
      foto = '/produtos/calca-flanelada.png';
    } else if (nome.includes('legging')) {
      foto = '/produtos/legging.png';
    } else if (nome.includes('shorts saia')) {
      foto = '/produtos/shorts-saia.png';
    } else if (nome.includes('shorts ciclista')) {
      foto = '/produtos/shorts-ciclista.png';
    } else if (nome.includes('blusa fechada helanca')) {
      // Como não temos blusa-helanca.png, usamos blusa-moletom.png como fallback
      foto = fs.existsSync(path.join(__dirname, '../public/produtos/blusa-helanca.png')) 
        ? '/produtos/blusa-helanca.png' 
        : '/produtos/blusa-moletom.png';
    } else if (nome.includes('blusa fechada moletom')) {
      foto = '/produtos/blusa-moletom.png';
    } else if (nome.includes('jaqueta')) {
      foto = '/produtos/jaqueta.png';
    }

    if (foto) {
      const { error: updateError } = await supabase
        .from('produtos')
        .update({ foto_url: foto })
        .eq('id', produto.id);

      if (updateError) {
        console.error(`❌ Erro ao atualizar foto do produto ${produto.nome}:`, updateError);
      } else {
        console.log(`✅ Foto vinculada para: "${produto.nome}" -> ${foto}`);
      }
    }
  }

  console.log('🎉 Todas as fotos foram mapeadas com sucesso!');
}

run();
