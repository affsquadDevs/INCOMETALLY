/**
 * Breadcrumb JSON-LD schema generation
 */

export interface BreadcrumbItem {
  name: string;
  url: string;
}

/**
 * Generate JSON-LD structured data for BreadcrumbList schema
 */
export function generateBreadcrumbJsonLd(items: BreadcrumbItem[]): string {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return JSON.stringify(breadcrumbSchema, null, 2);
}
