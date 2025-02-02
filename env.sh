#!/bin/sh

echo "Injecting environment variables into static files..."

# Loop through all environment variables prefixed with VITE_
for i in $(env | grep VITE_)
do
    key=$(echo $i | cut -d '=' -f 1)
    value=$(echo $i | cut -d '=' -f 2-)

    echo "Replacing: $key=$value"

    # Replace occurrences of VITE_ variables in JS files
    find /usr/share/nginx/html -type f -name '*.js' -exec sed -i "s|${key}|${value}|g" '{}' +
done

echo "Environment variables injection complete!"