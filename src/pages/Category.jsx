import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Catalogue from '../components/Catalogue';
import { ProductArt } from '../components/ProductArt';
import { categories, categoryBySlug } from '../data/content';
import { products } from '../data/products';
import NotFound from './NotFound';

export default function Category() {
  const { slug } = useParams();
  const cat = categoryBySlug(slug);
  if (!cat) return <NotFound />;
  const count = products.filter(cat.filter).length;
  const hideCategory = !['new-with-tags', 'under-499'].includes(cat.slug);
  return (
    <div className="pb-10">
      <section className="relative mb-12 overflow-hidden" style={{ background: cat.tone }}>
        <div className="grain absolute inset-0" />
        <div className="container-x relative grid min-h-[340px] items-end gap-6 py-12 md:grid-cols-[1fr_300px]">
          <div>
            <nav aria-label="Breadcrumb" className="mb-6 text-sm text-graphite"><Link to="/shop" className="link-u">Shop</Link> <span aria-hidden="true">/</span> {cat.name}</nav>
            <h1 className="text-mega">{cat.name}</h1>
            <p className="mt-4 max-w-md text-lg text-graphite">{cat.blurb}</p>
            <p className="mt-2 text-sm text-graphite">{count} demo pieces</p>
          </div>
          <motion.div key={slug} initial={{ y: 30, rotate: -8, opacity: 0 }} animate={{ y: 0, rotate: 4, opacity: 1 }} transition={{ type: 'spring', stiffness: 120, damping: 16 }} className="hidden h-[300px] md:block">
            <ProductArt type={cat.art} color="#4F5E47" bg={false} className="h-full w-full drop-shadow-[0_30px_30px_rgba(34,33,31,0.2)]" label={`${cat.name} illustration`} />
          </motion.div>
        </div>
      </section>
      <div className="container-x mb-8 scrollbar-none flex gap-2 overflow-x-auto">
        {categories.map((c) => <Link key={c.slug} to={`/category/${c.slug}`} className={`chip shrink-0 ${c.slug === slug ? 'chip-active' : ''}`} aria-current={c.slug === slug ? 'page' : undefined}>{c.name}</Link>)}
      </div>
      <Catalogue key={slug} base={cat.filter} hideCategory={hideCategory} />
    </div>
  );
}
