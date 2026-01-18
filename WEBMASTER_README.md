# Bing Webmaster API Interface

A modern, beautiful web interface for managing Bing Webmaster API operations including URL indexing, analytics tracking, and site management.

## Features

### 🚀 URL Indexing
- **Single URL Submission**: Submit individual URLs for indexing
- **Bulk Upload**: Upload text files with multiple URLs
- **Real-time Status**: Track submission status with visual feedback
- **Batch Processing**: Automatically handles multiple URLs with rate limiting

### 📊 Analytics Dashboard
- **Traffic Statistics**: View impressions, clicks, and CTR
- **Date Range Selection**: Analyze data for 7, 30, or 90 days
- **Visual Metrics**: Beautiful cards showing key performance indicators
- **Detailed Reports**: Daily breakdown of performance metrics

### 🌐 Site Management
- **Add/Remove Sites**: Manage multiple websites
- **Verification Status**: Track which sites are verified
- **Quick Actions**: Easy access to site management features
- **Verification Guide**: Step-by-step instructions for site verification

## Getting Started

### 1. Get Your API Key

1. Visit [Bing Webmaster Tools](https://www.bing.com/webmasters)
2. Sign in with your Microsoft account
3. Navigate to **Settings** → **API Access**
4. Generate or copy your API key

### 2. Access the Interface

Navigate to `/webmaster` in your application:

```
http://localhost:3000/webmaster
```

### 3. Authenticate

Enter your Bing Webmaster API key in the authentication form.

## Usage

### Submitting URLs for Indexing

1. Go to the **URL Indexing** tab
2. Enter your website URL
3. Add URLs to index (one per line) or upload a text file
4. Click **Submit for Indexing**
5. Monitor the real-time status of each URL

**Example URL list:**
```
https://yoursite.com/page1
https://yoursite.com/page2
https://yoursite.com/blog/article1
```

### Viewing Analytics

1. Go to the **Analytics** tab
2. Enter your website URL
3. Select a date range (7, 30, or 90 days)
4. Click **Fetch Analytics**
5. View summary cards and detailed daily breakdown

### Managing Sites

1. Go to the **Sites** tab
2. Add new sites using the form
3. View verification status for each site
4. Remove sites as needed

## API Integration

The interface uses the Bing Webmaster API endpoints:

- **Submit URL**: `POST /SubmitUrl`
- **Get Traffic Stats**: `POST /GetRankAndTrafficStats`
- **Add Site**: `POST /AddSite`
- **Remove Site**: `POST /RemoveSite`
- **Get Sites**: `GET /GetSites`

### API Client Library

The `lib/webmaster-api.ts` file provides TypeScript functions for all API operations:

```typescript
import { submitUrls, getRankAndTrafficStats, addSite } from '@/lib/webmaster-api';

// Submit URLs
const results = await submitUrls(
  { apiKey: 'YOUR_API_KEY' },
  'https://yoursite.com',
  ['https://yoursite.com/page1', 'https://yoursite.com/page2']
);

// Get analytics
const stats = await getRankAndTrafficStats(
  { apiKey: 'YOUR_API_KEY' },
  'https://yoursite.com',
  new Date('2024-01-01'),
  new Date('2024-01-31')
);

// Add a site
const result = await addSite(
  { apiKey: 'YOUR_API_KEY' },
  'https://newsite.com'
);
```

## Components

### Main Components

- **`WebmasterHeader`**: Navigation and authentication controls
- **`WebmasterDashboard`**: Main dashboard with tabbed interface
- **`IndexingPanel`**: URL submission and status tracking
- **`AnalyticsPanel`**: Traffic statistics and performance metrics
- **`SitesPanel`**: Site management and verification

### File Structure

```
app/webmaster/
├── page.tsx              # Main page component
└── metadata.ts           # SEO metadata

components/webmaster/
├── WebmasterHeader.tsx   # Header component
├── WebmasterDashboard.tsx # Main dashboard
├── IndexingPanel.tsx     # URL indexing interface
├── AnalyticsPanel.tsx    # Analytics dashboard
└── SitesPanel.tsx        # Site management

lib/
└── webmaster-api.ts      # API client library
```

## Design Features

### Modern UI/UX
- **Glassmorphism**: Beautiful frosted glass effects
- **Gradient Backgrounds**: Vibrant purple and blue gradients
- **Smooth Animations**: Framer Motion powered transitions
- **Responsive Design**: Works on all device sizes

### Visual Feedback
- **Loading States**: Animated spinners during API calls
- **Success/Error Indicators**: Color-coded status icons
- **Progress Tracking**: Real-time submission progress
- **Interactive Elements**: Hover effects and micro-animations

## Error Handling

The interface handles common API errors:

- **Invalid API Key**: Clear error message with instructions
- **Rate Limiting**: Automatic delays between requests
- **Network Errors**: Graceful error handling with retry options
- **Validation**: Client-side validation before API calls

## Best Practices

### URL Submission
- Submit URLs in batches of 50-100 for optimal performance
- Wait for previous batch to complete before submitting new ones
- Ensure URLs are properly formatted (include https://)

### Analytics
- Check analytics regularly to track performance trends
- Use appropriate date ranges for your analysis needs
- Export data for further analysis if needed

### Site Management
- Verify sites before submitting URLs for indexing
- Keep your site list organized and up-to-date
- Remove sites you no longer manage

## Troubleshooting

### Common Issues

**Issue**: "Invalid API Key" error
- **Solution**: Verify your API key is correct and active in Bing Webmaster Tools

**Issue**: URLs not being indexed
- **Solution**: Ensure the site is verified and URLs are accessible

**Issue**: No analytics data showing
- **Solution**: Check that the site has been active for the selected date range

## Security

- API keys are stored in component state (client-side only)
- No API keys are logged or stored permanently
- All API calls use HTTPS encryption
- Consider implementing server-side API proxy for production use

## Future Enhancements

Potential features for future versions:

- [ ] Export analytics to CSV/Excel
- [ ] Scheduled URL submissions
- [ ] Email notifications for indexing status
- [ ] Advanced filtering and search
- [ ] Sitemap integration
- [ ] Keyword tracking
- [ ] Competitor analysis

## Support

For issues or questions:
- Check the [Bing Webmaster API Documentation](https://docs.microsoft.com/en-us/dotnet/api/microsoft.bing.webmaster.api.interfaces.iwebmasterapi)
- Review the API error codes and messages
- Ensure your API key has the necessary permissions

## License

This interface is provided as-is for use with the Bing Webmaster API.
