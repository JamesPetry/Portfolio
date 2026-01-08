# Deployment Notes

## Required Assets to Add

### Favicon and App Icons
Before deploying, add the following files to the `public/` directory:

1. **favicon.ico** - Standard favicon (16x16, 32x32, 48x48 sizes)
2. **apple-touch-icon.png** - Apple touch icon (180x180px)
3. **icon-192.png** - PWA icon (192x192px) - Optional
4. **icon-512.png** - PWA icon (512x512px) - Optional

You can generate these using online tools like:
- https://realfavicongenerator.net/
- https://www.favicon-generator.org/

### Open Graph Images (Optional but Recommended)
For better social media sharing:

1. **og-image.png** - Open Graph image (1200x630px recommended)
   - Place in `public/` directory
   - Uncomment the `images` array in `app/layout.tsx` metadata

2. **twitter-image.png** - Twitter card image (1200x600px recommended)
   - Place in `public/` directory
   - Uncomment the `images` array in `app/layout.tsx` metadata

## Environment Variables

After deployment, set the following environment variable in Vercel:

- `NEXT_PUBLIC_SITE_URL` - Your production URL (e.g., `https://yourdomain.com`)
  - Used for sitemap and robots.txt generation
  - Update `app/sitemap.ts` and `app/robots.ts` if not using env variable

## Post-Deployment Checklist

1. ✅ Update `NEXT_PUBLIC_SITE_URL` environment variable in Vercel
2. ✅ Add favicon files to `public/` directory
3. ✅ Uncomment image URLs in metadata (if you add OG images)
4. ✅ Test all routes on production
5. ✅ Verify sitemap.xml is accessible at `/sitemap.xml`
6. ✅ Verify robots.txt is accessible at `/robots.txt`
7. ✅ Test social media sharing (if OG images added)
8. ✅ Check mobile responsiveness
9. ✅ Test 3D model loading
10. ✅ Verify all images load correctly

## Build and Test Locally

Before deploying, test the production build:

```bash
npm run build
npm start
```

Then visit `http://localhost:3000` to verify everything works.
