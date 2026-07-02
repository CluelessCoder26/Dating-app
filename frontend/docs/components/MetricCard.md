# MetricCard

## Purpose
A SparkOps component used in administrative or analytical dashboards to display a single key performance indicator (KPI) or metric, often with a trend indicator or small chart.

## Props
- `title` (String): The name of the metric (e.g., "Active Users").
- `value` (String|Number): The main value to display (e.g., "1.2M").
- `trend` (Number, optional): Percentage change (e.g., 5.2 or -1.4).
- `trendDirection` (String, optional): 'up', 'down', or 'neutral'.
- `icon` (ReactNode, optional): An icon representing the metric.
- `chartData` (Array, optional): Tiny sparkline or bar chart data.

## Variants
- `standard`: Simple title, value, and trend.
- `with-chart`: Includes a miniature sparkline below the value.
- `highlighted`: Distinct styling (e.g., primary brand color background) for critical metrics.

## Accessibility
- Uses appropriate heading levels for the title.
- `aria-label` providing context for the trend (e.g., "Increased by 5.2%").
- Clear contrast ratios for text and icons.

## Animations
- Number count-up animation on initial render.
- Hover state slightly elevates the card.

## States
- `loading`: Skeleton state displaying grey bars for title and value.
- `default`: Displaying data.
- `error`: Shows an error icon and generic "Unavailable" text.

## Usage
Used in admin dashboards, analytics reports, and monitoring screens.

## Examples
```jsx
<MetricCard 
  title="Daily Active Users"
  value="124,592"
  trend={12.5}
  trendDirection="up"
  icon={<UsersIcon />}
/>
```

## Related Components
- `DashboardGrid`: Layout component that houses multiple MetricCards.
- `DataChart`: Larger, more detailed chart component.

## Screens Using Component
- Admin Dashboard
- Analytics Overview
- SparkOps Monitoring Console
