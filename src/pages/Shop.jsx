import Catalogue from '../components/Catalogue';
import DemoNote from '../components/DemoNote';
import { useStore } from '../context/StoreContext';

export default function Shop() {
  const { clothingPhotos, clothingPhotosStatus, clothingPhotosError } = useStore();
  const photoCount = Object.values(clothingPhotos).reduce((count, items) => count + items.length, 0);

  return (
    <div className="pb-10 pt-10">
      <header className="container-x mb-10 grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
        <h1 className="text-mega">Shop all</h1>
        <div className="max-w-xs md:pb-4">
          <p className="text-graphite">Apparel photos are fetched live from DummyJSON’s free clothing API. Product details and offers are sample data.</p>
          <DemoNote className="mt-3">
            {clothingPhotosStatus === 'loading' && 'Loading clothing photos…'}
            {clothingPhotosStatus === 'ready' && `${photoCount} clothing photo sources loaded`}
            {clothingPhotosStatus === 'error' && `Could not load live photos: ${clothingPhotosError} Showing illustrations instead.`}
          </DemoNote>
        </div>
      </header>
      <Catalogue />
    </div>
  );
}
