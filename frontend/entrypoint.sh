#!/bin/sh

# Replace placeholders in Next.js build files with actual server env values
# Example for API URL
if [ -n "$NEXT_PUBLIC_API_URL" ]; then
  echo "Injecting NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL"
  find .next -type f -name "*.js" -exec sed -i "s|NEXT_PUBLIC_API_URL_PLACEHOLDER|$NEXT_PUBLIC_API_URL|g" {} +
fi

# Start Next.js
exec npm start
