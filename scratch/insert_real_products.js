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

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Chaves de ambiente faltando no .env.local!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false }
});

const produtos = [
  // 1. Camiseta manga curta
  { nome: 'Camiseta Manga Curta (4 ao 8)', preco: 22.00, categoria: 'sesi', tamanhos: ['4', '6', '8'] },
  { nome: 'Camiseta Manga Curta (10 ao 12)', preco: 24.00, categoria: 'sesi', tamanhos: ['10', '12'] },
  { nome: 'Camiseta Manga Curta (14 ao 16)', preco: 26.00, categoria: 'sesi', tamanhos: ['14', '16'] },
  { nome: 'Camiseta Manga Curta (Adulto P ao GG)', preco: 30.00, categoria: 'sesi', tamanhos: ['P', 'M', 'G', 'GG'] },

  // 2. Regata
  { nome: 'Regata (4 ao 8)', preco: 20.00, categoria: 'sesi', tamanhos: ['4', '6', '8'] },
  { nome: 'Regata (10 ao 12)', preco: 22.00, categoria: 'sesi', tamanhos: ['10', '12'] },
  { nome: 'Regata (14 ao 16)', preco: 24.00, categoria: 'sesi', tamanhos: ['14', '16'] },
  { nome: 'Regata (Adulto P ao GG)', preco: 28.00, categoria: 'sesi', tamanhos: ['P', 'M', 'G', 'GG'] },

  // 3. Camiseta Manga Longa
  { nome: 'Camiseta Manga Longa (4 ao 8)', preco: 25.00, categoria: 'sesi', tamanhos: ['4', '6', '8'] },
  { nome: 'Camiseta Manga Longa (10 ao 12)', preco: 27.00, categoria: 'sesi', tamanhos: ['10', '12'] },
  { nome: 'Camiseta Manga Longa (14 ao 16)', preco: 30.00, categoria: 'sesi', tamanhos: ['14', '16'] },
  { nome: 'Camiseta Manga Longa (Adulto P ao GG)', preco: 35.00, categoria: 'sesi', tamanhos: ['P', 'M', 'G', 'GG'] },

  // 4. Bermuda Masculina
  { nome: 'Bermuda Masculina (4 ao 8)', preco: 32.00, categoria: 'sesi', tamanhos: ['4', '6', '8'] },
  { nome: 'Bermuda Masculina (10 ao 12)', preco: 36.00, categoria: 'sesi', tamanhos: ['10', '12'] },
  { nome: 'Bermuda Masculina (14 ao 16)', preco: 40.00, categoria: 'sesi', tamanhos: ['14', '16'] },
  { nome: 'Bermuda Masculina (Adulto P ao G)', preco: 48.00, categoria: 'sesi', tamanhos: ['P', 'M', 'G'] },
  { nome: 'Bermuda Masculina (Adulto GG)', preco: 52.00, categoria: 'sesi', tamanhos: ['GG'] },

  // 5. Calça Masculina (Helanca)
  { nome: 'Calça Masculina Helanca (4 ao 8)', preco: 45.00, categoria: 'sesi', tamanhos: ['4', '6', '8'] },
  { nome: 'Calça Masculina Helanca (10 ao 12)', preco: 48.00, categoria: 'sesi', tamanhos: ['10', '12'] },
  { nome: 'Calça Masculina Helanca (14 ao 16)', preco: 50.00, categoria: 'sesi', tamanhos: ['14', '16'] },
  { nome: 'Calça Masculina Helanca (Adulto P ao G)', preco: 55.00, categoria: 'sesi', tamanhos: ['P', 'M', 'G'] },
  { nome: 'Calça Masculina Helanca (Adulto GG)', preco: 60.00, categoria: 'sesi', tamanhos: ['GG'] },

  // 6. Calça Masculina (Flanelada)
  { nome: 'Calça Masculina Flanelada (4 ao 8)', preco: 50.00, categoria: 'sesi', tamanhos: ['4', '6', '8'] },
  { nome: 'Calça Masculina Flanelada (10 ao 12)', preco: 53.00, categoria: 'sesi', tamanhos: ['10', '12'] },
  { nome: 'Calça Masculina Flanelada (14 ao 16)', preco: 55.00, categoria: 'sesi', tamanhos: ['14', '16'] },
  { nome: 'Calça Masculina Flanelada (Adulto P ao G)', preco: 65.00, categoria: 'sesi', tamanhos: ['P', 'M', 'G'] },
  { nome: 'Calça Masculina Flanelada (Adulto GG)', preco: 70.00, categoria: 'sesi', tamanhos: ['GG'] },

  // 7. Legging
  { nome: 'Legging (4 ao 8)', preco: 45.00, categoria: 'sesi', tamanhos: ['4', '6', '8'] },
  { nome: 'Legging (10 ao 12)', preco: 48.00, categoria: 'sesi', tamanhos: ['10', '12'] },
  { nome: 'Legging (14 ao 16)', preco: 50.00, categoria: 'sesi', tamanhos: ['14', '16'] },
  { nome: 'Legging (Adulto P ao G)', preco: 55.00, categoria: 'sesi', tamanhos: ['P', 'M', 'G'] },
  { nome: 'Legging (Adulto GG)', preco: 60.00, categoria: 'sesi', tamanhos: ['GG'] },

  // 8. Shorts Saia
  { nome: 'Shorts Saia (4 ao 8)', preco: 32.00, categoria: 'sesi', tamanhos: ['4', '6', '8'] },
  { nome: 'Shorts Saia (10 ao 12)', preco: 36.00, categoria: 'sesi', tamanhos: ['10', '12'] },
  { nome: 'Shorts Saia (14 ao 16)', preco: 40.00, categoria: 'sesi', tamanhos: ['14', '16'] },
  { nome: 'Shorts Saia (Adulto P ao G)', preco: 48.00, categoria: 'sesi', tamanhos: ['P', 'M', 'G'] },
  { nome: 'Shorts Saia (Adulto GG)', preco: 50.00, categoria: 'sesi', tamanhos: ['GG'] },

  // 9. Shorts Ciclista
  { nome: 'Shorts Ciclista (4 ao 8)', preco: 32.00, categoria: 'sesi', tamanhos: ['4', '6', '8'] },
  { nome: 'Shorts Ciclista (10 ao 12)', preco: 36.00, categoria: 'sesi', tamanhos: ['10', '12'] },
  { nome: 'Shorts Ciclista (14 ao 16)', preco: 40.00, categoria: 'sesi', tamanhos: ['14', '16'] },
  { nome: 'Shorts Ciclista (Adulto P ao G)', preco: 48.00, categoria: 'sesi', tamanhos: ['P', 'M', 'G'] },
  { nome: 'Shorts Ciclista (Adulto GG)', preco: 50.00, categoria: 'sesi', tamanhos: ['GG'] },

  // 10. Blusa Fechada (Helanca)
  { nome: 'Blusa Fechada Helanca (4 ao 8)', preco: 85.00, categoria: 'sesi', tamanhos: ['4', '6', '8'] },
  { nome: 'Blusa Fechada Helanca (10 ao 12)', preco: 90.00, categoria: 'sesi', tamanhos: ['10', '12'] },
  { nome: 'Blusa Fechada Helanca (14 ao 16)', preco: 95.00, categoria: 'sesi', tamanhos: ['14', '16'] },
  { nome: 'Blusa Fechada Helanca (Adulto P ao G)', preco: 100.00, categoria: 'sesi', tamanhos: ['P', 'M', 'G'] },
  { nome: 'Blusa Fechada Helanca (Adulto GG)', preco: 110.00, categoria: 'sesi', tamanhos: ['GG'] },

  // 11. Blusa Fechada (Moletom)
  { nome: 'Blusa Fechada Moletom (4 ao 8)', preco: 90.00, categoria: 'sesi', tamanhos: ['4', '6', '8'] },
  { nome: 'Blusa Fechada Moletom (10 ao 12)', preco: 95.00, categoria: 'sesi', tamanhos: ['10', '12'] },
  { nome: 'Blusa Fechada Moletom (14 ao 16)', preco: 100.00, categoria: 'sesi', tamanhos: ['14', '16'] },
  { nome: 'Blusa Fechada Moletom (Adulto P ao G)', preco: 110.00, categoria: 'sesi', tamanhos: ['P', 'M', 'G'] },
  { nome: 'Blusa Fechada Moletom (Adulto GG)', preco: 120.00, categoria: 'sesi', tamanhos: ['GG'] },

  // 12. Jaqueta
  { nome: 'Jaqueta (4 ao 8)', preco: 85.00, categoria: 'sesi', tamanhos: ['4', '6', '8'] },
  { nome: 'Jaqueta (10 ao 12)', preco: 90.00, categoria: 'sesi', tamanhos: ['10', '12'] },
  { nome: 'Jaqueta (14 ao 16)', preco: 95.00, categoria: 'sesi', tamanhos: ['14', '16'] },
  { nome: 'Jaqueta (Adulto P ao G)', preco: 100.00, categoria: 'sesi', tamanhos: ['P', 'M', 'G'] },
  { nome: 'Jaqueta (Adulto GG)', preco: 120.00, categoria: 'sesi', tamanhos: ['GG'] }
];

async function run() {
  console.log('🧹 Limpando produtos antigos...');
  const { error: deleteErr } = await supabase.from('produtos').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (deleteErr) {
    console.error('Erro ao deletar:', deleteErr);
    process.exit(1);
  }

  console.log('🚀 Cadastrando novos produtos do PDF...');
  
  for (const item of produtos) {
    const { data: pData, error: pErr } = await supabase
      .from('produtos')
      .insert({
        nome: item.nome,
        preco: item.preco,
        categoria: item.categoria,
        ativo: true
      })
      .select()
      .single();

    if (pErr) {
      console.error(`Erro ao inserir ${item.nome}:`, pErr);
      continue;
    }

    console.log(`✅ Produto criado: ${item.nome} (ID: ${pData.id})`);

    const tamanhosObj = item.tamanhos.map(t => ({
      produto_id: pData.id,
      tamanho: t,
      estoque: 20 // estoque padrão para teste
    }));

    const { error: tErr } = await supabase
      .from('tamanhos')
      .insert(tamanhosObj);

    if (tErr) {
      console.error(`Erro ao inserir tamanhos de ${item.nome}:`, tErr);
    } else {
      console.log(`   └─ Tamanhos inseridos: ${item.tamanhos.join(', ')}`);
    }
  }

  console.log('🎉 Todos os produtos foram importados com sucesso!');
}

run();
