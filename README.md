
## 🔌 API Endpoints

### POST `/api/analyze-audio`

Processes uploaded audio files and returns AI analysis.

**Request Body:**
```json
{
  "audioData": "base64_encoded_audio_data",
  "mimeType": "audio/mpeg"
}
```

**Response:**
```json
{
  "scores": {
    "clarity": 0.85,
    "pace": 0.78,
    "engagement": 0.92
  },
  "overallFeedback": "Your speech demonstrates excellent clarity...",
  "observation": "Transcript and detailed analysis..."
}
```

## 🎨 Customization

### Styling

The application uses CSS Modules for component-specific styling:
- `styles.module.css` files for component styles
- Global styles in `style.css`
- Responsive design with mobile-first approach
- Dark mode support via CSS custom properties

### Adding New Features

1. Create new components in `src/app/components/`
2. Follow the existing folder structure pattern
3. Include both `index.tsx` and `styles.module.css`
4. Import and use in the main page component

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to a Git repository
2. Connect your repository to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push

### Other Platforms

The application can be deployed on any platform supporting Node.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

### Environment Variables for Production

Ensure these variables are set in your production environment:
```env
NEXT_PUBLIC_DEEPGRAM_API_KEY=your_production_api_key
```

## 🐛 Troubleshooting

### Common Issues

**Audio upload not working:**
- Check file format (MP3 or WAV only)
- Verify file size limits
- Ensure stable internet connection

**API errors:**
- Verify Deepgram API key is correct
- Check API key permissions and quota
- Ensure environment variables are properly set

**Build errors:**
- Run `npm install` to ensure all dependencies are installed
- Check TypeScript errors with `npm run type-check`
- Verify Next.js version compatibility

### Debug Mode

Enable debug logging by adding to your `.env.local`:
```env
NODE_ENV=development
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Use TypeScript for all new code
- Follow existing naming conventions
- Add proper type definitions
- Include appropriate error handling
- Write meaningful commit messages

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Deepgram](https://deepgram.com/) for providing advanced speech recognition API
- [Next.js](https://nextjs.org/) for the robust React framework
- [Vercel](https://vercel.com/) for deployment platform

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check existing documentation
- Review Deepgram API documentation for audio-related issues

---

**Built with ❤️ using Next.js and AI technology**
