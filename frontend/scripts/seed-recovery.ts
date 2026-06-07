import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });

const cdn = 'https://res.cloudinary.com/dt9ad6ovb/image/upload';

const products = [
  {id:2,name:'Vestido Floral Primavera',slug:'vestido-floral-primavera',price:299.99,cat:'mujer',subcat:'Vestidos',sizes:['S','M','L','XL'],feat:true,avail:'available',newArr:true,sale:false,sku:'EB-MUJ-001',brand:12,tags:['nueva colección','primavera','floral'],img:'vestido1.jpg'},
  {id:4,name:'Blusa Elegante Blanca',slug:'blusa-elegante-blanca',price:189.99,oldP:249.99,cat:'mujer',subcat:'Blusas',sizes:['S','M','L','XL'],feat:true,avail:'available',sale:true,sku:'EB-MUJ-002',brand:12,tags:['blusa','elegante','office'],img:'blusa1.jpg'},
  {id:6,name:'Bolso Tote Cuero',slug:'bolso-tote-cuero',price:459.99,cat:'mujer',subcat:'Bolsos',sizes:['Única'],avail:'low_stock',newArr:true,sku:'CO-MUJ-001',brand:2,tags:['cuero','bolso','coach'],img:'bolso1.jpg'},
  {id:8,name:'Sandalias Verano Doradas',slug:'sandalias-verano-doradas',price:179.99,oldP:249.99,cat:'mujer',subcat:'Calzado',sizes:['36','37','38','39'],avail:'available',newArr:true,sale:true,sku:'MK-MUJ-001',brand:4,tags:['sandalias','verano','dorado'],img:'sandalias1.jpg'},
  {id:10,name:'Camisa Manga Larga Beige',slug:'camisa-manga-larga-beige',price:259.99,cat:'hombre',subcat:'Camisas',sizes:['S','M','L','XL','2XL'],feat:true,avail:'available',newArr:true,sku:'RL-HOM-001',brand:10,tags:['camisa','beige','formal'],img:'camisa1.jpg'},
  {id:12,name:'Playera Algodón Premium Negra',slug:'playera-algodon-premium-negra',price:159.99,cat:'hombre',subcat:'Playeras',sizes:['S','M','L','XL','2XL','3XL'],feat:true,avail:'available',newArr:true,sku:'NK-HOM-001',brand:6,tags:['playera','algodón','premium'],img:'playera1.jpg'},
  {id:14,name:'Zapatos Derby Cuero',slug:'zapatos-derby-cuero',price:539.99,cat:'hombre',subcat:'Calzado',sizes:['40','41','42','43'],avail:'out_of_stock',sku:'AD-HOM-001',brand:8,tags:['zapatos','cuero','formal'],img:'zapatos1.jpg'},
  {id:16,name:'Chaqueta Oversize Terracota',slug:'chaqueta-oversize-terracota',price:399.99,cat:'mujer',subcat:'Chaquetas',sizes:['M','L','XL'],feat:true,avail:'available',img:'chaqueta1.jpg'},
  {id:18,name:'Traje de Baño Enterizo',slug:'traje-bano-enterizo',price:259.99,cat:'mujer',subcat:'Trajes de baño',sizes:['S','M','L','XL'],feat:true,avail:'available',img:'718e_Po_GU_Oi_L_AC_SL_1500_029a5da9dc.jpg'},
  {id:20,name:'Blusa Satinada Rosada',slug:'blusa-satinada-rosada',price:209.99,cat:'mujer',subcat:'Blusas',sizes:['XS','S','M','L'],avail:'available',img:'blusa1.jpg'},
  {id:22,name:'Vestido Noche Negro',slug:'vestido-noche-negro',price:499.99,cat:'mujer',subcat:'Vestidos',sizes:['S','M','L'],feat:true,avail:'available',img:'vestido2.jpg'},
  {id:24,name:'Collar Gold Elegance',slug:'collar-gold-elegance',price:149.99,cat:'mujer',subcat:'Accesorios',sizes:['Única'],avail:'available',img:'accesorio1.jpg'},
  {id:26,name:'Pantalón Chino Beige',slug:'pantalon-chino-beige',price:289.99,cat:'hombre',subcat:'Pantalones',sizes:['30','32','34','36'],feat:true,avail:'available',img:'pantalon1.jpg'},
  {id:28,name:'Chaqueta Bomber Olivo',slug:'chaqueta-bomber-olivo',price:449.99,cat:'hombre',subcat:'Chaquetas',sizes:['M','L','XL','2XL'],avail:'available',img:'chaqueta2.jpg'},
  {id:30,name:'Camisa Casual Azul',slug:'camisa-casual-azul',price:229.99,cat:'hombre',subcat:'Camisas',sizes:['S','M','L','XL','2XL'],feat:true,avail:'available',img:'camisa1.jpg'},
  {id:32,name:'Reloj Deportivo Negro',slug:'reloj-deportivo-negro',price:349.99,cat:'hombre',subcat:'Accesorios',sizes:['Única'],avail:'available',img:'accesorio2.jpg'},
  {id:34,name:'Falda Plisada Beige',slug:'falda-plisada-beige',price:219.99,cat:'mujer',subcat:'Faldas',sizes:['XS','S','M','L'],avail:'available',img:'falda1.jpg'},
  {id:36,name:'Pantalón Oxford Negro',slug:'pantalon-oxford-negro',price:249.99,cat:'mujer',subcat:'Pantalones',sizes:['S','M','L','XL','2XL'],feat:true,avail:'available',img:'pantalon2.jpg'},
  {id:42,name:'Test',slug:'test',price:100,cat:'mujer',subcat:'Vestidos',sizes:['M','L'],avail:'available'},
  {id:44,name:'Test2',slug:'test2',price:200,cat:'hombre',subcat:'Camisas',sizes:['M','L'],avail:'available',brand:2},
  {id:47,name:'wombat',slug:'wombat',price:213,cat:'hombre',subcat:'Camisas',desc:'wombat',sizes:['Única'],avail:'available',sku:'131-1',brand:10,colors:['cafe'],tags:['wombat'],img:'Common_wombat_b11c3de653.webp'},
  {id:49,name:'camiseta blanca poison',slug:'camiseta-blanca-poison',price:123,cat:'hombre',subcat:'Playeras',desc:'camiseta blanca poison',sizes:['Única'],avail:'available',sku:'100',brand:2,colors:['blanca'],img:'playera1.jpg'},
];

async function main() {
  for (const b of [
    {id:2,name:'Coach',slug:'coach'},{id:4,name:'Michael Kors',slug:'michael-kors'},
    {id:6,name:'Nike',slug:'nike'},{id:8,name:'Adidas',slug:'adidas'},
    {id:10,name:'Ralph Lauren',slug:'ralph-lauren'},{id:12,name:'EMAS Collection',slug:'emas-collection'},
    {id:14,name:'Jean Paul Gaultier',slug:'jean-paul-gaultier'},
  ]) {
    await pool.query('INSERT INTO brands (id,name,slug,active) VALUES ($1,$2,$3,true) ON CONFLICT (id) DO NOTHING', [b.id,b.name,b.slug]);
  }
  console.log('Brands OK');

  for (const c of [
    {id:1,name:'Mujer',slug:'mujer'},{id:2,name:'Hombre',slug:'hombre'},
  ]) {
    await pool.query('INSERT INTO categories (id,name,slug,active,"order") VALUES ($1,$2,$3,true,$4) ON CONFLICT (id) DO NOTHING', [c.id,c.name,c.slug,c.id]);
  }
  console.log('Categories OK');

  const catMap: Record<string, number> = {mujer:1,hombre:2};
  const subs = [
    {id:1,name:'Vestidos',cat:'mujer',ord:1},{id:2,name:'Blusas',cat:'mujer',ord:2},
    {id:3,name:'Bolsos',cat:'mujer',ord:3},{id:4,name:'Calzado',cat:'mujer',ord:4},
    {id:5,name:'Chaquetas',cat:'mujer',ord:5},{id:6,name:'Trajes de baño',cat:'mujer',ord:6},
    {id:7,name:'Accesorios',cat:'mujer',ord:7},{id:8,name:'Faldas',cat:'mujer',ord:8},
    {id:9,name:'Pantalones',cat:'mujer',ord:9},{id:10,name:'Camisas',cat:'hombre',ord:1},
    {id:11,name:'Playeras',cat:'hombre',ord:2},{id:12,name:'Calzado',cat:'hombre',ord:3},
    {id:13,name:'Pantalones',cat:'hombre',ord:4},{id:14,name:'Chaquetas',cat:'hombre',ord:5},
    {id:15,name:'Accesorios',cat:'hombre',ord:6},
  ];
  for (const s of subs) {
    await pool.query('INSERT INTO subcategories (id,name,slug,category_id,"order",active) VALUES ($1,$2,$3,$4,$5,true) ON CONFLICT (id) DO NOTHING',
      [s.id,s.name,s.name.toLowerCase().replace(/\s+/g,'-'),catMap[s.cat],s.ord]);
  }
  console.log('Subcategories OK');

  const subcatId: Record<string,number> = {};
  for (const s of subs) subcatId[s.name] = s.id;
  const catId: Record<string,number> = {mujer:1,hombre:2};

  for (const p of products) {
    const images = p.img ? [{id:1,url:`${cdn}/${p.img}`,alt:p.name,width:800,height:800}] : [];
    await pool.query(
      `INSERT INTO products (id,name,slug,price,old_price,category,subcategory,category_id,subcategory_id,
        description,sizes,images,featured,brand_id,sku,availability,new_arrival,on_sale,colors,tags,created_at,updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22)
       ON CONFLICT (id) DO NOTHING`,
      [p.id,p.name,p.slug,p.price,p.oldP??null,p.cat,p.subcat,
       catId[p.cat]??null,subcatId[p.subcat]??null,p.desc??'',p.sizes??[],JSON.stringify(images),
       !!p.feat,p.brand??null,p.sku??null,p.avail||'available',!!p.newArr,!!p.sale,
       p.colors??[],p.tags??[],new Date().toISOString(),new Date().toISOString()]
    );
    console.log(`  ${p.name}`);
  }
  console.log('\nDone!');
  await pool.end();
}

main().catch(e => { console.error(e); pool.end(); });
