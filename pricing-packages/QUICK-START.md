# 🚀 Quick Deployment Guide

## Get Started in 3 Steps

### 1️⃣ Upload Files
Upload the entire `pricing-packages` folder to your web server:
```
/your-website/
  └── pricing-packages/
      ├── index.html
      ├── css/
      ├── js/
      └── scss/ (optional)
```

### 2️⃣ Test Locally
Open `index.html` in your browser to verify everything works.

### 3️⃣ Customize (Optional)
- **Quick color change**: Edit variables in `scss/styles.scss` and recompile
- **Content updates**: Edit `index.html` directly
- **Button actions**: Modify enrollment logic in `js/script.js`

## File Paths to Check
Make sure these paths match your setup in `index.html`:
```html
<link rel="stylesheet" href="css/styles.css">
<script src="js/script.js"></script>
```

## Need to Integrate into Existing Site?

### WordPress
1. Go to Appearance → Customizer → Additional CSS
2. Copy contents of `css/styles.css` and paste
3. Create new page, switch to HTML mode
4. Paste contents from `index.html` (body section only)

### Existing HTML Site
1. Copy the pricing section from `index.html`
2. Add the CSS link to your `<head>`:
   ```html
   <link rel="stylesheet" href="path/to/css/styles.css">
   ```
3. Add the JS script before closing `</body>`:
   ```html
   <script src="path/to/js/script.js"></script>
   ```

## Testing Checklist
- [ ] All 4 packages display correctly
- [ ] Delivery method radios work
- [ ] Accordions expand/collapse
- [ ] Enroll buttons respond to clicks
- [ ] Responsive on mobile (test at 375px width)
- [ ] Hover effects work on desktop

## Common Issues & Fixes

**Issue**: Styles not loading
**Fix**: Check CSS file path in HTML, ensure `/css/styles.css` exists

**Issue**: Bootstrap not working
**Fix**: Internet connection required for CDN, or download Bootstrap locally

**Issue**: Accordions not working
**Fix**: Ensure Bootstrap JS is loaded before custom script.js

**Issue**: Fonts look different
**Fix**: Check internet connection - fonts load from Google Fonts CDN

## Performance Tips
- Enable gzip compression on your server
- Add lazy loading if you add images later
- Consider hosting Bootstrap/Font Awesome locally for faster loading

## Ready to Go Live?
1. Test on multiple devices (phone, tablet, desktop)
2. Verify all links work
3. Check browser console for errors
4. Run through user flow (select package → enroll)
5. Deploy! 🎉

---

**Questions?** Check the full README.md or DESIGN-COMPARISON.md for detailed documentation.
