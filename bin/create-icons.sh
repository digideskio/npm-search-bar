#!/bin/bash
# For Mac OS X El Capitan
# You will need Imagemagick installed
# brew install imagemagick

# Usage (assuming your are in the root of this project)
# bin/create-icons.sh temp my-png-with-no-extension iconset-output-filename

# Local Variables
iconsetname="$2.iconset"

echo -e '\nGenerating scaffolding...\n'

mkdir -p $1
cd $1
mkdir -p $iconsetname
cd $iconsetname

echo -e '\nConverting images...\n'
convert -resize 16x16 ../../$2.png icon_16x16.png
convert -resize 32x32 ../../$2.png icon_16x16@2x.png
convert -resize 32x32 ../../$2.png icon_32x32.png
convert -resize 64x64 ../../$2.png icon_32x32@2x.png
convert -resize 128x128 ../../$2.png icon_128x128.png
convert -resize 256x256 ../../$2.png icon_128x128@2x.png
convert -resize 256x256 ../../$2.png icon_256x256.png
convert -resize 512x512 ../../$2.png icon_256x256@2x.png
convert -resize 512x512 ../../$2.png icon_512x512.png
convert -resize 1024x1024 ../../$2.png icon_512x512@2x.png
cd ..
echo -e '\nConverting to .icns...\n'
iconutil -c icns $2.iconset
mv $2.icns ../$3.icns
cd ..
rm -rf $1
echo -e '\nDone!\n'

# Navigate to your application in Finder.
# Right click or Control click and select Show Package Contents.
# Select Contents->Resources
# Find the icns file, and back it up.
# Replace the icns file with yours be careful to preserve the case of the name.
# Restart Finder and the Dock by logging out and coming back in or in a terminal: 
# killall Dock; killall Finder