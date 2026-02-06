import { MetadataRoute } from 'next';
import { getCentres, getNormalizedActivities } from '@/lib/api/endpoints';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  try {
    // Fetch dynamic routes
    const [centres, activities] = await Promise.all([
      getCentres(),
      getNormalizedActivities(),
    ]);

    const centreUrls = centres.map((centre) => ({
      url: `${baseUrl}/centres/${centre.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    const activityUrls = activities.map((activity) => ({
      url: `${baseUrl}/activities/${encodeURIComponent(activity.name)}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
      {
        url: `${baseUrl}/activities`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
      ...centreUrls,
      ...activityUrls,
    ];
  } catch (error) {
    // If API fails, return static routes only
    if (process.env.NODE_ENV === 'development') {
      console.error("Error generating sitemap:", error);
    }
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
      {
        url: `${baseUrl}/activities`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
    ];
  }
}
