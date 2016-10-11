#!/bin/bash
# Zip up all the folders in the `out` directory
cd out
for i in *
do
[ -d "$i" ] && zip -r "$i.zip" "$i"
done
echo -e '\nDone zipping!\n'