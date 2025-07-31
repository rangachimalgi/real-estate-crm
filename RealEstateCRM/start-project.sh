#!/bin/bash

# Real Estate CRM React Native Project Startup Script

echo "🚀 Starting Real Estate CRM React Native Project..."

# Set Java 17 for Android compatibility
export JAVA_HOME=/opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home
export PATH="/opt/homebrew/opt/openjdk@17/bin:$PATH"

echo "✅ Java 17 configured"

# Start Metro bundler
echo "📱 Starting Metro bundler..."
npm start 