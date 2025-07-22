# XeeList - MyAnimeList Clone

A modern, responsive anime database platform built with vanilla HTML, CSS, and JavaScript, powered by the Jikan API.

## Features

### 🎯 Core Functionality
- **Top Anime of All Time** - Discover the highest-rated anime series
- **Currently Airing** - Stay updated with ongoing anime broadcasts  
- **Trending Now** - Explore the most popular anime this season
- **Advanced Search** - Find anime by title with real-time results
- **Detailed Information** - View comprehensive anime details in modal popups

### 🎨 Design & UX
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **Modern Interface** - Clean, intuitive design inspired by MyAnimeList
- **Smooth Animations** - Hover effects, transitions, and loading states
- **Accessibility** - Keyboard navigation and screen reader friendly
- **Performance Optimized** - Lazy loading images and efficient API calls

### 🛠 Technical Features
- **Vanilla JavaScript** - No frameworks or dependencies
- **Jikan API Integration** - Real-time anime data from MyAnimeList
- **Error Handling** - Graceful fallbacks for API failures
- **Cross-browser Compatible** - Works on all modern browsers
- **SEO Friendly** - Semantic HTML5 structure

## Setup Instructions

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection for API calls
- Local web server (optional but recommended)

### Installation

1. **Clone or Download**
   ```bash
   git clone <repository-url>
   cd XeeList
   ```

2. **Local Development Server (Recommended)**
   
   **Option A: Using Python**
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   ```
   
   **Option B: Using Node.js**
   ```bash
   npx http-server
   ```
   
   **Option C: Using PHP**
   ```bash
   php -S localhost:8000
   ```

3. **Open in Browser**
   - Navigate to `http://localhost:8000`
   - Or simply open `index.html` directly in your browser

## File Structure

```
XeeList/
├── index.html          # Main HTML structure
├── styles.css          # All CSS styling and responsive design
├── script.js           # JavaScript functionality and API integration
└── README.md           # This file
```

## API Integration

### Jikan API
- **Base URL**: `https://api.jikan.moe/v4`
- **Documentation**: [jikan.moe](https://jikan.moe/)
- **Rate Limiting**: 3 requests per second, 60 requests per minute
- **No API Key Required**: Free to use

### Endpoints Used
- `/top/anime` - Top rated anime
- `/seasons/now` - Currently airing anime
- `/anime?order_by=popularity` - Popular anime
- `/anime?q={query}` - Search anime
- `/anime/{id}/full` - Detailed anime information

## Browser Support

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Considerations

- **Image Lazy Loading** - Images load only when needed
- **API Caching** - Reduces redundant API calls
- **Optimized CSS** - Minimal reflows and repaints
- **Compressed Assets** - Efficient loading times

## Customization

### Styling
- Modify `styles.css` to change colors, fonts, and layouts
- CSS custom properties for easy theme customization
- Responsive breakpoints can be adjusted

### Functionality
- Add new sections by extending the `XeeListApp` class
- Implement additional API endpoints
- Add user preferences and local storage

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Use a local web server instead of opening HTML directly
   - Jikan API supports CORS for browser requests

2. **API Rate Limiting**
   - Wait a few seconds between rapid requests
   - Implement request queuing for heavy usage

3. **Images Not Loading**
   - Check internet connection
   - Some anime may not have images available

4. **Search Not Working**
   - Verify API endpoint is accessible
   - Check browser console for error messages

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test across different browsers
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- **Jikan API** - For providing free access to MyAnimeList data
- **MyAnimeList** - Original anime database platform
- **Google Fonts** - Inter font family
- **Pexels** - Hero background images

## Future Enhancements

- [ ] User authentication and personal lists
- [ ] Advanced filtering and sorting options
- [ ] Anime recommendations engine
- [ ] Offline support with service workers
- [ ] Dark/light theme toggle
- [ ] Social features and reviews
- [ ] Progressive Web App (PWA) capabilities

---

**Built with ❤️ for anime enthusiasts**