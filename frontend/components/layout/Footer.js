export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12 px-4 mt-auto">
      <div className="max-w-6xl mx-auto grid grid-cols-3 gap-8">
        <div>
          <h3 className="text-white font-bold text-lg mb-3">ShopSphere</h3>
          <p className="text-sm leading-relaxed">
            A lightweight e-commerce platform built for small retailers
            who need an affordable alternative to complex SaaS solutions.
          </p>
        </div>
        <div>
          <h4 className="text-white font-medium mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="/products" className="hover:text-white transition-colors">Products</a></li>
            <li><a href="/checkout" className="hover:text-white transition-colors">Checkout</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-medium mb-3">Contact</h4>
          <ul className="space-y-2 text-sm">
            <li>support@shopsphere.dev</li>
            <li>1-800-SHOP-NOW</li>
          </ul>
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-8 pt-8 border-t border-gray-800 text-center text-sm">
        © {new Date().getFullYear()} ShopSphere. All rights reserved.
      </div>
    </footer>
  );
}