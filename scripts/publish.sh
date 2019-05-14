#!/bin/bash

# Check that the .p12 file is in the correct location.
CERT_PATH=~/.certs/penguin.p12
if [ ! -f $CERT_PATH ]; then
  echo "Can't find the .p12 file at $CERT_PATH"
fi

# Check that the folder for the penguin project is still in the right place
PROJECT_PATH=~/Projects/penguin
if [ ! -f $PROJECT_PATH/package.json ]; then
  echo "Can't find the penguin project! Quitting."; exit 1;
fi

# Get the user's password.
echo -n "Please enter the password to decrypt the .p12 file: "
read answer
if [ -z "$answer" ]; then
  echo "No password, quitting abruptly. Lock up your stuff."; exit 1;
fi

# Export the environment variables
export CSC_LINK="file://$CERT_PATH"
export CSC_KEY_PASSWORD=$answer

echo "... Exported ENV variables."

# Now run the build process.
cd $PROJECT_PATH; yarn run dist;