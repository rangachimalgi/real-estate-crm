#!/bin/bash

# Real Estate CRM Android Runner Script

echo "🤖 Running Real Estate CRM on Android..."

# Set Java 17 for Android compatibility
export JAVA_HOME=/opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home
export PATH="/opt/homebrew/opt/openjdk@17/bin:$PATH"

echo "✅ Java 17 configured"

# Run Android app
echo "📱 Building and installing on Android..."
npm run android 