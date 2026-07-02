# DataTable

## Purpose
Displays tabular data with support for sorting, filtering, pagination, and row actions. Ideal for managing lists of users, reports, or transactions in the back-office or user settings.

## Props
- `columns` (Array): Definitions for table columns (key, header label, render function).
- `data` (Array): The array of objects representing rows.
- `sortable` (Boolean): Enables sorting on column headers.
- `pagination` (Object): Pagination state and callbacks (currentPage, totalPages, onChange).
- `onRowClick` (Function, optional): Action when a row is clicked.
- `isLoading` (Boolean): Whether data is currently being fetched.

## Variants
- `default`: Standard table with borders.
- `compact`: Reduced padding for dense data display.
- `striped`: Alternating row background colors.

## Accessibility
- Uses native `<table>`, `<thead>`, `<tbody>`, `<tr>`, `<th>`, and `<td>` elements.
- `aria-sort` attributes on headers.
- Keyboard navigation between rows and pagination controls.
- Screen reader announcements for sorting changes.

## Animations
- Fade transition when data updates or paginates.
- Hover highlight on rows.

## States
- `loading`: Displays skeleton rows or a loading spinner overlay.
- `empty`: Displays an empty state message/illustration when `data` is empty.
- `error`: Displays error message if data fetch fails.
- `default`: Standard data display.

## Usage
Used for lists of entities requiring structured display and bulk interaction.

## Examples
```jsx
<DataTable 
  columns={[
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'status', label: 'Status' }
  ]}
  data={[
    { id: 1, name: 'John Doe', status: 'Active' },
    { id: 2, name: 'Jane Smith', status: 'Pending' }
  ]}
  sortable={true}
/>
```

## Related Components
- `Pagination`: Used at the bottom of the table.
- `TableFilterBar`: A bar above the table for global search or complex filters.
- `ActionMenu`: Dropdown menu for row-level actions.

## Screens Using Component
- User Management List
- Transaction History
- Reports List
