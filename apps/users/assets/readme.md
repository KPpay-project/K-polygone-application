# K-Polygon Assets

This repository contains shared assets for the K-Polygon project, including icons and reusable UI components.

## Installation

This package is used as a local dependency in the web-user project:

```json
{
  "dependencies": {
    "k-polygon-assets": "file:../k-pay-assets"
  }
}
```

## Usage

### Organized Imports (Recommended)

The assets package supports organized imports for better code organization:

#### Icons

```tsx
import { IconUser, IconWallet } from 'k-polygon-assets/icons';

function MyComponent() {
  return (
    <div>
      <IconUser className="w-6 h-6" />
      <IconWallet className="w-8 h-8" />
    </div>
  );
}
```

#### Components

```tsx
import { Button, Input, Select, Form } from 'k-polygon-assets/components';

function MyForm() {
  return (
    <Form>
      <FormField name="email">
        <FormItem>
          <FormLabel className="!text-black">Email</FormLabel>
          <FormControl>
            <Input type="email" placeholder="Enter your email" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <Button type="submit">Submit</Button>
    </Form>
  );
}
```

#### Utils

```tsx
import { cn } from 'k-polygon-assets/utils';

function MyComponent({ className }: { className?: string }) {
  return <div className={cn('base-classes', className)}>Content</div>;
}
```

### Legacy Imports (Still Supported)

You can still import everything from the main package:

```tsx
import { Button, IconUser, cn } from 'k-polygon-assets';
```

## Available Components

### Basic Components

- `Button` - Button component with variants and sizes
- `Input` - Text input component
- `Textarea` - Multi-line text input component
- `Label` - Form label component
- `Skeleton` - Loading skeleton component
- `Separator` - Visual separator component

### Form Components

- `Form` - Form provider component
- `FormField` - Form field wrapper
- `FormItem` - Form item container
- `FormLabel` - Form label
- `FormControl` - Form control wrapper
- `FormDescription` - Form description
- `FormMessage` - Form error message

### Interactive Components

- `Select` - Dropdown select component
- `Toggle` - Toggle button component
- `Tooltip` - Tooltip component

## Development

To build the package:

```bash
npm run build
```

## Dependencies

This package includes the following dependencies:

- React and React DOM types
- Radix UI primitives
- Class Variance Authority
- React Hook Form
- Lucide React icons
- Tailwind utilities (clsx, tailwind-merge)
