/**
 * AdSense Ad Slot Component
 * 
 * IMPORTANT AD SENSE POLICIES:
 * - Ads must not be placed near interactive elements (buttons, form controls, navigation)
 * - Maintain minimum spacing (recommended: 150px from form controls)
 * - Prevent accidental clicks by ensuring adequate spacing and clear visual separation
 * - Do not place ads in ways that might confuse users (e.g., near submit buttons)
 * - Ensure ads are clearly distinguishable from content
 * 
 * This component renders:
 * - Development: Placeholder box for visual testing
 * - Production: Div with data attributes ready for AdSense script injection
 * 
 * Note: Actual AdSense script should be loaded separately in the layout or via Next.js Script component
 */

interface AdSlotProps {
  slotId?: string;
  format?: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
  className?: string;
  sticky?: boolean; // For sticky bottom mobile ads
}

export default function AdSlot({
  slotId = 'placeholder',
  format = 'auto',
  className = '',
  sticky = false,
}: AdSlotProps) {
  const isDev = process.env.NODE_ENV === 'development';

  // AdSense format mappings
  const formatMap: Record<string, { width: string; height: string }> = {
    auto: { width: '100%', height: '250px' },
    rectangle: { width: '300px', height: '250px' },
    vertical: { width: '160px', height: '600px' },
    horizontal: { width: '728px', height: '90px' },
  };

  const adFormat = formatMap[format] || formatMap.auto;

  // Development placeholder
  if (isDev) {
    return (
      <div
        className={`
          ${sticky ? 'fixed bottom-0 left-0 right-0 z-40 md:relative md:z-auto' : ''}
          ${className}
        `}
        style={{
          minHeight: sticky ? '100px' : adFormat.height,
          width: sticky ? '100%' : adFormat.width,
          maxWidth: sticky ? '100%' : '100%',
        }}
      >
        <div
          className="
            border-2 border-dashed border-gray-400 
            bg-gray-100 
            flex items-center justify-center
            text-gray-500 text-sm
            p-4
            rounded
          "
          style={{
            minHeight: sticky ? '100px' : adFormat.height,
          }}
        >
          <div className="text-center">
            <div className="font-medium mb-1">Ad Slot Placeholder</div>
            <div className="text-xs">
              {format} ({adFormat.width} × {adFormat.height})
            </div>
            {sticky && <div className="text-xs mt-1">Sticky Bottom (Mobile)</div>}
            {slotId && <div className="text-xs mt-1">ID: {slotId}</div>}
          </div>
        </div>
      </div>
    );
  }

  // Production: Render div with data attributes for AdSense
  // Note: AdSense script should be loaded separately
  return (
    <div
      className={`
        ${sticky ? 'fixed bottom-0 left-0 right-0 z-40 md:relative md:z-auto' : ''}
        ${className}
      `}
      style={{
        minHeight: sticky ? '100px' : adFormat.height,
        width: sticky ? '100%' : adFormat.width,
        maxWidth: sticky ? '100%' : '100%',
      }}
    >
      {/* 
        AdSense ad slot
        Data attributes are set for AdSense script to target this element
        The actual AdSense script should be loaded in the root layout
        
        IMPORTANT: 
        - Replace "ca-pub-XXXXXXXXXXXXXXXX" with your actual AdSense publisher ID
        - Ensure AdSense script is loaded in root layout before these components render
        - Sticky ads should be tested thoroughly to ensure they don't interfere with content
        - Maintain minimum spacing from interactive elements (150px recommended)
      */}
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
          width: '100%',
          height: sticky ? '100px' : adFormat.height,
        }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // Replace with actual publisher ID
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
      {/* 
        AdSense script will automatically push ads to elements with class "adsbygoogle"
        No manual script injection needed in this component
      */}
    </div>
  );
}

