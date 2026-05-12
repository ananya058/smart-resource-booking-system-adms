# Adding Images to FSET Booking System

## Folder Structure

```
updted_project/
├── images/
│   ├── slideshow/     (Carousel images for homepage)
│   └── gallery/       (Gallery images for about section)
```

## How to Add Images

### 1. **Slideshow Images** (Homepage Carousel)
- Location: `images/slideshow/`
- Purpose: Display as rotating slideshow on homepage
- Recommended specs:
  - Size: 1920x1080px or similar widescreen ratio
  - Format: PNG, JPG, JPEG, GIF, WebP
  - Multiple images will auto-rotate every 5 seconds

**Steps:**
1. Prepare your USTC campus/building images
2. Save them to `images/slideshow/` folder
3. Name them sequentially: `1.jpg`, `2.jpg`, `3.jpg`, etc.
4. Restart the Flask server
5. Refresh the browser to see the slideshow

**Example files:**
- `images/slideshow/1.jpg` - Campus entrance
- `images/slideshow/2.jpg` - Building view
- `images/slideshow/3.jpg` - Faculty area

### 2. **Gallery Images** (About Section)
- Location: `images/gallery/`
- Purpose: Display in photo gallery grid on About page
- Recommended specs:
  - Size: 600x600px or square format
  - Format: PNG, JPG, JPEG, GIF, WebP
  - Multiple images will be displayed in a responsive grid

**Steps:**
1. Prepare your USTC event/lab/classroom photos
2. Save them to `images/gallery/` folder
3. Name them: `photo1.jpg`, `photo2.jpg`, etc.
4. Restart the Flask server
5. Go to About section to see the gallery

**Example files:**
- `images/gallery/campus.jpg` - Campus view
- `images/gallery/lab.jpg` - Laboratory
- `images/gallery/classroom.jpg` - Classroom
- `images/gallery/event.jpg` - Faculty event
- `images/gallery/library.jpg` - Library
- `images/gallery/auditorium.jpg` - Auditorium

## How It Works

1. When you open the homepage, it loads images from `images/slideshow/`
2. Images are automatically detected and added to the carousel
3. The About section loads images from `images/gallery/` and displays them in a grid
4. Images are loaded via API endpoints:
   - `/api/slideshow-images` - Returns slideshow images
   - `/api/gallery-images` - Returns gallery images

## Image Format Support

✅ Supported formats:
- `.jpg` / `.jpeg`
- `.png`
- `.gif`
- `.webp`

## Tips

- **Slideshow Images**: Should be horizontal/landscape (wider than tall)
- **Gallery Images**: Can be any size, but square works best
- **File Names**: Use simple names without special characters
- **Organize**: Add images before starting the server for best results
- **Mobile**: Images are responsive and will resize for mobile devices

## Fallback Behavior

If no images are found in the folders, the app will display:
- **Slideshow**: Colored gradient backgrounds with placeholder text
- **Gallery**: Icon placeholders (camera, building, lab, etc.)

This ensures the app always displays something even if images aren't added yet.
