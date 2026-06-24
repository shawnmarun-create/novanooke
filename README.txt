NOVA NOOK ESSENCE — Standalone Static Website
==============================================

Open `index.html` in any modern browser. That's it.

FOLDER STRUCTURE
----------------
  index.html        Home (hero video + slideshow + shop-by-gender)
  shop.html         Full catalog with filters
  product.html      Product detail (?id=…)
  cart.html         Cart + checkout form (emails you the order)
  about.html        Brand story
  contact.html      Contact form
  thank-you.html    Order confirmation
  css/styles.css
  js/app.js         Cart, filters, animations, checkout
  js/products.js    Scraped catalog of 57 fragrances
  assets/
    logo/           Brand logo + favicon (scraped from novanookessence.com)
    products/       Product photos (scraped)
    hero/           Hero video + AI-generated luxury hero stills
    icons/          (reserved)

SETUP: ORDER NOTIFICATIONS (5 MINUTES)
--------------------------------------
The cart sends orders to shawnmarun@gmail.com via Web3Forms.
You need a free Web3Forms access key:

  1. Go to https://web3forms.com
  2. Enter shawnmarun@gmail.com
  3. Copy your Access Key (it looks like e1bb...long-uuid)
  4. Open EVERY .html file in this folder and find:
        window.WEB3FORMS_KEY="YOUR_WEB3FORMS_KEY_HERE";
     Replace with:
        window.WEB3FORMS_KEY="paste-your-key-here";

  (Or use Find & Replace across all files at once.)

After that, every order placed on cart.html will arrive in
your inbox at shawnmarun@gmail.com, with name, address,
phone, full item list, and grand total.

DEPLOYMENT
----------
Drop this whole `site/` folder onto:
  - Netlify (drag-and-drop on app.netlify.com)
  - Vercel
  - GitHub Pages
  - Any web host with static hosting
No build step. No server. No database.

CUSTOMIZING
-----------
- Colors / fonts: edit the top of `css/styles.css` (the :root block)
- Products: edit `js/products.js` (a plain JS array)
- Brand name / logo: edit the <header> in each .html file and replace
  files in assets/logo/

CREDITS
-------
- Product data + product photos scraped from novanookessence.com
- Brand logo + social links from novanookessence.com
- Hero video & lifestyle imagery: AI-generated for this build
